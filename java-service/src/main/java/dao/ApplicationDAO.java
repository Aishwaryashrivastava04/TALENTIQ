package dao;

import exception.DatabaseConnectionException;
import exception.RecruitmentException;
import model.Application;
import util.DBConnection;
import util.RecordOperations;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - JDBC TRANSACTIONS & PREPAREDSTATEMENT
 * Data Access Object for Applications.
 * Demonstrates:
 * - ACID Transaction control (setAutoCommit(false), commit, rollback)
 * - PreparedStatements
 * - Multi-table join ResultSet queries
 * ============================================================================
 */
public class ApplicationDAO implements RecordOperations<Application> {

    @Override
    public Application findById(int id) throws RecruitmentException {
        String sql = "SELECT a.id, a.application_code, a.candidate_id, a.job_id, a.match_score, " +
                "a.status, a.notes, a.application_date, " +
                "CONCAT(c.first_name, ' ', c.last_name) AS candidate_name, j.title AS job_title " +
                "FROM applications a " +
                "JOIN candidates c ON a.candidate_id = c.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "WHERE a.id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToApplication(rs);
                }
                return null;
            }
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Error in ApplicationDAO.findById: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Application> findAll() throws RecruitmentException {
        String sql = "SELECT a.id, a.application_code, a.candidate_id, a.job_id, a.match_score, " +
                "a.status, a.notes, a.application_date, " +
                "CONCAT(c.first_name, ' ', c.last_name) AS candidate_name, j.title AS job_title " +
                "FROM applications a " +
                "JOIN candidates c ON a.candidate_id = c.id " +
                "JOIN jobs j ON a.job_id = j.id " +
                "ORDER BY a.id DESC";

        List<Application> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapRowToApplication(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Error in ApplicationDAO.findAll: " + e.getMessage(), e);
        }
    }

    /**
     * Creates application wrapped in a transactional boundary.
     */
    @Override
    public boolean create(Application app) throws RecruitmentException {
        String sql = "INSERT INTO applications (application_code, candidate_id, job_id, match_score, status, notes) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            // Start Transaction
            conn.setAutoCommit(false);

            try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setString(1, app.getApplicationCode());
                stmt.setInt(2, app.getCandidateId());
                stmt.setInt(3, app.getJobId());
                stmt.setDouble(4, app.getMatchScore());
                stmt.setString(5, app.getStatus() != null ? app.getStatus() : "APPLIED");
                stmt.setString(6, app.getNotes());

                int affected = stmt.executeUpdate();
                if (affected > 0) {
                    try (ResultSet keys = stmt.getGeneratedKeys()) {
                        if (keys.next()) {
                            app.setId(keys.getInt(1));
                        }
                    }
                    // Commit Transaction
                    conn.commit();
                    return true;
                } else {
                    conn.rollback();
                    return false;
                }
            }
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    System.err.println("Rollback failed: " + ex.getMessage());
                }
            }
            throw new DatabaseConnectionException("Transaction rolled back for Application: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Failed to reset auto-commit: " + e.getMessage());
                }
            }
        }
    }

    @Override
    public boolean update(Application app) throws RecruitmentException {
        String sql = "UPDATE applications SET status = ?, match_score = ?, notes = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, app.getStatus());
            stmt.setDouble(2, app.getMatchScore());
            stmt.setString(3, app.getNotes());
            stmt.setInt(4, app.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Error updating Application: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(int id) throws RecruitmentException {
        String sql = "DELETE FROM applications WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Error deleting Application: " + e.getMessage(), e);
        }
    }

    private Application mapRowToApplication(ResultSet rs) throws SQLException {
        Application app = new Application(
                rs.getInt("id"),
                rs.getString("application_code"),
                rs.getInt("candidate_id"),
                rs.getInt("job_id"),
                rs.getDouble("match_score"),
                rs.getString("status"),
                rs.getString("notes"),
                rs.getTimestamp("application_date")
        );
        app.setCandidateName(rs.getString("candidate_name"));
        app.setJobTitle(rs.getString("job_title"));
        return app;
    }
}
