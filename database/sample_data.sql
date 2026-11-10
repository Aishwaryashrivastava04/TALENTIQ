-- ============================================================================
-- SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
-- SUBJECT 4: RDBMS - COMPREHENSIVE SAMPLE DATA
-- Real-world Indian Tech Industry Recruitment Context
-- ============================================================================

USE smart_recruitment_db;

-- ----------------------------------------------------------------------------
-- 1. SEED: users
-- Passwords below are bcrypt hash for: 'Admin@123' and 'Recruiter@123'
-- Hash: $2b$10$E9zH3f7J6YxQq/t58bWJ/Oa8M81O.D7g6.o1QzT5/jFkG9tP4bE0G
-- ----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES
(1, 'admin@recruitment.com', '$2b$10$nK2eTzN8bWJ/Oa8M81OD7g6.o1QzT5/jFkG9tP4bE0GkG9tP4bE0G', 'Aishwarya Shree', 'ADMIN', 1),
(2, 'recruiter.priya@recruitment.com', '$2b$10$nK2eTzN8bWJ/Oa8M81OD7g6.o1QzT5/jFkG9tP4bE0GkG9tP4bE0G', 'Priya Menon (Senior HR)', 'RECRUITER', 1),
(3, 'recruiter.vikram@recruitment.com', '$2b$10$nK2eTzN8bWJ/Oa8M81OD7g6.o1QzT5/jFkG9tP4bE0GkG9tP4bE0G', 'Vikram Malhotra (Tech Recruiter)', 'RECRUITER', 1),
(4, 'candidate.rahul@gmail.com', '$2b$10$nK2eTzN8bWJ/Oa8M81OD7g6.o1QzT5/jFkG9tP4bE0GkG9tP4bE0G', 'Rahul Verma (MCA Candidate)', 'CANDIDATE', 1);

-- ----------------------------------------------------------------------------
-- 2. SEED: skills (Categorized Technical Skill Dictionary)
-- ----------------------------------------------------------------------------
INSERT INTO skills (id, skill_name, category) VALUES
(1, 'Python', 'PROGRAMMING_LANGUAGE'),
(2, 'Java', 'PROGRAMMING_LANGUAGE'),
(3, 'JavaScript', 'PROGRAMMING_LANGUAGE'),
(4, 'TypeScript', 'PROGRAMMING_LANGUAGE'),
(5, 'C++', 'PROGRAMMING_LANGUAGE'),
(6, 'React.js', 'FRAMEWORK'),
(7, 'Node.js', 'FRAMEWORK'),
(8, 'Express.js', 'FRAMEWORK'),
(9, 'Spring Boot', 'FRAMEWORK'),
(10, 'Django', 'FRAMEWORK'),
(11, 'Flask', 'FRAMEWORK'),
(12, 'MySQL', 'DATABASE'),
(13, 'MongoDB', 'DATABASE'),
(14, 'PostgreSQL', 'DATABASE'),
(15, 'Redis', 'DATABASE'),
(16, 'AWS', 'CLOUD_DEVOPS'),
(17, 'Docker', 'CLOUD_DEVOPS'),
(18, 'Kubernetes', 'CLOUD_DEVOPS'),
(19, 'CI/CD Pipelines', 'CLOUD_DEVOPS'),
(20, 'Machine Learning', 'AI_ML'),
(21, 'Scikit-learn', 'AI_ML'),
(22, 'TensorFlow', 'AI_ML'),
(23, 'Natural Language Processing', 'AI_ML'),
(24, 'Data Visualization', 'AI_ML'),
(25, 'Git & GitHub', 'TOOLS_OTHER'),
(26, 'RESTful APIs', 'TOOLS_OTHER');

-- ----------------------------------------------------------------------------
-- 3. SEED: candidates (Diverse Experience, Degrees, and Salaries)
-- Salaries listed in INR per Annum (e.g., 600000 = 6 LPA, 1800000 = 18 LPA)
-- ----------------------------------------------------------------------------
INSERT INTO candidates (id, candidate_code, user_id, first_name, last_name, email, phone, experience_years, education_level, current_salary, expected_salary, location, status) VALUES
(1, 'CAN-1001', 4, 'Rahul', 'Verma', 'rahul.verma@gmail.com', '+91 9876543210', 3.5, 'MCA', 720000.00, 1000000.00, 'Bengaluru', 'AVAILABLE'),
(2, 'CAN-1002', NULL, 'Sneha', 'Patel', 'sneha.patel@outlook.com', '+91 9823456781', 5.0, 'BTECH', 1250000.00, 1600000.00, 'Pune', 'IN_PROCESS'),
(3, 'CAN-1003', NULL, 'Ananya', 'Iyer', 'ananya.iyer@gmail.com', '+91 9912345672', 2.0, 'BCA', 450000.00, 650000.00, 'Chennai', 'AVAILABLE'),
(4, 'CAN-1004', NULL, 'Rohan', 'Kulkarni', 'rohan.kulkarni@yahoo.com', '+91 9789012345', 7.5, 'MTECH', 2200000.00, 2800000.00, 'Hyderabad', 'IN_PROCESS'),
(5, 'CAN-1005', NULL, 'Amit', 'Deshmukh', 'amit.deshmukh@gmail.com', '+91 9123456789', 1.0, 'MCA', 380000.00, 550000.00, 'Pune', 'AVAILABLE'),
(6, 'CAN-1006', NULL, 'Divya', 'Nair', 'divya.nair@hotmail.com', '+91 9456789012', 4.0, 'BTECH', 950000.00, 1300000.00, 'Bengaluru', 'AVAILABLE'),
(7, 'CAN-1007', NULL, 'Karthik', 'Rao', 'karthik.rao@gmail.com', '+91 9678901234', 6.0, 'BTECH', 1500000.00, 1950000.00, 'Bengaluru', 'HIRED'),
(8, 'CAN-1008', NULL, 'Pooja', 'Gupta', 'pooja.gupta@rediffmail.com', '+91 9345678901', 0.5, 'BCA', 300000.00, 420000.00, 'Delhi NCR', 'AVAILABLE'),
(9, 'CAN-1009', NULL, 'Siddharth', 'Joshi', 'siddharth.joshi@gmail.com', '+91 9234567890', 8.0, 'MCA', 2400000.00, 3000000.00, 'Mumbai', 'AVAILABLE'),
(10, 'CAN-1010', NULL, 'Meera', 'Sundaram', 'meera.sundaram@gmail.com', '+91 9112233445', 3.0, 'BSC_CS', 580000.00, 800000.00, 'Chennai', 'AVAILABLE'),
(11, 'CAN-1011', NULL, 'Abhishek', 'Tiwari', 'abhishek.tiwari@gmail.com', '+91 9887766554', 4.5, 'MCA', 1100000.00, 1450000.00, 'Noida', 'IN_PROCESS'),
(12, 'CAN-1012', NULL, 'Tanvi', 'Bhardwaj', 'tanvi.bhardwaj@gmail.com', '+91 9776655443', 2.5, 'BTECH', 600000.00, 850000.00, 'Gurugram', 'AVAILABLE'),
(13, 'CAN-1013', NULL, 'Naveen', 'Choudhary', 'naveen.c@gmail.com', '+91 9665544332', 9.0, 'MTECH', 2800000.00, 3600000.00, 'Bengaluru', 'AVAILABLE'),
(14, 'CAN-1014', NULL, 'Deepak', 'Yadav', 'deepak.yadav@gmail.com', '+91 9554433221', 1.5, 'BCA', 400000.00, 550000.00, 'Pune', 'AVAILABLE'),
(15, 'CAN-1015', NULL, 'Ritu', 'Saxena', 'ritu.saxena@gmail.com', '+91 9443322110', 5.5, 'PHD', 1800000.00, 2400000.00, 'Hyderabad', 'AVAILABLE');

-- ----------------------------------------------------------------------------
-- 4. SEED: jobs (Corporate Openings)
-- ----------------------------------------------------------------------------
INSERT INTO jobs (id, job_code, created_by_user_id, title, department, job_role, min_experience, max_experience, min_salary, max_salary, location, company_size, status, description) VALUES
(1, 'JOB-201', 2, 'Senior Full-Stack Developer', 'Engineering', 'Full Stack Developer', 3.0, 6.0, 900000.00, 1600000.00, 'Bengaluru', 'ENTERPRISE', 'OPEN', 'Looking for an experienced Full-Stack Engineer skilled in React.js, Node.js, and relational databases.'),
(2, 'JOB-202', 2, 'AI & Machine Learning Engineer', 'Data & AI', 'ML Engineer', 2.0, 5.0, 1000000.00, 1800000.00, 'Hyderabad', 'MID_SIZE', 'OPEN', 'Seeking an ML Engineer to design predictive algorithms, NLP resume screening models, and data pipelines.'),
(3, 'JOB-203', 3, 'Core Java Backend Specialist', 'Banking Platform', 'Java Developer', 4.0, 8.0, 1200000.00, 2200000.00, 'Pune', 'ENTERPRISE', 'OPEN', 'Mission-critical fintech microservices using Java 17, Spring Boot, JDBC, and MySQL transaction management.'),
(4, 'JOB-204', 3, 'Data Analyst & Statistician', 'Analytics', 'Data Analyst', 1.0, 4.0, 500000.00, 900000.00, 'Mumbai', 'MID_SIZE', 'OPEN', 'Perform statistical hypothesis testing, recruitment analytics, and interactive dashboard reporting.'),
(5, 'JOB-205', 2, 'Frontend React Developer', 'Product Experience', 'Frontend Developer', 1.5, 4.0, 600000.00, 1100000.00, 'Chennai', 'STARTUP', 'OPEN', 'Develop responsive SaaS dashboards using React, Vite, modern CSS, and Recharts.'),
(6, 'JOB-206', 3, 'Cloud & DevOps Architect', 'Infrastructure', 'DevOps Engineer', 5.0, 9.0, 1800000.00, 3000000.00, 'Bengaluru', 'ENTERPRISE', 'OPEN', 'Manage AWS cloud infrastructure, Kubernetes clusters, Dockerized microservices, and CI/CD pipelines.');

-- ----------------------------------------------------------------------------
-- 5. SEED: candidate_skills (Mapping Candidates with Validated Skills)
-- ----------------------------------------------------------------------------
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
-- Rahul Verma (Candidate 1 - MCA): Full Stack & ML
(1, 1, 'ADVANCED', 3.0),
(1, 3, 'ADVANCED', 3.5),
(1, 6, 'ADVANCED', 3.0),
(1, 7, 'ADVANCED', 3.2),
(1, 8, 'INTERMEDIATE', 2.5),
(1, 12, 'EXPERT', 3.5),
(1, 13, 'INTERMEDIATE', 2.0),
(1, 20, 'INTERMEDIATE', 2.0),

-- Sneha Patel (Candidate 2 - BTech): Full Stack / Cloud
(2, 2, 'EXPERT', 5.0),
(2, 9, 'ADVANCED', 4.0),
(2, 12, 'ADVANCED', 4.5),
(2, 16, 'INTERMEDIATE', 3.0),
(2, 17, 'ADVANCED', 3.5),

-- Ananya Iyer (Candidate 3 - BCA): Frontend
(3, 3, 'ADVANCED', 2.0),
(3, 6, 'ADVANCED', 2.0),
(3, 25, 'INTERMEDIATE', 2.0),

-- Rohan Kulkarni (Candidate 4 - MTech): Java / Backend Enterprise
(4, 2, 'EXPERT', 7.5),
(4, 9, 'EXPERT', 6.0),
(4, 12, 'EXPERT', 7.0),
(4, 15, 'ADVANCED', 4.0),
(4, 17, 'ADVANCED', 5.0),

-- Amit Deshmukh (Candidate 5 - MCA): Junior Full Stack
(5, 1, 'INTERMEDIATE', 1.0),
(5, 3, 'INTERMEDIATE', 1.0),
(5, 7, 'BEGINNER', 1.0),
(5, 12, 'INTERMEDIATE', 1.0),

-- Divya Nair (Candidate 6 - BTech): AI / ML Specialist
(6, 1, 'EXPERT', 4.0),
(6, 20, 'ADVANCED', 3.5),
(6, 21, 'ADVANCED', 3.5),
(6, 23, 'ADVANCED', 3.0),
(6, 24, 'ADVANCED', 4.0),

-- Siddharth Joshi (Candidate 9 - MCA): Senior Architect
(9, 2, 'EXPERT', 8.0),
(9, 7, 'EXPERT', 6.0),
(9, 12, 'EXPERT', 8.0),
(9, 16, 'ADVANCED', 5.0),
(9, 17, 'ADVANCED', 5.0);

-- ----------------------------------------------------------------------------
-- 6. SEED: applications (Recruitment Workflow Records)
-- ----------------------------------------------------------------------------
INSERT INTO applications (id, application_code, candidate_id, job_id, match_score, status, notes) VALUES
(1, 'APP-849201', 1, 1, 88.50, 'SHORTLISTED', 'Strong match on React, Node.js, and MySQL. MCA with 3.5 years experience perfectly aligns.'),
(2, 'APP-849202', 6, 2, 94.20, 'SHORTLISTED', 'Outstanding NLP and Scikit-learn profile. Candidate screened with top technical score.'),
(3, 'APP-849203', 4, 3, 91.00, 'INTERVIEW_SCHEDULED', 'Strong Java and Spring Boot experience. Technical round 1 cleared with high rating.'),
(4, 'APP-849204', 3, 5, 82.00, 'SCREENED', 'Strong React fundamentals. Junior frontend applicant.'),
(5, 'APP-849205', 2, 1, 76.40, 'APPLIED', 'Strong Java profile, cross-applied for full-stack role.'),
(6, 'APP-849206', 7, 6, 95.00, 'SELECTED', 'Offered Senior Cloud Engineer role. Exceptional Kubernetes and AWS hands-on skills.');

-- ----------------------------------------------------------------------------
-- 7. SEED: interviews
-- ----------------------------------------------------------------------------
INSERT INTO interviews (id, application_id, round_number, round_type, scheduled_at, interviewer_name, status, feedback, rating) VALUES
(1, 1, 1, 'TECHNICAL_1', '2026-11-10 14:00:00', 'Vikram Malhotra', 'SCHEDULED', 'To assess React hooks, Express routing, and SQL subquery optimizations.', NULL),
(2, 2, 1, 'TECHNICAL_1', '2026-11-08 11:30:00', 'Dr. Radhakrishnan', 'SCHEDULED', 'Focus on Random Forest hyperparameters, MAE/RMSE calculations, and NLP tokenization.', NULL),
(3, 3, 1, 'TECHNICAL_1', '2026-11-04 15:00:00', 'Suresh Raina', 'COMPLETED', 'Candidate showed deep understanding of JDBC PreparedStatement, connection pooling, and multi-threading.', 5),
(4, 3, 2, 'HR_ROUND', '2026-11-09 16:00:00', 'Priya Menon', 'SCHEDULED', 'Salary negotiation and culture fit assessment.', NULL),
(5, 6, 1, 'FINAL_SELECTION', '2026-11-01 10:00:00', 'Aishwarya Shree', 'COMPLETED', 'Candidate accepted offer letter. Joining date confirmed.', 5);

-- ----------------------------------------------------------------------------
-- 8. SEED: predictions (Historical ML Model Inferences for Auditing & Statistics)
-- ----------------------------------------------------------------------------
INSERT INTO predictions (id, candidate_id, experience_years, education_level, job_role, technical_skills_count, location, company_size, lr_predicted_salary, rf_predicted_salary, confidence_score) VALUES
(1, 1, 3.5, 'MCA', 'Full Stack Developer', 6, 'Bengaluru', 'ENTERPRISE', 945000.00, 980000.00, 89.50),
(2, 6, 4.0, 'BTECH', 'ML Engineer', 5, 'Hyderabad', 'MID_SIZE', 1210000.00, 1260000.00, 92.10),
(3, 4, 7.5, 'MTECH', 'Java Developer', 5, 'Pune', 'ENTERPRISE', 2150000.00, 2240000.00, 94.00),
(4, 3, 2.0, 'BCA', 'Frontend Developer', 3, 'Chennai', 'STARTUP', 620000.00, 640000.00, 85.30),
(5, 9, 8.0, 'MCA', 'Full Stack Developer', 7, 'Mumbai', 'ENTERPRISE', 2380000.00, 2450000.00, 93.80),
(6, 11, 4.5, 'MCA', 'Data Analyst', 4, 'Noida', 'MID_SIZE', 1050000.00, 1080000.00, 88.00),
(7, 13, 9.0, 'MTECH', 'DevOps Engineer', 6, 'Bengaluru', 'ENTERPRISE', 2720000.00, 2810000.00, 95.20),
(8, 14, 1.5, 'BCA', 'Frontend Developer', 2, 'Pune', 'STARTUP', 480000.00, 505000.00, 81.00);

-- ----------------------------------------------------------------------------
-- 9. SEED: membership_plans (Configurable Career Growth Tiers)
-- ----------------------------------------------------------------------------
INSERT INTO membership_plans (id, plan_code, name, billing_cycle, price_inr, currency, features, is_active) VALUES
(1, 'FREE', 'Basic Career Explorer', 'FREE', 0.00, 'INR', 
 '["Job search and direct applications", "Basic application tracking pipeline", "Candidate profile dossier", "Standard resume upload", "Basic job recommendations", "Basic salary benchmarks"]', 1),
(2, 'PREMIUM_MONTHLY', 'Career Growth Pro (Monthly)', 'MONTHLY', 299.00, 'INR',
 '["Advanced AI resume review and ATS score", "Detailed resume improvement suggestions", "AI mock interview practice simulator", "Personalized interview questions", "Interview preparation guidance", "Personalized 90-day career roadmap", "Advanced skill gap analysis", "Personalized job alerts", "Detailed salary insights", "Application performance analytics", "Advanced career recommendations", "Priority career support"]', 1),
(3, 'PREMIUM_YEARLY', 'Career Growth Executive (Yearly)', 'YEARLY', 1999.00, 'INR',
 '["All Monthly Premium Features included", "Save 44% compared to monthly billing", "Unlimited AI resume audits and bullet rewrites", "Unlimited AI mock interview sessions", "Executive salary negotiation playbook", "Priority dedicated technical career assistance", "Early access to verified enterprise requisitions"]', 1);

-- ----------------------------------------------------------------------------
-- 10. SEED: subscriptions
-- User 4 (Rahul Verma) active monthly subscriber
-- ----------------------------------------------------------------------------
INSERT INTO subscriptions (id, user_id, plan_code, status, billing_cycle, price_paid, currency, starts_at, expires_at, auto_renew) VALUES
(1, 4, 'PREMIUM_MONTHLY', 'ACTIVE', 'MONTHLY', 299.00, 'INR', '2026-11-01 10:00:00', '2026-12-01 10:00:00', 1);

-- ----------------------------------------------------------------------------
-- 11. SEED: payments
-- ----------------------------------------------------------------------------
INSERT INTO payments (id, invoice_number, user_id, subscription_id, order_id, payment_id, signature, amount, currency, status, payment_method, billing_cycle, paid_at) VALUES
(1, 'INV-2026-1001', 4, 1, 'order_rcpt_20261101_001', 'pay_test_992147101', 'sig_test_verified_hash_992147101', 299.00, 'INR', 'SUCCESS', 'RAZORPAY', 'MONTHLY', '2026-11-01 10:05:00');
