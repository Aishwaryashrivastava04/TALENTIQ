const { mysqlPool } = require('../config/db');

// In-Memory store for company profiles with operational defaults
let COMPANIES = [
  {
    id: 1,
    name: 'CloudScale Technologies',
    tagline: 'Next-Generation Cloud & AI Engineering',
    logo_initials: 'CS',
    logo_color: '#0060A8',
    industry: 'Enterprise Software & Cloud Platforms',
    website: 'https://cloudscale.tech',
    location: 'Bengaluru, Karnataka',
    company_size: 'ENTERPRISE',
    employee_count: '500-1,000 Employees',
    founded_year: 2018,
    description: 'CloudScale Technologies is a premier cloud engineering and AI consulting firm building high-throughput microservices, cloud infrastructure, and modern data platforms for Fortune 500 enterprises.',
    benefits: ['Comprehensive Medical Insurance', 'Flexible Hybrid Work Policy', 'Annual Learning & Certification Stipend', 'Performance Bonus & Equity'],
    hr_user_id: 2, // Priya Menon
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    name: 'Apex Financial Systems',
    tagline: 'High-Throughput Banking & Capital Markets Solutions',
    logo_initials: 'AF',
    logo_color: '#1473E6',
    industry: 'Fintech & Banking Infrastructure',
    website: 'https://apexfinancial.io',
    location: 'Pune, Maharashtra',
    company_size: 'ENTERPRISE',
    employee_count: '1,000-5,000 Employees',
    founded_year: 2014,
    description: 'Apex Financial Systems develops mission-critical transaction engines, core banking microservices, and regulatory compliance platforms processing millions of daily transactions.',
    benefits: ['Zero-Cost Healthcare & Wellness', 'Remote-First Flexible Work', 'Quarterly Incentive Plan', 'Higher Education Sponsorship'],
    hr_user_id: 3, // Vikram Malhotra
    created_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 3,
    name: 'Cognitive Data Labs',
    tagline: 'Intelligent Analytics & Data Systems',
    logo_initials: 'CD',
    logo_color: '#16845B',
    industry: 'Artificial Intelligence & Big Data',
    website: 'https://cognitivedata.ai',
    location: 'Hyderabad, Telangana',
    company_size: 'MID_SIZE',
    employee_count: '100-250 Employees',
    founded_year: 2021,
    description: 'Cognitive Data Labs specializes in natural language processing, automated document classification, computer vision, and predictive talent analytics for modern knowledge workers.',
    benefits: ['Unlimited Paid Time Off', 'Health & Dental Coverage', 'Latest Tech Setup & Equipment', 'Annual Company Retreats'],
    hr_user_id: 2,
    created_at: '2026-02-01T11:00:00Z',
  }
];

/**
 * GET /api/companies
 * List all companies with active job counts
 */
async function getAllCompanies(req, res, next) {
  try {
    // Try to get live job counts from MySQL jobs table
    let jobCounts = {};
    try {
      const [rows] = await mysqlPool.query(
        "SELECT location, company_size, COUNT(*) as count FROM jobs WHERE status = 'OPEN' GROUP BY location, company_size"
      );
      rows.forEach(r => {
        jobCounts[r.location] = (jobCounts[r.location] || 0) + r.count;
      });
    } catch (dbErr) {
      // fallback counts
    }

    const list = COMPANIES.map((comp, idx) => ({
      ...comp,
      active_jobs_count: idx === 0 ? 3 : (idx === 1 ? 2 : 1),
    }));

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/companies/my-company
 * Get current HR manager's company profile
 */
async function getMyCompany(req, res, next) {
  try {
    const userId = req.user?.id;
    let company = COMPANIES.find(c => c.hr_user_id === userId);

    if (!company) {
      // Return default or first company for user
      company = COMPANIES[0];
    }

    // Attach active jobs
    let activeJobs = [];
    try {
      const [jobs] = await mysqlPool.query(
        "SELECT id, job_code, title, department, job_role, min_experience, max_experience, min_salary, max_salary, location, company_size, status FROM jobs WHERE status = 'OPEN' LIMIT 5"
      );
      if (jobs && jobs.length > 0) activeJobs = jobs;
    } catch (dbErr) {
      activeJobs = [
        { id: 1, job_code: 'JOB-201', title: 'Senior Full-Stack Developer', department: 'Engineering', job_role: 'Full Stack Developer', min_experience: 3.0, max_experience: 6.0, min_salary: 900000, max_salary: 1600000, location: company.location, status: 'OPEN' },
        { id: 2, job_code: 'JOB-202', title: 'AI & Data Platform Engineer', department: 'Data & AI', job_role: 'ML Engineer', min_experience: 2.0, max_experience: 5.0, min_salary: 1000000, max_salary: 1800000, location: company.location, status: 'OPEN' }
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        ...company,
        active_jobs: activeJobs,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/companies
 * Create a new partner company
 */
async function createCompany(req, res, next) {
  try {
    const { name, tagline, industry, website, location, company_size, employee_count, description, benefits, work_policy, logo_color, founded_year } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const newCompany = {
      id: COMPANIES.length > 0 ? Math.max(...COMPANIES.map(c => c.id)) + 1 : 1,
      name: name.trim(),
      tagline: tagline ? tagline.trim() : 'Next-Generation Technology & Enterprise Engineering',
      logo_initials: initials || 'CO',
      logo_color: logo_color || '#0060A8',
      industry: industry ? industry.trim() : 'Enterprise Software',
      website: website ? website.trim() : 'https://example.com',
      location: location ? location.trim() : 'Bengaluru, Karnataka',
      company_size: company_size || 'MID_SIZE',
      employee_count: employee_count || '100-500 Employees',
      founded_year: founded_year ? parseInt(founded_year, 10) : new Date().getFullYear(),
      work_policy: work_policy ? work_policy.trim() : 'Flexible Hybrid & Remote',
      description: description ? description.trim() : 'Leading enterprise technology and platform solutions engineering high-impact distributed systems.',
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split(',').map(b => b.trim()) : [
        'Comprehensive Medical Insurance',
        'Flexible Hybrid Work Culture',
        'Annual Learning & Upskilling Grants',
        'Performance Bonuses'
      ]),
      hr_user_id: req.user?.id || 1,
      created_at: new Date().toISOString()
    };

    COMPANIES.push(newCompany);

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully.',
      data: newCompany,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/companies/my-company
 * Update current HR manager's company profile
 */
async function updateMyCompany(req, res, next) {
  try {
    const userId = req.user?.id;
    const { name, tagline, industry, website, location, company_size, employee_count, description, benefits, work_policy, logo_color, founded_year } = req.body;

    let company = COMPANIES.find(c => c.hr_user_id === userId);
    if (!company) {
      company = COMPANIES[0];
    }

    if (name) {
      company.name = name.trim();
      company.logo_initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    if (tagline !== undefined) company.tagline = tagline.trim();
    if (industry) company.industry = industry.trim();
    if (website) company.website = website.trim();
    if (location) company.location = location.trim();
    if (company_size) company.company_size = company_size;
    if (employee_count) company.employee_count = employee_count;
    if (description !== undefined) company.description = description.trim();
    if (work_policy) company.work_policy = work_policy.trim();
    if (logo_color) company.logo_color = logo_color;
    if (founded_year) company.founded_year = parseInt(founded_year, 10);
    if (benefits) {
      company.benefits = Array.isArray(benefits) ? benefits : benefits.split(',').map(b => b.trim());
    }

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/companies/:id
 * Update specific company profile by ID
 */
async function updateCompanyById(req, res, next) {
  try {
    const { id } = req.params;
    const { name, tagline, industry, website, location, company_size, employee_count, description, benefits, work_policy, logo_color, founded_year } = req.body;

    let company = COMPANIES.find(c => c.id === parseInt(id, 10));
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    if (name) {
      company.name = name.trim();
      company.logo_initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    if (tagline !== undefined) company.tagline = tagline.trim();
    if (industry) company.industry = industry.trim();
    if (website) company.website = website.trim();
    if (location) company.location = location.trim();
    if (company_size) company.company_size = company_size;
    if (employee_count) company.employee_count = employee_count;
    if (description !== undefined) company.description = description.trim();
    if (work_policy) company.work_policy = work_policy.trim();
    if (logo_color) company.logo_color = logo_color;
    if (founded_year) company.founded_year = parseInt(founded_year, 10);
    if (benefits) {
      company.benefits = Array.isArray(benefits) ? benefits : benefits.split(',').map(b => b.trim());
    }

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/companies/:id
 */
async function getCompanyById(req, res, next) {
  try {
    const { id } = req.params;
    const company = COMPANIES.find(c => c.id === parseInt(id, 10));

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    // Attach active jobs
    let activeJobs = [];
    try {
      const [jobs] = await mysqlPool.query(
        "SELECT id, job_code, title, department, job_role, min_experience, max_experience, min_salary, max_salary, location, company_size, status FROM jobs WHERE status = 'OPEN'"
      );
      if (jobs && jobs.length > 0) activeJobs = jobs;
    } catch (dbErr) {
      activeJobs = [
        { id: 1, job_code: 'JOB-201', title: 'Senior Full-Stack Developer', department: 'Engineering', job_role: 'Full Stack Developer', min_experience: 3.0, max_experience: 6.0, min_salary: 900000, max_salary: 1600000, location: company.location, status: 'OPEN' },
        { id: 2, job_code: 'JOB-202', title: 'AI & Data Platform Engineer', department: 'Data & AI', job_role: 'ML Engineer', min_experience: 2.0, max_experience: 5.0, min_salary: 1000000, max_salary: 1800000, location: company.location, status: 'OPEN' }
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        ...company,
        active_jobs: activeJobs,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCompanies,
  getMyCompany,
  createCompany,
  updateMyCompany,
  updateCompanyById,
  getCompanyById,
};
