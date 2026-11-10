package model;

import java.sql.Timestamp;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - ENCAPSULATION
 * Model representing an Application linking Candidate with Job.
 * ============================================================================
 */
public class Application {
    private int id;
    private String applicationCode;
    private int candidateId;
    private int jobId;
    private double matchScore;
    private String status;
    private String notes;
    private Timestamp applicationDate;

    // Relational display helper fields
    private String candidateName;
    private String jobTitle;

    public Application() {
    }

    public Application(int id, String applicationCode, int candidateId, int jobId,
                       double matchScore, String status, String notes, Timestamp applicationDate) {
        this.id = id;
        this.applicationCode = applicationCode;
        this.candidateId = candidateId;
        this.jobId = jobId;
        this.matchScore = matchScore;
        this.status = status;
        this.notes = notes;
        this.applicationDate = applicationDate;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getApplicationCode() {
        return applicationCode;
    }

    public void setApplicationCode(String applicationCode) {
        this.applicationCode = applicationCode;
    }

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Timestamp getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Timestamp applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    @Override
    public String toString() {
        return String.format("[%s] Candidate #%d -> Job #%d | Score: %.1f%% | Status: %s",
                applicationCode, candidateId, jobId, matchScore, status);
    }
}
