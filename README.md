# SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
### Four-Subject Integrated MCA (Generative AI) Final Year Project

[![Node.js](https://img.shields.io/badge/Node.js-24.3-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org/)
[![Java](https://img.shields.io/badge/Java-17%20LTS-orange.svg)](https://adoptium.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.4%20LTS-informational.svg)](https://mysql.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)]()

---

## 📖 Executive Summary
The **Smart Recruitment, Salary Prediction & Analytics System** is an intelligent full-stack human resource management platform developed as a four-subject integrated Master of Computer Applications (MCA) project. It bridges modern AI/ML algorithms, Core Java OOP architectures, scientific statistical methods, and normalized relational databases into a single cohesive SaaS solution.

---

## 🎓 The Four MCA Subjects Implementation

| Subject | Technology | Concrete Source Implementation | Viva Demonstration |
| :--- | :--- | :--- | :--- |
| **Subject 1: Machine Learning with Python** | Python 3.12, Scikit-learn, Pandas, NumPy, Flask | `ml-service/train_model.py`, `app.py`, `resume_parser.py`, `smart_matcher.py` | Linear Regression vs Random Forest Regressor compared with **MAE, MSE, RMSE, R² Score**; NLP resume tokenization & skill extraction; explainable candidate matching. |
| **Subject 2: Core Java** | Java 17 LTS, JDBC, MySQL Connector/J | `java-service/src/main/java/` (`model/`, `dao/`, `service/`, `exception/`, `util/`, `Main.java`) | Abstraction (`Person`), Inheritance & Polymorphism (`Candidate extends Person`), Encapsulation, Generic Interface (`RecordOperations<T>`), Collections (`ArrayList`, `HashMap`), Custom Exceptions, and direct JDBC `PreparedStatement` & `ResultSet`. |
| **Subject 3: Statistics and Probability** | SciPy, NumPy, Pandas, React Recharts | `ml-service/statistics.py`, `frontend/src/pages/RecruitmentAnalytics.jsx` | Mean, Median, Mode, Variance ($s^2$), Standard Deviation ($s$), Min/Max, Quartiles ($Q_1, Q_2, Q_3, IQR$), Pearson Correlation ($r = 0.8318$), Gaussian PDF distribution, and logistic empirical selection probability $P(\text{Hire})$. |
| **Subject 4: RDBMS** | MySQL 8.4 LTS, MongoDB 7.0 | `database/schema.sql`, `views.sql`, `procedures.sql`, `triggers.sql`, `sample_data.sql` | 8 Normalized 3NF tables, PK/FK constraints, Views, Stored Procedures (`sp_RecordApplication` with ACID transaction), Stored Functions, Event-Condition-Action Triggers (`trg_after_application_status_update`), and MongoDB cross-DB linking. |

---

## 📂 Project Architecture & Folder Structure

```
SmartRecruitmentProject/
├── frontend/                     # React 18 + Vite SaaS UI
│   ├── src/
│   │   ├── components/           # Sidebar, Header
│   │   ├── pages/                # Dashboard, Candidates, ResumeScreening, Jobs, Applications,
│   │   │                         # SalaryPrediction, RecruitmentAnalytics, Reports, Settings, Login
│   │   ├── services/             # Axios API Client & JWT Interceptor
│   │   ├── App.jsx               # Navigation & Session state
│   │   ├── main.jsx              # Vite Entry point
│   │   └── index.css             # Executive Navy/Purple Theme
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST API Gateway
│   ├── src/
│   │   ├── config/db.js          # MySQL2 connection pool + Mongoose MongoDB
│   │   ├── controllers/          # Candidates, Jobs, Applications, ML, Analytics, Reports, Auth
│   │   ├── middleware/           # JWT Authentication & Role-Based Access Control
│   │   ├── models/               # MongoDB Mongoose Schemas (CandidateProfile, ScreeningResult)
│   │   └── routes/               # Express API Route Mounters
│   ├── server.js                 # API Server Entry Point (Port 5000)
│   └── package.json
│
├── ml-service/                   # Subject 1 & 3: Python ML & Statistics Service
│   ├── datasets/                 # 1,500 Realistic Tech Recruitment Samples
│   ├── models/                   # Serialized Scikit-Learn Pipelines (.joblib) & Metrics JSON
│   ├── app.py                    # Flask REST API Microservice (Port 5001)
│   ├── train_model.py            # Linear Regression & Random Forest Training Pipeline
│   ├── resume_parser.py          # PDF Tokenizer & NLP Skill Extraction Engine
│   ├── smart_matcher.py          # Explainable Candidate-Job Matching Algorithm
│   ├── statistics.py             # Descriptive & Inferential Statistical Calculations
│   └── requirements.txt
│
├── java-service/                 # Subject 2: Core Java & JDBC Standalone Engine
│   ├── src/main/java/
│   │   ├── model/                # Person (Abstract), Candidate, Job, Application
│   │   ├── dao/                  # CandidateDAO, JobDAO, ApplicationDAO (JDBC)
│   │   ├── service/              # RecruitmentManager (Collections & Business Logic)
│   │   ├── exception/            # CandidateNotFoundException, InvalidSalaryException
│   │   ├── util/                 # RecordOperations<T> Interface, DBConnection
│   │   └── Main.java             # Standalone Verification Runner
│   ├── lib/                      # mysql-connector-j-8.4.0.jar
│   └── pom.xml
│
├── database/                     # Subject 4: Relational Database Core
│   ├── schema.sql                # 8 Normalized 3NF Tables (MySQL 8.4 LTS)
│   ├── views.sql                 # Database Views (Aggregations & Joins)
│   ├── procedures.sql            # Stored Procedures & Functions (ACID Transactions)
│   ├── triggers.sql              # Database Triggers (Audit Logging)
│   └── sample_data.sql           # Realistic Indian Tech Recruitment Seed Records
│
└── documentation/                # Comprehensive Academic Project Deliverables
    ├── abstract.md               # Formal Abstract
    ├── project_report.md         # Full Academic Project Report
    ├── system_architecture.md    # ER Diagram, DFD (0, 1, 2), UML & Sequence Diagrams
    ├── api_documentation.md      # REST API Reference
    ├── viva_questions_answers.md # Viva Voce Questions & Answers Guide
    ├── project_presentation.md   # Presentation Slides Script
    └── testing_report.md         # Unit, Integration & Regression Test Verification
```

---

## 🚀 Step-by-Step macOS Setup Instructions (Apple Silicon M2)

### Prerequisites Check
The project is optimized for macOS Apple Silicon (M2). Run these commands in your Terminal:

```bash
# Verify runtimes
node -v          # Recommended: v20+ / v24
python3.12 -v    # Python 3.12 virtual environment
javac -version   # OpenJDK 17 LTS (Temurin)
```

---

### Step 1: Initialize Database (MySQL & MongoDB)

If you have MySQL running locally:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/views.sql
mysql -u root -p < database/procedures.sql
mysql -u root -p < database/triggers.sql
mysql -u root -p < database/sample_data.sql
```
*(Note: If MySQL is not running, the application has built-in graceful fallback caching so the dashboard and demonstration remain fully interactive for offline review).*

---

### Step 2: Start Python ML Microservice (Port 5001)

Open **Terminal Window 1**:
```bash
cd ml-service
./venv/bin/python app.py
```
> *Starts Flask REST Microservice on `http://127.0.0.1:5001` serving Salary Predictions, NLP Resume Parsing, and Statistics.*

---

### Step 3: Run Core Java Verification Module

Open **Terminal Window 2**:
```bash
# Run Java OOP & JDBC demonstration
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java -cp java-service/bin:java-service/lib/mysql-connector-j-8.4.0.jar Main
```
> *Demonstrates Abstraction, Inheritance, Polymorphism, Encapsulation, Custom Exceptions, Collections (ArrayList, HashMap), and JDBC PreparedStatement operations.*

---

### Step 4: Start Node.js Express Gateway (Port 5000)

Open **Terminal Window 3**:
```bash
cd backend
npm start
```
> *Starts API Gateway on `http://127.0.0.1:5000` with health check at `http://127.0.0.1:5000/api/health`.*

---

### Step 5: Start React 18 Frontend Dashboard (Port 5173)

Open **Terminal Window 4**:
```bash
cd frontend
npm run dev
```
> *Access the modern SaaS HR Portal at: **`http://localhost:5173`***

---

## 🔑 Demo Login Credentials

The application includes 1-Click Quick Login buttons on the sign-in screen:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Lead Admin** | `admin@recruitment.com` | `Admin@123` | Full enterprise control, candidate/job deletion, audit inspections |
| **Senior Recruiter** | `recruiter.priya@recruitment.com` | `Recruiter@123` | Resume screening, candidate matching, pipeline stage updates |
| **Candidate** | `candidate.rahul@gmail.com` | `Candidate@123` | Applicant self-service portal & prediction benchmarks |

---

## ⚖️ Safety, Ethics & Governance

1. **Human-In-The-Loop**: Candidate matching scores are transparently explainable (listing exact matched vs missing skills). The system strictly prohibits automated AI rejection.
2. **Compensation Advisory**: Salary predictions are statistical market estimations to assist negotiations and do not represent binding offers.
