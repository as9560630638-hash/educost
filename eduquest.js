/* ============================================================
   EduQuest — Interactive Features
   ============================================================ */

const API_BASE = 'https://eduquest-backend.eduquest-api.workers.dev';

(function () {
  'use strict';

  /* ── Helpers ── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     MODAL SYSTEM
     ============================================================ */
  const modal    = $('#leadModal');
  const closeBtn = $('#closeModalBtn');
  const steps    = $$('.modal-step-pane');
  const stepDots = $$('.step-dot');
  let currentStep = 1;
  let otpTimer;

  function showModal() {
    if (!modal) return;
    currentStep = 1;
    renderStep(1);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearInterval(otpTimer);
  }

  function renderStep(n) {
    steps.forEach(p => p.classList.remove('active'));
    stepDots.forEach(d => {
      d.classList.remove('active', 'done');
      if (parseInt(d.dataset.step) < n) d.classList.add('done');
      if (parseInt(d.dataset.step) === n) d.classList.add('active');
    });
    const pane = $('#modalStep' + n);
    if (pane) pane.classList.add('active');
    const successPane = $('#modalSuccess');
    if (successPane) successPane.classList.remove('active');
  }

  function showSuccess() {
    steps.forEach(p => p.classList.remove('active'));
    stepDots.forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
    const successPane = $('#modalSuccess');
    if (successPane) successPane.classList.add('active');
    clearInterval(otpTimer);
  }

  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

  /* Step 1 — Send OTP / Verify */
  const step1Btn = $('#step1NextBtn');
  const otpBox   = $('#otpBox');
  const mobileIn = $('#userMobile');
  let otpSent = false;

  if (step1Btn) {
    step1Btn.addEventListener('click', () => {
      if (!otpSent) {
        const val = mobileIn ? mobileIn.value.trim() : '';
        if (val.length !== 10 || !/^[6-9]\d{9}$/.test(val)) {
          if (mobileIn) {
            mobileIn.style.borderColor = '#ef4444';
            mobileIn.placeholder = 'Enter valid 10-digit mobile number';
            setTimeout(() => { mobileIn.style.borderColor = ''; }, 2000);
          }
          return;
        }
        if (otpBox) otpBox.style.display = 'block';
        step1Btn.textContent = 'Verify & Proceed →';
        otpSent = true;
        startOtpTimer();
        focusFirstOtpDigit();
      } else {
        const digits = $$('.otp-digit');
        const code   = digits.map(d => d.value).join('');
        if (code.length < 4) {
          digits.forEach(d => d.style.borderColor = '#ef4444');
          setTimeout(() => digits.forEach(d => d.style.borderColor = ''), 2000);
          return;
        }
        currentStep = 2;
        renderStep(2);
        otpSent = false;
        if (step1Btn) step1Btn.textContent = 'Send Verification OTP';
        if (otpBox) otpBox.style.display = 'none';
        if (mobileIn) mobileIn.value = '';
        if (digits) digits.forEach(d => d.value = '');
        clearInterval(otpTimer);
      }
    });
  }

  function startOtpTimer() {
    let secs = 30;
    const link = $('#resendOtpLink');
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
      if (!link) { clearInterval(otpTimer); return; }
      secs--;
      if (secs > 0) {
        link.textContent = `Resend in ${secs}s`;
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
      } else {
        link.textContent = 'Resend OTP';
        link.style.pointerEvents = '';
        link.style.opacity = '1';
        clearInterval(otpTimer);
      }
    }, 1000);
  }

  function focusFirstOtpDigit() {
    const first = $('.otp-digit');
    if (first) first.focus();
  }

  /* OTP digit auto-advance */
  document.addEventListener('input', e => {
    if (!e.target.classList.contains('otp-digit')) return;
    const val = e.target.value.replace(/\D/, '');
    e.target.value = val.slice(-1);
    if (val) {
      const next = e.target.nextElementSibling;
      if (next && next.classList.contains('otp-digit')) next.focus();
    }
  });
  document.addEventListener('keydown', e => {
    if (!e.target.classList.contains('otp-digit')) return;
    if (e.key === 'Backspace' && !e.target.value) {
      const prev = e.target.previousElementSibling;
      if (prev && prev.classList.contains('otp-digit')) { prev.value = ''; prev.focus(); }
    }
  });

  /* Step 2 */
  const step2Back = $('#step2BackBtn');
  const step2Next = $('#step2NextBtn');
  if (step2Back) step2Back.addEventListener('click', () => { currentStep = 1; renderStep(1); });
  if (step2Next) {
    step2Next.addEventListener('click', () => {
      const name = $('#userName');
      if (name && !name.value.trim()) {
        name.style.borderColor = '#ef4444';
        setTimeout(() => { name.style.borderColor = ''; }, 2000);
        return;
      }
      currentStep = 3;
      renderStep(3);
    });
  }

  /* Step 3 */
  const step3Back   = $('#step3BackBtn');
  const step3Submit = $('#step3SubmitBtn');
  if (step3Back)   step3Back.addEventListener('click', () => { currentStep = 2; renderStep(2); });
  if (step3Submit) step3Submit.addEventListener('click', showSuccess);

  /* Stream cards in modal */
  document.addEventListener('click', e => {
    if (e.target.closest('.stream-card')) {
      $$('.stream-card').forEach(c => c.classList.remove('selected'));
      e.target.closest('.stream-card').classList.add('selected');
    }
  });

  /* Trigger modal via any .trigger-lead-modal */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.trigger-lead-modal');
    if (btn) { e.preventDefault(); showModal(); }
  });

  /* Login button */
  const loginBtns = $$('.btn-nav-primary, .btn-login-trigger');
  loginBtns.forEach(b => b.addEventListener('click', showModal));

  /* ============================================================
     GLOBAL SEARCH AUTOCOMPLETE
     ============================================================ */
  const searchInput    = $('#mainSearchInput');
  const searchDropdown = $('#searchDropdown');

  const searchData = [
    { type: 'institute', badge: 'IIT',  badgeClass: 'badge-engg', text: 'Indian Institute of Technology, Madras (IIT Madras)', loc: 'Chennai, TN', url: 'college-details.html' },
    { type: 'institute', badge: 'IIT',  badgeClass: 'badge-engg', text: 'Indian Institute of Technology, Delhi (IIT Delhi)',   loc: 'New Delhi',   url: 'college-details.html' },
    { type: 'institute', badge: 'IIT',  badgeClass: 'badge-engg', text: 'Indian Institute of Technology, Bombay (IIT Bombay)', loc: 'Mumbai, MH',  url: 'college-details.html' },
    { type: 'institute', badge: 'IIM',  badgeClass: 'badge-mba',  text: 'Indian Institute of Management, Ahmedabad (IIM-A)',   loc: 'Ahmedabad',  url: 'college-details.html' },
    { type: 'institute', badge: 'IIM',  badgeClass: 'badge-mba',  text: 'Indian Institute of Management, Bangalore (IIM-B)',   loc: 'Bengaluru',  url: 'college-details.html' },
    { type: 'institute', badge: 'UNI',  badgeClass: 'badge-engg', text: 'BITS Pilani — Birla Institute of Technology & Science', loc: 'Pilani, RJ', url: 'college-details.html' },
    { type: 'exam',      badge: 'EXAM', badgeClass: 'badge-exam', text: 'JEE Main 2026 — Registration & Dates',              loc: 'NTA',       url: 'exams.html' },
    { type: 'exam',      badge: 'EXAM', badgeClass: 'badge-exam', text: 'CAT 2026 — Eligibility, Pattern & Syllabus',         loc: 'IIMs',      url: 'exams.html' },
    { type: 'exam',      badge: 'EXAM', badgeClass: 'badge-exam', text: 'NEET UG 2026 — Exam Dates & Preparation Guide',      loc: 'NTA',       url: 'exams.html' },
    { type: 'exam',      badge: 'EXAM', badgeClass: 'badge-exam', text: 'GATE 2026 — Cutoff Predictor & Branch-wise Analysis', loc: 'IIT Roorkee', url: 'exams.html' },
    { type: 'course',    badge: 'UG',   badgeClass: 'badge-engg', text: 'B.Tech Computer Science & Engineering',              loc: 'Engineering', url: 'colleges.html' },
    { type: 'course',    badge: 'PG',   badgeClass: 'badge-mba',  text: 'MBA Marketing & Finance',                            loc: 'Management',  url: 'colleges.html' },
  ];

  function renderDropdown(query) {
    if (!searchDropdown) return;
    const q = query.trim().toLowerCase();
    if (!q) { searchDropdown.classList.remove('active'); return; }

    const matches = searchData.filter(d =>
      d.text.toLowerCase().includes(q) || d.loc.toLowerCase().includes(q)
    ).slice(0, 7);

    if (!matches.length) { searchDropdown.classList.remove('active'); return; }

    const institutes = matches.filter(m => m.type === 'institute');
    const exams      = matches.filter(m => m.type === 'exam');
    const courses    = matches.filter(m => m.type === 'course');

    let html = '';
    if (institutes.length) {
      html += '<div class="dropdown-group-title">POPULAR INSTITUTES</div>';
      institutes.forEach(m => { html += buildDropdownItem(m); });
    }
    if (exams.length) {
      html += '<div class="dropdown-group-title">TRENDING EXAMS</div>';
      exams.forEach(m => { html += buildDropdownItem(m); });
    }
    if (courses.length) {
      html += '<div class="dropdown-group-title">COURSES & DEGREES</div>';
      courses.forEach(m => { html += buildDropdownItem(m); });
    }

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add('active');
  }

  function buildDropdownItem(m) {
    return `<a href="${m.url}" class="dropdown-item">
      <span class="item-badge ${m.badgeClass}">${m.badge}</span>
      <span class="item-text">${m.text}</span>
      <span class="item-loc">${m.loc}</span>
    </a>`;
  }

  function heroNavigate() {
    const q      = searchInput ? searchInput.value.trim() : '';
    const active = document.querySelector('.chip-btn.active');
    const stream = active ? active.dataset.stream : 'all';
    const params = new URLSearchParams();
    if (q)              params.set('q', q);
    if (stream !== 'all') params.set('stream', stream);
    const qs = params.toString();
    window.location.href = 'colleges.html' + (qs ? '?' + qs : '');
  }

  const heroSearchBtn = $('#heroSearchBtn');
  if (heroSearchBtn) heroSearchBtn.addEventListener('click', heroNavigate);

  if (searchInput) {
    searchInput.addEventListener('input', () => renderDropdown(searchInput.value));
    searchInput.addEventListener('focus', () => { if (searchInput.value) renderDropdown(searchInput.value); });
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); heroNavigate(); } });
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.omni-search-box') && searchDropdown) {
      searchDropdown.classList.remove('active');
    }
  });

  /* Stream chip filtering */
  $$('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (searchInput) {
        const stream = btn.dataset.stream;
        if (stream !== 'all') searchInput.placeholder = `Search ${btn.textContent.trim()} colleges, exams…`;
        else searchInput.placeholder = 'Search 25,000+ Colleges, Courses (e.g. B.Tech, MBA), or Exams (JEE, CAT)…';
      }
    });
  });

  /* ============================================================
     MOBILE DRAWER
     ============================================================ */
  const hamburgerBtn = $('#hamburgerBtn');
  const mobileDrawer = $('#mobileDrawer');
  const drawerBackdrop = $('#drawerBackdrop');
  const drawerClose = $('#drawerClose');

  function openDrawer()  { if (mobileDrawer) mobileDrawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { if (mobileDrawer) mobileDrawer.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburgerBtn)  hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  if (drawerClose)   drawerClose.addEventListener('click', closeDrawer);

  /* ============================================================
     COLLEGE DETAILS — TAB SWITCHING
     ============================================================ */
  const tabBtns  = $$('.tab-btn');
  const tabPanes = $$('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = $('#tab-' + target);
      if (pane) pane.classList.add('active');
    });
  });

  /* Cutoff year / category selectors */
  $$('.selector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.cutoff-year-selector, .cutoff-cat-selector, .courses-filter-tabs');
      if (group) $$('.selector-btn', group).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ============================================================
     FACETED FILTERS (colleges.html)
     ============================================================ */
  const collegeCards = $$('.college-search-card[data-tags]');
  const filterCheckboxes = $$('.filter-checkbox-item input[type=checkbox]');
  const filterNameInput  = $('#filterByNameInput');
  const feeSlider        = $('#feeRangeSlider');
  const feeDisplay       = $('#feeRangeDisplay');
  const sortSelect       = $('#sortSelect');
  const resultsCountEl   = $('#resultsCount');

  function runFilters() {
    if (!collegeCards.length) return;
    const checkedFilters = filterCheckboxes
      .filter(c => c.checked)
      .map(c => c.value.toLowerCase());
    const nameQuery = filterNameInput ? filterNameInput.value.trim().toLowerCase() : '';
    const maxFee    = feeSlider ? parseInt(feeSlider.value) : 9999999;

    let visible = 0;
    collegeCards.forEach(card => {
      const tags  = (card.dataset.tags || '').toLowerCase();
      const name  = (card.dataset.name || '').toLowerCase();
      const fee   = parseInt(card.dataset.fee || '0');

      const passesFilter = !checkedFilters.length || checkedFilters.some(f => tags.includes(f));
      const passesName   = !nameQuery || name.includes(nameQuery);
      const passesFee    = fee <= maxFee;

      const show = passesFilter && passesName && passesFee;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (resultsCountEl) resultsCountEl.textContent = visible;
    updateActiveFilterChips();
  }

  filterCheckboxes.forEach(cb => cb.addEventListener('change', runFilters));
  if (filterNameInput) filterNameInput.addEventListener('input', runFilters);
  if (feeSlider) {
    feeSlider.addEventListener('input', () => {
      const val = parseInt(feeSlider.value);
      if (feeDisplay) {
        feeDisplay.textContent = val >= 3000000 ? '₹30 Lakhs+' : `₹${(val/100000).toFixed(1)} Lakhs`;
      }
      runFilters();
    });
  }

  /* Fee bucket buttons */
  $$('.fee-bucket-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.fee-bucket-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (feeSlider) {
        const val = parseInt(btn.dataset.fee);
        feeSlider.value = val;
        if (feeDisplay) feeDisplay.textContent = btn.textContent;
        runFilters();
      }
    });
  });

  /* Clear all filters */
  const clearAllBtn = $('#clearAllFilters');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      filterCheckboxes.forEach(c => c.checked = false);
      if (filterNameInput) filterNameInput.value = '';
      if (feeSlider) { feeSlider.value = feeSlider.max; if (feeDisplay) feeDisplay.textContent = '₹30 Lakhs+'; }
      $$('.fee-bucket-btn').forEach(b => b.classList.remove('active'));
      runFilters();
    });
  }

  function updateActiveFilterChips() {
    const bar = $('#activeFiltersBar');
    if (!bar) return;
    const checked = filterCheckboxes.filter(c => c.checked);
    if (!checked.length) { bar.innerHTML = ''; return; }
    const chips = checked.map(c => `
      <span class="filter-chip">
        ${c.dataset.label || c.value}
        <span class="filter-chip-remove" data-value="${c.value}">×</span>
      </span>`).join('');
    bar.innerHTML = chips + `<span class="filter-chip-clear" id="clearAllFilters">Clear All</span>`;
    $$('.filter-chip-remove', bar).forEach(x => {
      x.addEventListener('click', () => {
        const cb = filterCheckboxes.find(c => c.value === x.dataset.value);
        if (cb) { cb.checked = false; runFilters(); }
      });
    });
    const newClear = $('#clearAllFilters');
    if (newClear) newClear.addEventListener('click', () => {
      filterCheckboxes.forEach(c => c.checked = false);
      runFilters();
    });
  }

  /* Sort */
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const container = $('#collegeListingsContainer');
      if (!container) return;
      const cards = $$('.college-search-card', container);
      const sorted = cards.sort((a, b) => {
        const v = sortSelect.value;
        if (v === 'nirf')    return (parseInt(a.dataset.nirf) || 999) - (parseInt(b.dataset.nirf) || 999);
        if (v === 'package') return (parseInt(b.dataset.pkg)  || 0) - (parseInt(a.dataset.pkg)  || 0);
        if (v === 'fees')    return (parseInt(a.dataset.fee)  || 0) - (parseInt(b.dataset.fee)  || 0);
        if (v === 'rating')  return (parseFloat(b.dataset.rating) || 0) - (parseFloat(a.dataset.rating) || 0);
        return 0;
      });
      sorted.forEach(c => container.appendChild(c));
    });
  }

  /* ============================================================
     URL PARAM → AUTO-FILTER ON PAGE LOAD (colleges.html)
     ============================================================ */
  if (collegeCards.length) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQ      = urlParams.get('q');
    const urlStream = urlParams.get('stream');

    if (urlQ && filterNameInput) {
      filterNameInput.value = urlQ;
    }

    if (urlStream && urlStream !== 'all') {
      const matchCb = filterCheckboxes.find(c => c.value.toLowerCase() === urlStream.toLowerCase());
      if (matchCb) matchCb.checked = true;
    }

    if (urlQ || urlStream) {
      runFilters();
      /* Scroll past the filter sidebar to the results */
      const resultsArea = $('#collegeListingsContainer');
      if (resultsArea) setTimeout(() => resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }

  /* ============================================================
     COMPARE BAR
     ============================================================ */
  const compareBar    = $('#compareBar');
  const compareSlots  = $$('.compare-slot-placeholder');
  let selectedColleges = []; // [{name, slug}]

  document.addEventListener('change', e => {
    if (!e.target.classList.contains('compare-chk')) return;
    const name = e.target.dataset.college;
    const slug = e.target.dataset.slug || '';
    if (e.target.checked) {
      if (selectedColleges.length >= 3) {
        e.target.checked = false;
        showToast('Maximum 3 colleges can be compared at once.');
        return;
      }
      selectedColleges.push({ name, slug });
    } else {
      selectedColleges = selectedColleges.filter(n => n.name !== name);
    }
    renderCompareBar();
  });

  function renderCompareBar() {
    if (!compareBar) return;
    const slotsContainer = $('#compareBarSlots');
    if (!slotsContainer) return;

    if (selectedColleges.length === 0) {
      compareBar.classList.remove('visible');
      return;
    }
    compareBar.classList.add('visible');

    let html = '';
    for (let i = 0; i < 3; i++) {
      if (selectedColleges[i]) {
        html += `<div class="compare-slot filled">
          <span class="compare-slot-name">${selectedColleges[i].name}</span>
          <button class="compare-slot-remove" data-college="${selectedColleges[i].name}">×</button>
        </div>`;
      } else {
        html += `<div class="compare-slot"><span style="font-size:12px;color:#64748b">+ Add College</span></div>`;
      }
    }
    slotsContainer.innerHTML = html;

    $$('.compare-slot-remove', compareBar).forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.college;
        selectedColleges = selectedColleges.filter(n => n.name !== name);
        const cb = document.querySelector(`.compare-chk[data-college="${name}"]`);
        if (cb) cb.checked = false;
        renderCompareBar();
      });
    });
  }

  const compareNowBtn = $('#compareNowBtn');
  if (compareNowBtn) {
    compareNowBtn.addEventListener('click', () => {
      if (selectedColleges.length < 2) { showToast('Please select at least 2 colleges to compare.'); return; }
      const slugs = selectedColleges.map(c => c.slug).filter(Boolean).join(',');
      const names = selectedColleges.map(c => encodeURIComponent(c.name)).join(',');
      window.location.href = 'compare.html?' + (slugs ? 'slugs=' + slugs : 'names=' + names);
    });
  }
  const compareClearBtn = $('#compareClearBtn');
  if (compareClearBtn) {
    compareClearBtn.addEventListener('click', () => {
      selectedColleges = [];
      $$('.compare-chk').forEach(c => c.checked = false);
      renderCompareBar();
    });
  }

  /* ============================================================
     EXAMS PAGE — STREAM FILTER
     ============================================================ */
  const examCards = $$('.exam-card[data-stream]');
  $$('.stream-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.stream-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const stream = btn.dataset.stream;
      examCards.forEach(card => {
        card.style.display = (stream === 'all' || card.dataset.stream === stream) ? '' : 'none';
      });
      updateExamMonthVisibility();
    });
  });

  function updateExamMonthVisibility() {
    $$('.exam-month-group').forEach(group => {
      const visible = $$('.exam-card', group).some(c => c.style.display !== 'none');
      group.style.display = visible ? '' : 'none';
    });
  }

  /* ============================================================
     COUNSELLING FORM SUBMIT
     ============================================================ */
  const counselForm = $('#counsellingForm');
  if (counselForm) {
    counselForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = counselForm.querySelector('button[type=submit]');
      if (btn) {
        btn.textContent = '✓ Request Received! We\'ll call you within 2 hours.';
        btn.disabled = true;
        btn.style.background = '#16a34a';
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = 'Request Free Callback';
          btn.disabled = false;
          btn.style.background = '';
        }
        counselForm.reset();
      }, 4000);
    });
  }

  /* Footer counselling form */
  const footerForm = $('#footerCounselForm');
  if (footerForm) {
    footerForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thank you! Our counsellors will reach out shortly.');
      footerForm.reset();
    });
  }

  /* ============================================================
     TOAST NOTIFICATION
     ============================================================ */
  function showToast(msg) {
    const existing = $('#shikshaToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'shikshaToast';
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '90px', left: '50%',
      transform: 'translateX(-50%)',
      background: '#1a1a1a', color: '#f5ecd7',
      padding: '12px 24px', borderRadius: '8px',
      fontSize: '14px', fontWeight: '600',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      zIndex: '9999', whiteSpace: 'nowrap',
      animation: 'fadeInUp 0.3s ease'
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
  }

  /* ============================================================
     COUNTDOWN TIMERS
     ============================================================ */
  $$('[data-countdown]').forEach(el => {
    const target = new Date(el.dataset.countdown);
    function update() {
      const diff = target - new Date();
      if (diff <= 0) { el.textContent = 'Closed'; return; }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      el.textContent = `${days}d ${hours}h left`;
    }
    update();
    setInterval(update, 60000);
  });

  /* ============================================================
     FILTER SECTION COLLAPSE TOGGLE
     ============================================================ */
  $$('.filter-section-title').forEach(title => {
    title.addEventListener('click', () => {
      const section = title.closest('.filter-section');
      const body = section.querySelector('.filter-section-body');
      if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? '' : 'none';
        title.classList.toggle('collapsed', !isHidden);
      }
    });
  });

  /* ============================================================
     STICKY HEADER SCROLL SHADOW
     ============================================================ */
  const mainNav = $('#main-nav');
  if (mainNav) {
    const syncScrolled = () => mainNav.classList.toggle('eq-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', syncScrolled, { passive: true });
    syncScrolled();
  }

  /* ============================================================
     COMPARE PAGE — ADD COLLEGE SLOT
     ============================================================ */
  $$('.add-college-slot').forEach(slot => {
    slot.addEventListener('click', () => showToast('Use the college search above to add a college for comparison.'));
  });

  /* Expose showModal globally */
  window.EduQuest = { showModal, hideModal, showToast };

})();

/* ============================================================
   COLLEGES PAGE — Live API data
   ============================================================ */
(function () {
  const container = document.getElementById('collegeListingsContainer');
  if (!container) return;

  // Remove any hardcoded static cards left in HTML
  container.querySelectorAll('.eq-static-remove').forEach(el => el.remove());

  let cursor = null;
  let busy = false;
  let timer = null;

  function params(withCursor) {
    const p = new URLSearchParams();
    const sort = document.getElementById('sortSelect');
    p.set('sort', (sort && sort.value) || 'popular');
    const name = document.getElementById('filterByNameInput');
    if (name && name.value.trim()) p.set('q', name.value.trim());
    const fee = document.getElementById('feeRangeSlider');
    if (fee && parseInt(fee.value) < parseInt(fee.max)) p.set('maxFee', fee.value);
    const tags = [...document.querySelectorAll('.filter-checkbox-item input[type=checkbox]:checked')]
      .map(c => c.value).join(',');
    if (tags) p.set('tags', tags);
    p.set('limit', '20');
    if (withCursor && cursor) p.set('cursor', cursor);
    return p;
  }

  function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function card(c) {
    const ownerMap = { public:'Government', private:'Private', ppp:'Deemed University', autonomous:'Autonomous' };
    const rank = c.nirf_rank_overall ? `<span class="college-rank-tag"><i class="fa-solid fa-star"></i> NIRF #${c.nirf_rank_overall}</span>` : '';
    const naac = c.naac_grade ? `<span class="college-accreditation-pill">${esc(c.naac_grade)}</span>` : '';
    const bg = c.cover_url
      ? `background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url('${esc(c.cover_url)}') center/cover no-repeat`
      : 'background:linear-gradient(135deg,#0a2744,#1e3a5f)';
    const logo = c.logo_url
      ? `<img src="${esc(c.logo_url)}" alt="" style="width:100%;height:100%;object-fit:contain" onerror="this.replaceWith(document.createElement('i'))" />`
      : `<i class="fa-solid fa-landmark"></i>`;
    const rating = c.avg_rating > 0
      ? `<div class="college-rating-badge"><span class="star-icon"><i class="fa-solid fa-star"></i></span> ${c.avg_rating.toFixed(1)}</div>` : '';
    const loc = [c.city, c.state].filter(Boolean).join(', ');
    const own = ownerMap[c.ownership] || '';
    const fee = c.min_fee_inr ? `₹${(c.min_fee_inr/100000).toFixed(1)}L` : '—';
    const pkg = c.avg_package_lpa ? `₹${c.avg_package_lpa} LPA` : '—';
    const hpkg = c.highest_package_lpa ? `Highest ₹${c.highest_package_lpa} LPA` : '';
    return `<div class="college-search-card" data-name="${esc((c.name||'').toLowerCase())}"
        data-tags="${esc((c.tags||[]).join(','))},${esc(c.ownership||'')}" data-nirf="${c.nirf_rank_overall||9999}"
        data-pkg="${c.avg_package_lpa ? c.avg_package_lpa*100000 : 0}" data-fee="${c.min_fee_inr||0}" data-rating="${c.avg_rating||0}">
      <div class="card-hero-banner" style="${bg}">${rank}${naac}</div>
      <div class="card-body-content">
        <div class="title-logo-row">
          <div class="college-crest-box">${logo}</div>
          <div class="title-details">
            <h3 class="college-name">${esc(c.name)}</h3>
            <p class="college-location"><i class="fa-solid fa-location-dot"></i> ${esc(loc)}${own ? ' · '+own : ''}</p>
          </div>${rating}
        </div>
        <div class="college-stats-grid">
          <div class="stat-col"><span class="stat-label">Min. Fee</span><span class="stat-value">${fee}</span><span class="stat-sub">Annual / Total</span></div>
          <div class="stat-col"><span class="stat-label">Avg. Package</span><span class="stat-value highlight-green">${pkg}</span><span class="stat-sub">${esc(hpkg)}</span></div>
          <div class="stat-col"><span class="stat-label">NIRF Rank</span><span class="stat-value highlight-blue">${c.nirf_rank_overall ? '#'+c.nirf_rank_overall : '—'}</span><span class="stat-sub">Overall</span></div>
        </div>
        <div class="card-footer-actions">
          <label class="compare-toggle-label"><input type="checkbox" class="compare-chk" data-college="${esc(c.name)}" data-slug="${esc(c.slug)}"> + Compare</label>
          <div class="btn-group-right">
            <a href="college-details.html?slug=${esc(c.slug)}" class="btn-card-outline">View Details</a>
            <button class="btn-card-outline trigger-lead-modal">Brochure</button>
            <button class="btn-card-primary trigger-lead-modal">Apply Now →</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  async function load(reset) {
    if (busy) return;
    busy = true;
    if (reset) {
      cursor = null;
      container.innerHTML = '<div style="padding:60px 0;text-align:center;color:#64748b"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:#1877F2"></i><p style="margin-top:16px">Loading colleges…</p></div>';
      const old = document.getElementById('eq-load-more');
      if (old) old.remove();
    }
    try {
      const res = await fetch(`${API_BASE}/api/v1/colleges?${params(!reset ? true : false)}`);
      if (!res.ok) throw new Error(res.status);
      const { data: list, meta } = await res.json();
      if (reset) container.innerHTML = list.length ? '' : '<div style="padding:60px 0;text-align:center;color:#64748b">No colleges match your filters.</div>';
      if (list.length) container.insertAdjacentHTML('beforeend', list.map(card).join(''));
      const countEl = document.getElementById('resultsCount');
      if (countEl) countEl.textContent = container.querySelectorAll('.college-search-card').length;
      let lm = document.getElementById('eq-load-more');
      if (meta.hasMore) {
        cursor = meta.cursor;
        if (!lm) {
          lm = document.createElement('div');
          lm.id = 'eq-load-more';
          lm.style.cssText = 'text-align:center;padding:32px 0 8px';
          lm.innerHTML = '<button class="btn-card-outline" style="padding:12px 36px;font-size:15px">Load More Colleges</button>';
          container.after(lm);
          lm.querySelector('button').addEventListener('click', () => load(false));
        }
      } else {
        cursor = null;
        if (lm) lm.remove();
      }
    } catch { if (reset) container.innerHTML = '<div style="padding:60px 0;text-align:center;color:#ef4444">Failed to load colleges. Please refresh.</div>'; }
    busy = false;
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(() => load(true), 350); }

  document.querySelectorAll('.filter-checkbox-item input[type=checkbox]').forEach(el => el.addEventListener('change', schedule));
  const nameEl = document.getElementById('filterByNameInput');
  if (nameEl) nameEl.addEventListener('input', schedule);
  const feeEl = document.getElementById('feeRangeSlider');
  if (feeEl) feeEl.addEventListener('input', schedule);
  const sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.addEventListener('change', () => load(true));
  document.querySelectorAll('.fee-bucket-btn').forEach(b => b.addEventListener('click', schedule));
  document.addEventListener('click', e => { if (e.target.closest('#clearAllFilters')) setTimeout(schedule, 50); });

  // Pre-fill from URL and initial fetch
  const urlP = new URLSearchParams(window.location.search);
  const urlQ = urlP.get('q');
  // Always reset to prevent browser from restoring old field values
  if (nameEl) nameEl.value = urlQ || '';
  const countEl2 = document.getElementById('resultsCount');
  if (countEl2) countEl2.textContent = '0';

  load(true);
})();

/* ============================================================
   ENHANCEMENT LAYER — Scroll Reveals · 3D Tilt · Counter
   ============================================================ */
(function () {

  /* ── 1. Scroll-reveal: auto-tag and observe ── */
  const revealSelectors = [
    '.stream-grid .stream-card-item',
    '.featured-grid .college-search-card',
    '.reviews-grid .shiksha-review-card',
    '.reviews-grid .eduquest-review-card',
    '.exams-grid .exam-card',
    '.section-header',
    '.counsel-feature-card',
    '.counsel-step-card',
    '.college-detail-stat',
    '.compare-college-col',
  ];

  const revealTargets = [];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('eq-reveal');
      const mod = revealTargets.length % 4;
      if (mod === 1) el.classList.add('eq-reveal-delay-1');
      else if (mod === 2) el.classList.add('eq-reveal-delay-2');
      else if (mod === 3) el.classList.add('eq-reveal-delay-3');
      revealTargets.push(el);
    });
  });

  if (revealTargets.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObs.observe(el));
  }

  /* ── 2. 3D mouse-tilt for stream cards ── */
  document.querySelectorAll('.stream-card-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = 'none';
      card.style.transform = `perspective(600px) rotateX(${(-y * 20).toFixed(2)}deg) rotateY(${(x * 20).toFixed(2)}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s, border-color 0.25s, perspective 0.5s';
      card.style.transform = '';
    });
  });

  /* ── 3. Hero stats number counter ── */
  const statEls = document.querySelectorAll('.hero-stat-num');
  if (statEls.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d.]+)(.*)/);
        if (!match) return;
        const target = parseFloat(match[1]);
        const suffix = match[2];
        const isInt = Number.isInteger(target);
        const duration = 2400;
        const startTime = performance.now();
        const step = now => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = isInt ? Math.round(target * eased) : (target * eased).toFixed(1);
          el.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => countObs.observe(el));
  }

  /* ── 4. Button tactile press feedback ── */
  const pressSelectors = [
    '.btn-nav-primary', '.omni-submit-btn', '.btn-exam-action:not(.outline)',
    '.counsel-submit-btn', '.btn-primary-modal', '.footer-submit-btn',
    '.btn-card-primary', '.btn-compare-now', '.drawer-btn',
  ].join(',');
  document.querySelectorAll(pressSelectors).forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      btn.style.transform = 'translateY(1px) scale(0.97)';
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
      btn.addEventListener(evt, () => {
        btn.style.transform = '';
      });
    });
  });

})();
