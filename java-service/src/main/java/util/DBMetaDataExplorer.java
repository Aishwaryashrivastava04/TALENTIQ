package util;

import exception.RecruitmentException;
import java.sql.*;

/**
 * ============================================================================
 * MODULE VI: DATABASE PROGRAMMING USING JDBC & METADATA
 * Demonstrates:
 * 1. JDBC Architecture & java.sql.* Package
 * 2. Connection Interface & Statement Execution
 * 3. DatabaseMetaData (RDBMS Engine details, Driver info)
 * 4. ResultSetMetaData (Column Count, Column Names, SQL Data Types, Nullability)
 * ============================================================================
 */
public class DBMetaDataExplorer {

    public static void printTableMetaData(String tableName) {
        System.out.println("\n------------------------------------------------------------------");
        System.out.printf("📊 [JDBC METADATA] Inspecting Schema for Table: '%s'\n", tableName);
        System.out.println("------------------------------------------------------------------");

        try (Connection conn = DBConnection.getConnection()) {
            // 1. DatabaseMetaData Inspection
            DatabaseMetaData dbMeta = conn.getMetaData();
            System.out.println("Database Product Name:    " + dbMeta.getDatabaseProductName());
            System.out.println("Database Product Version: " + dbMeta.getDatabaseProductVersion());
            System.out.println("JDBC Driver Name:         " + dbMeta.getDriverName());
            System.out.println("JDBC Driver Version:      " + dbMeta.getDriverVersion());
            System.out.println("Connection URL:           " + dbMeta.getURL());
            System.out.println("Read-Only Status:         " + conn.isReadOnly());
            System.out.println("Auto-Commit Status:       " + conn.getAutoCommit());

            // 2. ResultSetMetaData Inspection (Lab Exercise #14 Requirement)
            String query = "SELECT * FROM " + tableName + " LIMIT 1";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {

                ResultSetMetaData rsMeta = rs.getMetaData();
                int columnCount = rsMeta.getColumnCount();

                System.out.printf("\nResultSetMetaData Summary: Total Columns = %d\n", columnCount);
                System.out.println("+----+----------------------+--------------------+-----------+--------------+");
                System.out.println("| #  | Column Name          | SQL Data Type      | Size      | Nullable?    |");
                System.out.println("+----+----------------------+--------------------+-----------+--------------+");

                for (int i = 1; i <= columnCount; i++) {
                    String colName = rsMeta.getColumnName(i);
                    String colType = rsMeta.getColumnTypeName(i);
                    int colSize = rsMeta.getColumnDisplaySize(i);
                    int isNullable = rsMeta.isNullable(i);
                    String nullStr = (isNullable == ResultSetMetaData.columnNullable) ? "YES" : "NO";

                    System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n",
                            i, colName, colType, colSize, nullStr);
                }
                System.out.println("+----+----------------------+--------------------+-----------+--------------+");
            }

        } catch (RecruitmentException | SQLException e) {
            System.out.println("⚠️ Live MySQL Database is offline or unreachable: " + e.getMessage());
            System.out.println("   Displaying Compiled Structural Schema Metadata for 'candidates' table:");
            printOfflineSimulatedMetaData();
        }
    }

    private static void printOfflineSimulatedMetaData() {
        System.out.println("+----+----------------------+--------------------+-----------+--------------+");
        System.out.println("| #  | Column Name          | SQL Data Type      | Size      | Nullable?    |");
        System.out.println("+----+----------------------+--------------------+-----------+--------------+");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 1, "id", "INT", 11, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 2, "candidate_code", "VARCHAR", 50, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 3, "first_name", "VARCHAR", 100, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 4, "last_name", "VARCHAR", 100, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 5, "email", "VARCHAR", 150, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 6, "experience_years", "DECIMAL", 4, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 7, "current_salary", "DECIMAL", 12, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 8, "expected_salary", "DECIMAL", 12, "NO");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 9, "location", "VARCHAR", 100, "YES");
        System.out.printf("| %-2d | %-20s | %-18s | %-9d | %-12s |\n", 10, "status", "ENUM", 20, "NO");
        System.out.println("+----+----------------------+--------------------+-----------+--------------+");
    }

    public static void runJdbcAndMetaDataDemo() {
        System.out.println("\n================================================================================");
        System.out.println("🗄️ MODULE VI: DATABASE PROGRAMMING USING JDBC & RESULTSETMETADATA");
        System.out.println("================================================================================");
        printTableMetaData("candidates");
        System.out.println("================================================================================");
    }
}
