# Shiksha-Style Educational Discovery Portal — Full Site & Element Dictionary

> **Target Directory / Workspace:** `C:\pb projects\Siksha (student data , councelling)\`  
> **Master Reference & Prompt:** `C:\pb projects\Siksha (student data , councelling)\SHIKSHA_MASTER_PROMPT.md`  
> **UI Components Library:** `C:\pb projects\Siksha (student data , councelling)\SHIKSHA_UIVERSE_COMPONENTS_REFERENCE.md`

---

## 🎨 Design System & Visual Tokens

* **Brand Colors:**
  * **Primary Action Orange:** `#ea580c` (Hover: `#c2410c`, Light Tint: `#fff7ed`) — Used for primary CTAs ("Apply Now", "Download Brochure", "Search").
  * **Deep Trust Navy:** `#0a192f` / `#0f172a` (Card Dark: `#1e293b`) — Used for headers, bold typography, and dark cards.
  * **Accent Sky Blue:** `#0284c7` (Light Tint: `#f0f9ff`) — Used for verified tags, accreditation pills, and exam links.
  * **Gold / Amber:** `#f59e0b` / `#fbbf24` (Background: `#fefce8`) — Used for star ratings, NIRF badges, and rank banners.
  * **Success Green:** `#16a34a` (Light: `#f0fdf4`) — Used for placement statistics and positive reviews.
  * **Neutral Background:** `#f8fafc` (Off-white / Slate-50) — Used for page body.
  * **Card Surface White:** `#ffffff` — Crisp white cards with 1px border `#e2e8f0` and soft elevation.
* **Typography:**
  * **Primary Headings:** `'Plus Jakarta Sans', -apple-system, sans-serif` (Weights: 600 Semi-Bold, 700 Bold, 800 Extra-Bold).
  * **Body & Numerical Data:** `'Inter', -apple-system, sans-serif` (Weights: 400 Regular, 500 Medium, 600 Semi-Bold).
* **Corner Radii:**
  * Buttons: `8px` (Standard) or `50px` (Pill search chips).
  * Cards: `16px` with subtle hover translateY(`-4px`) and `box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.08)`.
  * Modals: `20px` border-radius.

---

## 🔐 SECTION 0: AUTHENTICATION & STUDENT LEAD ONBOARDING FUNNEL

This modal is triggered whenever a user clicks **"Login / Register"**, **"Download Brochure"**, **"Predict My College"**, or **"Apply Now"**. It captures high-intent student leads while authenticating user accounts.

```
+-----------------------------------------------------------------------+
|  Get Free College Counselling & Download Official Brochure        [X] |
|  Step [1] --- [2] --- [3] --- [4]                                     |
+-----------------------------------------------------------------------+
|  [Step Content: Phone OTP / Profile / Degree Intent / Consent]        |
|                                                                       |
|  [ Back ]                                            [ Continue -> ]  |
+-----------------------------------------------------------------------+
```

### Step 1: Mobile & Identity Verification
* **Heading:** "Sign In / Register for Free Admissions Guidance"
* **Subheading:** "Join 2.5 Million+ Students Shortlisting Top Colleges in India"
* **Social Auth Buttons:**
  * `[ Google Sign In ]` (OAuth 2.0 trigger)
  * `[ Facebook Sign In ]`
* **Divider:** "— OR Continue with Mobile —"
* **Input Field 1 (Country Code & Mobile Number):**
  * Type: `tel`, Name: `phone_number`
  * Prefix: `🇮🇳 +91` (Fixed country code)
  * Placeholder: `Enter 10-digit mobile number`
  * Validation: 10 numeric digits (`^[6-9]\d{9}$`)
* **Primary Action:** `[ Send OTP ]` (Orange Button, Full Width)
* **OTP Verification Sub-View (Appears after Send OTP):**
  * Subtext: "Enter 4-digit code sent to +91 XXXXX X1234. [Edit Number]"
  * Inputs: 4 individual digit boxes (`maxlength="1"`) with auto-advance focus.
  * Resend Action: "Resend OTP in 0:28s" (Timer updates via JS).
  * Verify Action: `[ Verify & Proceed ]`

### Step 2: Personal Profile Details
* **Heading:** "Tell us a bit about yourself"
* **Input Field 1 (Full Name):**
  * Type: `text`, Name: `full_name`
  * Placeholder: `Enter your full legal name`
* **Input Field 2 (Email Address):**
  * Type: `email`, Name: `email`
  * Placeholder: `name@example.com` (Used for brochure delivery and admission alerts)
* **Input Field 3 (Current City):**
  * Type: `text`, Name: `current_city`
  * Placeholder: `e.g. New Delhi, Bengaluru, Pune, Lucknow`

### Step 3: Current Academic Status & Target Stream
* **Heading:** "What is your current academic level?"
* **Radio Pill Selector 1 (Academic Level):**
  * `( ) 12th Class (Appearing / Passed)`
  * `( ) Undergraduate Student / Graduate`
  * `( ) Working Professional`
  * `( ) 10th Class (Diploma Aspirant)`
* **Radio Card Grid (Target Stream):**
  * Card 1: `⚙️ Engineering & Technology (B.Tech / M.Tech)`
  * Card 2: `📊 Management & Business (MBA / BBA)`
  * Card 3: `🩺 Medicine & Health Sciences (MBBS / BDS / Pharmacy)`
  * Card 4: `🎨 Design, Media & Architecture (B.Des / B.Arch)`
  * Card 5: `⚖️ Law & Legal Studies (BA LLB / LLM)`
  * Card 6: `💻 Computer Applications (BCA / MCA)`
* **Dropdown (Target Degree):**
  * Select target degree dynamically based on selected stream (e.g., Selecting Engineering gives B.Tech, M.Tech, Diploma; Selecting Management gives MBA, PGDM, BBA, Executive MBA).

### Step 4: Target Exams & Admission Timeline
* **Heading:** "Which entrance exams are you preparing for?"
* **Multi-Select Checkbox Pills:**
  * Engineering: `[x] JEE Main`, `[ ] JEE Advanced`, `[ ] BITSAT`, `[ ] VITEEE`, `[ ] MHT CET`
  * Management: `[x] CAT`, `[ ] XAT`, `[ ] MAT`, `[ ] CMAT`, `[ ] SNAP`, `[ ] NMAT`
  * Medical: `[x] NEET UG`, `[ ] NEET PG`
* **Dropdown (Target Admission Year):**
  * Options: `2026`, `2027`, `2028`
* **Optional Input (Expected / Actual Score / Percentile):**
  * Type: `number`, Placeholder: `e.g. 94.5 Percentile or 180 Marks`

### Step 5: Terms, Privacy & Counselling Consent
* **Explicit Lead Consent Checkbox 1:**
  * `[x] I agree to the Terms of Use and Privacy Policy.`
* **Explicit Lead Consent Checkbox 2 (Core Business Model):**
  * `[x] I authorize Shiksha and partner universities to contact me via Call, SMS, Email, and WhatsApp regarding admissions, fee discounts, and counselling.`
* **Final Action Button:** `[ Complete Registration & Get Brochure ]`

---

## 🌐 SECTION 1: GLOBAL HEADER & NAVIGATION (`<header>`)

* **Top Micro-Utility Bar (`#top-bar`):**
  * Left: `🔥 Trending: JEE Main 2026 Session 2 Dates Announced | CAT 2026 Cutoff Calculator Live`
  * Right:
    * `🌐 Select Language: English (EN) | हिन्दी (HI)`
    * `📱 Download App Badge`
    * `❓ Ask a Question / Forum`
* **Main Sticky Navigation Bar (`#main-nav`):**
  * **Brand Logo:** `🎓 ShikshaPortal` (Bold Orange `#ea580c` graduation cap icon with modern typography).
  * **Mega-Menu Dropdowns:**
    * **MBA:** Top MBA Colleges, MBA Exams (CAT, XAT, MAT), Online MBA, Executive MBA, Cutoff Predictor.
    * **B.Tech:** Top IITs/NITs, JEE Main College Predictor, Private Engineering Colleges, Branch Comparison.
    * **Medical:** NEET Cutoffs, Top MBBS Colleges, Dental/Pharmacy Courses, AIIMS Ranking.
    * **Design:** NIFT/NID Preparation, Fashion Design Colleges, Interior Design.
    * **Study Abroad:** USA, UK, Canada, Australia, Germany, IELTS/TOEFL Prep, GRE/GMAT.
  * **Location City Selector:** `📍 New Delhi v` (Dropdown to select Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Kolkata).
  * **Global Search Quick Trigger:** Search input with icon `🔍 Search colleges, exams, courses...`
  * **Right CTA Stack:**
    * Button (Ghost): `[ Write a Review ]`
    * Button (Primary Orange): `[ Login / Register ]` (Triggers Section 0 Modal).

---

## 🏠 SECTION 2: HOMEPAGE (`index.html`)

### 2.1 Hero Omnisearch Section
* **Badge:** `⚡ India's #1 College Search & Career Decision Platform`
* **Main Heading (H1):** "Discover Your Dream College, Course & Career Path"
* **Subheading (P):** "Compare 25,000+ accredited universities, check authentic cutoffs, and get personalized admission counselling."
* **Interactive Omnisearch Input (Reference UI Component #1):**
  * Stream Selector Pills above input: `[ All ] [ Engineering ] [ Management ] [ Medical ] [ Design ] [ Law ] [ Abroad ]`
  * Input: `Search by college name, entrance exam (JEE, CAT), or degree (B.Tech, MBA)...`
  * Search Button: `[ 🔍 Search 25,000+ Colleges ]`
* **Live Suggestion Dropdown (Simulated in `shiksha.js`):**
  * Category 1: Top Institutions (IIT Bombay, IIM Ahmedabad, AIIMS Delhi, BITS Pilani).
  * Category 2: Popular Exams (JEE Main, CAT 2026, NEET UG).
  * Category 3: High-demand Degrees (Computer Science B.Tech, MBA Marketing).
* **Metric Counter Bar:**
  * `25,000+` Colleges Listed
  * `1,500+` Entrance Exams
  * `1.2M+` Student Reviews
  * `50,000+` Courses Analyzed

### 2.2 Popular Streams Exploration Grid
Grid of 8 high-impact cards with icon, title, college count, and average course fees:
1. **Engineering (B.Tech / M.Tech):** `5,420 Colleges` | Avg. Fee: ₹1.8L - ₹4.5L/yr | Top Exam: JEE Main
2. **Management (MBA / PGDM):** `6,890 Colleges` | Avg. Fee: ₹3.5L - ₹12L/yr | Top Exam: CAT, XAT
3. **Medical & Health (MBBS / BDS):** `2,130 Colleges` | Avg. Fee: ₹50k - ₹18L/yr | Top Exam: NEET UG
4. **Computer Applications (BCA / MCA):** `3,450 Colleges` | Avg. Fee: ₹80k - ₹2.2L/yr | Top Exam: NIMCET
5. **Design & Architecture (B.Des / B.Arch):** `1,280 Colleges` | Avg. Fee: ₹1.5L - ₹4L/yr | Top Exam: NIFT, NATA
6. **Law & Legal Studies (BA LLB / LLM):** `1,940 Colleges` | Avg. Fee: ₹1.2L - ₹3.5L/yr | Top Exam: CLAT
7. **Hospitality & Hotel Mgmt (BHM):** `950 Colleges` | Avg. Fee: ₹90k - ₹2.5L/yr | Top Exam: NCHMCT JEE
8. **Study Abroad (MS / MBA):** `15,000+ Global Universities` | USA, UK, Canada, Australia

### 2.3 Featured NIRF Tier-1 Universities (Card Carousel)
Each card features:
* College thumbnail photo (`280px x 160px`).
* Official college crest logo.
* **Badges:** `NIRF #1 Overall` | `NAAC A++` | `Public / Institute of National Importance`.
* **Title:** "Indian Institute of Technology, Madras (IIT Madras)"
* **Location:** `📍 Chennai, Tamil Nadu`
* **Key Metrics Grid:**
  * Flagship Course: `B.Tech Computer Science`
  * 1st Year Tuition Fees: `₹2,14,000`
  * Avg. Placement Package: `₹21.48 LPA` (Highest: `₹1.31 Crore`)
  * Student Rating: `⭐ 4.8 / 5.0 (540 Verified Reviews)`
* **Action Buttons:**
  * Button 1 (Ghost): `[ + Add to Compare ]`
  * Button 2 (Outline): `[ Download Brochure ]` (Triggers lead modal)
  * Button 3 (Primary Orange): `[ View Details -> ]`

### 2.4 Upcoming Entrance Exams & Admission Alerts
Tabular schedule matrix:
* **Headers:** Exam Name | Conducting Body | Registration Window | Exam Date | Action
* Row 1: `JEE Main 2026 (Session 2)` | NTA | Nov 1 - Dec 4, 2025 | April 4 - 15, 2026 | `[ Apply Now ]`
* Row 2: `CAT 2026` | IIMs | Aug 2 - Sep 13, 2026 | Nov 29, 2026 | `[ Exam Guide ]`
* Row 3: `NEET UG 2026` | NTA | Feb 9 - Mar 16, 2026 | May 3, 2026 | `[ Syllabus ]`
* Row 4: `GATE 2026` | IIT Roorkee | Aug 28 - Oct 5, 2025 | Feb 7 - 15, 2026 | `[ Cutoff Predictor ]`

### 2.5 Authentic Student Reviews & Campus Experiences
* **Section Title:** "What Real Students Say About Their Campus"
* 3 Detailed Review Cards (Reference UI Component #4):
  * Student Name, Program (`B.Tech CSE, 3rd Year`), Campus Name.
  * Verified Enrollment Badge.
  * Rating Breakdown: Faculty: `4.5/5`, Infrastructure: `4.8/5`, Placements: `4.6/5`, Hostel/Life: `4.0/5`.
  * "Pros": `World-class lab facilities, high placement percentage (95%+), active coding clubs.`
  * "Cons": `Strict attendance rules (75% mandatory), hectic semester timetable.`

### 2.6 Free Expert Counselling Lead Magnet Banner
* Full-width high-contrast dark navy `#0f172a` banner with warm orange gradient accents.
* **Headline:** "Confused About Which College or Career to Choose?"
* **Subheading:** "Speak to our certified career mentors. Get unbiased college suggestions based on your budget, rank, and preferred location."
* **Inline Form:**
  * Input 1: `Your Name`
  * Input 2: `Mobile Number`
  * Dropdown: `Target Course (e.g. B.Tech / MBA)`
  * Submit CTA: `[ Request Free Callback ]`

---

## 🔍 SECTION 3: COLLEGE SEARCH & FACETED DIRECTORY (`colleges.html`)

### 3.1 Top Filter & Breadcrumb Bar
* Breadcrumbs: `Home > Colleges > Engineering > Top B.Tech Colleges in India`
* Active Filter Chips: `[ Engineering (B.Tech) ✕ ] [ Govt Colleges ✕ ] [ Fees < ₹10 Lakhs ✕ ] [ Reset All ]`
* Results Summary: `Showing 1,248 Engineering Colleges in India`
* Sort Dropdown: `Sort by: NIRF Rank (High to Low) v` (Options: Highest Package, Total Fees Low to High, Student Rating).

### 3.2 Left Faceted Filter Sidebar
1. **Search College by Name:** Input with instant text filter.
2. **Location Filters:**
   * Popular States: `[ ] Maharashtra (184)`, `[ ] Tamil Nadu (142)`, `[ ] Karnataka (128)`, `[ ] Uttar Pradesh (96)`, `[ ] Delhi NCR (84)`.
   * Major Hubs: `[ ] Bengaluru`, `[ ] Pune`, `[ ] Chennai`, `[ ] Hyderabad`, `[ ] Mumbai`.
3. **Degree Level:**
   * `[x] Undergraduate (B.Tech / B.E / B.Sc)`
   * `[ ] Postgraduate (M.Tech / M.E / MS)`
   * `[ ] Integrated / Dual Degree`
4. **Total Tuition Fees Range (Slider):**
   * Min: `₹50,000` | Max: `₹30,00,000+`
   * Quick Buckets: `< ₹2 Lakhs`, `₹2L - ₹5L`, `₹5L - ₹10L`, `> ₹10 Lakhs`.
5. **Institute Ownership / Type:**
   * `[x] Public / Government (IITs, NITs, IIITs)`
   * `[ ] Private Autonomous`
   * `[ ] Deemed-to-be University`
6. **Accepted Entrance Exams:**
   * `[x] JEE Main`, `[ ] JEE Advanced`, `[ ] BITSAT`, `[ ] MHT CET`, `[ ] KCET`, `[ ] WBJEE`.
7. **Accreditation & Ranking:**
   * `[x] NIRF Top 50`, `[ ] NIRF Top 100`, `[ ] NAAC A++ / A+`.

### 3.3 College Cards Listing
Each item in the listing contains:
* **Header Row:** College Logo, Full Official Name, Location, Affiliation Tag.
* **Badges:** `Ranked #1 by NIRF 2025` | `Autonomous` | `AICTE Approved`.
* **Middle Metrics Grid (3 Columns):**
  * Column 1: **Total Course Fee:** `₹8.58 Lakhs` (for 4 Years B.Tech).
  * Column 2: **Placement Record:** `₹21.4 LPA` Avg Package (`₹1.3 Cr` Highest).
  * Column 3: **Cutoff Benchmark:** `JEE Main 2025 Closing Rank: 412 (CSE)`.
* **Action Footer:**
  * `[ ] Add to Compare` (Checkbox syncing with bottom comparison dock).
  * `[ View Cutoffs ]` (Anchor link to cutoff tab).
  * `[ Download Brochure ]` (Ghost Button).
  * `[ Apply Now ]` (Solid Orange Button).

---

## 🏛️ SECTION 4: COLLEGE DETAILS PROFILE (`college-details.html`)

### 4.1 Master Hero Header
* **Cover Banner:** High-res campus landscape photo (`1200px x 320px`).
* **Profile Card Overlay:**
  * University Crest (`100px x 100px`).
  * Name: **Indian Institute of Technology, Delhi (IIT Delhi)**
  * Location: `Hauz Khas, New Delhi | Established 1961 | Public / Institute of National Importance`
  * Rating: `⭐ 4.8 / 5 (682 Reviews) | NAAC A++ | NIRF Engineering 2025: Rank #2`
  * Quick CTAs: `[ ❤️ Shortlist ]` | `[ 📤 Share ]` | `[ Download Brochure ]` | `[ Check Eligibility ]`

### 4.2 Secondary Sticky Tab Navigation Bar
Tabs switch content dynamically without page refresh:
* `[ 1. Overview ]` (Default active)
* `[ 2. Courses & Fees ]`
* `[ 3. Cutoff Ranks ]`
* `[ 4. Placements & CTC ]`
* `[ 5. Admission Process ]`
* `[ 6. Student Reviews ]`
* `[ 7. Campus Infrastructure ]`

### 4.3 Tab 1 Content: Overview
* **About Text:** Detailed writeup covering historical background, 320-acre lush campus in South Delhi, research patents, and faculty credentials.
* **Key Institutional Highlights Table:**
  * Total Faculty Count: `650+` (100% PhD holders).
  * Student Body: `11,000+` (UG, PG, Doctoral).
  * Campus Facilities: 18 Hostels, Hospital, Sports Complex, Central Library (300,000+ volumes).
  * Global Partnerships: MOUs with 120+ International Universities.

### 4.4 Tab 2 Content: Courses & Fees
Interactive tabular breakdown of all offerings:
* Filter by: `All | B.Tech | M.Tech | MBA | M.Sc | Ph.D`
* **Table Columns:** Course Name | Duration | 1st Year Fees | Eligibility & Entrance Exam | Action
  * Row 1: `B.Tech Computer Science & Engineering` | 4 Years | ₹2,28,000 | 10+2 with 75% + JEE Advanced | `[ Course Details ]`
  * Row 2: `B.Tech Electrical Engineering` | 4 Years | ₹2,28,000 | 10+2 with 75% + JEE Advanced | `[ Course Details ]`
  * Row 3: `MBA (Department of Management Studies)` | 2 Years | ₹5,50,000 | Graduate with 60% + CAT Score | `[ Apply Now ]`
  * Row 4: `M.Tech Machine Intelligence` | 2 Years | ₹1,15,000 | B.Tech/B.E + Valid GATE Score | `[ Syllabus ]`

### 4.5 Tab 3 Content: Cutoff Ranks (JEE Advanced / CAT)
* Year Selector: `[ 2025 ] [ 2024 ] [ 2023 ]`
* Category Selector: `[ General ] [ OBC-NCL ] [ SC ] [ ST ] [ EWS ]`
* **Cutoff Table:**
  * CSE: Opening Rank `32` | Closing Rank `116`
  * Electrical Engineering: Opening Rank `120` | Closing Rank `568`
  * Mathematics & Computing: Opening Rank `145` | Closing Rank `320`
  * Mechanical Engineering: Opening Rank `840` | Closing Rank `1,745`

### 4.6 Tab 4 Content: Placements & Salary Records
* **Key Statistics Banner:**
  * Highest International CTC: `₹2.05 Crore / annum`
  * Highest Domestic CTC: `₹1.25 Crore / annum`
  * Average CTC (Overall): `₹25.82 LPA`
  * Average CTC (Computer Science): `₹42.50 LPA`
  * Total Offers Extended: `1,300+` (including 260+ PPOs)
* **Top Hiring Partners Logo Grid:** Microsoft, Google, Apple, Goldman Sachs, Texas Instruments, McKinsey & Co, Qualcomm, Amazon, NVIDIA.

---

## ⚖️ SECTION 5: MULTI-COLLEGE COMPARISON MATRIX (`compare.html`)

Allows students to compare up to 3 institutions side-by-side:
* **Slot 1 (Pre-selected):** `IIT Delhi`
* **Slot 2 (Pre-selected):** `IIT Bombay`
* **Slot 3:** `[ + Add College to Compare ]` (Search dropdown to add)
* **Comparison Metric Rows:**
  1. **NIRF Ranking:** Rank #2 vs Rank #3
  2. **Location:** New Delhi vs Mumbai (Powai)
  3. **Total B.Tech Tuition Fee:** ₹8.58 Lakhs vs ₹8.92 Lakhs
  4. **Average Placement Package:** ₹25.82 LPA vs ₹23.50 LPA
  5. **Campus Size:** 320 Acres vs 550 Acres
  6. **Flagship Cutoff (CSE Closing):** Rank 116 vs Rank 67
  7. **Student Rating:** 4.8 / 5 vs 4.9 / 5
  8. **Action:** `[ Download Brochure ]` on both columns.

---

## 🦶 SECTION 6: GLOBAL FOOTER (`<footer>`)

* **Column 1 (Top MBA Colleges):** MBA Colleges in Delhi, MBA in Mumbai, MBA in Bengaluru, IIMs in India, Executive MBA Colleges.
* **Column 2 (Top Engineering Colleges):** B.Tech Colleges in Pune, Engineering in Chennai, Top IITs, Top NITs, B.Tech CSE Colleges.
* **Column 3 (Top Exams):** JEE Main 2026, JEE Advanced, CAT 2026, GATE, NEET UG, CLAT, NIFT Entrance, BITSAT.
* **Column 4 (Company & Legal):** About Us, Contact Us, Privacy Policy, Terms & Conditions, Grievance Officer, Careers, Advertise With Us.
* **Bottom Disclaimer & Copyright:**
  `© 2026 Educational Discovery Network. All trademarks and brand names belong to their respective institutions. The platform provides independent admissions research and career counselling services.`
