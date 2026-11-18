package servlet;

import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================================
 * MODULE V: SERVLET LIFECYCLE SIMULATOR
 * Demonstrates:
 * 1. Web Application Container Workflow
 * 2. Servlet Life Cycle: init() -> service() -> doGet()/doPost() -> destroy()
 * 3. Handling Request and Response streaming
 * ============================================================================
 */
public class ServletLifecycleSimulator {

    public static void runServletLifecycleDemo() {
        System.out.println("\n================================================================================");
        System.out.println("🌐 MODULE V: JAVA SERVER TECHNOLOGIES - SERVLET LIFECYCLE DEMO");
        System.out.println("================================================================================");

        CandidateServlet servlet = new CandidateServlet();

        // 1. Container invokes init()
        System.out.println("\n[PHASE 1] SERVLET INITIALIZATION (init() method):");
        System.out.println("------------------------------------------------------------------");
        Map<String, String> initParams = new HashMap<>();
        initParams.put("servlet-name", "CandidateAPIServlet");
        initParams.put("organization", "TALENTIQ National Recruitment Engine");
        servlet.init(initParams);

        // 2. Client sends HTTP GET Request
        System.out.println("\n[PHASE 2] CLIENT HTTP GET REQUEST (doGet() method):");
        System.out.println("------------------------------------------------------------------");
        Map<String, String> getParams = new HashMap<>();
        getParams.put("search", "Aishwarya");

        CandidateServlet.SimulatedHttpRequest getReq = new CandidateServlet.SimulatedHttpRequest(
                "GET", "/api/candidates?search=Aishwarya", getParams);
        CandidateServlet.SimulatedHttpResponse getRes = new CandidateServlet.SimulatedHttpResponse();

        try {
            servlet.service(getReq, getRes);
            System.out.println("Response Status:       HTTP " + getRes.getStatus());
            System.out.println("Content-Type:          " + getRes.getContentType());
            System.out.println("Response Payload:\n" + getRes.getResponseBody());
        } catch (Exception e) {
            System.err.println("GET processing error: " + e.getMessage());
        }

        // 3. Client sends HTTP POST Request
        System.out.println("\n[PHASE 3] CLIENT HTTP POST REQUEST (doPost() method):");
        System.out.println("------------------------------------------------------------------");
        Map<String, String> postParams = new HashMap<>();
        postParams.put("fullName", "Ananya Deshmukh");
        postParams.put("experience", "4.0");
        postParams.put("currentSalary", "900000");
        postParams.put("expectedSalary", "1350000");

        CandidateServlet.SimulatedHttpRequest postReq = new CandidateServlet.SimulatedHttpRequest(
                "POST", "/api/candidates", postParams);
        CandidateServlet.SimulatedHttpResponse postRes = new CandidateServlet.SimulatedHttpResponse();

        try {
            servlet.service(postReq, postRes);
            System.out.println("Response Status:       HTTP " + postRes.getStatus() + " CREATED");
            System.out.println("Response Payload:\n" + postRes.getResponseBody());
        } catch (Exception e) {
            System.err.println("POST processing error: " + e.getMessage());
        }

        // 4. Container invokes destroy()
        System.out.println("\n[PHASE 4] SERVLET DESTRUCTION (destroy() method):");
        System.out.println("------------------------------------------------------------------");
        servlet.destroy();
        System.out.println("================================================================================");
    }
}
