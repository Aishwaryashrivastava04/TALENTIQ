-- ============================================================================
-- SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
-- SUBJECT 4: RDBMS - STORED PROCEDURES & STORED FUNCTIONS
-- Academic Concepts: Procedural SQL, Encapsulation of business logic,
-- Conditional branches, Cursors/Aggregates, Stored Functions, and ACID Transactions.
-- ============================================================================

USE smart_recruitment_db;

DELIMITER $$

-- ----------------------------------------------------------------------------
-- STORED FUNCTION 1: fn_CalculateExperienceScore
-- Purpose: Evaluates candidate experience relative to job min/max bounds.
-- Returns: Normalized score from 0.00 to 100.00.
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_CalculateExperienceScore$$

CREATE FUNCTION fn_CalculateExperienceScore(
    p_candidate_exp DECIMAL(4, 1),
    p_job_min_exp DECIMAL(4, 1),
    p_job_max_exp DECIMAL(4, 1)
) 
RETURNS DECIMAL(5, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_score DECIMAL(5, 2);

    -- Case 1: Within required window -> Full score (100)
    IF p_candidate_exp >= p_job_min_exp AND p_candidate_exp <= p_job_max_exp THEN
        SET v_score = 100.00;
    
    -- Case 2: Under-experienced -> Proportionate ratio
    ELSEIF p_candidate_exp < p_job_min_exp THEN
        IF p_job_min_exp > 0 THEN
            SET v_score = (p_candidate_exp / p_job_min_exp) * 85.00;
        ELSE
            SET v_score = 100.00;
        END IF;

    -- Case 3: Over-experienced (overqualification consideration)
    ELSE
        -- Moderate decay for being significantly beyond target range
        SET v_score = GREATEST(70.00, 100.00 - ((p_candidate_exp - p_job_max_exp) * 3.00));
    END IF;

    RETURN LEAST(100.00, GREATEST(0.00, v_score));
END$$

-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 1: sp_MatchCandidateJob
-- Purpose: Relational matching algorithm calculating skill overlap and 
-- experience fit without relying on external ML.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_MatchCandidateJob$$

CREATE PROCEDURE sp_MatchCandidateJob(
    IN p_candidate_id INT,
    IN p_job_id INT,
    OUT p_final_score DECIMAL(5, 2),
    OUT p_candidate_skills_count INT,
    OUT p_experience_score DECIMAL(5, 2)
)
BEGIN
    DECLARE v_cand_exp DECIMAL(4, 1);
    DECLARE v_min_exp DECIMAL(4, 1);
    DECLARE v_max_exp DECIMAL(4, 1);
    DECLARE v_total_candidate_skills INT DEFAULT 0;
    DECLARE v_exp_score DECIMAL(5, 2) DEFAULT 0.00;
    DECLARE v_base_skill_score DECIMAL(5, 2) DEFAULT 0.00;

    -- Retrieve candidate experience
    SELECT experience_years 
    INTO v_cand_exp 
    FROM candidates 
    WHERE id = p_candidate_id;

    -- Retrieve job requirements
    SELECT min_experience, max_experience 
    INTO v_min_exp, v_max_exp 
    FROM jobs 
    WHERE id = p_job_id;

    -- Count total skills candidate possesses
    SELECT COUNT(*) 
    INTO v_total_candidate_skills
    FROM candidate_skills 
    WHERE candidate_id = p_candidate_id;

    -- Compute experience score via stored function
    SET v_exp_score = fn_CalculateExperienceScore(v_cand_exp, v_min_exp, v_max_exp);

    -- Base skill scoring heuristic: Candidates with 5+ validated skills get full skill baseline
    IF v_total_candidate_skills >= 5 THEN
        SET v_base_skill_score = 95.00;
    ELSEIF v_total_candidate_skills >= 3 THEN
        SET v_base_skill_score = 80.00;
    ELSEIF v_total_candidate_skills >= 1 THEN
        SET v_base_skill_score = 60.00;
    ELSE
        SET v_base_skill_score = 30.00;
    END IF;

    -- Weighted composite score: 60% skills + 40% experience compatibility
    SET p_final_score = ROUND((v_base_skill_score * 0.60) + (v_exp_score * 0.40), 2);
    SET p_candidate_skills_count = v_total_candidate_skills;
    SET p_experience_score = v_exp_score;
END$$

-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 2: sp_RecordApplication
-- Purpose: Safely creates an application record wrapped in an ACID Transaction.
-- Handles duplicate prevention, auto-generation of application code,
-- and calculating initial matching score.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_RecordApplication$$

CREATE PROCEDURE sp_RecordApplication(
    IN p_candidate_id INT,
    IN p_job_id INT,
    IN p_notes TEXT,
    OUT p_application_id INT,
    OUT p_match_score DECIMAL(5, 2),
    OUT p_status_message VARCHAR(150)
)
BEGIN
    DECLARE v_app_count INT DEFAULT 0;
    DECLARE v_calc_score DECIMAL(5, 2) DEFAULT 0.00;
    DECLARE v_skills_count INT DEFAULT 0;
    DECLARE v_exp_score DECIMAL(5, 2) DEFAULT 0.00;
    DECLARE v_app_code VARCHAR(32);

    -- Declare exception handler for rollback on SQLEXCEPTION
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_application_id = 0;
        SET p_match_score = 0.00;
        SET p_status_message = 'ERROR: Transaction rolled back due to SQL error.';
    END;

    START TRANSACTION;

    -- Check if application already exists
    SELECT COUNT(*) 
    INTO v_app_count 
    FROM applications 
    WHERE candidate_id = p_candidate_id AND job_id = p_job_id;

    IF v_app_count > 0 THEN
        ROLLBACK;
        SET p_application_id = 0;
        SET p_match_score = 0.00;
        SET p_status_message = 'DUPLICATE: Candidate has already applied for this job.';
    ELSE
        -- Calculate match score via procedure
        CALL sp_MatchCandidateJob(p_candidate_id, p_job_id, v_calc_score, v_skills_count, v_exp_score);

        -- Generate unique application code
        SET v_app_code = CONCAT('APP-', LPAD(FLOOR(RAND() * 900000 + 100000), 6, '0'));

        -- Insert application record
        INSERT INTO applications (application_code, candidate_id, job_id, match_score, status, notes)
        VALUES (v_app_code, p_candidate_id, p_job_id, v_calc_score, 'APPLIED', p_notes);

        SET p_application_id = LAST_INSERT_ID();
        SET p_match_score = v_calc_score;
        SET p_status_message = 'SUCCESS: Application successfully registered.';

        COMMIT;
    END IF;
END$$

-- ----------------------------------------------------------------------------
-- STORED PROCEDURE 3: sp_GetDashboardStats
-- Purpose: Aggregates enterprise recruitment KPI metrics in a single network round-trip.
-- ----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_GetDashboardStats$$

CREATE PROCEDURE sp_GetDashboardStats()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM candidates) AS total_candidates,
        (SELECT COUNT(*) FROM jobs WHERE status = 'OPEN') AS total_open_jobs,
        (SELECT COUNT(*) FROM applications) AS total_applications,
        (SELECT COUNT(*) FROM applications WHERE status = 'SHORTLISTED') AS shortlisted_candidates,
        (SELECT COUNT(*) FROM applications WHERE status = 'SELECTED') AS selected_candidates,
        (SELECT COALESCE(ROUND(AVG(rf_predicted_salary), 2), 0.00) FROM predictions) AS avg_predicted_salary_inr,
        (SELECT COALESCE(ROUND(AVG(match_score), 2), 0.00) FROM applications) AS avg_match_score;
END$$

DELIMITER ;
