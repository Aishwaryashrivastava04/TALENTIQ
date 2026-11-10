const { mysqlPool } = require('../config/db');
const { createNotification } = require('../services/notificationService');

let FALLBACK_JOBS = [
  { id: 1, job_code: 'JOB-201', title: 'Senior Full-Stack Developer', department: 'Engineering', job_role: 'Full Stack Developer', min_experience: 3.0, max_experience: 6.0, min_salary: 900000.0, max_salary: 1600000.0, location: 'Bengaluru', company_size: 'ENTERPRISE', status: 'OPEN', description: 'React.js, Node.js, Express, MySQL and modern cloud stack.' },
  { id: 2, job_code: 'JOB-202', title: 'AI & Machine Learning Engineer', department: 'Data & AI', job_role: 'ML Engineer', min_experience: 2.0, max_experience: 5.0, min_salary: 1000000.0, max_salary: 1800000.0, location: 'Hyderabad', company_size: 'MID_SIZE', status: 'OPEN', description: 'Scikit-learn, NLP resume screening models, Pandas, Python.' },
  { id: 3, job_code: 'JOB-203', title: 'Senior Java Backend Specialist', department: 'Banking Platform', job_role: 'Java Developer', min_experience: 4.0, max_experience: 8.0, min_salary: 1200000.0, max_salary: 2200000.0, location: 'Pune', company_size: 'ENTERPRISE', status: 'OPEN', description: 'Java 17, Spring Boot, JDBC, PreparedStatement, high-throughput transactions.' },
  { id: 4, job_code: 'JOB-204', title: 'Data Analyst & Statistician', department: 'Analytics', job_role: 'Data Analyst', min_experience: 1.0, max_experience: 4.0, min_salary: 500000.0, max_salary: 900000.0, location: 'Mumbai', company_size: 'MID_SIZE', status: 'OPEN', description: 'Statistical distributions, hypothesis testing, interactive Recharts dashboarding.' },
  { id: 5, job_code: 'JOB-205', title: 'Frontend React Developer', department: 'Product Experience', job_role: 'Frontend Developer', min_experience: 1.5, max_experience: 4.0, min_salary: 600000.0, max_salary: 1100000.0, location: 'Chennai', company_size: 'STARTUP', status: 'OPEN', description: 'Modern React 18, Vite, responsive UI, Tailwind/modern CSS.' },
  { id: 6, job_code: 'JOB-206', title: 'Cloud & DevOps Architect', department: 'Infrastructure', job_role: 'DevOps Engineer', min_experience: 5.0, max_experience: 9.0, min_salary: 1800000.0, max_salary: 3000000.0, location: 'Bengaluru', company_size: 'ENTERPRISE', status: 'OPEN', description: 'AWS, Kubernetes, Docker, CI/CD pipeline automation.' },
];

async function getJobs(req, res, next) {
  try {
    const { search, department, status } = req.query;
    try {
      let query = `SELECT * FROM jobs WHERE 1=1`;
      const params = [];
      if (search) {
        query += ` AND (title LIKE ? OR job_role LIKE ? OR job_code LIKE ? OR location LIKE ?)`;
        const s = `%${search}%`;
        params.push(s, s, s, s);
      }
      if (department) {
        query += ` AND department = ?`;
        params.push(department);
      }
      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }
      query += ` ORDER BY id DESC`;

      const [rows] = await mysqlPool.query(query, params);
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (dbErr) {
      let filtered = [...FALLBACK_JOBS];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(s) || j.job_role.toLowerCase().includes(s));
      }
      return res.status(200).json({ success: true, count: filtered.length, data: filtered, is_fallback: true });
    }
  } catch (error) {
    next(error);
  }
}

async function getJobById(req, res, next) {
  try {
    const { id } = req.params;
    try {
      const [rows] = await mysqlPool.query(`SELECT * FROM jobs WHERE id = ? OR job_code = ?`, [id, id]);
      if (rows.length > 0) {
        return res.status(200).json({ success: true, data: rows[0] });
      }
      return res.status(404).json({ success: false, message: 'Job opening not found.' });
    } catch (dbErr) {
      const found = FALLBACK_JOBS.find(j => j.id == id || j.job_code === id);
      if (found) return res.status(200).json({ success: true, data: found });
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
  } catch (error) {
    next(error);
  }
}

async function createJob(req, res, next) {
  try {
    const {
      title, department, job_role, min_experience, max_experience,
      min_salary, max_salary, location, company_size, description
    } = req.body;

    if (!title || !department || !job_role) {
      return res.status(400).json({ success: false, message: 'Title, department, and role are required.' });
    }

    const jobCode = 'JOB-' + Math.floor(200 + Math.random() * 800);

    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO jobs 
         (job_code, title, department, job_role, min_experience, max_experience, min_salary, max_salary, location, company_size, status, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?)`,
        [
          jobCode, title, department, job_role,
          min_experience || 0, max_experience || 5,
          min_salary || 0, max_salary || 1000000,
          location || 'Bengaluru', company_size || 'MID_SIZE', description || ''
        ]
      );
      createNotification({
        type: 'NEW_JOB',
        title: 'New Requisition Published',
        message: `${title} (${jobCode}) requisition is now active in ${location || 'Bengaluru'}.`,
        link: 'jobs'
      }).catch(() => null);

      return res.status(201).json({
        success: true,
        message: 'Job opening published successfully.',
        data: { id: result.insertId, job_code: jobCode, title }
      });
    } catch (dbErr) {
      const newJob = {
        id: FALLBACK_JOBS.length + 1,
        job_code: jobCode,
        title, department, job_role,
        min_experience: parseFloat(min_experience || 0),
        max_experience: parseFloat(max_experience || 5),
        min_salary: parseFloat(min_salary || 0),
        max_salary: parseFloat(max_salary || 1000000),
        location: location || 'Bengaluru',
        company_size: company_size || 'MID_SIZE',
        status: 'OPEN',
        description: description || ''
      };
      FALLBACK_JOBS.unshift(newJob);

      createNotification({
        type: 'NEW_JOB',
        title: 'New Requisition Published',
        message: `${title} (${jobCode}) requisition is now active in ${location || 'Bengaluru'}.`,
        link: 'jobs'
      }).catch(() => null);

      return res.status(201).json({ success: true, message: 'Job published (In-Memory mode).', data: newJob });
    }
  } catch (error) {
    next(error);
  }
}

async function updateJob(req, res, next) {
  try {
    const { id } = req.params;
    const {
      title, department, job_role, min_experience, max_experience,
      min_salary, max_salary, location, company_size, status, description
    } = req.body;

    try {
      await mysqlPool.query(
        `UPDATE jobs 
         SET title=?, department=?, job_role=?, min_experience=?, max_experience=?, 
             min_salary=?, max_salary=?, location=?, company_size=?, status=?, description=?
         WHERE id=?`,
        [
          title, department, job_role, min_experience, max_experience,
          min_salary, max_salary, location, company_size, status || 'OPEN', description, id
        ]
      );
      return res.status(200).json({ success: true, message: 'Job updated successfully.' });
    } catch (dbErr) {
      const idx = FALLBACK_JOBS.findIndex(j => j.id == id);
      if (idx !== -1) {
        FALLBACK_JOBS[idx] = { ...FALLBACK_JOBS[idx], ...req.body };
        return res.status(200).json({ success: true, message: 'Job updated (In-Memory mode).' });
      }
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
  } catch (error) {
    next(error);
  }
}

async function deleteJob(req, res, next) {
  try {
    const { id } = req.params;
    try {
      await mysqlPool.query('DELETE FROM jobs WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Job deleted successfully.' });
    } catch (dbErr) {
      FALLBACK_JOBS = FALLBACK_JOBS.filter(j => j.id != id);
      return res.status(200).json({ success: true, message: 'Job deleted (In-Memory mode).' });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
