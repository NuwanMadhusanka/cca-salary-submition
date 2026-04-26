package com.salary.transparency.stats.repository;

import com.salary.transparency.stats.entity.SalarySubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SalaryStatsRepository extends JpaRepository<SalarySubmission, Long> {

    @Query(value = """
        SELECT
            COUNT(*) as sampleSize,
            MIN(total_compensation) as minSalary,
            MAX(total_compensation) as maxSalary,
            AVG(total_compensation) as avgSalary,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_compensation) as median,
            PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_compensation) as p25,
            PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_compensation) as p75,
            PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY total_compensation) as p90
        FROM salary.salary_submissions
        WHERE status = 'APPROVED'
          AND (:role IS NULL OR LOWER(job_title) LIKE LOWER(CONCAT('%', :role, '%')))
          AND (:country IS NULL OR LOWER(country) = LOWER(:country))
          AND (:company IS NULL OR company = :company)
          AND (:experienceLevel IS NULL OR experience_level = :experienceLevel)
        """, nativeQuery = true)
    Map<String, Object> getAggregatedStats(
            @Param("role") String role,
            @Param("country") String country,
            @Param("company") String company,
            @Param("experienceLevel") String experienceLevel);

    @Query(value = """
        SELECT
            TO_CHAR(grp.period_bucket, 'YYYY-MM') as period,
            AVG(grp.total_compensation) as avgSalary,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY grp.total_compensation) as median,
            COUNT(*) as sampleSize
        FROM (
            SELECT total_compensation, DATE_TRUNC(:period, created_at) as period_bucket
            FROM salary.salary_submissions
            WHERE status = 'APPROVED'
              AND (:role IS NULL OR LOWER(job_title) LIKE LOWER(CONCAT('%', :role, '%')))
              AND (:company IS NULL OR company = :company)
              AND (:country IS NULL OR LOWER(country) = LOWER(:country))
        ) grp
        GROUP BY grp.period_bucket
        ORDER BY grp.period_bucket
        """, nativeQuery = true)
    List<Map<String, Object>> getTrends(
            @Param("period") String period,
            @Param("role") String role,
            @Param("company") String company,
            @Param("country") String country);
}
