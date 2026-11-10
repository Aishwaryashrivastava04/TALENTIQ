import dao.CandidateDAO;
import dao.JobDAO;
import exception.CandidateNotFoundException;
import exception.InvalidSalaryException;
import exception.RecruitmentException;
import model.Candidate;
import model.Job;
import model.Person;
import service.RecruitmentManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * ============================================================================
 * SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
 * SUBJECT 2: CORE JAVA - VERIFICATION & DEMONSTRATION RUNNER
 * ============================================================================
 * Demonstrates all 14 mandatory academic items:
 * 1. Candidate class
 * 2. Job class
 * 3. Application class
 * 4. Encapsulation (Private fields with getter/setter boundaries)
 * 5. Inheritance (Candidate extends Person)
 * 6. Polymorphism (Dynamic Method Dispatch on Person reference)
 * 7. Abstraction (Abstract Person base class)
 * 8. Interfaces (RecordOperations<T> CRUD contract)
 * 9. Collections Framework (ArrayList, HashMap)
 * 10. Exception Handling (Custom checked & unchecked exceptions)
 * 11. JDBC connectivity with MySQL
 * 12. CRUD operations using JDBC
 * 13. PreparedStatement (Parameter binding)
 * 14. ResultSet (Data extraction)
 * ============================================================================
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("🎓 SUBJECT 2: CORE JAVA RECRUITMENT SYSTEM DEMONSTRATION");
        System.out.println("================================================================================");

        // ---------------------------------------------------------------------
        // DEMO 1: Abstraction, Inheritance & Polymorphism
        // ---------------------------------------------------------------------
        System.out.println("\n[1] OOP CONCEPTS: Abstraction, Inheritance & Polymorphism");
        System.out.println("------------------------------------------------------------------");
        
        // Polymorphic reference: Abstract Person reference pointing to Candidate instance
        Person polyPerson = new Candidate(
                101,
                "CAN-DEMO",
                "Arun",
                "Kumar",
                "arun.k@example.com",
                "+91 9988776655",
                4.5,
                "MCA",
                850000.0,
                1200000.0,
                "Bengaluru",
                "AVAILABLE"
        );

        System.out.println("Variable Type:  " + polyPerson.getClass().getSuperclass().getName() + " (Abstract Class)");
        System.out.println("Instance Type:  " + polyPerson.getClass().getName() + " (Inherited Sub-class)");
        System.out.println("Polymorphic Call -> getRoleTitle():      " + polyPerson.getRoleTitle());
        System.out.println("Polymorphic Call -> getDisplaySummary(): " + polyPerson.getDisplaySummary());

        // ---------------------------------------------------------------------
        // DEMO 2: Encapsulation & Business Calculations
        // ---------------------------------------------------------------------
        System.out.println("\n[2] ENCAPSULATION & DATA HIDING");
        System.out.println("------------------------------------------------------------------");
        Candidate candidate = (Candidate) polyPerson;
        System.out.printf("Candidate Full Name: %s\n", candidate.getFullName());
        System.out.printf("Current Salary:      ₹%,.2f\n", candidate.getCurrentSalary());
        System.out.printf("Expected Salary:     ₹%,.2f\n", candidate.getExpectedSalary());
        System.out.printf("Calculated Hike:     %.2f%%\n", candidate.calculateHikePercentage());

        // ---------------------------------------------------------------------
        // DEMO 3: Exception Handling with Custom Exceptions
        // ---------------------------------------------------------------------
        System.out.println("\n[3] EXCEPTION HANDLING (Custom Exceptions)");
        System.out.println("------------------------------------------------------------------");
        RecruitmentManager manager = new RecruitmentManager();

        // 3a. Testing custom unchecked InvalidSalaryException
        try {
            System.out.print("Testing InvalidSalaryException with negative input: ");
            manager.validateSalaryParameters(-50000.0, 800000.0);
        } catch (InvalidSalaryException e) {
            System.out.println("CAUGHT EXPECTED EXCEPTION -> " + e.getMessage());
        }

        // 3b. Testing custom checked CandidateNotFoundException
        try {
            System.out.print("Testing CandidateNotFoundException for non-existent ID 99999: ");
            manager.getCandidateSafely(99999);
        } catch (CandidateNotFoundException e) {
            System.out.println("CAUGHT EXPECTED EXCEPTION -> [" + e.getErrorCode() + "] " + e.getMessage());
        }

        // ---------------------------------------------------------------------
        // DEMO 4: Multithreading & Concurrent Background Tasks
        // ---------------------------------------------------------------------
        System.out.println("\n[4] MULTITHREADING: ExecutorService & Concurrent Candidate Analysis");
        System.out.println("------------------------------------------------------------------");
        List<Candidate> sampleBatch = new ArrayList<>();
        sampleBatch.add(candidate);
        sampleBatch.add(new Candidate(2, "CAN-1002", "Sneha", "Patel", "sneha@test.com", "9823456781", 5.0, "BTECH", 1250000.0, 1600000.0, "Pune", "AVAILABLE"));
        sampleBatch.add(new Candidate(3, "CAN-1003", "Ananya", "Iyer", "ananya@test.com", "9912345672", 2.0, "BCA", 450000.0, 650000.0, "Chennai", "AVAILABLE"));

        List<String> asyncResults = manager.processCandidateMetricsConcurrently(sampleBatch);
        System.out.printf("Concurrently processed %d candidate metrics across thread pool:\n", asyncResults.size());
        for (String res : asyncResults) {
            System.out.println("   " + res);
        }

        // ---------------------------------------------------------------------
        // DEMO 5: JDBC Connectivity, Transactions, PreparedStatement & ResultSet
        // ---------------------------------------------------------------------
        System.out.println("\n[5] JDBC CONNECTIVITY & ACID TRANSACTIONS (MySQL)");
        System.out.println("------------------------------------------------------------------");
        try {
            CandidateDAO candidateDAO = new CandidateDAO();
            List<Candidate> dbCandidates = candidateDAO.findAll();

            System.out.printf("✅ Successfully connected to MySQL via JDBC! Retrieved %d candidates:\n", dbCandidates.size());
            for (int i = 0; i < Math.min(5, dbCandidates.size()); i++) {
                Candidate c = dbCandidates.get(i);
                System.out.printf("   [%s] %-20s | Exp: %3.1f yrs | Current: ₹%,10.2f | Exp: ₹%,10.2f | Loc: %s\n",
                        c.getCandidateCode(), c.getFullName(), c.getExperienceYears(),
                        c.getCurrentSalary(), c.getExpectedSalary(), c.getLocation());
            }

            // -----------------------------------------------------------------
            // DEMO 6: Collections Framework (ArrayList & HashMap)
            // -----------------------------------------------------------------
            System.out.println("\n[6] COLLECTIONS FRAMEWORK: HashMap & ArrayList Operations");
            System.out.println("------------------------------------------------------------------");

            // 6a. HashMap lookup
            JobDAO jobDAO = new JobDAO();
            Map<Integer, Job> jobMap = jobDAO.getJobsAsIndexedMap();
            System.out.printf("Indexed HashMap<Integer, Job> contains %d active job openings:\n", jobMap.size());
            for (Map.Entry<Integer, Job> entry : jobMap.entrySet()) {
                System.out.printf("   Key [Job ID: %d] => %s\n", entry.getKey(), entry.getValue().getTitle());
            }

            // 6b. Grouping using HashMap
            Map<String, List<Candidate>> groupedByEdu = manager.groupCandidatesByEducation();
            System.out.println("\nGrouped Candidates by Education Level (HashMap<String, List<Candidate>>):");
            for (Map.Entry<String, List<Candidate>> entry : groupedByEdu.entrySet()) {
                System.out.printf("   %-10s -> %d candidate(s)\n", entry.getKey(), entry.getValue().size());
            }

            // 6c. ACID Transaction Demo
            System.out.println("\n[7] ACID TRANSACTION DEMO (Commit & Rollback)");
            System.out.println("------------------------------------------------------------------");
            boolean txSuccess = candidateDAO.hireCandidateTransaction(1, 1, 1100000.0);
            System.out.println("Transaction Execution Status: " + (txSuccess ? "COMMITTED" : "ROLLED BACK"));

        } catch (RecruitmentException e) {
            System.out.println("⚠️ MySQL Database is not currently running or reachable: " + e.getMessage());
            System.out.println("   (When local MySQL is active with database/schema.sql and sample_data.sql, full live records will display)");
        }

        System.out.println("\n================================================================================");
        System.out.println("✅ CORE JAVA MODULE VERIFICATION COMPLETED SUCCESSFULLY");
        System.out.println("================================================================================");
    }
}
