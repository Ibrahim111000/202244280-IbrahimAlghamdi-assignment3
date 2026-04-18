/* ═══════════════════════════════════════════════════════════
   script.js — Ibrahim AL-Ghamdi | Assignment 3
   Features:
     1.  Page loader
     2.  Dark / light theme toggle (localStorage)
     3.  Smooth scrolling
     4.  Greeting by time of day
     5.  Visit timer (counter)
     6.  Fun fact widget (public API)
     7.  GitHub repositories (API integration)
     8.  Project filter + sort (complex logic)
     9.  Skill level filter (complex logic / conditional display)
    10.  Contact form — full validation + char count
    11.  Visitor name / greeter (state management)
    12.  Scroll reveal (Intersection Observer)
    13.  Nav scroll shadow + back-to-top button
    14.  Event countdown in footer (counter)
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. PAGE LOADER
───────────────────────────────────────── */
const loader    = document.getElementById('loader');
const loaderBar = loader.querySelector('.loader__bar');

// Animate the top progress bar then fade out
loaderBar.style.width = '70%';
window.addEventListener('load', () => {
  loaderBar.style.width = '100%';
  setTimeout(() => loader.classList.add('done'), 350);
  setTimeout(() => loader.remove(), 800);
});


/* ─────────────────────────────────────────
   2. DARK / LIGHT THEME TOGGLE
───────────────────────────────────────── */
const toggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Restore saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';

toggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀' : '☾';
  localStorage.setItem('theme', next);
});


/* ─────────────────────────────────────────
   3. SMOOTH SCROLLING
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.nav').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────
   4. GREETING BY TIME OF DAY
───────────────────────────────────────── */
function setGreeting() {
  const hour = new Date().getHours();
  const el   = document.getElementById('timeBadge');
  if (!el) return;

  let msg;
  if (hour >= 5  && hour < 12) msg = 'Good morning ☀️';
  else if (hour >= 12 && hour < 17) msg = 'Good afternoon 🌤';
  else if (hour >= 17 && hour < 21) msg = 'Good evening 🌇';
  else                              msg = 'Up late? 🌙';

  el.textContent = msg;
}
setGreeting();


/* ─────────────────────────────────────────
   5. VISIT TIMER (counter)
───────────────────────────────────────── */
const timerEl = document.getElementById('visitTimer');
let seconds   = 0;

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

setInterval(() => {
  seconds++;
  timerEl.textContent = formatTime(seconds);
}, 1000);


/* ─────────────────────────────────────────
   6. FUN FACT WIDGET  (public API)
───────────────────────────────────────── */
const factText    = document.getElementById('factText');
const factRefresh = document.getElementById('factRefresh');

async function fetchFact() {
  factText.textContent = 'Loading a fun fact…';
  factText.classList.add('loading');
  factRefresh.disabled = true;

  try {
    const res  = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',
      { headers: { Accept: 'application/json' } });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    factText.classList.remove('loading', 'fade-in');
    void factText.offsetWidth; // restart animation
    factText.textContent = data.text;
    factText.classList.add('fade-in');

  } catch {
    factText.classList.remove('loading');
    factText.textContent = '⚠️ Could not load a fact right now. Try again!';
  } finally {
    factRefresh.disabled = false;
  }
}

fetchFact();
factRefresh.addEventListener('click', fetchFact);


/* ─────────────────────────────────────────
   7. GITHUB REPOSITORIES  (API integration)
───────────────────────────────────────── */
const GITHUB_USER  = 'ibrahimalghamdi'; // portfolio username
const githubGrid   = document.getElementById('githubGrid');
const githubError  = document.getElementById('githubError');
const githubStats  = document.getElementById('githubStats');
const githubSearch = document.getElementById('githubSearch');
const githubRetry  = document.getElementById('githubRetry');

let allRepos = [];

// Language colour map (common languages)
const langColors = {
  JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
  Python: '#3572A5', TypeScript: '#2b7489', Java: '#b07219',
  'C++': '#f34b7d', Markdown: '#083fa1', Shell: '#89e051',
};

function renderRepos(repos) {
  githubGrid.innerHTML = '';

  if (repos.length === 0) {
    githubGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--text-muted);padding:2rem 0;">No repositories match your search.</p>`;
    githubStats.innerHTML = '';
    return;
  }

  githubStats.innerHTML = `Showing <span>${repos.length}</span> of <span>${allRepos.length}</span> repos`;

  repos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'repo-card reveal-init';

    const langDot   = repo.language
      ? `<span class="repo-card__lang" style="background:${langColors[repo.language] || 'var(--accent)'}"></span> ${repo.language}`
      : '';
    const starsHtml = `⭐ ${repo.stargazers_count}`;
    const forksHtml = `🍴 ${repo.forks_count}`;

    card.innerHTML = `
      <span class="repo-card__name">${escapeHtml(repo.name)}</span>
      <span class="repo-card__desc">${escapeHtml(repo.description || 'No description provided.')}</span>
      <div class="repo-card__meta">
        ${repo.language ? `<span>${langDot}</span>` : ''}
        <span>${starsHtml}</span>
        <span>${forksHtml}</span>
      </div>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card__link">View on GitHub ↗</a>
    `;

    githubGrid.appendChild(card);
    // Trigger scroll-reveal for newly added cards
    revealObserver.observe(card);
  });
}

async function fetchGitHubRepos() {
  githubGrid.innerHTML = `
    <div class="github__loading" id="githubLoading">
      <div class="spinner"></div>
      <p>Fetching repositories…</p>
    </div>`;
  githubError.hidden = true;

  try {
    // Fetch up to 30 public repos, sorted by most recently updated
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated&type=public`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    // If GitHub API returns 404/rate-limit, use demo data
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);

    allRepos = await res.json();
    if (!Array.isArray(allRepos) || allRepos.length === 0) throw new Error('No repos');

    renderRepos(allRepos);

  } catch {
    // Show friendly fallback with demo/placeholder repos
    allRepos = getDemoRepos();
    renderRepos(allRepos);
    githubStats.innerHTML = `<span style="color:var(--text-muted);font-size:0.78rem;">📡 Showing demo data (API unavailable)</span>`;
  }
}

function getDemoRepos() {
  return [
    { name: 'portfolio-website', description: 'My personal portfolio built with HTML, CSS, and JavaScript.', language: 'HTML', stargazers_count: 4, forks_count: 1, html_url: '#' },
    { name: 'weather-app', description: 'A city weather app using the OpenWeatherMap API.', language: 'JavaScript', stargazers_count: 2, forks_count: 0, html_url: '#' },
    { name: 'todo-list', description: 'A minimal to-do list with localStorage persistence.', language: 'JavaScript', stargazers_count: 3, forks_count: 1, html_url: '#' },
    { name: 'css-grid-playground', description: 'Interactive CSS grid layout playground and cheatsheet.', language: 'CSS', stargazers_count: 1, forks_count: 0, html_url: '#' },
    { name: 'quiz-app', description: 'A quiz app that fetches questions from the Open Trivia API.', language: 'JavaScript', stargazers_count: 5, forks_count: 2, html_url: '#' },
    { name: 'landing-page-template', description: 'Responsive landing page template with dark mode.', language: 'HTML', stargazers_count: 7, forks_count: 3, html_url: '#' },
  ];
}

// Live search filter on repos
githubSearch.addEventListener('input', () => {
  const q = githubSearch.value.trim().toLowerCase();
  const filtered = allRepos.filter(r =>
    r.name.toLowerCase().includes(q) ||
    (r.description || '').toLowerCase().includes(q)
  );
  renderRepos(filtered);
});

githubRetry.addEventListener('click', fetchGitHubRepos);
fetchGitHubRepos();


/* ─────────────────────────────────────────
   8. PROJECT FILTER + SORT  (complex logic)
───────────────────────────────────────── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const sortSelect    = document.getElementById('sortSelect');
const projectsGrid  = document.getElementById('projectsGrid');
const projectsEmpty = document.getElementById('projectsEmpty');
const clearFilterBtn = document.getElementById('clearFilter');

let currentFilter = 'all';
let currentSort   = 'default';

// Collect all cards once
const allCards = Array.from(projectsGrid.querySelectorAll('.card'));

// Store original order for "default" sort
const originalOrder = [...allCards];

function applyFilterAndSort() {
  // Step 1: filter by tag
  let visible = allCards.filter(card => {
    if (currentFilter === 'all') return true;
    return (card.dataset.tags || '').split(' ').includes(currentFilter);
  });

  // Step 2: sort the visible set
  visible.sort((a, b) => {
    if (currentSort === 'default') {
      return originalOrder.indexOf(a) - originalOrder.indexOf(b);
    }
    if (currentSort === 'name-asc')  return a.dataset.name.localeCompare(b.dataset.name);
    if (currentSort === 'name-desc') return b.dataset.name.localeCompare(a.dataset.name);
    if (currentSort === 'date-new')  return b.dataset.date.localeCompare(a.dataset.date);
    if (currentSort === 'date-old')  return a.dataset.date.localeCompare(b.dataset.date);
    return 0;
  });

  // Step 3: remove all cards from DOM, re-append in sorted order
  allCards.forEach(c => {
    c.classList.add('hidden');
    projectsGrid.appendChild(c); // keep all in DOM for smooth filter
  });

  visible.forEach(c => {
    c.classList.remove('hidden');
    projectsGrid.appendChild(c); // move visible ones to top in correct order
  });

  // Step 4: show / hide empty state
  projectsEmpty.hidden = visible.length > 0;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilterAndSort();
  });
});

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  applyFilterAndSort();
});

clearFilterBtn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  currentFilter = 'all';
  currentSort   = 'default';
  sortSelect.value = 'default';
  applyFilterAndSort();
});


/* ─────────────────────────────────────────
   9. SKILL LEVEL FILTER  (conditional display)
───────────────────────────────────────── */
const levelBtns  = document.querySelectorAll('.level-btn');
const skillsList = document.getElementById('skillsList');
const skillsHint = document.getElementById('skillsHint');

const levelMessages = {
  beginner:     'Showing foundational skills.',
  intermediate: 'Showing skills I use daily.',
  advanced:     'Showing my strongest areas.',
  all:          '',
};

levelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    levelBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const level = btn.dataset.level;
    skillsHint.textContent = levelMessages[level] || '';

    skillsList.querySelectorAll('span').forEach(skill => {
      if (level === 'all' || skill.dataset.level === level) {
        skill.classList.remove('hidden');
      } else {
        skill.classList.add('hidden');
      }
    });
  });
});


/* ─────────────────────────────────────────
   10. CONTACT FORM — VALIDATION + CHAR COUNT
───────────────────────────────────────── */
const form          = document.getElementById('contactForm');
const feedbackEl    = document.getElementById('formFeedback');
const messageArea   = document.getElementById('message');
const charCountEl   = document.getElementById('charCount');
const submitBtn     = document.getElementById('submitBtn');
const MAX_CHARS     = 500;

// Live character counter
messageArea.addEventListener('input', () => {
  const len = messageArea.value.length;
  charCountEl.textContent = `${len} / ${MAX_CHARS}`;
  charCountEl.className   = 'char-count';
  if (len > MAX_CHARS * 0.9) charCountEl.classList.add('warn');
  if (len > MAX_CHARS)       charCountEl.classList.add('over');
});

// Helpers
function showFieldError(fieldId, errorId, msg) {
  document.getElementById(fieldId).classList.add('error');
  document.getElementById(errorId).textContent = msg;
}
function clearFieldError(fieldId, errorId) {
  document.getElementById(fieldId).classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Reset previous state
  feedbackEl.textContent = '';
  feedbackEl.className   = 'form__feedback';
  ['name', 'email', 'message'].forEach(f => clearFieldError(f, `${f}Error`));

  const nameVal    = form.name.value.trim();
  const emailVal   = form.email.value.trim();
  const messageVal = form.message.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const subjectVal = document.getElementById('subject').value;

  let valid = true;

  // Validate name: not empty, at least 2 characters
  if (!nameVal || nameVal.length < 2) {
    showFieldError('name', 'nameError', 'Please enter your full name (at least 2 characters).');
    valid = false;
  }

  // Validate email
  if (!emailVal || !emailRegex.test(emailVal)) {
    showFieldError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate message: not empty, at least 10 chars, not over limit
  if (!messageVal || messageVal.length < 10) {
    showFieldError('message', 'messageError', 'Message must be at least 10 characters.');
    valid = false;
  } else if (messageVal.length > MAX_CHARS) {
    showFieldError('message', 'messageError', `Message must be under ${MAX_CHARS} characters.`);
    valid = false;
  }

  if (!valid) {
    feedbackEl.textContent = 'Please fix the errors above.';
    feedbackEl.classList.add('error');
    return;
  }

  // Show different success messages based on subject (complex logic)
  const successMessages = {
    opportunity:   "✓ Thanks for the opportunity! I'll get back to you soon.",
    collaboration: "✓ Love it! Let's collaborate — I'll be in touch.",
    feedback:      "✓ Feedback received — thank you!",
    other:         "✓ Message sent! I'll reply soon.",
    '':            "✓ Message sent! I'll get back to you soon.",
  };

  // Simulate sending
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    form.reset();
    charCountEl.textContent = `0 / ${MAX_CHARS}`;
    charCountEl.className   = 'char-count';
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send message →';
    feedbackEl.textContent  = successMessages[subjectVal] || successMessages[''];
  }, 1200);
});


/* ─────────────────────────────────────────
   11. VISITOR GREETER  (state management)
───────────────────────────────────────── */
const greeterAsk     = document.getElementById('greeterAsk');
const greeterWelcome = document.getElementById('greeterWelcome');
const greeterName    = document.getElementById('greeterName');
const nameInput      = document.getElementById('visitorNameInput');
const greeterSubmit  = document.getElementById('greeterSubmit');
const greeterReset   = document.getElementById('greeterReset');
const navVisitor     = document.getElementById('navVisitor');
const navVisitorName = document.getElementById('navVisitorName');

function showWelcome(name) {
  greeterAsk.hidden     = true;
  greeterWelcome.hidden = false;
  greeterName.textContent = name;
  navVisitorName.textContent = name;
  navVisitor.hidden = false;
}

function showAsk() {
  greeterAsk.hidden     = false;
  greeterWelcome.hidden = true;
  navVisitor.hidden     = true;
}

// Restore from localStorage
const storedName = localStorage.getItem('visitorName');
if (storedName) showWelcome(storedName);
else            showAsk();

greeterSubmit.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (!val) { nameInput.focus(); return; }
  localStorage.setItem('visitorName', val);
  showWelcome(val);
});

nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') greeterSubmit.click();
});

greeterReset.addEventListener('click', () => {
  localStorage.removeItem('visitorName');
  nameInput.value = '';
  showAsk();
});


/* ─────────────────────────────────────────
   12. SCROLL REVEAL  (Intersection Observer)
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .about__grid, .contact__form, .greeter__card, .repo-card')
  .forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });


/* ─────────────────────────────────────────
   13. NAV SCROLL SHADOW + BACK TO TOP
───────────────────────────────────────── */
const mainNav   = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  mainNav.classList.toggle('scrolled', scrolled);
  backToTop.hidden = !scrolled;
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────
   14. FOOTER COUNTDOWN  (event countdown)
───────────────────────────────────────── */
const countdownEl   = document.getElementById('footerCountdown');
const TARGET_DATE   = new Date('2026-09-01T00:00:00'); // Graduation target

function updateCountdown() {
  const now   = new Date();
  const diff  = TARGET_DATE - now;

  if (diff <= 0) {
    countdownEl.textContent = '🎓 Graduated!';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  countdownEl.textContent = `🎓 Graduation in ${days}d ${hours}h ${minutes}m`;
}

updateCountdown();
setInterval(updateCountdown, 60000);


/* ─────────────────────────────────────────
   UTILITY
───────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}