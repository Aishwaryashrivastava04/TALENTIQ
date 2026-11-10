const { mysqlPool } = require('../config/db');
const { createNotification } = require('../services/notificationService');

let FALLBACK_APPLICATIONS = [
  { id: 1, application_code: 'APP-849201', candidate_id: 1, candidate_name: 'Rahul Verma', candidate_code: 'CAN-1001', job_id: 1, job_title: 'Senior Full-Stack Developer', job_code: 'JOB-201', match_score: 88.5, status: 'SHORTLISTED', notes: 'Strong match on React, Node.js, and MySQL. MCA with 3.5 yrs exp aligns perfectly.' },
  { id: 2, application_code: 'APP-849202', candidate_id: 6, candidate_name: 'Divya Nair', candidate_code: 'CAN-1006', job_id: 2, job_title: 'AI & Machine Learning Engineer', job_code: 'JOB-202', match_score: 94.2, status: 'SHORTLISTED', notes: 'Outstanding NLP and Scikit-learn profile.' },
  { id: 3, application_code: 'APP-849203', candidate_id: 4, candidate_name: 'Rohan Kulkarni', candidate_code: 'CAN-1004', job_id: 3, job_title: 'Senior Java Backend Specialist', job_code: 'JOB-203', match_score: 91.0, status: 'INTERVIEW_SCHEDULED', notes: 'Strong Java and Spring Boot experience. Tech round cleared.' },
  { id: 4, application_code: 'APP-849204', candidate_id: 3, candidate_name: 'Ananya Iyer', candidate_code: 'CAN-1003', job_id: 5, job_title: 'Frontend React Developer', job_code: 'JOB-205', match_score: 82.0, status: 'SCREENED', notes: 'Strong React fundamentals.' },
  { id: 5, application_code: 'APP-849205', candidate_id: 2, candidate_name: 'Sneha Patel', candidate_code: 'CAN-1002', job_id: 1, job_title: 'Senior Full-Stack Developer', job_code: 'JOB-201', match_score: 76.4, status: 'APPLIED', notes: 'Strong Java profile cross-applying for full stack.' },
];

async function getApplications(req, res, next) {
  try {
    const { status, jobId, candidateId } = req.query;
    try {
      let query = `
        SELECT 
          a.id, a.application_code, a.candidate_id, a.job_id, a.match_score,
          a.status, a.notes, a.application_date,
          CONCAT(c.first_name, ' ', c.last_name) AS candidate_name,
          c.candidate_code, c.email AS candidate_email, c.experience_years,
          j.title AS job_title, j.job_code, j.department AS job_department
        FROM applications a
        JOIN candidates c ON a.candidate_id = c.id
        JOIN jobs j ON a.job_id = j.id
        WHERE 1=1
      `;
      const params = [];
      if (status) {
        query += ` AND a.status = ?`;
        params.push(status);
      }
      if (jobId) {
        query += ` AND a.job_id = ?`;
        params.push(jobId);
      }
      if (candidateId) {
        query += ` AND a.candidate_id = ?`;
        params.push(candidateId);
      }
      query += ` ORDER BY a.id DESC`;

      const [rows] = await mysqlPool.query(query, params);
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (dbErr) {
      let filtered = [...FALLBACK_APPLICATIONS];
      if (status) filtered = filtered.filter(a => a.status === status);
      return res.status(200).json({ success: true, count: filtered.length, data: filtered, is_fallback: true });
    }
  } catch (error) {
    next(error);
  }
}

async function createApplication(req, res, next) {
  try {
    const { candidate_id, job_id, notes, match_score } = req.body;
    if (!candidate_id || !job_id) {
      return res.status(400).json({ success: false, message: 'candidate_id and job_id are required.' });
    }

    const appCode = 'APP-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO applications (application_code, candidate_id, job_id, match_score, status, notes)
         VALUES (?, ?, ?, ?, 'APPLIED', ?)`,
        [appCode, candidate_id, job_id, match_score || 75.0, notes || 'Applied via recruitment portal']
      );

      createNotification({
        type: 'APPLICATION_SUBMITTED',
        title: 'New Application Received',
        message: `Application ${appCode} submitted for job requisition ID ${job_id} (Match Score: ${match_score || 75}%).`,
        link: 'applications'
      }).catch(() => null);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        data: { id: result.insertId, application_code: appCode }
      });
    } catch (dbErr) {
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Candidate has already applied for this job.' });
      }
      const newApp = {
        id: FALLBACK_APPLICATIONS.length + 1,
        application_code: appCode,
        candidate_id,
        candidate_name: 'Applicant ' + candidate_id,
        job_id,
        job_title: 'Job Position ' + job_id,
        match_score: match_score || 78.0,
        status: 'APPLIED',
        notes: notes || ''
      };
      FALLBACK_APPLICATIONS.unshift(newApp);

      createNotification({
        type: 'APPLICATION_SUBMITTED',
        title: 'New Application Received',
        message: `Application ${appCode} recorded for job requisition ID ${job_id} (Match Score: ${match_score || 78}%).`,
        link: 'applications'
      }).catch(() => null);

      return res.status(201).json({ success: true, message: 'Application recorded (In-Memory mode).', data: newApp });
    }
  } catch (error) {
    next(error);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowed = ['APPLIED', 'SCREENED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'SELECTED', 'REJECTED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    try {
      await mysqlPool.query(
        `UPDATE applications SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`,
        [status, notes || null, id]
      );
      createNotification({
        type: 'STATUS_CHANGE',
        title: 'Application Status Updated',
        message: `Application #${id} has been transitioned to status "${status}".`,
        link: 'applications'
      }).catch(() => null);
      return res.status(200).json({ success: true, message: `Application status updated to ${status}.` });
    } catch (dbErr) {
      const found = FALLBACK_APPLICATIONS.find(a => a.id == id);
      if (found) {
        found.status = status;
        if (notes) found.notes = notes;
        createNotification({
          type: 'STATUS_CHANGE',
          title: 'Application Status Updated',
          message: `Application ${found.application_code || `#${id}`} transitioned to status "${status}".`,
          link: 'applications'
        }).catch(() => null);
        return res.status(200).json({ success: true, message: `Status updated to ${status} (In-Memory mode).` });
      }
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
  } catch (error) {
    next(error);
  }
}

let FALLBACK_INTERVIEWS = [
  { id: 1, application_id: 3, round_number: 1, round_type: 'TECHNICAL_1', scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), interviewer_name: 'Priya Menon (Senior HR)', status: 'SCHEDULED', feedback: 'Senior Java technical test cleared with distinction.' },
  { id: 2, application_id: 1, round_number: 1, round_type: 'TECHNICAL_2', scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString(), interviewer_name: 'Vikram Malhotra (Lead Architect)', status: 'SCHEDULED', feedback: 'System architecture & Full stack design.' }
];

/**
 * POST /api/applications/:id/schedule-interview
 */
async function scheduleInterview(req, res, next) {
  try {
    const { id } = req.params;
    const { round_number, round_type, scheduled_at, interviewer_name, feedback } = req.body;

    if (!round_type || !scheduled_at || !interviewer_name) {
      return res.status(400).json({
        success: false,
        message: 'round_type, scheduled_at, and interviewer_name are required.',
      });
    }

    try {
      const [result] = await mysqlPool.query(
        `INSERT INTO interviews (application_id, round_number, round_type, scheduled_at, interviewer_name, status, feedback)
         VALUES (?, ?, ?, ?, ?, 'SCHEDULED', ?)`,
        [id, round_number || 1, round_type, scheduled_at, interviewer_name, feedback || null]
      );

      // Automatically advance application status to INTERVIEW_SCHEDULED
      await mysqlPool.query(
        `UPDATE applications SET status = 'INTERVIEW_SCHEDULED' WHERE id = ?`,
        [id]
      );

      createNotification({
        type: 'INTERVIEW_SCHEDULED',
        title: 'Interview Scheduled',
        message: `Round ${round_number || 1} (${round_type}) scheduled on ${new Date(scheduled_at).toLocaleDateString()} with ${interviewer_name}.`,
        link: 'interviews'
      }).catch(() => null);

      return res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully in MySQL relational calendar.',
        data: {
          id: result.insertId,
          application_id: id,
          round_type,
          scheduled_at,
          interviewer_name,
        },
      });
    } catch (dbErr) {
      const newInterview = {
        id: FALLBACK_INTERVIEWS.length + 1,
        application_id: parseInt(id, 10),
        round_number: round_number || 1,
        round_type,
        scheduled_at,
        interviewer_name,
        status: 'SCHEDULED',
        feedback: feedback || '',
      };
      FALLBACK_INTERVIEWS.push(newInterview);

      const app = FALLBACK_APPLICATIONS.find(a => a.id == id);
      if (app) app.status = 'INTERVIEW_SCHEDULED';

      createNotification({
        type: 'INTERVIEW_SCHEDULED',
        title: 'Interview Scheduled',
        message: `Round ${round_number || 1} (${round_type}) scheduled on ${new Date(scheduled_at).toLocaleDateString()} with ${interviewer_name}.`,
        link: 'interviews'
      }).catch(() => null);

      return res.status(201).json({
        success: true,
        message: 'Interview scheduled successfully (In-Memory mode).',
        data: newInterview,
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/applications/:id/interviews
 */
async function getInterviews(req, res, next) {
  try {
    const { id } = req.params;
    try {
      const [rows] = await mysqlPool.query(
        'SELECT * FROM interviews WHERE application_id = ? ORDER BY round_number ASC',
        [id]
      );
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (dbErr) {
      const filtered = FALLBACK_INTERVIEWS.filter(i => i.application_id == id);
      return res.status(200).json({ success: true, count: filtered.length, data: filtered, is_fallback: true });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/applications/interviews/all
 * List all scheduled and past interviews across the platform
 */
async function getAllInterviews(req, res, next) {
  try {
    try {
      const [rows] = await mysqlPool.query(`
        SELECT 
          i.id, i.application_id, i.round_number, i.round_type, i.scheduled_at, 
          i.interviewer_name, i.status, i.feedback, i.rating, i.created_at,
          a.application_code, a.match_score,
          c.candidate_code, CONCAT(c.first_name, ' ', c.last_name) AS candidate_name, c.email AS candidate_email,
          j.title AS job_title, j.job_code
        FROM interviews i
        JOIN applications a ON i.application_id = a.id
        JOIN candidates c ON a.candidate_id = c.id
        JOIN jobs j ON a.job_id = j.id
        ORDER BY i.scheduled_at ASC
      `);
      if (rows && rows.length > 0) {
        return res.status(200).json({ success: true, count: rows.length, data: rows });
      }
    } catch (dbErr) {
      // Fallback in-memory
    }

    const enriched = FALLBACK_INTERVIEWS.map(item => {
      const app = FALLBACK_APPLICATIONS.find(a => a.id === item.application_id) || FALLBACK_APPLICATIONS[0];
      return {
        ...item,
        application_code: app.application_code,
        match_score: app.match_score,
        candidate_code: app.candidate_code,
        candidate_name: app.candidate_name,
        candidate_email: app.candidate_email || 'candidate@gmail.com',
        job_title: app.job_title,
        job_code: app.job_code,
        meeting_link: 'https://meet.google.com/rec-tq-' + item.id + '90',
      };
    });

    return res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/applications/interviews/:id
 * Update interview status, feedback, and rating
 */
async function updateInterview(req, res, next) {
  try {
    const { id } = req.params;
    const { status, feedback, rating } = req.body;

    try {
      await mysqlPool.query(
        'UPDATE interviews SET status = COALESCE(?, status), feedback = COALESCE(?, feedback), rating = COALESCE(?, rating) WHERE id = ?',
        [status, feedback, rating, id]
      );
    } catch (dbErr) {
      const interview = FALLBACK_INTERVIEWS.find(i => i.id == id);
      if (interview) {
        if (status) interview.status = status;
        if (feedback !== undefined) interview.feedback = feedback;
        if (rating !== undefined) interview.rating = rating;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Interview details updated successfully.',
      data: { id, status, feedback, rating },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getApplications,
  createApplication,
  updateApplicationStatus,
  scheduleInterview,
  getInterviews,
  getAllInterviews,
  updateInterview,
};
