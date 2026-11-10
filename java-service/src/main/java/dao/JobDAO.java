package dao;

import exception.DatabaseConnectionException;
import exception.RecruitmentException;
import model.Job;
import util.DBConnection;
import util.RecordOperations;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - COLLECTIONS FRAMEWORK (HASHMAP) & JDBC
 * Data Access Object for Job Openings.
 * Demonstrates:
 * - Collections: HashMap<Integer, Job> for O(1) indexed lookups
 * - Collections: ArrayList<Job>
 * - PreparedStatement and ResultSet
 * ============================================================================
 */
public class JobDAO implements RecordOperations<Job> {

    @Override
    public Job findById(int id) throws RecruitmentException {
        String sql = "SELECT id, job_code, title, department, job_role, min_experience, " +
                "max_experience, min_salary, max_salary, location, company_size, status FROM jobs WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToJob(rs);
                } else {
                    return null;
                }
            }
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL error in JobDAO.findById: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Job> findAll() throws RecruitmentException {
        String sql = "SELECT id, job_code, title, department, job_role, min_experience, " +
                "max_experience, min_salary, max_salary, location, company_size, status FROM jobs ORDER BY id ASC";

        List<Job> jobs = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                jobs.add(mapRowToJob(rs));
            }
            return jobs;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("SQL error in JobDAO.findAll: " + e.getMessage(), e);
        }
    }

    /**
     * Demonstrates Collections Framework: HashMap<Integer, Job>
     * Caches all open jobs in a fast hash table indexed by primary key ID.
     */
    public Map<Integer, Job> getJobsAsIndexedMap() throws RecruitmentException {
        List<Job> allJobs = findAll();
        Map<Integer, Job> jobMap = new HashMap<>();

        for (Job job : allJobs) {
            jobMap.put(job.getId(), job);
        }

        return jobMap;
    }

    @Override
    public boolean create(Job j) throws RecruitmentException {
        String sql = "INSERT INTO jobs (job_code, title, department, job_role, min_experience, " +
                "max_experience, min_salary, max_salary, location, company_size, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, j.getJobCode());
            stmt.setString(2, j.getTitle());
            stmt.setString(3, j.getDepartment());
            stmt.setString(4, j.getJobRole());
            stmt.setDouble(5, j.getMinExperience());
            stmt.setDouble(6, j.getMaxExperience());
            stmt.setDouble(7, j.getMinSalary());
            stmt.setDouble(8, j.getMaxSalary());
            stmt.setString(9, j.getLocation());
            stmt.setString(10, j.getCompanySize());
            stmt.setString(11, j.getStatus() != null ? j.getStatus() : "OPEN");

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        j.setId(keys.getInt(1));
                    }
                }
                return true;
            }
            return false;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to insert Job: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean update(Job j) throws RecruitmentException {
        String sql = "UPDATE jobs SET title=?, department=?, job_role=?, min_experience=?, " +
                "max_experience=?, min_salary=?, max_salary=?, location=?, company_size=?, status=? " +
                "WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, j.getTitle());
            stmt.setString(2, j.getDepartment());
            stmt.setString(3, j.getJobRole());
            stmt.setDouble(4, j.getMinExperience());
            stmt.setDouble(5, j.getMaxExperience());
            stmt.setDouble(6, j.getMinSalary());
            stmt.setDouble(7, j.getMaxSalary());
            stmt.setString(8, j.getLocation());
            stmt.setString(9, j.getCompanySize());
            stmt.setString(10, j.getStatus());
            stmt.setInt(11, j.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to update Job: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(int id) throws RecruitmentException {
        String sql = "DELETE FROM jobs WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to delete Job: " + e.getMessage(), e);
        }
    }

    private Job mapRowToJob(ResultSet rs) throws SQLException {
        return new Job(
                rs.getInt("id"),
                rs.getString("job_code"),
                rs.getString("title"),
                rs.getString("department"),
                rs.getString("job_role"),
                rs.getDouble("min_experience"),
                rs.getDouble("max_experience"),
                rs.getDouble("min_salary"),
                rs.getDouble("max_salary"),
                rs.getString("location"),
                rs.getString("company_size"),
                rs.getString("status")
        );
    }
}
