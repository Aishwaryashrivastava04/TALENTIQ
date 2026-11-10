package exception;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - CUSTOM EXCEPTION
 * Thrown when JDBC fails to establish connection or execute PreparedStatement.
 * ============================================================================
 */
public class DatabaseConnectionException extends RecruitmentException {
    public DatabaseConnectionException(String message, Throwable cause) {
        super(message, cause, "ERR_JDBC_CONNECTION_FAILED");
    }
}
