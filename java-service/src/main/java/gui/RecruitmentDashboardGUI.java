package gui;

import model.Candidate;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * MODULE IV: GUI PROGRAMMING (AWT & SWING COMPONENTS & EVENT HANDLING)
 * Demonstrates:
 * 1. Components & Containers: JFrame, JPanel, JLabel, JButton, JTextField, JTable, JScrollPane
 * 2. Layout Managers: BorderLayout (Main), GridLayout (Form inputs), FlowLayout (Button toolbar)
 * 3. Menu Bar to Window: JMenuBar, JMenu, JMenuItem with keyboard accelerators
 * 4. Event-Driven Programming: Delegation Event Model
 * 5. Event Classes & Sources: ActionEvent (Buttons/Menus), MouseEvent (Table row clicks), WindowEvent
 * 6. Event Listeners: ActionListener, MouseListener
 * 7. Adapter Classes: MouseAdapter, WindowAdapter (Helper classes)
 * ============================================================================
 */
public class RecruitmentDashboardGUI extends JFrame implements ActionListener {

    // GUI Components
    private JTable candidateTable;
    private DefaultTableModel tableModel;
    private JTextField txtName, txtExp, txtCurrentSal, txtExpectedSal, txtLocation;
    private JLabel lblStatus, lblCalculatedHike;
    private JButton btnAdd, btnCalculateHike, btnClear, btnRefresh;
    private JComboBox<String> comboEdu;

    // Menu Components
    private JMenuBar menuBar;
    private JMenu menuFile, menuTools, menuHelp;
    private JMenuItem itemRefresh, itemExit, itemHikeCalc, itemAbout;

    // In-Memory Data Store (Works seamlessly offline or with JDBC)
    private final List<Candidate> candidateList;

    public RecruitmentDashboardGUI() {
        super("TALENTIQ Enterprise Recruitment Management Console (Java Swing GUI)");
        this.candidateList = new ArrayList<>();
        initializeSampleData();
        setupUI();
    }

    private void initializeSampleData() {
        candidateList.add(new Candidate(1, "CAN-101", "Aishwarya", "Shree", "aishwarya@talentiq.com", "+91 9876543210", 5.5, "MCA", 1200000.0, 1800000.0, "Bengaluru", "OFFERED"));
        candidateList.add(new Candidate(2, "CAN-102", "Rahul", "Verma", "rahul.v@example.com", "+91 9812345678", 3.0, "BTECH", 650000.0, 950000.0, "Noida", "SCREENED"));
        candidateList.add(new Candidate(3, "CAN-103", "Priya", "Menon", "priya.m@talentiq.com", "+91 9944332211", 7.0, "MCA", 1600000.0, 2200000.0, "Mumbai", "INTERVIEWED"));
        candidateList.add(new Candidate(4, "CAN-104", "Vikram", "Malhotra", "vikram.m@example.com", "+91 9766554433", 4.2, "BCA", 800000.0, 1150000.0, "Hyderabad", "AVAILABLE"));
    }

    private void setupUI() {
        // Main Container Configuration
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(1000, 680);
        setLocationRelativeTo(null); // Center on screen
        setLayout(new BorderLayout(10, 10)); // Layout Manager 1: BorderLayout

        // 1. Menu Bar Construction
        setupMenuBar();
        setJMenuBar(menuBar);

        // 2. North Panel: Header Banner (FlowLayout)
        JPanel northPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        northPanel.setBackground(new Color(15, 76, 129)); // Institutional Classic Aquatic Blue
        JLabel lblHeader = new JLabel("TALENTIQ Enterprise Candidate Management Console");
        lblHeader.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lblHeader.setForeground(Color.WHITE);
        northPanel.add(lblHeader);
        add(northPanel, BorderLayout.NORTH);

        // 3. Center Panel: JTable inside JScrollPane
        setupTable();
        JPanel centerPanel = new JPanel(new BorderLayout(5, 5));
        centerPanel.setBorder(BorderFactory.createTitledBorder("Live Candidate Pipeline (Double-click row to view details)"));
        centerPanel.add(new JScrollPane(candidateTable), BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);

        // 4. South Panel: Form Inputs & Controls (GridLayout & FlowLayout)
        JPanel southContainer = new JPanel(new BorderLayout(5, 5));
        southContainer.setBorder(BorderFactory.createEmptyBorder(5, 10, 10, 10));

        // Form Grid: Layout Manager 2: GridLayout(3, 4, 10, 8)
        JPanel formGrid = new JPanel(new GridLayout(3, 4, 10, 8));
        formGrid.setBorder(BorderFactory.createTitledBorder("Candidate Registration & Salary Hike Calculator"));

        txtName = new JTextField();
        txtExp = new JTextField();
        txtCurrentSal = new JTextField();
        txtExpectedSal = new JTextField();
        txtLocation = new JTextField("Bengaluru");
        comboEdu = new JComboBox<>(new String[]{"MCA", "BTECH", "BCA", "MTECH", "BSC CS"});
        lblCalculatedHike = new JLabel("Calculated Hike: --%");
        lblCalculatedHike.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblCalculatedHike.setForeground(new Color(16, 124, 65));

        formGrid.add(new JLabel("Full Name:"));
        formGrid.add(txtName);
        formGrid.add(new JLabel("Experience (Yrs):"));
        formGrid.add(txtExp);

        formGrid.add(new JLabel("Current Salary (₹):"));
        formGrid.add(txtCurrentSal);
        formGrid.add(new JLabel("Expected Salary (₹):"));
        formGrid.add(txtExpectedSal);

        formGrid.add(new JLabel("Education & Location:"));
        JPanel subComboPanel = new JPanel(new GridLayout(1, 2, 5, 0));
        subComboPanel.add(comboEdu);
        subComboPanel.add(txtLocation);
        formGrid.add(subComboPanel);
        formGrid.add(new JLabel("Compensation Analysis:"));
        formGrid.add(lblCalculatedHike);

        southContainer.add(formGrid, BorderLayout.CENTER);

        // Action Buttons: Layout Manager 3: FlowLayout
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 6));
        btnAdd = new JButton("Add Candidate");
        btnCalculateHike = new JButton("Calculate Hike %");
        btnClear = new JButton("Clear Form");
        btnRefresh = new JButton("Refresh Table");

        btnAdd.setBackground(new Color(15, 76, 129));
        btnCalculateHike.setBackground(new Color(40, 167, 69));

        // Register ActionListeners (Delegation Event Model)
        btnAdd.addActionListener(this);
        btnCalculateHike.addActionListener(this);
        btnClear.addActionListener(this);
        btnRefresh.addActionListener(this);

        buttonPanel.add(btnCalculateHike);
        buttonPanel.add(btnAdd);
        buttonPanel.add(btnClear);
        buttonPanel.add(btnRefresh);

        // Status Bar
        lblStatus = new JLabel(" Ready | Total Candidates Loaded: " + candidateList.size() + " | Amity CSIT751 Swing GUI Ready");
        lblStatus.setBorder(BorderFactory.createEtchedBorder());

        JPanel southWrapper = new JPanel(new BorderLayout());
        southWrapper.add(southContainer, BorderLayout.CENTER);
        southWrapper.add(buttonPanel, BorderLayout.SOUTH);

        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.add(southWrapper, BorderLayout.CENTER);
        bottomPanel.add(lblStatus, BorderLayout.SOUTH);

        add(bottomPanel, BorderLayout.SOUTH);

        // Adapter Class 1: WindowAdapter for Window Events
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                System.out.println("GUI Window closed by user (WindowAdapter event caught).");
            }
        });
    }

    private void setupMenuBar() {
        menuBar = new JMenuBar();

        // File Menu
        menuFile = new JMenu("File");
        itemRefresh = new JMenuItem("Reload Database Records");
        itemExit = new JMenuItem("Exit Application");
        itemRefresh.addActionListener(this);
        itemExit.addActionListener(this);
        menuFile.add(itemRefresh);
        menuFile.addSeparator();
        menuFile.add(itemExit);

        // Tools Menu
        menuTools = new JMenu("Recruitment Tools");
        itemHikeCalc = new JMenuItem("Run Compensation Hike Audit");
        itemHikeCalc.addActionListener(this);
        menuTools.add(itemHikeCalc);

        // Help Menu
        menuHelp = new JMenu("Help");
        itemAbout = new JMenuItem("About TALENTIQ & Amity CSIT751");
        itemAbout.addActionListener(this);
        menuHelp.add(itemAbout);

        menuBar.add(menuFile);
        menuBar.add(menuTools);
        menuBar.add(menuHelp);
    }

    private void setupTable() {
        String[] columns = {"ID", "Code", "Full Name", "Education", "Experience (Yrs)", "Current (₹)", "Expected (₹)", "Hike %", "Location", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // Read-only cells
            }
        };

        candidateTable = new JTable(tableModel);
        candidateTable.setRowHeight(26);
        candidateTable.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        candidateTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 12));
        candidateTable.getTableHeader().setBackground(new Color(235, 240, 248));

        // Populate Table with Initial Data
        refreshTableData();

        // Adapter Class 2: MouseAdapter on Table (Delegation Model: Event Source -> Listener)
        candidateTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) { // Double click event
                    int selectedRow = candidateTable.getSelectedRow();
                    if (selectedRow != -1) {
                        String name = (String) tableModel.getValueAt(selectedRow, 2);
                        String exp = String.valueOf(tableModel.getValueAt(selectedRow, 4));
                        String hike = String.valueOf(tableModel.getValueAt(selectedRow, 7));
                        String loc = (String) tableModel.getValueAt(selectedRow, 8);

                        // Swing Dialog Component
                        JOptionPane.showMessageDialog(
                                RecruitmentDashboardGUI.this,
                                String.format("Candidate Dossier:\n\nName: %s\nExperience: %s years\nExpected Hike: %s\nLocation: %s\nATS Score: 88.5/100 (Fit for Role)",
                                        name, exp, hike, loc),
                                "Candidate Quick View",
                                JOptionPane.INFORMATION_MESSAGE
                        );
                    }
                }
            }
        });
    }

    private void refreshTableData() {
        tableModel.setRowCount(0);
        for (Candidate c : candidateList) {
            tableModel.addRow(new Object[]{
                    c.getId(),
                    c.getCandidateCode(),
                    c.getFullName(),
                    c.getEducationLevel(),
                    c.getExperienceYears(),
                    String.format("₹%,.0f", c.getCurrentSalary()),
                    String.format("₹%,.0f", c.getExpectedSalary()),
                    String.format("%.1f%%", c.calculateHikePercentage()),
                    c.getLocation(),
                    c.getStatus()
            });
        }
    }

    /**
     * Event Handling Mechanism: ActionListener Implementation
     * Dispatches events from buttons and menus based on Event Source.
     */
    @Override
    public void actionPerformed(ActionEvent e) {
        Object source = e.getSource();

        if (source == btnCalculateHike || source == itemHikeCalc) {
            handleCalculateHike();
        } else if (source == btnAdd) {
            handleAddCandidate();
        } else if (source == btnClear) {
            handleClearForm();
        } else if (source == btnRefresh || source == itemRefresh) {
            refreshTableData();
            lblStatus.setText(" Table Refreshed | Total Records: " + candidateList.size());
        } else if (source == itemExit) {
            dispose();
        } else if (source == itemAbout) {
            JOptionPane.showMessageDialog(
                    this,
                    "TALENTIQ - Smart Recruitment, Salary Prediction & Analytics System\n" +
                    "Module IV: AWT & Swing GUI with Delegation Event Model\n" +
                    "Aligned with Amity University CSIT751 (Core Java) & Viksit Bharat@2047.\n\n" +
                    "Primary Administrator: Aishwarya Shree",
                    "About Academic Project",
                    JOptionPane.INFORMATION_MESSAGE
            );
        }
    }

    private void handleCalculateHike() {
        try {
            double current = Double.parseDouble(txtCurrentSal.getText().trim());
            double expected = Double.parseDouble(txtExpectedSal.getText().trim());

            if (current <= 0 || expected <= 0) {
                JOptionPane.showMessageDialog(this, "Salaries must be positive values!", "Validation Error", JOptionPane.WARNING_MESSAGE);
                return;
            }

            double hike = ((expected - current) / current) * 100.0;
            lblCalculatedHike.setText(String.format("Calculated Hike: %.2f%%", hike));
            lblStatus.setText(" Hike computed successfully: " + String.format("%.2f%%", hike));

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric numbers for salaries!", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleAddCandidate() {
        String name = txtName.getText().trim();
        String expStr = txtExp.getText().trim();
        String curStr = txtCurrentSal.getText().trim();
        String expSalStr = txtExpectedSal.getText().trim();

        if (name.isEmpty() || expStr.isEmpty() || curStr.isEmpty() || expSalStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill in all mandatory fields!", "Validation Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            double exp = Double.parseDouble(expStr);
            double cur = Double.parseDouble(curStr);
            double expSal = Double.parseDouble(expSalStr);
            int newId = candidateList.size() + 1;
            String code = "CAN-" + (100 + newId);

            String[] nameParts = name.split(" ", 2);
            String first = nameParts[0];
            String last = nameParts.length > 1 ? nameParts[1] : "";

            Candidate newCandidate = new Candidate(
                    newId, code, first, last,
                    first.toLowerCase() + "@example.com", "+91 9900011223",
                    exp, (String) comboEdu.getSelectedItem(), cur, expSal,
                    txtLocation.getText().trim(), "AVAILABLE"
            );

            candidateList.add(newCandidate);
            refreshTableData();
            handleClearForm();
            lblStatus.setText(" ✅ Successfully added candidate: " + newCandidate.getFullName() + " [" + code + "]");

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Experience and Salaries must be numeric!", "Format Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleClearForm() {
        txtName.setText("");
        txtExp.setText("");
        txtCurrentSal.setText("");
        txtExpectedSal.setText("");
        txtLocation.setText("Bengaluru");
        lblCalculatedHike.setText("Calculated Hike: --%");
    }

    public static void launch() {
        SwingUtilities.invokeLater(() -> {
            RecruitmentDashboardGUI gui = new RecruitmentDashboardGUI();
            gui.setVisible(true);
        });
    }

    public static void main(String[] args) {
        launch();
    }
}
