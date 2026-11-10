package util;

import exception.RecruitmentException;
import java.util.List;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - INTERFACES
 * Generic Data Access Interface contract enforcing CRUD operations.
 * Demonstrates:
 * - Interface definition
 * - Java Generics (<T>)
 * - Checked Exception declarations
 * ============================================================================
 */
public interface RecordOperations<T> {
    T findById(int id) throws RecruitmentException;
    List<T> findAll() throws RecruitmentException;
    boolean create(T entity) throws RecruitmentException;
    boolean update(T entity) throws RecruitmentException;
    boolean delete(int id) throws RecruitmentException;
}
