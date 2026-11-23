# Shiksha Portal — UI Components & Code Reference Guide

> This file contains the complete, battle-tested HTML and CSS code for the 5 custom high-converting components designed specifically for the educational discovery portal, fully themed with the **Deep Navy & Action Orange** palette.

---

## 1. Omnisearch Hero Bar with Animated Stream Chips
**Used For:** Hero search section on `index.html`.  
**Visual Description:** An ultra-modern search container featuring active category pills (Engineering, MBA, Medical, etc.) that glide horizontally, an input bar with an animated search icon, and a floating dropdown menu showing instantaneous autocomplete suggestions with category badges.

### HTML:
```html
<!-- Omnisearch Component -->
<div class="shiksha-search-wrapper">
  <!-- Stream Selection Chips -->
  <div class="stream-chips-bar" id="streamChips">
    <button class="chip-btn active" data-stream="all">All Disciplines</button>
    <button class="chip-btn" data-stream="btech">⚙️ B.Tech / Engg</button>
    <button class="chip-btn" data-stream="mba">📊 MBA / Business</button>
    <button class="chip-btn" data-stream="medical">🩺 Medical / MBBS</button>
    <button class="chip-btn" data-stream="design">🎨 Design</button>
    <button class="chip-btn" data-stream="law">⚖️ Law</button>
    <button class="chip-btn" data-stream="abroad">✈️ Study Abroad</button>
  </div>

  <!-- Search Input Bar -->
  <div class="omni-search-box">
    <div class="search-icon-box">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
    <input 
      type="text" 
      class="omni-input" 
      id="mainSearchInput" 
      placeholder="Search 25,000+ Colleges, Courses (e.g. B.Tech, MBA), or Exams (JEE, CAT)..." 
      autocomplete="off"
    >
    <button class="omni-submit-btn">
      <span>Search Colleges</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>

    <!-- Autocomplete Dropdown Preview -->
    <div class="search-autocomplete-dropdown" id="searchDropdown">
      <div class="dropdown-group-title">POPULAR INSTITUTES</div>
      <a href="college-details.html" class="dropdown-item">
        <span class="item-badge badge-engg">IIT</span>
        <span class="item-text">Indian Institute of Technology, Madras (IIT Madras)</span>
        <span class="item-loc">Chennai, TN</span>
      </a>
      <a href="college-details.html" class="dropdown-item">
        <span class="item-badge badge-engg">IIT</span>
        <span class="item-text">Indian Institute of Technology, Delhi (IIT Delhi)</span>
        <span class="item-loc">New Delhi</span>
      </a>
      <a href="college-details.html" class="dropdown-item">
        <span class="item-badge badge-mba">IIM</span>
        <span class="item-text">Indian Institute of Management, Ahmedabad (IIM-A)</span>
        <span class="item-loc">Ahmedabad, GJ</span>
      </a>

      <div class="dropdown-group-title">TRENDING EXAMS</div>
      <a href="exams.html" class="dropdown-item">
        <span class="item-badge badge-exam">EXAM</span>
        <span class="item-text">JEE Main 2026 — Registration & Dates</span>
        <span class="item-loc">NTA</span>
      </a>
      <a href="exams.html" class="dropdown-item">
        <span class="item-badge badge-exam">EXAM</span>
        <span class="item-text">CAT 2026 — Eligibility, Pattern & Syllabus</span>
        <span class="item-loc">IIMs</span>
      </a>
    </div>
  </div>
</div>
```

### CSS:
```css
.shiksha-search-wrapper {
  max-width: 880px;
  margin: 0 auto;
  position: relative;
  z-index: 50;
}

.stream-chips-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: none;
}
.stream-chips-bar::-webkit-scrollbar { display: none; }

.chip-btn {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}
.chip-btn:hover {
  background: #ffffff;
  border-color: #ea580c;
  color: #ea580c;
  transform: translateY(-2px);
}
.chip-btn.active {
  background: #ea580c;
  border-color: #ea580c;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
}

.omni-search-box {
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 20px;
  box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.15), 0 0 0 1px #e2e8f0;
  position: relative;
}

.search-icon-box {
  color: #ea580c;
  display: flex;
  align-items: center;
  margin-right: 14px;
}

.omni-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #0f172a;
  font-family: inherit;
  font-weight: 500;
}
.omni-input::placeholder { color: #94a3b8; font-weight: 400; }

.omni-submit-btn {
  background: linear-gradient(135deg, #ea580c, #f97316);
  color: #ffffff;
  border: none;
  outline: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}
.omni-submit-btn:hover {
  background: linear-gradient(135deg, #c2410c, #ea580c);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4);
}

.search-autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18), 0 0 0 1px #e2e8f0;
  padding: 12px;
  display: none; /* toggled with .active via JS */
  z-index: 100;
}
.search-autocomplete-dropdown.active { display: block; }

.dropdown-group-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #64748b;
  padding: 8px 12px 4px;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease;
}
.dropdown-item:hover { background: #f8fafc; color: #ea580c; }
.item-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}
.badge-engg { background: #e0f2fe; color: #0284c7; }
.badge-mba { background: #fef3c7; color: #d97706; }
.badge-exam { background: #ffedd5; color: #ea580c; }
.item-loc { margin-left: auto; font-size: 12px; color: #94a3b8; }
```

---

## 2. Multi-Step Lead Capture & Auth Modal with OTP Verification
**Used For:** User login, "Download Brochure", and "Apply Now" buttons.  
**Visual Description:** High-converting floating modal with animated progress indicators, phone OTP verification with 4 auto-focused digit boxes, academic intent selection, and lead consent checkboxes.

### HTML:
```html
<div class="shiksha-modal-overlay" id="leadModal">
  <div class="shiksha-modal-container">
    <!-- Close Button -->
    <button class="modal-close-btn" id="closeModalBtn">&times;</button>

    <!-- Header & Step Tracker -->
    <div class="modal-header">
      <div class="modal-badge">ADMISSION GUIDANCE 2026</div>
      <h3 class="modal-title" id="modalStepTitle">Verify Mobile to Download Brochure</h3>
      <p class="modal-sub" id="modalStepSub">Get direct college cutoff comparisons and official PDF.</p>
      
      <!-- Step Dots -->
      <div class="step-progress-bar">
        <span class="step-dot active" data-step="1">1</span>
        <span class="step-line"></span>
        <span class="step-dot" data-step="2">2</span>
        <span class="step-line"></span>
        <span class="step-dot" data-step="3">3</span>
      </div>
    </div>

    <!-- Step 1: Mobile & OTP -->
    <div class="modal-step-pane active" id="modalStep1">
      <div class="form-group">
        <label class="form-label">Mobile Number</label>
        <div class="phone-input-row">
          <span class="phone-prefix">🇮🇳 +91</span>
          <input type="tel" id="userMobile" class="form-input" placeholder="Enter 10-digit mobile" maxlength="10">
        </div>
      </div>

      <div class="otp-container" id="otpBox" style="display: none;">
        <label class="form-label">Enter 4-Digit OTP sent to your phone</label>
        <div class="otp-inputs">
          <input type="text" maxlength="1" class="otp-digit" autofocus>
          <input type="text" maxlength="1" class="otp-digit">
          <input type="text" maxlength="1" class="otp-digit">
          <input type="text" maxlength="1" class="otp-digit">
        </div>
        <div class="otp-resend-text">Didn't receive code? <a href="#" id="resendOtpLink">Resend in 24s</a></div>
      </div>

      <button type="button" class="btn-primary-modal" id="step1NextBtn">Send Verification OTP</button>

      <div class="social-login-sep"><span>OR CONTINUE WITH</span></div>
      <button type="button" class="btn-google-auth">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
        <span>Sign in with Google</span>
      </button>
    </div>

    <!-- Step 2: Student Identity & Location -->
    <div class="modal-step-pane" id="modalStep2">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" id="userName" class="form-input" placeholder="e.g. Rahul Sharma">
      </div>
      <div class="form-group">
        <label class="form-label">Email Address (For Brochure Delivery)</label>
        <input type="email" id="userEmail" class="form-input" placeholder="rahul@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Current City</label>
        <input type="text" id="userCity" class="form-input" placeholder="e.g. New Delhi">
      </div>
      <div class="modal-actions-row">
        <button type="button" class="btn-ghost-modal" id="step2BackBtn">Back</button>
        <button type="button" class="btn-primary-modal" id="step2NextBtn">Continue</button>
      </div>
    </div>

    <!-- Step 3: Stream, Degree & Consent -->
    <div class="modal-step-pane" id="modalStep3">
      <div class="form-group">
        <label class="form-label">Interested Course / Degree</label>
        <select class="form-input" id="userCourseSelect">
          <option value="btech">B.Tech / B.E (Engineering)</option>
          <option value="mba">MBA / PGDM (Management)</option>
          <option value="mbbs">MBBS / Healthcare</option>
          <option value="bca">BCA / MCA (Computer Applications)</option>
          <option value="law">BA LLB / LLM (Law)</option>
          <option value="design">B.Des / Fashion & Graphic Design</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Target Admission Year</label>
        <div class="radio-pill-group">
          <label class="radio-pill"><input type="radio" name="admYear" value="2026" checked> 2026</label>
          <label class="radio-pill"><input type="radio" name="admYear" value="2027"> 2027</label>
          <label class="radio-pill"><input type="radio" name="admYear" value="2028"> 2028</label>
        </div>
      </div>

      <div class="consent-checkbox-wrap">
        <label class="checkbox-label">
          <input type="checkbox" id="counselConsent" checked>
          <span>I authorize ShikshaPortal and verified partner universities to contact me via Call, SMS, and WhatsApp with admissions information.</span>
        </label>
      </div>

      <div class="modal-actions-row">
        <button type="button" class="btn-ghost-modal" id="step3BackBtn">Back</button>
        <button type="button" class="btn-primary-modal" id="step3SubmitBtn">Download Brochure (PDF)</button>
      </div>
    </div>
  </div>
</div>
```

### CSS:
```css
.shiksha-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: none; /* Toggled to flex via JS */
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.shiksha-modal-overlay.active { display: flex; }

.shiksha-modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: modalPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalPopIn {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: #f1f5f9;
  border: none;
  font-size: 22px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close-btn:hover { background: #e2e8f0; color: #0f172a; }

.modal-badge {
  font-size: 11px;
  font-weight: 800;
  color: #ea580c;
  background: #fff7ed;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
}
.modal-sub {
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 20px;
}

.step-progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
.step-dot.active {
  background: #ea580c;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
}
.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
}

.modal-step-pane { display: none; }
.modal-step-pane.active { display: block; }

.form-group { margin-bottom: 18px; }
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}
.phone-input-row {
  display: flex;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.phone-input-row:focus-within { border-color: #ea580c; }
.phone-prefix {
  background: #f8fafc;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  border-right: 1.5px solid #cbd5e1;
}
.form-input {
  width: 100%;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14.5px;
  color: #0f172a;
  outline: none;
  font-family: inherit;
}
.phone-input-row .form-input { border: none; border-radius: 0; }
.form-input:focus { border-color: #ea580c; }

.otp-inputs {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}
.otp-digit {
  width: 52px;
  height: 52px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  outline: none;
}
.otp-digit:focus { border-color: #ea580c; }
.otp-resend-text {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 6px;
}
.otp-resend-text a { color: #ea580c; text-decoration: none; font-weight: 600; }

.btn-primary-modal {
  width: 100%;
  background: #ea580c;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary-modal:hover { background: #c2410c; }

.btn-ghost-modal {
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.modal-actions-row {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}
.modal-actions-row .btn-primary-modal { flex: 1; }

.social-login-sep {
  text-align: center;
  margin: 20px 0 14px;
  position: relative;
}
.social-login-sep::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}
.social-login-sep span {
  position: relative;
  background: #ffffff;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.btn-google-auth {
  width: 100%;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-google-auth:hover { background: #f8fafc; }

.radio-pill-group { display: flex; gap: 8px; }
.radio-pill {
  flex: 1;
  border: 1.5px solid #cbd5e1;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.radio-pill:has(input:checked) {
  border-color: #ea580c;
  background: #fff7ed;
  color: #ea580c;
}
.radio-pill input { display: none; }

.consent-checkbox-wrap {
  margin: 18px 0;
}
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
  cursor: pointer;
}
.checkbox-label input { margin-top: 2px; }
```

---

## 3. Interactive College Comparison Card
**Used For:** Main college search result cards in `colleges.html` and featured sections on `index.html`.  
**Visual Description:** High-impact card featuring NIRF rank badge, campus image preview, university crest, tabular metrics (Fees, Average Package, Highest Package), and an interactive compare checkbox that triggers the bottom comparison bar.

### HTML:
```html
<div class="college-search-card">
  <!-- Card Header / Media -->
  <div class="card-hero-banner">
    <div class="college-rank-tag">
      <span class="rank-num">#1</span>
      <span class="rank-lbl">NIRF '25</span>
    </div>
    <div class="college-accreditation-pill">NAAC A++ | Public</div>
  </div>

  <!-- Card Body -->
  <div class="card-body-content">
    <div class="title-logo-row">
      <div class="college-crest-box">🏛️</div>
      <div class="title-details">
        <h4 class="college-name">IIT Madras - Indian Institute of Technology</h4>
        <p class="college-location">📍 Chennai, Tamil Nadu | Estd. 1959</p>
      </div>
      <div class="college-rating-badge">
        <span class="star-icon">★</span>
        <span class="rating-value">4.8</span>
      </div>
    </div>

    <!-- Metrics Matrix -->
    <div class="college-stats-grid">
      <div class="stat-col">
        <span class="stat-label">B.Tech Total Fees</span>
        <span class="stat-value">₹8.58 Lakhs</span>
        <span class="stat-sub">4 Years Duration</span>
      </div>
      <div class="stat-col">
        <span class="stat-label">Average CTC</span>
        <span class="stat-value highlight-green">₹21.48 LPA</span>
        <span class="stat-sub">Highest: ₹1.31 Cr</span>
      </div>
      <div class="stat-col">
        <span class="stat-label">Exam Accepted</span>
        <span class="stat-value highlight-blue">JEE Advanced</span>
        <span class="stat-sub">Cutoff Rank: ~114 (CSE)</span>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="card-footer-actions">
      <label class="compare-toggle-label">
        <input type="checkbox" class="compare-chk" data-college="IIT Madras">
        <span>+ Add to Compare</span>
      </label>
      <div class="btn-group-right">
        <button class="btn-card-outline trigger-lead-modal">Download Brochure</button>
        <a href="college-details.html" class="btn-card-primary">View Courses & Fees →</a>
      </div>
    </div>
  </div>
</div>
```

### CSS:
```css
.college-search-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transition: all 0.28s ease;
  margin-bottom: 20px;
}
.college-search-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -4px rgba(15, 23, 42, 0.1);
  border-color: #cbd5e1;
}

.card-hero-banner {
  height: 110px;
  background: linear-gradient(135deg, #0a192f, #1e293b);
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 18px;
}
.college-rank-tag {
  background: rgba(245, 158, 11, 0.95);
  color: #0f172a;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.college-accreditation-pill {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 50px;
}

.card-body-content { padding: 18px 20px; }

.title-logo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: -36px;
  margin-bottom: 16px;
}
.college-crest-box {
  width: 58px;
  height: 58px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border: 2px solid #ffffff;
}
.title-details { flex: 1; padding-top: 18px; }
.college-name {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3px;
}
.college-location {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.college-rating-badge {
  background: #fefce8;
  border: 1px solid #fef08a;
  color: #854d0e;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13.5px;
}
.star-icon { color: #eab308; }

.college-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  gap: 12px;
  margin-bottom: 16px;
}
.stat-col { display: flex; flex-direction: column; }
.stat-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
.stat-value { font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0; }
.stat-sub { font-size: 11.5px; color: #94a3b8; }
.highlight-green { color: #16a34a; }
.highlight-blue { color: #0284c7; }

.card-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}
.compare-toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.btn-group-right { display: flex; gap: 10px; }
.btn-card-outline {
  background: transparent;
  border: 1.5px solid #cbd5e1;
  color: #334155;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-card-outline:hover { border-color: #ea580c; color: #ea580c; }
.btn-card-primary {
  background: #ea580c;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.btn-card-primary:hover { background: #c2410c; }
```

---

## 4. Verified Student Rating & Review Card
**Used For:** Review section on `index.html` and `college-details.html`.  
**Visual Description:** Clean card showcasing authentic student credentials, verified enrollment pill, category-specific rating bars (Faculty, Placements, Infrastructure), and formatted pros/cons lists.

### HTML:
```html
<div class="shiksha-review-card">
  <div class="review-header">
    <div class="reviewer-avatar">RS</div>
    <div class="reviewer-meta">
      <h5 class="reviewer-name">Rahul Sharma</h5>
      <p class="reviewer-course">B.Tech Computer Science (Batch of 2025)</p>
    </div>
    <div class="verified-student-tag">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Verified Student</span>
    </div>
  </div>

  <!-- Rating Matrix -->
  <div class="review-ratings-row">
    <div class="score-pill-overall">
      <span class="score-num">4.6</span>
      <span class="score-stars">★★★★★</span>
    </div>
    <div class="rating-sub-bars">
      <div class="sub-bar-item"><span>Placements:</span> <strong>4.8/5</strong></div>
      <div class="sub-bar-item"><span>Infrastructure:</span> <strong>4.5/5</strong></div>
      <div class="sub-bar-item"><span>Faculty:</span> <strong>4.6/5</strong></div>
      <div class="sub-bar-item"><span>Campus Life:</span> <strong>4.2/5</strong></div>
    </div>
  </div>

  <!-- Pros & Cons Box -->
  <div class="pros-cons-box">
    <div class="bullet-row pro-row">
      <span class="bullet-tag tag-pro">PROS</span>
      <p class="bullet-text">Superb placement opportunities with average packages exceeding ₹20 LPA for CSE. World-class supercomputing labs and extremely supportive research professors.</p>
    </div>
    <div class="bullet-row con-row">
      <span class="bullet-tag tag-con">CONS</span>
      <p class="bullet-text">Academic pressure is quite intense during mid-semester exams. 75% attendance rule is strictly monitored via biometric machines.</p>
    </div>
  </div>
</div>
```

### CSS:
```css
.shiksha-review-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 22px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
  margin-bottom: 18px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.reviewer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.reviewer-meta { flex: 1; }
.reviewer-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
}
.reviewer-course {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}
.verified-student-tag {
  background: #f0fdf4;
  color: #16a34a;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #bbf7d0;
}

.review-ratings-row {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}
.score-pill-overall {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1.5px solid #e2e8f0;
  padding-right: 20px;
}
.score-num { font-size: 24px; font-weight: 800; color: #0f172a; }
.score-stars { color: #f59e0b; font-size: 13px; letter-spacing: 1px; }

.rating-sub-bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 18px;
  flex: 1;
  font-size: 12.5px;
  color: #64748b;
}
.rating-sub-bars strong { color: #0f172a; }

.pros-cons-box { display: flex; flex-direction: column; gap: 10px; }
.bullet-row { display: flex; align-items: flex-start; gap: 10px; }
.bullet-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.tag-pro { background: #dcfce7; color: #15803d; }
.tag-con { background: #fee2e2; color: #b91c1c; }
.bullet-text {
  font-size: 13.5px;
  color: #334155;
  line-height: 1.5;
  margin: 0;
}
```

---

## 5. Sticky Floating Counselling Action Bar
**Used For:** Persistent bottom-right floating widget on all pages.  
**Visual Description:** Floating pill with a pulsing live status dot ("Expert Counsellors Online"), immediate telephone call trigger, and "Ask a Query" lead popup trigger.

### HTML:
```html
<div class="shiksha-floating-counsel">
  <div class="counsel-pill-card">
    <div class="status-pulse-dot"></div>
    <div class="counsel-text-col">
      <span class="counsel-title">Need Admission Advice?</span>
      <span class="counsel-subtitle">Speak with an Expert Mentor</span>
    </div>
    <button class="counsel-call-btn" title="Call Counsellor" onclick="window.location.href='tel:+918091920250'">
      📞
    </button>
    <button class="counsel-chat-btn trigger-lead-modal" title="Open Form">
      Request Callback
    </button>
  </div>
</div>
```

### CSS:
```css
.shiksha-floating-counsel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 900;
}

.counsel-pill-card {
  background: #0f172a;
  color: #ffffff;
  border-radius: 50px;
  padding: 8px 12px 8px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.25s ease;
}
.counsel-pill-card:hover { transform: translateY(-3px); }

.status-pulse-dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulseDot 2s infinite;
}
@keyframes pulseDot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.counsel-text-col { display: flex; flex-direction: column; }
.counsel-title { font-size: 12.5px; font-weight: 700; color: #f8fafc; }
.counsel-subtitle { font-size: 11px; color: #94a3b8; }

.counsel-call-btn {
  background: #1e293b;
  border: 1px solid #334155;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.counsel-call-btn:hover { background: #334155; }

.counsel-chat-btn {
  background: #ea580c;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 9px 18px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.counsel-chat-btn:hover { background: #c2410c; }
```
