import basics.Module1IntroDemo;
import collections.CollectionsMasterDemo;
import concurrency.ThreadLifeCycleDemo;
import dao.CandidateDAO;
import dao.JobDAO;
import exception.CandidateNotFoundException;
import exception.InvalidSalaryException;
import exception.RecruitmentException;
import gui.RecruitmentDashboardGUI;
import model.*;
import networking.RecruitmentSocketClient;
import service.RecruitmentManager;
import servlet.ServletLifecycleSimulator;
import util.DBMetaDataExplorer;
import util.RecordOperations;
import viksitbharat.ViksitBharatAlignment;

import java.util.*;

/**
 * ============================================================================
 * SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM (TALENTIQ)
 * COURSE CODE: CSIT751 - CORE JAVA (AMITY UNIVERSITY CURRICULUM COMPLIANT)
 * ============================================================================
 * Comprehensive Master Demonstration Harness covering all Syllabus Modules:
 * - Module I:    Introduction to Java, JVM Architecture, Bytecode & 1D/2D Arrays
 * - Module II:   Java with OOP Features (Inheritance, Polymorphism, Abstract, Interfaces)
 * - Module III:  Exception Handling (Custom/Built-in) & Thread in Java (Lifecycle, Sync)
 * - Module IV:   Collections Framework (ArrayList, Vector, Map, Set) & Swing GUI
 * - Module V:    Java Server Technologies (Servlet Lifecycle, web.xml, JSP, JSTL)
 * - Module VI:   Database Programming using JDBC (ResultSetMetaData) & Networking (Socket)
 * - Module VII:  Recent Trends and Development & Viksit Bharat@2047 Guidelines
 * ============================================================================
 */
public class Main {

    public static void main(String[] args) {
        // If argument "gui" is passed, directly launch the Swing GUI
        if (args.length > 0 && "gui".equalsIgnoreCase(args[0])) {
            System.out.println("🚀 Launching TALENTIQ Java Swing Desktop GUI Application...");
            RecruitmentDashboardGUI.launch();
            return;
        }

        printBanner();

        // ---------------------------------------------------------------------
        // MODULE I: Introduction to Java, JVM & Arrays
        // ---------------------------------------------------------------------
        Module1IntroDemo.runModule1Demonstration();

        // ---------------------------------------------------------------------
        // MODULE II: OOP Features (Inheritance, Polymorphism, Abstract, Interfaces)
        // ---------------------------------------------------------------------
        runModule2OOPDemonstration();

        // ---------------------------------------------------------------------
        // MODULE III: Exception Handling & Multithreading
        // ---------------------------------------------------------------------
        runModule3ExceptionsAndThreading();

        // ---------------------------------------------------------------------
        // MODULE IV: Collections Framework
        // ---------------------------------------------------------------------
        CollectionsMasterDemo.runCollectionsDemonstration();

        // ---------------------------------------------------------------------
        // MODULE V: Java Server Technologies & Servlets
        // ---------------------------------------------------------------------
        ServletLifecycleSimulator.runServletLifecycleDemo();

        // ---------------------------------------------------------------------
        // MODULE VI: Database Programming using JDBC & Networking
        // ---------------------------------------------------------------------
        DBMetaDataExplorer.runJdbcAndMetaDataDemo();
        RecruitmentSocketClient.runNetworkingDemo();

        // ---------------------------------------------------------------------
        // MODULE VII / VIII: Viksit Bharat@2047 & Recent Trends
        // ---------------------------------------------------------------------
        ViksitBharatAlignment.displayViksitBharatStrategy();

        printCompletionSummary();
    }

    private static void printBanner() {
        System.out.println("================================================================================");
        System.out.println("🎓 AMITY UNIVERSITY - CSIT751: CORE JAVA CURRICULUM VERIFICATION SUITE");
        System.out.println("   PROJECT: TALENTIQ - Smart Recruitment, Salary Prediction & Analytics System");
        System.out.println("   PRIMARY ADMINISTRATOR: Aishwarya Shree (Lead Architect)");
        System.out.println("================================================================================");
    }

    private static void runModule2OOPDemonstration() {
        System.out.println("\n================================================================================");
        System.out.println("🧱 MODULE II: JAVA WITH OBJECT ORIENTED FEATURES DEMONSTRATION");
        System.out.println("================================================================================");

        // 1. Abstraction & Dynamic Method Dispatch (Runtime Polymorphism)
        System.out.println("\n[A] ABSTRACTION & RUNTIME POLYMORPHISM (Dynamic Method Dispatch):");
        System.out.println("------------------------------------------------------------------");

        Person polyCandidate = new Candidate(
                101, "CAN-101", "Aishwarya", "Shree",
                "aishwarya@talentiq.com", "+91 9876543210", 5.5, "MCA",
                1200000.0, 1800000.0, "Bengaluru", "OFFERED"
        );

        System.out.println("Reference Type: " + polyCandidate.getClass().getSuperclass().getName() + " (Abstract Class)");
        System.out.println("Instance Type:  " + polyCandidate.getClass().getName() + " (Inherited Subclass)");
        System.out.println("Polymorphic Call -> getRoleTitle():      " + polyCandidate.getRoleTitle());
        System.out.println("Polymorphic Call -> getDisplaySummary(): " + polyCandidate.getDisplaySummary());

        // 2. Multi-Level Inheritance Hierarchy
        System.out.println("\n[B] MULTI-LEVEL INHERITANCE HIERARCHY:");
        System.out.println("------------------------------------------------------------------");
        System.out.println("Level 1: Person (Abstract Base Class)");
        System.out.println("Level 2: └── Recruiter extends Person (Single Inheritance)");
        System.out.println("Level 3:     └── SeniorHRManager extends Recruiter (Multi-level Hierarchy)");

        SeniorHRManager hrManager = new SeniorHRManager(
                201, "Priya", "Menon", "priya.m@talentiq.com", "+91 9988776655",
                "Technology Hiring", 15, 75.0, "Enterprise Cloud & AI"
        );

        System.out.println("\nInstance of 3-Level Multi-level Class (SeniorHRManager):");
        System.out.println("Role Title:       " + hrManager.getRoleTitle());
        System.out.println("Summary:          " + hrManager.getDisplaySummary());
        System.out.println("Final Method Call: approveCompensationOffer(15,00,000) -> " +
                hrManager.approveCompensationOffer(1500000.0));

        // 3. Method Overloading (Compile-Time Polymorphism)
        System.out.println("\n[C] METHOD OVERLOADING (Compile-Time Polymorphism in Recruiter):");
        System.out.println("------------------------------------------------------------------");
        Recruiter recruiter = new Recruiter(301, "Vikram", "Malhotra", "vikram@talentiq.com", "9811223344", "Engineering", 10);
        System.out.println("Initial Hires: " + recruiter.getHiredCount());
        recruiter.recordHire(); // Overloaded Version 1: 0 arguments
        System.out.println("After recordHire(): " + recruiter.getHiredCount());
        recruiter.recordHire(3); // Overloaded Version 2: 1 argument (batch)
        System.out.println("After recordHire(3): " + recruiter.getHiredCount());

        // 4. Interfaces: Constants, Default Methods & Static Methods
        System.out.println("\n[D] INTERFACE ARCHITECTURE (RecordOperations<T>):");
        System.out.println("------------------------------------------------------------------");
        RecordOperations.printInterfaceContractSummary();
        CandidateDAO dao = new CandidateDAO();
        dao.logAudit("QUERY", 101, "Aishwarya Shree");
        System.out.println("Batch Permissible Check (500 records): " + dao.isBatchPermissible(500));
        System.out.println("================================================================================");
    }

    private static void runModule3ExceptionsAndThreading() {
        System.out.println("\n================================================================================");
        System.out.println("🛡️ MODULE III: EXCEPTION HANDLING (CUSTOM & BUILT-IN EXCEPTIONS)");
        System.out.println("================================================================================");

        RecruitmentManager manager = new RecruitmentManager();

        // 1. Unchecked Custom Exception (InvalidSalaryException)
        try {
            System.out.print("Testing InvalidSalaryException with negative salary: ");
            manager.validateSalaryParameters(-50000.0, 900000.0);
        } catch (InvalidSalaryException e) {
            System.out.println("CAUGHT EXPECTED EXCEPTION -> " + e.getMessage());
        }

        // 2. Checked Custom Exception (CandidateNotFoundException)
        try {
            System.out.print("Testing CandidateNotFoundException for non-existent candidate #999: ");
            manager.getCandidateSafely(999);
        } catch (CandidateNotFoundException e) {
            System.out.println("CAUGHT EXPECTED EXCEPTION -> [" + e.getErrorCode() + "] " + e.getMessage());
        }

        // 3. Multiple Catch Blocks with Built-in Exceptions
        System.out.println("\nTesting Multiple Catch Blocks (NumberFormatException & ArithmeticException):");
        try {
            String invalidSalaryStr = "FIFTY_LAKH";
            int parsed = Integer.parseInt(invalidSalaryStr);
            int division = parsed / 0;
            System.out.println("Result: " + division);
        } catch (NumberFormatException e) {
            System.out.println("   [Catch Block 1] Caught java.lang.NumberFormatException: Cannot parse text to number");
        } catch (ArithmeticException e) {
            System.out.println("   [Catch Block 2] Caught java.lang.ArithmeticException: Division by zero");
        } finally {
            System.out.println("   [Finally Block] Cleanup executed unconditionally (Guaranteed Resource Release).");
        }

        // Run Multithreading Demo
        ThreadLifeCycleDemo.runCompleteConcurrencyDemonstration();
    }

    private static void printCompletionSummary() {
        System.out.println("\n================================================================================");
        System.out.println("🎉 ALL 7 AMITY CSIT751 CORE JAVA SYLLABUS MODULES VERIFIED SUCCESSFULLY!");
        System.out.println("================================================================================");
        System.out.println("💡 PRO-TIP FOR EXAMINER / VIVA PRESENTATION:");
        System.out.println("   To launch the interactive Java Swing Desktop GUI, run:");
        System.out.println("   👉 /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java -cp \"java-service/lib/mysql-connector-j-8.4.0.jar:java-service/bin\" Main gui");
        System.out.println("================================================================================\n");
    }
}
