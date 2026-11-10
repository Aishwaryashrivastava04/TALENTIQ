const crypto = require('crypto');

/**
 * Cryptographic Utility Functions for Authentication & Password Reset
 * Adheres strictly to security standards:
 * - Uses OS-level secure PRNG via crypto.randomBytes
 * - Uses SHA-256 cryptographic hashing for token storage
 */

/**
 * Generates a cryptographically secure random token
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string} Hex string (64 characters for 32 bytes)
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hashes a token using SHA-256 for secure database storage
 * @param {string} token - The raw token sent to the user
 * @returns {string} The SHA-256 hash hex string
 */
function hashToken(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a 
 * @param {string} b 
 * @returns {boolean}
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
  generateSecureToken,
  hashToken,
  safeCompare,
};
