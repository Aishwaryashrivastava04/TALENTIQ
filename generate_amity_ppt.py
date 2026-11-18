import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Amity / Corporate Theme Palette
    C_NAVY_DARK = RGBColor(15, 23, 42)      # #0f172a Deep Slate / Navy
    C_SLATE_BG  = RGBColor(248, 250, 252)   # #f8fafc Clean Canvas
    C_WHITE     = RGBColor(255, 255, 255)
    C_CARD_BG   = RGBColor(255, 255, 255)
    C_CARD_LINE = RGBColor(203, 213, 225)   # #cbd5e1 Crisp border
    
    # Modern Accents
    C_PRIMARY_BLUE = RGBColor(30, 64, 175)  # #1e40af Amity Blue / Deep Blue
    C_AMITY_GOLD   = RGBColor(217, 119, 6)  # #d97706 Gold / Amber
    C_TEAL         = RGBColor(13, 148, 136) # #0d9488
    C_PURPLE       = RGBColor(109, 40, 217) # #6d28d9
    C_EMERALD      = RGBColor(16, 185, 129) # #10b981
    C_RED          = RGBColor(225, 29, 72)  # #e11d48
    
    # Text colors
    C_TEXT_MAIN    = RGBColor(15, 23, 42)   # #0f172a
    C_TEXT_MUTED   = RGBColor(71, 85, 105)  # #475569
    
    # Code styling
    C_CODE_BG      = RGBColor(15, 23, 42)   # #0f172a
    C_CODE_BORDER  = RGBColor(51, 65, 85)   # #334155
    C_CODE_TXT     = RGBColor(241, 245, 249)
    C_CODE_KW      = RGBColor(56, 189, 248) # Sky blue keywords
    C_CODE_COMM    = RGBColor(148, 163, 184)# Comment gray

    def set_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_slide_header(slide, syllabus_tag, main_title, subtitle=""):
        # Header Container Box - Single text frame ensures NO OVERLAPPING ever
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.15))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Syllabus / Member Tag
        p_tag = tf.paragraphs[0]
        p_tag.text = syllabus_tag.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_PRIMARY_BLUE
        p_tag.space_after = Pt(2)

        # Main Title
        p_title = tf.add_paragraph()
        p_title.text = main_title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_MAIN
        p_title.space_after = Pt(2)

        # Subtitle
        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(12)
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
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.15)

        # Tag
        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(9.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color
        p_tag.space_after = Pt(3)

        # Title
        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(15)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_MAIN
        p_title.space_after = Pt(8)

        # Bullets (Strict font sizing so nothing overflows)
        for b_bold, b_desc in bullet_points:
            p = tf.add_paragraph()
            p.space_after = Pt(5)
            
            # Bullet point symbol
            run_sym = p.add_run()
            run_sym.text = "▪ "
            run_sym.font.name = "Arial"
            run_sym.font.size = Pt(11)
            run_sym.font.bold = True
            run_sym.font.color.rgb = tag_color

            # Bold label
            if b_bold:
                run_bold = p.add_run()
                run_bold.text = b_bold + ": "
                run_bold.font.name = "Arial"
                run_bold.font.size = Pt(11)
                run_bold.font.bold = True
                run_bold.font.color.rgb = C_TEXT_MAIN

            # Description
            run_desc = p.add_run()
            run_desc.text = b_desc
            run_desc.font.name = "Arial"
            run_desc.font.size = Pt(10.5)
            run_desc.font.color.rgb = C_TEXT_MUTED

    def add_code_panel(slide, left, top, width, height, title_tag, code_lines):
        panel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        panel.fill.solid()
        panel.fill.fore_color.rgb = C_CODE_BG
        panel.line.color.rgb = C_CODE_BORDER
        panel.line.width = Pt(1.2)

        tf = panel.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.18)
        tf.margin_bottom = Inches(0.15)

        # Panel Title
        p_title = tf.paragraphs[0]
        p_title.text = "💻 " + title_tag
        p_title.font.name = "Consolas"
        p_title.font.size = Pt(11)
        p_title.font.bold = True
        p_title.font.color.rgb = C_CODE_KW
        p_title.space_after = Pt(6)

        for line in code_lines:
            p = tf.add_paragraph()
            p.space_after = Pt(1.5)
            run = p.add_run()
            run.text = line
            run.font.name = "Consolas"
            run.font.size = Pt(9.5)
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

    # Gold Accent Line
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
    p.font.size = Pt(12.5)
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
    p.font.size = Pt(19)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_after = Pt(30)

    p = tf1.add_paragraph()
    p.text = "Collaborative 5-Member Technical Presentation"
    p.font.name = "Arial"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(6)

    p = tf1.add_paragraph()
    p.text = "Curriculum Case Study: Salespeople, Customers & Orders Lab Schema"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(226, 232, 240)

    # =========================================================================
    # SLIDE 2: Module IV Syllabus Mapping & Foundational PL/SQL Block
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_background(s2, C_SLATE_BG)
    add_slide_header(s2, "Module IV Foundations | CSIT661 Syllabus", "PL/SQL Program Structure & Basic Block", "Procedural extensions to SQL providing variables, control statements, and modularity")

    add_structured_card(s2, 0.8, 1.7, 5.6, 5.2, "Syllabus Context", C_PRIMARY_BLUE, "Module IV Descriptors & Role", [
        ("Amity Syllabus Scope", "Covers PL/SQL Introduction, Basic Block Structure, Control Statements, Exception Handling, Cursors, Procedures, Functions & Triggers."),
        ("Block Structure", "PL/SQL is divided into three sections: Declarative (optional), Executable (mandatory), and Exception handling (optional)."),
        ("Key Advantage", "Combines procedural algorithmic power (IF-THEN, LOOPS) with non-procedural SQL speed inside the database engine."),
        ("Syllabus Schema Context", "Demonstrations use course lab tables: Salespeople(snum, sname, city, comm), Customers(cnum, cname, rating), Orders(onum, amt, snum).")
    ])

    code_b1 = [
        "-- Canonical PL/SQL Basic Block Structure",
        "DECLARE",
        "    -- 1. Declarative Section (Optional)",
        "    -- Memory variables, constants, cursors, custom exceptions",
        "    v_comm Salespeople.commission%TYPE;",
        "BEGIN",
        "    -- 2. Executable Section (Mandatory)",
        "    -- SQL statements, procedural control logic",
        "    SELECT commission INTO v_comm",
        "    FROM Salespeople WHERE snum = 1001;",
        "    ",
        "    -- Control Statement Example",
        "    IF v_comm < 0.15 THEN",
        "        UPDATE Salespeople SET commission = commission + 0.02",
        "        WHERE snum = 1001;",
        "    END IF;",
        "EXCEPTION",
        "    -- 3. Exception Section (Optional)",
        "    -- Traps runtime errors to ensure graceful failure",
        "    WHEN NO_DATA_FOUND THEN",
        "        DBMS_OUTPUT.PUT_LINE('Salesperson record missing.');",
        "END;",
        "/"
    ]
    add_code_panel(s2, 6.7, 1.7, 5.8, 5.2, "Standard PL/SQL Block Architecture", code_b1)

    # =========================================================================
    # SLIDE 3: Team Roadmap & 5-Member Allocation
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_background(s3, C_SLATE_BG)
    add_slide_header(s3, "Team Structure | CSIT661", "5-Member Presentation Roadmap", "Each member takes ownership of one specific syllabus topic with zero overlap")

    agenda_members = [
        ("Member 1", "Stored Procedures", C_PRIMARY_BLUE, [
            ("Core Concept", "Server-side precompiled routines"),
            ("Parameters", "IN, OUT, and IN OUT modes"),
            ("Lab Task 28", "Update Mumbai sales commission")
        ]),
        ("Member 2", "Database Functions", C_TEAL, [
            ("Core Concept", "Mandatory single return value"),
            ("SQL Integration", "Used in SELECT/WHERE queries"),
            ("Matrix", "Procedure vs Function differences")
        ]),
        ("Member 3", "Cursor Concept", C_PURPLE, [
            ("Core Concept", "Context Area pointer mechanism"),
            ("Classification", "Implicit vs Explicit Cursors"),
            ("Lifecycle", "OPEN ➔ FETCH ➔ CLOSE & FOR Loop")
        ]),
        ("Member 4", "Database Triggers", C_AMITY_GOLD, [
            ("Core Concept", "ECA event-driven execution"),
            ("Dimensions", "BEFORE/AFTER & Row vs Statement"),
            ("Correlation", ":OLD and :NEW audit trail")
        ]),
        ("Member 5", "Exception Handling", C_EMERALD, [
            ("Core Concept", "Runtime fault tolerance"),
            ("Types", "Predefined vs User-defined (RAISE)"),
            ("Synthesis", "Full system architecture integration")
        ])
    ]

    card_w = 2.15
    gap = 0.24
    for i, (m_tag, title, col, pts) in enumerate(agenda_members):
        pos_x = 0.8 + i * (card_w + gap)
        add_structured_card(s3, pos_x, 1.7, card_w, 5.2, m_tag, col, title, pts)

    # =========================================================================
    # SLIDE 4: Member 1 - Stored Procedures Architecture
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_background(s4, C_SLATE_BG)
    add_slide_header(s4, "Member 1 | Subprograms", "Stored Procedures: Principles & Parameter Modes", "Named, pre-compiled PL/SQL units stored in the data dictionary for reuse")

    add_structured_card(s4, 0.8, 1.7, 5.6, 5.2, "Architecture & Benefits", C_PRIMARY_BLUE, "Why Stored Procedures?", [
        ("Precompiled Performance", "Compiled once upon creation and stored in executable p-code; eliminates repetitive parsing."),
        ("Network Optimization", "Executes complex multi-query batch logic within the engine, minimizing client-server network hops."),
        ("Access Control & Security", "Allows users to EXECUTE a procedure without granting direct table SELECT or UPDATE privileges."),
        ("Modularity & Maintenance", "Centralizes business rules; any rule modification is done in one place without altering client apps.")
    ])

    add_structured_card(s4, 6.7, 1.7, 5.8, 5.2, "Parameter Modes", C_PURPLE, "IN, OUT, and IN OUT Modes", [
        ("IN Mode (Default)", "Passes read-only values into the procedure; acts as an unchangeable constant inside."),
        ("OUT Mode", "Passes computed values back to the calling environment; uninitialized inside initially."),
        ("IN OUT Mode", "Passes an initial value in, allows modification inside, and returns the modified value back to the caller."),
        ("Invocation Syntax", "Can be invoked using standard SQL*Plus command: EXEC procedure_name(args); or within any PL/SQL block.")
    ])

    # =========================================================================
    # SLIDE 5: Member 1 - Stored Procedure Implementation (Lab Task 28)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_background(s5, C_SLATE_BG)
    add_slide_header(s5, "Member 1 | Lab Practical", "Procedure Implementation: Update Commission (Lab 28)", "Practical syllabus implementation updating salesperson commission with parameter control")

    code_p1 = [
        "-- Lab Task 28: Update commission of Mumbai salespeople",
        "CREATE OR REPLACE PROCEDURE UpdateCityCommission (",
        "    p_city        IN  VARCHAR2,",
        "    p_percent_inc IN  NUMBER,",
        "    p_rows_update OUT NUMBER",
        ") IS",
        "BEGIN",
        "    -- Perform DML directly inside stored procedure",
        "    UPDATE Salespeople",
        "    SET commission = commission * (1 + (p_percent_inc / 100))",
        "    WHERE city = p_city;",
        "    ",
        "    -- SQL%ROWCOUNT captures affected record count",
        "    p_rows_update := SQL%ROWCOUNT;",
        "    ",
        "    COMMIT; -- Explicit transaction boundary",
        "END UpdateCityCommission;",
        "/",
        "",
        "-- How Calling Application Invokes It:",
        "VARIABLE v_count NUMBER;",
        "EXEC UpdateCityCommission('Mumbai', 10, :v_count);",
        "PRINT v_count;"
    ]
    add_code_panel(s5, 0.8, 1.7, 6.2, 5.2, "Procedure: UpdateCityCommission", code_p1)

    add_structured_card(s5, 7.3, 1.7, 5.2, 5.2, "Key Analysis", C_PRIMARY_BLUE, "Execution Breakdown", [
        ("Syllabus Alignment", "Directly fulfills Lab 28: 'Write a PL/SQL program to update commission of salespeople from Mumbai by 10%'."),
        ("Parameter Roles", "p_city and p_percent_inc are IN params; p_rows_update returns affected count via OUT param."),
        ("Transaction Safety", "Includes internal COMMIT to ensure all updates are permanently and safely persisted."),
        ("Transition to Member 2", "'Procedures action perform karte hain, par calculations return karne ke liye Functions aate hain.'")
    ])

    # =========================================================================
    # SLIDE 6: Member 2 - Database Functions
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_background(s6, C_SLATE_BG)
    add_slide_header(s6, "Member 2 | Computations", "Database Functions: Syntax & SQL Integration", "Self-contained subprograms engineered for calculation, requiring a single return value")

    code_f1 = [
        "-- Lab Practical 10: Calculate Commission on Orders",
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
        "    RETURN ROUND(v_comm_amt, 2); -- Mandatory RETURN",
        "END GetOrderCommission;",
        "/",
        "",
        "-- Calling directly inside SQL Queries:",
        "SELECT onum, snum, amt,",
        "       GetOrderCommission(amt, 0.12) AS EarnedCommission",
        "FROM Orders",
        "WHERE amt > 1000;"
    ]
    add_code_panel(s6, 0.8, 1.7, 6.2, 5.2, "Function: GetOrderCommission & Query Usage", code_f1)

    add_structured_card(s6, 7.3, 1.7, 5.2, 5.2, "Core Capabilities", C_TEAL, "Why Use Database Functions?", [
        ("Mandatory RETURN", "Header specifies RETURN data type; body must execute RETURN statement with computed value."),
        ("SQL Query Integration", "Can be plugged into SELECT, WHERE, HAVING, and ORDER BY clauses just like built-in functions."),
        ("Deterministic Functions", "Keyword DETERMINISTIC caches results for identical inputs, saving heavy CPU calculation time."),
        ("Purity Constraints", "When called from SQL queries, functions cannot execute DML statements that alter queried tables.")
    ])

    # =========================================================================
    # SLIDE 7: Member 2 - Procedure vs Function Matrix
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_background(s7, C_SLATE_BG)
    add_slide_header(s7, "Member 2 | Comparison Matrix", "Stored Procedure vs Database Function", "Core architectural comparison frequently tested in Amity end-term exams and vivas")

    table_shape = s7.shapes.add_table(6, 3, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.2))
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
        p.font.size = Pt(12)
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
            p.font.size = Pt(10.5)
            p.font.color.rgb = C_TEXT_MAIN
            if c_idx == 0:
                p.font.bold = True

    # =========================================================================
    # SLIDE 8: Member 3 - Cursor Concept
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_background(s8, C_SLATE_BG)
    add_slide_header(s8, "Member 3 | Data Buffering", "Database Cursors: Context Area & Types", "Bridging the gap between set-oriented SQL and row-oriented procedural execution")

    add_structured_card(s8, 0.8, 1.7, 5.6, 5.2, "Concept & Context Area", C_PURPLE, "What is a Cursor?", [
        ("Context Area Definition", "A private memory area in the SGA allocated by the DB server to execute queries and hold active sets."),
        ("Cursor Definition", "A named pointer or control handle pointing to this context area, allowing row-by-row traversal."),
        ("Why Cursors are Critical", "SQL retrieves entire sets of rows at once, but PL/SQL variables can hold only one row at a time."),
        ("Key Cursor Attributes", "%FOUND (fetch succeeded), %NOTFOUND (no more rows), %ROWCOUNT (rows fetched), %ISOPEN (cursor status).")
    ])

    add_structured_card(s8, 6.7, 1.7, 5.8, 5.2, "Types of Cursors", C_PRIMARY_BLUE, "Implicit vs Explicit Cursors", [
        ("Implicit Cursors", "Created automatically by Oracle for all DML operations (INSERT, UPDATE, DELETE) and single-row SELECT INTO."),
        ("Implicit Attributes", "Accessed via SQL prefix: SQL%FOUND, SQL%NOTFOUND, and SQL%ROWCOUNT."),
        ("Too Many Rows Risk", "If a single-row SELECT INTO matches multiple records, Oracle throws the fatal ORA-01422: TOO_MANY_ROWS."),
        ("Explicit Cursors", "Declared explicitly by developers for multi-row queries; controlled manually through a 4-step lifecycle.")
    ])

    # =========================================================================
    # SLIDE 9: Member 3 - Cursor Lifecycle & Code
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_background(s9, C_SLATE_BG)
    add_slide_header(s9, "Member 3 | Implementation", "Explicit Cursor Lifecycle & Cursor FOR Loops", "Managing cursor memory and iterative record traversal on syllabus tables")

    code_c1 = [
        "-- Explicit Cursor: Iterating high-value Orders",
        "DECLARE",
        "    -- Step 1: DECLARE cursor and memory variables",
        "    CURSOR c_orders IS",
        "        SELECT onum, amt, snum FROM Orders WHERE amt > 2000;",
        "    v_onum Orders.onum%TYPE;",
        "    v_amt  Orders.amt%TYPE;",
        "    v_snum Orders.snum%TYPE;",
        "BEGIN",
        "    -- Step 2: OPEN (Allocates memory & executes query)",
        "    OPEN c_orders;",
        "    LOOP",
        "        -- Step 3: FETCH (Retrieves current row)",
        "        FETCH c_orders INTO v_onum, v_amt, v_snum;",
        "        EXIT WHEN c_orders%NOTFOUND;",
        "        ",
        "        DBMS_OUTPUT.PUT_LINE('Order: ' || v_onum || ' Amt: ' || v_amt);",
        "    END LOOP;",
        "    -- Step 4: CLOSE (Releases context area memory)",
        "    CLOSE c_orders;",
        "END;",
        "/"
    ]
    add_code_panel(s9, 0.8, 1.7, 6.2, 5.2, "Explicit Cursor: 4-Step Lifecycle", code_c1)

    add_structured_card(s9, 7.3, 1.7, 5.2, 5.2, "Modern Best Practice", C_PURPLE, "Cursor FOR Loop Advantage", [
        ("FOR Loop Syntax", "FOR rec IN (SELECT onum, amt FROM Orders) LOOP ... END LOOP;"),
        ("Automatic OPEN", "Cursor opens automatically without an explicit OPEN command."),
        ("Automatic FETCH", "Fetches record into an automatically declared %ROWTYPE variable."),
        ("Automatic CLOSE", "Closes automatically upon loop exit, eliminating memory leaks (ORA-01000: maximum open cursors exceeded).")
    ])

    # =========================================================================
    # SLIDE 10: Member 4 - Database Triggers
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_background(s10, C_SLATE_BG)
    add_slide_header(s10, "Member 4 | Automation", "Database Triggers: Event-Driven Programming", "Autonomous PL/SQL blocks executed automatically in response to database events")

    add_structured_card(s10, 0.8, 1.7, 5.6, 5.2, "The ECA Model", C_AMITY_GOLD, "Architecture of a Trigger", [
        ("The ECA Rule", "Event (INSERT/UPDATE/DELETE), Condition (WHEN clause check), Action (PL/SQL block executed)."),
        ("Implicit Invocation", "Triggers cannot be called manually with EXEC. They execute automatically whenever the event occurs."),
        ("Auditing & Integrity", "Commonly used for transparent audit trails, enforcing complex constraints, and auto-generating primary keys."),
        ("Security Enforcement", "Can prevent illegal operations (e.g., blocking salary updates on weekends or after office hours).")
    ])

    add_structured_card(s10, 6.7, 1.7, 5.8, 5.2, "Dimensions & Qualifiers", C_PRIMARY_BLUE, "Classification & :OLD / :NEW", [
        ("Timing Dimensions", "BEFORE (data validation and sanitization), AFTER (auditing and cascading), INSTEAD OF (used on views)."),
        ("Granularity Levels", "Statement-Level (fires once per statement), Row-Level (FOR EACH ROW: fires for every single modified row)."),
        (":OLD Correlation Record", "Holds column values prior to modification (NULL in INSERT; contains deleted values in DELETE)."),
        (":NEW Correlation Record", "Holds incoming column values (contains inserted values in INSERT; NULL in DELETE).")
    ])

    # =========================================================================
    # SLIDE 11: Member 4 - Trigger Implementation (Audit Trail)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_background(s11, C_SLATE_BG)
    add_slide_header(s11, "Member 4 | Implementation", "Trigger Implementation: Commission Audit Trail", "Tracking commission changes on the Salespeople table using :OLD and :NEW qualifiers")

    code_t1 = [
        "-- Trigger: Log commission changes on Salespeople",
        "CREATE OR REPLACE TRIGGER Trg_AuditSalesCommission",
        "AFTER UPDATE OF commission ON Salespeople",
        "FOR EACH ROW",
        "BEGIN",
        "    -- Audit only when commission value actually changes",
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
    add_code_panel(s11, 0.8, 1.7, 6.2, 5.2, "Trigger: Trg_AuditSalesCommission", code_t1)

    add_structured_card(s11, 7.3, 1.7, 5.2, 5.2, "Technical Analysis", C_AMITY_GOLD, "Execution & Viva Pointers", [
        ("Column Sensitivity", "AFTER UPDATE OF commission restricts firing to only when the commission column is updated."),
        ("Row-Level Granularity", "FOR EACH ROW ensures an audit entry is created for every affected salesperson."),
        ("Mutating Table (ORA-04091)", "Crucial Viva Point: A row-level trigger cannot query or modify the same table undergoing DML."),
        ("Transition to Member 5", "'System me kisi bhi failure ko graceful handle karne ke liye aati hai Exception Handling.'")
    ])

    # =========================================================================
    # SLIDE 12: Member 5 - Exception Handling Fundamentals
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_background(s12, C_SLATE_BG)
    add_slide_header(s12, "Member 5 | Resilience", "Exception Handling: Fault-Tolerance & Taxonomy", "Preventing runtime crashes, ensuring data integrity, and isolating error recovery")

    add_structured_card(s12, 0.8, 1.7, 5.6, 5.2, "Concept & Block Structure", C_EMERALD, "Why Exception Handling?", [
        ("Exception Definition", "A runtime error or abnormal condition encountered during program execution."),
        ("Clean Separation", "Isolates routine business processing from complex error-handling and recovery routines."),
        ("Guaranteed Rollback", "Enables programmatic ROLLBACK to prevent half-finished transactions and dirty database state."),
        ("Structure", "DECLARE (declare variables) ➔ BEGIN (business code) ➔ EXCEPTION (trap faults) ➔ END.")
    ])

    add_structured_card(s12, 6.7, 1.7, 5.8, 5.2, "Taxonomy of Exceptions", C_PURPLE, "Pre-defined vs User-Defined", [
        ("Pre-Defined System Exceptions", "Internally defined by Oracle with predefined names: NO_DATA_FOUND, TOO_MANY_ROWS, ZERO_DIVIDE, DUP_VAL_ON_INDEX."),
        ("User-Defined Exceptions", "Declared explicitly in DECLARE section (e.g., e_comm_exceeded EXCEPTION) and triggered via RAISE keyword."),
        ("WHEN OTHERS Handler", "Universal catch-all exception handler that traps any unexpected system or database error.")
    ])

    # =========================================================================
    # SLIDE 13: Member 5 - Exception Implementation & Diagnostics
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_background(s13, C_SLATE_BG)
    add_slide_header(s13, "Member 5 | Diagnostics", "Exception Implementation & Error Reporting", "Demonstrating predefined error traps, custom business exceptions, and SQLCODE/SQLERRM")

    code_e1 = [
        "-- Enforcing commission threshold with exception handling",
        "DECLARE",
        "    v_comm Salespeople.commission%TYPE;",
        "    e_excess_comm EXCEPTION; -- User-defined exception",
        "BEGIN",
        "    SELECT commission INTO v_comm FROM Salespeople WHERE snum = 1001;",
        "    ",
        "    IF v_comm > 0.25 THEN",
        "        RAISE e_excess_comm; -- Explicit raise",
        "    END IF;",
        "EXCEPTION",
        "    WHEN NO_DATA_FOUND THEN",
        "        DBMS_OUTPUT.PUT_LINE('Error: Salesperson does not exist.');",
        "        ROLLBACK;",
        "    WHEN e_excess_comm THEN",
        "        RAISE_APPLICATION_ERROR(-20002, 'Commission exceeds 25% cap!');",
        "    WHEN OTHERS THEN",
        "        DBMS_OUTPUT.PUT_LINE('Error Code: ' || SQLCODE);",
        "        DBMS_OUTPUT.PUT_LINE('Error Msg : ' || SQLERRM);",
        "        ROLLBACK;",
        "END;",
        "/"
    ]
    add_code_panel(s13, 0.8, 1.7, 6.2, 5.2, "Robust Exception Handling Implementation", code_e1)

    add_structured_card(s13, 7.3, 1.7, 5.2, 5.2, "Diagnostic Utilities", C_EMERALD, "Diagnostic Tools", [
        ("SQLCODE Function", "Returns the numeric error code of the current exception (e.g., -1403 for NO_DATA_FOUND)."),
        ("SQLERRM Function", "Returns the corresponding textual error message explaining the cause of the failure."),
        ("RAISE_APPLICATION_ERROR", "Allows developers to emit custom error codes (-20000 to -20999) with tailored error messages back to the client application."),
        ("Transaction Rollback", "Ensures data integrity by executing ROLLBACK inside exception blocks.")
    ])

    # =========================================================================
    # SLIDE 14: System Integration (Connecting All 5 Topics)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_background(s14, C_SLATE_BG)
    add_slide_header(s14, "Architecture Synthesis | Module IV", "System Integration: How All 5 Pillars Work Together", "End-to-end transaction processing on the Salespeople, Orders, and Customers schema")

    flow_pillars = [
        ("1. Procedure", "Entry Point", C_PRIMARY_BLUE, [
            ("Role", "ProcessSalesBatch"),
            ("Action", "Initiates atomic transaction")
        ]),
        ("2. Cursor", "Batch Buffer", C_PURPLE, [
            ("Role", "c_pending_orders"),
            ("Action", "Iterates orders row-by-row")
        ]),
        ("3. Function", "Calculation", C_TEAL, [
            ("Role", "GetOrderCommission"),
            ("Action", "Calculates net commission")
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
        add_structured_card(s14, pos_x, 1.7, card_w, 5.2, p_tag, col, title, pts)

    # =========================================================================
    # SLIDE 15: Conclusion & Viva Voce Reference Sheet (Dark Theme)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_background(s15, C_NAVY_DARK)

    # Gold Accent Line
    gold_bar15 = s15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(0.12), Inches(5.8))
    gold_bar15.fill.solid()
    gold_bar15.fill.fore_color.rgb = C_AMITY_GOLD
    gold_bar15.line.fill.background()

    tb15 = s15.shapes.add_textbox(Inches(1.15), Inches(0.75), Inches(11.2), Inches(6.0))
    tf15 = tb15.text_frame
    tf15.word_wrap = True

    p = tf15.paragraphs[0]
    p.text = "CSIT661 VIVA VOCE & END-TERM REFERENCE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_AMITY_GOLD
    p.space_after = Pt(8)

    p = tf15.add_paragraph()
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
        ("Q: What is the purpose of SQLCODE and SQLERRM?", "SQLCODE returns the numeric error code; SQLERRM returns the associated textual error description.")
    ]

    for q, a in viva_qa:
        p = tf15.add_paragraph()
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

    output_path = "/Users/ash/Desktop/SmartRecruitmentProject/Amity_CSIT661_PLSQL_5Members_Presentation.pptx"
    prs.save(output_path)
    print("SUCCESS: Zero-overlap Amity Presentation saved at:", output_path)

if __name__ == "__main__":
    build_presentation()
