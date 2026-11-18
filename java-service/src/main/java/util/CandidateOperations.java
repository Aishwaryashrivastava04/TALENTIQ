package util;

import exception.RecruitmentException;
import model.Candidate;
import java.util.List;

/**
 * ============================================================================
 * MODULE II: EXTENDING INTERFACES
 * Demonstrates:
 * - Interface Inheritance: CandidateOperations EXTENDS RecordOperations<Candidate>
 * - Sub-interface adding domain-specific contracts
 * ============================================================================
 */
public interface CandidateOperations extends RecordOperations<Candidate> {
    List<Candidate> findBySkill(String skill) throws RecruitmentException;
    List<Candidate> findByExperienceRange(double minYears, double maxYears) throws RecruitmentException;
    boolean hireCandidateTransaction(int candidateId, int applicationId, double finalSalary) throws RecruitmentException;
}
