# REST API Documentation & Network Contracts

## Gateway Base URL: `http://localhost:5000/api`
## Flask ML Microservice: `http://localhost:5001`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 POST `/api/auth/register`
Registers a new system user with password bcrypt hashing and duplicate email rejection.
- **Request Body**:
  ```json
  {
    "full_name": "Divya Nair",
    "email": "divya.nair@company.com",
    "phone": "+91 9876501234",
    "password": "SecurePassword@123",
    "role": "HR_MANAGER"
  }
  ```
- **Response (201 Created)**: Returns user object and active JWT access token.

### 1.2 POST `/api/auth/login`
Authenticates a user and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "admin@recruitment.com",
    "password": "Admin@123",
    "remember_me": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@recruitment.com",
      "full_name": "Arun Sharma (Lead Admin)",
      "role": "ADMIN"
    }
  }
  ```

### 1.3 POST `/api/auth/forgot-password`
Generates a 32-byte cryptographically secure random token, stores its SHA-256 hash in MySQL, sets a 15-minute expiration, and dispatches reset instructions via Nodemailer.
- **Request Body**: `{"email": "user@university.edu"}`
- **Response (200 OK)**: Anti-enumeration generic success response.

### 1.4 POST `/api/auth/reset-password`
Verifies token hash and expiration, updates bcrypt password in MySQL, and invalidates the token.
- **Request Body**: `{"token": "<hex_token>", "new_password": "NewSecurePassword@2026"}`
- **Response (200 OK)**: Confirmation message.

### 1.5 POST `/api/auth/change-password`
Allows authenticated users to change their password by validating their current password.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{"current_password": "OldPassword@123", "new_password": "NewPassword@123"}`
- **Response (200 OK)**: Confirmation message.

### 1.6 GET `/api/auth/me`
Verifies JWT token and returns active session details.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns authenticated user object.

### 1.7 POST `/api/auth/logout`
Terminates session and clears HttpOnly authorization cookies.

---

## 2. Candidate Endpoints (`/api/candidates`)

### 2.1 GET `/api/candidates`
Retrieves candidate list with optional query parameters.
- **Query Parameters**:
  - `search` (string): Keyword matching name, email, or candidate code
  - `education` (string): e.g., `BTECH`, `MCA`, `BCA`, `MTECH`, `PHD`
  - `status` (string): `AVAILABLE`, `IN_PROCESS`, `HIRED`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 15,
    "data": [
      {
        "id": 1,
        "candidate_code": "CAN-1001",
        "full_name": "Rahul Verma",
        "email": "rahul.verma@gmail.com",
        "experience_years": 3.5,
        "education_level": "MCA",
        "current_salary": 720000.00,
        "expected_salary": 1000000.00,
        "location": "Bengaluru",
        "status": "AVAILABLE",
        "skills_list": "Python, React.js, Node.js, Express.js, MySQL, MongoDB"
      }
    ]
  }
  ```

### 2.2 POST `/api/candidates`
Creates candidate in relational MySQL and creates profile in MongoDB.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "first_name": "Siddharth",
    "last_name": "Verma",
    "email": "siddharth.v@example.com",
    "phone": "+91 9988776655",
    "experience_years": 4.0,
    "education_level": "MCA",
    "current_salary": 850000,
    "expected_salary": 1250000,
    "location": "Bengaluru",
    "skills": ["Python", "React.js", "MySQL", "AWS"]
  }
  ```

---

## 3. Machine Learning Endpoints (`/api/ml`)

### 3.1 POST `/api/ml/predict-salary`
Computes salary prediction using both Linear Regression and Random Forest Regressor models.
- **Request Body**:
  ```json
  {
    "experience_years": 4.5,
    "education_level": "MCA",
    "job_role": "Full Stack Developer",
    "technical_skills_count": 6,
    "location": "Bengaluru",
    "company_size": "ENTERPRISE"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "input_features": {
      "experience_years": 4.5,
      "education_level": "MCA",
      "job_role": "Full Stack Developer",
      "technical_skills_count": 6,
      "location": "Bengaluru",
      "company_size": "ENTERPRISE"
    },
    "predictions": {
      "linear_regression": {
        "salary_inr": 1820000.0,
        "salary_lpa": 18.2,
        "model_type": "Ordinary Least Squares Linear Regression"
      },
      "random_forest": {
        "salary_inr": 1940000.0,
        "salary_lpa": 19.4,
        "model_type": "Random Forest Regressor (100 Trees Ensemble)"
      },
      "recommended_estimate": {
        "salary_inr": 1892000.0,
        "salary_lpa": 18.92,
        "currency": "INR"
      }
    },
    "variance_analysis": {
      "absolute_difference_inr": 120000.0,
      "percentage_divergence": 6.38
    },
    "disclaimer": "Salary predictions are statistical estimates based on market training data."
  }
  ```

### 3.2 GET `/api/ml/metrics`
Returns comparative evaluation metrics on 300 test holdout samples.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "metrics": {
      "training_samples": 1200,
      "test_samples": 300,
      "linear_regression": {
        "mae": 176728.60,
        "mse": 56753158123.02,
        "rmse": 238229.21,
        "r2_score": 0.9458,
        "r2_percentage": 94.58
      },
      "random_forest": {
        "mae": 191568.69,
        "mse": 76351811318.09,
        "rmse": 276318.32,
        "r2_score": 0.9271,
        "r2_percentage": 92.71
      }
    }
  }
  ```

### 3.3 POST `/api/ml/parse-resume`
Extracts structured contact info, education, and technical skills from PDF or raw text.
- **Request (Multipart/Form-Data)**: `resume: [file.pdf]` OR **JSON**: `{ "text": "Resume text..." }`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "extracted_email": "rahul.verma@example.com",
      "extracted_phone": "+91 9876543210",
      "education_level": "MCA",
      "experience_years": 3.5,
      "skills": ["AWS", "Docker", "Express.js", "Machine Learning", "MongoDB", "MySQL", "Node.js", "Python", "React.js"],
      "skills_count": 9
    }
  }
  ```

### 3.4 POST `/api/ml/match-candidate`
Calculates explainable candidate-job fit score.
- **Request Body**:
  ```json
  {
    "candidate_skills": ["Python", "React.js", "MySQL", "Docker"],
    "candidate_experience": 4.0,
    "job_required_skills": ["Python", "React.js", "Node.js", "MySQL", "AWS"],
    "job_min_experience": 3.0,
    "job_max_experience": 6.0
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "final_match_score": 88.0,
      "match_level": "Excellent",
      "skill_match_score": 80.0,
      "experience_score": 100.0,
      "experience_status": "OPTIMAL_FIT",
      "matched_skills": ["Python", "React.js", "MySQL"],
      "missing_skills": ["Node.js", "AWS"],
      "explainable_summary": "Excellent Match (88.0%): Candidate demonstrated proficiency in key required skills: Python, React.js, MySQL. Missing key job requirements: Node.js, AWS. Experience level (4.0 yrs) is inside target job bounds (3.0-6.0 yrs).",
      "hr_recommendation": "Proceed to Technical Interview"
    }
  }
  ```

---

## 4. Statistics & Probability Endpoints (`/api/analytics`)

### 4.1 GET `/api/analytics/statistics-summary`
Returns descriptive statistics: Mean, Median, Mode, Variance, Std Dev, Min/Max, and Quartiles ($Q_1, Q_2, Q_3, IQR$).

### 4.2 GET `/api/analytics/correlation`
Returns Pearson Correlation ($r = 0.8318$), p-value, Spearman Rank Correlation ($\rho = 0.8647$), and scatter points for React Recharts.

### 4.3 GET `/api/analytics/distribution?bins=10`
Returns histogram frequency intervals with Gaussian Normal Probability Density Function values.

### 4.4 POST `/api/analytics/probability`
Computes empirical selection likelihood $P(\text{Hire})$ using historical logistic distribution modeling.
