# Master Instruction Prompt for Claude Code: Shiksha-Style Educational Portal

> **Instructions for User:** Copy and paste the prompt below directly into Claude Code, Cursor, or any coding agent to build the full Shiksha-style educational portal.

---

```markdown
You are tasked with executing a COMPLETE, PRODUCTION-GRADE BUILD of an educational discovery and college admissions portal inspired by Shiksha.com (workspace: `C:\pb projects\Siksha (student data , councelling)\`).

All design specifications, page structures, data models, and text are defined in:
- `C:\pb projects\Siksha (student data , councelling)\SHIKSHA_FULL_SITE_ELEMENT_DICTIONARY.md`
- `C:\pb projects\Siksha (student data , councelling)\SHIKSHA_UIVERSE_COMPONENTS_REFERENCE.md`

---

## 🚨 CRITICAL ARCHITECTURAL RULES (AVOID COMMON FAILURE MODES)

1. **SINGLE UNIFIED DESIGN SYSTEM (`shiksha-style.css`):**
   - You MUST create and use exactly ONE global stylesheet (`shiksha-style.css`) across all pages.
   - Do NOT create separate CSS files per page.
   - All color variables, font tokens, and spacing must live in `:root`.
   - Every single page (`index.html`, `colleges.html`, `college-details.html`, `exams.html`, `compare.html`) MUST share:
     - The identical global navigation header (with responsive mobile drawer).
     - The identical global footer with directory links and lead capture CTA.
     - The exact same color palette, button shapes, and typography.

2. **THE SHIKSHA BRAND PALETTE & TOKENS:**
   - **Primary Brand Orange:** `#ea580c` / `#f97316` (Primary CTA buttons, highlight badges, active tabs).
   - **Deep Trust Navy:** `#0a192f` / `#0f172a` (Header background, primary headings, dark contrast blocks).
   - **Electric Accent Cyan:** `#0284c7` / `#38bdf8` (Links, info badges, verified tags).
   - **Warm Gold:** `#f59e0b` / `#fbbf24` (Ratings, rankings, star icons).
   - **Neutral Light Background:** `#f8fafc` / `#f1f5f9` (Page body, card backgrounds).
   - **Surface White:** `#ffffff` (Card surfaces, modals, table rows).
   - **Border & Line:** `#e2e8f0` / `#cbd5e1`.
   - **Typography:**
     - Headings & Titles: `'Plus Jakarta Sans', -apple-system, sans-serif` (Bold, modern, authoritative).
     - Body Text: `'Inter', -apple-system, sans-serif` (Crisp, highly legible numbers and metrics).

3. **NO GHOST ELEMENTS OR BROKEN MODALS:**
   - Never set elements to `opacity: 0` or `display: none` without guaranteed JS triggers.
   - Modal z-index discipline:
     - Page Content: `z-index: 1-10`
     - Sticky Header & Filter Bars: `z-index: 100`
     - Modal Backdrop: `z-index: 990`
     - Modal Dialog: `z-index: 1000`
     - Floating Counselling CTA: `z-index: 900`
   - Test contrast: Text on `#0f172a` must be crisp `#f8fafc` white; text on light cards must be `#0f172a`.

4. **INTERACTIVE FEATURES REQUIRING VANILLA JAVASCRIPT (`shiksha.js`):**
   - **Global Search:** Real-time filter suggestion dropdown when typing into the hero search input.
   - **Multi-Step Auth/Lead Modal:** Working step transition (Step 1: Phone/OTP -> Step 2: Name/Email -> Step 3: Stream/Degree -> Step 4: Exam/Year -> Success confirmation).
   - **College Details Tabs:** Working tab-switch navigation (Overview, Courses & Fees, Cutoffs, Placements, Reviews) without full page reload.
   - **Faceted Filters (`colleges.html`):** Interactive filter checkboxes and fee-range slider that dynamically show/hide matching college cards.
   - **Compare Bar:** Checkbox on college cards that adds colleges to a sticky floating compare tray at the bottom (max 3 colleges).

---

## 📄 COMPLETE PAGE SPECIFICATIONS TO BUILD

### 1. `index.html` (Homepage)
- **Top Notification Bar:** Live exam alerts and counseling dates ticker.
- **Global Sticky Header:** Logo, Stream mega-menus (MBA, B.Tech, Medical, Design, Law, Abroad), City selector, Search bar trigger, "Ask a Question", and "Login / Register" button.
- **Hero Omnisearch Section:** Headline ("Find Top Colleges, Courses & Exams in India"), search bar with animated stream chips, and quick statistic badges (25,000+ Colleges, 1,500+ Exams, 1M+ Reviews).
- **Stream Category Grid:** 8 visual cards (Engineering, Management, Medical, Design, Science, Law, Animation, Commerce) displaying college counts and average package.
- **Featured Universities (NIRF Tier-1):** High-impact cards with NIRF rank, approval seals, fees, average CTC, "Download Brochure" button, and "Compare" toggle.
- **Upcoming Entrance Exams Hub:** Table/card matrix showing registration deadlines, exam dates, and countdown timers.
- **Verified Student Review Highlights:** Carousel of review cards featuring student avatar, verified college badge, rating breakdown, and pros/cons pills.
- **Expert Counselling Lead Banner:** High-converting banner with phone input and "Get Free Counselling" CTA.

### 2. `colleges.html` (Faceted Search & Directory)
- **Breadcrumb Navigation:** `Home > Colleges in India > Top Engineering Colleges`.
- **Active Filters Bar:** Chip tags with 'clear all' and result count counter ("Showing 1,240 Colleges").
- **Left Filter Sidebar:**
  - Search by Name/Keyword.
  - State & City multi-select (Delhi NCR, Bengaluru, Mumbai, Pune, Chennai).
  - Degree Level (B.Tech, M.Tech, MBA, MBBS).
  - Total Tuition Fees Slider (₹50k to ₹25 Lakhs+).
  - Ownership (Government, Private, Deemed).
  - Entrance Exams Accepted (JEE Main, CAT, GATE, BITSAT).
  - NIRF Ranking Tier (<50, <100, <200).
- **Main Listings Column:** Rich college summary cards with logo, photos, NAAC/NIRF badges, course tabular preview, placement highlights (Highest & Average CTC), "Apply Now" button, and "Download Brochure" modal trigger.

### 3. `college-details.html` (Comprehensive Single College Profile)
- **College Hero Banner:** Campus cover photo, official crest, NIRF Rank #1 badge, location, accreditation badges (NAAC A++, AICTE, UGC), and key action buttons.
- **Sticky Secondary Tab Bar:**
  1. **Overview:** About the university, campus area, student strength, highlights matrix.
  2. **Courses & Fees:** Interactive table listing all degrees, duration, annual tuition fee, and eligibility.
  3. **Cutoffs:** Year-on-year round cutoffs for general, OBC, SC, and ST categories.
  4. **Placements:** Highest domestic/international packages, average package, top recruiters logos (Microsoft, Google, Amazon, TCS).
  5. **Admissions:** Step-by-step admission roadmap, accepted exams, and important deadlines.
  6. **Reviews:** Rating breakdown out of 5.0 (Infrastructure, Faculty, Placements, Campus Life) with authentic student comments.

### 4. `exams.html` (Entrance Exams Directory)
- **Exam Calendar:** Filter by month and stream (Engineering, Management, Medical).
- **Exam Summary Cards:** Exam name (e.g., JEE Main 2026, CAT 2026), conducting body (NTA, IIMs), frequency, mode (CBT), application end date, exam date, and "Check Syllabus" / "Apply" links.

### 5. `compare.html` (Multi-College Comparison Matrix)
- **Comparison Grid:** Side-by-side evaluation of up to 4 selected institutions across:
  - Overall Rank & Accreditation.
  - Established Year & Campus Size.
  - Flagship Course & Total Tuition Fees.
  - Average Placement CTC & Highest Package.
  - Accepted Entrance Exams.
  - Student Rating Score.

---

## 🧩 INTEGRATE THE 5 CUSTOM UIVERSE COMPONENTS:
Reference `C:\pb projects\capsoft\SHIKSHA_UIVERSE_COMPONENTS_REFERENCE.md` for exact HTML & CSS:
1. **Omnisearch Hero Bar (`shiksha-search-bar`):** Hero section of `index.html`.
2. **Multi-Step Lead & Auth Modal (`shiksha-auth-modal`):** Used whenever user clicks "Login", "Download Brochure", or "Apply Now".
3. **Interactive College Comparison Card (`shiksha-college-card`):** Listing cards in `colleges.html`.
4. **Verified Student Rating & Review Card (`shiksha-review-card`):** Review section on `index.html` and `college-details.html`.
5. **Sticky Floating Counselling Action Bar (`shiksha-sticky-counsel`):** Bottom-right floating dialer on every page.

---

## 🚀 EXECUTION ORDER FOR CODING AGENT:
1. Create `shiksha-style.css` containing all tokens, resets, typography, and component styling.
2. Create `shiksha.js` for modal logic, tab switching, and faceted filtering.
3. Build `index.html` (Homepage).
4. Build `colleges.html` (Search & Filter Directory).
5. Build `college-details.html` (College Profile).
6. Build `exams.html` and `compare.html`.
7. Verify all internal navigation links, modal popups, and responsive views on mobile (375px) and desktop (1440px).
```
