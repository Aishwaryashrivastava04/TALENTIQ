-- ============================================================================
-- SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
-- SUBJECT 4: RDBMS - DATABASE VIEWS
-- Academic Concept: Virtual tables, Encapsulating complex multi-table joins,
-- aggregation functions, and subqueries for business intelligence.
-- ============================================================================

USE smart_recruitment_db;

-- ----------------------------------------------------------------------------
-- VIEW 1: vw_active_jobs_summary
-- Demonstrates: LEFT JOIN, COUNT, AVG, conditional aggregation (SUM CASE),
-- and GROUP BY on job openings.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_active_jobs_summary AS
SELECT 
    j.id AS job_id,
    j.job_code,
    j.title AS job_title,
    j.department,
    j.job_role,
    j.location,
    j.min_experience,
    j.max_experience,
    j.min_salary,
    j.max_salary,
    j.status,
    COUNT(a.id) AS total_applicants,
    COALESCE(ROUND(AVG(a.match_score), 2), 0.00) AS avg_match_score,
    SUM(CASE WHEN a.status = 'SHORTLISTED' THEN 1 ELSE 0 END) AS shortlisted_count,
    SUM(CASE WHEN a.status = 'SELECTED' THEN 1 ELSE 0 END) AS selected_count,
    j.created_at
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY 
    j.id, j.job_code, j.title, j.department, j.job_role, 
    j.location, j.min_experience, j.max_experience, 
    j.min_salary, j.max_salary, j.status, j.created_at;

-- ----------------------------------------------------------------------------
-- VIEW 2: vw_candidate_profile_details
-- Demonstrates: LEFT JOIN, GROUP_CONCAT, COUNT DISTINCT,
-- presenting flattened relational skills profiles.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_candidate_profile_details AS
SELECT 
    c.id AS candidate_id,
    c.candidate_code,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    c.email,
    c.phone,
    c.experience_years,
    c.education_level,
    c.current_salary,
    c.expected_salary,
    ROUND((c.expected_salary - c.current_salary), 2) AS expected_hike_amount,
    CASE 
        WHEN c.current_salary > 0 
        THEN ROUND(((c.expected_salary - c.current_salary) / c.current_salary) * 100, 2)
        ELSE 0.00 
    END AS expected_hike_percentage,
    c.location,
    c.status AS availability_status,
    COUNT(cs.skill_id) AS total_skills_count,
    COALESCE(GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', '), 'No skills listed') AS skills_list,
    c.created_at
FROM candidates c
LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
LEFT JOIN skills s ON cs.skill_id = s.id
GROUP BY 
    c.id, c.candidate_code, c.first_name, c.last_name, c.email, 
    c.phone, c.experience_years, c.education_level, c.current_salary, 
    c.expected_salary, c.location, c.status, c.created_at;

-- ----------------------------------------------------------------------------
-- VIEW 3: vw_application_full_details
-- Demonstrates: Multi-table INNER JOIN across 3NF tables (applications, 
-- candidates, jobs) with latest interview subquery.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_application_full_details AS
SELECT 
    a.id AS application_id,
    a.application_code,
    a.application_date,
    a.status AS application_status,
    a.match_score,
    a.notes,
    c.id AS candidate_id,
    c.candidate_code,
    CONCAT(c.first_name, ' ', c.last_name) AS candidate_name,
    c.email AS candidate_email,
    c.experience_years AS candidate_experience,
    c.education_level AS candidate_education,
    c.current_salary,
    c.expected_salary,
    j.id AS job_id,
    j.job_code,
    j.title AS job_title,
    j.department AS job_department,
    j.job_role,
    j.location AS job_location,
    j.min_salary,
    j.max_salary,
    (
        SELECT i.status 
        FROM interviews i 
        WHERE i.application_id = a.id 
        ORDER BY i.scheduled_at DESC 
        LIMIT 1
    ) AS latest_interview_status,
    (
        SELECT i.scheduled_at 
        FROM interviews i 
        WHERE i.application_id = a.id 
        ORDER BY i.scheduled_at DESC 
        LIMIT 1
    ) AS latest_interview_date
FROM applications a
INNER JOIN candidates c ON a.candidate_id = c.id
INNER JOIN jobs j ON a.job_id = j.id;

-- ----------------------------------------------------------------------------
-- VIEW 4: vw_salary_analytics_summary
-- Demonstrates: Statistical aggregation (MIN, MAX, AVG, STDDEV) grouped by
-- job role and education level for Subject 3 (Statistics) integration.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_salary_analytics_summary AS
SELECT 
    education_level,
    COUNT(*) AS candidate_sample_size,
    ROUND(MIN(current_salary), 2) AS min_current_salary,
    ROUND(MAX(current_salary), 2) AS max_current_salary,
    ROUND(AVG(current_salary), 2) AS avg_current_salary,
    ROUND(COALESCE(STDDEV(current_salary), 0), 2) AS stddev_current_salary,
    ROUND(AVG(expected_salary), 2) AS avg_expected_salary,
    ROUND(AVG(experience_years), 1) AS avg_experience_years
FROM candidates
GROUP BY education_level;

-- ----------------------------------------------------------------------------
-- VIEW 5: vw_model_prediction_variance
-- Demonstrates: Comparing Linear Regression vs Random Forest outputs
-- to inspect model divergence.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_model_prediction_variance AS
SELECT 
    p.id AS prediction_id,
    p.candidate_id,
    p.job_role,
    p.experience_years,
    p.education_level,
    p.location,
    p.company_size,
    p.lr_predicted_salary,
    p.rf_predicted_salary,
    ROUND(ABS(p.rf_predicted_salary - p.lr_predicted_salary), 2) AS model_variance_inr,
    ROUND(
        (ABS(p.rf_predicted_salary - p.lr_predicted_salary) / 
        ((p.rf_predicted_salary + p.lr_predicted_salary) / 2)) * 100, 2
    ) AS percentage_divergence,
    p.created_at
FROM predictions p;
