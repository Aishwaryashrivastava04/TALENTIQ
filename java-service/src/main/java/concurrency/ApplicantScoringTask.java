package concurrency;

/**
 * ============================================================================
 * MODULE III: CREATING THREAD BY IMPLEMENTING java.lang.Runnable INTERFACE
 * Demonstrates:
 * - Runnable Interface implementation
 * - Separation of task execution from Thread object
 * - Thread state transitions & thread cooperation using join()
 * ============================================================================
 */
public class ApplicantScoringTask implements Runnable {
    private final String applicantName;
    private final double experienceYears;
    private final double expectedHike;
    private double calculatedScore = 0.0;

    public ApplicantScoringTask(String applicantName, double experienceYears, double expectedHike) {
        this.applicantName = applicantName;
        this.experienceYears = experienceYears;
        this.expectedHike = expectedHike;
    }

    @Override
    public void run() {
        String thread = Thread.currentThread().getName();
        try {
            // Simulate AI matching algorithm computation
            Thread.sleep(60);

            // Compute composite score (Weight: 60% Experience, 40% Reasonable Hike)
            double expScore = Math.min(100.0, experienceYears * 15.0);
            double hikeScore = expectedHike <= 30.0 ? 95.0 : Math.max(50.0, 100.0 - (expectedHike - 30.0));
            this.calculatedScore = (expScore * 0.6) + (hikeScore * 0.4);

            System.out.printf("   [%s] Evaluated %-16s -> Compatibility Score: %.2f/100 (Exp: %.1f yrs, Hike: %.1f%%)\n",
                    thread, applicantName, calculatedScore, experienceYears, expectedHike);

        } catch (InterruptedException e) {
            System.err.println("Scoring task interrupted for: " + applicantName);
            Thread.currentThread().interrupt();
        }
    }

    public double getCalculatedScore() {
        return calculatedScore;
    }

    public String getApplicantName() {
        return applicantName;
    }
}
