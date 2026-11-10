package model;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - INHERITANCE & POLYMORPHISM
 * Candidate class extending the abstract Person class.
 * Demonstrates:
 * - Single Inheritance (Candidate IS-A Person)
 * - Polymorphic method overriding (getRoleTitle, getDisplaySummary)
 * - Collections integration (List<String> for candidate skills)
 * ============================================================================
 */
public class Candidate extends Person {
    private String candidateCode;
    private double experienceYears;
    private String educationLevel;
    private double currentSalary;
    private double expectedSalary;
    private String location;
    private String status;
    private List<String> skills;

    public Candidate() {
        super();
        this.skills = new ArrayList<>();
    }

    public Candidate(int id, String candidateCode, String firstName, String lastName,
                     String email, String phone, double experienceYears,
                     String educationLevel, double currentSalary, double expectedSalary,
                     String location, String status) {
        super(id, firstName, lastName, email, phone);
        this.candidateCode = candidateCode;
        this.experienceYears = experienceYears;
        this.educationLevel = educationLevel;
        this.currentSalary = currentSalary;
        this.expectedSalary = expectedSalary;
        this.location = location;
        this.status = status;
        this.skills = new ArrayList<>();
    }

    // Overriding abstract method from Person (Polymorphic behavior)
    @Override
    public String getRoleTitle() {
        return "Job Candidate (" + educationLevel + ", " + experienceYears + " yrs exp)";
    }

    // Overriding display summary
    @Override
    public String getDisplaySummary() {
        return String.format("[%s] %s | Exp: %.1f yrs | Current: ₹%.2f | Expected: ₹%.2f | Location: %s",
                candidateCode, getFullName(), experienceYears, currentSalary, expectedSalary, location);
    }

    // Calculate expected hike percentage
    public double calculateHikePercentage() {
        if (currentSalary <= 0) return 0.0;
        return ((expectedSalary - currentSalary) / currentSalary) * 100.0;
    }

    // Getters and Setters
    public String getCandidateCode() {
        return candidateCode;
    }

    public void setCandidateCode(String candidateCode) {
        this.candidateCode = candidateCode;
    }

    public double getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(double experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public double getCurrentSalary() {
        return currentSalary;
    }

    public void setCurrentSalary(double currentSalary) {
        this.currentSalary = currentSalary;
    }

    public double getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(double expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void addSkill(String skill) {
        if (skill != null && !skills.contains(skill)) {
            skills.add(skill);
        }
    }
}
