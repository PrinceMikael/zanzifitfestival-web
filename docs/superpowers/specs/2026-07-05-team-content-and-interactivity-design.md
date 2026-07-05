# ZanziFit Festival — Team Accuracy, Interactivity & Missing Pages

Date: 2026-07-05

## Context

Three new source files were added to the project root and are not yet reflected in the site:

- `Zanzifit Festival Profile Presentation.pdf` — the authoritative company profile (10 pages).
- `ZanziFit_Festival_Website_Blueprint.md` — a design/technical brief derived from that profile.
- `ZFit-Logo.jpg-removebg-preview.png` (transparent background) and `ZFit-Logo.jpg.jpeg` (solid background) — logo assets. No SVG logo file was found among the new files despite being mentioned verbally; this is a gap to flag, not fabricate.

Comparing the profile PDF against the live site surfaced concrete mismatches and gaps, listed below by area.

## 1. Leadership page — replace fabricated content with the real board

**Problem:** [app/leadership/page.tsx](../../../app/leadership/page.tsx) currently hard-codes four fictional people (Juma Salim, Amina Rashid, David Okoth, Sofia Mbwana) and four fabricated advisory organizations. None of this exists in the profile.

**Real data (from PDF page 7, "Meet Our Leadership Team"):**

| Name | Role |
|---|---|
| Ally Daudi | Founder and Executive Director |
| Salim Kikeke | Chairman of the Board member |
| Hassan Mussa | Project Manager & Board member |
| Mohamed Sharif | Director & Board member |
| Hassan Ali | Director & Board member |
| Walter Mwach | Board Secretary |

**Changes:**
- Extract the 6 portrait photos embedded in PDF page 7 (via PyMuPDF/pypdf, already proven to work in this session), crop/treat consistently (matching the existing grayscale→color hover treatment), and save to `public/images/leadership/`.
- Replace the `TEAM` array in `app/leadership/page.tsx` with the 6 real people above.
- Grid layout moves from 4-column to a 6-person layout (e.g. 2-col mobile / 3-col tablet / 6-col desktop, or a 3x2 grid — final call made during implementation to keep cards legible).
- Write short, reasonable, role-appropriate bios (1–2 sentences each) since the profile gives no bios — clearly generic in tone (no invented credentials, employers, or years of experience), easy for the client to replace with real copy later.
- Remove the fabricated "Advisory & Partners" section entirely (no advisor orgs are named in the profile). Replace with a "Board & Governance" framing — a brief line noting this is the full governing board, no invented list underneath.

## 2. Site-wide interactivity — custom cursor system

**Goal:** satisfy "the website should have a feel that connects with people... showing which component the person is navigating to."

**Approach:** a single `CustomCursor` client component mounted once in `app/layout.tsx`.

- A small dot follows the pointer with a slight lag (spring physics via Framer Motion, already a dependency).
- On hovering interactive elements (`a`, `button`, `[data-cursor-label]`), the cursor morphs: grows, gains a subtle ring, and can display a short label (e.g. "View", "Open", "Send") passed via a `data-cursor-label` attribute — used on gallery images, primary CTAs, and form submit buttons.
- Primary buttons (Register CTA, form submits) get a subtle magnetic pull toward the cursor within a small radius.
- Gated behind `@media (hover: hover) and (pointer: fine)` — no effect on touch devices, and native cursor stays untouched there. Respects `prefers-reduced-motion` (disables morph animation, keeps a static dot or nothing).
- Implemented as one small, isolated component — no changes to existing component internals needed beyond adding `data-cursor-label` attributes where it's worth labeling.

## 3. Image & interaction polish

- Extend the existing grayscale→color hover pattern (already used on Leadership photos) with the same restraint to Festival discipline images and About's finish-line image: subtle scale (1.0 → 1.03) on hover, consistent with `gallery-grid.tsx`'s existing `group-hover:scale-105`.
- No new visual language introduced — this is consistency work, using patterns already proven in the codebase (`group`/`group-hover`, gradient scrims, `Chevrons` as motion device), not a redesign.

## 4. Database recommendation (written only, no code)

Per the blueprint's Part 4, but scoped down to "what's true today, what's needed and when" since there's no hosting/DB provider chosen yet and this was explicitly deferred to a later planning conversation:

- **No database needed today:** all marketing pages (Home, About, Festival, Partnership, Leadership, Gallery, FAQ) are static content — no change.
- **Needed as soon as form submissions should persist:** Contact, Partnership Inquiry, Newsletter, and the new Register (pre-interest) form currently only simulate success in the browser (`setState` to a "sent" flag) and discard the data on refresh. The moment the client wants to actually see who submitted what, this needs a real datastore — even something as simple as a managed Postgres instance (Supabase/Neon) with one `submissions` table would close this gap without the full architecture below.
- **Needed before real registration/payment exists:** the full Part 4 architecture (Postgres + read replica, Redis, job queue, hosted checkout) — not needed until there's an actual payment flow to build, which is out of scope for this round of work.
- **Needed only for event-day live leaderboard:** the WebSocket/SSE fan-out design — explicitly a future, feature-flagged addition per the blueprint's own phasing (Phase 4), not needed pre-launch.

This will be delivered as a short markdown note (`docs/database-recommendation.md`) rather than any code changes.

## 5. Build the four missing pages

Currently, `SiteHeader` and `SiteFooter` link to `/gallery`, `/faq`, `/contact`, `/register` — all 404 today. `/live` (leaderboard) also 404s but per the blueprint is explicitly event-day-only/post-launch scope, so it's left alone.

All four new pages follow the existing page pattern: `PageHero` + `SectionHeading` + content sections, static rendering, matching design tokens.

- **`/gallery`** — wires up the existing, currently-unused `GalleryGrid` component (already fully built with filter tabs) behind a `PageHero`. Uses images already in `public/images/`.
- **`/faq`** — accordion-style Q&A (simple disclosure using native `<details>` or a small client component) covering: travel to Zanzibar, visa requirements, accommodation partners, what to bring, spectator info — per blueprint sitemap item 9. Content is reasonable placeholder copy flagged for client review (visas/travel specifics are exactly the kind of fact that shouldn't be invented confidently).
- **`/contact`** — validated contact form (see §6) + WhatsApp link + Fumba Town address + real contact details from the profile (`info@zanzifitfestival.com`, `+255 686 915 587`, `www.zanzifitfestival.com`).
- **`/register`** — category selector (Road Cycling / HYROX-Style / Corporate Team, reusing category names already defined in `app/festival/page.tsx`) as a pre-registration interest form: validated, simulated-success submission matching the Partnership Inquiry pattern. Explicitly framed in copy as "register your interest" / "we'll notify you when registration opens" — not a real checkout, since no payment provider exists yet.

## 6. Real form validation

**Problem:** `newsletter-form.tsx` and `partnership-inquiry.tsx` rely only on native HTML attributes (`required`, `type="email"`) with no visible error states, no format feedback beyond the browser's default tooltip, and the submit button is always enabled.

**Change:** a small shared validation helper (`lib/validation.ts`) with plain-function validators (`isValidEmail`, `isValidPhone`, `required`) — no new dependency, since the app has no form library installed and the forms are simple enough not to warrant one.

Applied consistently across all four forms (Newsletter, Partnership Inquiry, Contact, Register):
- Real-time field-level errors on blur, cleared on valid input.
- Accessible error messaging: `aria-invalid` on the field, `aria-describedby` pointing to the error text.
- Submit button disabled until the form is valid; on submit, re-validates everything and focuses the first invalid field if any slipped through.
- Existing "simulated success" UX pattern (swap form for a thank-you state) is kept as-is — validation only changes what happens before that point.

## 7. Light / dark theme

**Trigger:** the site currently ships a single fixed dark theme with no light variant. Added as a requirement after initial spec approval.

- **Selection logic:** a manual sun/moon toggle in `SiteHeader`, defaulting on first visit to the visitor's OS-level `prefers-color-scheme`. Choice is persisted in `localStorage` and re-applied on future visits, overriding system preference once set.
- **Palette:** the light theme reuses existing brand tokens rather than introducing new colors — `--bone` (`#EDE7D8`) becomes the light-mode background, `--ink` becomes light-mode foreground text, `--amber` and `--deep-teal` remain the accents in both themes. This keeps the "horizon meets start line" identity intact in both modes instead of genericizing to plain white/gray.
- **Mechanism:** `globals.css` already defines all component-facing colors as semantic tokens (`--background`, `--foreground`, `--card`, `--border`, etc.) consumed via Tailwind utility classes (`bg-background`, `text-bone`, `border-border`) rather than hardcoded colors — confirmed by reading every page/component file. Theme switching is implemented by adding a second token block scoped to `:root[data-theme="light"]` that remaps the semantic tokens to the Bone-based palette; a `data-theme` attribute on `<html>` (managed by a small `ThemeProvider` client component) toggles between blocks. No per-component changes needed for the common case since components already consume tokens, not raw colors.
- **Known exceptions requiring explicit review:** a few places currently assume the dark theme structurally, not just via token color:
  - `site-header.tsx` logo has `className="... invert lg:h-9"` — inverts a black-on-transparent logo to read white on dark backgrounds; must become conditional (no invert in light mode).
  - `site-footer.tsx` logo has the same `invert` class.
  - `PageHero`'s decorative radial-gradient background uses fixed `var(--amber)` / `var(--deep-teal)` at low opacity — should still read fine on a light background but gets visually verified during implementation.
  - Any component passing `tone="dark"` explicitly (the `SectionHeading` default) needs a check that "dark tone" still means "readable on the current theme's background," since that prop currently means "for use on a dark-background section" independent of site-wide theme — these are orthogonal concepts that need to be reconciled (see Task in the plan).

## Out of scope for this round

- Any real backend/database implementation (§4 is a recommendation doc only, per explicit instruction to plan this later).
- The `/live` leaderboard page.
- Real payment integration on `/register`.
- Sourcing/replacing the placeholder bios and FAQ specifics with client-confirmed copy — flagged inline in code comments where content is a placeholder, not fact-checked.
