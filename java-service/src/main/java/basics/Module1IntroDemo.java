package basics;

/**
 * ============================================================================
 * MODULE I: INTRODUCTION TO JAVA & FUNDAMENTAL PROGRAMMING
 * Demonstrates:
 * 1. History of Java, JDK Tools, Java Bytecode & JVM Architecture
 * 2. Identifiers, Primitive Data Types & Operators
 * 3. Control Statements: if-else-if ladder & switch-case
 * 4. Loops: for, while, do-while, and enhanced for-each
 * 5. Arrays: 1D Array of Scores & 2D Matrix of Multi-Round Interview Evaluations
 * ============================================================================
 */
public class Module1IntroDemo {

    public static void runModule1Demonstration() {
        System.out.println("\n================================================================================");
        System.out.println("☕ MODULE I: INTRODUCTION TO JAVA, JVM & BASIC PROGRAMMING DEMO");
        System.out.println("================================================================================");

        // 1. History & JVM Architecture
        System.out.println("\n[A] JAVA ARCHITECTURE, JVM & BYTECODE:");
        System.out.println("------------------------------------------------------------------");
        System.out.println("• History: Developed by James Gosling at Sun Microsystems (1995), now Oracle.");
        System.out.println("• Paradigm: WORA (Write Once, Run Anywhere) enabled by Java Bytecode (.class).");
        System.out.println("• JDK Tools: javac (Compiler), java (Launcher), javap (Disassembler), jar (Packager).");
        System.out.println("• JVM Architecture: ClassLoader Subsystem -> JVM Memory (Method Area, Heap,");
        System.out.println("  Stack, PC Register, Native Stack) -> Execution Engine (JIT Compiler, GC).");

        // 2. Data Types & Operators
        System.out.println("\n[B] DATA TYPES & OPERATORS:");
        System.out.println("------------------------------------------------------------------");
        int candidateId = 101;
        double baseSalary = 850000.0;
        float experienceYears = 4.5f;
        char grade = 'A';
        boolean isShortlisted = true;

        double bonus = baseSalary * 0.15; // Arithmetic operator
        boolean qualifiesSenior = (experienceYears >= 4.0f) && isShortlisted; // Relational & Logical
        String candidateBand = qualifiesSenior ? "TIER-1 SENIOR" : "TIER-2 STANDARD"; // Ternary

        System.out.printf("Candidate ID: %d | Base: ₹%,.2f | Exp: %.1f yrs | Grade: %c | Shortlisted: %b\n",
                candidateId, baseSalary, experienceYears, grade, isShortlisted);
        System.out.printf("Computed Bonus (15%%): ₹%,.2f | Qualified Senior: %b | Band: %s\n",
                bonus, qualifiesSenior, candidateBand);

        // 3. Control Statements & Switch
        System.out.println("\n[C] CONTROL STATEMENTS (Switch-Case Evaluation):");
        System.out.println("------------------------------------------------------------------");
        String hiringStage = "INTERVIEW";
        String nextAction;

        switch (hiringStage) {
            case "SCREENING":
                nextAction = "Verify resume credentials and ATS match score";
                break;
            case "INTERVIEW":
                nextAction = "Schedule technical panel and live coding assessment";
                break;
            case "OFFER":
                nextAction = "Generate formal compensation letter and background verification";
                break;
            default:
                nextAction = "Maintain in talent pool for future openings";
                break;
        }
        System.out.printf("Current Stage: '%s' -> Next Action: %s\n", hiringStage, nextAction);

        // 4. Arrays (1D Array & 2D Matrix Evaluation)
        System.out.println("\n[D] 1D ARRAYS & 2D MULTI-ROUND INTERVIEW MATRIX:");
        System.out.println("------------------------------------------------------------------");

        // 1D Array of ATS Candidate Scores
        double[] candidateAptitude = {85.5, 92.0, 78.5, 96.0, 88.0};
        double total = 0.0;
        for (double score : candidateAptitude) {
            total += score;
        }
        double avg = total / candidateAptitude.length;
        System.out.printf("1D Array: %d Candidates Evaluated | Average ATS Score: %.2f%%\n",
                candidateAptitude.length, avg);

        // 2D Array Matrix: 3 Candidates evaluated across 3 Rounds (Technical, System Design, HR)
        // Rows = Candidates, Columns = Rounds
        double[][] evaluationMatrix = {
                {88.0, 92.0, 95.0}, // Candidate 1 (Aishwarya Shree)
                {75.0, 80.0, 82.0}, // Candidate 2 (Rahul Verma)
                {90.0, 88.0, 85.0}  // Candidate 3 (Priya Menon)
        };

        String[] candidateNames = {"Aishwarya Shree", "Rahul Verma", "Priya Menon"};
        String[] roundNames = {"Round 1 (Coding)", "Round 2 (Design)", "Round 3 (HR)"};

        System.out.println("\n2D Matrix Interview Scores (3 Candidates x 3 Evaluation Rounds):");
        System.out.printf("%-18s | %-16s | %-16s | %-16s | %-10s\n",
                "Candidate", roundNames[0], roundNames[1], roundNames[2], "Average");
        System.out.println("--------------------------------------------------------------------------------------");

        for (int i = 0; i < evaluationMatrix.length; i++) {
            double rowSum = 0.0;
            System.out.printf("%-18s | ", candidateNames[i]);
            for (int j = 0; j < evaluationMatrix[i].length; j++) {
                System.out.printf("%-16.1f | ", evaluationMatrix[i][j]);
                rowSum += evaluationMatrix[i][j];
            }
            double candidateAvg = rowSum / evaluationMatrix[i].length;
            System.out.printf("%.2f%%\n", candidateAvg);
        }
        System.out.println("================================================================================");
    }
}
