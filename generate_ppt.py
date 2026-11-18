import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_DARK_BG   = RGBColor(15, 23, 42)      # #0f172a
    C_LIGHT_BG  = RGBColor(248, 250, 252)   # #f8fafc
    C_WHITE     = RGBColor(255, 255, 255)
    C_CARD_BG   = RGBColor(255, 255, 255)
    C_CARD_LINE = RGBColor(226, 232, 240)   # #e2e8f0
    C_CODE_BG   = RGBColor(30, 41, 59)      # #1e293b
    C_CODE_LINE = RGBColor(51, 65, 85)      # #334155
    C_CODE_TXT  = RGBColor(226, 232, 240)
    C_CODE_KW   = RGBColor(56, 189, 248)    # #38bdf8 light blue
    
    C_NAVY_TEXT = RGBColor(15, 23, 42)
    C_MUTED     = RGBColor(100, 116, 139)   # #64748b
    C_BLUE      = RGBColor(37, 99, 235)     # #2563eb
    C_TEAL      = RGBColor(13, 148, 136)    # #0d9488
    C_PURPLE    = RGBColor(124, 58, 237)    # #7c3aed
    C_ORANGE    = RGBColor(234, 88, 12)     # #ea580c
    C_EMERALD   = RGBColor(16, 185, 129)    # #10b981

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, member_badge, topic_title, subtitle=""):
        # Member / Topic Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.45), Inches(3.6), Inches(0.4))
        badge.fill.solid()
        badge.fill.fore_color.rgb = RGBColor(238, 242, 255)
        badge.line.color.rgb = RGBColor(199, 210, 254)
        badge.line.width = Pt(1)
        tf_b = badge.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = member_badge.upper()
        p_b.font.name = "Arial"
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = C_BLUE
        p_b.alignment = PP_ALIGN.CENTER

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.7))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = topic_title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY_TEXT

        # Subtitle
        if subtitle:
            p_s = tf_t.add_paragraph()
            p_s.text = subtitle
            p_s.font.name = "Arial"
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = C_MUTED

    def add_card(slide, left, top, width, height, title, items, tag="", tag_color=C_BLUE):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_CARD_LINE
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        # Tag if any
        if tag:
            p_tag = tf.paragraphs[0]
            p_tag.text = tag.upper()
            p_tag.font.name = "Arial"
            p_tag.font.size = Pt(10)
            p_tag.font.bold = True
            p_tag.font.color.rgb = tag_color
            p_title = tf.add_paragraph()
        else:
            p_title = tf.paragraphs[0]

        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = C_NAVY_TEXT
        p_title.space_after = Pt(8)

        for itm in items:
            p = tf.add_paragraph()
            p.text = "•  " + itm
            p.font.name = "Arial"
            p.font.size = Pt(12)
            p.font.color.rgb = RGBColor(51, 65, 85)
            p.space_after = Pt(6)

        return card

    def add_code_box(slide, left, top, width, height, title, code_lines):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        box.fill.solid()
        box.fill.fore_color.rgb = C_CODE_BG
        box.line.color.rgb = C_CODE_LINE
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)

        # Title
        p_t = tf.paragraphs[0]
        p_t.text = "💻 " + title
        p_t.font.name = "Courier New"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_CODE_KW
        p_t.space_after = Pt(6)

        for line in code_lines:
            p = tf.add_paragraph()
            p.text = line
            p.font.name = "Courier New"
            p.font.size = Pt(11)
            p.font.color.rgb = C_CODE_TXT
            p.space_after = Pt(2)

    # -------------------------------------------------------------------------
    # SLIDE 1: Title Slide (Dark Theme)
    # -------------------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_DARK_BG)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(1.2), Inches(0.12), Inches(4.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_BLUE
    bar.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.5), Inches(1.1), Inches(10.5), Inches(5.0))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "DATABASE MANAGEMENT SYSTEMS | ADVANCED PL/SQL"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_CODE_KW
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "Enterprise Database Engineering"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Procedures, Functions, Cursors, Triggers & Exception Handling"
    p.font.name = "Arial"
    p.font.size = Pt(20)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_after = Pt(32)

    p = tf1.add_paragraph()
    p.text = "5-Member Collaborative Technical Presentation"
    p.font.name = "Arial"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Domain Case Study: Core Banking & Transaction Management System"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # -------------------------------------------------------------------------
    # SLIDE 2: Team Agenda & Roadmap
    # -------------------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_LIGHT_BG)
    add_header(s2, "Team Structure", "Presentation Agenda & Member Allocation", "5 Core PL/SQL Pillars presented by each team member")

    members = [
        ("Member 1", "Stored Procedures", ["PL/SQL Architecture & Compilation", "IN, OUT & IN OUT Parameters", "Banking Fund Transfer Procedure"], C_BLUE),
        ("Member 2", "Database Functions", ["Mandatory Return Values", "Integration with SQL SELECT queries", "Procedure vs Function Comparative Matrix"], C_TEAL),
        ("Member 3", "Cursor Concept", ["Private Context Area Mechanics", "Implicit vs Explicit Cursors", "4-Stage Lifecycle & Cursor FOR Loops"], C_PURPLE),
        ("Member 4", "Database Triggers", ["Event-Condition-Action (ECA) Model", "Statement vs Row-Level Triggers", "Audit Logging using :OLD and :NEW"], C_ORANGE),
        ("Member 5", "Exception Handling", ["Runtime Fault-Tolerance & Resilience", "Predefined vs User-Defined Exceptions", "SQLCODE/SQLERRM & End-to-End Flow"], C_EMERALD),
    ]

    left_start = 0.8
    card_w = 2.2
    gap = 0.2
    for i, (m_id, topic, pts, col) in enumerate(members):
        pos_x = left_start + i * (card_w + gap)
        add_card(s2, pos_x, 1.8, card_w, 5.0, topic, pts, tag=m_id, tag_color=col)

    # -------------------------------------------------------------------------
    # SLIDE 3: Member 1 - Stored Procedures Concept
    # -------------------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_LIGHT_BG)
    add_header(s3, "Member 1 | Subprograms", "Stored Procedures: Architecture & Principles", "Compiled server-side routines for business workflow execution")

    add_card(s3, 0.8, 1.8, 5.7, 5.1, "Core Concepts & Benefits", [
        "Precompiled Code: Parsed and stored in data dictionary; eliminates repetitive compilation overhead.",
        "Reduced Network Roundtrips: Multiple SQL statements execute together inside the DB engine.",
        "Enhanced Security: Users receive EXECUTE permissions on the procedure without direct table access.",
        "Modularity & Maintainability: Centralized business logic shared across web, mobile, and batch clients.",
        "Transaction Boundaries: Can issue COMMIT, ROLLBACK, and SAVEPOINT internally."
    ], tag="Architecture", tag_color=C_BLUE)

    add_card(s3, 6.8, 1.8, 5.7, 5.1, "Parameter Passing Modes", [
        "IN (Default Mode): Value passed into procedure; treated as a constant (read-only inside body).",
        "OUT Mode: Passes value from procedure back to the calling environment (write-only initially).",
        "IN OUT Mode: Passes initial value in, allows modification, and returns updated value to caller.",
        "Syntax Structure:",
        "CREATE OR REPLACE PROCEDURE proc_name (",
        "    param1 IN datatype,",
        "    param2 OUT datatype",
        ") IS ... BEGIN ... END;"
    ], tag="Mechanics", tag_color=C_PURPLE)

    # -------------------------------------------------------------------------
    # SLIDE 4: Member 1 - Stored Procedure Code & Execution
    # -------------------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_LIGHT_BG)
    add_header(s4, "Member 1 | Implementation", "Stored Procedure in Action: Banking Transfer", "Demonstrating atomic parameter handling and multi-table DML")

    code_p1 = [
        "CREATE OR REPLACE PROCEDURE TransferMoney (",
        "    p_sender_acc    IN  NUMBER,",
        "    p_receiver_acc  IN  NUMBER,",
        "    p_amount        IN  NUMBER,",
        "    p_status_msg    OUT VARCHAR2",
        ") IS",
        "    v_sender_bal NUMBER;",
        "BEGIN",
        "    -- 1. Check sender balance",
        "    SELECT balance INTO v_sender_bal ",
        "    FROM Accounts WHERE acc_no = p_sender_acc;",
        "",
        "    IF v_sender_bal < p_amount THEN",
        "        p_status_msg := 'FAILED: Insufficient Balance';",
        "        RETURN;",
        "    END IF;",
        "",
        "    -- 2. Deduct and Credit atomically",
        "    UPDATE Accounts SET balance = balance - p_amount",
        "    WHERE acc_no = p_sender_acc;",
        "",
        "    UPDATE Accounts SET balance = balance + p_amount",
        "    WHERE acc_no = p_receiver_acc;",
        "",
        "    p_status_msg := 'SUCCESS: Transfer Completed';",
        "    COMMIT;",
        "END TransferMoney;",
        "/"
    ]
    add_code_box(s4, 0.8, 1.8, 6.5, 5.1, "Procedure: TransferMoney", code_p1)

    add_card(s4, 7.6, 1.8, 4.9, 5.1, "Key Execution Takeaways", [
        "Caller passes sender, receiver, and transfer amount via IN parameters.",
        "v_sender_bal verifies business rule before executing DML.",
        "p_status_msg communicates execution result back via OUT parameter.",
        "Atomic Commit: If either update fails, transaction integrity is preserved.",
        "Invoked via: EXEC TransferMoney(101, 102, 5000, :msg);",
        "Teacher Viva Tip: Emphasize that procedures don't return values directly, making them distinct from functions."
    ], tag="Analysis", tag_color=C_BLUE)

    # -------------------------------------------------------------------------
    # SLIDE 5: Member 2 - Database Functions
    # -------------------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_LIGHT_BG)
    add_header(s5, "Member 2 | Computations", "Database Functions: Principles & SQL Integration", "Self-contained subprograms engineered for calculation and value return")

    code_f1 = [
        "CREATE OR REPLACE FUNCTION CalculateTax (",
        "    p_emp_id NUMBER,",
        "    p_slab_pct NUMBER",
        ") RETURN NUMBER IS",
        "    v_salary NUMBER;",
        "    v_tax    NUMBER := 0;",
        "BEGIN",
        "    SELECT salary INTO v_salary ",
        "    FROM Employees WHERE emp_id = p_emp_id;",
        "",
        "    v_tax := v_salary * (p_slab_pct / 100);",
        "    RETURN v_tax; -- Mandatory RETURN",
        "END CalculateTax;",
        "/",
        "",
        "-- Direct invocation inside SQL Query:",
        "SELECT emp_name, salary,",
        "       CalculateTax(emp_id, 15) AS TaxPayable",
        "FROM Employees WHERE dept_id = 10;"
    ]
    add_code_box(s5, 0.8, 1.8, 6.5, 5.1, "Function: CalculateTax & SQL Call", code_f1)

    add_card(s5, 7.6, 1.8, 4.9, 5.1, "Key Characteristics", [
        "Mandatory RETURN Clause: Must declare return data type in header and execute RETURN <val>.",
        "Direct SQL Interoperability: Can be placed inside SELECT, WHERE, HAVING, and ORDER BY clauses.",
        "Purity Levels & Restrictions: When called inside SQL, functions cannot execute DML (INSERT/UPDATE/DELETE) on queried tables.",
        "Deterministic Functions: Can cache results for identical inputs to optimize performance.",
        "Best Used For: Financial formulas, tax computations, discount logic, date manipulation."
    ], tag="Capabilities", tag_color=C_TEAL)

    # -------------------------------------------------------------------------
    # SLIDE 6: Member 2 - Procedure vs Function (Comparison Matrix)
    # -------------------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_LIGHT_BG)
    add_header(s6, "Member 2 | Comparison", "Stored Procedure vs Database Function", "Comprehensive architectural comparison matrix frequently tested in vivas")

    # Table
    table_shape = s6.shapes.add_table(6, 3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    table = table_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(4.55)
    table.columns[2].width = Inches(4.55)

    headers = ["Criterion", "Stored Procedure", "Database Function"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_DARK_BG
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

    rows_data = [
        ("Return Value", "Optional; Can return 0, 1, or multiple values via OUT parameters.", "Mandatory; Must return exactly one value via RETURN clause."),
        ("SQL Invocation", "Cannot be called directly inside SELECT / WHERE / ORDER BY queries.", "Can be called directly within SQL statements like standard functions."),
        ("DML Operations", "Fully permits INSERT, UPDATE, and DELETE statements seamlessly.", "Restricted; Cannot execute DML when invoked inside a SELECT statement."),
        ("Primary Purpose", "Designed to execute business actions, workflows, and transaction logic.", "Designed to perform calculations, transformations, and compute values."),
        ("Transaction Management", "Can issue COMMIT and ROLLBACK statements inside the block.", "Cannot issue COMMIT or ROLLBACK when called from a query.")
    ]

    for i, (crit, sp, fn) in enumerate(rows_data):
        row_idx = i + 1
        bg_col = C_WHITE if row_idx % 2 == 1 else RGBColor(241, 245, 249)
        for col_idx, text in enumerate([crit, sp, fn]):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.color.rgb = C_NAVY_TEXT
            if col_idx == 0:
                p.font.bold = True

    # -------------------------------------------------------------------------
    # SLIDE 7: Member 3 - Cursor Concept
    # -------------------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, C_LIGHT_BG)
    add_header(s7, "Member 3 | Data Buffering", "Database Cursors: Context Area & Types", "Bridging the gap between set-oriented SQL and row-by-row procedural logic")

    add_card(s7, 0.8, 1.8, 5.7, 5.1, "What is a Cursor?", [
        "Context Area: A private memory structure allocated by the database to execute SQL statements and hold result sets.",
        "Cursor Definition: A named pointer/handle to this Context Area allowing programmatic access.",
        "Why Needed? SQL works on complete sets of rows, but PL/SQL processes individual variables one row at a time.",
        "Cursor Attributes:",
        "  • %FOUND: TRUE if last fetch returned a row.",
        "  • %NOTFOUND: TRUE if no row returned.",
        "  • %ROWCOUNT: Number of rows fetched so far.",
        "  • %ISOPEN: TRUE if cursor is currently open."
    ], tag="Fundamentals", tag_color=C_PURPLE)

    add_card(s7, 6.8, 1.8, 5.7, 5.1, "Implicit vs Explicit Cursors", [
        "1. Implicit Cursors:",
        "  • Created automatically by Oracle for all DML statements (INSERT, UPDATE, DELETE) and single-row SELECT INTO.",
        "  • Managed via SQL prefix: SQL%FOUND, SQL%ROWCOUNT.",
        "  • Throws TOO_MANY_ROWS if query returns >1 row.",
        "2. Explicit Cursors:",
        "  • Explicitly declared by developer for multi-row queries.",
        "  • Controlled via 4 lifecycle commands: DECLARE, OPEN, FETCH, CLOSE.",
        "  • Gives precise control over memory and row processing."
    ], tag="Classification", tag_color=C_BLUE)

    # -------------------------------------------------------------------------
    # SLIDE 8: Member 3 - Cursor Lifecycle & Code
    # -------------------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, C_LIGHT_BG)
    add_header(s8, "Member 3 | Implementation", "Explicit Cursor Lifecycle & Cursor FOR Loops", "Managing cursor memory and iterative record traversal")

    code_c1 = [
        "DECLARE",
        "    CURSOR c_emp IS",
        "        SELECT emp_id, salary FROM Employees",
        "        WHERE dept_id = 10;",
        "    v_id  Employees.emp_id%TYPE;",
        "    v_sal Employees.salary%TYPE;",
        "BEGIN",
        "    -- Step 1: OPEN (Allocates memory & queries)",
        "    OPEN c_emp;",
        "    LOOP",
        "        -- Step 2: FETCH (Retrieves single row)",
        "        FETCH c_emp INTO v_id, v_sal;",
        "        EXIT WHEN c_emp%NOTFOUND;",
        "        ",
        "        -- Process record:",
        "        DBMS_OUTPUT.PUT_LINE('ID: ' || v_id || ' Sal: ' || v_sal);",
        "    END LOOP;",
        "    -- Step 3: CLOSE (Frees memory)",
        "    CLOSE c_emp;",
        "END;"
    ]
    add_code_box(s8, 0.8, 1.8, 6.5, 5.1, "Explicit Cursor: 4-Step Lifecycle", code_c1)

    add_card(s8, 7.6, 1.8, 4.9, 5.1, "Modern Best Practice: Cursor FOR Loop", [
        "Cleaner, automated cursor traversal:",
        "FOR emp_rec IN (SELECT emp_id, salary FROM Employees) LOOP",
        "    DBMS_OUTPUT.PUT_LINE(emp_rec.salary);",
        "END LOOP;",
        "Why Cursor FOR Loop is Preferred:",
        "  • Automatic OPEN: Cursor opens automatically.",
        "  • Automatic FETCH: Rows fetched into record variable.",
        "  • Automatic EXIT: Loop breaks when %NOTFOUND is met.",
        "  • Automatic CLOSE: Prevents memory leak ORA-01000.",
        "Viva Tip: Always mention memory leak prevention by closing cursors."
    ], tag="Best Practices", tag_color=C_PURPLE)

    # -------------------------------------------------------------------------
    # SLIDE 9: Member 4 - Database Triggers
    # -------------------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, C_LIGHT_BG)
    add_header(s9, "Member 4 | Automation", "Database Triggers: Event-Driven Programming", "Autonomous blocks executed implicitly in response to database events")

    add_card(s9, 0.8, 1.8, 5.7, 5.1, "The ECA Model & Capabilities", [
        "ECA Model: Event (What occurred?), Condition (Is rule met?), Action (What code executes?).",
        "Implicit Invocation: Triggers cannot be called manually with EXEC. They fire automatically upon DML/DDL.",
        "Key Use Cases:",
        "  • Audit Trail Logging: Silently tracking who changed what and when.",
        "  • Complex Business Validation: Enforcing cross-table integrity rules.",
        "  • Automatic Value Generation: Populating primary keys / sequences.",
        "  • Security Restrictions: Blocking operations outside business hours."
    ], tag="Architecture", tag_color=C_ORANGE)

    add_card(s9, 6.8, 1.8, 5.7, 5.1, "Trigger Dimensions & Correlation", [
        "1. Timing Dimensions:",
        "  • BEFORE: Fires before DML; ideal for validation and data sanitization.",
        "  • AFTER: Fires after DML; ideal for auditing and cascading changes.",
        "  • INSTEAD OF: Used to make complex non-updatable Views editable.",
        "2. Granularity Levels:",
        "  • Statement-Level: Fires ONCE per SQL statement regardless of rows.",
        "  • Row-Level (FOR EACH ROW): Fires for every single row affected.",
        "3. Correlation Pseudo-Records:",
        "  • :OLD represents row values prior to update/delete.",
        "  • :NEW represents row values coming in from insert/update."
    ], tag="Dimensions", tag_color=C_BLUE)

    # -------------------------------------------------------------------------
    # SLIDE 10: Member 4 - Trigger Implementation (Audit Log)
    # -------------------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, C_LIGHT_BG)
    add_header(s10, "Member 4 | Implementation", "Trigger in Action: Automated Audit Logging", "Tracking sensitive salary modifications using :OLD and :NEW qualifiers")

    code_t1 = [
        "CREATE OR REPLACE TRIGGER Trg_AuditSalaryChange",
        "AFTER UPDATE OF salary ON Employees",
        "FOR EACH ROW",
        "BEGIN",
        "    -- Only log when salary actually changes",
        "    IF :OLD.salary != :NEW.salary THEN",
        "        INSERT INTO Salary_Audit (",
        "            emp_id,",
        "            old_salary,",
        "            new_salary,",
        "            changed_by,",
        "            change_date",
        "        ) VALUES (",
        "            :OLD.emp_id,",
        "            :OLD.salary,",
        "            :NEW.salary,",
        "            USER,",
        "            SYSDATE",
        "        );",
        "    END IF;",
        "END Trg_AuditSalaryChange;",
        "/"
    ]
    add_code_box(s10, 0.8, 1.8, 6.5, 5.1, "Trigger: AuditSalaryChange", code_t1)

    add_card(s10, 7.6, 1.8, 4.9, 5.1, "Mechanics & Viva Warnings", [
        "AFTER UPDATE OF salary: Trigger only fires when the specific salary column is modified.",
        "FOR EACH ROW: Ensures every individual employee updated is logged.",
        ":OLD vs :NEW Behavior:",
        "  • INSERT: :OLD is NULL, :NEW has inserted data.",
        "  • DELETE: :OLD has deleted data, :NEW is NULL.",
        "  • UPDATE: Both :OLD and :NEW are populated.",
        "Mutating Table Caution (ORA-04091):",
        "  • A row trigger cannot query or modify the same table that caused it to fire. Critical viva question!"
    ], tag="Analysis", tag_color=C_ORANGE)

    # -------------------------------------------------------------------------
    # SLIDE 11: Member 5 - Exception Handling Fundamentals
    # -------------------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, C_LIGHT_BG)
    add_header(s11, "Member 5 | Reliability", "Exception Handling: Fault-Tolerance & Resilience", "Preventing runtime crashes and ensuring graceful degradation in databases")

    add_card(s11, 0.8, 1.8, 5.7, 5.1, "Exception Concept & Block Architecture", [
        "What is an Exception? An abnormal runtime error condition encountered during program execution.",
        "Why Handle Exceptions? Without handling, PL/SQL terminates abruptly, leaving transactions in an uncommitted state.",
        "PL/SQL Block Structure:",
        "  DECLARE   -- Variable & exception declarations",
        "  BEGIN     -- Regular business executable statements",
        "  EXCEPTION -- Dedicated error-trapping section",
        "    WHEN exception_name THEN handling_code;",
        "  END;",
        "Separation of Concerns: Isolates business logic from error-recovery routines."
    ], tag="Architecture", tag_color=C_EMERALD)

    add_card(s11, 6.8, 1.8, 5.7, 5.1, "Taxonomy of Exceptions", [
        "1. Pre-Defined System Exceptions:",
        "  • Declared globally by Oracle with named identifiers.",
        "  • NO_DATA_FOUND (ORA-01403): Query returned 0 rows.",
        "  • TOO_MANY_ROWS (ORA-01422): SELECT INTO returned >1 row.",
        "  • ZERO_DIVIDE (ORA-01476): Division by zero attempted.",
        "2. User-Defined Exceptions:",
        "  • Defined by developer for business violations (e.g., negative balance).",
        "  • Explicitly triggered using the RAISE statement.",
        "3. Catch-All Exception: WHEN OTHERS THEN handles unexpected faults."
    ], tag="Taxonomy", tag_color=C_PURPLE)

    # -------------------------------------------------------------------------
    # SLIDE 12: Member 5 - Exception Code & Diagnostics
    # -------------------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, C_LIGHT_BG)
    add_header(s12, "Member 5 | Implementation", "Exception Handling in Action & Diagnostics", "Trapping predefined faults, custom business exceptions, and system diagnostics")

    code_e1 = [
        "DECLARE",
        "    v_balance NUMBER;",
        "    e_insufficient_funds EXCEPTION; -- Custom exception",
        "BEGIN",
        "    SELECT balance INTO v_balance FROM Accounts ",
        "    WHERE acc_no = 101;",
        "",
        "    IF v_balance < 1000 THEN",
        "        RAISE e_insufficient_funds;",
        "    END IF;",
        "EXCEPTION",
        "    WHEN NO_DATA_FOUND THEN",
        "        DBMS_OUTPUT.PUT_LINE('Error: Account does not exist.');",
        "        ROLLBACK;",
        "    WHEN e_insufficient_funds THEN",
        "        RAISE_APPLICATION_ERROR(-20001, 'Min balance violation!');",
        "    WHEN OTHERS THEN",
        "        DBMS_OUTPUT.PUT_LINE('Code: ' || SQLCODE);",
        "        DBMS_OUTPUT.PUT_LINE('Msg : ' || SQLERRM);",
        "        ROLLBACK;",
        "END;"
    ]
    add_code_box(s12, 0.8, 1.8, 6.5, 5.1, "PL/SQL Robust Exception Block", code_e1)

    add_card(s12, 7.6, 1.8, 4.9, 5.1, "Diagnostic Functions & Tools", [
        "SQLCODE Function:",
        "  • Returns the numeric error code of the most recent exception (e.g., -1403, -1476).",
        "SQLERRM Function:",
        "  • Returns the corresponding text error message string.",
        "RAISE_APPLICATION_ERROR Procedure:",
        "  • Allows developers to return custom error codes (-20000 to -20999) and custom error text back to front-end apps.",
        "Guaranteed Rollback:",
        "  • Best practice: Issue ROLLBACK inside exception handlers to preserve database consistency."
    ], tag="Diagnostics", tag_color=C_EMERALD)

    # -------------------------------------------------------------------------
    # SLIDE 13: System Integration (Connecting All 5 Concepts)
    # -------------------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13, C_LIGHT_BG)
    add_header(s13, "Architecture Integration", "How All 5 Pillars Work Together in Real Systems", "End-to-End Enterprise Workflow (Payroll & Banking Processing)")

    flow_steps = [
        ("1. PROCEDURE", "Entry Point", "Admin invokes 'ProcessMonthlyPayroll'. Initiates the atomic business transaction.", C_BLUE),
        ("2. CURSOR", "Batch Buffer", "Procedure opens explicit cursor to iterate through thousands of active employees row-by-row.", C_PURPLE),
        ("3. FUNCTION", "Computation", "For each row, calls 'CalculateTax' and 'CalculateBonus' to compute net compensation.", C_TEAL),
        ("4. TRIGGER", "Audit Guard", "DML update on Salary table auto-fires trigger, creating immutable security audit records.", C_ORANGE),
        ("5. EXCEPTION", "Resilience", "Entire flow enclosed in exception handlers. Traps errors, logs diagnostics, rollbacks cleanly.", C_EMERALD),
    ]

    left_start = 0.8
    card_w = 2.2
    gap = 0.2
    for i, (p_title, tag, desc, col) in enumerate(flow_steps):
        pos_x = left_start + i * (card_w + gap)
        add_card(s13, pos_x, 1.8, card_w, 5.0, p_title, [desc], tag=tag, tag_color=col)

    # -------------------------------------------------------------------------
    # SLIDE 14: Q&A & Viva Quick Reference (Dark Theme)
    # -------------------------------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14, C_DARK_BG)

    tb14 = s14.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(5.8))
    tf14 = tb14.text_frame
    tf14.word_wrap = True

    p = tf14.paragraphs[0]
    p.text = "CONCLUSION & VIVA PREPARATION"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_CODE_KW
    p.space_after = Pt(10)

    p = tf14.add_paragraph()
    p.text = "Thank You! Questions & Discussion"
    p.font.name = "Arial"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(20)

    p = tf14.add_paragraph()
    p.text = "Top Teacher Viva Reference Questions & Crisp Answers:"
    p.font.name = "Arial"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(10)

    qa_list = [
        ("Procedure vs Function?", "Procedure executes actions/DML; Function calculates and MUST return a single value."),
        ("Why close an explicit cursor?", "To prevent memory leaks and exceeding ORA-01000 (maximum open cursors)."),
        ("What is a Mutating Table?", "ORA-04091: Occurs when a row trigger tries to query/modify the table currently undergoing DML."),
        ("What do SQLCODE and SQLERRM do?", "SQLCODE returns the numeric error code; SQLERRM returns the textual error description."),
        ("Difference between :OLD and :NEW in Triggers?", ":OLD holds pre-modification values; :NEW holds incoming post-modification values.")
    ]

    for q, a in qa_list:
        p = tf14.add_paragraph()
        p.text = "Q: " + q + "  ➔  " + a
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(6)

    output_path = "/Users/ash/Desktop/SmartRecruitmentProject/DBMS_PLSQL_5_Members_Presentation.pptx"
    prs.save(output_path)
    print("SUCCESS: Presentation saved at:", output_path)

if __name__ == "__main__":
    create_deck()
