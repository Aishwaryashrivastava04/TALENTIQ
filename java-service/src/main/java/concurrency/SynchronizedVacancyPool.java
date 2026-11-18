package concurrency;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * MODULE III: EXCEPTION HANDLING & THREAD IN JAVA
 * Demonstrates:
 * - Thread Synchronization (synchronized methods & blocks)
 * - Inter-thread communication using wait(), notify(), notifyAll()
 * - Preventing Race Conditions on shared vacancy allocation pool
 * ============================================================================
 */
public class SynchronizedVacancyPool {
    private final String jobTitle;
    private int availableSlots;
    private final int totalCapacity;
    private final List<String> allocatedCandidates;

    public SynchronizedVacancyPool(String jobTitle, int initialSlots) {
        this.jobTitle = jobTitle;
        this.availableSlots = initialSlots;
        this.totalCapacity = initialSlots;
        this.allocatedCandidates = new ArrayList<>();
    }

    /**
     * Synchronized Method: Thread-safe slot allocation.
     * Prevents race condition where multiple recruiter threads hire for the same last slot.
     */
    public synchronized boolean allocateSlot(String candidateName) {
        String thread = Thread.currentThread().getName();
        if (availableSlots > 0) {
            availableSlots--;
            allocatedCandidates.add(candidateName);
            System.out.printf("   [%s] ✅ Slot GRANTED to %-18s | Slots Remaining: %d/%d\n",
                    thread, candidateName, availableSlots, totalCapacity);
            return true;
        } else {
            System.out.printf("   [%s] ❌ Slot REJECTED for %-16s | Job '%s' is FULL (%d/%d)\n",
                    thread, candidateName, jobTitle, totalCapacity, totalCapacity);
            return false;
        }
    }

    /**
     * Synchronized with wait() and notifyAll():
     * Demonstrates Producer-Consumer style inter-thread communication.
     */
    public synchronized void awaitAndAllocateSlot(String candidateName, long timeoutMs) throws InterruptedException {
        String thread = Thread.currentThread().getName();
        long startTime = System.currentTimeMillis();

        while (availableSlots <= 0) {
            long elapsed = System.currentTimeMillis() - startTime;
            long remaining = timeoutMs - elapsed;
            if (remaining <= 0) {
                System.out.printf("   [%s] ⏱️ TIMEOUT waiting for vacancy for %s\n", thread, candidateName);
                return;
            }
            System.out.printf("   [%s] ⏳ No slots available for %s. Entering WAITING state...\n", thread, candidateName);
            wait(remaining);
        }

        availableSlots--;
        allocatedCandidates.add(candidateName);
        System.out.printf("   [%s] 🎯 Slot ALLOCATED after notification to: %s (Remaining: %d)\n",
                thread, candidateName, availableSlots);
    }

    /**
     * Releasing a slot calls notifyAll() to awaken waiting threads.
     */
    public synchronized void releaseSlot(String candidateName) {
        String thread = Thread.currentThread().getName();
        availableSlots++;
        allocatedCandidates.remove(candidateName);
        System.out.printf("   [%s] 🔄 Slot RELEASED by %s. Slots Now: %d. Notifying waiting threads...\n",
                thread, candidateName, availableSlots);
        notifyAll();
    }

    public synchronized int getAvailableSlots() {
        return availableSlots;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public synchronized List<String> getAllocatedCandidates() {
        return new ArrayList<>(allocatedCandidates);
    }
}
