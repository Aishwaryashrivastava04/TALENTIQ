-- ============================================================================
-- SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
-- SUBJECT 4: RDBMS - DATABASE TRIGGERS
-- Academic Concepts: Active database rules, Event-Condition-Action (ECA),
-- Data integrity enforcement, Auditing, and SIGNAL SQLSTATE exception handling.
-- ============================================================================

USE smart_recruitment_db;

DELIMITER $$

-- ----------------------------------------------------------------------------
-- TRIGGER 1: trg_before_candidate_salary_check
-- Type: BEFORE INSERT
-- Purpose: Ensures salary inputs are strictly non-negative.
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_before_candidate_insert_check$$

CREATE TRIGGER trg_before_candidate_insert_check
BEFORE INSERT ON candidates
FOR EACH ROW
BEGIN
    IF NEW.current_salary < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Current salary cannot be negative.';
    END IF;

    IF NEW.expected_salary < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Expected salary cannot be negative.';
    END IF;

    IF NEW.experience_years < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Validation Error: Experience years cannot be negative.';
    END IF;
END$$

-- ----------------------------------------------------------------------------
-- TRIGGER 2: trg_after_application_status_update
-- Type: AFTER UPDATE
-- Purpose: Automatically audits any recruitment lifecycle stage transitions.
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_application_status_update$$

CREATE TRIGGER trg_after_application_status_update
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.match_score != NEW.match_score THEN
        INSERT INTO audit_logs (
            entity_name,
            entity_id,
            action_type,
            old_value,
            new_value,
            performed_by
        ) VALUES (
            'applications',
            NEW.id,
            'UPDATE',
            JSON_OBJECT(
                'status', OLD.status,
                'match_score', OLD.match_score,
                'updated_at', OLD.updated_at
            ),
            JSON_OBJECT(
                'status', NEW.status,
                'match_score', NEW.match_score,
                'updated_at', NEW.updated_at
            ),
            'RECRUITMENT_WORKFLOW'
        );
    END IF;
END$$

-- ----------------------------------------------------------------------------
-- TRIGGER 3: trg_after_candidate_insert
-- Type: AFTER INSERT
-- Purpose: Audits candidate record creation with timestamped JSON metadata.
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_candidate_insert$$

CREATE TRIGGER trg_after_candidate_insert
AFTER INSERT ON candidates
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        entity_name,
        entity_id,
        action_type,
        old_value,
        new_value,
        performed_by
    ) VALUES (
        'candidates',
        NEW.id,
        'INSERT',
        NULL,
        JSON_OBJECT(
            'candidate_code', NEW.candidate_code,
            'email', NEW.email,
            'education_level', NEW.education_level,
            'experience_years', NEW.experience_years,
            'expected_salary', NEW.expected_salary
        ),
        'CANDIDATE_REGISTRATION'
    );
END$$

-- ----------------------------------------------------------------------------
-- TRIGGER 4: trg_after_prediction_insert
-- Type: AFTER INSERT
-- Purpose: Logs salary inference executions for ML governance and auditing.
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_prediction_insert$$

CREATE TRIGGER trg_after_prediction_insert
AFTER INSERT ON predictions
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        entity_name,
        entity_id,
        action_type,
        old_value,
        new_value,
        performed_by
    ) VALUES (
        'predictions',
        NEW.id,
        'INSERT',
        NULL,
        JSON_OBJECT(
            'candidate_id', NEW.candidate_id,
            'job_role', NEW.job_role,
            'experience_years', NEW.experience_years,
            'lr_predicted_salary', NEW.lr_predicted_salary,
            'rf_predicted_salary', NEW.rf_predicted_salary
        ),
        'ML_PREDICTION_SERVICE'
    );
END$$

DELIMITER ;
