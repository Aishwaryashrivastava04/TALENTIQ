# System Architecture & Diagrammatic Specifications

## 1. High-Level Polyglot Architecture

```mermaid
flowchart TD
    Client["React 18 SaaS Client (Port 5173)<br/>Vite + Recharts + Lucide Icons"]
    
    subgraph GatewayTier["API Gateway & Main Orchestrator (Port 5000)"]
        Express["Node.js / Express.js REST API"]
        JWT["JWT Auth & Role-Based Access Control"]
        Multer["Multer Resume File Ingestion Pipeline"]
    end
    
    subgraph PythonMicroservice["Subject 1 & 3: Python ML & Stats Engine (Port 5001)"]
        Flask["Flask Microservice Server"]
        LR["Linear Regression Pipeline"]
        RF["Random Forest Ensemble Pipeline"]
        NLP["Resume Parser & Tokenizer (pypdf + regex)"]
        Matcher["Smart Candidate Matcher Engine"]
        Stats["NumPy/Pandas/SciPy Statistics Engine"]
    end
    
    subgraph JavaMicroservice["Subject 2: Core Java & JDBC Engine (Port 5002 / CLI)"]
        JavaApp["Core Java Record Engine"]
        OOP["OOP: Person (Abstract) -> Candidate"]
        Coll["Collections: ArrayList, HashMap"]
        JDBC["JDBC PreparedStatement & ResultSet"]
    end
    
    subgraph DataStorage["Subject 4: Dual Persistence Tier"]
        MySQL[("MySQL 8.4 LTS<br/>Normalized 3NF Relational Tables<br/>Stored Procedures, Triggers, Views")]
        MongoDB[("MongoDB 7.0<br/>Extended Candidate Profiles,<br/>Screening Results, Audit Logs")]
    end
    
    Client -->|REST / JSON| Express
    Express --> JWT
    Express --> Multer
    Express -->|HTTP POST /predict, /parse, /match, /statistics| Flask
    Express -->|Record Verification & JDBC Query| MySQL
    Express -->|Mongoose ODM| MongoDB
    JavaApp -->|Direct JDBC Driver| MySQL
```

---

## 2. Entity-Relationship (ER) Diagram (MySQL 8.4 3NF Schema)

```mermaid
erDiagram
    USERS ||--o{ CANDIDATES : creates_or_links
    USERS ||--o{ JOBS : posts
    CANDIDATES ||--o{ CANDIDATE_SKILLS : possesses
    SKILLS ||--o{ CANDIDATE_SKILLS : categorized_in
    CANDIDATES ||--o{ APPLICATIONS : submits
    JOBS ||--o{ APPLICATIONS : receives
    APPLICATIONS ||--o{ INTERVIEWS : schedules
    CANDIDATES ||--o{ PREDICTIONS : estimates_compensation
    APPLICATIONS ||--o{ AUDIT_LOGS : triggers_audit

    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        enum role "ADMIN, RECRUITER, CANDIDATE"
        boolean is_active
        timestamp created_at
    }

    CANDIDATES {
        int id PK
        string candidate_code UK
        int user_id FK
        string first_name
        string last_name
        string email UK
        string phone
        decimal experience_years
        enum education_level "BCA, MCA, BTECH, MTECH, PHD"
        decimal current_salary
        decimal expected_salary
        string location
        enum status "AVAILABLE, IN_PROCESS, HIRED"
    }

    JOBS {
        int id PK
        string job_code UK
        int created_by_user_id FK
        string title
        string department
        string job_role
        decimal min_experience
        decimal max_experience
        decimal min_salary
        decimal max_salary
        string location
        enum company_size "STARTUP, MID_SIZE, ENTERPRISE"
        enum status "OPEN, CLOSED"
    }

    SKILLS {
        int id PK
        string skill_name UK
        enum category "LANG, FRAMEWORK, DB, CLOUD, ML"
    }

    CANDIDATE_SKILLS {
        int candidate_id PK,FK
        int skill_id PK,FK
        enum proficiency "BEGINNER, INTERMEDIATE, ADVANCED, EXPERT"
        decimal years_experience
    }

    APPLICATIONS {
        int id PK
        string application_code UK
        int candidate_id FK
        int job_id FK
        decimal match_score
        enum status "APPLIED, SHORTLISTED, INTERVIEWED, SELECTED, REJECTED"
        text notes
    }

    PREDICTIONS {
        int id PK
        int candidate_id FK
        decimal experience_years
        string education_level
        string job_role
        decimal lr_predicted_salary
        decimal rf_predicted_salary
        decimal confidence_score
    }

    INTERVIEWS {
        int id PK
        int application_id FK
        int round_number
        string round_type
        datetime scheduled_at
        string interviewer_name
        enum status "SCHEDULED, COMPLETED"
        int rating
    }

    AUDIT_LOGS {
        int id PK
        string entity_name
        int entity_id
        string action_type
        json old_value
        json new_value
        timestamp performed_at
    }
```

---

## 3. Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)

```mermaid
flowchart LR
    HR["HR Recruiter / Admin"] -->|1. Job Requisition & Resume Upload| System(("Smart Recruitment, Salary Prediction & Analytics System"))
    Candidate["Job Applicant"] -->|2. Candidate Profile & Application| System
    System -->|3. Match Scores, Salary Inferences & Visual Analytics| HR
    System -->|4. Application Status Updates| Candidate
```

### DFD Level 1 (Sub-system Breakdown)

```mermaid
flowchart TD
    User["HR Manager / Admin"] -->|Credentials| P1["1.0 Authentication & RBAC"]
    P1 -->|JWT Session| P2["2.0 Candidate & Job Management"]
    
    User -->|Resume PDF / Text| P3["3.0 Resume Screening & NLP Extraction"]
    P3 -->|Parsed Skills & Exp| D1[("MongoDB Document Store")]
    
    P3 -->|Candidate Features| P4["4.0 Smart Candidate-Job Matching"]
    P2 -->|Job Requirements| P4
    P4 -->|Match Score & Rationale| User
    
    User -->|Experience, Degree, Role| P5["5.0 Salary Prediction Regressors"]
    P5 -->|LR & RF Predictions| D2[("MySQL 8.4 Relational Core")]
    P5 -->|Compensation Estimates| User
    
    D2 -->|Historical Salary Data| P6["6.0 Statistical & Probability Engine"]
    P6 -->|Mean, StdDev, Pearson r, P(Hire)| User
```

### DFD Level 2 (Resume Screening & Prediction Engine Detailed Flow)

```mermaid
flowchart TD
    ResumeFile["Resume PDF Upload"] --> ReadText["3.1 pypdf Page Extraction"]
    ReadText --> Tokenize["3.2 Tokenization & Text Normalization"]
    Tokenize --> RegexNER["3.3 Entity & Skill Taxonomy Matcher"]
    RegexNER --> StoreProfile["3.4 Upsert candidate_profiles Document"]
    
    StoreProfile --> ExtractVectors["4.1 Extract Skill Sets & Experience Delta"]
    ExtractVectors --> Jaccard["4.2 Compute Jaccard Overlap Ratio"]
    ExtractVectors --> ExpFit["4.3 Evaluate Experience Bound Deficit/Excess"]
    Jaccard --> CombineScore["4.4 Calculate Weighted Composite Fit Score (70/30)"]
    ExpFit --> CombineScore
    CombineScore --> Rationale["4.5 Generate HR Rationale Text"]
    
    Features["User Selected Salary Features"] --> Encode["5.1 ColumnTransformer One-Hot & Scaling"]
    Encode --> LRInfer["5.2 Linear Regression Dot Product: W^T · X"]
    Encode --> RFInfer["5.3 Random Forest 100 Tree Ensemble Averaging"]
    LRInfer --> LogHistory["5.4 Insert into predictions Table (MySQL Trigger Fires)"]
    RFInfer --> LogHistory
    LogHistory --> ReturnOutput["5.5 Return LPA/INR Estimates & Model Divergence"]
```

---

## 4. UML Class Diagram (Subject 2: Core Java OOP Architecture)

```mermaid
classDiagram
    class Person {
        <<Abstract>>
        -int id
        -String firstName
        -String lastName
        -String email
        -String phone
        +getFullName() String
        +getRoleTitle()* String
        +getDisplaySummary()* String
    }

    class Candidate {
        -String candidateCode
        -double experienceYears
        -String educationLevel
        -double currentSalary
        -double expectedSalary
        -String location
        -String status
        -List~String~ skills
        +getRoleTitle() String
        +getDisplaySummary() String
        +calculateHikePercentage() double
        +addSkill(String) void
    }

    class Job {
        -int id
        -String jobCode
        -String title
        -String department
        -String jobRole
        -double minExperience
        -double maxExperience
        -double minSalary
        -double maxSalary
        -String location
        -String companySize
        -String status
        +getSalaryRangeFormatted() String
    }

    class Application {
        -int id
        -String applicationCode
        -int candidateId
        -int jobId
        -double matchScore
        -String status
        -String notes
    }

    class RecordOperations~T~ {
        <<Interface>>
        +findById(int id) T
        +findAll() List~T~
        +create(T entity) boolean
        +update(T entity) boolean
        +delete(int id) boolean
    }

    class CandidateDAO {
        +findById(int) Candidate
        +findAll() List~Candidate~
        +create(Candidate) boolean
        +update(Candidate) boolean
        +delete(int) boolean
        -mapRowToCandidate(ResultSet) Candidate
    }

    class JobDAO {
        +findById(int) Job
        +findAll() List~Job~
        +getJobsAsIndexedMap() Map~Integer, Job~
        +create(Job) boolean
    }

    class DBConnection {
        -String DRIVER_CLASS$
        +getConnection()$ Connection
    }

    class RecruitmentException {
        -String errorCode
        +getErrorCode() String
    }

    class CandidateNotFoundException {
        -String identifier
        +getIdentifier() String
    }

    class InvalidSalaryException {
        -double invalidAmount
        +getInvalidAmount() double
    }

    Person <|-- Candidate : Inheritance
    RecordOperations <|.. CandidateDAO : Implements Contract
    RecordOperations <|.. JobDAO : Implements Contract
    CandidateDAO ..> DBConnection : Uses JDBC
    CandidateDAO ..> CandidateNotFoundException : Throws
    CandidateDAO ..> Candidate : Produces
    JobDAO ..> Job : Produces
    RecruitmentException <|-- CandidateNotFoundException : Extends
    RuntimeException <|-- InvalidSalaryException : Extends
```

---

## 5. Sequence Diagram: Prediction & Smart Matching Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor HR as HR Recruiter
    participant UI as React 18 SaaS Dashboard
    participant API as Node.js Gateway (:5000)
    participant Flask as Python Flask ML (:5001)
    participant Java as Java Record Engine
    participant MySQL as MySQL 8.4 Relational DB
    participant Mongo as MongoDB Document Store

    HR->>UI: Inputs Experience, Degree, Role & Location
    UI->>API: POST /api/ml/predict-salary (JWT Bearer)
    API->>Flask: POST /predict-salary (Feature Payload)
    
    Flask->>Flask: ColumnTransformer Preprocessing
    Flask->>Flask: LR Inference (OLS Model)
    Flask->>Flask: RF Inference (100 Trees Average)
    Flask-->>API: Return Dual Predictions (INR, LPA, Variance)
    
    API->>MySQL: INSERT INTO predictions (lr_pred, rf_pred)
    MySQL->>MySQL: Trigger trg_after_prediction_insert fires
    API-->>UI: 200 OK (Predictions, Comparison, Disclaimers)
    UI-->>HR: Displays Side-by-Side Model Comparison Card

    HR->>UI: Uploads Resume PDF for Candidate
    UI->>API: POST /api/ml/parse-resume (Multipart PDF)
    API->>Flask: POST /parse-resume (PDF Stream)
    Flask->>Flask: pypdf Text Extraction & NLP Skill Regex
    Flask-->>API: Return Extracted Skills, Education, Experience
    API->>Mongo: Upsert into candidate_profiles collection
    API-->>UI: Extracted Entities JSON
    UI-->>HR: Displays Skills Badges & Verification Desk
```
