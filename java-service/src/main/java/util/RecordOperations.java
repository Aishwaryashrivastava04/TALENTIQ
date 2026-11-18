package util;

import exception.RecruitmentException;
import java.util.List;

/**
 * ============================================================================
 * MODULE II: JAVA WITH OBJECT ORIENTED FEATURES - INTERFACE CONTRACT
 * Demonstrates all syllabus interface concepts:
 * 1. Defining Interfaces
 * 2. Constants in Interfaces (public static final by default)
 * 3. Abstract Methods in Interfaces
 * 4. Default Methods in Interfaces (Java 8+ backward compatibility)
 * 5. Static Methods in Interfaces (Utility methods directly on interface)
 * 6. Generics (<T>)
 * ============================================================================
 */
public interface RecordOperations<T> {

    // 1. Constants in Interfaces (implicitly public static final)
    String SYSTEM_CODE = "TALENTIQ_CORE";
    int DEFAULT_PAGE_SIZE = 25;
    int MAX_BATCH_CAPACITY = 1000;

    // 2. Abstract Methods (implicitly public abstract)
    T findById(int id) throws RecruitmentException;
    List<T> findAll() throws RecruitmentException;
    boolean create(T entity) throws RecruitmentException;
    boolean update(T entity) throws RecruitmentException;
    boolean delete(int id) throws RecruitmentException;

    // 3. Default Methods in Interfaces (Module II syllabus requirement)
    default void logAudit(String operation, int recordId, String user) {
        System.out.printf("[INTERFACE AUDIT LOG | %s] Op: %-8s | Target ID: %-5d | ExecutedBy: %s\n",
                SYSTEM_CODE, operation, recordId, user);
    }

    default boolean isBatchPermissible(int recordCount) {
        return recordCount > 0 && recordCount <= MAX_BATCH_CAPACITY;
    }

    // 4. Static Methods in Interfaces (Module II syllabus requirement)
    static String getSpecificationVersion() {
        return "Amity-CSIT751-CoreJava-v2026.1";
    }

    static void printInterfaceContractSummary() {
        System.out.println("------------------------------------------------------------------");
        System.out.println("Interface: RecordOperations<T>");
        System.out.println("Constants: SYSTEM_CODE=" + SYSTEM_CODE + ", MAX_BATCH=" + MAX_BATCH_CAPACITY);
        System.out.println("Spec Ver:  " + getSpecificationVersion());
        System.out.println("------------------------------------------------------------------");
    }
}
