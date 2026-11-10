package service;

import dao.ApplicationDAO;
import dao.CandidateDAO;
import dao.JobDAO;
import exception.CandidateNotFoundException;
import exception.InvalidSalaryException;
import exception.RecruitmentException;
import model.Application;
import model.Candidate;
import model.Job;
import model.Person;

import java.util.*;
import java.util.concurrent.*;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - BUSINESS LOGIC, COLLECTIONS & EXCEPTION HANDLING
 * Enterprise Service coordinator demonstrating:
 * - Polymorphism in action (treating Candidate as Person)
 * - Java Collections Framework (ArrayList, HashMap)
 * - Filtering, Sorting via Comparators
 * - Custom Exception handling
 * ============================================================================
 */
public class RecruitmentManager {
    private final CandidateDAO candidateDAO;
    private final JobDAO jobDAO;
    private final ApplicationDAO applicationDAO;

    public RecruitmentManager() {
        this.candidateDAO = new CandidateDAO();
        this.jobDAO = new JobDAO();
        this.applicationDAO = new ApplicationDAO();
    }

    /**
     * Demonstrates Polymorphism: Accepts abstract Person type.
     */
    public void printPersonBio(Person person) {
        System.out.println("--------------------------------------------------");
        System.out.println("Role:    " + person.getRoleTitle());
        System.out.println("Summary: " + person.getDisplaySummary());
        System.out.println("--------------------------------------------------");
    }

    /**
     * Demonstrates Collections: HashMap grouping candidates by Education Level.
     */
    public Map<String, List<Candidate>> groupCandidatesByEducation() throws RecruitmentException {
        List<Candidate> all = candidateDAO.findAll();
        Map<String, List<Candidate>> grouped = new HashMap<>();

        for (Candidate c : all) {
            String edu = c.getEducationLevel();
            grouped.computeIfAbsent(edu, k -> new ArrayList<>()).add(c);
        }

        return grouped;
    }

    /**
     * Demonstrates Collections: Sorting ArrayList using Comparator.
     */
    public List<Candidate> getCandidatesSortedByExperience() throws RecruitmentException {
        List<Candidate> all = candidateDAO.findAll();
        all.sort((c1, c2) -> Double.compare(c2.getExperienceYears(), c1.getExperienceYears())); // Descending
        return all;
    }

    /**
     * Validates candidate salary inputs against domain rules.
     * Throws custom RuntimeException (InvalidSalaryException).
     */
    public void validateSalaryParameters(double currentSalary, double expectedSalary) {
        if (currentSalary < 0) {
            throw new InvalidSalaryException("Current salary cannot be negative: ₹" + currentSalary, currentSalary);
        }
        if (expectedSalary < 0) {
            throw new InvalidSalaryException("Expected salary cannot be negative: ₹" + expectedSalary, expectedSalary);
        }
    }

    /**
     * Retrieves Candidate with detailed exception handling.
     */
    public Candidate getCandidateSafely(int id) throws CandidateNotFoundException {
        try {
            return candidateDAO.findById(id);
        } catch (CandidateNotFoundException e) {
            throw e;
        } catch (RecruitmentException e) {
            System.err.println("Database error during candidate retrieval: " + e.getMessage());
            throw new CandidateNotFoundException("Unable to retrieve candidate ID: " + id + " due to system error", String.valueOf(id));
        }
    }

    public List<Candidate> getAllCandidates() throws RecruitmentException {
        return candidateDAO.findAll();
    }

    public List<Job> getAllJobs() throws RecruitmentException {
        return jobDAO.findAll();
    }

    public List<Application> getAllApplications() throws RecruitmentException {
        return applicationDAO.findAll();
    }

    /**
     * Demonstrates Java Multithreading with ExecutorService and Callable tasks.
     * Concurrently calculates candidate compensation analytics across a fixed thread pool.
     */
    public List<String> processCandidateMetricsConcurrently(List<Candidate> candidates) {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        List<Future<String>> futures = new ArrayList<>();

        for (Candidate c : candidates) {
            Callable<String> task = () -> {
                double hike = c.calculateHikePercentage();
                String threadName = Thread.currentThread().getName();
                return String.format("[%s] Candidate: %s | Hike: %.2f%% | Exp: %.1f yrs | Role: %s",
                        threadName, c.getFullName(), hike, c.getExperienceYears(), c.getRoleTitle());
            };
            futures.add(executor.submit(task));
        }

        List<String> results = new ArrayList<>();
        for (Future<String> f : futures) {
            try {
                results.add(f.get());
            } catch (Exception e) {
                results.add("Async task execution error: " + e.getMessage());
            }
        }

        executor.shutdown();
        return results;
    }

    /**
     * Demonstrates ACID Transaction Coordinator.
     */
    public boolean executeHiringTransaction(int candidateId, int applicationId, double finalSalary) throws RecruitmentException {
        return candidateDAO.hireCandidateTransaction(candidateId, applicationId, finalSalary);
    }
}
