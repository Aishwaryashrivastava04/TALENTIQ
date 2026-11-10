const { mysqlPool } = require('../config/db');
const CandidateProfile = require('../models/CandidateProfile');
const ActivityLog = require('../models/ActivityLog');

// Fallback in-memory dataset if MySQL is in offline demo mode
let FALLBACK_CANDIDATES = [
  { id: 1, candidate_code: 'CAN-1001', first_name: 'Rahul', last_name: 'Verma', email: 'rahul.verma@gmail.com', phone: '+91 9876543210', experience_years: 3.5, education_level: 'MCA', current_salary: 720000.0, expected_salary: 1000000.0, location: 'Bengaluru', status: 'AVAILABLE', skills_list: 'Python, React.js, Node.js, Express.js, MySQL, MongoDB, AWS, Docker' },
  { id: 2, candidate_code: 'CAN-1002', first_name: 'Sneha', last_name: 'Patel', email: 'sneha.patel@outlook.com', phone: '+91 9823456781', experience_years: 5.0, education_level: 'BTECH', current_salary: 1250000.0, expected_salary: 1600000.0, location: 'Pune', status: 'IN_PROCESS', skills_list: 'Java, Spring Boot, MySQL, AWS, Docker' },
  { id: 3, candidate_code: 'CAN-1003', first_name: 'Ananya', last_name: 'Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 9912345672', experience_years: 2.0, education_level: 'BCA', current_salary: 450000.0, expected_salary: 650000.0, location: 'Chennai', status: 'AVAILABLE', skills_list: 'JavaScript, React.js, Git & GitHub' },
  { id: 4, candidate_code: 'CAN-1004', first_name: 'Rohan', last_name: 'Kulkarni', email: 'rohan.kulkarni@yahoo.com', phone: '+91 9789012345', experience_years: 7.5, education_level: 'MTECH', current_salary: 2200000.0, expected_salary: 2800000.0, location: 'Hyderabad', status: 'IN_PROCESS', skills_list: 'Java, Spring Boot, MySQL, Redis, Docker' },
  { id: 5, candidate_code: 'CAN-1005', first_name: 'Amit', last_name: 'Deshmukh', email: 'amit.deshmukh@gmail.com', phone: '+91 9123456789', experience_years: 1.0, education_level: 'MCA', current_salary: 380000.0, expected_salary: 550000.0, location: 'Pune', status: 'AVAILABLE', skills_list: 'Python, JavaScript, Node.js, MySQL' },
  { id: 6, candidate_code: 'CAN-1006', first_name: 'Divya', last_name: 'Nair', email: 'divya.nair@hotmail.com', phone: '+91 9456789012', experience_years: 4.0, education_level: 'BTECH', current_salary: 950000.0, expected_salary: 1300000.0, location: 'Bengaluru', status: 'AVAILABLE', skills_list: 'Python, Machine Learning, Scikit-learn, NLP, Data Visualization' },
];

/**
 * GET /api/candidates
 * Supports search, education filter, experience range
 */
async function getCandidates(req, res, next) {
  try {
    const { search, education, minExp, maxExp, status } = req.query;

    try {
      let query = `
        SELECT 
          c.id, c.candidate_code, c.first_name, c.last_name, 
          CONCAT(c.first_name, ' ', c.last_name) AS full_name,
          c.email, c.phone, c.experience_years, c.education_level, 
          c.current_salary, c.expected_salary, c.location, c.status, c.created_at,
          COALESCE(GROUP_CONCAT(DISTINCT s.skill_name SEPARATOR ', '), '') AS skills_list
        FROM candidates c
        LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
        LEFT JOIN skills s ON cs.skill_id = s.id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR c.candidate_code LIKE ?)`;
        const s = `%${search}%`;
        params.push(s, s, s, s);
      }
      if (education) {
        query += ` AND c.education_level = ?`;
        params.push(education);
      }
      if (status) {
        query += ` AND c.status = ?`;
        params.push(status);
      }
      if (minExp) {
        query += ` AND c.experience_years >= ?`;
        params.push(parseFloat(minExp));
      }
      if (maxExp) {
        query += ` AND c.experience_years <= ?`;
        params.push(parseFloat(maxExp));
      }

      query += ` GROUP BY c.id ORDER BY c.id DESC`;

      const [rows] = await mysqlPool.query(query, params);
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (dbErr) {
      console.warn('⚠️ [MySQL] Offline or query error. Serving fallback candidate cache.');
      let filtered = [...FALLBACK_CANDIDATES];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c => c.first_name.toLowerCase().includes(s) || c.last_name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
      }
      if (education) {
        filtered = filtered.filter(c => c.education_level === education);
      }
      return res.status(200).json({ success: true, count: filtered.length, data: filtered, is_fallback: true });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/candidates/:id
 * Joins relational candidate with MongoDB extended profile
 */
async function getCandidateById(req, res, next) {
  try {
    const { id } = req.params;
    let candidate = null;

    try {
      const [rows] = await mysqlPool.query(
        `SELECT c.*, CONCAT(c.first_name, ' ', c.last_name) AS full_name,
                COALESCE(GROUP_CONCAT(DISTINCT s.skill_name SEPARATOR ', '), '') AS skills_list
         FROM candidates c
         LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
         LEFT JOIN skills s ON cs.skill_id = s.id
         WHERE c.id = ? OR c.candidate_code = ?
         GROUP BY c.id`,
        [id, id]
      );
      if (rows.length > 0) candidate = rows[0];
    } catch (dbErr) {
      candidate = FALLBACK_CANDIDATES.find(c => c.id == id || c.candidate_code === id);
    }

    if (!candidate) {
      return res.status(404).json({ success: false, message: `Candidate not found with identifier: ${id}` });
    }

    // Attempt MongoDB extended profile retrieval
    let mongoProfile = null;
    try {
      mongoProfile = await CandidateProfile.findOne({ candidate_code: candidate.candidate_code });
    } catch (mErr) {
      // MongoDB optional
    }

    return res.status(200).json({
      success: true,
      data: {
        ...candidate,
        extended_profile: mongoProfile || null
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/candidates
 * Creates candidate in MySQL & MongoDB
 */
async function createCandidate(req, res, next) {
  try {
    const {
      first_name, last_name, email, phone,
      experience_years, education_level,
      current_salary, expected_salary, location,
      skills
    } = req.body;

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are mandatory.' });
    }

    const candidateCode = 'CAN-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO candidates 
         (candidate_code, first_name, last_name, email, phone, experience_years, education_level, current_salary, expected_salary, location, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
        [
          candidateCode, first_name, last_name, email.toLowerCase(), phone,
          experience_years || 0.0, education_level || 'BTECH',
          current_salary || 0.0, expected_salary || 0.0, location || 'Bengaluru'
        ]
      );

      const candidateId = result.insertId;

      // Handle skills array
      if (Array.isArray(skills) && skills.length > 0) {
        for (const skillName of skills) {
          const [skillRows] = await mysqlPool.query('SELECT id FROM skills WHERE skill_name = ?', [skillName]);
          if (skillRows.length > 0) {
            await mysqlPool.query(
              'INSERT IGNORE INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES (?, ?, ?, ?)',
              [candidateId, skillRows[0].id, 'INTERMEDIATE', experience_years || 1.0]
            );
          }
        }
      }

      // Initialize MongoDB profile
      try {
        await CandidateProfile.create({
          candidate_code: candidateCode,
          extracted_entities: {
            skills: skills || [],
            education: [education_level || 'BTECH'],
            detected_email: email,
            detected_phone: phone
          }
        });
      } catch (mErr) {
        console.warn('MongoDB profile save skipped:', mErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Candidate created successfully.',
        data: { id: candidateId, candidate_code: candidateCode, first_name, last_name, email }
      });
    } catch (dbErr) {
      // Fallback in-memory add for testing
      const newCand = {
        id: FALLBACK_CANDIDATES.length + 1,
        candidate_code: candidateCode,
        first_name, last_name, email, phone,
        experience_years: parseFloat(experience_years || 0),
        education_level: education_level || 'BTECH',
        current_salary: parseFloat(current_salary || 0),
        expected_salary: parseFloat(expected_salary || 0),
        location: location || 'Bengaluru',
        status: 'AVAILABLE',
        skills_list: Array.isArray(skills) ? skills.join(', ') : ''
      };
      FALLBACK_CANDIDATES.unshift(newCand);
      return res.status(201).json({ success: true, message: 'Candidate created (In-Memory mode).', data: newCand });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/candidates/:id
 */
async function updateCandidate(req, res, next) {
  try {
    const { id } = req.params;
    const {
      first_name, last_name, email, phone,
      experience_years, education_level,
      current_salary, expected_salary, location, status
    } = req.body;

    try {
      await mysqlPool.query(
        `UPDATE candidates 
         SET first_name=?, last_name=?, email=?, phone=?, experience_years=?, 
             education_level=?, current_salary=?, expected_salary=?, location=?, status=?
         WHERE id=?`,
        [
          first_name, last_name, email, phone,
          experience_years, education_level,
          current_salary, expected_salary, location, status || 'AVAILABLE', id
        ]
      );
      return res.status(200).json({ success: true, message: 'Candidate updated successfully.' });
    } catch (dbErr) {
      const idx = FALLBACK_CANDIDATES.findIndex(c => c.id == id);
      if (idx !== -1) {
        FALLBACK_CANDIDATES[idx] = { ...FALLBACK_CANDIDATES[idx], ...req.body };
        return res.status(200).json({ success: true, message: 'Candidate updated (In-Memory mode).' });
      }
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/candidates/:id
 */
async function deleteCandidate(req, res, next) {
  try {
    const { id } = req.params;
    try {
      const [candRows] = await mysqlPool.query('SELECT candidate_code FROM candidates WHERE id = ?', [id]);
      if (candRows.length > 0) {
        const code = candRows[0].candidate_code;
        await mysqlPool.query('DELETE FROM candidates WHERE id = ?', [id]);
        try {
          await CandidateProfile.deleteOne({ candidate_code: code });
        } catch (mErr) {}
      }
      return res.status(200).json({ success: true, message: 'Candidate deleted successfully.' });
    } catch (dbErr) {
      FALLBACK_CANDIDATES = FALLBACK_CANDIDATES.filter(c => c.id != id);
      return res.status(200).json({ success: true, message: 'Candidate deleted (In-Memory mode).' });
    }
  } catch (error) {
    next(error);
  }
}

let FALLBACK_COMMUNICATIONS = [
  { id: 1, candidate_id: 1, sender_name: 'Priya Menon (Senior HR)', subject: 'Invitation to Technical Interview Round 1', message_body: 'Congratulations! Your profile has been shortlisted for the Senior Full-Stack Developer position. Please confirm your availability for tomorrow.', channel: 'EMAIL', sent_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 2, candidate_id: 6, sender_name: 'Aishwarya Shree (Administrator)', subject: 'AI / ML Engineer Shortlisting Update', message_body: 'Your NLP and ML expertise aligned strongly with our architecture roadmap. Round 1 has been scheduled.', channel: 'EMAIL', sent_at: new Date(Date.now() - 86400000).toISOString() }
];

/**
 * GET /api/candidates/:id/communications
 */
async function getCandidateCommunications(req, res, next) {
  try {
    const { id } = req.params;
    try {
      const [rows] = await mysqlPool.query(
        'SELECT * FROM candidate_communications WHERE candidate_id = ? ORDER BY sent_at DESC',
        [id]
      );
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (e) {
      const filtered = FALLBACK_COMMUNICATIONS.filter(c => c.candidate_id == id);
      return res.status(200).json({ success: true, count: filtered.length, data: filtered, is_fallback: true });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/candidates/:id/communications
 */
async function sendCandidateCommunication(req, res, next) {
  try {
    const { id } = req.params;
    const { subject, message_body, sender_name } = req.body;

    if (!subject || !message_body) {
      return res.status(400).json({ success: false, message: 'Subject and message_body are required.' });
    }

    const sender = sender_name || 'SmartRecruit HR Team';

    try {
      const [result] = await mysqlPool.query(
        'INSERT INTO candidate_communications (candidate_id, sender_name, subject, message_body, channel) VALUES (?, ?, ?, ?, ?)',
        [id, sender, subject, message_body, 'EMAIL']
      );

      return res.status(201).json({
        success: true,
        message: 'Communication recorded and dispatched.',
        data: { id: result.insertId, candidate_id: id, subject, sender_name: sender }
      });
    } catch (e) {
      const newComm = {
        id: FALLBACK_COMMUNICATIONS.length + 1,
        candidate_id: parseInt(id, 10),
        sender_name: sender,
        subject,
        message_body,
        channel: 'EMAIL',
        sent_at: new Date().toISOString()
      };
      FALLBACK_COMMUNICATIONS.unshift(newComm);
      return res.status(201).json({ success: true, message: 'Communication recorded (In-Memory mode).', data: newComm });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Helper: Retrieve candidate roster for AI ranking and matching
 */
async function getAvailableCandidatesList() {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT 
        c.id, c.candidate_code, c.first_name, c.last_name, 
        CONCAT(c.first_name, ' ', c.last_name) AS full_name,
        c.email, c.phone, c.experience_years, c.education_level, 
        c.current_salary, c.expected_salary, c.location, c.status, c.created_at,
        COALESCE(GROUP_CONCAT(DISTINCT s.skill_name SEPARATOR ', '), '') AS skills_list
      FROM candidates c
      LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
      LEFT JOIN skills s ON cs.skill_id = s.id
      WHERE c.status IN ('AVAILABLE', 'IN_PROCESS') OR c.status IS NULL
      GROUP BY c.id
      ORDER BY c.id ASC
    `);
    if (rows && rows.length > 0) {
      return rows;
    }
  } catch (err) {
    // Fall back to in-memory candidate cache if MySQL is offline
  }
  return [...FALLBACK_CANDIDATES];
}

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateCommunications,
  sendCandidateCommunication,
  getAvailableCandidatesList,
  FALLBACK_CANDIDATES,
};
