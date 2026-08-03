---
name: ZanziFit Festival
description: Hybrid road-cycling and HYROX-style fitness festival on the coast of Zanzibar
colors:
  ink: "#000000"
  ink-soft: "#12161c"
  bone: "#ede7d8"
  amber: "#f2a944"
  deep-teal: "#0e4f4c"
  ember: "#c64a2c"
typography:
  display:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  hero-title:
    fontFamily: "Syne, Clash Display, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.02em"
  utility:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 500
    letterSpacing: "0.14em"
  body:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    letterSpacing: "0.006em"
  hero-body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
rounded:
  sm: "0.15rem"
  md: "0.2rem"
  lg: "0.25rem"
  xl: "0.4rem"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#17110a"
    rounded: "{rounded.sm}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
  button-outline-hover:
    textColor: "{colors.amber}"
---

# Design System: ZanziFit Festival

## Overview

**Creative North Star: "The Timing Board"**

The site reads like a competition timing board mounted against the night: a true black ground, an illuminated amber digit that draws the eye, and condensed uppercase labels tracked out like split times on a scoreboard. Every surface holds two registers at once — the raw, competition-grade precision of HYROX (sharp corners, mono-spaced labels, chevron motion) and a premium restraint borrowed from hospitality/tourism branding (generous negative space, an editorial display serif, deep teal reserved for ocean/CSR moments). Neither register wins; the tension between them is the brand.

Confirmed visual rejections: no cream + serif + terracotta ("generic AI luxury"); no gold/foil ornamentation. Luxury is earned through restraint, spacing, and photography/motion quality, never decoration.

**Key Characteristics:**
- Void-black ground with a single dominant accent (amber), used sparingly and always with intent.
- Condensed, uppercase, wide-tracked utility type for every label, nav item, and button — the "timing board" register.
- A high-contrast editorial display serif (Fraunces) for section headline moments, paired with an expanded geometric sans (Syne) at hero scale — the "luxury" register.
- The `>>>` chevron motif recurs everywhere as a literal directional/motion device (scroll cue, active-state marker, button trailing icon, mobile menu), never as static decoration.
- Flat surfaces, sharp near-square corners, glow-style amber shadows in place of ambient drop shadows.

## Colors

Void Black and Ember Amber carry the entire system; Deep Teal and true Ember red are reserved, deliberate departures used only when the brief calls for them.

### Primary
- **Ember Amber** (`#f2a944`): the one accent that gets to be loud. Primary CTA fill, active nav state, countdown emphasis, scroll-progress bar, chevron highlight. Read as a lit ember or an illuminated timing-board digit against black, not a generic "brand orange."

### Secondary
- **Deep Teal** (`#0e4f4c`): the ocean/luxury register. Reserved for tourism, partnership, and CSR-adjacent moments where the brief needs to shift away from "gym" toward "destination." Not used in primary UI chrome (nav, buttons, forms).
- **Ember Red** (`#c64a2c`): urgent/live moments only — countdown-closing states, "registration closing," live leaderboard alerts. **The One Emergency Rule.** Ember red appears only for genuinely time-sensitive or live states; using it decoratively cannibalizes the one signal it's supposed to carry.

### Neutral
- **Void Black** (`#000000`): primary background. True black, not a near-black — chosen deliberately over a softer ink so the site reads sharp and high-contrast under photography rather than muddy.
- **Ink Soft** (`#12161c`): elevated dark surface — cards, dropdown menus, banded sections that need to sit one step above the void without introducing a second hue.
- **Bone** (`#ede7d8`): reversed text/background — the warm off-white used as foreground text on dark surfaces and as the background of light-theme sections. Never pure white; keeps warmth consistent with Amber.
- **Border/Line** (`rgba(237,231,216,0.12)`): hairline dividers on dark surfaces, always low-opacity Bone rather than a separate gray.

### Named Rules
**The One Voice Rule.** Amber is the only color allowed to command attention in default UI chrome (nav active-state, primary CTA, countdown, progress bar). Deep Teal and Ember Red are register-shift colors, not backup accents — reaching for them outside their reserved contexts dilutes what each is supposed to signal.

## Typography

**Display Font:** Fraunces (section headlines) with Syne (expanded geometric sans, hero title only)
**Body Font:** Source Serif 4 (reading copy) paired with IBM Plex Sans (hero/short-form copy)
**Label/Mono Font:** IBM Plex Mono

**Character:** The pairing is the brand tension made literal — Fraunces and Syne are the editorial, high-contrast "luxury" voice reserved for headline moments (Fraunces for section headings, Syne's expanded geometric bulk reserved for the single hero moment); IBM Plex Mono is the condensed technical "timing board" voice for every label, stat, and piece of chrome. They never substitute for each other.

### Hierarchy
- **Hero Display** (700, `clamp(6rem, 8.08vw, 10rem)` desktop / `3.38rem` mobile, line-height 0.88, tracking -0.02em): Syne, home hero title only. The single moment allowed to be the biggest thing on the page — an expanded geometric sans rather than the editorial serif, reserved exclusively for this one placement.
- **Display** (600, `text-4xl`–`text-6xl` responsive, line-height 1.05, tracking -0.01em): Fraunces, section headings (`SectionHeading`, CTA band headline).
- **Body** (400, `text-lg`, leading-relaxed): Source Serif 4, all reading copy; letter-spacing opened slightly (+0.006em) to compensate for its tighter default rhythm versus a grotesque sans.
- **Hero Body** (400, responsive `clamp(1.25rem, 1.4vw, 1.75rem)` desktop / `text-lg` mobile, leading-tight): IBM Plex Sans, used only in the hero subhead where a sans reads cleaner over photography than the serif body face.
- **Label/Eyebrow** (500, `0.72rem`, tracking 0.22em, uppercase): IBM Plex Mono, the `.eyebrow` utility — dates, section kickers, countdown captions.
- **Utility/Nav** (500–700, `0.78rem`–`0.82rem`, tracking 0.14em, uppercase): IBM Plex Mono, nav links, buttons, badges, menu items.

### Named Rules
**The Two-Voice Rule.** Only the editorial display faces (Fraunces for section headings, Syne exclusively for the hero title) and IBM Plex Mono (technical/label) carry typographic weight in the interface. Source Serif 4 and IBM Plex Sans exist purely as reading-copy workhorses and should never be asked to carry hierarchy or brand voice.
**The One Hero Rule.** Syne is licensed to exactly one placement — the home hero title. Introducing it anywhere else (section headings, buttons, nav) would blur the "single biggest moment" signal it exists to create.

## Layout

Content is constrained to a `max-w-7xl` container with `px-4`–`px-8` responsive gutters; the hero breaks this with a dedicated 144px left safe-zone (`lg:pl-[144px]`) instead of the standard container, anchoring hero content from the top rather than centering it so the full stack (title → countdown → CTAs) survives short viewports without clipping.

Sections stack full-bleed and alternate background role (`bg-ink` / `bg-surface-dark-soft`) rather than using internal card boxes to separate content — the "banding" itself is the rhythm device. Hero content is scroll-linked: background photo, mid-ground content, and foreground UI move at different rates via Framer Motion scroll transforms (18%/60% drift), disabled entirely under `prefers-reduced-motion`.

Grids are simple (`sm:col-span-2` featured spans, 2–3 column card grids); no dense multi-column editorial grid is used elsewhere.

## Elevation & Depth

Flat by default — no ambient drop shadows on cards, nav, or buttons. Depth is instead conveyed two ways: (1) background-role banding (`bg-ink` vs `bg-surface-dark-soft`) to separate sections without shadow, and (2) glow-style colored shadows used exclusively as an amber accent effect (`shadow-[0_0_12px_rgba(242,169,68,0.65)]` on the header progress bar, `shadow-[0_8px_24px_-8px_rgba(242,169,68,0.7)]` on hover for the primary nav CTA). Dropdown menus are the one exception with a neutral `shadow-xl`, justified because they float above page content and need real separation.

### Named Rules
**The Glow-Not-Shadow Rule.** When a shadow is used for anything other than a floating menu, it should be an amber-tinted glow tied to the accent color, not a neutral ambient shadow — depth reads as "lit," not "lifted."

## Shapes

Corners are sharp and small: `rounded-sm` (`0.15rem`) is the default across buttons, badges, cards, and dropdowns — just enough softening to avoid a hard square, never approaching a pill or soft-card radius. Borders are hairline and low-opacity (`border-border` at ~12% Bone on dark surfaces), used to separate chrome (header, dropdown, mobile menu) rather than to box in content sections.

## Components

### Buttons
- **Shape:** `rounded-sm` (0.15rem), never pill-shaped.
- **Primary:** `bg-amber` fill, `text-primary-foreground` (`#17110a`, a near-black warm ink — not pure white — for contrast against amber), uppercase IBM Plex Mono label, generous horizontal padding (`px-7`–`px-8 py-4` at CTA scale). Always paired with a trailing `Chevrons` icon (count 3), which animates on primary hero/nav CTAs.
- **Hover/Focus:** primary CTAs lift (`hover:-translate-y-0.5`) and gain an amber glow shadow; never a background-darken-only hover.
- **Outline/Secondary:** transparent background, `border-surface-dark-foreground/30`, hover swaps both border and text to amber — no fill change.

### Chevrons (signature component)
The `>>>` motif from the source brand deck, rebuilt as a literal SVG component (`components/chevrons.tsx`) rather than a static glyph. Renders 1–3 stroke-only chevrons (`stroke-width 2.5`, square line-caps) in `currentColor`, with an optional `chevron-drift` keyframe animation (staggered per-chevron delay) used on primary CTAs, active nav states, and the scroll cue. Treat this as the brand's one reusable motion signature — reach for it before inventing a new icon-based affordance for "next/forward/live" states.

### Cards (Expandable / Tier cards)
- **Corner Style:** `rounded-lg` (slightly more generous than buttons, still sharp relative to typical soft-UI cards).
- **Background:** `bg-surface-dark-soft`, with a `border-border` hairline (or `border-amber/40` for a "featured" variant).
- **Shadow Strategy:** none at rest; only the image area animates (`group-hover:scale-105`) on hover.
- **Internal Padding:** `p-6`, `p-8` for featured/wide cards.
- **Signature detail:** an absolutely-positioned uppercase mono badge (`bg-amber` for "featured," `bg-ink/80` backdrop-blur for informational) pinned to the top corner of the image.

### Navigation
Fixed header, transparent-over-black gradient at rest, solid blurred background once scrolled (`scrolled` state at 24px). Nav links are uppercase IBM Plex Mono at 0.82rem with 0.14em tracking; the active link is amber and grows a single trailing chevron. A 3px chevron-colored scroll-progress bar sits at the header's bottom edge at all times — this is the "timing board" idea expressed as literal chrome, not just a metaphor. Dropdown submenus (Festival, More) are `bg-background/95 backdrop-blur-md` panels with a neutral `shadow-xl`, the one place a non-amber shadow is correct.

## Do's and Don'ts

### Do:
- **Do** treat Amber as the single loud color in default UI; everything else recedes.
- **Do** reach for the `Chevrons` component for any "next/forward/active/live" affordance instead of a generic arrow icon.
- **Do** use Deep Teal only when a section is deliberately shifting register toward tourism/CSR/partnership — never as a default UI color.
- **Do** keep corners sharp (`rounded-sm`/`rounded-lg`); never introduce pill buttons or heavily rounded (>0.4rem-equivalent) cards.
- **Do** pair any amber-glow shadow with a hover lift, not a shadow alone.

### Don't:
- **Don't** use Ember Red for anything that isn't genuinely urgent or live (countdown-closing, live results) — it is not a secondary accent.
- **Don't** add ambient neutral drop shadows to buttons or content cards; depth comes from banding and amber glow, not lifted shadows (dropdown menus are the sole exception).
- **Don't** let Source Serif 4 or IBM Plex Sans carry headline hierarchy — that's Fraunces (section) and Syne (hero title) territory only.
- **Don't** use Syne anywhere but the home hero title — it's a one-placement typeface by design.
- **Don't** reach for cream backgrounds, terracotta accents, or gold/foil treatments — these are explicitly rejected anti-references for this brand.
- **Don't** center-anchor tall hero content; anchor from the top so the full stack survives short viewports.
