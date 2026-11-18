package networking;

import java.io.*;
import java.net.Socket;

/**
 * ============================================================================
 * MODULE VI: TCP/IP CLIENT (java.net.Socket)
 * Demonstrates:
 * 1. Establishing TCP Socket connection to ServerSocket
 * 2. Sending commands over OutputStream
 * 3. Reading reply over InputStream
 * ============================================================================
 */
public class RecruitmentSocketClient {

    public static String sendQuery(String query) {
        try (Socket socket = new Socket("127.0.0.1", RecruitmentSocketServer.TCP_PORT);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            out.println(query);
            return in.readLine();

        } catch (IOException e) {
            return "Client socket communication note: " + e.getMessage();
        }
    }

    public static void runNetworkingDemo() {
        System.out.println("\n================================================================================");
        System.out.println("🌐 MODULE VI: NETWORKING (java.net Package - TCP/IP & UDP Datagram)");
        System.out.println("================================================================================");

        // 1. TCP/IP Server-Client Roundtrip
        System.out.println("\n[A] TCP/IP SOCKET COMMUNICATION (ServerSocket & Socket):");
        System.out.println("------------------------------------------------------------------");

        RecruitmentSocketServer.startServerOnce();

        try {
            // Give server thread 150ms to bind to port
            Thread.sleep(150);
        } catch (InterruptedException ignored) {}

        String query = "GET_CANDIDATE:101";
        System.out.println("Client sending query: " + query);
        String reply = sendQuery(query);
        System.out.println("Client received response from server: " + reply);

        // 2. UDP Datagram Programming
        RecruitmentSocketServer.demonstrateDatagramUDP();
        System.out.println("================================================================================");
    }
}
