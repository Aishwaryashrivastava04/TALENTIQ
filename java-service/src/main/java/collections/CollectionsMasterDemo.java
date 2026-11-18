package collections;

import model.Candidate;
import java.util.*;

/**
 * ============================================================================
 * MODULE IV: THE COLLECTION FRAMEWORK (java.util Package)
 * Demonstrates:
 * 1. Collections of Objects: ArrayList<Candidate> vs Vector<Candidate>
 * 2. Sets: HashSet<String> (Unique technical skills) vs TreeSet (Sorted skills)
 * 3. Maps: HashMap<Integer, Candidate> vs Hashtable<String, String> (Thread-safe)
 * 4. Understanding Hashing: Hash code calculation, bucket distribution, Collision handling
 * 5. Iterators: Iterator<Candidate>, ListIterator, and Comparator sorting
 * ============================================================================
 */
public class CollectionsMasterDemo {

    public static void runCollectionsDemonstration() {
        System.out.println("\n================================================================================");
        System.out.println("📚 MODULE IV: COLLECTIONS FRAMEWORK DEMONSTRATION (java.util Package)");
        System.out.println("================================================================================");

        // ---------------------------------------------------------------------
        // 1. ArrayList vs Vector Comparison
        // ---------------------------------------------------------------------
        System.out.println("\n[A] SEQUENCE TYPES: ArrayList vs Vector (Legacy Thread-Safe):");
        System.out.println("------------------------------------------------------------------");

        List<Candidate> arrayList = new ArrayList<>();
        Vector<Candidate> vectorList = new Vector<>();

        Candidate c1 = new Candidate(101, "CAN-101", "Amit", "Shah", "amit@test.com", "9876543210", 4.0, "BTECH", 900000.0, 1300000.0, "Mumbai", "AVAILABLE");
        Candidate c2 = new Candidate(102, "CAN-102", "Priya", "Sharma", "priya@test.com", "9876543211", 6.5, "MCA", 1400000.0, 1900000.0, "Noida", "AVAILABLE");
        Candidate c3 = new Candidate(103, "CAN-103", "Rahul", "Dravid", "rahul@test.com", "9876543212", 2.5, "BCA", 550000.0, 750000.0, "Bengaluru", "AVAILABLE");

        // Adding to ArrayList
        arrayList.add(c1);
        arrayList.add(c2);
        arrayList.add(c3);

        // Adding to Vector
        vectorList.add(c1);
        vectorList.add(c2);
        vectorList.add(c3);

        System.out.printf("ArrayList Size: %d (Dynamic array, non-synchronized, fast for single-thread)\n", arrayList.size());
        System.out.printf("Vector Size:    %d, Capacity: %d (Synchronized legacy collection)\n", vectorList.size(), vectorList.capacity());

        // Iterator traversal
        System.out.println("\nTraversing ArrayList using java.util.Iterator:");
        Iterator<Candidate> it = arrayList.iterator();
        while (it.hasNext()) {
            Candidate c = it.next();
            System.out.printf("   -> [%s] %-15s | Exp: %.1f yrs | Hike: %.2f%%\n",
                    c.getCandidateCode(), c.getFullName(), c.getExperienceYears(), c.calculateHikePercentage());
        }

        // ---------------------------------------------------------------------
        // 2. Set Collection (HashSet vs TreeSet)
        // ---------------------------------------------------------------------
        System.out.println("\n[B] SET TYPES: HashSet (Unique Hash Set) & TreeSet (Sorted Set):");
        System.out.println("------------------------------------------------------------------");

        Set<String> uniqueSkills = new HashSet<>();
        uniqueSkills.add("Java");
        uniqueSkills.add("Spring Boot");
        uniqueSkills.add("MySQL");
        uniqueSkills.add("Java"); // Duplicate entry - Set will ignore
        uniqueSkills.add("Docker");
        uniqueSkills.add("React");

        System.out.println("HashSet<String> unique skills (duplicate 'Java' safely eliminated):");
        System.out.println("   Skills Set: " + uniqueSkills);

        TreeSet<String> sortedSkills = new TreeSet<>(uniqueSkills);
        System.out.println("TreeSet<String> naturally sorted in alphabetical order:");
        System.out.println("   Sorted:     " + sortedSkills);

        // ---------------------------------------------------------------------
        // 3. Map Collection (HashMap vs Hashtable)
        // ---------------------------------------------------------------------
        System.out.println("\n[C] MAP TYPES: HashMap vs Hashtable & Understanding Hashing:");
        System.out.println("------------------------------------------------------------------");

        Map<Integer, Candidate> candidateMap = new HashMap<>();
        candidateMap.put(c1.getId(), c1);
        candidateMap.put(c2.getId(), c2);
        candidateMap.put(c3.getId(), c3);

        System.out.printf("HashMap<Integer, Candidate> populated with %d entries (O(1) constant-time lookup):\n", candidateMap.size());
        System.out.println("Direct Key Lookup for Candidate ID 102: " + candidateMap.get(102).getFullName());

        // Hashtable: Synchronized, does NOT permit null keys or values
        Hashtable<String, String> candidateStatusTable = new Hashtable<>();
        candidateStatusTable.put("CAN-101", "INTERVIEW_SCHEDULED");
        candidateStatusTable.put("CAN-102", "OFFER_EXTENDED");
        candidateStatusTable.put("CAN-103", "RESUME_SCREENED");

        System.out.println("\nHashtable<String, String> (Thread-safe key-value store):");
        for (Map.Entry<String, String> entry : candidateStatusTable.entrySet()) {
            System.out.printf("   Key: %-10s -> Status: %s\n", entry.getKey(), entry.getValue());
        }

        // ---------------------------------------------------------------------
        // 4. Understanding Hashing Details
        // ---------------------------------------------------------------------
        System.out.println("\n[D] UNDERSTANDING HASHING & BUCKET ALLOCATION:");
        System.out.println("------------------------------------------------------------------");
        String testKey1 = "CAN-101";
        String testKey2 = "CAN-102";
        int hash1 = testKey1.hashCode();
        int hash2 = testKey2.hashCode();
        int bucketIndex1 = Math.abs(hash1 % 16); // Assuming standard 16 initial bucket capacity
        int bucketIndex2 = Math.abs(hash2 % 16);

        System.out.printf("Key '%s' -> hashCode(): %d -> Bucket Index (hash %% 16): %d\n", testKey1, hash1, bucketIndex1);
        System.out.printf("Key '%s' -> hashCode(): %d -> Bucket Index (hash %% 16): %d\n", testKey2, hash2, bucketIndex2);
        System.out.println("------------------------------------------------------------------");
    }
}
