# Second round of client feedback: logo, nav wrap, Gallery removal, AI-tells cleanup

**Date**: 2026-07-22
**Status**: Approved for planning

## Context

After the first round of fixes shipped to production, the client reviewed
the live site again (screenshot with four circled/numbered issues, plus
three additional numbered notes) and reported seven items. This spec
covers the six that are code-actionable now; item 7 (sourcing real
photography) is explicitly deferred — the client will source photos
manually and provide them for integration in a future pass.

## Item 1 — Logo still looks "zoomed"/stretched

**Root cause confirmed**: even after Task 6 of the first round (auto-trim
via `sharp`), the logo asset in production is still a raster PNG. A raster
image scaled via CSS (`h-10 w-auto` etc.) will always show some visual
softness/distortion depending on the browser's exact render size versus the
source pixel dimensions — this is inherent to raster images, not something
further cropping fixes.

**Discovery during this session**: two SVG files already exist in the repo
root — `file.svg` and `SMrY001.svg`. Both were rendered and visually
confirmed to be genuine vector versions of the ZFit wordmark (not
unrelated leftover assets, as initially suspected). `file.svg` is a solid
filled-black rendering matching the site's current logo treatment;
`SMrY001.svg` is a rough/distressed outlined variant. `file.svg` is the
correct one to use.

**Fix**: Move `file.svg` into `public/` as `zfit-logo.svg`. Update
`components/site-header.tsx` and `components/site-footer.tsx` to reference
the SVG instead of `zfit-logo.png`. An SVG scales losslessly at any
rendered size, permanently resolving the "zoomed" perception — no further
cropping/regeneration workaround needed. The existing `invert-0` /
`invert` theme-toggle logic (from Task 1 of round one) continues to apply
identically, since it's a CSS filter on the `<Image>` element regardless
of source format.

## Item 2 — Nav label wraps onto two lines

**Root cause confirmed**: `components/site-header.tsx`'s nav `<Link>`
elements have no `whitespace-nowrap`. With 9 nav items at `gap-7` and
`tracking-[0.14em]` inside the header's max-width container, the longest
label ("Experience Zanzibar") wraps onto two lines at common `lg`-breakpoint
viewport widths (the breakpoint where the desktop nav first appears,
1024px+). The client confirmed this is a layout/wrapping bug, not a
wording complaint — "Experience Zanzibar" should stay as the label text,
it just needs to render on one line.

**Fix**:
- Add `whitespace-nowrap` to the nav `<Link>` className so no label can
  ever wrap, regardless of viewport width.
- Reduce the inter-item gap specifically at the `lg` breakpoint (e.g.
  `lg:gap-5 xl:gap-7`) so all items comfortably fit at the narrower end of
  desktop widths, rather than only suppressing the wrap and risking visual
  crowding or a nav that touches the register button.
- This combines with Item 3 (Gallery removal, below), which drops the nav
  from 9 items to 8 and gives additional room.

## Item 3 — Remove the Gallery page entirely

**Confirmed scope**: `app/gallery/page.tsx` (the route), its dedicated
`components/gallery-grid.tsx` component, the nav entry in
`components/site-header.tsx`'s `NAV` array (both desktop and mobile menus
consume the same array), and the footer's "Discover" column link in
`components/site-footer.tsx`. Also check for any other internal `/gallery`
links (e.g. from other pages) and remove those references too.

**Fix**: Delete the route and component files, remove the nav/footer
entries. No replacement page or redirect is needed — the client wants the
page gone, not relocated.

## Item 4 — Remove the "eyebrow" tag pattern site-wide

**Root cause confirmed**: the small uppercase label + chevron icon row
(e.g. "THE FESTIVAL", "EXPERIENCE ZANZIBAR" as seen at the top of each
page) is rendered by two shared components consumed on every single
page: `components/page-hero.tsx` (the `eyebrow` prop, rendered at
`page-hero.tsx:34-37`, used as the top-of-page banner on every interior
page) and `components/section-heading.tsx` (the same pattern, rendered at
`section-heading.tsx:27-44`, used within page body sections). The client
identifies this repeated tag as one of the strongest "built by AI"
tells — a decorative label that adds no information and repeats
identically everywhere.

**Fix**: Remove the eyebrow/chevron row from both `PageHero` and
`SectionHeading`. This is a two-component fix that cascades to every page
automatically — no per-page edits needed for the removal itself. Titles
and intro paragraphs are unaffected and stay exactly as they are; only the
small label+chevron row above the title disappears. The `eyebrow` prop
itself can either be dropped entirely from both components' prop
signatures (cleaner, but requires updating every call site to stop passing
it) or left as an accepted-but-unused prop (avoids touching every call
site, but leaves dead code). Given the number of call sites (every page in
the app), the plan should default to removing the prop from the component
signatures and every call site, since leaving an unused, silently-ignored
prop across ~13 files is exactly the kind of unnecessary leftover this
whole feedback round is trying to eliminate.

## Item 5 — Remove all em-dashes from written content

**Confirmed scope**: 67 em-dash (—) occurrences across roughly 18 files
in `app/*/page.tsx` and `components/*.tsx`. The client identifies em-dashes
as a strong "written by AI" tell and wants them removed from all body
copy, headings, and intros.

**Fix**: This is not a mechanical find-and-replace — deleting the
character alone would break sentence grammar in most cases (em-dashes are
used mid-sentence to set off a clause). Each occurrence needs to be
rewritten by hand into natural punctuation appropriate to that specific
sentence: most commonly a period (splitting into two sentences), a comma,
or a restructured single sentence. The rewritten copy must preserve the
original meaning and keep the site's existing voice (the "Horizon meets
the start line" brand tone established in the original blueprint) — this
is a copy-editing pass, not a mechanical substitution, and should be
reviewed sentence-by-sentence.

## Item 6 — Remove the dark-blue ("deep teal") accent color

**Confirmed scope**: `--deep-teal` is referenced (as `bg-deep-teal`,
`text-deep-teal`, or via the `--secondary`/`--accent` semantic token chain)
in 7 files: `app/globals.css` (token definitions), `app/about/page.tsx`,
`app/partnership/page.tsx`, `components/newsletter-form.tsx`,
`components/page-hero.tsx` (the decorative background gradient),
`components/section-heading.tsx` (the `tone="light"` variant's eyebrow/
heading color — though per Item 4 this component's eyebrow is being
removed entirely, its heading-color logic may still reference deep-teal
independent of the eyebrow), and `components/stats-band.tsx`.

The client's original brand direction (see
`ZanziFit_Festival_Website_Blueprint.md`) called for a three-color system
(Ink/Bone neutrals + Amber primary + Deep Teal "luxury/ocean" register +
Ember for urgency). The client has now decided to simplify to strictly two
primary colors: black (the existing `ink`/`surface-dark` neutral tokens)
and gold (the existing `amber` accent). Ember (used only for the
live/urgent countdown, per the original brand rationale) is not mentioned
by the client and is out of scope for this change — only deep-teal is
being removed.

**Fix**: Replace every consuming usage of `deep-teal` with the site's
existing `ink`/`surface-dark` dark-neutral tokens (per the client's
explicit choice of "replace with black"). Do not delete the `--deep-teal`
CSS custom property itself from `globals.css`'s token definitions — leaving
an unused token defined is zero-risk; removing it requires certainty
nothing else references it, which is unnecessary extra risk for this pass.
Only stop *consuming* it in the 6 component/page files.

## Item 7 — Real photography (deferred, not in this plan)

The client confirmed no automated web-search-and-download capability is
available for sourcing licensed, high-quality photography in this session.
The client will source photos manually and provide them in a future
conversation. No code changes for this item are part of this plan.

## Files touched (expected)

- `public/zfit-logo.svg` (new, moved from repo-root `file.svg`)
- `components/site-header.tsx` — logo swap, nav-wrap fix, Gallery nav entry removed
- `components/site-footer.tsx` — logo swap, Gallery footer link removed
- `app/gallery/page.tsx` — deleted
- `components/gallery-grid.tsx` — deleted
- `components/page-hero.tsx` — eyebrow row + prop removed
- `components/section-heading.tsx` — eyebrow row + prop removed, deep-teal usage removed
- Every `app/*/page.tsx` and any component that calls `PageHero`/`SectionHeading` with an `eyebrow` prop — prop removed from call sites
- `app/globals.css` — no token deletions, only stops being referenced by consumers
- `app/about/page.tsx`, `app/partnership/page.tsx`, `components/newsletter-form.tsx`, `components/stats-band.tsx` — deep-teal usage replaced with ink/surface-dark
- ~18 files across `app/*/page.tsx` and `components/*.tsx` — em-dash rewrite pass

## Testing

No automated test suite exists in this repo (confirmed, consistent with
prior work). Verification is manual/visual via the dev server and
`pnpm build`, consistent with how the first round of fixes was verified:

- Every route loads with no build/type errors.
- Nav renders on one line at common desktop widths (1024px, 1280px,
  1440px) with no wrapping, in both light and dark mode.
- `/gallery` returns a 404 (route genuinely removed); no remaining links
  to it anywhere in the site.
- No page shows the small uppercase eyebrow/chevron tag row anywhere;
  page titles and intros otherwise unchanged.
- `grep -rn "—" app components` (excluding intentionally-kept punctuation
  elsewhere, if any) returns zero matches.
- `grep -rln "deep-teal" app components` returns zero matches; visually
  confirm the previously-teal sections (About's values band, Partnership's
  stats band, PageHero's decorative background) now read as black/ink
  instead, in both themes.
- Logo renders sharp at both header and footer sizes at a maximized
  browser window, with no visible softness/stretching, in both themes.
