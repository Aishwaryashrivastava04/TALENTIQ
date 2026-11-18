package servlet;

import model.Candidate;
import java.io.*;
import java.util.*;

/**
 * ============================================================================
 * MODULE V: JAVA SERVER TECHNOLOGIES - SERVLET
 * Demonstrates:
 * 1. Web Application Basics & Request-Response Architecture
 * 2. Servlet Life Cycle: init() -> service() -> doGet()/doPost() -> destroy()
 * 3. Handling HttpServletRequest parameters & HttpServletResponse streaming
 * 4. Deployment Descriptor (web.xml) mapping contract
 * ============================================================================
 */
public class CandidateServlet {

    private String servletName;
    private String organizationName;
    private int requestCounter = 0;
    private final List<Candidate> inMemoryRepo = new ArrayList<>();

    /**
     * 1. Servlet Life Cycle: init() method
     * Called exactly once when servlet is loaded into container memory.
     */
    public void init(Map<String, String> initParams) {
        this.servletName = initParams.getOrDefault("servlet-name", "CandidateServlet");
        this.organizationName = initParams.getOrDefault("organization", "TALENTIQ Enterprise");

        // Seed sample data for HTTP responses
        inMemoryRepo.add(new Candidate(1, "CAN-101", "Aishwarya", "Shree", "aishwarya@talentiq.com", "9876543210", 5.5, "MCA", 1200000.0, 1800000.0, "Bengaluru", "OFFERED"));
        inMemoryRepo.add(new Candidate(2, "CAN-102", "Rahul", "Verma", "rahul.v@example.com", "9812345678", 3.0, "BTECH", 650000.0, 950000.0, "Noida", "SCREENED"));

        System.out.printf("🟢 [Servlet Life Cycle: init()] %s successfully initialized for '%s'.\n",
                servletName, organizationName);
    }

    /**
     * 2. Servlet Life Cycle: service() method
     * Dispatches incoming client requests to doGet() or doPost() based on HTTP verb.
     */
    public void service(SimulatedHttpRequest request, SimulatedHttpResponse response) throws IOException {
        requestCounter++;
        String method = request.getMethod().toUpperCase();

        System.out.printf("📡 [Servlet Life Cycle: service()] Request #%d received -> HTTP %s %s\n",
                requestCounter, method, request.getRequestURI());

        if ("GET".equals(method)) {
            doGet(request, response);
        } else if ("POST".equals(method)) {
            doPost(request, response);
        } else {
            response.setStatus(405);
            response.getWriter().println("HTTP 405 - Method Not Allowed");
        }
    }

    /**
     * 3. Handling HTTP GET Request:
     * Queries candidates with optional query parameter filtering.
     */
    public void doGet(SimulatedHttpRequest req, SimulatedHttpResponse res) throws IOException {
        res.setContentType("application/json; charset=UTF-8");
        res.setStatus(200);

        String search = req.getParameter("search");
        PrintWriter out = res.getWriter();

        out.println("{");
        out.println("  \"status\": \"success\",");
        out.println("  \"organization\": \"" + organizationName + "\",");
        out.println("  \"servlet\": \"" + servletName + "\",");
        out.println("  \"total_records\": " + inMemoryRepo.size() + ",");
        out.println("  \"candidates\": [");

        for (int i = 0; i < inMemoryRepo.size(); i++) {
            Candidate c = inMemoryRepo.get(i);
            if (search != null && !c.getFullName().toLowerCase().contains(search.toLowerCase())) {
                continue;
            }
            out.printf("    {\"id\": %d, \"code\": \"%s\", \"name\": \"%s\", \"exp\": %.1f, \"hike\": \"%.2f%%\"}%s\n",
                    c.getId(), c.getCandidateCode(), c.getFullName(), c.getExperienceYears(),
                    c.calculateHikePercentage(), (i < inMemoryRepo.size() - 1 ? "," : ""));
        }

        out.println("  ]");
        out.println("}");
    }

    /**
     * 4. Handling HTTP POST Request:
     * Reads form body parameters to register a new candidate.
     */
    public void doPost(SimulatedHttpRequest req, SimulatedHttpResponse res) throws IOException {
        String name = req.getParameter("fullName");
        String expStr = req.getParameter("experience");
        String curStr = req.getParameter("currentSalary");
        String expSalStr = req.getParameter("expectedSalary");

        PrintWriter out = res.getWriter();

        if (name == null || expStr == null || curStr == null || expSalStr == null) {
            res.setStatus(400);
            out.println("{\"status\": \"error\", \"message\": \"Missing mandatory parameters in POST body\"}");
            return;
        }

        double exp = Double.parseDouble(expStr);
        double cur = Double.parseDouble(curStr);
        double expSal = Double.parseDouble(expSalStr);

        Candidate newCandidate = new Candidate(
                inMemoryRepo.size() + 1, "CAN-" + (100 + inMemoryRepo.size() + 1),
                name, "", name.toLowerCase().replace(" ", ".") + "@recruitment.com", "9900112233",
                exp, "MCA", cur, expSal, "Remote", "REGISTERED"
        );
        inMemoryRepo.add(newCandidate);

        res.setStatus(201);
        res.setContentType("application/json");
        out.println("{");
        out.println("  \"status\": \"created\",");
        out.println("  \"message\": \"Candidate registered via Java Servlet doPost()\",");
        out.println("  \"candidate_id\": " + newCandidate.getId() + ",");
        out.println("  \"candidate_code\": \"" + newCandidate.getCandidateCode() + "\"");
        out.println("}");
    }

    /**
     * 5. Servlet Life Cycle: destroy() method
     * Called when container is shut down to deallocate database connections or thread pools.
     */
    public void destroy() {
        inMemoryRepo.clear();
        System.out.printf("🔴 [Servlet Life Cycle: destroy()] %s resources released. Servlet destroyed by container.\n", servletName);
    }

    // --- Lightweight Simulation Wrappers (Allows testing without external heavy Tomcat) ---

    public static class SimulatedHttpRequest {
        private final String method;
        private final String requestURI;
        private final Map<String, String> parameters;

        public SimulatedHttpRequest(String method, String requestURI, Map<String, String> parameters) {
            this.method = method;
            this.requestURI = requestURI;
            this.parameters = parameters != null ? parameters : new HashMap<>();
        }

        public String getMethod() { return method; }
        public String getRequestURI() { return requestURI; }
        public String getParameter(String name) { return parameters.get(name); }
    }

    public static class SimulatedHttpResponse {
        private int status = 200;
        private String contentType = "text/plain";
        private final StringWriter stringWriter = new StringWriter();
        private final PrintWriter printWriter = new PrintWriter(stringWriter);

        public void setStatus(int status) { this.status = status; }
        public int getStatus() { return status; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public String getContentType() { return contentType; }
        public PrintWriter getWriter() { return printWriter; }
        public String getResponseBody() { return stringWriter.toString(); }
    }
}
