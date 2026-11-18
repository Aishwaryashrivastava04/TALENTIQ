package model;

/**
 * ============================================================================
 * MODULE II: JAVA WITH OBJECT ORIENTED FEATURES
 * Demonstrates:
 * - Multi-level Inheritance Hierarchy:
 *     Person (Abstract Base) -> Recruiter (Subclass) -> SeniorHRManager (Derived Child)
 * - Constructor chaining up the 3-level hierarchy (super())
 * - Method Overriding with enhanced role responsibilities
 * - 'final' method preventing unauthorized sub-overriding
 * ============================================================================
 */
public class SeniorHRManager extends Recruiter {
    private double annualBudgetLakhs;
    private String strategicDivision;

    public SeniorHRManager() {
        super();
        this.annualBudgetLakhs = 50.0;
        this.strategicDivision = "Technology Hiring";
    }

    public SeniorHRManager(int id, String firstName, String lastName, String email, String phone,
                           String department, int assignedHiringQuota,
                           double annualBudgetLakhs, String strategicDivision) {
        super(id, firstName, lastName, email, phone, department, assignedHiringQuota);
        this.annualBudgetLakhs = annualBudgetLakhs;
        this.strategicDivision = strategicDivision;
    }

    @Override
    public String getRoleTitle() {
        return "Senior HR Manager (Lead Executive - " + strategicDivision + ")";
    }

    @Override
    public String getDisplaySummary() {
        return String.format("[HR-EXEC-%d] %s | Division: %s | Budget: ₹%.1f Lakhs | Multi-level Hierarchy",
                getId(), getFullName(), strategicDivision, annualBudgetLakhs);
    }

    // Demonstrates 'final' method in inheritance hierarchy
    public final boolean approveCompensationOffer(double proposedSalary) {
        double maxBudgetPerHire = (annualBudgetLakhs * 100000.0) / Math.max(1, getAssignedHiringQuota());
        return proposedSalary <= maxBudgetPerHire;
    }

    public double getAnnualBudgetLakhs() {
        return annualBudgetLakhs;
    }

    public void setAnnualBudgetLakhs(double annualBudgetLakhs) {
        this.annualBudgetLakhs = annualBudgetLakhs;
    }

    public String getStrategicDivision() {
        return strategicDivision;
    }

    public void setStrategicDivision(String strategicDivision) {
        this.strategicDivision = strategicDivision;
    }
}
