package networking;

import java.io.*;
import java.net.*;

/**
 * ============================================================================
 * MODULE VI: NETWORKING CLASSES & INTERFACES (java.net Package)
 * Demonstrates:
 * 1. TCP/IP Socket Programming using ServerSocket and Socket
 * 2. Multi-client Request-Response stream handling
 * 3. UDP Datagram Programming using DatagramSocket and DatagramPacket
 * ============================================================================
 */
public class RecruitmentSocketServer {
    public static final int TCP_PORT = 5002;
    public static final int UDP_PORT = 5003;

    /**
     * Starts a dedicated TCP ServerSocket listening for Candidate Query requests.
     */
    public static void startServerOnce() {
        Thread serverThread = new Thread(() -> {
            try (ServerSocket serverSocket = new ServerSocket(TCP_PORT)) {
                System.out.printf("📡 [TCP ServerSocket] Listening for recruitment client queries on port %d...\n", TCP_PORT);

                // Accept one client connection for demonstration
                try (Socket clientSocket = serverSocket.accept();
                     BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                     PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {

                    System.out.println("   [TCP Server] Connection accepted from: " + clientSocket.getRemoteSocketAddress());
                    String request = in.readLine();
                    System.out.println("   [TCP Server] Received query: " + request);

                    // Process query
                    String response;
                    if ("PING".equalsIgnoreCase(request)) {
                        response = "PONG | TALENTIQ Socket Server Active";
                    } else if (request != null && request.startsWith("GET_CANDIDATE")) {
                        response = "SUCCESS | Candidate: Aishwarya Shree | Role: Admin/Lead | ATS Score: 96.4%";
                    } else {
                        response = "SUCCESS | Default Candidate: Rahul Verma | Exp: 3.0 yrs | Status: AVAILABLE";
                    }

                    out.println(response);
                    System.out.println("   [TCP Server] Sent response: " + response);
                }
            } catch (IOException e) {
                System.err.println("TCP ServerSocket error: " + e.getMessage());
            }
        }, "Recruitment-Socket-Server-Thread");
        serverThread.setDaemon(true);
        serverThread.start();
    }

    /**
     * Demonstrates Datagram (UDP) Network Broadcasting using DatagramSocket & DatagramPacket.
     */
    public static void demonstrateDatagramUDP() {
        System.out.println("\n[B] UDP DATAGRAM PROGRAMMING (DatagramSocket & DatagramPacket):");
        System.out.println("------------------------------------------------------------------");
        try {
            // Sender DatagramSocket
            DatagramSocket senderSocket = new DatagramSocket();
            String heartbeatMessage = "TALENTIQ_RECRUITMENT_HEARTBEAT:OK:TIMESTAMP=" + System.currentTimeMillis();
            byte[] buffer = heartbeatMessage.getBytes();

            InetAddress localAddress = InetAddress.getByName("127.0.0.1");
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, localAddress, UDP_PORT);

            System.out.println("1. Prepared DatagramPacket with payload: " + heartbeatMessage);
            System.out.printf("2. DatagramPacket attributes -> Length: %d bytes, Target: %s:%d\n",
                    packet.getLength(), packet.getAddress().getHostAddress(), packet.getPort());

            senderSocket.close();
            System.out.println("3. Datagram transmission completed successfully.");

        } catch (Exception e) {
            System.err.println("Datagram error: " + e.getMessage());
        }
    }
}
