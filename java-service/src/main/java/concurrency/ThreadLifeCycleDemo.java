package concurrency;

import java.util.Arrays;
import java.util.List;

/**
 * ============================================================================
 * MODULE III: MULTITHREADING DEMONSTRATION HARNESS
 * Demonstrates:
 * 1. Thread Life Cycle (NEW -> RUNNABLE -> TIMED_WAITING -> TERMINATED)
 * 2. Creating threads via Thread class vs Runnable interface
 * 3. Thread Priorities (MIN_PRIORITY=1, NORM_PRIORITY=5, MAX_PRIORITY=10)
 * 4. Synchronization on shared VacancyPool
 * 5. Inter-thread coordination using join(), wait(), and notify()
 * ============================================================================
 */
public class ThreadLifeCycleDemo {

    public static void runCompleteConcurrencyDemonstration() {
        System.out.println("\n================================================================================");
        System.out.println("🧵 MODULE III: MULTITHREADING, THREAD LIFECYCLE & SYNCHRONIZATION DEMO");
        System.out.println("================================================================================");

        // 1. Thread Life Cycle Tracking
        System.out.println("\n[A] THREAD LIFECYCLE STATES DEMO:");
        System.out.println("------------------------------------------------------------------");

        Thread lifeCycleThread = new Thread(() -> {
            try {
                Thread.sleep(150);
            } catch (InterruptedException ignored) {}
        }, "Lifecycle-Sample-Thread");

        System.out.println("1. State after creation (before start):      " + lifeCycleThread.getState() + " (NEW)");
        lifeCycleThread.start();
        System.out.println("2. State immediately after start():          " + lifeCycleThread.getState() + " (RUNNABLE)");

        try {
            Thread.sleep(50);
            System.out.println("3. State during Thread.sleep():              " + lifeCycleThread.getState() + " (TIMED_WAITING)");
            lifeCycleThread.join();
        } catch (InterruptedException ignored) {}

        System.out.println("4. State after execution completion:         " + lifeCycleThread.getState() + " (TERMINATED)");

        // 2. Runnable Interface with join()
        System.out.println("\n[B] RUNNABLE TASKS WITH THREAD COORDINATION (join()):");
        System.out.println("------------------------------------------------------------------");

        ApplicantScoringTask task1 = new ApplicantScoringTask("Aarav Sharma", 4.5, 25.0);
        ApplicantScoringTask task2 = new ApplicantScoringTask("Meera Nair", 6.0, 15.0);
        ApplicantScoringTask task3 = new ApplicantScoringTask("Rohan Gupta", 2.0, 45.0);

        Thread t1 = new Thread(task1, "Scorer-Thread-1");
        Thread t2 = new Thread(task2, "Scorer-Thread-2");
        Thread t3 = new Thread(task3, "Scorer-Thread-3");

        // Setting Thread Priorities
        t1.setPriority(Thread.MAX_PRIORITY);  // 10
        t2.setPriority(Thread.NORM_PRIORITY); // 5
        t3.setPriority(Thread.MIN_PRIORITY);  // 1

        System.out.printf("Starting 3 Scorer threads with priorities: %s=%d, %s=%d, %s=%d\n",
                t1.getName(), t1.getPriority(), t2.getName(), t2.getPriority(), t3.getName(), t3.getPriority());

        t1.start();
        t2.start();
        t3.start();

        try {
            t1.join();
            t2.join();
            t3.join();
            System.out.println("✅ All 3 Runnable scoring threads completed via join().");
        } catch (InterruptedException e) {
            System.err.println("Thread join error: " + e.getMessage());
        }

        // 3. Thread Synchronization on Shared Resource
        System.out.println("\n[C] THREAD SYNCHRONIZATION (Shared Vacancy Pool with 3 Slots):");
        System.out.println("------------------------------------------------------------------");

        SynchronizedVacancyPool sharedPool = new SynchronizedVacancyPool("Full Stack Java Engineer", 3);

        List<String> recruiterBatchA = Arrays.asList("Kavita Rao", "Deepak Joshi", "Suresh Pillai");
        List<String> recruiterBatchB = Arrays.asList("Pooja Mehta", "Karthik Raja", "Neha Sen");

        ResumeBatchProcessingThread threadA = new ResumeBatchProcessingThread(
                "RecruiterThread-Bengaluru", Thread.NORM_PRIORITY, recruiterBatchA, sharedPool);
        ResumeBatchProcessingThread threadB = new ResumeBatchProcessingThread(
                "RecruiterThread-Hyderabad", Thread.NORM_PRIORITY, recruiterBatchB, sharedPool);

        threadA.start();
        threadB.start();

        try {
            threadA.join();
            threadB.join();
        } catch (InterruptedException ignored) {}

        System.out.printf("\n📊 Synchronized Pool Final Summary: %d slots remaining out of 3. Total Hires: %d\n",
                sharedPool.getAvailableSlots(), sharedPool.getAllocatedCandidates().size());
        System.out.println("   Allocated Hires: " + sharedPool.getAllocatedCandidates());
        System.out.println("------------------------------------------------------------------");
    }
}
