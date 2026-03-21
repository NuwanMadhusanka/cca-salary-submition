# Salary Submission Service

A microservice for handling anonymous salary data submissions with automatic anonymization for privacy protection.

## Docker

```bash
docker pull nuwan1998/salary-submission-service:latest
```


## Tech Stack

- Java 21 / Spring Boot 3.2.2
- PostgreSQL
- Maven

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+
- PostgreSQL 12+

### Run Locally

1. Configure environment variables by copying `.env.example` to `.env` and filling in your values.

2. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The service starts on `http://localhost:8080`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_NAME | Database name | salary_submission_db |
| DATABASE_USER | Database user | postgres |
| DATABASE_PASSWORD | Database password | - |
| SERVICE_PORT | Application port | 8080 |

## API

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary-submissions/health` | Health check |
| POST | `/salary-submissions` | Submit salary data |
| GET | `/salary-submissions/{id}` | Get submission by ID |

Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## Features

- Anonymous submissions (no auth required)
- Auto-anonymization: salaries rounded to nearest 10,000, experience generalized into buckets, PII sanitized
- Experience level mapping: ENTRY / JUNIOR / MID / SENIOR / LEAD
- Multi-currency support
