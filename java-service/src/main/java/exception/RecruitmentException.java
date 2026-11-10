package exception;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - EXCEPTION HANDLING
 * Root application checked exception.
 * ============================================================================
 */
public class RecruitmentException extends Exception {
    private final String errorCode;

    public RecruitmentException(String message) {
        super(message);
        this.errorCode = "ERR_RECRUITMENT_GENERIC";
    }

    public RecruitmentException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public RecruitmentException(String message, Throwable cause, String errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
