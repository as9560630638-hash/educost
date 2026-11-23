/* ============================================================
   ShikshaPortal — Interactive Features
   ============================================================ */

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

  if (searchInput) {
    searchInput.addEventListener('input', () => renderDropdown(searchInput.value));
    searchInput.addEventListener('focus', () => { if (searchInput.value) renderDropdown(searchInput.value); });
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
     COMPARE BAR
     ============================================================ */
  const compareBar    = $('#compareBar');
  const compareSlots  = $$('.compare-slot-placeholder');
  let selectedColleges = [];

  document.addEventListener('change', e => {
    if (!e.target.classList.contains('compare-chk')) return;
    const name = e.target.dataset.college;
    if (e.target.checked) {
      if (selectedColleges.length >= 3) {
        e.target.checked = false;
        showToast('Maximum 3 colleges can be compared at once.');
        return;
      }
      selectedColleges.push(name);
    } else {
      selectedColleges = selectedColleges.filter(n => n !== name);
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
          <span class="compare-slot-name">${selectedColleges[i]}</span>
          <button class="compare-slot-remove" data-college="${selectedColleges[i]}">×</button>
        </div>`;
      } else {
        html += `<div class="compare-slot"><span style="font-size:12px;color:#64748b">+ Add College</span></div>`;
      }
    }
    slotsContainer.innerHTML = html;

    $$('.compare-slot-remove', compareBar).forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.college;
        selectedColleges = selectedColleges.filter(n => n !== name);
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
      window.location.href = 'compare.html';
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
      background: '#0f172a', color: '#f8fafc',
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
  window.addEventListener('scroll', () => {
    if (!mainNav) return;
    if (window.scrollY > 10) {
      mainNav.style.boxShadow = '0 4px 16px rgba(15,23,42,0.1)';
    } else {
      mainNav.style.boxShadow = '0 2px 8px rgba(15,23,42,0.06)';
    }
  }, { passive: true });

  /* ============================================================
     COMPARE PAGE — ADD COLLEGE SLOT
     ============================================================ */
  $$('.add-college-slot').forEach(slot => {
    slot.addEventListener('click', () => showToast('Use the college search above to add a college for comparison.'));
  });

  /* Expose showModal globally */
  window.ShikshaPortal = { showModal, hideModal, showToast };

})();
