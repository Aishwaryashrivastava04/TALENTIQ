# Project Defense Presentation Script & Slides

## Title: Smart Recruitment, Salary Prediction & Analytics System
**Presenter**: MCA Final Year Student  
**Integrated Subjects**: ML with Python | Core Java & JDBC | Statistics & Probability | RDBMS  

---

### Slide 1: Title & Introduction
- **Project Title**: Smart Recruitment, Salary Prediction & Analytics System
- **Objective**: Develop an enterprise-grade recruitment platform bridging predictive machine learning, Core Java OOP architectures, rigorous statistics, and a 3NF normalized relational database.
- **Key Theme**: Transitioning HR from subjective intuition to data-driven, explainable intelligence.

### Slide 2: The Core Problem in Recruitment
- Unstructured Resumes: Inability to rapidly parse and match tech stacks.
- Inconsistent Compensation: Guesswork in salary offers leading to candidate loss or budget overruns.
- Fragmented Systems: Academic projects often separate Java, databases, and ML into theoretical silos.

### Slide 3: Polyglot System Architecture
- **Frontend**: React 18 + Vite + Recharts + Modern Navy/Purple SaaS Design.
- **API Gateway**: Node.js + Express (JWT Security, Multer, Microservice Aggregator).
- **ML & Statistics Engine**: Python 3.12 + Flask + Scikit-Learn + SciPy (Port 5001).
- **Relational OOP Engine**: Java 17 + JDBC Driver + OOP Patterns.
- **Persistence**: MySQL 8.4 LTS (Normalized Relational Core) + MongoDB (Unstructured Documents).

### Slide 4: Subject 1 – Machine Learning Implementation
- **Models**:
  1. Linear Regression (OLS baseline)
  2. Random Forest Regressor (100 Decision Trees ensemble)
- **Features**: Experience, Education, Role, Skills Count, Location, Company Size.
- **Metrics**: MAE (₹1.76L vs ₹1.91L), RMSE (₹2.38L vs ₹2.76L), $R^2$ Score (94.58% vs 92.71%).
- **Resume Parsing**: Tokenization with 80+ technology ontology matching.
- **Explainable Matching**: Transparent candidate fit breakdown with matched vs missing skills.

### Slide 5: Subject 2 – Core Java & JDBC Implementation
- **Encapsulation**: Private state with strict validation boundaries (`Person`, `Candidate`, `Job`).
- **Inheritance & Polymorphism**: Abstract base `Person`, `Candidate` subclass with polymorphic method dispatch.
- **Interfaces**: Generic contract `RecordOperations<T>`.
- **Collections**: `ArrayList<Candidate>` for record sets; `HashMap<Integer, Job>` for $O(1)$ lookups.
- **Custom Exceptions**: `CandidateNotFoundException`, `InvalidSalaryException`.
- **JDBC**: Driver loading, `PreparedStatement`, `ResultSet`, and ACID Transactions.

### Slide 6: Subject 3 – Statistics & Probability Engine
- **Central Tendency**: Mean (₹22.73 LPA), Median (₹21.29 LPA), Mode (₹50 LPA).
- **Dispersion**: Standard Deviation (₹9.90 LPA), Variance ($9.80 \times 10^{11}$), IQR (₹14.65 LPA).
- **Correlation**: Pearson $r = 0.8318$ ($p < 0.0001$), Spearman $\rho = 0.8647$.
- **Distributions**: Histogram frequency intervals overlaid with Gaussian Normal PDF.
- **Probability Simulator**: Inferential logistic estimation: $P(\text{Hire} \mid \text{Match}, \text{ExpFit})$.

### Slide 7: Subject 4 – RDBMS & Dual Persistence
- **Normalization**: 8 Normalized tables satisfying 1NF, 2NF, and 3NF.
- **Primary & Foreign Keys**: Enforced referential integrity with cascading updates.
- **Stored Procedures**: `sp_RecordApplication` (Transaction boundary), `sp_MatchCandidateJob`.
- **Triggers**: `trg_after_application_status_update` (auditing transitions into `audit_logs`).
- **MongoDB**: Document collection `candidate_profiles` storing raw parsed resume tokens.

### Slide 8: Live System Demonstration Walkthrough
1. Admin Login & SaaS KPI Dashboard.
2. Candidate Management & Relational Database inspection.
3. PDF Resume Upload & Real-Time NLP Skill Extraction.
4. Smart Candidate-Job Matching with Explainable Rationale.
5. Dual-Model Salary Prediction Calculator (Linear Regression vs Random Forest).
6. Statistical Analytics & Interactive Recharts Scatter/Histogram Curves.
7. One-Click CSV Compliance Report Export.

### Slide 9: Ethical AI & Safety Governance
- AI serves as **decision support**, never an autonomous rejection gate.
- Salary predictions are statistical market benchmarks, not binding compensation offers.
- Final recruitment authority remains with human HR professionals.

### Slide 10: Conclusion & Q&A
- All 4 MCA subjects genuinely implemented with running source code.
- Fully runnable on macOS Apple Silicon M2.
- Thank You! Ready for Viva Voce questions.
