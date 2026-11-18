package model;

/**
 * ============================================================================
 * MODULE II: JAVA WITH OBJECT ORIENTED FEATURES
 * Demonstrates:
 * - Hierarchical Inheritance: Recruiter extends Person
 * - Method Overriding (@Override getRoleTitle, getDisplaySummary)
 * - Constructor chaining via super()
 * - Encapsulation (department, assignedHiringQuota)
 * ============================================================================
 */
public class Recruiter extends Person {
    private String department;
    private int assignedHiringQuota;
    private int hiredCount;

    public Recruiter() {
        super();
        this.department = "Human Resources";
        this.assignedHiringQuota = 10;
        this.hiredCount = 0;
    }

    public Recruiter(int id, String firstName, String lastName, String email, String phone,
                     String department, int assignedHiringQuota) {
        super(id, firstName, lastName, email, phone);
        this.department = department;
        this.assignedHiringQuota = assignedHiringQuota;
        this.hiredCount = 0;
    }

    @Override
    public String getRoleTitle() {
        return "Corporate Recruiter [" + department + "]";
    }

    @Override
    public String getDisplaySummary() {
        return String.format("[REC-%d] %s | Dept: %s | Quota: %d/%d candidates",
                getId(), getFullName(), department, hiredCount, assignedHiringQuota);
    }

    // Business method with Method Overloading (Compile-Time Polymorphism)
    public void recordHire() {
        this.hiredCount++;
    }

    public void recordHire(int additionalHires) {
        this.hiredCount += additionalHires;
    }

    // Getters and Setters
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getAssignedHiringQuota() {
        return assignedHiringQuota;
    }

    public void setAssignedHiringQuota(int assignedHiringQuota) {
        this.assignedHiringQuota = assignedHiringQuota;
    }

    public int getHiredCount() {
        return hiredCount;
    }

    public void setHiredCount(int hiredCount) {
        this.hiredCount = hiredCount;
    }
}
