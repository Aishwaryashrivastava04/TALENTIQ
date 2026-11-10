# Viva Voce Examination Questions & Model Answers

## Four MCA Subjects Defense Preparation Guide

---

## SUBJECT 1: MACHINE LEARNING WITH PYTHON

### Q1: Why did you implement both Linear Regression and Random Forest Regressor?
**Model Answer**:  
"We implemented both models to demonstrate the trade-offs between **parametric linear modeling** and **non-parametric ensemble modeling**:
1. **Linear Regression (OLS)** serves as an interpretable baseline that assumes a straight-line linear relationship ($y = \mathbf{w}^T \mathbf{x} + b$). In our recruitment dataset, experience exhibits strong linearity ($r=0.8318$).
2. **Random Forest Regressor** is an ensemble of 100 decision trees that does not assume linearity. It effectively captures complex non-linear feature interactions, such as Tier-1 city salary bumps and exponential skill compounding, with lower variance due to bootstrap aggregation (bagging)."

### Q2: How did you compare both models? What do MAE, MSE, RMSE, and R² signify?
**Model Answer**:  
- **MAE (Mean Absolute Error)**: $\frac{1}{n} \sum |y_i - \hat{y}_i|$. Represents the average rupee error in natural units (INR). It is less sensitive to extreme outliers.
- **MSE (Mean Squared Error)**: $\frac{1}{n} \sum (y_i - \hat{y}_i)^2$. Penalizes large estimation errors quadratically.
- **RMSE (Root Mean Squared Error)**: $\sqrt{\text{MSE}}$. Restores the squared error back to INR units. If RMSE is substantially higher than MAE, it indicates the presence of large prediction outliers.
- **$R^2$ Score (Coefficient of Determination)**: $1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$. Measures the proportion of total salary variance explained by the model features. In our project, both models achieved high accuracy ($R^2 > 0.92$ on holdout test data).

### Q3: How does your resume parser and skill extraction algorithm work?
**Model Answer**:  
"The resume parser uses `pypdf` to extract raw binary text from uploaded PDF resumes. It applies regular expressions with boundary lookaheads and token matching against an ontology of 80+ categorized industry technical competencies (Programming Languages, Web Frameworks, Relational Databases, Cloud/DevOps, AI/ML). Education degrees (MCA, B.Tech, M.Tech, Ph.D) and contact information are identified via contextual regex patterns."

---

## SUBJECT 2: CORE JAVA & JDBC

### Q4: How are Abstraction, Inheritance, and Polymorphism implemented in your Java module?
**Model Answer**:  
- **Abstraction**: Implemented via the `abstract class Person`, which declares abstract contracts `getRoleTitle()` and `getDisplaySummary()`. `Person` cannot be instantiated directly.
- **Inheritance**: Implemented via `class Candidate extends Person`, inheriting common identity attributes (`firstName`, `lastName`, `email`, `phone`) while adding recruitment-specific fields.
- **Polymorphism**: Implemented via **Dynamic Method Dispatch**. A parent reference `Person p = new Candidate(...)` invokes the overridden `Candidate.getDisplaySummary()` at runtime based on the actual object instance, rather than the reference type.

### Q5: How did you implement Java Collections and Custom Exception handling?
**Model Answer**:  
- **Collections**:
  - `ArrayList<Candidate>` is used in `CandidateDAO.findAll()` for dynamic, ordered record sequences.
  - `HashMap<Integer, Job>` is used in `JobDAO.getJobsAsIndexedMap()` for $O(1)$ constant-time primary key lookups, and in `RecruitmentManager.groupCandidatesByEducation()` for grouping.
- **Custom Exceptions**:
  - `CandidateNotFoundException`: A custom checked exception extending `RecruitmentException`, thrown when a queried ID does not exist in MySQL.
  - `InvalidSalaryException`: A custom unchecked `RuntimeException` enforcing business validations (e.g., preventing negative salaries).

### Q6: Why did you use `PreparedStatement` instead of `Statement` in JDBC?
**Model Answer**:  
"1. **SQL Injection Defense**: `PreparedStatement` pre-compiles the SQL query structure in the database engine and safely binds user values as typed parameters (`?`), preventing malicious SQL injection attacks.  
2. **Performance Optimization**: The database compiles and caches the query execution plan once, allowing efficient repeated executions with different parameter values.  
3. **Automatic Type Conversion**: Handles Java-to-SQL data type mapping (e.g., `Timestamp`, `BigDecimal`, `Double`) seamlessly."

---

## SUBJECT 3: STATISTICS AND PROBABILITY

### Q7: What is the difference between Descriptive Statistics and Inferential Probability in your system?
**Model Answer**:  
- **Descriptive Statistics**: Summarizes the empirical properties of observed historical recruitment records (Mean salary: ₹22.73 LPA, Median: ₹21.29 LPA, Standard Deviation: ₹9.90 LPA, IQR: ₹14.65 LPA). They describe what has already occurred without generalization uncertainty.
- **Inferential Probability**: Models future likelihoods under uncertainty. In our system, the **Selection Probability Simulator** uses an empirical logistic distribution function to estimate $P(\text{Candidate Selected} \mid \text{Match Score}, \text{Experience Delta})$ for newly submitted applicants.

### Q8: What does Pearson's Correlation Coefficient ($r=0.8318$) indicate in your analytics?
**Model Answer**:  
"Pearson's $r = 0.8318$ indicates a **strong, statistically significant positive linear correlation** ($p < 0.0001$) between years of professional experience and annual compensation in the Indian tech sector. As experience increases, compensation scales upward systematically. We also computed Spearman's rank correlation ($\rho = 0.8647$) to confirm monotonic alignment without strictly assuming normal homoscedasticity."

---

## SUBJECT 4: RDBMS (RELATIONAL DATABASE)

### Q9: Explain how your MySQL schema satisfies 1NF, 2NF, and 3NF.
**Model Answer**:  
1. **First Normal Form (1NF)**: Every column holds atomic (indivisible) values. Repeating groups of skills were decoupled from the `candidates` table into a separate standardized `skills` table and an associative bridge table `candidate_skills`.
2. **Second Normal Form (2NF)**: The schema is in 1NF, and all non-key attributes are fully functionally dependent on the entire primary key. In `candidate_skills`, composite key `(candidate_id, skill_id)` uniquely determines `proficiency` and `years_experience` without partial dependency.
3. **Third Normal Form (3NF)**: The schema is in 2NF, and there are no **transitive dependencies** ($X \to Y \to Z$). Candidate educational details, job openings, and interview rounds are normalized into distinct relational entities referenced exclusively through foreign keys.

### Q10: How do Stored Procedures and Triggers contribute to your database architecture?
**Model Answer**:  
- **Stored Procedures**: Encapsulate transactional business logic inside the database engine. For example, `sp_RecordApplication` wraps applicant duplicate checks and insertion within an explicit `START TRANSACTION`, `COMMIT`, and `ROLLBACK` boundary with `SQLEXCEPTION` handlers.
- **Triggers**: Enforce active data integrity and event auditing. The `trg_after_application_status_update` trigger fires automatically `AFTER UPDATE ON applications`, serializing the `OLD` and `NEW` record states into JSON and inserting an immutable audit entry into `audit_logs`.
