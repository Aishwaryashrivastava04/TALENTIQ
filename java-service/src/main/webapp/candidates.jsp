<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- ========================================================================= -->
<!-- MODULE V: JAVA SERVER PAGES (JSP) & JSTL VIEW                             -->
<!-- Demonstrates JSP Directives, Expressions <%= ... %>, and JSTL Tags        -->
<!-- ========================================================================= -->
<!DOCTYPE html>
<html>
<head>
    <title>TALENTIQ - Candidate Directory (JSP View)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background-color: #f8fafc; }
        .header { background-color: #0f4c81; color: white; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
        th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
        th { background-color: #e2e8f0; color: #1e293b; }
        tr:nth-child(even) { background-color: #f1f5f9; }
        .badge { background-color: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>

    <div class="header">
        <h2>TALENTIQ Smart Recruitment - Live Candidate Pipeline</h2>
        <p>JSP Server Generated at: <%= new java.util.Date() %></p>
        <p>Server Software: <%= application.getServerInfo() %></p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Candidate ID</th>
                <th>Candidate Code</th>
                <th>Full Name</th>
                <th>Experience</th>
                <th>Current Salary</th>
                <th>Expected Salary</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <!-- JSTL Iteration Tag Demonstration -->
            <c:choose>
                <c:when test="${not empty candidateList}">
                    <c:forEach var="candidate" items="${candidateList}">
                        <tr>
                            <td><c:out value="${candidate.id}" /></td>
                            <td><strong><c:out value="${candidate.candidateCode}" /></strong></td>
                            <td><c:out value="${candidate.fullName}" /></td>
                            <td><c:out value="${candidate.experienceYears}" /> yrs</td>
                            <td>₹<c:out value="${candidate.currentSalary}" /></td>
                            <td>₹<c:out value="${candidate.expectedSalary}" /></td>
                            <td><span class="badge"><c:out value="${candidate.status}" /></span></td>
                        </tr>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <!-- JSP Scriptlet Demo fallback -->
                    <%
                        String[][] demoCandidates = {
                            {"1", "CAN-101", "Aishwarya Shree", "5.5 yrs", "₹1,200,000", "₹1,800,000", "OFFERED"},
                            {"2", "CAN-102", "Rahul Verma", "3.0 yrs", "₹650,000", "₹950,000", "SCREENED"},
                            {"3", "CAN-103", "Priya Menon", "7.0 yrs", "₹1,600,000", "₹2,200,000", "INTERVIEWED"}
                        };
                        for (String[] row : demoCandidates) {
                    %>
                        <tr>
                            <td><%= row[0] %></td>
                            <td><strong><%= row[1] %></strong></td>
                            <td><%= row[2] %></td>
                            <td><%= row[3] %></td>
                            <td><%= row[4] %></td>
                            <td><%= row[5] %></td>
                            <td><span class="badge"><%= row[6] %></span></td>
                        </tr>
                    <%
                        }
                    %>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>

</body>
</html>
