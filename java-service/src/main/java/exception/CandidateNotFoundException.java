package exception;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - CUSTOM EXCEPTION
 * Thrown when a queried candidate record does not exist in MySQL.
 * ============================================================================
 */
public class CandidateNotFoundException extends RecruitmentException {
    private final String identifier;

    public CandidateNotFoundException(String message, String identifier) {
        super(message, "ERR_CANDIDATE_NOT_FOUND");
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }
}
