package model;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - ENCAPSULATION
 * Model representing a Job Opening in the recruitment database.
 * ============================================================================
 */
public class Job {
    private int id;
    private String jobCode;
    private String title;
    private String department;
    private String jobRole;
    private double minExperience;
    private double maxExperience;
    private double minSalary;
    private double maxSalary;
    private String location;
    private String companySize;
    private String status;
    private List<String> requiredSkills;

    public Job() {
        this.requiredSkills = new ArrayList<>();
    }

    public Job(int id, String jobCode, String title, String department, String jobRole,
               double minExperience, double maxExperience, double minSalary, double maxSalary,
               String location, String companySize, String status) {
        this.id = id;
        this.jobCode = jobCode;
        this.title = title;
        this.department = department;
        this.jobRole = jobRole;
        this.minExperience = minExperience;
        this.maxExperience = maxExperience;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.location = location;
        this.companySize = companySize;
        this.status = status;
        this.requiredSkills = new ArrayList<>();
    }

    public String getSalaryRangeFormatted() {
        return String.format("₹%.2f - ₹%.2f LPA", minSalary / 100000.0, maxSalary / 100000.0);
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getJobCode() {
        return jobCode;
    }

    public void setJobCode(String jobCode) {
        this.jobCode = jobCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public double getMinExperience() {
        return minExperience;
    }

    public void setMinExperience(double minExperience) {
        this.minExperience = minExperience;
    }

    public double getMaxExperience() {
        return maxExperience;
    }

    public void setMaxExperience(double maxExperience) {
        this.maxExperience = maxExperience;
    }

    public double getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(double minSalary) {
        this.minSalary = minSalary;
    }

    public double getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(double maxSalary) {
        this.maxSalary = maxSalary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s (%s) | Exp: %.1f-%.1f yrs | %s | %s",
                jobCode, title, department, minExperience, maxExperience, getSalaryRangeFormatted(), location);
    }
}
