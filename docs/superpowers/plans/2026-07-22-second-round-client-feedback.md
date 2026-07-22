# Second Round Client Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix six items from the client's second review round: swap the raster logo for the real vector SVG, fix a nav-label wrapping bug, delete the Gallery page entirely, remove the repeated "eyebrow" tag pattern from every page, rewrite all visible em-dashes into natural punctuation, and remove the dark-blue "deep teal" accent color in favor of strict black+gold.

**Architecture:** Same Next.js 16 App Router site as the first round. No new dependencies, no route additions (one route removal), no test framework (verification is manual via `pnpm build` + dev server, consistent with prior work). Two of the six items (eyebrow removal, deep-teal removal) are shared-component changes that cascade to every page; the other four are targeted single-purpose changes.

## Global Constraints

- No new color tokens, font families beyond what exists, or unrelated route/IA changes.
- Do not delete the `--deep-teal` CSS custom property from `app/globals.css`'s token definitions — only stop *consuming* it in the 6 files that reference it. Leaving an unused, still-defined token is zero-risk.
- Em-dash rewrites apply ONLY to visible on-page copy (headings, intros, body paragraphs, list items, metadata `description` strings that search engines/link-previews display). Do NOT rewrite em-dashes inside source code comments or inside the `mailto:` subject/body template strings in `components/contact-form.tsx` and `components/register-form.tsx` — those aren't visible site content.
- Rewritten copy must preserve the original meaning and the site's existing voice — this is a copy edit, not a mechanical character deletion. Never leave a sentence that reads as two run-on clauses jammed together after removing an em-dash; restructure with a period, comma, or connecting word as the specific sentence requires.
- No automated test suite exists in this repo. Verification is manual via `pnpm dev` + `pnpm build`, per step.
- `pnpm` is invoked directly (not `corepack pnpm`) in this environment — a shim on PATH delegates to the project's pinned version.

---

## File structure (what changes and why)

- `public/zfit-logo.svg` (new) — the real vector ZFit wordmark, moved from repo-root `file.svg`
- `components/site-header.tsx` — logo swap to SVG, nav `whitespace-nowrap` + gap fix, Gallery nav entry removed
- `components/site-footer.tsx` — logo swap to SVG, Gallery footer link removed
- `app/gallery/page.tsx`, `components/gallery-grid.tsx` — deleted
- `components/page-hero.tsx` — eyebrow row + prop removed
- `components/section-heading.tsx` — eyebrow row + prop removed, deep-teal usage removed
- Every `app/*/page.tsx` and `components/disciplines.tsx` that calls `PageHero`/`SectionHeading` with `eyebrow=` — prop removed from call site (26 call sites across 11 files)
- `app/about/page.tsx`, `app/partnership/page.tsx`, `components/newsletter-form.tsx`, `components/stats-band.tsx` — deep-teal class usage replaced with ink/surface-dark equivalents
- ~14 files across `app/*/page.tsx` and `components/*.tsx` — em-dash rewrite pass (visible copy only)

---

### Task 1: Swap the raster logo for the real vector SVG

**Files:**
- Create: `public/zfit-logo.svg` (moved from repo-root `file.svg`)
- Modify: `components/site-header.tsx:64-76`
- Modify: `components/site-footer.tsx:47-56`

**Interfaces:**
- No prop/type changes — same `<Image>` usage pattern, just a different `src` and, since SVG doesn't need explicit raster dimensions the way `next/image` optimizes PNGs, the `width`/`height` props can stay as hints (Next.js's `<Image>` supports SVG `src` values fine when `unoptimized` isn't required, since these are `next/image`-served static files under `public/`).

- [ ] **Step 1: Confirm the SVG is the correct file**

The repo root has two SVG files: `file.svg` and `SMrY001.svg`. Render both to inspect them:

```bash
node -e "
const sharp = require('./node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js');
sharp('file.svg').resize(800).png().toFile('/tmp/check-file-svg.png').then(()=>console.log('done'));
"
```

Then view `/tmp/check-file-svg.png` — it should show the solid, filled-black "ZFIT FESTIVAL" wordmark (same shape as the site's current PNG logo, not the rough distressed-outline variant in `SMrY001.svg`). Confirmed during planning that `file.svg` is correct — this step is a sanity re-check before moving the file, not new discovery work.

- [ ] **Step 2: Move the file into `public/`**

```bash
mv file.svg public/zfit-logo.svg
```

- [ ] **Step 3: Update the header's logo reference**

In `components/site-header.tsx`, replace the `<Image>` block (currently lines 65-76):

```tsx
        <Link href="/" className="flex items-center gap-2" aria-label="ZanziFit Festival home">
          <Image
            src="/zfit-logo.svg"
            alt="ZFit Festival"
            width={132}
            height={44}
            priority
            className="h-10 w-auto dark:invert lg:h-12 [:root[data-theme='light']_&]:invert-0"
          />
        </Link>
```

Check the exact current className on this element first (it may already read `h-10 w-auto invert lg:h-12 [:root[data-theme='light']_&]:invert-0` from round one's Task 1 fix) — preserve whichever theme-invert logic is currently there verbatim; only the `src` changes from `/zfit-logo.png` to `/zfit-logo.svg`.

- [ ] **Step 4: Update the footer's logo reference**

In `components/site-footer.tsx`, find the `<Image>` block (currently around lines 48-56) and change only its `src` from `/zfit-logo.png` to `/zfit-logo.svg`, leaving `width`, `height`, and `className` (including its `invert` logic) untouched.

- [ ] **Step 5: Decide whether to remove the old PNG**

Leave `public/zfit-logo.png` in place for now (no code references it anymore after this task, but deleting unused static assets is optional cleanup, not required for correctness — removing it is fine if you want a tidier `public/`, but don't spend time on it if any other page/metadata still references it; grep to check first):

```bash
grep -rn "zfit-logo.png" app components
```

If this returns no matches, it's safe to `git rm public/zfit-logo.png` as a courtesy cleanup in this same commit. If it still has references (e.g. an Open Graph image tag), leave it and note that in your report.

- [ ] **Step 6: Manual verification**

Run `pnpm dev`. Visit `/` and any interior page. Confirm the logo renders identically in shape/position to before, but now via SVG (view page source or Network tab to confirm `zfit-logo.svg` is the requested asset, not the PNG). Maximize the browser window and confirm the logo looks sharp with no softness/stretching at large sizes. Toggle light/dark theme and confirm the invert behavior still works correctly in both header and footer.

- [ ] **Step 7: Commit**

```bash
git add public/zfit-logo.svg components/site-header.tsx components/site-footer.tsx
git commit -m "Replace raster PNG logo with the real vector SVG to fix zoomed/stretched appearance"
```

---

### Task 2: Fix nav label wrapping onto two lines

**Files:**
- Modify: `components/site-header.tsx:79-97`

**Interfaces:**
- No prop/type changes — className-only fix within the existing `NAV.map()` render.

- [ ] **Step 1: Reproduce the bug**

Run `pnpm dev`. Resize the browser to common laptop widths (1024px, 1280px) and confirm "Experience Zanzibar" wraps onto two lines in the desktop nav.

- [ ] **Step 2: Add `whitespace-nowrap` and tighten the `lg` gap**

In `components/site-header.tsx`, replace the `<nav>` element (currently line 79) and the `<Link>`'s className (currently lines 86-91):

```tsx
        <nav className="hidden items-center gap-4 lg:flex xl:gap-7" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'whitespace-nowrap font-utility text-[0.82rem] uppercase tracking-[0.14em] transition-colors',
                  active
                    ? 'text-amber'
                    : 'text-foreground/70 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
```

(This reduces the gap to `gap-4` at the `lg` breakpoint specifically, restoring the original `gap-7` only at `xl` and above, where there's more room. Combined with `whitespace-nowrap`, no label can wrap regardless of viewport width, and items have breathing room without touching the register button.)

- [ ] **Step 3: Manual verification**

With `pnpm dev` running, resize the browser through 1024px, 1200px, 1280px, 1440px, and a full-width desktop window. Confirm "Experience Zanzibar" (and every other label) stays on a single line at every width, and the nav doesn't visually crowd or overlap the theme toggle / Register button. Check both light and dark mode (this is layout-only, shouldn't differ, but confirm no regression).

- [ ] **Step 4: Commit**

```bash
git add components/site-header.tsx
git commit -m "Fix nav labels wrapping onto two lines at common desktop widths"
```

---

### Task 3: Remove the Gallery page entirely

**Files:**
- Delete: `app/gallery/page.tsx`
- Delete: `components/gallery-grid.tsx`
- Modify: `components/site-header.tsx:19` (NAV array)
- Modify: `components/site-footer.tsx:23` (footer COLUMNS array)

**Interfaces:**
- Removes the `/gallery` route and the `GalleryGrid` component entirely — no other code imports `GalleryGrid` (confirmed during planning: only `app/gallery/page.tsx` imports it).

- [ ] **Step 1: Confirm no other references exist**

```bash
grep -rn "gallery" app components --include="*.tsx" -i
```

Expected matches (before this task): `app/gallery/page.tsx`, `components/gallery-grid.tsx`, one `NAV` entry in `components/site-header.tsx`, one footer link in `components/site-footer.tsx`. If anything else references gallery (e.g. a link from another page you haven't seen), note it and remove that reference too as part of this task.

- [ ] **Step 2: Delete the route and component**

```bash
git rm app/gallery/page.tsx components/gallery-grid.tsx
```

Note: `git rm` on a directory's only file may leave an empty `app/gallery/` directory in the working tree — this is harmless (git doesn't track empty directories) and Next.js's router simply won't have a `/gallery` route once the `page.tsx` is gone.

- [ ] **Step 3: Remove the header nav entry**

In `components/site-header.tsx`, remove line 19 from the `NAV` array:

```tsx
const NAV = [
  { href: '/about', label: 'About' },
  { href: '/festival', label: 'The Festival' },
  { href: '/experience', label: 'Experience Zanzibar' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/partnership', label: 'Partnership' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]
```

(This removes the `{ href: '/gallery', label: 'Gallery' }` line. The mobile menu consumes this same array, so it updates automatically.)

- [ ] **Step 4: Remove the footer link**

In `components/site-footer.tsx`, find the `COLUMNS` array's "Discover" column (around line 17-24) and remove the Gallery link line:

```tsx
  {
    heading: 'Discover',
    links: [
      { href: '/about', label: 'About' },
      { href: '/leadership', label: 'Leadership' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
```

(Read the current file first to confirm the exact surrounding array contents match this shape before editing — only remove the Gallery line itself.)

- [ ] **Step 5: Manual verification**

Run `pnpm build` — confirm the build output's route list no longer includes `/gallery`. Run `pnpm dev` and visit `/gallery` directly — confirm it now 404s. Check the header nav (desktop and mobile) and footer — confirm no "Gallery" link appears anywhere on any page.

```bash
grep -rn "gallery" app components --include="*.tsx" -i
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add components/site-header.tsx components/site-footer.tsx
git commit -m "Remove the Gallery page entirely per client request"
```

---

### Task 4: Remove the "eyebrow" tag pattern from `PageHero` and `SectionHeading`

**Files:**
- Modify: `components/page-hero.tsx`
- Modify: `components/section-heading.tsx`
- Modify: `app/about/page.tsx` (4 call sites)
- Modify: `app/accommodation/page.tsx` (3 call sites)
- Modify: `app/contact/page.tsx` (2 call sites)
- Modify: `app/experience/page.tsx` (6 call sites)
- Modify: `app/faq/page.tsx` (1 call site)
- Modify: `app/festival/page.tsx` (4 call sites)
- Modify: `app/leadership/page.tsx` (2 call sites)
- Modify: `app/partnership/page.tsx` (3 call sites)
- Modify: `app/register/page.tsx` (1 call site)
- Modify: `components/disciplines.tsx` (1 call site)

**Interfaces:**
- `PageHero`'s prop signature loses `eyebrow: string` (currently required) — becomes a component with no eyebrow concept at all.
- `SectionHeading`'s prop signature loses `eyebrow?: string` — remains otherwise identical (`title`, `intro`, `align`, `tone`, `className`).
- Every call site across the 10 page files + `disciplines.tsx` must stop passing an `eyebrow` prop. Since `PageHero`'s `eyebrow` is currently a *required* prop, removing it from the type is what makes stale call sites a compile error if any are missed — this is a safety net, not just cleanup: if you miss a call site, `pnpm build` will fail with a clear TypeScript error naming the file.

- [ ] **Step 1: Remove the eyebrow row from `PageHero`**

Replace `components/page-hero.tsx` in full:

```tsx
import type { ReactNode } from 'react'
import Image from 'next/image'

export function PageHero({
  title,
  intro,
  image,
  children,
}: {
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
            'radial-gradient(circle at 15% 20%, var(--amber), transparent 45%), radial-gradient(circle at 85% 80%, var(--ink), transparent 50%)',
        }}
      />
      <div
        className={`relative mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-40 ${
          image ? 'grid gap-12 md:grid-cols-2 md:items-center' : ''
        }`}
      >
        <div>
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

(The `Chevrons` import is removed since it was only used by the eyebrow row. The decorative background gradient's second color changes from `var(--deep-teal)` to `var(--ink)` — this is Task 5's deep-teal removal, folded in here since it's the same line being touched; if Task 5 runs separately later, this specific instance is already handled, don't re-touch it.)

- [ ] **Step 2: Remove the eyebrow row from `SectionHeading`**

Replace `components/section-heading.tsx` in full:

```tsx
import { cn } from '@/lib/utils'

export function SectionHeading({
  title,
  intro,
  align = 'left',
  tone = 'dark',
  className,
}: {
  title: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2
        className={cn(
          'text-balance font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl',
          tone === 'light' ? 'text-ink' : 'text-surface-dark-foreground',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-pretty text-lg leading-relaxed',
            tone === 'light' ? 'text-ink/70' : 'text-surface-dark-foreground/65',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
```

(The `Chevrons` import is removed. `mt-4` on the `<h2>` is dropped since there's no longer an eyebrow row above it to create margin from — the heading is now the first element in the container. The `tone === 'light' ? 'text-deep-teal' : 'text-amber'` eyebrow-color logic is gone entirely along with the eyebrow itself, which also fully resolves the `SectionHeading`-related part of Task 5's deep-teal removal — don't re-touch this file in Task 5.)

- [ ] **Step 3: Remove `eyebrow=` from every `PageHero` call site**

Read the current content of each file below and remove the `eyebrow="..."` line from every `<PageHero ... />` call. There are 10 call sites, one per file:

- `app/about/page.tsx` — `<PageHero eyebrow="About the festival" ...>` → remove that line
- `app/accommodation/page.tsx` — `<PageHero eyebrow="Accommodation" ...>` → remove that line
- `app/contact/page.tsx` — `<PageHero eyebrow="Contact" ...>` → remove that line
- `app/experience/page.tsx` — `<PageHero eyebrow="Experience Zanzibar" ...>` → remove that line
- `app/faq/page.tsx` — `<PageHero eyebrow="FAQ" ...>` → remove that line
- `app/festival/page.tsx` — `<PageHero eyebrow="The festival" ...>` → remove that line
- `app/gallery/page.tsx` — already deleted in Task 3, skip
- `app/leadership/page.tsx` — `<PageHero eyebrow="The team" ...>` → remove that line
- `app/partnership/page.tsx` — `<PageHero eyebrow="Partner with us" ...>` → remove that line
- `app/register/page.tsx` — `<PageHero eyebrow="Register your interest" ...>` → remove that line

For each, the edit is: delete the `eyebrow="..."` line from the `<PageHero>` call, leaving `title`, `intro`, `image`, and `children` (whichever the call site actually passes) untouched.

- [ ] **Step 4: Remove `eyebrow=` from every `SectionHeading` call site**

Read the current content of each file below and remove the `eyebrow="..."` (or `eyebrow={...}`) argument from every `<SectionHeading ... />` call, keeping `title` and any other props (`align`, `intro`) unchanged:

- `app/about/page.tsx` — 3 call sites: `eyebrow="Our story"`, `eyebrow="What we stand for"`, `eyebrow="The road here"`
- `app/accommodation/page.tsx` — 2 call sites: `eyebrow={tier.eyebrow}`, `eyebrow="Booking Info"`
- `app/contact/page.tsx` — 1 call site: `eyebrow="Get in touch"`
- `app/experience/page.tsx` — 5 call sites: `eyebrow="About Zanzibar"`, `eyebrow="Things to Do"`, `eyebrow="Culture & Heritage"`, `eyebrow="Food & Cuisine"`, `eyebrow="Travel Information"`
- `app/festival/page.tsx` — 3 call sites: `eyebrow="Choose your start line"`, `eyebrow="Race weekend"`, `eyebrow="Your entry includes"`
- `app/leadership/page.tsx` — 1 call site: `eyebrow="Leadership"`
- `app/partnership/page.tsx` — 2 call sites: `eyebrow="Partnership tiers"`, `eyebrow="Start the conversation"`
- `components/disciplines.tsx` — 1 call site: `eyebrow="Two disciplines, one festival"`

For example, `app/leadership/page.tsx`'s `<SectionHeading eyebrow="Leadership" title="Meet the core team." />` becomes:

```tsx
<SectionHeading title="Meet the core team." />
```

And `app/accommodation/page.tsx`'s per-tier `<SectionHeading eyebrow={tier.eyebrow} title={tier.title} />` becomes:

```tsx
<SectionHeading title={tier.title} />
```

(The `TIERS` array's `eyebrow` field itself, e.g. `{ id: 'hotels', eyebrow: 'Hotels', title: '...', items: HOTELS }`, can stay in the data structure even though it's no longer rendered — removing unused data fields from that array is optional cleanup, not required; if you do remove the field, also remove it from all 4 tier objects consistently, don't leave it half-removed.)

- [ ] **Step 5: Verify with a build, not just grep**

```bash
pnpm build
```

Expected: clean build with zero TypeScript errors. Since `PageHero`'s `eyebrow` prop is now removed from its type entirely, any call site you missed will fail to compile with an error like "Property 'eyebrow' does not exist on type...". Fix any such errors by removing the stray `eyebrow=` line the build points at.

- [ ] **Step 6: Manual verification**

Run `pnpm dev`. Visit every route (`/`, `/about`, `/festival`, `/experience`, `/accommodation`, `/partnership`, `/leadership`, `/faq`, `/contact`, `/register`) and confirm: no small uppercase label + chevron-icon row appears above any page's `<h1>` or above any section's `<h2>`. Page titles, intros, and body content are otherwise unchanged. Check both light and dark mode on at least 2 pages for text spacing (the heading no longer has `mt-4` since there's nothing above it — confirm this doesn't look cramped against the `PageHero`'s existing top padding).

- [ ] **Step 7: Commit**

```bash
git add components/page-hero.tsx components/section-heading.tsx app/about/page.tsx app/accommodation/page.tsx app/contact/page.tsx app/experience/page.tsx app/faq/page.tsx app/festival/page.tsx app/leadership/page.tsx app/partnership/page.tsx app/register/page.tsx components/disciplines.tsx
git commit -m "Remove the repeated eyebrow/chevron tag row from PageHero and SectionHeading site-wide"
```

---

### Task 5: Remove remaining deep-teal usage (stats band, newsletter form, about/partnership pages)

**Files:**
- Modify: `components/stats-band.tsx`
- Modify: `components/newsletter-form.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/partnership/page.tsx`

**Interfaces:**
- No prop/type changes — className-only substitutions. `components/page-hero.tsx` and `components/section-heading.tsx`'s deep-teal usages are already resolved by Task 4 (folded in there since both files were being rewritten anyway) — do not re-touch those two files in this task.

**Context:** `app/globals.css`'s `--deep-teal` token definition itself is NOT deleted (per Global Constraints) — this task only stops the remaining 4 files from consuming it, replacing it with the site's existing `ink`/`surface-dark` dark-neutral tokens per the client's explicit "replace with black" choice.

- [ ] **Step 1: Replace `stats-band.tsx`'s background**

In `components/stats-band.tsx`, replace line 12:

```tsx
    <section className="bg-surface-dark py-16 lg:py-20">
```

(Was `bg-deep-teal`. `bg-surface-dark` is the theme-aware dark-neutral token already used throughout the rest of the site — resolves to the site's `ink` tone in dark mode and to `bone` in light mode, same as every other "dark band" section. Note: the rest of this component's text uses `text-bone`/`text-bone/70`/`text-bone/80` hardcoded literal-light-text classes, which assumed the band was always the fixed-dark `deep-teal` color — check whether these need to become theme-aware too now that the background itself is theme-aware; if `bg-surface-dark` flips to a light `bone` background in light mode, hardcoded `text-bone` text would become invisible, the same class of bug fixed in round one's Task 1. Read the current file, and if this looks like it would reproduce that exact bug, use `text-surface-dark-foreground` equivalents instead of `text-bone` literals — check `components/page-hero.tsx`'s pattern for the correct token names to use for foreground text against a `bg-surface-dark` background.)

- [ ] **Step 2: Replace `newsletter-form.tsx`'s disabled-state background**

In `components/newsletter-form.tsx`, replace line 56's `disabled:bg-deep-teal` with `disabled:bg-ink-soft`:

```tsx
          className="inline-flex h-12 items-center gap-2 rounded-sm bg-bone px-5 font-utility text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-amber disabled:cursor-default disabled:bg-ink-soft disabled:text-bone"
```

(This form always renders on the site footer's fixed-dark surface — confirmed in round one's work that the footer is always `bg-ink` regardless of theme — so a literal `ink-soft` here, rather than a theme-aware token, is correct and consistent with the footer's other literal-dark styling.)

- [ ] **Step 3: Replace `app/about/page.tsx`'s deep-teal usage**

Read the current file and find its deep-teal reference (likely a CTA band section background, e.g. `bg-deep-teal` on a closing call-to-action section). Replace it with `bg-surface-dark` (theme-aware) if the section's text uses theme-aware tokens already, or with the literal `bg-ink` if the section's text is hardcoded light (`text-bone`) and always intended to look the same regardless of theme (check the surrounding text color classes to decide which is correct, following the same reasoning as Step 1).

- [ ] **Step 4: Replace `app/partnership/page.tsx`'s deep-teal usage**

Read the current file and find its deep-teal reference (likely the stats/reach band near the top of the page, similar in shape to `stats-band.tsx`). Apply the same fix pattern as Step 1: replace the background with the theme-aware equivalent, and check whether its text classes need to become theme-aware too rather than staying hardcoded light-text literals.

- [ ] **Step 5: Confirm no deep-teal consumption remains outside `globals.css`**

```bash
grep -rln "deep-teal" app components
```

Expected: only `app/globals.css` (the token definition itself, which stays per Global Constraints). No `.tsx` files should appear.

- [ ] **Step 6: Manual verification**

Run `pnpm dev`. Visit `/`, `/about`, `/partnership`. Confirm the previously dark-blue-teal sections (stats band, newsletter form's disabled button state, About's CTA band, Partnership's reach band) now render as black/ink instead, in both light and dark mode, with legible text in both (this is the main risk — re-check the reasoning from Step 1 was applied correctly if any section looks like light-text-on-light-background).

- [ ] **Step 7: Commit**

```bash
git add components/stats-band.tsx components/newsletter-form.tsx app/about/page.tsx app/partnership/page.tsx
git commit -m "Remove remaining deep-teal accent usage in favor of black, per client's two-color (black+gold) direction"
```

---

### Task 6: Rewrite em-dashes in visible site copy

**Files:**
- Modify: `app/about/page.tsx` (5 occurrences)
- Modify: `app/accommodation/page.tsx` (9 occurrences)
- Modify: `app/contact/page.tsx` (2 occurrences)
- Modify: `app/experience/page.tsx` (17 occurrences)
- Modify: `app/faq/page.tsx` (3 occurrences)
- Modify: `app/festival/page.tsx` (4 occurrences, one already removed if it was inside an `eyebrow=` string handled by Task 4 — re-check)
- Modify: `app/gallery/page.tsx` — already deleted in Task 3, skip
- Modify: `app/leadership/page.tsx` (2 occurrences)
- Modify: `app/partnership/page.tsx` (1 occurrence)
- Modify: `app/register/page.tsx` (2 occurrences)
- Modify: `components/disciplines.tsx` (3 occurrences)
- Modify: `components/why-zanzibar.tsx` (1 occurrence)
- Modify: `components/register-form.tsx` (3 occurrences, `CATEGORIES` array only — see Context)

**Interfaces:**
- Copy-only changes — no prop/type/structural changes anywhere in this task.

**Context:** per Global Constraints, do NOT touch em-dashes inside code comments (`components/hero.tsx`, `components/hero-art.tsx`, `components/newsletter-form.tsx:24`, `components/site-footer.tsx:56`) or inside the mailto subject/body template strings (`components/contact-form.tsx:52`, `components/register-form.tsx:59`) — those aren't visible site content and are out of scope. `components/register-form.tsx`'s `CATEGORIES` array (lines 11-13, e.g. `'HYROX-Style — Elite'`) IS in scope despite living in a form component: those 3 strings render as visible `<option>` text in the Register page's category dropdown. Touch only those 3 lines in that file — leave its mailto `subject`/`body` template strings (elsewhere in the same file) untouched.

- [ ] **Step 1: Rewrite `app/about/page.tsx`**

Read the current file. Rewrite each of these (line numbers approximate, based on planning-time content — find by matching the quoted text, since round one's tasks may have shifted exact positions):

- `'Road cycling and functional fitness racing share the same coastline, the same village and the same finish line — so athletes and their families never have to choose.'` →
  `'Road cycling and functional fitness racing share the same coastline, the same village and the same finish line, so athletes and their families never have to choose.'`
- `'Inaugural edition — 6 November. 1,500+ athletes across 15 countries.'` →
  `'Inaugural edition on 6 November. 1,500+ athletes across 15 countries.'`
- `"ZanziFit is a hybrid endurance festival on the coast of Zanzibar — road cycling and HYROX-style functional fitness racing across one unforgettable weekend."` →
  `"ZanziFit is a hybrid endurance festival on the coast of Zanzibar, combining road cycling and HYROX-style functional fitness racing across one unforgettable weekend."`
- `"We took two of the fastest-growing sports in the world — road cycling and HYROX-style functional racing — and set them against the turquoise water and closed coastal roads of Zanzibar."` →
  `"We took two of the fastest-growing sports in the world, road cycling and HYROX-style functional racing, and set them against the turquoise water and closed coastal roads of Zanzibar."`

- [ ] **Step 2: Rewrite `app/accommodation/page.tsx`**

Read the current file and rewrite each em-dash occurrence, following this pattern (find-by-quoted-text, not line number, since this file has been edited by prior tasks):

- `'Where to stay for ZanziFit Festival — hotels, resorts, boutique stays and budget options around Zanzibar. We help you book.'` →
  `'Where to stay for ZanziFit Festival: hotels, resorts, boutique stays and budget options around Zanzibar. We help you book.'`
- `'A longer transfer from the festival village — plan race-morning logistics ahead'` →
  `'A longer transfer from the festival village, so plan race-morning logistics ahead'`
- `'A simple, business-friendly hotel close to the festival venue — the shortest possible commute to the start line.'` →
  `'A simple, business-friendly hotel close to the festival venue, the shortest possible commute to the start line.'`
- `'A secluded beach lodge inside the Menai Bay Conservation Area — the closest resort stay to the festival village.'` →
  `'A secluded beach lodge inside the Menai Bay Conservation Area, the closest resort stay to the festival village.'`
- `'A family-run guesthouse in Stone Town with rooftop breakfast views — simple, friendly and central.'` →
  `'A family-run guesthouse in Stone Town with rooftop breakfast views. Simple, friendly and central.'`
- `'A few steps from Paje beach — dorms and private bandas, communal kitchen and on-site bar.'` →
  `'A few steps from Paje beach, with dorms and private bandas, a communal kitchen and an on-site bar.'`
- `'Book directly with the property or let us handle the confirmation — either way, we stay in the loop.'` →
  `'Book directly with the property or let us handle the confirmation. Either way, we stay in the loop.'`
- `"ZanziFit doesn't run properties — we know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."` →
  `"ZanziFit doesn't run properties. We know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."`
- The template literal `` `${item.area} — ${item.summary}` `` (in the `TIERS.map()` render) →
  `` `${item.area}: ${item.summary}` ``

- [ ] **Step 3: Rewrite `app/contact/page.tsx`**

- `'Get in touch with ZanziFit Festival — Zanzibar, Tanzania.'` (metadata description) →
  `'Get in touch with ZanziFit Festival in Zanzibar, Tanzania.'`
- `"Questions about the festival, your category, or partnering with us — reach out and we'll get back to you."` →
  `"Questions about the festival, your category, or partnering with us? Reach out and we'll get back to you."`

- [ ] **Step 4: Rewrite `app/experience/page.tsx`** (largest file in this task, 17 occurrences)

Read the current file in full and rewrite each em-dash occurrence found via `grep -n "—" app/experience/page.tsx`. Apply the same pattern throughout: a mid-sentence em-dash setting off an explanatory clause becomes a comma (if the clause is short and flows as a continuation) or a period (if the clause could stand as its own sentence); an em-dash used like "X — Y" as a colon-style label becomes a colon or "is"/"means" construction. For example:

- `'House of Wonders — former Sultan\'s palace, now a museum of Swahili and Zanzibar history'` →
  `'House of Wonders: a former Sultan\'s palace, now a museum of Swahili and Zanzibar history'`
- `'Every evening the seafront gardens turn into an open-air food market — grilled seafood skewers, samosas and Zanzibar "pizza" cooked to order.'` →
  `'Every evening the seafront gardens turn into an open-air food market, with grilled seafood skewers, samosas and Zanzibar "pizza" cooked to order.'`
- `'The conservation area right on the festival venue\'s doorstep — dolphin encounters, snorkeling and sandbank boat trips.'` →
  `'The conservation area right on the festival venue\'s doorstep, with dolphin encounters, snorkeling and sandbank boat trips.'`
- `'The island\'s north-tip beaches — turquoise water, sandbars and the liveliest sunset scene in Zanzibar.'` →
  `'The island\'s north-tip beaches: turquoise water, sandbars and the liveliest sunset scene in Zanzibar.'`
- `'Zanzibar\'s only national park — home to the red colobus monkey, found nowhere else on Earth.'` →
  `'Zanzibar\'s only national park, home to the red colobus monkey found nowhere else on Earth.'`
- `'A marine conservation area off the north-east coast — some of the clearest water in Zanzibar for snorkeling and diving.'` →
  `'A marine conservation area off the north-east coast, with some of the clearest water in Zanzibar for snorkeling and diving.'`
- `'Less developed than Nungwi or Kendwa — a quieter alternative for a day trip'` →
  `'Less developed than Nungwi or Kendwa, a quieter alternative for a day trip'`
- `'Stone Town\'s carved wooden doors are a signature craft — each pattern historically signalled the wealth and trade of the household.'` →
  `'Stone Town\'s carved wooden doors are a signature craft. Each pattern historically signalled the wealth and trade of the household.'`
- `'A tangy, spiced soup with cassava, potato fritters and mango — a Stone Town staple.'` →
  `'A tangy, spiced soup with cassava, potato fritters and mango. A Stone Town staple.'`
- `'Octopus curry — tender octopus simmered in a coconut sauce with garlic, ginger and turmeric.'` →
  `'Octopus curry: tender octopus simmered in a coconut sauce with garlic, ginger and turmeric.'`
- `'Lightly sweetened Swahili doughnuts, flavoured with cardamom — a common breakfast snack with tea or coffee.'` →
  `'Lightly sweetened Swahili doughnuts, flavoured with cardamom. A common breakfast snack with tea or coffee.'`
- `'Dry season: June–October and January–February — the best window for racing and sightseeing'` →
  `'Dry season: June–October and January–February, the best window for racing and sightseeing'`
  (Note: keep the en-dash `–` in "June–October" and "January–February" — those are date-range en-dashes, a different character from the em-dash `—` this task targets. Only remove/rewrite the em-dash.)
- `'Visa on arrival is available for most nationalities — confirm your requirement before you fly'` →
  `'Visa on arrival is available for most nationalities. Confirm your requirement before you fly'`
- `'Currency: Tanzanian Shilling (TZS) — US dollars are widely accepted at hotels and tour operators'` →
  `'Currency: Tanzanian Shilling (TZS). US dollars are widely accepted at hotels and tour operators'`
- `"ZanziFit is based on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."` →
  `"ZanziFit is based on Zanzibar's west coast, a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."`
- The metadata `description` string: `'What to see, taste and understand on the island that hosts ZanziFit — Stone Town, the coast, the culture and the food, all a short ride from the festival venue.'` →
  `'What to see, taste and understand on the island that hosts ZanziFit: Stone Town, the coast, the culture and the food, all a short ride from the festival venue.'`
- The "About Zanzibar" paragraph's `'of the west coast on Menai Bay — close enough to Stone'` (mid-sentence, spans a line break in source) — read the full sentence in context and rewrite the em-dash to a comma: `'of the west coast on Menai Bay, close enough to Stone'`

- [ ] **Step 5: Rewrite `app/faq/page.tsx`**

- `'...The festival venue is roughly 30–45 minutes from the airport by road — exact transfer options will be published closer to race day.'` →
  `'...The festival venue is roughly 30–45 minutes from the airport by road. Exact transfer options will be published closer to race day.'`
  (Keep the en-dash in "30–45 minutes" — only rewrite the em-dash.)
- `'Yes — ZanziFit welcomes spectators. ...'` →
  `'Yes, ZanziFit welcomes spectators. ...'`
- `"Travel, visas, accommodation and what to expect as a spectator — the practical details for race weekend."` →
  `"Travel, visas, accommodation and what to expect as a spectator: the practical details for race weekend."`

- [ ] **Step 6: Rewrite `app/festival/page.tsx`**

- `'Eight functional stations against the clock — sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.'` →
  `'Eight functional stations against the clock: sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.'`
- `'Elite road race — dawn start'` (a `SCHEDULE` array item string) →
  `'Elite road race, dawn start'`
- `"6–8 November 2026 in Zanzibar. Race the discipline you love — or take on both — then recover on the same sand you started from."` →
  `"6–8 November 2026 in Zanzibar. Race the discipline you love, or take on both, then recover on the same sand you started from."`
  (Keep the en-dash in "6–8 November".)
- The `SectionHeading` `title="Pick your lane — or take on both."` prop →
  `title="Pick your lane, or take on both."`

- [ ] **Step 7: Rewrite `app/leadership/page.tsx`**

- `'Meet the team behind ZanziFit Festival — endurance athletes, event operators and Zanzibari hospitality leaders.'` (metadata description) →
  `'Meet the team behind ZanziFit Festival: endurance athletes, event operators and Zanzibari hospitality leaders.'`
- `"ZanziFit's core team is the group of six who hold direct operating and governing responsibility for the festival — spanning event delivery, athlete and venue operations, and Zanzibari hospitality partnerships. Every decision on the festival's direction runs through this group."` →
  `"ZanziFit's core team is the group of six who hold direct operating and governing responsibility for the festival, spanning event delivery, athlete and venue operations, and Zanzibari hospitality partnerships. Every decision on the festival's direction runs through this group."`

- [ ] **Step 8: Rewrite `app/partnership/page.tsx`**

- `"ZanziFit gives partners category exclusivity at a premium destination event — reaching an engaged, affluent, health-focused audience across 15 countries."` →
  `"ZanziFit gives partners category exclusivity at a premium destination event, reaching an engaged, affluent, health-focused audience across 15 countries."`

- [ ] **Step 9: Rewrite `app/register/page.tsx`**

- `'Register your interest for ZanziFit Festival — road cycling, HYROX-style, and corporate team categories.'` (metadata description) →
  `'Register your interest for ZanziFit Festival: road cycling, HYROX-style, and corporate team categories.'`
- `"Official registration hasn't opened yet. Tell us which category you want, and we'll email you the moment entries go live — with pricing, cutoffs and early-bird windows."` →
  `"Official registration hasn't opened yet. Tell us which category you want, and we'll email you the moment entries go live, with pricing, cutoffs and early-bird windows."`

- [ ] **Step 10: Rewrite `components/disciplines.tsx`**

- `'Coastal road racing on closed circuits along the Zanzibar coastline — from a fast community sprint to a punishing elite endurance loop.'` →
  `'Coastal road racing on closed circuits along the Zanzibar coastline, from a fast community sprint to a punishing elite endurance loop.'`
- `'Eight functional stations against the clock — sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.'` →
  `'Eight functional stations against the clock: sled push, sled pull, rowing, burpee broad jumps and the wall-ball finish. Run. Work. Repeat.'`
- `"ZanziFit runs two competitions across one weekend on the same coastline — pick your lane, or take on both."` →
  `"ZanziFit runs two competitions across one weekend on the same coastline. Pick your lane, or take on both."`

- [ ] **Step 11: Rewrite `components/why-zanzibar.tsx`**

Read the current file and find the em-dash occurrence (around the phrase "East Africa's most iconic destinations — so athletes arrive to"). Rewrite following the same comma/period pattern based on the full sentence context.

- [ ] **Step 12: Rewrite the 3 visible `CATEGORIES` strings in `components/register-form.tsx`**

Replace lines 11-13 (the `CATEGORIES` array, NOT the mailto template strings elsewhere in this file):

```tsx
const CATEGORIES = [
  'Elite Road Race',
  'Open 60 km (Cycling)',
  'Community 20 km (Cycling)',
  'HYROX-Style: Elite',
  'HYROX-Style: Open',
  'HYROX-Style: Corporate Teams',
]
```

(These 3 lines render as visible `<option>` text in the Register page's category dropdown, so they count as site copy despite living in a form component. Do NOT touch this file's `handleSubmit`'s `subject`/`body` mailto template strings — those stay as-is per Global Constraints.)

- [ ] **Step 13: Final sweep verification**

```bash
grep -rn "—" app/*/page.tsx components/*.tsx
```

Expected: only matches inside `components/hero.tsx`, `components/hero-art.tsx`, `components/newsletter-form.tsx` (the one code comment), `components/site-footer.tsx` (the one code comment), `components/contact-form.tsx` (mailto template), and `components/register-form.tsx` (mailto template) should remain — all explicitly out of scope per Global Constraints. Every other file should show zero matches.

- [ ] **Step 14: Manual verification**

Run `pnpm dev`. Visit every route and read through the visible copy on each page. Confirm every rewritten sentence reads naturally and grammatically (not truncated or run-on) and that the site's voice (direct, confident, unadorned — matching the original brand blueprint) is preserved.

```bash
pnpm build
```

Expected: clean build, no errors (this task is copy-only, so a build failure here would indicate an accidental syntax error introduced while editing a string literal, e.g. an unescaped quote — check carefully if this fails).

- [ ] **Step 15: Commit**

```bash
git add app/about/page.tsx app/accommodation/page.tsx app/contact/page.tsx app/experience/page.tsx app/faq/page.tsx app/festival/page.tsx app/leadership/page.tsx app/partnership/page.tsx app/register/page.tsx components/disciplines.tsx components/why-zanzibar.tsx components/register-form.tsx
git commit -m "Rewrite em-dashes in visible site copy into natural punctuation"
```

---

## Final full-site smoke test

After all 6 tasks are complete, do one end-to-end pass:

- [ ] **Step 1: Full build check**

```bash
pnpm build
```

Expected: build completes with no type errors, and the route list no longer includes `/gallery`.

- [ ] **Step 2: Full manual walkthrough**

Run `pnpm dev` and visit every remaining route: `/`, `/about`, `/festival`, `/experience`, `/accommodation`, `/partnership`, `/leadership`, `/faq`, `/contact`, `/register`. For each, confirm:
- No eyebrow/chevron tag row appears anywhere (Task 4).
- No visible em-dash remains in body copy (Task 6).
- No deep-teal/dark-blue color appears anywhere, in either theme (Task 5).
- The logo renders sharp at large window sizes via SVG (Task 1).
- The nav never wraps a label onto two lines at any common desktop width (Task 2).
- `/gallery` 404s and no link to it exists anywhere (Task 3).

- [ ] **Step 3: Final commit (if any stragglers found)**

If the smoke test finds anything left over, fix it and commit with a message describing exactly what was missed.
