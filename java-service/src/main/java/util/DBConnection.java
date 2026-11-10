package util;

import exception.DatabaseConnectionException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * ============================================================================
 * SUBJECT 2: CORE JAVA - JDBC CONNECTIVITY
 * Database Connection Utility for MySQL 8.4 LTS.
 * Demonstrates:
 * - Loading JDBC Driver dynamically (Class.forName)
 * - Establishing Connection via DriverManager
 * - Safe exception handling wrapping
 * ============================================================================
 */
public class DBConnection {
    private static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";

    private static String getEnv(String key, String defaultValue) {
        String val = System.getenv(key);
        return (val != null && !val.trim().isEmpty()) ? val.trim() : defaultValue;
    }

    public static Connection getConnection() throws DatabaseConnectionException {
        String host = getEnv("DB_HOST", "127.0.0.1");
        String port = getEnv("DB_PORT", "3306");
        String dbName = getEnv("DB_NAME", "smart_recruitment_db");
        String user = getEnv("DB_USER", "root");
        String password = getEnv("DB_PASSWORD", "");

        String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + dbName +
                "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";

        try {
            Class.forName(DRIVER_CLASS);
            return DriverManager.getConnection(jdbcUrl, user, password);
        } catch (ClassNotFoundException e) {
            throw new DatabaseConnectionException("MySQL JDBC Driver Class Not Found: " + DRIVER_CLASS, e);
        } catch (SQLException e) {
            throw new DatabaseConnectionException("Failed to establish JDBC Connection to: " + jdbcUrl + " (User: " + user + ")", e);
        }
    }
}
