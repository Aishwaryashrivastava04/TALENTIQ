-- ============================================================================
-- SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
-- SUBJECT 4: RDBMS - RELATIONAL SCHEMA (MySQL 8.4 LTS)
-- Database Normalization: 1NF, 2NF, 3NF compliant
-- ============================================================================

CREATE DATABASE IF NOT EXISTS smart_recruitment_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE smart_recruitment_db;

-- Disable foreign key checks during schema construction
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS email_verification_tokens;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. TABLE: users
-- Purpose: Authentication & Role-Based Access Control (Admin, HR Manager, Candidate)
-- Normalization: 3NF - No transitive dependencies.
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    role ENUM('ADMIN', 'HR_MANAGER', 'CANDIDATE', 'RECRUITER') NOT NULL DEFAULT 'HR_MANAGER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. TABLE: password_reset_tokens
-- Purpose: Cryptographically secure hashed tokens for password reset workflow.
-- Security: Stores ONLY SHA-256 hash of tokens with 15-minute expiration.
-- ----------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_prt_token (token_hash),
    INDEX idx_prt_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. TABLE: email_verification_tokens
-- Purpose: Email address verification tokens.
-- ----------------------------------------------------------------------------
CREATE TABLE email_verification_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evt_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_evt_token (token_hash),
    INDEX idx_evt_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. TABLE: candidates
-- Purpose: Master relational profile of job applicants.
-- Cross-DB Link: candidate_code links relational records with MongoDB documents.
-- Normalization: 3NF - Non-key attributes fully dependent on candidate_id.
-- ----------------------------------------------------------------------------
CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_code VARCHAR(32) NOT NULL UNIQUE,
    user_id INT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    experience_years DECIMAL(4, 1) NOT NULL DEFAULT 0.0 CHECK (experience_years >= 0),
    education_level ENUM('DIPLOMA', 'BCA', 'BSC_CS', 'BTECH', 'MCA', 'MTECH', 'PHD') NOT NULL,
    current_salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00 CHECK (current_salary >= 0),
    expected_salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00 CHECK (expected_salary >= 0),
    location VARCHAR(80) NOT NULL,
    status ENUM('AVAILABLE', 'IN_PROCESS', 'HIRED', 'ARCHIVED') NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidates_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_candidates_code (candidate_code),
    INDEX idx_candidates_email (email),
    INDEX idx_candidates_experience (experience_years),
    INDEX idx_candidates_education (education_level),
    INDEX idx_candidates_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. TABLE: jobs
-- Purpose: Open job vacancies published by HR.
-- Normalization: 3NF - Clean separation of job definitions from applications.
-- ----------------------------------------------------------------------------
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_code VARCHAR(32) NOT NULL UNIQUE,
    created_by_user_id INT NULL,
    title VARCHAR(120) NOT NULL,
    department VARCHAR(80) NOT NULL,
    job_role VARCHAR(80) NOT NULL,
    min_experience DECIMAL(4, 1) NOT NULL DEFAULT 0.0,
    max_experience DECIMAL(4, 1) NOT NULL,
    min_salary DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    max_salary DECIMAL(12, 2) NOT NULL,
    location VARCHAR(80) NOT NULL,
    company_size ENUM('STARTUP', 'MID_SIZE', 'ENTERPRISE') NOT NULL DEFAULT 'MID_SIZE',
    status ENUM('OPEN', 'INTERVIEWING', 'FILLED', 'ON_HOLD', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_user FOREIGN KEY (created_by_user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_job_experience CHECK (max_experience >= min_experience),
    CONSTRAINT chk_job_salary CHECK (max_salary >= min_salary),
    INDEX idx_jobs_code (job_code),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_role (job_role),
    INDEX idx_jobs_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. TABLE: skills
-- Purpose: Master dictionary of standardized technical skills.
-- Normalization: 3NF - Eliminates repeating text skill groups.
-- ----------------------------------------------------------------------------
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(60) NOT NULL UNIQUE,
    category ENUM('PROGRAMMING_LANGUAGE', 'FRAMEWORK', 'DATABASE', 'CLOUD_DEVOPS', 'AI_ML', 'TOOLS_OTHER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skills_category (category),
    INDEX idx_skills_name (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TABLE: candidate_skills (Bridge / Associative Entity)
-- Purpose: Many-to-Many relationship between Candidates and Skills.
-- Normalization: Resolves M:N relation, composite PK (candidate_id, skill_id).
-- ----------------------------------------------------------------------------
CREATE TABLE candidate_skills (
    candidate_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
    years_experience DECIMAL(4, 1) NOT NULL DEFAULT 1.0,
    PRIMARY KEY (candidate_id, skill_id),
    CONSTRAINT fk_cs_candidate FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cs_skill FOREIGN KEY (skill_id) 
        REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_cs_proficiency (proficiency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. TABLE: applications
-- Purpose: Tracks candidate applications submitted for specific job openings.
-- Normalization: 3NF - Captures state transitions and matching score.
-- ----------------------------------------------------------------------------
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_code VARCHAR(32) NOT NULL UNIQUE,
    candidate_id INT NOT NULL,
    job_id INT NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    match_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00 CHECK (match_score >= 0.00 AND match_score <= 100.00),
    status ENUM('APPLIED', 'SCREENED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    notes TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_candidate FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) 
        REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_candidate_job UNIQUE (candidate_id, job_id),
    INDEX idx_app_status (status),
    INDEX idx_app_match_score (match_score),
    INDEX idx_app_date (application_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. TABLE: predictions
-- Purpose: Records Machine Learning salary predictions for historical auditing.
-- Normalization: 3NF - Logs independent model outputs (Linear Regression & Random Forest).
-- ----------------------------------------------------------------------------
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NULL,
    experience_years DECIMAL(4, 1) NOT NULL,
    education_level VARCHAR(40) NOT NULL,
    job_role VARCHAR(80) NOT NULL,
    technical_skills_count INT NOT NULL DEFAULT 1,
    location VARCHAR(80) NOT NULL,
    company_size VARCHAR(30) NOT NULL,
    lr_predicted_salary DECIMAL(12, 2) NOT NULL,
    rf_predicted_salary DECIMAL(12, 2) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pred_candidate FOREIGN KEY (candidate_id) 
        REFERENCES candidates(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_pred_role (job_role),
    INDEX idx_pred_exp (experience_years),
    INDEX idx_pred_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. TABLE: interviews
-- Purpose: Tracks interview rounds, interviewers, and evaluative feedback.
-- Normalization: 3NF - Child entity of applications.
-- ----------------------------------------------------------------------------
CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    round_number INT NOT NULL DEFAULT 1,
    round_type ENUM('TECHNICAL_1', 'TECHNICAL_2', 'HR_ROUND', 'MANAGERIAL', 'FINAL_SELECTION') NOT NULL,
    scheduled_at DATETIME NOT NULL,
    interviewer_name VARCHAR(100) NOT NULL,
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'RESCHEDULED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    feedback TEXT NULL,
    rating INT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_interview_app FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_interview_status (status),
    INDEX idx_interview_date (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. TABLE: audit_logs
-- Purpose: Relational change auditing triggered by DB events or API actions.
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_value JSON NULL,
    new_value JSON NULL,
    performed_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_entity (entity_name, entity_id),
    INDEX idx_audit_time (performed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. TABLE: membership_plans
-- Purpose: Configurable membership tiers (Free, Monthly Premium, Yearly Premium).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    billing_cycle ENUM('FREE', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
    price_inr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    features JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_plan_code (plan_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. TABLE: subscriptions
-- Purpose: Candidate subscription records, tracking status, plan, and expiry.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_code VARCHAR(40) NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    billing_cycle ENUM('FREE', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
    price_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    starts_at DATETIME NOT NULL,
    expires_at DATETIME NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    cancelled_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_sub_user (user_id),
    INDEX idx_sub_status (status),
    INDEX idx_sub_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. TABLE: payments
-- Purpose: Payment ledger tracking Razorpay order IDs, payment IDs, signatures and invoices.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    subscription_id INT NULL,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    payment_id VARCHAR(100) NULL,
    signature VARCHAR(255) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status ENUM('CREATED', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'CREATED',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    billing_cycle ENUM('MONTHLY', 'YEARLY') NOT NULL,
    error_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME NULL,
    CONSTRAINT fk_pay_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_pay_order (order_id),
    INDEX idx_pay_user (user_id),
    INDEX idx_pay_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
