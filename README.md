# Personal Portfolio Website
### Assignment 3 — Ibrahim AL-Ghamdi

A responsive, feature-rich personal portfolio website built with HTML, CSS, and vanilla JavaScript. This is the advanced version of the portfolio, expanding on Assignments 1 and 2 with API integration, complex logic, state management, and performance optimisations.

---

## Project Description

This portfolio showcases who I am, projects I have built, and a contact form. Assignment 3 adds major new functionality on top of Assignment 2:

- **GitHub API integration** — live repository cards fetched from the GitHub API, with a live search filter
- **Project filter + sort** — filter by tag (All/HTML/CSS/JS/API) and sort by name or date
- **Skill level filter** — show skills by level (Beginner / Intermediate / Advanced) with contextual messages
- **Visitor greeter** — stores the user's name in localStorage and personalises the visit
- **Visit timer** — counts how long the user has been on the page
- **Graduation countdown** — live countdown in the footer to a target graduation date
- **Enhanced contact form** — character counter, per-field error messages, subject-based success messages
- **Page loader** — animated progress bar on load
- **Back-to-top button** — appears on scroll
- **Performance** — lazy-loaded images, efficient CSS with variables, no unused code

---

## Pages & Sections

| Section | Description |
|---|---|
| Hero | Time-based greeting, CTA buttons, visit timer, fun fact widget |
| Visitor Greeter | Name input saved to localStorage; personalises the nav bar |
| About | Bio, skill level filter showing beginner/intermediate/advanced skills |
| Projects | Filterable and sortable project cards with empty state |
| GitHub | Live repository list from the GitHub API with search |
| Contact | Validated form with character count, subject selector, per-field errors |
| Footer | Graduation countdown timer |

---

## How to Run Locally

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

No installation, build tools, or server is required. An internet connection is needed for Google Fonts, the Fun Fact API, and the GitHub API.

---

## New Features (Assignment 3)

### API Integration
Live GitHub repository data is fetched from the GitHub REST API (`/users/{username}/repos`). Each repository is rendered as a card showing its name, description, language, stars, and forks. A live search input filters results in real time. If the API is unavailable, a friendly error with demo data is shown.

### Complex Logic
The project grid combines filter and sort: selecting a tag filters visible cards, then the sort order is applied on top of the filtered set. The skill level filter conditionally shows skills and displays a matching hint message. The contact form validates every field with specific rules (minimum length, email regex, character limit) and shows a different success message depending on the selected subject.

### State Management
The visitor greeter reads and writes the user's name to `localStorage`. It shows a welcome message on return visits and updates the navigation bar. The dark/light theme preference is also stored in `localStorage` and restored on every visit. The visit timer counts up from the moment the page loads.

### Performance
- Images use `loading="lazy"` and explicit `width`/`height` attributes to prevent layout shift.
- All styles use CSS variables, preventing duplicate values.
- No unused CSS or JavaScript.
- The page loader gives users visual feedback while assets load.
- The GitHub fetch is fire-and-forget — it does not block page rendering.

---

## AI Usage Summary

I used **Claude (claude.ai)** to assist with code generation, feature planning, and documentation. All AI-generated code was reviewed, tested, and modified before being included. See [`docs/ai-usage-report.md`](docs/ai-usage-report.md) for full details.

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

## Technologies Used

- HTML5 (semantic elements, ARIA attributes, lazy loading)
- CSS3 (Flexbox, Grid, CSS Variables, Animations, Transitions)
- Vanilla JavaScript (Fetch API, Intersection Observer, localStorage, async/await)
- Google Fonts (Syne, DM Sans)
- [Useless Facts API](https://uselessfacts.jsph.pl/) — free, no key required
- [GitHub REST API](https://docs.github.com/en/rest) — free, no key required for public repos

---

## Live Deployment

*(To be added — deploy to GitHub Pages or Netlify)*
