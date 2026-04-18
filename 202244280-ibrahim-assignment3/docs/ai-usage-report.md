# AI Usage Report
## Assignment 3 — Ibrahim AL-Ghamdi

---

## Tools Used & Use Cases

### Claude (claude.ai)

I used Claude as my primary AI assistant throughout Assignment 3 in the following ways:

**1. Feature Planning**
Before writing any code I described my Assignment 2 portfolio and the Assignment 3 requirements to Claude. I asked which features would best satisfy each rubric criterion. Claude suggested the GitHub API for the API integration requirement (as it is free and needs no key), the combined filter-and-sort for complex logic, and `localStorage` for state management. This planning session saved me time by giving me a clear roadmap before touching the code.

**2. Code Generation**
I used Claude to generate initial drafts of:
- The `fetchGitHubRepos` function and the `renderRepos` rendering logic, including the demo-data fallback
- The `applyFilterAndSort` function that combines filter and sort in a single step
- The visitor greeter logic (read, write, reset with `localStorage`)
- The graduation countdown timer
- The enhanced contact form validation, including per-field error spans and the character counter

**3. Code Review & Debugging**
After writing the filter/sort logic myself, I pasted it into Claude and asked for a review. Claude pointed out that re-appending nodes (rather than manipulating `display` directly) is a clean way to reorder cards without re-parsing HTML, which I then adopted.

**4. CSS Help**
Claude helped me write the CSS for the `.repo-card` layout, the `.spinner` animation, and the `.controls-bar` responsive layout.

**5. Documentation**
I asked Claude to help structure both this report and the technical documentation, then filled in the specific details myself.

---

## Benefits & Challenges

### Benefits
- Claude helped me understand the GitHub API response shape before I started coding, so I knew exactly which fields (`name`, `description`, `language`, `stargazers_count`) I needed.
- It explained why `IntersectionObserver` is more performant than a `scroll` event listener, which I had not considered.
- It suggested using `{ passive: true }` on the scroll listener as a small but real performance gain.
- Generating boilerplate (like repetitive CSS card layouts) with Claude freed up time to focus on the logic.

### Challenges
- The first version of `renderRepos` Claude gave me used `.innerHTML` on each card inside a loop, which is inefficient. I switched to `document.createElement` and `appendChild` to avoid repeated HTML parsing.
- Claude's initial contact form validation used a single error paragraph at the bottom. I modified it to use per-field error spans, which is better for usability.
- I had to test every generated code snippet in the browser — some minor issues (such as animation restart logic) needed adjustment before working correctly.

---

## Learning Outcomes

Using Claude in Assignment 3 helped me learn:

- **GitHub REST API** — how to construct the URL with query parameters, what headers to send, and how to handle the JSON response.
- **Combining filter and sort** — how to write a single function that applies both operations in sequence rather than having two separate, conflicting DOM manipulations.
- **Passive event listeners** — how adding `{ passive: true }` to scroll/touch events allows the browser to optimise scrolling performance.
- **Node reordering** — that `appendChild` moves an existing node rather than duplicating it, making it a clean way to reorder DOM elements.
- **ARIA live regions** — how `aria-live="polite"` and `role="alert"` help screen readers announce dynamic content changes.

---

## Responsible Use & Modifications

Every piece of AI-generated code was:

1. **Read and understood** — I did not add anything I could not explain line by line.
2. **Tested in the browser** — each feature was verified to work correctly before being committed.
3. **Modified** — specific changes included:
   - Replaced `.innerHTML` loops with `createElement` / `appendChild` in `renderRepos`
   - Changed single-paragraph form error to per-field error spans
   - Added the `escapeHtml` utility function to sanitise API data before inserting into the DOM
   - Added the `getDemoRepos` fallback, which Claude did not initially suggest
   - Extended the contact form with subject-based success messages (my own idea)
   - Added `{ passive: true }` to the scroll listener after Claude explained why it matters

All AI usage is documented here in full transparency, in accordance with the academic integrity policy of this course.
