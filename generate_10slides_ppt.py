import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_10_slide_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette (Crisp, High Contrast, Amity Professional)
    C_NAVY_DARK = RGBColor(15, 23, 42)      # #0f172a
    C_SLATE_BG  = RGBColor(248, 250, 252)   # #f8fafc
    C_WHITE     = RGBColor(255, 255, 255)
    C_CARD_BG   = RGBColor(255, 255, 255)
    C_CARD_LINE = RGBColor(203, 213, 225)   # #cbd5e1
    
    C_AMITY_BLUE = RGBColor(30, 64, 175)    # #1e40af
    C_AMITY_GOLD = RGBColor(217, 119, 6)    # #d97706
    C_TEAL       = RGBColor(13, 148, 136)   # #0d9488
    C_PURPLE     = RGBColor(109, 40, 217)   # #6d28d9
    C_EMERALD    = RGBColor(16, 185, 129)   # #10b981
    
    C_TEXT_MAIN  = RGBColor(15, 23, 42)     # #0f172a
    C_TEXT_MUTED = RGBColor(71, 85, 105)    # #475569
    
    C_CODE_BG    = RGBColor(15, 23, 42)     # #0f172a
    C_CODE_BORDER= RGBColor(51, 65, 85)     # #334155
    C_CODE_TXT   = RGBColor(241, 245, 249)
    C_CODE_KW    = RGBColor(56, 189, 248)   # Sky blue
    C_CODE_COMM  = RGBColor(148, 163, 184)  # Muted comment

    def set_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_slide_header(slide, syllabus_tag, main_title, subtitle=""):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_tag = tf.paragraphs[0]
        p_tag.text = syllabus_tag.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_AMITY_BLUE
        p_tag.space_after = Pt(2)

        p_title = tf.add_paragraph()
        p_title.text = main_title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(21)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_MAIN
        p_title.space_after = Pt(2)

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(11.5)
            p_sub.font.color.rgb = C_TEXT_MUTED

    def add_structured_card(slide, left, top, width, height, tag, tag_color, title, bullet_points):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_CARD_LINE
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.18)
        tf.margin_bottom = Inches(0.15)

        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(9.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color
        p_tag.space_after = Pt(3)

        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(14.5)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_MAIN
        p_title.space_after = Pt(7)

        for b_bold, b_desc in bullet_points:
            p = tf.add_paragraph()
            p.space_after = Pt(4.5)
            
            run_sym = p.add_run()
            run_sym.text = "▪ "
            run_sym.font.name = "Arial"
            run_sym.font.size = Pt(10.5)
            run_sym.font.bold = True
            run_sym.font.color.rgb = tag_color

            if b_bold:
                run_bold = p.add_run()
                run_bold.text = b_bold + ": "
                run_bold.font.name = "Arial"
                run_bold.font.size = Pt(10.5)
                run_bold.font.bold = True
                run_bold.font.color.rgb = C_TEXT_MAIN

            run_desc = p.add_run()
            run_desc.text = b_desc
            run_desc.font.name = "Arial"
            run_desc.font.size = Pt(10)
            run_desc.font.color.rgb = C_TEXT_MUTED

    def add_code_panel(slide, left, top, width, height, title_tag, code_lines):
        panel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        panel.fill.solid()
        panel.fill.fore_color.rgb = C_CODE_BG
        panel.line.color.rgb = C_CODE_BORDER
        panel.line.width = Pt(1.2)

        tf = panel.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.22)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)
        tf.margin_bottom = Inches(0.15)

        p_title = tf.paragraphs[0]
        p_title.text = "💻 " + title_tag
        p_title.font.name = "Consolas"
        p_title.font.size = Pt(10.5)
        p_title.font.bold = True
        p_title.font.color.rgb = C_CODE_KW
        p_title.space_after = Pt(5)

        for line in code_lines:
            p = tf.add_paragraph()
            p.space_after = Pt(1)
            run = p.add_run()
            run.text = line
            run.font.name = "Consolas"
            run.font.size = Pt(9.2)
            if line.strip().startswith("--"):
                run.font.color.rgb = C_CODE_COMM
                run.font.italic = True
            elif any(line.strip().startswith(kw) for kw in ["CREATE", "BEGIN", "EXCEPTION", "END", "IF", "LOOP", "OPEN", "FETCH", "CLOSE"]):
                run.font.color.rgb = C_CODE_KW
                run.font.bold = True
            else:
                run.font.color.rgb = C_CODE_TXT

    # =========================================================================
    # SLIDE 1: Title Slide (Amity Curriculum Context)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_background(s1, C_NAVY_DARK)

    gold_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(1.2), Inches(0.12), Inches(5.0))
    gold_bar.fill.solid()
    gold_bar.fill.fore_color.rgb = C_AMITY_GOLD
    gold_bar.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.35), Inches(1.15), Inches(11.0), Inches(5.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "AMITY UNIVERSITY | CSIT661: RELATIONAL DATABASE MANAGEMENT SYSTEMS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_AMITY_GOLD
    p.space_after = Pt(12)

    p = tf1.add_paragraph()
    p.text = "Advanced PL/SQL Architecture"
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Module IV: Procedures, Functions, Cursors, Triggers & Exception Handling"
    p.font.name = "Arial"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_after = Pt(28)

    p = tf1.add_paragraph()
    p.text = "Focused 10-Slide 5-Member Team Presentation"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Domain Case Study: Salespeople, Customers & Orders Lab Schema"
    p.font.name = "Arial"
    p.font.size = Pt(12.5)
    p.font.color.rgb = RGBColor(226, 232, 240)

    # =========================================================================
    # SLIDE 2: PL/SQL Foundations & 5-Member Roadmap
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_background(s2, C_SLATE_BG)
    add_slide_header(s2, "Course Structure | Module IV", "PL/SQL Foundations & 5-Member Roadmap", "Syllabus mapping combining procedural control with SQL set operations")

    add_structured_card(s2, 0.8, 1.65, 5.6, 5.3, "Program Architecture", C_AMITY_BLUE, "PL/SQL Basic Block Structure", [
        ("DECLARE (Optional)", "Declares memory variables, constants, cursors, and custom exceptions before execution."),
        ("BEGIN (Mandatory)", "Contains SQL statements and procedural control statements (IF-THEN-ELSE, LOOPS)."),
        ("EXCEPTION (Optional)", "Traps runtime errors cleanly, preventing application crash and enabling ROLLBACK."),
        ("END; (Mandatory)", "Marks the closure of the compiled block units.")
    ])

    add_structured_card(s2, 6.7, 1.65, 5.833, 5.3, "Team Allocation", C_AMITY_GOLD, "5 Members Ownership (Zero Overlap)", [
        ("Member 1", "Stored Procedures (IN, OUT, IN OUT & Lab 28 Commission Update)"),
        ("Member 2", "Database Functions (Mandatory Return & Procedure vs Function Matrix)"),
        ("Member 3", "Cursor Concept (Context Area, 4-Stage Lifecycle & FOR Loops)"),
        ("Member 4", "Database Triggers (ECA Architecture, :OLD vs :NEW & Audit Logs)"),
        ("Member 5", "Exception Handling (Predefined/User-defined & System Integration)")
    ])

    # =========================================================================
    # SLIDE 3: Member 1 - Stored Procedures (Concept & Code)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_background(s3, C_SLATE_BG)
    add_slide_header(s3, "Member 1 | Subprograms", "Stored Procedures: Principles & Lab Task 28", "Server-side precompiled routines for executing business actions and batch updates")

    add_structured_card(s3, 0.8, 1.65, 5.6, 5.3, "Concepts & Parameters", C_AMITY_BLUE, "How Stored Procedures Work", [
        ("Precompiled Units", "Parsed and compiled once into p-code; stored directly in the database data dictionary."),
        ("Network Optimization", "Executes multi-statement business transactions within the engine, cutting network latency."),
        ("Parameter Modes", "IN (read-only input), OUT (returns value to caller), IN OUT (passes in and returns updated)."),
        ("Security Abstraction", "Users run EXECUTE without needing direct SELECT or UPDATE permissions on base tables.")
    ])

    code_p1 = [
        "-- Lab 28: Update Mumbai Salesperson Commission",
        "CREATE OR REPLACE PROCEDURE UpdateCityCommission (",
        "    p_city        IN  VARCHAR2,",
        "    p_percent_inc IN  NUMBER,",
        "    p_rows_update OUT NUMBER",
        ") IS",
        "BEGIN",
        "    UPDATE Salespeople",
        "    SET commission = commission * (1 + (p_percent_inc / 100))",
        "    WHERE city = p_city;",
        "    ",
        "    p_rows_update := SQL%ROWCOUNT; -- Capture rows",
        "    COMMIT;",
        "END UpdateCityCommission;",
        "/",
        "",
        "-- How Calling Application Invokes It:",
        "VARIABLE v_count NUMBER;",
        "EXEC UpdateCityCommission('Mumbai', 10, :v_count);",
        "PRINT v_count;"
    ]
    add_code_panel(s3, 6.7, 1.65, 5.833, 5.3, "Procedure: UpdateCityCommission (Lab 28)", code_p1)

    # =========================================================================
    # SLIDE 4: Member 2 - Database Functions
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_background(s4, C_SLATE_BG)
    add_slide_header(s4, "Member 2 | Computations", "Database Functions: Syntax & SQL Integration", "Self-contained subprograms engineered for calculation, requiring a single return value")

    add_structured_card(s4, 0.8, 1.65, 5.6, 5.3, "Core Mechanics", C_TEAL, "Why Use Database Functions?", [
        ("Mandatory RETURN", "Header declares return datatype; body must execute RETURN statement with computed value."),
        ("Direct SQL Integration", "Can be embedded directly inside SELECT, WHERE, HAVING, and ORDER BY queries."),
        ("Deterministic Functions", "DETERMINISTIC caches result for identical inputs, saving heavy calculation time."),
        ("Purity Constraints", "When called from SQL queries, functions cannot execute DML statements on queried tables.")
    ])

    code_f1 = [
        "-- Function: Calculate Salesperson Commission",
        "CREATE OR REPLACE FUNCTION GetOrderCommission (",
        "    p_amt NUMBER,",
        "    p_rate NUMBER DEFAULT 0.12",
        ") RETURN NUMBER DETERMINISTIC IS",
        "    v_comm_amt NUMBER := 0;",
        "BEGIN",
        "    IF p_amt IS NULL OR p_amt <= 0 THEN",
        "        RETURN 0;",
        "    END IF;",
        "    ",
        "    v_comm_amt := p_amt * p_rate;",
        "    RETURN ROUND(v_comm_amt, 2); -- Mandatory",
        "END GetOrderCommission;",
        "/",
        "",
        "-- Calling directly inside SQL SELECT Query:",
        "SELECT onum, snum, amt,",
        "       GetOrderCommission(amt, 0.12) AS EarnedComm",
        "FROM Orders WHERE amt > 1000;"
    ]
    add_code_panel(s4, 6.7, 1.65, 5.833, 5.3, "Function: GetOrderCommission & SQL Call", code_f1)

    # =========================================================================
    # SLIDE 5: Member 2 - Procedure vs Function (Comparison Matrix)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_background(s5, C_SLATE_BG)
    add_slide_header(s5, "Member 2 & 1 | Comparison", "Stored Procedure vs Database Function", "Essential comparative matrix frequently tested in Amity end-term exams and vivas")

    table_shape = s5.shapes.add_table(6, 3, Inches(0.8), Inches(1.65), Inches(11.733), Inches(5.3))
    table = table_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(4.56)
    table.columns[2].width = Inches(4.56)

    col_headers = ["Evaluation Metric", "Stored Procedure", "Database Function"]
    for j, h in enumerate(col_headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_NAVY_DARK
        cell.margin_left = cell.margin_right = cell.margin_top = cell.margin_bottom = Inches(0.12)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

    comp_rows = [
        ("Return Value", "Optional; Can return 0, 1, or multiple values through OUT / IN OUT parameters.", "Mandatory; Must return exactly ONE value using the RETURN clause."),
        ("Call in SQL Queries", "Cannot be embedded inside SQL SELECT, WHERE, or ORDER BY statements.", "Can be called directly within SELECT, WHERE, and GROUP BY statements."),
        ("DML Operations", "Fully permits execution of INSERT, UPDATE, and DELETE operations.", "Restricted; Cannot modify database state when invoked inside a SELECT query."),
        ("Primary Objective", "Designed to execute business workflows, transactions, and batch tasks.", "Designed to compute values, transform data, and return calculated results."),
        ("Transaction Control", "Permitted to issue COMMIT, ROLLBACK, and SAVEPOINT internally.", "Cannot issue COMMIT or ROLLBACK when called from a query.")
    ]

    for i, (m, sp, fn) in enumerate(comp_rows):
        r_idx = i + 1
        bg_col = C_WHITE if r_idx % 2 == 1 else RGBColor(241, 245, 249)
        for c_idx, val in enumerate([m, sp, fn]):
            cell = table.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            cell.margin_left = cell.margin_right = cell.margin_top = cell.margin_bottom = Inches(0.1)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = C_TEXT_MAIN
            if c_idx == 0:
                p.font.bold = True

    # =========================================================================
    # SLIDE 6: Member 3 - Cursor Concept & Lifecycle
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_background(s6, C_SLATE_BG)
    add_slide_header(s6, "Member 3 | Data Buffering", "Database Cursors: Context Area & 4-Step Lifecycle", "Bridging set-oriented SQL with row-oriented procedural execution to process active sets")

    add_structured_card(s6, 0.8, 1.65, 5.6, 5.3, "Context Area Mechanics", C_PURPLE, "What is a Cursor?", [
        ("Context Area", "Private memory area allocated in the SGA by the DB server to hold SQL query result sets."),
        ("Cursor Definition", "A named pointer to the Context Area allowing row-by-row traversal of records."),
        ("Implicit vs Explicit", "Implicit created automatically for DML; Explicit declared by developer for multi-row queries."),
        ("Attributes", "%FOUND (fetch succeeded), %NOTFOUND (no more rows), %ROWCOUNT (rows fetched), %ISOPEN (status).")
    ])

    code_c1 = [
        "-- Explicit Cursor: 4-Step Memory Lifecycle",
        "DECLARE",
        "    CURSOR c_orders IS",
        "        SELECT onum, amt, snum FROM Orders WHERE amt > 2000;",
        "    v_onum Orders.onum%TYPE;",
        "    v_amt  Orders.amt%TYPE;",
        "    v_snum Orders.snum%TYPE;",
        "BEGIN",
        "    OPEN c_orders; -- Step 1: Allocate & Execute",
        "    LOOP",
        "        FETCH c_orders INTO v_onum, v_amt, v_snum; -- Step 2",
        "        EXIT WHEN c_orders%NOTFOUND;",
        "        DBMS_OUTPUT.PUT_LINE('Order: ' || v_onum);",
        "    END LOOP;",
        "    CLOSE c_orders; -- Step 3: Free Memory",
        "END;",
        "/",
        "-- Best Practice: Cursor FOR Loop auto-opens & closes",
        "FOR rec IN (SELECT onum, amt FROM Orders) LOOP ... END LOOP;"
    ]
    add_code_panel(s6, 6.7, 1.65, 5.833, 5.3, "Cursor: 4-Step Lifecycle & FOR Loop", code_c1)

    # =========================================================================
    # SLIDE 7: Member 4 - Database Triggers
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_background(s7, C_SLATE_BG)
    add_slide_header(s7, "Member 4 | Automation", "Database Triggers: Event-Driven Programming", "Autonomous PL/SQL blocks executed automatically in response to database events")

    add_structured_card(s7, 0.8, 1.65, 5.6, 5.3, "ECA Model & Correlation", C_AMITY_GOLD, "Architecture of a Trigger", [
        ("The ECA Rule", "Event (INSERT/UPDATE/DELETE), Condition (WHEN clause check), Action (PL/SQL body)."),
        ("Implicit Invocation", "Triggers cannot be called with EXEC; they fire automatically upon table modification."),
        ("Timing & Granularity", "BEFORE (validation), AFTER (auditing); Statement-Level (once) vs Row-Level (FOR EACH ROW)."),
        ("Correlation Records", ":OLD holds values before update/delete; :NEW holds incoming values from insert/update."),
        ("Mutating Table (ORA-04091)", "A row-level trigger cannot query or modify the same table currently undergoing DML.")
    ])

    code_t1 = [
        "-- Trigger: Commission Audit Log on Salespeople",
        "CREATE OR REPLACE TRIGGER Trg_AuditSalesCommission",
        "AFTER UPDATE OF commission ON Salespeople",
        "FOR EACH ROW",
        "BEGIN",
        "    -- Audit only when commission value changes",
        "    IF :OLD.commission != :NEW.commission THEN",
        "        INSERT INTO Comm_Audit_Log (",
        "            snum,",
        "            old_comm,",
        "            new_comm,",
        "            changed_by,",
        "            change_date",
        "        ) VALUES (",
        "            :OLD.snum,",
        "            :OLD.commission,",
        "            :NEW.commission,",
        "            USER,",
        "            SYSDATE",
        "        );",
        "    END IF;",
        "END Trg_AuditSalesCommission;",
        "/"
    ]
    add_code_panel(s7, 6.7, 1.65, 5.833, 5.3, "Trigger: Trg_AuditSalesCommission", code_t1)

    # =========================================================================
    # SLIDE 8: Member 5 - Exception Handling
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_background(s8, C_SLATE_BG)
    add_slide_header(s8, "Member 5 | Resilience", "Exception Handling: Fault-Tolerance & Taxonomy", "Preventing runtime crashes, ensuring data integrity, and isolating error recovery")

    add_structured_card(s8, 0.8, 1.65, 5.6, 5.3, "Taxonomy & Diagnostics", C_EMERALD, "Architecture & Diagnostic Tools", [
        ("Why Handle Exceptions?", "Separates routine business code from error recovery; ensures programmatic ROLLBACK on failure."),
        ("Pre-Defined System", "Internally handled: NO_DATA_FOUND, TOO_MANY_ROWS, ZERO_DIVIDE, DUP_VAL_ON_INDEX."),
        ("User-Defined Exceptions", "Declared explicitly via e_name EXCEPTION and triggered using RAISE keyword."),
        ("Diagnostics", "SQLCODE (numeric error code), SQLERRM (error message string), RAISE_APPLICATION_ERROR.")
    ])

    code_e1 = [
        "-- Enforcing commission threshold with exception handling",
        "DECLARE",
        "    v_comm Salespeople.commission%TYPE;",
        "    e_excess_comm EXCEPTION; -- Custom Exception",
        "BEGIN",
        "    SELECT commission INTO v_comm FROM Salespeople WHERE snum = 1001;",
        "    ",
        "    IF v_comm > 0.25 THEN",
        "        RAISE e_excess_comm; -- Explicit raise",
        "    END IF;",
        "EXCEPTION",
        "    WHEN NO_DATA_FOUND THEN",
        "        DBMS_OUTPUT.PUT_LINE('Salesperson not found.');",
        "        ROLLBACK;",
        "    WHEN e_excess_comm THEN",
        "        RAISE_APPLICATION_ERROR(-20002, 'Commission exceeds 25% cap!');",
        "    WHEN OTHERS THEN",
        "        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLCODE || ' - ' || SQLERRM);",
        "        ROLLBACK;",
        "END;",
        "/"
    ]
    add_code_panel(s8, 6.7, 1.65, 5.833, 5.3, "Robust Exception Handling Implementation", code_e1)

    # =========================================================================
    # SLIDE 9: System Integration (Connecting All 5 Pillars)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_background(s9, C_SLATE_BG)
    add_slide_header(s9, "Architecture Synthesis | Module IV", "System Integration: How All 5 Pillars Work Together", "End-to-end transaction processing on the Salespeople, Orders, and Customers schema")

    flow_pillars = [
        ("1. Procedure", "Entry Point", C_AMITY_BLUE, [
            ("Role", "ProcessSalesBatch"),
            ("Action", "Initiates atomic batch transaction")
        ]),
        ("2. Cursor", "Batch Buffer", C_PURPLE, [
            ("Role", "c_pending_orders"),
            ("Action", "Iterates orders row-by-row")
        ]),
        ("3. Function", "Calculation", C_TEAL, [
            ("Role", "GetOrderCommission"),
            ("Action", "Calculates net commission per row")
        ]),
        ("4. Trigger", "Audit Guard", C_AMITY_GOLD, [
            ("Role", "Trg_AuditSalesCommission"),
            ("Action", "Auto-fires on commission DML")
        ]),
        ("5. Exception", "Fault Shield", C_EMERALD, [
            ("Role", "EXCEPTION Block"),
            ("Action", "Traps errors & rolls back cleanly")
        ])
    ]

    card_w = 2.15
    gap = 0.24
    for i, (p_tag, title, col, pts) in enumerate(flow_pillars):
        pos_x = 0.8 + i * (card_w + gap)
        add_structured_card(s9, pos_x, 1.65, card_w, 5.3, p_tag, col, title, pts)

    # =========================================================================
    # SLIDE 10: Conclusion & Viva Voce Reference Sheet (Dark Theme)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_background(s10, C_NAVY_DARK)

    gold_bar10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(0.12), Inches(5.8))
    gold_bar10.fill.solid()
    gold_bar10.fill.fore_color.rgb = C_AMITY_GOLD
    gold_bar10.line.fill.background()

    tb10 = s10.shapes.add_textbox(Inches(1.15), Inches(0.75), Inches(11.2), Inches(6.0))
    tf10 = tb10.text_frame
    tf10.word_wrap = True

    p = tf10.paragraphs[0]
    p.text = "CSIT661 VIVA VOCE & END-TERM REFERENCE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_AMITY_GOLD
    p.space_after = Pt(8)

    p = tf10.add_paragraph()
    p.text = "Summary & Teacher Viva Voce Preparation"
    p.font.name = "Arial"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.space_after = Pt(18)

    viva_qa = [
        ("Q: Procedure vs Function?", "Procedure executes actions/DML; Function calculates and MUST return exactly one value."),
        ("Q: Why close an explicit cursor?", "To release Context Area memory and prevent ORA-01000 (maximum open cursors exceeded)."),
        ("Q: What is a Mutating Table error?", "ORA-04091: Occurs when a row-level trigger tries to query or modify the table currently undergoing DML."),
        ("Q: Difference between :OLD and :NEW?", ":OLD holds values prior to update/delete; :NEW holds incoming values from insert/update."),
        ("Q: What is the purpose of SQLCODE and SQLERRM?", "SQLCODE returns numeric error code; SQLERRM returns the associated textual error description.")
    ]

    for q, a in viva_qa:
        p = tf10.add_paragraph()
        p.space_after = Pt(6)
        
        run_q = p.add_run()
        run_q.text = q + "  "
        run_q.font.name = "Arial"
        run_q.font.size = Pt(11.5)
        run_q.font.bold = True
        run_q.font.color.rgb = C_CODE_KW

        run_arr = p.add_run()
        run_arr.text = "➔  "
        run_arr.font.name = "Arial"
        run_arr.font.size = Pt(11.5)
        run_arr.font.bold = True
        run_arr.font.color.rgb = C_AMITY_GOLD

        run_a = p.add_run()
        run_a.text = a
        run_a.font.name = "Arial"
        run_a.font.size = Pt(11.5)
        run_a.font.color.rgb = RGBColor(226, 232, 240)

    output_path = "/Users/ash/Desktop/SmartRecruitmentProject/Amity_CSIT661_PLSQL_10Slides.pptx"
    prs.save(output_path)
    print("SUCCESS: 10-Slide Amity Presentation saved at:", output_path)

if __name__ == "__main__":
    build_10_slide_deck()
