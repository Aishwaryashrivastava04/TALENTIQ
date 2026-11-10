package exception;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - CUSTOM RUNTIME EXCEPTION
 * Thrown when an invalid or negative salary value is provided.
 * ============================================================================
 */
public class InvalidSalaryException extends RuntimeException {
    private final double invalidAmount;

    public InvalidSalaryException(String message, double invalidAmount) {
        super(message);
        this.invalidAmount = invalidAmount;
    }

    public double getInvalidAmount() {
        return invalidAmount;
    }
}
