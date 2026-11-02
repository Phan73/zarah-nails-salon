# AGENTS.md — Global Agent Operating Principles & Unified Skill Standards

This document establishes the universal operating principles, behavioral standards, architectural guidelines, and design philosophies across all projects and coding sessions. These principles synthesize the engineering discipline, visual craftsmanship, frontend design intelligence, security rigor, and customization protocols attached to this workspace.

---

## 1. Core Engineering & Execution Discipline

### A. Think Before Coding
- **Surface assumptions explicitly:** Never proceed on unverified assumptions. When ambiguity exists, identify the trade-offs, state them plainly, and present clear options with a recommended default.
- **Push back constructively:** If a simpler, more robust, or more maintainable solution exists, advocate for it before implementing complexity.
- **Stop when blocked or confused:** Do not guess API contracts, schema structures, or business rules. Stop, name the exact missing detail, and ask or verify directly from the codebase.

### B. Simplicity First
- **Minimum effective code:** Implement the exact solution required. Avoid speculative configurability, premature abstractions, or over-engineered design patterns for single-use logic.
- **50-line rule:** If a task can be accomplished cleanly in 50 lines, rewrite any initial 200-line solution.
- **Prune unnecessary defensive code:** Do not construct elaborate handling for logically impossible edge cases; focus on clean, resilient happy paths and predictable error boundaries.

### C. Surgical Changes
- **Touch only what must be modified:** Match the surrounding architecture, conventions, and style, even if you would personally format it differently.
- **Zero collateral damage:** Never touch, refactor, or "clean up" unrelated working code, comments, or style rules without explicit instructions.
- **Clean up your own orphans:** Remove any imports, variables, functions, or styles that *your* change rendered obsolete. Leave pre-existing code untouched.
- **Traceability test:** Every single line changed in a git diff must trace directly back to the user's objective.

### D. Goal-Driven Verification Loop
- **Define verifiable completion criteria upfront:** Translate broad requests into concrete checks:
  1. *[Step]* → Verify: *[Automated test, terminal command, or visual verification]*
  2. *[Step]* → Verify: *[Status code, state assertion, or network check]*
- **Never claim a task is completed without running verification:** Run tests, build the bundle, check HTTP headers, and inspect real outputs before declaring success.
- **Loop independently:** When tests or builds fail, read the error message, diagnose the root cause, and iterate until green without waiting for the user to debug.

---

## 2. Distinctive Frontend & Visual Design Philosophy

### A. Ground Designs in the Subject Matter
- **Real subject vernacular:** Design decisions must originate from the client's actual industry, physical materials, client demographics, and service experience—never generic tech templates.
- **Authentic content first:** Use realistic copy, genuine prices, regional formats (e.g. NZD, E.164 phone numbers), and accurate service timelines. Reject generic Lorem Ipsum or placeholder filler.

### B. Eliminate Generic AI Design Tells
Reject the default tropes that signal automated, cookie-cutter output:
- **No generic warm cream + terracotta palettes** (e.g. `#F4F1EA` with `#D97757` or Anthropic clay) unless specifically mandated by the brief.
- **No stark near-black + acid-green/neon themes** masquerading as modern minimalism.
- **No repetitive "SaaS card kit" layouts:** Avoid cutting all content into identical rounded cards with identical border radii, soft gray shadows (`rgba(0,0,0,0.1)`), and decorative gradient washes.
- **No formulaic template chrome:**
  - Avoid tracked-out ALL-CAPS eyebrow tags above every single heading.
  - Avoid meta strings joined by endless middle dots (`Item · $45 · 45 mins`).
  - Avoid spaced em dashes (`WORD — description`) and tacked-on arrow emojis (`→`) on every button.
  - Avoid highlighting a single arbitrary word in a headline with contrasting bold/italic or distinct color.

### C. Typographic Hierarchy & Restraint
- **Intentional type pairings:** Use at most two distinct, purpose-driven type families (e.g., a high-character editorial serif paired with a clean, humanist geometric sans).
- **Line length and readability:** Restrict prose line lengths to under 80 characters. Provide generous line-height for serif body copy to guarantee comfort and elegance.
- **Structure is information, not decoration:** Borders, divider lines, and numbered markers (`01`, `02`, `03`) must only be used when content represents a real sequential process or hierarchy.

### D. The Principle of Restraint ("Remove One Accessory")
- **Spend your boldness in one place:** Let one element command the visual memory (e.g., an expressive typography treatment, an interactive swatch selector, or an editorial hero composition). Keep everything around it quiet, disciplined, and balanced.
- **Self-critique during creation:** Before finishing, inspect the layout and cut any decorative ornament that does not actively serve clarity or brand elevation.

---

## 3. Master Craftsmanship & Spatial Composition

### A. Visual-First Communication (90% Visual / 10% Essential Text)
- **Spatial communication:** Communicate brand quality and service hierarchy through spatial tension, rhythm, negative space, and composition rather than walls of explanatory text.
- **Embedded conceptual DNA:** Integrate subtle, sophisticated motifs and textures that echo the salon's craft (e.g. chrome iridescence, velvet magnetic streaks, organic curves) without lapsing into cartoonish illustration.

### B. Museum-Grade Execution Standards
- **Zero visual defects:** Check that padding, margins, alignment, and responsive viewports prevent any overlapping text, clipped elements, or broken layouts down to 360px mobile widths.
- **Deliberate micro-interactions:** Motion must be an answer to user intent (expanding, selecting, confirming), never unprompted page-load carousels or jarring entrance animations on every card.

---

## 4. UI/UX Intelligence, Token Systems & Island Hydration

### A. Cohesive Design Tokens
- Maintain centralized CSS variables for color palettes, elevation shadows, border radii, typography scales, and transition curves.
- Never write ad-hoc magic numbers across multiple components when design tokens already exist.

### B. Defend Against SSR / Hydration DOM Wipeouts
- **Guarded store hydration:** When hydrating client-side interactive islands from `localStorage` or stores, *never* clear server-rendered HTML if stored data is empty or uninitialized (`Array.isArray(stored) && stored.length > 0`).
- **Astro `<script is:inline>` integrity:** Never write TypeScript type assertions (`as HTMLInputElement`) inside inline browser scripts; browsers execute them verbatim and will throw fatal syntax errors that kill all event handlers.

---

## 5. Security, Authentication & Production Data Integrity

### A. Zero Authentication Shortcuts
- **Real OAuth & Identity Providers:** Always use genuine Google OAuth 2.0 / OpenID Connect, genuine Sign in with Apple, and genuine carrier SMS verification.
- **Never simulate sign-in:** Never accept an arbitrary email string, generate mock accounts from text inputs, or display verification codes in the browser DOM/console.
- **Account enumeration prevention:** Return consistent, generic authentication error messages for invalid sign-ins so attackers cannot probe for registered customer emails or phone numbers.
- **reCAPTCHA lifecycle safety:** Always tear down and replace the reCAPTCHA DOM container (`resetRecaptcha`) before re-initializing phone verification to eliminate `"reCAPTCHA has already been rendered in this element"` crashes.

### B. Non-Destructive Data Preservation
- **Never destroy business data:** Maintain all existing customer profiles, appointment histories, staff rosters, and loyalty points intact during migrations or code refactors.
- **Stable customer identity linkage:** Distinguish the authentication provider UID from the business customer profile and loyalty ledger.

---

## 6. Copywriting & Voice Standards

- **Active voice & clear verbs:** Use active, specific labels. A button says "Book Appointment" or "Save Changes," never "Submit" or "Click Here."
- **Consistency of vocabulary:** If a button says "Book Service," the subsequent confirmation panel, receipt, and notification must consistently refer to "Booking," not "Order" or "Reservation."
- **Dignified error handling:** Explain exactly what went wrong and provide immediate next steps. Never apologize profusely, and never present vague error banners.

---

## 7. Antigravity Customization Architecture & Workflow

- **Loading priority hierarchy:**
  1. Workspace Project (`.agents/`, `AGENTS.md` walking up to repo root)
  2. Declared project configurations (`skills.json`, `plugins.json`)
  3. Global machine configuration (`~/.gemini/config/`)
  4. Built-in system customizations
- **Progressive disclosure:** Keep rule files dense and under the 24 KB / 20,000 token limit. Structure procedures so high-level summaries guide the agent before full files are loaded on demand.
- **Sanctioned environment boundaries:** Always operate within documented permissions and sandboxes. Do not attempt to bypass access controls or spoof identities.
- **Production release discipline:** Keep the repository clean, commit with descriptive semantic commit messages, and ensure live deployments (e.g. Vercel, Firebase) track verified production branches.
