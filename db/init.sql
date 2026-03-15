-- =============================================================================
-- db/init.sql
-- Tech Salary Transparency Platform — Master Database Initialisation
-- Assembled by M1 (Infra/DevOps)
--
-- Run against: salarydb (single PostgreSQL instance)
-- Three logical schemas (assessment requirement):
--   identity  → users, refresh_tokens          (M3 — Identity Service)
--   salary    → salary_submissions              (M2 — Salary + Stats Service)
--   community → votes, vote_counts              (M4 — Vote Service)
--
-- CRITICAL rules enforced here:
--   ✓ No email column in salary.salary_submissions
--   ✓ No user_id column in salary.salary_submissions
--   ✓ Passwords in identity.users are BCrypt hashes only
--   ✓ Approval threshold: net upvotes (upvotes - downvotes) >= 3
-- =============================================================================

-- =============================================================================
-- SCHEMAS
-- =============================================================================
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS salary;
CREATE SCHEMA IF NOT EXISTS community;

-- =============================================================================
-- SCHEMA: identity
-- Owner: M3 (Identity Service — Spring Boot, port 8082)
-- Tables: users, refresh_tokens
-- Java service uses: spring.jpa.properties.hibernate.default_schema=identity
-- =============================================================================

CREATE TABLE IF NOT EXISTS identity.users (
    id          BIGSERIAL    PRIMARY KEY,
    username    VARCHAR(50)  UNIQUE NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,   -- stored ONLY in identity schema
    password    VARCHAR(255) NOT NULL,           -- BCrypt hash — never plain text
    first_name  VARCHAR(50),
    last_name   VARCHAR(50),
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    last_login  TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_identity_users_email    ON identity.users (email);
CREATE INDEX IF NOT EXISTS idx_identity_users_username ON identity.users (username);
CREATE INDEX IF NOT EXISTS idx_identity_users_active   ON identity.users (is_active);

CREATE OR REPLACE FUNCTION identity.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON identity.users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON identity.users
    FOR EACH ROW EXECUTE FUNCTION identity.fn_set_updated_at();

-- JWT refresh tokens (optional — enables token revocation)
CREATE TABLE IF NOT EXISTS identity.refresh_tokens (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES identity.users (id) ON DELETE CASCADE,
    token      VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP    NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    revoked    BOOLEAN      DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_identity_refresh_user  ON identity.refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_identity_refresh_token ON identity.refresh_tokens (token);

-- =============================================================================
-- SCHEMA: salary
-- Owner: M2 (Salary Submission + Stats — Spring Boot, port 8081 / 8085)
-- Table: salary_submissions
-- Java service uses: spring.jpa.properties.hibernate.default_schema=salary
-- =============================================================================

CREATE TABLE IF NOT EXISTS salary.salary_submissions (
    id                  BIGSERIAL    PRIMARY KEY,

    -- Job information
    company             VARCHAR(100) NOT NULL,
    job_title           VARCHAR(100) NOT NULL,

    -- Location
    location            VARCHAR(100),
    country             VARCHAR(50),
    city                VARCHAR(50),

    -- Experience
    years_of_experience INTEGER      CHECK (years_of_experience >= 0),
    experience_level    VARCHAR(20)  CHECK (experience_level IN
                            ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD')),

    -- Compensation (LKR default — Sri Lanka platform)
    base_salary         DECIMAL(12,2) NOT NULL CHECK (base_salary >= 0),
    bonus               DECIMAL(12,2) DEFAULT 0 CHECK (bonus >= 0),
    stock_options       DECIMAL(12,2) DEFAULT 0 CHECK (stock_options >= 0),
    other_compensation  DECIMAL(12,2) DEFAULT 0 CHECK (other_compensation >= 0),
    total_compensation  DECIMAL(12,2) GENERATED ALWAYS AS
                            (base_salary + bonus + stock_options + other_compensation) STORED,
    currency            VARCHAR(10)  DEFAULT 'LKR',
    employment_type     VARCHAR(20)  DEFAULT 'Full-time',

    -- Privacy flag — if TRUE the Search Service hides the company name
    anonymize           BOOLEAN      DEFAULT FALSE,

    -- Community approval workflow
    status              VARCHAR(20)  DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    upvotes             INTEGER      DEFAULT 0,
    downvotes           INTEGER      DEFAULT 0,

    -- Timestamps
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    approved_at         TIMESTAMP

    -- NO email column — privacy by design
    -- NO user_id column — anonymity by design
);

-- Indexes for Search and Stats queries
CREATE INDEX IF NOT EXISTS idx_salary_company    ON salary.salary_submissions (company);
CREATE INDEX IF NOT EXISTS idx_salary_job_title  ON salary.salary_submissions (job_title);
CREATE INDEX IF NOT EXISTS idx_salary_country    ON salary.salary_submissions (country);
CREATE INDEX IF NOT EXISTS idx_salary_exp_level  ON salary.salary_submissions (experience_level);
CREATE INDEX IF NOT EXISTS idx_salary_status     ON salary.salary_submissions (status);
CREATE INDEX IF NOT EXISTS idx_salary_created_at ON salary.salary_submissions (created_at DESC);

-- Partial index — only APPROVED rows (most queried by search + stats)
CREATE INDEX IF NOT EXISTS idx_salary_approved   ON salary.salary_submissions
    (country, experience_level, total_compensation)
    WHERE status = 'APPROVED';

-- Full-text search index for company + job title
CREATE INDEX IF NOT EXISTS idx_salary_fts ON salary.salary_submissions
    USING gin (to_tsvector('english', company || ' ' || job_title));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION salary.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON salary.salary_submissions;
CREATE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON salary.salary_submissions
    FOR EACH ROW EXECUTE FUNCTION salary.fn_set_updated_at();

-- Auto-set approved_at when status changes to APPROVED
CREATE OR REPLACE FUNCTION salary.fn_set_approved_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status IS DISTINCT FROM 'APPROVED' THEN
        NEW.approved_at = CURRENT_TIMESTAMP;
    ELSIF NEW.status <> 'APPROVED' THEN
        NEW.approved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submissions_approved_at ON salary.salary_submissions;
CREATE TRIGGER trg_submissions_approved_at
    BEFORE UPDATE ON salary.salary_submissions
    FOR EACH ROW EXECUTE FUNCTION salary.fn_set_approved_at();

-- =============================================================================
-- SCHEMA: community
-- Owner: M4 (Vote Service — Node.js, port 8083)
-- Tables: votes, vote_counts
-- Node.js service uses: SET search_path TO community
-- =============================================================================

CREATE TABLE IF NOT EXISTS community.votes (
    id            BIGSERIAL   PRIMARY KEY,
    submission_id BIGINT      NOT NULL,    -- references salary.salary_submissions(id)
    user_id       BIGINT      NOT NULL,    -- references identity.users(id)
    vote_type     VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (submission_id, user_id)        -- one vote per user per submission
);

CREATE INDEX IF NOT EXISTS idx_community_votes_submission ON community.votes (submission_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_user       ON community.votes (user_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_type       ON community.votes (vote_type);

-- Aggregated vote counts per submission (avoids full table scans)
CREATE TABLE IF NOT EXISTS community.vote_counts (
    submission_id  BIGINT    PRIMARY KEY,
    upvote_count   INTEGER   DEFAULT 0,
    downvote_count INTEGER   DEFAULT 0,
    net_score      INTEGER   DEFAULT 0,    -- upvotes - downvotes
    is_approved    BOOLEAN   DEFAULT FALSE,
    approved_at    TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger: recalculate vote_counts and push APPROVED status to salary schema
-- Approval threshold: net upvotes (upvotes - downvotes) >= 3 (assessment rule)
CREATE OR REPLACE FUNCTION community.fn_update_vote_counts()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_sid    BIGINT;
    v_up     INTEGER;
    v_down   INTEGER;
    v_net    INTEGER;
BEGIN
    v_sid := COALESCE(NEW.submission_id, OLD.submission_id);

    SELECT
        COUNT(*) FILTER (WHERE vote_type = 'upvote'),
        COUNT(*) FILTER (WHERE vote_type = 'downvote')
    INTO v_up, v_down
    FROM community.votes
    WHERE submission_id = v_sid;

    v_net := v_up - v_down;

    -- Upsert aggregated counts
    INSERT INTO community.vote_counts
        (submission_id, upvote_count, downvote_count, net_score)
    VALUES
        (v_sid, v_up, v_down, v_net)
    ON CONFLICT (submission_id) DO UPDATE SET
        upvote_count   = v_up,
        downvote_count = v_down,
        net_score      = v_net,
        updated_at     = CURRENT_TIMESTAMP;

    -- Assessment rule: approve when net upvotes >= 3
    IF v_net >= 3 THEN
        UPDATE community.vote_counts
        SET is_approved = TRUE,
            approved_at = CURRENT_TIMESTAMP
        WHERE submission_id = v_sid
          AND is_approved = FALSE;

        UPDATE salary.salary_submissions
        SET status    = 'APPROVED',
            upvotes   = v_up,
            downvotes = v_down
        WHERE id     = v_sid
          AND status = 'PENDING';
    ELSE
        -- Keep upvote/downvote counts current even below threshold
        UPDATE salary.salary_submissions
        SET upvotes   = v_up,
            downvotes = v_down
        WHERE id = v_sid;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_vote_counts ON community.votes;
CREATE TRIGGER trg_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON community.votes
    FOR EACH ROW EXECUTE FUNCTION community.fn_update_vote_counts();

-- Auto-update votes.updated_at
CREATE OR REPLACE FUNCTION community.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_votes_updated_at ON community.votes;
CREATE TRIGGER trg_votes_updated_at
    BEFORE UPDATE ON community.votes
    FOR EACH ROW EXECUTE FUNCTION community.fn_set_updated_at();

-- =============================================================================
-- VERIFICATION
-- =============================================================================
\echo ''
\echo '===== Schemas created ====='
\dn

\echo ''
\echo '===== identity tables ====='
\dt identity.*

\echo ''
\echo '===== salary tables ====='
\dt salary.*

\echo ''
\echo '===== community tables ====='
\dt community.*
