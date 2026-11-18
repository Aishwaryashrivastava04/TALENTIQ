# AMITY UNIVERSITY - CSIT751: CORE JAVA CURRICULUM MAPPING GUIDE
## Project: TALENTIQ – Smart Recruitment, Salary Prediction & Analytics System
**Student / Primary Administrator:** Aishwarya Shree  
**Course Code:** CSIT751 | **Course Title:** Core Java | **Level:** PG (MCA / M.Sc. IT) | **Credits:** 4.00  

---

## Executive Summary: Curriculum Alignment Matrix

This document provides a 1-to-1 mapping between the official **Amity University CSIT751 Core Java** course curriculum and the **TALENTIQ Enterprise SaaS** implementation located in the `java-service` module.

| Syllabus Module | Prescribed Topics (Amity CSIT751) | TALENTIQ Java Implementation | Key Java Classes & File Paths |
| :--- | :--- | :--- | :--- |
| **Module I: Introduction to Java** *(Weightage: 10%)* | History of Java, JDK Tools (`javac`, `java`, `javap`), Class File, Bytecode, JVM Architecture, Identifiers, Data types, Operators, Control Statements, Loops, 1D & 2D Arrays | Bytecode analysis, JVM memory simulation, candidate aptitude 1D array, 3x3 multi-round interview evaluation score matrix | [`basics.Module1IntroDemo`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/basics/Module1IntroDemo.java) |
| **Module II: Java with OOP Features** *(Weightage: 25%)* | OOP Concepts, Classes & Objects, Encapsulation, Abstraction, Polymorphism (Overloading & Overriding), Inheritance (Single & Multi-level), Constructors (`super()`, `this()`), `final`, `static`, Interfaces (Constants, Default/Static methods, Extending Interfaces) | Abstract `Person` base, `Candidate extends Person`, `Recruiter`, 3-level `SeniorHRManager extends Recruiter`, `RecordOperations<T>`, `CandidateOperations` | [`model.Person`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/model/Person.java)<br>[`model.Candidate`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/model/Candidate.java)<br>[`model.Recruiter`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/model/Recruiter.java)<br>[`model.SeniorHRManager`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/model/SeniorHRManager.java)<br>[`util.RecordOperations`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/util/RecordOperations.java)<br>[`util.CandidateOperations`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/util/CandidateOperations.java) |
| **Module III: Exception Handling & Thread in Java** *(Weightage: 20%)* | Exception handling (`try`, `catch`, `finally`, `throw`, `throws`), Multiple catch, User-defined exceptions (Checked & Unchecked), Built-in exceptions. Thread life cycle, Thread creation (`Thread` vs `Runnable`), Priorities, Synchronization (`synchronized`, `wait`, `notify`), stopping/resuming threads | Custom exceptions (`RecruitmentException`, `CandidateNotFoundException`, `InvalidSalaryException`), Thread lifecycle state transitions, `ResumeBatchProcessingThread`, `ApplicantScoringTask`, `SynchronizedVacancyPool` | [`exception.RecruitmentException`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/exception/RecruitmentException.java)<br>[`exception.InvalidSalaryException`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/exception/InvalidSalaryException.java)<br>[`exception.CandidateNotFoundException`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/exception/CandidateNotFoundException.java)<br>[`concurrency.ThreadLifeCycleDemo`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/concurrency/ThreadLifeCycleDemo.java)<br>[`concurrency.SynchronizedVacancyPool`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/concurrency/SynchronizedVacancyPool.java)<br>[`concurrency.ResumeBatchProcessingThread`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/concurrency/ResumeBatchProcessingThread.java)<br>[`concurrency.ApplicantScoringTask`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/concurrency/ApplicantScoringTask.java) |
| **Module IV: Collections & GUI Programming** *(Weightage: 15%)* | `java.util` package, Collections of Objects, Sets (`HashSet`, `TreeSet`), Sequence (`ArrayList`, `Vector`), Map (`HashMap`, `Hashtable`), Hashing breakdown. GUI in Java: Containers (`JFrame`, `JPanel`), Layout Managers (`BorderLayout`, `GridLayout`, `FlowLayout`), AWT & Swing components, Menus (`JMenuBar`, `JMenu`, `JMenuItem`), Delegation Event Model, Event Classes (`ActionEvent`, `MouseEvent`), Listeners (`ActionListener`), Adapters (`MouseAdapter`, `WindowAdapter`) | `CollectionsMasterDemo` comparing ArrayList vs Vector, HashSet vs TreeSet, HashMap vs Hashtable. Standalone Swing desktop console: `RecruitmentDashboardGUI` with JTable, Menus, Dialogs, MouseAdapter double-click, and event listeners | [`collections.CollectionsMasterDemo`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/collections/CollectionsMasterDemo.java)<br>[`gui.RecruitmentDashboardGUI`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/gui/RecruitmentDashboardGUI.java) |
| **Module V: Java Server Technologies Servlet** *(Weightage: 10%)* | Web Application Basics & Architecture, Servlet Life Cycle (`init()`, `service()`, `destroy()`), `HttpServlet` (`doGet()`, `doPost()`), Deployment Descriptor (`web.xml`), Handling Request and Response (`HttpServletRequest`, `HttpServletResponse`), JSP & JSTL | `CandidateServlet` implementing full lifecycle, `ServletLifecycleSimulator` runner, standard deployment descriptor `web.xml`, and `candidates.jsp` with JSTL `<c:forEach>` | [`servlet.CandidateServlet`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/servlet/CandidateServlet.java)<br>[`servlet.ServletLifecycleSimulator`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/servlet/ServletLifecycleSimulator.java)<br>[`WEB-INF/web.xml`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/webapp/WEB-INF/web.xml)<br>[`candidates.jsp`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/webapp/candidates.jsp) |
| **Module VI: Database Programming using JDBC & Networking** *(Weightage: 10%)* | `java.net` package: TCP/IP `ServerSocket` & `Socket`, Datagram (`DatagramSocket`, `DatagramPacket`). JDBC: Architecture, `Connection` interface, `java.sql.*`, `Statement`, `PreparedStatement`, `ResultSet`, `ResultSetMetaData`, Transactions | `RecruitmentSocketServer` (Port 5002) and `RecruitmentSocketClient`. JDBC Connection pool, PreparedStatement CRUD, ACID rollback/commit in `CandidateDAO`, schema metadata inspection in `DBMetaDataExplorer` | [`networking.RecruitmentSocketServer`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/networking/RecruitmentSocketServer.java)<br>[`networking.RecruitmentSocketClient`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/networking/RecruitmentSocketClient.java)<br>[`util.DBMetaDataExplorer`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/util/DBMetaDataExplorer.java)<br>[`util.DBConnection`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/util/DBConnection.java)<br>[`dao.CandidateDAO`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/dao/CandidateDAO.java) |
| **Module VII/VIII: Recent Trends & Viksit Bharat@2047** *(Weightage: 10%)* | Recent trends in Java (Java 17+ LTS, strong encapsulation, records, concurrent utilities). Application of OOP and Java for developing projects under **Viksit Bharat@2047** guidelines (PSDA Point 5) | Unbiased recruitment algorithms, transparent compensation benchmarking, demographic dividend enablement for Indian graduates across Tier-2/Tier-3 colleges | [`viksitbharat.ViksitBharatAlignment`](file:///Users/ash/Desktop/SmartRecruitmentProject/java-service/src/main/java/viksitbharat/ViksitBharatAlignment.java) |

---

## Detailed Module Implementations

### Module I: Introduction to Java
* **JVM Architecture:** Demonstrates how `.java` source is compiled by `javac` into architecture-neutral bytecode (`.class`) executed by JVM's ClassLoader, Execution Engine (JIT), and Memory Areas.
* **1D & 2D Arrays:**
  * 1D Array: `double[] candidateAptitude = {85.5, 92.0, 78.5, 96.0, 88.0}`.
  * 2D Array: `double[][] evaluationMatrix` (3 Candidates evaluated across 3 interview assessment rounds).

### Module II: Object Oriented Features
* **Encapsulation:** Private domain attributes (`currentSalary`, `expectedSalary`) protected by validated getters and setters.
* **Abstraction:** `public abstract class Person` cannot be directly instantiated. Enforces abstract contracts `getRoleTitle()` and `getDisplaySummary()`.
* **Polymorphism:**
  * **Compile-time (Overloading):** `Recruiter.recordHire()` and `Recruiter.recordHire(int additionalHires)`.
  * **Runtime (Overriding):** Polymorphic method call `person.getRoleTitle()` dynamically resolved to `Candidate` or `Recruiter` at runtime.
* **Multi-Level Hierarchy:**
  $$\text{Person (Abstract)} \longrightarrow \text{Recruiter} \longrightarrow \text{SeniorHRManager}$$
* **Interfaces:**
  * `RecordOperations<T>` defines abstract methods, constants (`SYSTEM_CODE`, `MAX_BATCH_CAPACITY`), default methods (`logAudit`), and static utility methods (`getSpecificationVersion`).
  * `CandidateOperations` extends `RecordOperations<Candidate>`.

### Module III: Exception Handling & Multithreading
* **Custom Exceptions:**
  * Checked: `RecruitmentException`, `CandidateNotFoundException`, `DatabaseConnectionException`.
  * Unchecked: `InvalidSalaryException extends RuntimeException`.
* **Multiple Catch Blocks:** Demonstrates catching `NumberFormatException` followed by `ArithmeticException` with a guaranteed `finally` block.
* **Thread Creation:**
  * Extending `Thread`: `ResumeBatchProcessingThread`.
  * Implementing `Runnable`: `ApplicantScoringTask`.
* **Thread Synchronization:**
  * `SynchronizedVacancyPool` uses `synchronized` methods, `wait()`, and `notifyAll()` to eliminate race conditions when multiple recruiter threads compete for shared hiring quotas.

### Module IV: Collections & Swing Desktop GUI
* **Collections Framework:**
  * `ArrayList<Candidate>` (Fast, non-synchronized sequence) vs `Vector<Candidate>` (Synchronized legacy).
  * `HashSet<String>` (De-duplicating technical skills) vs `TreeSet<String>` (Alphabetically sorted).
  * `HashMap<Integer, Candidate>` ($O(1)$ constant-time lookup by ID) vs `Hashtable<String, String>` (Thread-safe, non-null).
  * Hashing Demonstration: Hash code calculation, modulo arithmetic, and bucket indexing.
* **Java Swing Desktop Console (`RecruitmentDashboardGUI`):**
  * `JFrame` root container with `BorderLayout`.
  * Form inputs organized with `GridLayout(3, 4, 10, 8)`.
  * Action buttons organized with `FlowLayout`.
  * `JTable` inside `JScrollPane` showing real-time candidate pipeline.
  * `JMenuBar`, `JMenu` ("File", "Recruitment Tools", "Help"), and `JMenuItem`.
  * **Delegation Event Model:** `JButton` sources dispatch `ActionEvent` to `ActionListener`.
  * **Adapter Classes:** `MouseAdapter` attached to `JTable` (double-click opens `JOptionPane` dossier).

### Module V: Java Server Technologies (Servlets & JSP)
* **Servlet Life Cycle:**
  1. `init(Map<String, String> initParams)`: Loads configuration parameters once into memory.
  2. `service(req, res)`: Inspects HTTP method and delegates to `doGet()` or `doPost()`.
  3. `destroy()`: Unloads resources when container shuts down.
* **Deployment Descriptor (`web.xml`):** Declares `CandidateAPIServlet` and maps it to URL pattern `/api/candidates/*`.
* **JSP View (`candidates.jsp`):** Demonstrates JSP expressions `<%= ... %>` and JSTL `<c:forEach>` iterating over candidate records.

### Module VI: Database Programming using JDBC & Networking
* **Networking (`java.net`):**
  * TCP/IP: `ServerSocket` listening on port 5002; `Socket` client sends `GET_CANDIDATE:101` and receives structured data.
  * UDP: `DatagramSocket` and `DatagramPacket` broadcasts platform heartbeat telemetry.
* **JDBC (`java.sql.*`):**
  * `Connection`, `PreparedStatement`, and `ResultSet`.
  * `ResultSetMetaData`: Inspects table column names, types, sizes, and nullability.
  * ACID Transactions: Atomically executes candidate status update, application approval, and audit trail logging with `conn.setAutoCommit(false)`, `conn.commit()`, and `conn.rollback()`.

### Module VII/VIII: Viksit Bharat@2047 Guidelines
* Fulfills **PSDA Point 5**: *"Develop project using all concepts learnt for solving any one problem for Viksit Bharat@2047 vision."*
* Solves national talent matching challenges by eliminating recruitment bias and empowering educated youth across all Indian states with transparent career analytics.

---

## How to Run & Demonstrate to the Examiner / Teacher

Open the Terminal on macOS and execute:

### 1. Run Complete Automated Academic Verification Suite:
```bash
cd /Users/ash/Desktop/SmartRecruitmentProject
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java -cp "java-service/lib/mysql-connector-j-8.4.0.jar:java-service/bin" Main
```
*Executes all 7 modules sequentially and outputs full academic verification logs.*

### 2. Launch the Java Swing Desktop GUI:
```bash
cd /Users/ash/Desktop/SmartRecruitmentProject
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java -cp "java-service/lib/mysql-connector-j-8.4.0.jar:java-service/bin" Main gui
```
*Opens the interactive Swing desktop application with candidate table, salary hike calculator, menus, and mouse-adapter double-click dossier dialogs.*

### 3. Recompile after any edits:
```bash
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/javac -cp "java-service/lib/mysql-connector-j-8.4.0.jar:java-service/src/main/java" -d java-service/bin $(find java-service/src/main/java -name "*.java")
```
