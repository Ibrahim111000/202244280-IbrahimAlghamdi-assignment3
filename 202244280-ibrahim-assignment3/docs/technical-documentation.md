# Technical Documentation
## Assignment 3 — Ibrahim AL-Ghamdi

---

## Project Overview

A personal portfolio website built with HTML5, CSS3, and vanilla JavaScript. Assignment 3 extends the previous portfolio with API integration, complex filtering and sorting logic, state management through `localStorage`, performance optimisations, and several interactive widgets.

---

## Folder Structure

```
id-name-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── sticky-note_15188321.png
│       └── snowing_3691310.png
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

---

## How to Run Locally

1. Download or clone the repository.
2. Open the project folder.
3. Double-click `index.html` to open in any modern browser.

No build tools, package managers, or server required. An internet connection is needed for Google Fonts, the Useless Facts API, and the GitHub API.

---

## File Descriptions

### `index.html`
The main HTML document. Uses semantic HTML5 elements (`header`, `nav`, `section`, `article`, `footer`). Key additions in Assignment 3:
- `data-theme` attribute on `<html>` for CSS variable switching
- Loader overlay with animated progress bar
- Visitor greeter section with name input
- Skill level filter buttons with `data-level` attributes
- Sort `<select>` alongside the filter bar
- GitHub repositories section with search input
- Enhanced contact form with subject selector and per-field error spans
- `loading="lazy"` on `<img>` tags
- Back-to-top button

### `css/styles.css`
All styling. Uses CSS custom properties for theming. Key additions:
- `:root` and `[data-theme="light"]` variable sets for full theme switching
- `.loader` / `.loader__bar` — top progress bar
- `.timer-widget` — pill-shaped visit counter
- `.sort-bar` / `.sort-select` — sort control
- `.controls-bar` — flex container for filter + sort
- `.repo-card` — GitHub repository card
- `.spinner` — CSS-only loading spinner
- `.github__grid` — auto-fill grid for repo cards
- `.field-error` / `.char-count` — form helpers
- `.back-to-top` — fixed scroll button
- `.reveal-init` / `.revealed` — scroll-reveal classes

### `js/script.js`
All JavaScript functionality. Organised into 14 clearly commented sections:

| # | Feature | API / Method |
|---|---|---|
| 1 | Page loader | `window.load` event |
| 2 | Theme toggle | `localStorage`, `data-theme` attribute |
| 3 | Smooth scrolling | `scrollTo`, `getBoundingClientRect` |
| 4 | Time-based greeting | `Date.getHours()` |
| 5 | Visit timer | `setInterval`, string padding |
| 6 | Fun fact widget | `fetch`, async/await, Useless Facts API |
| 7 | GitHub repositories | `fetch`, GitHub REST API, live search |
| 8 | Project filter + sort | DOM manipulation, `Array.sort`, `data-*` attributes |
| 9 | Skill level filter | Conditional class toggling, `data-level` |
| 10 | Contact form | Regex validation, char counting, per-field errors |
| 11 | Visitor greeter | `localStorage` read/write, DOM state switching |
| 12 | Scroll reveal | `IntersectionObserver` |
| 13 | Nav scroll + back-to-top | `scroll` event, `window.scrollY` |
| 14 | Graduation countdown | `setInterval`, date arithmetic |

---

## Feature Deep-Dives

### GitHub API Integration

```js
const res = await fetch(
  `https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated&type=public`,
  { headers: { Accept: 'application/vnd.github.v3+json' } }
);
```

The GitHub REST API is called with `fetch`. The response is an array of repository objects. Each is rendered as a `.repo-card`. If the API fails (rate limit, network error, or unknown user), the catch block loads a hardcoded demo array so the section always shows content. A live search input filters the in-memory `allRepos` array and re-renders cards without a new network call.

### Project Filter + Sort (Combined Complex Logic)

```js
function applyFilterAndSort() {
  // 1. Filter by tag
  let visible = allCards.filter(card => {
    if (currentFilter === 'all') return true;
    return (card.dataset.tags || '').split(' ').includes(currentFilter);
  });

  // 2. Sort the filtered set
  visible.sort((a, b) => {
    if (currentSort === 'name-asc')  return a.dataset.name.localeCompare(b.dataset.name);
    if (currentSort === 'date-new')  return b.dataset.date.localeCompare(a.dataset.date);
    // ... other cases
  });

  // 3. Re-append in order; hide non-matching cards
  allCards.forEach(c => { c.classList.add('hidden'); projectsGrid.appendChild(c); });
  visible.forEach(c => { c.classList.remove('hidden'); projectsGrid.appendChild(c); });

  // 4. Empty state
  projectsEmpty.hidden = visible.length > 0;
}
```

Filter and sort are run as a single combined step every time either control changes. Cards are never removed from the DOM — they are hidden with `.hidden` and re-ordered by re-appending, which avoids re-parsing HTML.

### State Management — Visitor Greeter

```js
// Read
const storedName = localStorage.getItem('visitorName');
if (storedName) showWelcome(storedName); else showAsk();

// Write
localStorage.setItem('visitorName', val);

// Delete
localStorage.removeItem('visitorName');
```

The greeter has two visual states (ask / welcome), both present in the HTML but toggled with `hidden`. The name is also injected into the nav bar for a personalised feel. Resetting removes the key from storage and returns to the ask state.

### Contact Form Validation

Rules checked before submission:
1. Name — not empty, minimum 2 characters
2. Email — not empty, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
3. Message — not empty, minimum 10 characters, maximum 500 characters

Each field has a dedicated `<span role="alert">` for its error message. A live character counter on the textarea turns amber at 90% and red at 100% of the limit. The success message is chosen from an object keyed by the selected subject value, demonstrating conditional output.

### Graduation Countdown

```js
const TARGET_DATE = new Date('2026-09-01T00:00:00');

function updateCountdown() {
  const diff  = TARGET_DATE - new Date();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  // ...
  countdownEl.textContent = `🎓 Graduation in ${days}d ${hours}h ${minutes}m`;
}
setInterval(updateCountdown, 60000);
```

---

## APIs Used

| API | URL | Auth | Response |
|---|---|---|---|
| Useless Facts | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` | None | `{ text: "..." }` |
| GitHub REST | `https://api.github.com/users/{user}/repos` | None (public) | Array of repo objects |

---

## Performance Optimisations

- `loading="lazy"` on all `<img>` elements — defers off-screen image loading
- Explicit `width` and `height` on images — prevents Cumulative Layout Shift (CLS)
- CSS variables — single source of truth, no duplicated values
- `IntersectionObserver` for scroll-reveal — more efficient than scroll event listeners
- `{ passive: true }` on the scroll event listener — improves scroll performance
- No third-party JS libraries — zero additional download weight
- GitHub repos rendered only after fetch resolves — does not block initial paint
- All animations use `transform` and `opacity` — GPU-composited, no layout thrashing

---

## Responsive Design

| Breakpoint | Changes |
|---|---|
| ≤ 768px | Nav links hidden; sections use reduced padding; controls stack vertically; GitHub search full-width |
| ≤ 480px | Hero title scales down further; CTA row stacks vertically |

---

## Accessibility

- ARIA labels on interactive controls (`aria-label`, `aria-live`, `role="alert"`, `role="group"`)
- Semantic HTML5 landmarks (`header`, `nav`, `section`, `footer`, `article`)
- Focus styles preserved on all inputs
- Alt text on all images
- Colour contrast meets WCAG AA in both dark and light themes

---

## Browser Compatibility

Tested and working on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

APIs used (Fetch, IntersectionObserver, localStorage, CSS Variables) are supported in all modern browsers.

---

## Known Limitations

- The contact form simulates sending (1.2 s delay) — no back end.
- The GitHub API has a rate limit of 60 requests/hour for unauthenticated requests. Demo data is shown if the limit is hit.
- No live deployment link at this stage.
