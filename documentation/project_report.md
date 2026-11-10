# Comprehensive Academic Project Report

# SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
**Degree**: Master of Computer Applications (MCA)  
**Specialization**: Generative AI, Data Engineering & Full-Stack Systems  

---

## CHAPTER 1: INTRODUCTION

### 1.1 Background
In modern enterprise talent acquisition, recruitment departments process hundreds of unstructured resumes daily. Manual parsing, human subjectivity in compensation proposals, and disconnected recruitment tracking lead to extended hiring cycles and sub-optimal hiring decisions.

### 1.2 Problem Statement
Existing applicant tracking systems (ATS) often lack explainable matching algorithms, provide no empirical salary prediction benchmarks, and operate as monolithic black-box systems. Academic requirements necessitate an integrated engineering approach uniting:
1. **Machine Learning** for salary regression and natural language processing.
2. **Object-Oriented Core Java** for robust records management and database transactions.
3. **Applied Statistics** for descriptive and probabilistic workforce intelligence.
4. **Normalized RDBMS** for transactional integrity, stored routines, and auditability.

### 1.3 Project Objectives
- Develop an intelligent recruitment management SaaS platform.
- Build and evaluate Linear Regression vs Random Forest Regressor models for compensation prediction.
- Implement resume parsing and NLP skill extraction.
- Create an independent Core Java module implementing OOP, Interfaces, Collections, and JDBC.
- Compute comprehensive statistical measures (Mean, Median, Mode, Variance, StdDev, Pearson $r$).
- Design a 3NF normalized MySQL database with procedures, triggers, views, and MongoDB document persistence.

---

## CHAPTER 2: FOUR-SUBJECT INTEGRATION ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│                   EXECUTIVE REACT 18 SAAS FRONTEND                     │
│                (Recharts, Responsive Navy/Purple Theme)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST / JSON
┌───────────────────────────────────▼────────────────────────────────────┐
│                    NODE.JS EXPRESS API GATEWAY                         │
│             (JWT Security, Multer Ingestion, Aggregator)               │
└───────────┬───────────────────────┬───────────────────────────┬────────┘
            │                       │                           │
┌───────────▼───────────┐ ┌─────────▼─────────────┐ ┌───────────▼────────┐
│  SUBJECT 1 & 3:       │ │  SUBJECT 2:           │ │  SUBJECT 4:        │
│  PYTHON ML & STATS    │ │  CORE JAVA 17 & JDBC  │ │  RDBMS PERSISTENCE │
│                       │ │                       │ │                    │
│ • Linear Regression   │ │ • Person (Abstract)   │ │ • MySQL 8.4 (3NF)  │
│ • Random Forest       │ │ • Candidate (Inherit) │ │ • Stored Procs     │
│ • MAE, MSE, RMSE, R²  │ │ • Generic Interfaces  │ │ • Triggers & Views │
│ • NLP Resume Parser   │ │ • ArrayList & HashMap │ │ • MongoDB 7.0 Docs │
│ • Pearson Correlation │ │ • PreparedStatement   │ │                    │
│ • P(Hire) Probability │ │ • JDBC Connection     │ │                    │
└───────────────────────┘ └───────────────────────┘ └────────────────────┘
```

---

## CHAPTER 3: SUBJECT-WISE TECHNICAL IMPLEMENTATION

### 3.1 Subject 1: Machine Learning with Python
- **Dataset**: `ml-service/datasets/salary_dataset.csv` containing 1,500 realistic tech industry compensation samples.
- **Preprocessing**: `ColumnTransformer` with `StandardScaler` on numerical features (`experience_years`, `technical_skills_count`) and `OneHotEncoder(handle_unknown='ignore')` on categorical features (`education_level`, `job_role`, `location`, `company_size`).
- **Models**:
  1. `LinearRegression()`: Baseline Ordinary Least Squares parametric model.
  2. `RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)`: Ensemble non-parametric regressor.
- **Evaluation Holdout**: 20% test split (300 unseen samples).
  - Linear Regression: MAE = ₹1,76,728 | RMSE = ₹2,38,229 | $R^2 = 0.9458$ (94.58%)
  - Random Forest: MAE = ₹1,91,568 | RMSE = ₹2,76,318 | $R^2 = 0.9271$ (92.71%)
- **Resume Tokenizer (`ResumeParser`)**: Regular expressions with boundary checking tokenizing text against 80+ industry skills across Programming, Web Frameworks, Relational Databases, Cloud/DevOps, and AI/ML.

### 3.2 Subject 2: Core Java & JDBC
- **Abstraction**: `model.Person` abstract base class defining polymorphic contracts.
- **Inheritance & Polymorphism**: `model.Candidate extends Person` overriding `getRoleTitle()` and `getDisplaySummary()`.
- **Interfaces**: Generic contract `util.RecordOperations<T>` declaring `findById()`, `findAll()`, `create()`, `update()`, and `delete()`.
- **Collections Framework**: `ArrayList<Candidate>` for dynamic result sets, `HashMap<Integer, Job>` for $O(1)$ fast indexed lookups, and `HashMap<String, List<Candidate>>` for grouping by education.
- **Custom Exceptions**: `CandidateNotFoundException`, `DatabaseConnectionException`, and `InvalidSalaryException`.
- **JDBC Driver**: Direct loading via `Class.forName("com.mysql.cj.jdbc.Driver")`, `PreparedStatement` parameter binding, `ResultSet` extraction, and transactional boundaries (`conn.setAutoCommit(false)`, `conn.commit()`).

### 3.3 Subject 3: Statistics and Probability
- **Descriptive Statistics**:
  - Sample Size: $N = 1,500$
  - Mean Salary: ₹22,73,375 INR (₹22.73 LPA)
  - Median Salary: ₹21,29,000 INR (₹21.29 LPA)
  - Mode: ₹50,00,000 INR
  - Sample Variance: $s^2 = 9.80 \times 10^{11}$
  - Standard Deviation: $s = ₹9,90,134$ (₹9.90 LPA)
  - Quartiles: $Q_1 = ₹14.74$ LPA, $Q_2 = ₹21.29$ LPA, $Q_3 = ₹29.39$ LPA, $IQR = ₹14.65$ LPA
  - Skewness: $+0.5531$ (Right-skewed positive distribution)
- **Correlation**:
  - Pearson's $r = 0.8318$ ($p < 0.0001$, Strong Positive Correlation)
  - Spearman's $\rho = 0.8647$
- **Inferential Probability**:
  - Logistic candidate selection likelihood model:
    $$P(\text{Hire}) = \frac{1}{1 + e^{-[4.5(\text{ScoreNorm} - 0.60) + 1.2(\text{ExpFit} - 0.5)]}}$$

### 3.4 Subject 4: Relational Database Management Systems (RDBMS)
- **Normal Forms**:
  - **1NF**: Atomic attributes, zero repeating groups.
  - **2NF**: No partial functional dependencies on composite keys (`candidate_skills`).
  - **3NF**: No transitive dependencies.
- **Stored Procedures**: `sp_RecordApplication` (ACID transaction), `sp_MatchCandidateJob`, `sp_GetDashboardStats`.
- **Stored Functions**: `fn_CalculateExperienceScore`.
- **Triggers**: `trg_after_application_status_update` (auditing transitions into `audit_logs`), `trg_before_candidate_insert_check`.
- **Views**: `vw_active_jobs_summary`, `vw_candidate_profile_details`, `vw_application_full_details`, `vw_salary_analytics_summary`.

---

## CHAPTER 4: CONCLUSION & FUTURE SCOPE

The **Smart Recruitment, Salary Prediction & Analytics System** successfully validates that modern enterprise software benefits from an integrated polyglot paradigm. Machine learning delivers empirical predictive compensation intelligence; Core Java enforces strict OOP and transactional reliability; mathematical statistics delivers rigorous business clarity; and normalized RDBMS ensures data integrity and compliance.
