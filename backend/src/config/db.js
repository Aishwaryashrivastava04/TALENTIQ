/**
 * Smart Recruitment Database Connector
 * Dual Database Persistence:
 * - MySQL 8.4 LTS (Relational transactional data, 3NF schema)
 * - MongoDB (Document store for resume text, screening breakdown, audit trails)
 */

const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// ----------------------------------------------------------------------------
// 1. MySQL 8.4 LTS Connection Pool
// ----------------------------------------------------------------------------
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_recruitment_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

/**
 * Ensure auth tables exist in MySQL
 */
async function ensureAuthTables(connection) {
  try {
    // 1. Check/Add phone & is_verified to users if missing
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL,
        ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        MODIFY COLUMN role ENUM('ADMIN', 'HR_MANAGER', 'CANDIDATE', 'RECRUITER') NOT NULL DEFAULT 'HR_MANAGER';
      `);
    } catch (colErr) {
      // Ignore if syntax or already altered
    }

    // 2. password_reset_tokens
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_prt_token (token_hash),
        INDEX idx_prt_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. email_verification_tokens
    await connection.query(`
      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_evt_token (token_hash),
        INDEX idx_evt_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. candidate_communications
    await connection.query(`
      CREATE TABLE IF NOT EXISTS candidate_communications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id INT NOT NULL,
        sender_name VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message_body TEXT NOT NULL,
        channel ENUM('EMAIL', 'PORTAL_NOTE', 'SMS') NOT NULL DEFAULT 'EMAIL',
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_comm_candidate (candidate_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Secure Administrator Provisioning / Verification
    try {
      const [adminRows] = await connection.query(
        "SELECT id, full_name, email, role FROM users WHERE email = 'admin@recruitment.com' OR role = 'ADMIN' ORDER BY id ASC LIMIT 1"
      );
      if (adminRows && adminRows.length > 0) {
        // Sync existing admin name to Aishwarya Shree
        await connection.query(
          "UPDATE users SET full_name = 'Aishwarya Shree', role = 'ADMIN', is_active = 1 WHERE id = ?",
          [adminRows[0].id]
        );
      } else {
        // Provision primary administrator securely
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const adminPass = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123';
        const passHash = await bcrypt.hash(adminPass, salt);
        await connection.query(
          "INSERT INTO users (email, password_hash, full_name, phone, role, is_active, is_verified) VALUES ('admin@recruitment.com', ?, 'Aishwarya Shree', '+91 9876543210', 'ADMIN', 1, 1)",
          [passHash]
        );
      }
    } catch (adminSyncErr) {
      console.warn('⚠️ Admin provisioning verification note:', adminSyncErr.message);
    }
  } catch (err) {
    console.warn('⚠️ Table verification note:', err.message);
  }
}

/**
 * Verify MySQL Connection Health
 */
async function testMySQLConnection() {
  try {
    const connection = await mysqlPool.getConnection();
    console.log('✅ [MySQL] Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'smart_recruitment_db'));
    await ensureAuthTables(connection);
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ [MySQL Warning] Could not connect to MySQL server:', error.message);
    console.warn('   Ensure MySQL is running on ' + (process.env.DB_HOST || '127.0.0.1') + ':' + (process.env.DB_PORT || '3306'));
    return false;
  }
}

// ----------------------------------------------------------------------------
// 2. MongoDB Mongoose Connection
// ----------------------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_recruitment_docs';

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('✅ [MongoDB] Successfully connected to MongoDB: ' + MONGO_URI);
    return true;
  } catch (error) {
    console.warn('⚠️ [MongoDB Warning] Could not connect to MongoDB:', error.message);
    console.warn('   Ensure MongoDB daemon (mongod) is active on port 27017.');
    return false;
  }
}

module.exports = {
  mysqlPool,
  connectMongoDB,
  testMySQLConnection,
  mongoose,
};
