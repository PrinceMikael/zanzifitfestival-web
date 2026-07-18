# Visual polish: layout density, theme contrast, cursor, logo — design

Date: 2026-07-18

## Purpose

User feedback on the merged `/experience` and `/accommodation` pages
surfaced several issues, most of them pre-existing site-wide problems
that the new pages simply inherited by following established
conventions:

1. Inner pages (via the shared `PageHero`) feel sparse/empty on wide
   viewports — text-only, no visual fill, unlike the homepage's
   full-bleed animated hero. Confirmed by the user as a site-wide
   complaint, not limited to the two new pages — the fix scope matches
   the light-mode fix below (item 3): applied everywhere the pattern
   appears, judged per-page rather than as a blind mechanical change.
2. `/experience`'s "About Zanzibar" section is a single narrow text
   column with no companion visual, unlike the Culture & Heritage
   section right below it.
3. Light mode has broken contrast on body/section content site-wide:
   `app/globals.css:52-55` documents that only *semantic* tokens
   (`--background`, `--foreground`, etc.) remap for light theme —
   direct brand-token usage (`bg-ink`, `bg-ink-soft`, `text-bone`) was
   explicitly left as "handled per-section in later work," which never
   happened. This affects 21+ components, not just the two new pages.
4. The header logo (`h-8 lg:h-9`, ~32–36px tall) reads as small next to
   the nav.
5. The custom cursor (`components/custom-cursor.tsx`) is a small amber
   dot/ring that loses contrast against amber-toned UI (buttons, active
   nav links, badges).
6. `/experience` and `/accommodation` feel content-light — user wants
   roughly double the items per section/tier.

## Non-goals

- Not touching `custom-cursor.tsx` or `theme-toggle.tsx`'s existing
  uncommitted in-progress edits beyond what's needed — those files
  already had unstaged changes on `main` before this work started
  (an `iconOnly` guard on the cursor, and an icon-only theme toggle
  button). This work builds on top of them, doesn't revert them.
- Not touching the header/footer's *intentional* always-dark behavior.
  Both have explicit code comments stating they render on a literal
  dark surface regardless of theme, so their logo stays `invert`ed
  unconditionally. The light-mode fix must not affect them.
- Not redesigning the homepage hero (`components/hero.tsx`) — it
  already has full visual treatment and isn't part of the complaint.
- Not adding new real photography — same placeholder-image constraint
  as the original design doc (`2026-07-18-experience-accommodation-pages-design.md`).
  More content items reuse the existing placeholder set
  (`zanzibar-coast.png`, `festival-village.png`, `finish-line.png`,
  `hyrox-arena.png`, `cycling.png`) in rotation.

## 1. Theme-aware section tokens (site-wide, but scoped)

Add new CSS custom properties in `app/globals.css` that DO flip between
themes, distinct from the raw brand tokens (`--ink`, `--ink-soft`,
`--bone`) which stay literal/unconditional for header, footer, and any
other deliberately-always-dark surface:

```css
:root {
  /* ...existing... */
  --surface-dark: var(--ink);
  --surface-dark-soft: var(--ink-soft);
  --surface-dark-foreground: var(--bone);
  --surface-dark-foreground-muted: var(--bone-muted);
}

:root[data-theme='light'] {
  /* ...existing... */
  --surface-dark: var(--bone);
  --surface-dark-soft: #e4ddc9;
  --surface-dark-foreground: var(--ink);
  --surface-dark-foreground-muted: rgba(11, 14, 18, 0.62);
}
```

Expose as Tailwind utilities in the `@theme inline` block:

```css
--color-surface-dark: var(--surface-dark);
--color-surface-dark-soft: var(--surface-dark-soft);
--color-surface-dark-foreground: var(--surface-dark-foreground);
```

New utility classes: `bg-surface-dark`, `bg-surface-dark-soft`,
`text-surface-dark-foreground`.

**Migration scope:** every page-body / section usage of `bg-ink`,
`bg-ink-soft`, and `text-bone` gets swapped to the new tokens —
`app/about/page.tsx`, `app/festival/page.tsx`, `app/leadership/page.tsx`,
`app/partnership/page.tsx`, `app/experience/page.tsx`,
`app/accommodation/page.tsx`, and the shared components they render
through (`why-zanzibar.tsx`, `disciplines.tsx`, `stats-band.tsx`,
`cta-band.tsx`, `partner-strip.tsx`, `gallery-grid.tsx`,
`expandable-card.tsx`, `page-hero.tsx`, `section-heading.tsx`,
`accordion-item.tsx`). **Explicitly excluded:** `site-header.tsx` and
`site-footer.tsx` keep their literal `bg-ink`/`text-bone`/`invert`
exactly as-is (both have code comments explaining why).

`components/hero.tsx` (homepage) also stays as literal `bg-ink` — it's
a full-bleed dark cinematic section by design, not a body/content
section, and isn't part of the reported complaint.

## 2. `PageHero` visual fill

`components/page-hero.tsx` gains an optional `image` slot:

```ts
{
  eyebrow: string
  title: ReactNode
  intro?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}
```

When `image` is passed, the hero becomes a 2-column grid on `md:` and
up (text left, image right in a rounded/bordered frame matching the
site's existing image treatment — see `why-zanzibar.tsx`'s
`aspect-[4/3] overflow-hidden rounded-lg border border-border`
pattern). When omitted, today's text-only single-column layout is
unchanged — so pages that don't pass an image (any not touched below)
render identically to before.

**Scope widened to site-wide** (per user follow-up: the emptiness
complaint applies to the whole site, not just the two new pages,
matching the light-mode fix's scope). `PageHero` consumers and their
assigned image:

| Page | Image | Rationale |
|---|---|---|
| `/experience` | `zanzibar-coast.png` | Already planned above |
| `/accommodation` | `festival-village.png` | Already planned above |
| `/festival` | `cycling.png` | Distinct from the page's own `hyrox-arena.png`/`festival-village.png` used further down |
| `/about` | *(none)* | Already immediately followed by its own full-width 2-column image+text section (`app/about/page.tsx:45-71`) — adding a second image in the hero would be redundant, not a fix |
| `/leadership` | `leader-1.png` | Distinct from the team grid's individual portraits below |
| `/partnership` | `finish-line.png` | Not otherwise used on this page; conveys the event's energy for a sponsor-facing page |
| `/gallery` | *(none)* | A photo grid immediately follows the hero (`app/gallery/page.tsx`) — a hero image would duplicate that content, not fix emptiness |
| `/faq` | *(none)* | No natural image exists for this content (an accordion of practical Q&A) without inventing a stock-photo-style placeholder that adds no information |
| `/contact` | *(none)* | Same reasoning as `/faq` — a contact form has no natural companion image |

Pages with *(none)* keep today's text-only single-column hero
unchanged — the component's backward-compatible `image?` prop means
this is a deliberate per-page choice, not a limitation.

## 3. `/experience` "About Zanzibar" section

Change from a single `max-w-3xl` text column to the same
`grid gap-12 md:grid-cols-2 md:items-center` text+image pattern already
used by this page's own Culture & Heritage section and by
`why-zanzibar.tsx` — text left, `festival-village.png` right (distinct
from the hero's `zanzibar-coast.png` and Culture & Heritage's
`zanzibar-coast.png`, so three different sections on one page don't
repeat the same image back-to-back).

## 4. Header logo size

`components/site-header.tsx:74`: `h-8 w-auto invert lg:h-9` →
`h-10 w-auto invert lg:h-12`. Moderate increase per user's chosen
option — noticeably larger without crowding the nav row at `h-16`
mobile / `h-20` desktop header height. `site-footer.tsx`'s logo
(currently `h-9`, standalone in a wide column, not nav-adjacent) is
left unchanged — the complaint was specifically about the header.

## 5. Cursor contrast fix

`components/custom-cursor.tsx:48-51`: the dot/ring currently has no
separation from the page background or from amber-colored UI it
passes over. Add a fixed-contrast outline so it reads against any
background, including amber elements:

```tsx
<div
  className={`flex items-center justify-center rounded-full border-2 border-amber bg-ink/40 shadow-[0_0_0_1.5px_rgba(237,231,216,0.9)] backdrop-blur-sm transition-all duration-200 ease-out ${
    active ? 'h-16 w-16 border-amber' : 'h-3 w-3 border-transparent bg-amber'
  }`}
>
```

The added `shadow-[0_0_0_1.5px_rgba(237,231,216,0.9)]` is a solid
bone-colored ring drawn via box-shadow (so it doesn't consume the
`border` utility already used for state) — gives every cursor state a
light-colored edge that stands out against dark, light, and amber
backgrounds alike. This is a pure additive visual fix; it does not
touch the `iconOnly`-guard logic already present in the file's current
uncommitted state.

## 6. Content density — `/experience`

Roughly double, per user's chosen option:

- **Things to Do**: 5 → 9 cards. Add: Mnemba Atoll (marine conservation
  area, snorkeling/diving with 15-30m visibility, ~2 hrs incl. boat
  transfer), Kizimkazi (wild dolphin tours + a 12th-century mosque with
  early East African Islamic Kufic script, ~40 min), Prison Island /
  Changuu (giant Aldabra tortoises brought from Seychelles in the
  1820s, ~50 min incl. boat from Stone Town), Michamvi Peninsula
  sandbank (~75 min).
- **Culture & Heritage facts**: 3 → 6 bullet points. Add: Taarab music
  tradition, the annual Sauti za Busara music festival in Stone Town,
  Swahili as the daily-use language alongside English.
- **Food & Cuisine**: 4 → 8 cards. Add: Mchuzi wa pweza (octopus
  curry), Biryani (Omani-influenced festive dish), Kashata (coconut-
  sesame sweet), Mandazi (fried dough, common breakfast item).
- **Travel Information**: 5 → 8 items. Add: currency (Tanzanian
  Shilling, USD widely accepted), local time zone (EAT, UTC+3),
  power/plug type (UK-style, 230V).

All additions are widely-documented, general-knowledge facts about
Zanzibar (not property-specific claims), consistent with the original
page's sourcing standard.

## 7. Content density — `/accommodation`

Roughly double per tier (2–3 → 4–5), per user's chosen option. All
additions are real, named, well-known Zanzibar properties/areas,
verified the same way as the original 8 (public travel/hotel-aggregator
sources), each tagged with an approximate travel time from Fumba Town:

- **Hotels** (2 → 4): add Melia Zanzibar (Kiwengwa, full-service resort
  hotel on a 40-acre estate, ~65 min), Turaco Nungwi Resort, a Tribute
  Portfolio Hotel (Nungwi, ~75 min).
- **Resorts** (3 → 5): add Baraza Resort & Spa (Bwejuu, east coast
  luxury with Swahili/Arabic/Indian-inspired villas, ~70 min), Matemwe
  Beach Village (Matemwe, on-site PADI dive centre, ~65 min).
- **Boutique Stays** (2 → 4): add Emerson on Hurumzi (Stone Town,
  historic rooftop boutique hotel with Zanzibar's highest rooftop tea
  house restaurant, ~45 min), Bamboo Zanzibar (Jambiani, sustainable
  boutique hotel built from local timber/bamboo/stone, ~55 min).
- **Budget Stays** (2 → 4): add Lost & Found Hostel (Stone Town,
  Zanzibar's first premium hostel, dorms/private rooms, ~45 min),
  Flamingo Guest House (Stone Town, budget guesthouse with breakfast
  included, ~45 min).

Same non-goal as the original design applies unchanged: illustrative,
not confirmed commercial partners; no partnership-claiming language.

## Testing / verification

Same approach as the prior round: no test framework in this project
(confirmed pre-existing) — verification is `tsc --noEmit` clean plus
manual browser check per page, in both light and dark theme this time
(the whole point of this round is fixing a light-mode-specific bug),
at a wide viewport (to confirm the emptiness complaint is resolved) and
a narrow one (to confirm nothing regresses on mobile).

## Open risk flagged, not blocking

Migrating `bg-ink`/`bg-ink-soft`/`text-bone` to the new
`surface-dark-*` tokens touches ~15 files across the site. This is
larger than a typical single task and will need its own multi-task
plan with per-file verification, not a single sweeping find-replace —
some of those files may have other literal (correctly-unconditional)
uses of the same classes mixed in with the section uses that should
migrate, and each needs a quick eyeball check, not a blind regex.
