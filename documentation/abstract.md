# Project Abstract

## Title: SMART RECRUITMENT, SALARY PREDICTION & ANALYTICS SYSTEM
**Degree**: Master of Computer Applications (MCA) – Generative AI / Data Engineering  
**Academic Integration**: Four-Subject Applied Computing Capstone  

---

### Abstract
In contemporary human resource management, traditional recruitment workflows suffer from cognitive bottlenecks, subjective compensation negotiations, and labor-intensive manual resume screening. This project presents the **Smart Recruitment, Salary Prediction & Analytics System**, a multi-tiered, polyglot software platform that unifies four core disciplines of Master of Computer Applications:

1. **Machine Learning with Python**: Developing and comparing **Linear Regression** (Ordinary Least Squares) with **Random Forest Regressors** (100-tree ensemble) for market-aligned salary prediction, evaluated rigorously using Mean Absolute Error (MAE), Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and the Coefficient of Determination ($R^2$). In addition, natural language processing (NLP) tokenization and entity extraction parse unstructured candidate resumes to extract technical competencies and calculate explainable matching scores against open corporate requisitions.
2. **Core Java**: An independent, enterprise-grade Java 17 module demonstrating fundamental Object-Oriented Programming (OOP) paradigms—including data abstraction via abstract base entities (`Person`), single inheritance and dynamic method dispatch (`Candidate` extending `Person`), rigorous encapsulation, generic interface contracts (`RecordOperations<T>`), Java Collections (`ArrayList`, `HashMap`), custom checked/unchecked exceptions, and direct **Java Database Connectivity (JDBC)** leveraging `PreparedStatement`, `ResultSet`, and ACID transactions.
3. **Statistics and Probability**: Rigorous statistical calculations over 1,500 empirical recruitment samples, deriving measures of central tendency (Mean, Median, Mode), dispersion (Sample Variance $s^2$, Sample Standard Deviation $s$, Interquartile Range $IQR$), bivariate Pearson correlation ($r = 0.8318$, $p < 0.0001$) and Spearman rank correlation ($\rho = 0.8647$) between experience and salary, Gaussian probability density function (PDF) distributions, and inferential logistic candidate selection probability estimates ($P(\text{Hire} \mid \text{Match}, \text{ExpFit})$).
4. **Relational Database Management Systems (RDBMS)**: A fully normalized, Third Normal Form (3NF) relational database implemented on **MySQL 8.4 LTS** spanning 8 relational tables, enforcing Primary Keys, Foreign Keys with cascading rules, Unique constraints, Views, Stored Procedures (`sp_MatchCandidateJob`, `sp_RecordApplication`), Stored Functions (`fn_CalculateExperienceScore`), Event-Condition-Action Triggers for lifecycle audit logging, and dual-persistence integration with **MongoDB** for flexible resume document storage.

The frontend is engineered as an executive SaaS dashboard in **React 18** and **Vite**, with interactive data visualizations rendered via **Recharts**. The architecture guarantees human-in-the-loop ethical recruitment governance, ensuring AI algorithms serve strictly as decision support rather than autonomous rejection gates.
