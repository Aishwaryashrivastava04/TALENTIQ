package dao;

import exception.CandidateNotFoundException;
import exception.DatabaseConnectionException;
import exception.RecruitmentException;
import model.Candidate;
import util.DBConnection;
import util.RecordOperations;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - JDBC, PREPAREDSTATEMENT, RESULTSET & COLLECTIONS
 * Data Access Object for Candidate entities.
 * Demonstrates:
 * - Implementing Generic Interface: RecordOperations<Candidate>
 * - Collections: ArrayList<Candidate>
 * - JDBC PreparedStatement to prevent SQL Injection
 * - JDBC ResultSet mapping to Java Object
 * - Custom Exception propagation (CandidateNotFoundException)
 * ============================================================================
 */
public class CandidateDAO implements RecordOperations<Candidate> {

    @Override
    public Candidate findById(int id) throws RecruitmentException {
        String sql = "SELECT id, candidate_code, first_name, last_name, email, phone, " +
                "experience_years, education_level, current_salary, expected_salary, location, status " +
                "FROM candidates WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToCandidate(rs);
                } else {
                    throw new CandidateNotFoundException("Candidate record not found with ID: " + id, String.valueOf(id));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL execution error during findById: " + e.getMessage(), e);
        }
    }

    public Candidate findByCode(String candidateCode) throws RecruitmentException {
        String sql = "SELECT id, candidate_code, first_name, last_name, email, phone, " +
                "experience_years, education_level, current_salary, expected_salary, location, status " +
                "FROM candidates WHERE candidate_code = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, candidateCode);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToCandidate(rs);
                } else {
                    throw new CandidateNotFoundException("Candidate not found with Code: " + candidateCode, candidateCode);
                }
            }
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL error during findByCode: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Candidate> findAll() throws RecruitmentException {
        String sql = "SELECT id, candidate_code, first_name, last_name, email, phone, " +
                "experience_years, education_level, current_salary, expected_salary, location, status " +
                "FROM candidates ORDER BY id ASC";

        // Collections Framework: ArrayList
        List<Candidate> candidatesList = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                candidatesList.add(mapRowToCandidate(rs));
            }

            return candidatesList;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL error during findAll candidates: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean create(Candidate c) throws RecruitmentException {
        String sql = "INSERT INTO candidates (candidate_code, first_name, last_name, email, phone, " +
                "experience_years, education_level, current_salary, expected_salary, location, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, c.getCandidateCode());
            stmt.setString(2, c.getFirstName());
            stmt.setString(3, c.getLastName());
            stmt.setString(4, c.getEmail());
            stmt.setString(5, c.getPhone());
            stmt.setDouble(6, c.getExperienceYears());
            stmt.setString(7, c.getEducationLevel());
            stmt.setDouble(8, c.getCurrentSalary());
            stmt.setDouble(9, c.getExpectedSalary());
            stmt.setString(10, c.getLocation());
            stmt.setString(11, c.getStatus() != null ? c.getStatus() : "AVAILABLE");

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        c.setId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
            return false;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to insert candidate: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean update(Candidate c) throws RecruitmentException {
        String sql = "UPDATE candidates SET first_name=?, last_name=?, email=?, phone=?, " +
                "experience_years=?, education_level=?, current_salary=?, expected_salary=?, location=?, status=? " +
                "WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, c.getFirstName());
            stmt.setString(2, c.getLastName());
            stmt.setString(3, c.getEmail());
            stmt.setString(4, c.getPhone());
            stmt.setDouble(5, c.getExperienceYears());
            stmt.setString(6, c.getEducationLevel());
            stmt.setDouble(7, c.getCurrentSalary());
            stmt.setDouble(8, c.getExpectedSalary());
            stmt.setString(9, c.getLocation());
            stmt.setString(10, c.getStatus());
            stmt.setInt(11, c.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to update candidate: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(int id) throws RecruitmentException {
        String sql = "DELETE FROM candidates WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int rows = stmt.executeUpdate();
            if (rows == 0) {
                throw new CandidateNotFoundException("No candidate found to delete with ID: " + id, String.valueOf(id));
            }
            return true;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to delete candidate: " + e.getMessage(), e);
        }
    }

    /**
     * Executes an ACID-compliant JDBC Transaction.
     * Atomically:
     * 1. Updates candidate status to 'HIRED' and sets final salary
     * 2. Updates application status to 'SELECTED'
     * 3. Writes an entry into the audit_logs table
     * Demonstrates setAutoCommit(false), commit(), and rollback().
     */
    public boolean hireCandidateTransaction(int candidateId, int applicationId, double finalSalary) throws RecruitmentException {
        Connection conn = null;
        PreparedStatement updateCandStmt = null;
        PreparedStatement updateAppStmt = null;
        PreparedStatement auditStmt = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Begin ACID Transaction

            // Step 1: Update Candidate Status & Final Salary
            String sqlCand = "UPDATE candidates SET status = 'HIRED', current_salary = ? WHERE id = ?";
            updateCandStmt = conn.prepareStatement(sqlCand);
            updateCandStmt.setDouble(1, finalSalary);
            updateCandStmt.setInt(2, candidateId);
            updateCandStmt.executeUpdate();

            // Step 2: Update Application Lifecycle Status to SELECTED
            String sqlApp = "UPDATE applications SET status = 'SELECTED' WHERE id = ?";
            updateAppStmt = conn.prepareStatement(sqlApp);
            updateAppStmt.setInt(1, applicationId);
            updateAppStmt.executeUpdate();

            // Step 3: Insert Audit Trail Entry
            String sqlAudit = "INSERT INTO audit_logs (entity_name, entity_id, action_type, performed_by) VALUES ('candidates', ?, 'UPDATE', 'JAVA_JDBC_TRANSACTION')";
            auditStmt = conn.prepareStatement(sqlAudit);
            auditStmt.setInt(1, candidateId);
            auditStmt.executeUpdate();

            // Commit all operations atomically
            conn.commit();
            System.out.println("✅ [JDBC Transaction] ACID Transaction committed successfully for Candidate ID: " + candidateId);
            return true;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    System.err.println("⚠️ [JDBC Transaction] Rolling back transaction due to error: " + e.getMessage());
                    conn.rollback();
                } catch (SQLException rbEx) {
                    System.err.println("⚠️ Rollback failure: " + rbEx.getMessage());
                }
            }
            throw new DatabaseConnectionException("Transaction failed: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Maps JDBC ResultSet row into a Candidate object.
     */
    private Candidate mapRowToCandidate(ResultSet rs) throws SQLException {
        return new Candidate(
                rs.getInt("id"),
                rs.getString("candidate_code"),
                rs.getString("first_name"),
                rs.getString("last_name"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getDouble("experience_years"),
                rs.getString("education_level"),
                rs.getDouble("current_salary"),
                rs.getDouble("expected_salary"),
                rs.getString("location"),
                rs.getString("status")
        );
    }
}
