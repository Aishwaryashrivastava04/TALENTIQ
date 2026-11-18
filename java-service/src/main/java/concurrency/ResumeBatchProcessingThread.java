package concurrency;

import java.util.List;

/**
 * ============================================================================
 * MODULE III: CREATING THREAD BY EXTENDING java.lang.Thread CLASS
 * Demonstrates:
 * - Thread Class Extension
 * - Overriding run() method
 * - Thread Lifecycle (NEW -> RUNNABLE -> RUNNING -> TERMINATED)
 * - Thread naming and priority inspection
 * ============================================================================
 */
public class ResumeBatchProcessingThread extends Thread {
    private final List<String> resumeBatch;
    private final SynchronizedVacancyPool vacancyPool;
    private int processedCount = 0;

    public ResumeBatchProcessingThread(String threadName, int priority,
                                      List<String> resumeBatch, SynchronizedVacancyPool pool) {
        super(threadName);
        setPriority(priority); // Sets thread priority (1 to 10)
        this.resumeBatch = resumeBatch;
        this.vacancyPool = pool;
    }

    @Override
    public void run() {
        System.out.printf("🚀 [%s | Priority: %d | State: %s] Started batch processing of %d resumes...\n",
                getName(), getPriority(), getState(), resumeBatch.size());

        for (String candidateName : resumeBatch) {
            try {
                // Simulate processing latency
                Thread.sleep(80);

                // Attempt synchronized slot allocation
                vacancyPool.allocateSlot(candidateName);
                processedCount++;

            } catch (InterruptedException e) {
                System.out.printf("⚠️ [%s] Thread interrupted while processing %s\n", getName(), candidateName);
                interrupt();
                break;
            }
        }

        System.out.printf("🏁 [%s] Batch completed. Total candidates processed: %d\n",
                getName(), processedCount);
    }

    public int getProcessedCount() {
        return processedCount;
    }
}
