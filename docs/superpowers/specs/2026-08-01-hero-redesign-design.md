# Hero Section Redesign — Design Spec

Date: 2026-08-01
Scope: `components/hero.tsx` only. No other component, page, or global token changes.

## Background

The user redesigned the hero section in Photoshop and provided a reference image plus a
precise typography/layout spec. The header, buttons, countdown component, and the
scroll-parallax motion system are all explicitly staying as they are — this is a layout,
imagery, and hero-typography change only.

## Reference

Reference mockup: title "ZanziFit Festival" (white / amber second line), body copy,
4 placeholder boxes (representing countdown + buttons, not new UI), "Join the Waitlist"
/ "Become a Partner" buttons, athlete-with-battle-ropes photo on the right ~45% of frame,
header unchanged from current site.

Confirmed source image: `Photos/Hero Section Image.jpg` (portrait crop, 4160x6240) —
matches the reference photo exactly.

## Layout

**Canvas & margins (hero-scoped, not site-wide):**
- Design canvas reference: 1440×900
- Content-safe zone: 144px left margin, content runs to 1296px (1152px safe width), 144px
  right margin
- Top structure: 70px navbar band + content starting within the remaining area
- These margins are defined as a hero-local constant/class, not applied to other pages'
  containers (those keep their current `max-w-7xl` behavior). Below ~1440px viewport,
  margins scale down responsively rather than staying fixed (fixed 144px would crush
  content on smaller screens).

**Split composition (replaces current full-bleed background):**
- Left column, inside the safe zone: eyebrow → title → body → countdown → buttons, all
  left-aligned (not centered).
- Right side: `Hero Section Image.jpg` as a right-side image panel (object-cover within
  its own container, not a full-bleed section background), bleeding to the viewport's
  right edge past the 1296px margin — matches the reference composition. Chosen over
  full-bleed because the source photo is a tall portrait crop; a panel treatment handles
  that aspect ratio correctly without awkward cropping of the athlete.
- Existing scroll-parallax depth layers (background slower, foreground faster) are
  retained, adapted to the new two-column DOM structure instead of the current
  full-bleed-background structure.

## Typography

- **Title**: Clash Display Semibold, 135pt (already the only weight loaded via
  `localFont` in `app/layout.tsx` — no new font file needed). Title block starts 200px
  from the top of the content area. "ZanziFit" / "Festival" line spacing: 25px (partially
  implemented today via `lg:mt-[25px]`; will be set precisely against the 135pt size).
- **Body**: IBM Plex Sans Regular, 24pt (already loaded at weight 400 — no new font file
  needed). Spacing from body text block to the countdown: 40px.
- **Unchanged**: eyebrow line, countdown numerals/labels, nav, and button text all keep
  their current IBM Plex Mono (`font-utility`) treatment — confirmed explicitly, not part
  of this redesign.

## Explicitly unchanged

- `components/site-header.tsx` — no changes.
- Button component/styles (amber filled "Join the Waitlist", outline "Become a Partner")
  — no changes, only repositioned within the new layout.
- `components/countdown.tsx` — no changes, only repositioned/restyled to fit the new
  column width.
- Scroll-parallax motion system (`useScroll`/`useTransform` depth layers, reduced-motion
  handling) — retained, restructured for the new split layout.
- Color tokens, other pages, other components — untouched.

## Assets

- `Photos/Hero Section Image.jpg` → copied into `public/images/` (e.g.
  `hero-battle-ropes.jpg`) and wired in as the new hero image, replacing
  `zanzibar-hero.jpg` in the hero component. `zanzibar-hero.jpg` itself is not deleted
  from `public/images/` (may be used elsewhere) unless confirmed unused.

## Out of scope

- Any page other than the home hero.
- Header, footer, countdown internals, button internals.
- Site-wide margin/container system (only the hero adopts the 144/1296/1440 spec for
  now).
