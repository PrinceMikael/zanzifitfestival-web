# Visual Polish: Layout Density, Theme Contrast, Cursor, Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix site-wide light-mode contrast (theme-aware section tokens), fill empty hero space on wide viewports (PageHero image slot + About Zanzibar restructure), enlarge the header logo, fix cursor contrast, and roughly double content density on `/experience` and `/accommodation`.

**Architecture:** Two new CSS custom-property tokens (`--surface-dark`, `--surface-dark-soft`, `--surface-dark-foreground`) that flip under `[data-theme='light']`, exposed as Tailwind utilities and migrated into across all page-body content (site-wide, including the homepage) while `site-header.tsx`/`site-footer.tsx` keep their literal always-dark styling unchanged. `PageHero` gains a backward-compatible optional `image` prop. Content additions are local `const` array extensions following the existing pattern in both pages.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react icons.

## Global Constraints

- No test framework exists in this project — verification per task is `tsc --noEmit` clean plus a manual browser check (both light and dark theme, both a wide and a narrow viewport) against the running dev server, using `npx pnpm <cmd>` since plain `pnpm` isn't on PATH in this environment.
- `eslint` is not installed as a dependency in this project (confirmed pre-existing) — do not attempt to run `npx pnpm lint`.
- New CSS tokens: `--surface-dark: var(--ink)` / `--surface-dark-soft: var(--ink-soft)` / `--surface-dark-foreground: var(--bone)` / `--surface-dark-foreground-muted: var(--bone-muted)` in `:root`; under `:root[data-theme='light']`: `--surface-dark: var(--bone)` / `--surface-dark-soft: #e4ddc9` / `--surface-dark-foreground: var(--ink)` / `--surface-dark-foreground-muted: rgba(11, 14, 18, 0.62)`. Exposed as `--color-surface-dark`, `--color-surface-dark-soft`, `--color-surface-dark-foreground` in the `@theme inline` block, giving Tailwind utilities `bg-surface-dark`, `bg-surface-dark-soft`, `text-surface-dark-foreground`.
- **KEEP LITERAL, never touch:** `components/site-header.tsx`, `components/site-footer.tsx` (both have code comments explaining they're deliberately always-dark nav chrome), `components/custom-cursor.tsx`, `components/newsletter-form.tsx` (only rendered inside the always-dark footer), `components/theme-toggle.tsx` (only rendered inside the always-dark header), and every photo-overlay scrim/badge (`bg-ink/70`, `bg-ink/80` combined with `absolute` + `backdrop-blur` sitting over an `<Image>`) — these must keep their literal `bg-ink`/`bg-ink-soft` classes exactly as-is.
- `bg-deep-teal` sections and any `text-bone` foreground text inside them stay literal (not migrated) — `--deep-teal` is a fixed accent color, not a dark/light pair, and doesn't change between themes.
- WhatsApp number for all enquiry links stays `255686915587`, unchanged by this plan.
- New content additions (places, properties) must be widely-documented general-knowledge facts or real, named, verifiable businesses — never invent a name. Every new named property/place in this plan was already verified via live search during design (see spec's "Migration audit" and content-density sections); write it exactly as specified, don't add further embellishment.
- Follow existing design tokens/patterns exactly elsewhere (radii, spacing scale, `Chevrons` component, `font-display`/`font-utility` type classes) — do not introduce new colors or spacing scales beyond the two new surface tokens defined in this plan.

---

### Task 1: Add theme-aware surface tokens to `globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing (foundational CSS change).
- Produces: Tailwind utility classes `bg-surface-dark`, `bg-surface-dark-soft`, `text-surface-dark-foreground` available to every subsequent task in this plan.

- [ ] **Step 1: Add the new custom properties to `:root`**

In `app/globals.css`, after line 22 (`--ink-muted: rgba(11, 14, 18, 0.62);`), add:

```css
  --surface-dark: var(--ink);
  --surface-dark-soft: var(--ink-soft);
  --surface-dark-foreground: var(--bone);
  --surface-dark-foreground-muted: var(--bone-muted);
```

- [ ] **Step 2: Add the light-theme override**

In `app/globals.css`, inside the existing `:root[data-theme='light']` block (currently lines 56-68), after line 67 (`--input: rgba(11, 14, 18, 0.16);`), add:

```css
  --surface-dark: var(--bone);
  --surface-dark-soft: #e4ddc9;
  --surface-dark-foreground: var(--ink);
  --surface-dark-foreground-muted: rgba(11, 14, 18, 0.62);
```

- [ ] **Step 3: Expose as Tailwind utilities**

In `app/globals.css`, inside the `@theme inline` block, after line 97 (`--color-ember: var(--ember);`), add:

```css
  --color-surface-dark: var(--surface-dark);
  --color-surface-dark-soft: var(--surface-dark-soft);
  --color-surface-dark-foreground: var(--surface-dark-foreground);
```

- [ ] **Step 4: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors (CSS changes don't affect TypeScript, but this confirms the dev environment is still healthy before further changes).

- [ ] **Step 5: Verify the new utilities compile**

With the dev server running (`npx pnpm dev`), load any page and check the browser devtools computed-styles panel, or add a temporary test: confirm `bg-surface-dark` and `text-surface-dark-foreground` are valid, recognized Tailwind classes (no "unknown utility" warning in the terminal running `next dev`). Remove any temporary test markup before moving on.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "Add theme-aware surface-dark CSS tokens"
```

---

### Task 2: Migrate homepage components (`hero.tsx`, `countdown.tsx`, `disciplines.tsx`, `stats-band.tsx`, `why-zanzibar.tsx`, `partner-strip.tsx`, `cta-band.tsx`)

**Files:**
- Modify: `components/hero.tsx`
- Modify: `components/countdown.tsx`
- Modify: `components/disciplines.tsx`
- Modify: `components/stats-band.tsx`
- Modify: `components/why-zanzibar.tsx`
- Modify: `components/partner-strip.tsx`
- Modify: `components/cta-band.tsx`

**Interfaces:**
- Consumes: `bg-surface-dark`, `bg-surface-dark-soft`, `text-surface-dark-foreground` from Task 1.
- Produces: nothing consumed by later tasks (these are leaf page-section components, only ever rendered by `app/page.tsx`).

This task makes the whole homepage respect the theme toggle (previously it was always dark regardless of theme, per user decision documented in the design spec's "Corrected from an earlier draft" section). Every literal `bg-ink`/`bg-ink-soft`/`text-bone` on page-body content migrates; every photo-overlay scrim/badge stays literal.

- [ ] **Step 1: `components/hero.tsx` — migrate the section background and text**

Change line 28:
```tsx
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-16 lg:pt-20"
```
to:
```tsx
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-surface-dark pt-16 lg:pt-20"
```

Change line 46 (gradient scrim — this is a legibility scrim over the background art layers, but since the whole section now migrates, the gradient must reference the new token too so it doesn't clash):
```tsx
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
```
to:
```tsx
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/45 to-surface-dark/20" />
```

Change line 56 (`text-bone/80`):
```tsx
              <span className="eyebrow text-bone/80">
```
to:
```tsx
              <span className="eyebrow text-surface-dark-foreground/80">
```

Change line 61 (`text-bone`):
```tsx
          <h1 className="mt-6 text-balance font-display text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.02em] text-bone sm:text-7xl lg:text-[6.5rem]">
```
to:
```tsx
          <h1 className="mt-6 text-balance font-display text-[3.35rem] font-semibold leading-[0.95] tracking-[-0.02em] text-surface-dark-foreground sm:text-7xl lg:text-[6.5rem]">
```

Change line 67 (`text-bone/75`):
```tsx
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-bone/75 lg:text-xl">
```
to:
```tsx
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/75 lg:text-xl">
```

Change line 74 (`text-bone/55`):
```tsx
            <p className="eyebrow mb-3 text-bone/55">Countdown to race day</p>
```
to:
```tsx
            <p className="eyebrow mb-3 text-surface-dark-foreground/55">Countdown to race day</p>
```

Change line 88 (`text-bone` in the "Become a Partner" link):
```tsx
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-bone/30 px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-amber hover:text-amber"
```
to:
```tsx
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-surface-dark-foreground/30 px-7 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
```

Change line 98 (`text-bone/45`):
```tsx
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-bone/45">
```
to:
```tsx
        <div className="flex rotate-90 items-center gap-1 font-utility text-[0.65rem] uppercase tracking-[0.3em] text-surface-dark-foreground/45">
```

Line 42's `text-ink/85` (the `AthleteSilhouette` fill color) stays as-is — it's the silhouette's own fixed contrast color against the horizon art layer beneath it, not page-body text, and isn't part of this migration.

- [ ] **Step 2: `components/countdown.tsx` — migrate the tile background and label**

Change line 43:
```tsx
          className="flex min-w-[3.75rem] flex-col items-center rounded-sm border border-border bg-ink/60 px-2 py-2.5 backdrop-blur-sm sm:min-w-[4.5rem] sm:px-3"
```
to:
```tsx
          className="flex min-w-[3.75rem] flex-col items-center rounded-sm border border-border bg-surface-dark/60 px-2 py-2.5 backdrop-blur-sm sm:min-w-[4.5rem] sm:px-3"
```

Change line 48:
```tsx
          <span className="mt-1 font-utility text-[0.6rem] uppercase tracking-[0.2em] text-bone/55">
```
to:
```tsx
          <span className="mt-1 font-utility text-[0.6rem] uppercase tracking-[0.2em] text-surface-dark-foreground/55">
```

Line 45's `text-ember` stays as-is (a distinct accent color, not part of this migration).

- [ ] **Step 3: `components/disciplines.tsx` — migrate the section, card, and text (not the badge)**

Change line 29:
```tsx
    <section className="border-t border-border bg-ink py-20 lg:py-28">
```
to:
```tsx
    <section className="border-t border-border bg-surface-dark py-20 lg:py-28">
```

Change line 42:
```tsx
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-ink-soft transition-colors hover:border-amber/50"
```
to:
```tsx
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface-dark-soft transition-colors hover:border-amber/50"
```

Change line 52 (gradient over the image, paired with the card surface — migrates together since it's blending into the card, not scrimming for badge legibility):
```tsx
                <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/20 to-transparent" />
```
to:
```tsx
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-soft via-surface-dark-soft/20 to-transparent" />
```

**Line 53 (`bg-ink/70` tag badge) stays exactly as-is — KEEP LITERAL, do not touch.** It's a `backdrop-blur-sm` badge sitting over the photo for legibility.

Change line 60 (`text-bone`):
```tsx
                  <h3 className="font-display text-3xl text-bone lg:text-4xl">
```
to:
```tsx
                  <h3 className="font-display text-3xl text-surface-dark-foreground lg:text-4xl">
```

Change line 63 (`text-bone/40`):
```tsx
                  <ArrowUpRight className="size-6 shrink-0 text-bone/40 transition-colors group-hover:text-amber" />
```
to:
```tsx
                  <ArrowUpRight className="size-6 shrink-0 text-surface-dark-foreground/40 transition-colors group-hover:text-amber" />
```

Change line 65 (`text-bone/65`):
```tsx
                <p className="mt-4 text-pretty leading-relaxed text-bone/65">
```
to:
```tsx
                <p className="mt-4 text-pretty leading-relaxed text-surface-dark-foreground/65">
```

Change line 73 (`text-bone/70`):
```tsx
                      className="rounded-sm border border-border px-3 py-1.5 font-utility text-xs uppercase tracking-[0.12em] text-bone/70"
```
to:
```tsx
                      className="rounded-sm border border-border px-3 py-1.5 font-utility text-xs uppercase tracking-[0.12em] text-surface-dark-foreground/70"
```

Change line 85 (`text-bone/50`):
```tsx
                    <div className="mt-1 font-utility text-xs uppercase tracking-[0.16em] text-bone/50">
```
to:
```tsx
                    <div className="mt-1 font-utility text-xs uppercase tracking-[0.16em] text-surface-dark-foreground/50">
```

Change line 89 (`text-bone/70`):
```tsx
                  <span className="font-utility text-xs uppercase tracking-[0.16em] text-bone/70 group-hover:text-amber">
```
to:
```tsx
                  <span className="font-utility text-xs uppercase tracking-[0.16em] text-surface-dark-foreground/70 group-hover:text-amber">
```

- [ ] **Step 4: `components/stats-band.tsx` — migrate only the non-deep-teal-dependent text (keep deep-teal foreground literal)**

The section itself (`bg-deep-teal`) and its `text-bone/80`, `text-bone`, `text-bone/70` all stay **literal, unchanged** — per the KEEP LITERAL rule for `bg-deep-teal` sections in Global Constraints. Make no changes to this file. (Included here for completeness of the audit trail — verify by reading the file that all `text-bone` usages are inside the `bg-deep-teal` section before skipping.)

- [ ] **Step 5: `components/why-zanzibar.tsx` — migrate the section and text**

Change line 8:
```tsx
    <section className="border-t border-border bg-ink py-20 lg:py-28">
```
to:
```tsx
    <section className="border-t border-border bg-surface-dark py-20 lg:py-28">
```

Change line 26 (`text-bone`):
```tsx
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
```
to:
```tsx
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-surface-dark-foreground sm:text-5xl">
```

Change line 29 (`text-bone/70`):
```tsx
          <p className="mt-5 text-pretty text-lg leading-relaxed text-bone/70">
```
to:
```tsx
          <p className="mt-5 text-pretty text-lg leading-relaxed text-surface-dark-foreground/70">
```

Change line 38 (`text-bone` hover state — note this is a `hover:text-bone` on an amber link, migrate the hover target color):
```tsx
            className="mt-8 inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-bone"
```
to:
```tsx
            className="mt-8 inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground"
```

Line 18's `from-ink/50` (gradient over the dhow photo) stays as-is — KEEP LITERAL, it's a photo-legibility scrim.

- [ ] **Step 6: `components/partner-strip.tsx` — migrate the section and text**

Change line 23:
```tsx
    <section className="border-t border-border bg-ink py-16 lg:py-20">
```
to:
```tsx
    <section className="border-t border-border bg-surface-dark py-16 lg:py-20">
```

Change line 26 (`text-bone/55`):
```tsx
          <p className="eyebrow text-bone/55">
```
to:
```tsx
          <p className="eyebrow text-surface-dark-foreground/55">
```

Change line 31 (`text-bone` hover target):
```tsx
            className="font-utility text-xs uppercase tracking-[0.14em] text-amber transition-colors hover:text-bone"
```
to:
```tsx
            className="font-utility text-xs uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground"
```

Change line 54 (`text-bone/40`):
```tsx
                className="flex h-24 items-center justify-center rounded-sm border border-dashed border-border/70 px-4 text-center font-utility text-xs uppercase tracking-[0.14em] text-bone/40"
```
to:
```tsx
                className="flex h-24 items-center justify-center rounded-sm border border-dashed border-border/70 px-4 text-center font-utility text-xs uppercase tracking-[0.14em] text-surface-dark-foreground/40"
```

- [ ] **Step 7: `components/cta-band.tsx` — migrate the section and text**

Change line 6:
```tsx
    <section className="relative overflow-hidden border-t border-border bg-ink-soft py-24 lg:py-32">
```
to:
```tsx
    <section className="relative overflow-hidden border-t border-border bg-surface-dark-soft py-24 lg:py-32">
```

Change line 19 (`text-bone`):
```tsx
        <h2 className="mt-6 text-balance font-display text-4xl leading-[1.02] text-bone sm:text-6xl lg:text-7xl">
```
to:
```tsx
        <h2 className="mt-6 text-balance font-display text-4xl leading-[1.02] text-surface-dark-foreground sm:text-6xl lg:text-7xl">
```

Change line 22 (`text-bone/65`):
```tsx
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-bone/65">
```
to:
```tsx
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-surface-dark-foreground/65">
```

Change line 36 (`border-bone/30` and `text-bone`):
```tsx
            className="inline-flex items-center justify-center rounded-sm border border-bone/30 px-8 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-amber hover:text-amber"
```
to:
```tsx
            className="inline-flex items-center justify-center rounded-sm border border-surface-dark-foreground/30 px-8 py-4 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber"
```

- [ ] **Step 8: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 9: Manual browser check — homepage in both themes**

With the dev server running, open `http://localhost:3000/`. In dark mode (default), confirm the homepage looks unchanged from before (same colors). Toggle to light mode (theme toggle in header) and confirm every section — Hero, Disciplines, Stats, Why Zanzibar, Partner Strip, CTA — now shows light-colored backgrounds with dark, readable text; confirm the countdown tiles and the "Become a Partner"/schedule links are legible in both themes; confirm the header/footer remain unchanged (still dark) in both themes.

- [ ] **Step 10: Commit**

```bash
git add components/hero.tsx components/countdown.tsx components/disciplines.tsx components/stats-band.tsx components/why-zanzibar.tsx components/partner-strip.tsx components/cta-band.tsx
git commit -m "Migrate homepage sections to theme-aware surface tokens"
```

---

### Task 3: Migrate shared cross-page components (`page-hero.tsx`, `section-heading.tsx`, `accordion-item.tsx`, `expandable-card.tsx`, `gallery-grid.tsx`, `enquiry-link.tsx`, `contact-form.tsx`, `register-form.tsx`, `partnership-inquiry.tsx`)

**Files:**
- Modify: `components/page-hero.tsx`
- Modify: `components/section-heading.tsx`
- Modify: `components/accordion-item.tsx`
- Modify: `components/expandable-card.tsx`
- Modify: `components/gallery-grid.tsx`
- Modify: `components/enquiry-link.tsx`
- Modify: `components/contact-form.tsx`
- Modify: `components/register-form.tsx`
- Modify: `components/partnership-inquiry.tsx`

**Interfaces:**
- Consumes: `bg-surface-dark-soft`, `text-surface-dark-foreground` from Task 1.
- Produces: nothing new consumed by later tasks — these are shared components whose consumers (pages) don't need to change their own call sites, since the migration is purely internal to each component's className strings.

- [ ] **Step 1: `components/page-hero.tsx` — migrate the section background and heading**

Change line 16:
```tsx
    <section className="relative overflow-hidden border-b border-border bg-ink-soft">
```
to:
```tsx
    <section className="relative overflow-hidden border-b border-border bg-surface-dark-soft">
```

Change line 30:
```tsx
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-bone text-balance md:text-6xl">
```
to:
```tsx
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-surface-dark-foreground text-balance md:text-6xl">
```

- [ ] **Step 2: `components/section-heading.tsx` — migrate the `tone !== 'light'` branch only**

Change line 48:
```tsx
          tone === 'light' ? 'text-ink' : 'text-bone',
```
to:
```tsx
          tone === 'light' ? 'text-ink' : 'text-surface-dark-foreground',
```

Change line 57:
```tsx
            tone === 'light' ? 'text-ink/70' : 'text-bone/65',
```
to:
```tsx
            tone === 'light' ? 'text-ink/70' : 'text-surface-dark-foreground/65',
```

Do not touch the `tone === 'light'` branch's `text-ink`/`text-ink/70` values themselves — out of scope per the design spec (zero call sites use `tone="light"` today; not part of this bug).

- [ ] **Step 3: `components/accordion-item.tsx` — migrate the question text**

Change line 18:
```tsx
        <span className="font-display text-lg font-semibold text-bone sm:text-xl">{question}</span>
```
to:
```tsx
        <span className="font-display text-lg font-semibold text-surface-dark-foreground sm:text-xl">{question}</span>
```

- [ ] **Step 4: `components/expandable-card.tsx` — migrate the card body (not the badge)**

Change line 31:
```tsx
    <article className="overflow-hidden rounded-lg border border-border bg-ink-soft">
```
to:
```tsx
    <article className="overflow-hidden rounded-lg border border-border bg-surface-dark-soft">
```

Change line 40 (gradient blending into the card surface, migrates with it):
```tsx
        <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/10 to-transparent" />
```
to:
```tsx
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-soft via-surface-dark-soft/10 to-transparent" />
```

**Line 42 (`bg-ink/80` badge) stays exactly as-is — KEEP LITERAL, do not touch.** Photo scrim.

Change line 49 (`text-bone`):
```tsx
        <h3 className="font-display text-xl font-semibold text-bone">{title}</h3>
```
to:
```tsx
        <h3 className="font-display text-xl font-semibold text-surface-dark-foreground">{title}</h3>
```

Change line 57 (`text-bone/70`):
```tsx
          className="mt-4 flex items-center gap-2 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-bone/70 transition-colors hover:text-amber"
```
to:
```tsx
          className="mt-4 flex items-center gap-2 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground/70 transition-colors hover:text-amber"
```

- [ ] **Step 5: `components/gallery-grid.tsx` — leave both matches as-is**

Line 56 (`from-ink/80`) and line 57 (`bg-ink/80` figcaption) are both photo-overlay scrims sitting over gallery images — **KEEP LITERAL, do not touch.** Make no changes to this file. (Included for audit-trail completeness.)

- [ ] **Step 6: `components/enquiry-link.tsx` — migrate the hover text color**

Change line 30:
```tsx
        'inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-bone',
```
to:
```tsx
        'inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground',
```

- [ ] **Step 7: `components/contact-form.tsx` — migrate the `FIELD` text color and success-state heading**

Change line 11:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```
to:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```

(Note: this uses the existing semantic `text-foreground` token, not the new `surface-dark-foreground` token — `bg-background` is already theme-aware via the semantic tokens defined at the top of `globals.css`, so its paired text should use the matching semantic `text-foreground`, not the brand-surface token. This is the correct fix for the "already flips per theme, but text color doesn't" bug named in the design spec.)

Change line 58:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">Message sent.</h3>
```
to:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Message sent.</h3>
```

- [ ] **Step 8: `components/register-form.tsx` — same fix as contact-form.tsx**

Change line 20:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```
to:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```

Change line 64:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">You&apos;re on the list.</h3>
```
to:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">You&apos;re on the list.</h3>
```

- [ ] **Step 9: `components/partnership-inquiry.tsx` — same fix as contact-form.tsx**

Change line 11:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-bone placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```
to:
```tsx
  'w-full rounded-sm border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-amber'
```

Change line 60:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-bone">Thank you.</h3>
```
to:
```tsx
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Thank you.</h3>
```

- [ ] **Step 10: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 11: Manual browser check — forms and shared components in light mode**

With the dev server running, switch to light mode and check: `/contact` (form fields have dark, readable text on their input background), `/register` (same), `/partnership` (the inquiry form at the bottom, same check), `/faq` (accordion question text is readable), `/gallery` (photo captions still legible — should be unchanged since this file wasn't touched).

- [ ] **Step 12: Commit**

```bash
git add components/page-hero.tsx components/section-heading.tsx components/accordion-item.tsx components/expandable-card.tsx components/enquiry-link.tsx components/contact-form.tsx components/register-form.tsx components/partnership-inquiry.tsx
git commit -m "Migrate shared cross-page components to theme-aware tokens"
```

---

### Task 4: Migrate page files (`about`, `festival`, `leadership`, `partnership`, `experience`, `accommodation`)

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/festival/page.tsx`
- Modify: `app/leadership/page.tsx`
- Modify: `app/partnership/page.tsx`
- Modify: `app/experience/page.tsx`
- Modify: `app/accommodation/page.tsx`

**Interfaces:**
- Consumes: `bg-surface-dark-soft`, `text-surface-dark-foreground` from Task 1.
- Produces: nothing consumed by later tasks (Tasks 5-9 modify these same files further for unrelated reasons — image slots, content additions — so this task's diff must land first and cleanly, since later tasks will edit lines near these changes).

- [ ] **Step 1: `app/about/page.tsx`**

Change line 73:
```tsx
      <section className="border-y border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
```

Change line 80:
```tsx
                <h3 className="font-display text-2xl font-semibold text-bone">{v.title}</h3>
```
to:
```tsx
                <h3 className="font-display text-2xl font-semibold text-surface-dark-foreground">{v.title}</h3>
```

Change line 96:
```tsx
              <div className="mt-3 font-display text-xl font-semibold text-bone">{t.label}</div>
```
to:
```tsx
              <div className="mt-3 font-display text-xl font-semibold text-surface-dark-foreground">{t.label}</div>
```

Line 103's `<section className="border-t border-border bg-deep-teal py-16 text-bone">` stays exactly as-is — KEEP LITERAL (deep-teal section).

- [ ] **Step 2: `app/festival/page.tsx`**

Change line 61:
```tsx
          <a href="#schedule" className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-amber hover:text-amber">
```
to:
```tsx
          <a href="#schedule" className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber">
```

Change line 71:
```tsx
            <article key={d.name} className="overflow-hidden rounded-lg border border-border bg-ink-soft">
```
to:
```tsx
            <article key={d.name} className="overflow-hidden rounded-lg border border-border bg-surface-dark-soft">
```

Change line 74 (gradient blending into the card surface):
```tsx
                <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/20 to-transparent" />
```
to:
```tsx
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark-soft via-surface-dark-soft/20 to-transparent" />
```

**Line 75 (`bg-ink/80` tag badge) stays exactly as-is — KEEP LITERAL.** Photo scrim.

Change line 80:
```tsx
                <h3 className="font-display text-3xl font-semibold text-bone">{d.name}</h3>
```
to:
```tsx
                <h3 className="font-display text-3xl font-semibold text-surface-dark-foreground">{d.name}</h3>
```

Change line 85:
```tsx
                      <span className="font-utility text-sm font-semibold uppercase tracking-[0.1em] text-bone">{c.name}</span>
```
to:
```tsx
                      <span className="font-utility text-sm font-semibold uppercase tracking-[0.1em] text-surface-dark-foreground">{c.name}</span>
```

Change line 96:
```tsx
      <section id="schedule" className="scroll-mt-24 border-y border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section id="schedule" className="scroll-mt-24 border-y border-border bg-surface-dark-soft py-20 md:py-28">
```

Change line 103:
```tsx
                <h3 className="mt-2 font-display text-2xl font-semibold text-bone">{s.title}</h3>
```
to:
```tsx
                <h3 className="mt-2 font-display text-2xl font-semibold text-surface-dark-foreground">{s.title}</h3>
```

Change line 124 (both `bg-ink-soft` and `text-bone` on the same element):
```tsx
                <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-ink-soft px-4 py-3 text-sm text-bone">
```
to:
```tsx
                <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-surface-dark-soft px-4 py-3 text-sm text-surface-dark-foreground">
```

- [ ] **Step 3: `app/leadership/page.tsx`**

Change line 75:
```tsx
              <h3 className="mt-5 font-display text-xl font-semibold text-bone">{m.name}</h3>
```
to:
```tsx
              <h3 className="mt-5 font-display text-xl font-semibold text-surface-dark-foreground">{m.name}</h3>
```

Change line 83:
```tsx
      <section className="border-t border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section className="border-t border-border bg-surface-dark-soft py-20 md:py-28">
```

Line 73's `from-ink to-transparent` (gradient over portrait photos) stays as-is — KEEP LITERAL, photo scrim.

- [ ] **Step 4: `app/partnership/page.tsx`**

Change line 81 (both branches of the ternary use `bg-ink-soft`):
```tsx
                t.highlight ? 'border-amber bg-ink-soft ring-1 ring-amber/40' : 'border-border bg-ink-soft'
```
to:
```tsx
                t.highlight ? 'border-amber bg-surface-dark-soft ring-1 ring-amber/40' : 'border-border bg-surface-dark-soft'
```

Change line 88:
```tsx
              <h3 className="mt-4 font-display text-2xl font-semibold text-bone">{t.name}</h3>
```
to:
```tsx
              <h3 className="mt-4 font-display text-2xl font-semibold text-surface-dark-foreground">{t.name}</h3>
```

Change line 97:
```tsx
              <Link href="#inquiry" className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm border border-border py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:border-amber hover:text-amber">
```
to:
```tsx
              <Link href="#inquiry" className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm border border-border py-3 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-surface-dark-foreground transition-colors hover:border-amber hover:text-amber">
```

Change line 105:
```tsx
      <section id="inquiry" className="scroll-mt-24 border-t border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section id="inquiry" className="scroll-mt-24 border-t border-border bg-surface-dark-soft py-20 md:py-28">
```

Line 63's `bg-deep-teal` section (`REACH` stats band) and its `text-bone` at line 63 and `text-bone/70` at line 68 stay exactly as-is — KEEP LITERAL (deep-teal section).

- [ ] **Step 5: `app/experience/page.tsx`**

Change line 130:
```tsx
      <section id="things-to-do" className="scroll-mt-24 border-y border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section id="things-to-do" className="scroll-mt-24 border-y border-border bg-surface-dark-soft py-20 md:py-28">
```

Change line 176:
```tsx
      <section className="border-y border-border bg-ink-soft py-20 md:py-28">
```
to:
```tsx
      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
```

Change line 182:
```tsx
                <h3 className="font-display text-xl font-semibold text-bone">{f.name}</h3>
```
to:
```tsx
                <h3 className="font-display text-xl font-semibold text-surface-dark-foreground">{f.name}</h3>
```

Change line 194 (both `bg-ink-soft` and `text-bone`):
```tsx
            <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-ink-soft px-4 py-3 text-sm text-bone">
```
to:
```tsx
            <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-surface-dark-soft px-4 py-3 text-sm text-surface-dark-foreground">
```

- [ ] **Step 6: `app/accommodation/page.tsx`**

Change line 153:
```tsx
          className="scroll-mt-24 border-b border-border px-6 py-20 md:py-28 odd:bg-ink-soft"
```
to:
```tsx
          className="scroll-mt-24 border-b border-border px-6 py-20 md:py-28 odd:bg-surface-dark-soft"
```

Change line 180:
```tsx
            <div key={s.step} className="rounded-lg border border-border bg-ink-soft p-8">
```
to:
```tsx
            <div key={s.step} className="rounded-lg border border-border bg-surface-dark-soft p-8">
```

Change line 182:
```tsx
              <h3 className="mt-2 font-display text-2xl font-semibold text-bone">{s.title}</h3>
```
to:
```tsx
              <h3 className="mt-2 font-display text-2xl font-semibold text-surface-dark-foreground">{s.title}</h3>
```

- [ ] **Step 7: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Manual browser check — all six pages in light mode**

With the dev server running, switch to light mode and visit `/about`, `/festival`, `/leadership`, `/partnership`, `/experience`, `/accommodation`. Confirm every banded section (previously dark-on-cream) now shows light background with dark text, all headings/body text are legible, and the `bg-deep-teal` sections on `/about` and `/partnership` still look like a deliberate teal accent band (unchanged, still legible) in both themes.

- [ ] **Step 9: Commit**

```bash
git add app/about/page.tsx app/festival/page.tsx app/leadership/page.tsx app/partnership/page.tsx app/experience/page.tsx app/accommodation/page.tsx
git commit -m "Migrate page files to theme-aware surface tokens"
```

---

### Task 5: `PageHero` optional image slot

**Files:**
- Modify: `components/page-hero.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `PageHero` component gains an optional `image?: { src: string; alt: string }` prop. Task 6 imports and uses this from `app/experience/page.tsx`, `app/accommodation/page.tsx`, `app/festival/page.tsx`, `app/leadership/page.tsx`, `app/partnership/page.tsx`.

Backward-compatible: pages that don't pass `image` render identically to today (`/about`, `/gallery`, `/faq`, `/contact` are not touched by this plan and keep their current text-only hero).

- [ ] **Step 1: Add the `image` prop and 2-column layout**

Read the current full file (already migrated by Task 3) and replace its contents with:

```tsx
import type { ReactNode } from 'react'
import Image from 'next/image'
import { Chevrons } from '@/components/chevrons'

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string
  title: ReactNode
  intro?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface-dark-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, var(--amber), transparent 45%), radial-gradient(circle at 85% 80%, var(--deep-teal), transparent 50%)',
        }}
      />
      <div
        className={`relative mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-40 ${
          image ? 'grid gap-12 md:grid-cols-2 md:items-center' : ''
        }`}
      >
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Chevrons className="text-amber" />
            <span className="eyebrow text-amber">{eyebrow}</span>
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[0.98] tracking-tight text-surface-dark-foreground text-balance md:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {intro}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors. This confirms every existing call site (which don't pass `image`) still type-checks, since `image` is optional.

- [ ] **Step 3: Manual browser check — no regression on untouched pages**

With the dev server running, visit `/about`, `/gallery`, `/faq`, `/contact` — confirm each hero still renders as a single text-only column, unchanged from before.

- [ ] **Step 4: Commit**

```bash
git add components/page-hero.tsx
git commit -m "Add optional image slot to PageHero"
```

---

### Task 6: Wire `PageHero` images into `/experience`, `/accommodation`, `/festival`, `/leadership`, `/partnership`

**Files:**
- Modify: `app/experience/page.tsx`
- Modify: `app/accommodation/page.tsx`
- Modify: `app/festival/page.tsx`
- Modify: `app/leadership/page.tsx`
- Modify: `app/partnership/page.tsx`

**Interfaces:**
- Consumes: `PageHero`'s `image?: { src: string; alt: string }` prop from Task 5.
- Produces: nothing consumed by later tasks.

Per the design spec's table: `/about`, `/gallery`, `/faq`, `/contact` are deliberately NOT touched (each has its own reason — see spec section 2).

- [ ] **Step 1: `app/experience/page.tsx`**

Change:
```tsx
      <PageHero
        eyebrow="Experience Zanzibar"
        title={<>Race here. Stay a while.</>}
        intro="ZanziFit is based in Fumba Town, on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."
      />
```
to:
```tsx
      <PageHero
        eyebrow="Experience Zanzibar"
        title={<>Race here. Stay a while.</>}
        intro="ZanziFit is based in Fumba Town, on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."
        image={{ src: '/images/zanzibar-coast.png', alt: 'A traditional dhow sailing off the Zanzibar coast at golden hour' }}
      />
```

- [ ] **Step 2: `app/accommodation/page.tsx`**

Change:
```tsx
      <PageHero
        eyebrow="Accommodation"
        title={<>We&apos;re not a hotel. We&apos;re your local connection.</>}
        intro="ZanziFit doesn't run properties — we know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."
      />
```
to:
```tsx
      <PageHero
        eyebrow="Accommodation"
        title={<>We&apos;re not a hotel. We&apos;re your local connection.</>}
        intro="ZanziFit doesn't run properties — we know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."
        image={{ src: '/images/festival-village.png', alt: 'The ZanziFit festival village and expo at golden hour' }}
      />
```

- [ ] **Step 3: `app/festival/page.tsx`**

Change:
```tsx
      <PageHero
        eyebrow="The festival"
        title={<>Two disciplines. One coastline. One weekend.</>}
        intro="6–8 November 2026 in Fumba Town, Zanzibar. Race the discipline you love — or take on both — then recover on the same sand you started from."
      >
```
to:
```tsx
      <PageHero
        eyebrow="The festival"
        title={<>Two disciplines. One coastline. One weekend.</>}
        intro="6–8 November 2026 in Fumba Town, Zanzibar. Race the discipline you love — or take on both — then recover on the same sand you started from."
        image={{ src: '/images/cycling.png', alt: 'The peloton racing along the coastal road' }}
      >
```

(Note: this `PageHero` usage has children — the register/schedule button row — so the opening tag change must preserve the `>` that opens the children block, not self-close.)

- [ ] **Step 4: `app/leadership/page.tsx`**

Change:
```tsx
      <PageHero
        eyebrow="The team"
        title={<>The people behind the horizon.</>}
        intro="ZanziFit is run by a team that lives at the intersection of endurance sport, world-class event operations and Zanzibari hospitality."
      />
```
to:
```tsx
      <PageHero
        eyebrow="The team"
        title={<>The people behind the horizon.</>}
        intro="ZanziFit is run by a team that lives at the intersection of endurance sport, world-class event operations and Zanzibari hospitality."
        image={{ src: '/images/leader-1.png', alt: 'ZanziFit Festival leadership on the Zanzibar coast' }}
      />
```

- [ ] **Step 5: `app/partnership/page.tsx`**

Change:
```tsx
      <PageHero
        eyebrow="Partner with us"
        title={<>Put your brand on the horizon.</>}
        intro="ZanziFit gives partners category exclusivity at a premium destination event — reaching an engaged, affluent, health-focused audience across 15 countries."
      >
```
to:
```tsx
      <PageHero
        eyebrow="Partner with us"
        title={<>Put your brand on the horizon.</>}
        intro="ZanziFit gives partners category exclusivity at a premium destination event — reaching an engaged, affluent, health-focused audience across 15 countries."
        image={{ src: '/images/finish-line.png', alt: 'An athlete crossing the ZanziFit finish line at sunset on the Zanzibar coast' }}
      >
```

(Same children-preservation note as Step 3 — this `PageHero` also wraps a "Request the deck" button.)

- [ ] **Step 6: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Manual browser check — wide viewport, all 5 pages**

With the dev server running, resize the browser to a wide viewport (≥1440px) and visit `/experience`, `/accommodation`, `/festival`, `/leadership`, `/partnership`. Confirm each hero now shows a 2-column layout with an image on the right, no empty dead space above the fold. Then resize to a narrow/mobile viewport and confirm the layout stacks to a single column (image below text) without visual breakage.

- [ ] **Step 8: Commit**

```bash
git add app/experience/page.tsx app/accommodation/page.tsx app/festival/page.tsx app/leadership/page.tsx app/partnership/page.tsx
git commit -m "Add hero images to Experience, Accommodation, Festival, Leadership, Partnership pages"
```

---

### Task 7: Restructure `/experience`'s "About Zanzibar" section

**Files:**
- Modify: `app/experience/page.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Replace the single-column text section with a 2-column text+image grid**

Change:
```tsx
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="About Zanzibar" title="An island shaped by centuries of trade." />
        <p className="mt-8 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          Zanzibar is an archipelago off the coast of mainland Tanzania, its culture
          layered by Swahili, Arab, Persian, Indian and European influence over
          hundreds of years of Indian Ocean trade. ZanziFit races out of Fumba Town,
          a quiet stretch of the west coast on Menai Bay — close enough to Stone
          Town for an afternoon of sightseeing, far enough to still feel like your
          own stretch of coastline.
        </p>
      </section>
```
to:
```tsx
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="About Zanzibar" title="An island shaped by centuries of trade." align="left" />
            <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
              Zanzibar is an archipelago off the coast of mainland Tanzania, its culture
              layered by Swahili, Arab, Persian, Indian and European influence over
              hundreds of years of Indian Ocean trade. ZanziFit races out of Fumba Town,
              a quiet stretch of the west coast on Menai Bay — close enough to Stone
              Town for an afternoon of sightseeing, far enough to still feel like your
              own stretch of coastline.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/festival-village.png"
              alt="The ZanziFit festival village on the Zanzibar coast"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
```

This reuses `festival-village.png` — distinct from the hero's `zanzibar-coast.png` (Task 6) and the Culture & Heritage section's `zanzibar-coast.png` further down the same page, so three sections don't repeat the same image back-to-back.

- [ ] **Step 2: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual browser check**

With the dev server running, visit `/experience` at a wide viewport. Confirm "About Zanzibar" now shows text on the left and an image on the right, matching the Culture & Heritage section's layout further down the page. Confirm at a narrow viewport the layout stacks correctly.

- [ ] **Step 4: Commit**

```bash
git add app/experience/page.tsx
git commit -m "Restructure About Zanzibar section to text+image layout"
```

---

### Task 8: Header logo size and cursor contrast fix

**Files:**
- Modify: `components/site-header.tsx`
- Modify: `components/custom-cursor.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks.

These two fixes are unrelated to each other and to the theming work, bundled into one task since each is a single-line/single-block change.

- [ ] **Step 1: Enlarge the header logo**

In `components/site-header.tsx`, change:
```tsx
            className="h-8 w-auto invert lg:h-9"
```
to:
```tsx
            className="h-10 w-auto invert lg:h-12"
```

- [ ] **Step 2: Add a contrasting ring to the custom cursor**

In `components/custom-cursor.tsx`, change:
```tsx
        className={`flex items-center justify-center rounded-full border border-amber bg-ink/40 backdrop-blur-sm transition-all duration-200 ease-out ${
          active ? 'h-16 w-16 border-amber' : 'h-3 w-3 border-transparent bg-amber'
        }`}
```
to:
```tsx
        className={`flex items-center justify-center rounded-full border border-amber bg-ink/40 shadow-[0_0_0_1.5px_rgba(237,231,216,0.9)] backdrop-blur-sm transition-all duration-200 ease-out ${
          active ? 'h-16 w-16 border-amber' : 'h-3 w-3 border-transparent bg-amber'
        }`}
```

Note: `bg-ink/40` here is the cursor's own translucent fill, not a page-body background — correctly left as a literal brand-color value, not migrated to `surface-dark`, per the design spec's exclusion of `custom-cursor.tsx` from the theming migration (it's UI chrome that floats above the page, not page content).

- [ ] **Step 3: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual browser check**

With the dev server running, visit the homepage and confirm the logo in the header now reads noticeably larger without crowding the nav links or overflowing the header bar, at both mobile and desktop widths. Move the mouse cursor (desktop browser with a real mouse, not touch) over amber-colored elements (e.g. the "Register" button, active nav link) and confirm the cursor dot/ring stays visible against them via its new light-colored edge; also confirm it's still visible over plain dark and plain light backgrounds.

- [ ] **Step 5: Commit**

```bash
git add components/site-header.tsx components/custom-cursor.tsx
git commit -m "Enlarge header logo and add contrast ring to custom cursor"
```

---

### Task 9: Double content density on `/experience`

**Files:**
- Modify: `app/experience/page.tsx`

**Interfaces:**
- Consumes: nothing new — extends the existing `THINGS_TO_DO`, `CULTURE_FACTS`, `FOOD_HIGHLIGHTS`, `TRAVEL_INFO` arrays in place.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Extend `THINGS_TO_DO` from 5 to 9 entries**

Find the `THINGS_TO_DO` array (currently ending after the "Jozani-Chwaka Bay National Park" entry, just before the closing `]`) and add these 4 entries before the closing `]`:

```tsx
  {
    title: 'Mnemba Atoll',
    badge: '~2 hrs incl. boat',
    image: '/images/zanzibar-coast.png',
    summary:
      'A marine conservation area off the north-east coast — some of the clearest water in Zanzibar for snorkeling and diving.',
    details: [
      'Visibility typically ranges 15–30 metres',
      'A relaxed drive plus a short boat transfer from most of the island',
      'Best combined with a full-day excursion given the distance from Fumba',
    ],
  },
  {
    title: 'Kizimkazi',
    badge: '~40 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'A fishing village on the south coast, known for wild dolphin encounters and one of East Africa’s oldest mosques.',
    details: [
      'Boat trips have a strong chance of dolphin sightings, though they are wild and not guaranteed',
      'The 12th-century mosque holds early Kufic script inscriptions, among the earliest evidence of Islam in East Africa',
    ],
  },
  {
    title: 'Prison Island (Changuu)',
    badge: '~50 min incl. boat',
    image: '/images/zanzibar-coast.png',
    summary:
      'A short boat ride from Stone Town, now home to giant Aldabra tortoises brought over from Seychelles in the 1820s.',
    details: [
      'Some resident tortoises are recorded as over 100 years old',
      'The island also has a beach and snorkeling spot alongside the tortoise sanctuary',
    ],
  },
  {
    title: 'Michamvi Peninsula',
    badge: '~75 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'A quiet east-coast peninsula known for a walkable sandbank that appears at low tide.',
    details: [
      'The sandbank is a popular sunset spot, reachable on foot at low tide',
      'Less developed than Nungwi or Kendwa — a quieter alternative for a day trip',
    ],
  },
```

- [ ] **Step 2: Extend `CULTURE_FACTS` from 3 to 6 entries**

Find the `CULTURE_FACTS` array and add these 3 strings before the closing `]`:

```tsx
  'Taarab, a musical style blending Swahili, Arab and Indian influences, remains a living tradition across the islands.',
  'Stone Town hosts Sauti za Busara, a four-day pan-African music festival held every February.',
  'Swahili is the language of daily life alongside English, which is widely spoken in tourism and business.',
```

- [ ] **Step 3: Extend `FOOD_HIGHLIGHTS` from 4 to 8 entries**

Find the `FOOD_HIGHLIGHTS` array and add these 4 entries before the closing `]`:

```tsx
  {
    name: 'Mchuzi wa Pweza',
    detail: 'Octopus curry — tender octopus simmered in a coconut sauce with garlic, ginger and turmeric.',
  },
  {
    name: 'Biryani',
    detail: 'A saffron-spiced layered rice dish with marinated meat and fried onions, reflecting the island’s Indian Ocean trade history.',
  },
  {
    name: 'Kashata',
    detail: 'A coconut and sesame sweet, sold across Stone Town’s markets and street stalls.',
  },
  {
    name: 'Mandazi',
    detail: 'Lightly sweetened Swahili doughnuts, flavoured with cardamom — a common breakfast snack with tea or coffee.',
  },
```

- [ ] **Step 4: Extend `TRAVEL_INFO` from 5 to 8 entries**

Find the `TRAVEL_INFO` array and add these 3 strings before the closing `]`:

```tsx
  'Currency: Tanzanian Shilling (TZS) — US dollars are widely accepted at hotels and tour operators',
  'Time zone: East Africa Time (EAT, UTC+3) year-round',
  'Power: UK-style three-pin plugs, 230V',
```

- [ ] **Step 5: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual browser check**

With the dev server running, visit `/experience`. Confirm the "Things to Do" grid now shows 9 cards, "Culture & Heritage" shows 6 bullet points, "Food & Cuisine" shows 8 cards, and "Travel Information" shows 8 items. Expand a few of the new cards' "View more" to confirm their detail lists render correctly. Confirm the enquiry link on each new card still works (hover shows the WhatsApp link with that card's title).

- [ ] **Step 7: Commit**

```bash
git add app/experience/page.tsx
git commit -m "Double content density on Experience Zanzibar page"
```

---

### Task 10: Double content density on `/accommodation`

**Files:**
- Modify: `app/accommodation/page.tsx`

**Interfaces:**
- Consumes: nothing new — extends the existing `HOTELS`, `RESORTS`, `BOUTIQUE_STAYS`, `BUDGET_STAYS` arrays in place.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Extend `HOTELS` from 2 to 4 entries**

Find the `HOTELS` array and add these 2 entries before the closing `]`:

```tsx
  {
    title: 'Melia Zanzibar',
    area: 'Kiwengwa',
    badge: '~65 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A full-service resort hotel on a 40-acre estate on the north-east coast, with multiple restaurants and three pools.',
    details: [
      'Seven on-site restaurants spanning international, Mediterranean and local cuisine',
      'A good fit for travellers who want an all-inclusive-style resort experience',
    ],
  },
  {
    title: 'Turaco Nungwi Resort, a Tribute Portfolio Hotel',
    area: 'Nungwi',
    badge: '~75 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A newer full-service hotel on Nungwi’s beachfront, part of Marriott’s Tribute Portfolio.',
    details: [
      'Beachfront location on one of Zanzibar’s most popular stretches of sand',
      'International hotel-brand standards and service',
    ],
  },
```

- [ ] **Step 2: Extend `RESORTS` from 3 to 5 entries**

Find the `RESORTS` array and add these 2 entries before the closing `]`:

```tsx
  {
    title: 'Baraza Resort & Spa',
    area: 'Bwejuu',
    badge: '~70 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'An east-coast luxury resort with villas blending Swahili, Arabic and Indian architectural influences.',
    details: [
      '30 villas with hand-carved furniture and private plunge pools',
      'On-site Frangipani Spa',
    ],
  },
  {
    title: 'Matemwe Beach Village',
    area: 'Matemwe',
    badge: '~65 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A relaxed north-east coast beach retreat close to Mnemba Atoll, with a five-star PADI dive centre on site.',
    details: [
      'Simple bungalow-style accommodation',
      'A strong choice for travellers prioritising diving and snorkeling',
    ],
  },
```

- [ ] **Step 3: Extend `BOUTIQUE_STAYS` from 2 to 4 entries**

Find the `BOUTIQUE_STAYS` array and add these 2 entries before the closing `]`:

```tsx
  {
    title: 'Emerson on Hurumzi',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A historic Stone Town boutique hotel with traditionally furnished rooms and Zanzibar’s highest rooftop restaurant.',
    details: [
      'Rooftop tea house restaurant known for sunset views and live music at dinner',
      'A deeply immersive, historic alternative to a standard hotel stay',
    ],
  },
  {
    title: 'Bamboo Zanzibar',
    area: 'Jambiani',
    badge: '~55 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A sustainable boutique hotel on the Jambiani coastline, built from locally sourced timber, bamboo and stone.',
    details: [
      'Bungalows arranged around a pool set within surrounding forest',
      'A distinct architectural style blending African and Asian design influences',
    ],
  },
```

- [ ] **Step 4: Extend `BUDGET_STAYS` from 2 to 4 entries**

Find the `BUDGET_STAYS` array and add these 2 entries before the closing `]`:

```tsx
  {
    title: 'Lost & Found Hostel',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'Zanzibar’s first premium hostel, in a renovated heritage building in central Stone Town.',
    details: [
      '36 air-conditioned rooms with free Wi-Fi',
      'Walking distance to Nakupenda Beach and the Freddie Mercury Museum',
    ],
  },
  {
    title: 'Flamingo Guest House',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A simple, centrally located Stone Town guesthouse with breakfast included.',
    details: [
      'Good value for a central Stone Town base',
      'Breakfast and Wi-Fi included in the room rate',
    ],
  },
```

- [ ] **Step 5: Type-check**

Run: `npx pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual browser check**

With the dev server running, visit `/accommodation`. Confirm Hotels shows 4 cards, Resorts shows 5, Boutique Stays shows 4, Budget Stays shows 4 (14 total, up from 8). Expand a few of the new cards to confirm details render. Confirm each new card's enquiry link carries that property's correct name.

- [ ] **Step 7: Commit**

```bash
git add app/accommodation/page.tsx
git commit -m "Double content density on Accommodation page"
```

---

## Post-plan verification

After Task 10, run a final full check:

- [ ] Run: `npx pnpm exec tsc --noEmit` — expect zero errors across the whole project.
- [ ] With the dev server running, click through every page in both light and dark theme at both a wide (≥1440px) and narrow (≤400px) viewport: `/`, `/about`, `/festival`, `/experience`, `/accommodation`, `/leadership`, `/partnership`, `/gallery`, `/faq`, `/contact`, `/register`. Confirm no page has unreadable text in either theme, the header/footer remain visually unchanged and always dark in both themes, the logo reads larger, the cursor stays visible against amber UI, and both new pages show their expanded content and hero image.
