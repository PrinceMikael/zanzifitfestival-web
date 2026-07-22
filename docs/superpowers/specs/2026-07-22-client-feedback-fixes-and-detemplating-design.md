# Client feedback pass: 12 fixes + de-templating polish

**Date**: 2026-07-22
**Status**: Approved for planning

## Context

The client reviewed the live site and sent back 12 numbered issues, plus general
feedback that the site "looks so much AI-generated." This spec covers both: the
concrete fixes, and a targeted design pass to reduce the templated feel — without
a structural rebuild (existing brand tokens, fonts, IA and routes stay as-is).

## Part A — The 12 fixes

### 1. Header invisible in light mode

**Root cause**: `SiteHeader` (`components/site-header.tsx`) is `bg-transparent`
with light (`text-bone`) nav text and a white-inverted logo until the user
scrolls past 24px, at which point it gets `bg-ink/85`. This is safe on the
homepage because `Hero` always renders on `bg-surface-dark` (hardcoded dark
regardless of theme). But every interior page opens with `PageHero`
(`components/page-hero.tsx`), which uses `bg-surface-dark-soft` — a token that
**remaps to cream in light mode** (`app/globals.css`, `:root[data-theme='light']`).
Result: on any interior page load in light mode, light header text and a
white logo sit on a light cream background and are effectively invisible
until the user scrolls.

**Fix**: Make the header's unscrolled visual state theme-aware instead of
assuming a dark surface underneath:
- Nav link color, the mobile-menu button border/icon, and the logo tinting
  must resolve correctly against both dark and light unscrolled surfaces.
- Simplest correct approach: stop hardcoding `text-bone` / `invert` and use
  the existing semantic tokens (`text-foreground`, theme-aware logo treatment)
  so the header self-adjusts with `data-theme`, the same way page content
  already does.
- Verify on: home (dark hero, both themes) and at least one interior page
  (light + dark) at scroll position 0 and after scrolling.

### 2. Registration needs phone number with country code

**Root cause**: `components/register-form.tsx` has no phone field. `lib/validation.ts`
already exports `isValidPhone`/`validateField('phone', ...)` but it's unused —
built and never wired up.

**Fix**: Add a phone field to `RegisterForm`:
- Input defaults/placeholders with `+255` (Tanzania) since that's the
  primary audience, but is a free-text field so athletes from other of the
  15 countries can overwrite the prefix — no country-code dropdown (per
  your call, keeps it simple).
- Wired to the existing `validateField('phone', value, { label: 'Phone number' })`,
  same touched/blur/error pattern as name/email.
- Required field, same as name/email.

### 3. Leadership photos need a do-over

**Root cause confirmed**: the six images in `public/images/leadership/` are
from six unrelated sources — a gym candid, a low-res black-and-white webcam
still, an event-stage grab with sponsor-banner text visible behind the
subject, a phone-camera beach selfie, a studio headshot, and a formal
portrait. This is exactly what the original blueprint flagged as a launch
risk ("mismatched photo qualities/crops... undercuts the luxury positioning
immediately"). No amount of styling fixes six different photoshoots.

**Fix (two parts)**:
- **Now**: apply one uniform photographic treatment across all six (crop
  ratio, consistent color grade/duotone) to minimize the visual clash as
  much as CSS/image processing can. The existing grayscale-hover treatment
  stays as part of this.
- **Flagged, not fixed by this pass**: real replacement photography is
  needed for a proper fix. This is a content gap, not a code bug — I cannot
  generate authentic photos of these six real people. Call this out
  explicitly when this work is delivered.

### 4. "Walter Mwach" → "Walter Mwacha"

Confirmed typo in `app/leadership/page.tsx` (`TEAM` array: `name` and bio
text). Fix the name string. Image filename (`walter-mwach.jpg`) can stay as
the file's internal name — not user-visible — to avoid an unnecessary rename;
only the displayed text changes.

### 5. Governance section is redundant

**Fix**: Remove the closing `<section>` on `app/leadership/page.tsx` (the
"One board, full accountability" block, currently lines 84–97). The page
ends with the core-team grid after this change.

### 6. Redefine "core team" + remove the top picture

**Fix**:
- On `app/leadership/page.tsx`, drop the `image` prop passed to `PageHero`
  (currently `/images/leader-1.png`) so the intro paragraph runs full-width
  instead of sitting beside a posed photo.
- Rewrite the "Meet the core team" framing so it actually defines what
  "core team" means for this organization (who they are collectively /
  what the group is responsible for), rather than just labeling the grid.
  Exact copy to be drafted during implementation, consistent with the site's
  existing voice.

### 7. ZFit logo looks zoomed on maximized screens

**Root cause confirmed**: `public/zfit-logo.png` is 842×296 with substantial
built-in white padding around the mark itself. At fixed heights (`h-10`,
`h-12` in the header; `h-9` in the footer) with `w-auto`, the padding ratio
means the visible mark occupies a shrinking portion of its box as the
rendered size changes — reads as "zoomed"/oddly cropped rather than a clean
tight mark.

**Fix**: Use a tighter-cropped source for the logo mark (there's already a
`ZFit-Logo.jpg-removebg-preview.png` in the repo root — check whether its
crop is tighter than `public/zfit-logo.png`; if so, promote it into `public/`
as the new logo asset) so the mark fills its bounding box consistently at
all rendered sizes, in both header and footer.

### 8. Footer social links should be icons, not words

**Root cause**: `components/site-footer.tsx` renders `IG`/`FB`/`YT`/`WA` as
text abbreviations inside bordered squares.

**Fix**: Replace the `short` text labels with `lucide-react` icons
(`Instagram`, `Facebook`, `Youtube`, `MessageCircle` for WhatsApp — matching
the icon already used for WhatsApp elsewhere, e.g. `enquiry-link.tsx`).
Keep `aria-label` on each link for accessibility since the visible text goes
away.

### 9. Event is in Zanzibar, not Fumba Town

**Scope confirmed**: "Fumba"/"Fumba Town" appears ~90 times across the app
(hero, footer, contact, about, festival, faq, experience, accommodation,
gallery, disciplines, partnership, layout metadata). Per your direction,
**every instance is replaced, no exceptions** — including places where
"Fumba" currently functions as a sub-area/travel-time reference:

- **Venue/location statements** (hero, footer tagline, contact address,
  meta descriptions, "we're based in...", "races out of..."): become
  "Zanzibar" / "Zanzibar, Tanzania".
- **Travel-time badges** on Accommodation/Experience (e.g. `"~5 min from Fumba"`,
  `"~75 min from Fumba"`): reworded to measure from the festival venue/village
  in Zanzibar-neutral terms, e.g. `"~5 min from the festival venue"`. Numbers
  stay the same — only the place-name changes.
- **"Fumba peninsula"** as a course-routing descriptor (About, Festival,
  Disciplines pages): reworded to a Zanzibar-general phrase (e.g. "the
  coast of Zanzibar" / "the west coast") since "Fumba peninsula" is itself
  a Fumba reference.
- **"Fumba Beach Lodge"** (an actual hotel's real proper name in the
  Accommodation listing): this is a real property name, not a description
  of the event venue — kept as-is; renaming a real hotel would misrepresent
  it. Only its `area: 'Fumba'` field and any prose describing it as "in
  Fumba" are reworded to avoid the place name (e.g. area label changes to
  something Zanzibar-general, or is dropped from that one card's label).
- **`green-turaco`'s "right in Fumba — the shortest possible commute"**:
  reworded to describe proximity to the festival venue without naming Fumba.

This is a copy-editing pass across ~9 files; no structural/layout changes
required beyond the wording.

### 10. Tab icon doesn't reflect the ZFit logo

**Root cause confirmed**: `public/` already has `icon-dark-32x32.png`,
`icon-light-32x32.png`, `apple-icon.png`, and `icon.svg`, but none of them
are wired into Next.js's metadata. `app/layout.tsx` has no `icons` field and
there's no `app/icon.*` convention file, so the browser falls back to a
default/generic icon.

**Fix**: Wire the existing assets via the `metadata.icons` field in
`app/layout.tsx` (favicon + apple-touch-icon), pointing at the existing
`public/icon-*` files. If a light/dark favicon split is wanted, use the
`media` query variant of the icons array; otherwise pick one as the default
favicon. No new image assets need to be generated — they already exist and
just aren't connected.

### 11. No email notification when a form is sent

**Root cause confirmed**: there is no `app/api` directory in this project at
all. `ContactForm`, `RegisterForm`, `PartnershipInquiry`, and `NewsletterForm`
are entirely client-side — submitting only flips a local `sent` boolean to
show a "thank you" state. Nothing is transmitted anywhere.

**Fix (per your direction — no backend)**: mirror the pattern already used
for WhatsApp enquiries (`components/enquiry-link.tsx`, which builds a
`wa.me` link with a pre-filled message). On submit, in addition to showing
the existing "sent" confirmation UI, open a `mailto:info@zanzifit.com`
link with `subject` and `body` populated from the form's field values
(URL-encoded), the same way the WhatsApp link pre-fills its message text.
This applies to `ContactForm` and `RegisterForm` (the two forms item 11
is about); `PartnershipInquiry` and `NewsletterForm` are not explicitly
named in the feedback, but a same-pattern `mailto:` can be added to
`PartnershipInquiry` too for consistency since it has the same
"nothing is sent" gap — final call during implementation review.

### 12. Correct email address everywhere

**Root cause confirmed**: two wrong variants exist — `hello@zanzifit.com`
(`components/site-footer.tsx`) and `info@zanzifitfestival.com`
(`app/contact/page.tsx`, `app/accommodation/page.tsx`, and referenced in
older spec/plan docs under `docs/superpowers/`). Correct address is
`info@zanzifit.com`.

**Fix**: Replace every occurrence of both wrong variants with
`info@zanzifit.com` across all app/component files (footer, contact page,
accommodation page, and the new `mailto:` links from item 11). Make the
displayed email a working `mailto:info@zanzifit.com` link wherever it
appears as contact info (currently some are plain text). Historical
`docs/superpowers/*.md` files are left alone — they're a record of past
decisions, not live content.

## Part B — De-templating design pass

**Goal**: address "looks AI-generated" within the existing design system
(same tokens, same Fraunces/Space Grotesk/Inter pairing, same routes/IA) by
removing the repetition that reads as templated, per your approved scope
("refine within current system").

**Diagnosed causes** (confirmed by reading the actual components):

1. **One universal card shape used everywhere, for everything.** The pattern
   `rounded-lg border border-border` + image-with-gradient-scrim (or icon) +
   heading + paragraph + link/CTA repeats verbatim across `About` (values
   cards, timeline cards), `Leadership` (team cards), `ExpandableCard`
   (experience/accommodation), `Accommodation` (booking-step cards). Same
   container, same radius, same border, same internal spacing, regardless
   of content type. This is the single strongest "templated" signal.
2. **`SectionHeading` is the only section-intro shape that exists**, and
   it's used unmodified on literally every page: chevron-triple + eyebrow +
   display heading + intro paragraph, either left or center. No section
   ever establishes its own visual identity.
3. **Spacing rhythm never varies**: nearly every section is
   `py-20 md:py-28` inside `max-w-6xl` (or `max-w-3xl` for text-heavy
   ones). Nothing is allowed to feel bigger, tighter, or asymmetric on
   purpose.
4. **Decoration substitutes for hierarchy**: the `>>>` chevron motif and
   radial-gradient blur washes (`page-hero.tsx`'s `opacity-[0.06]` radial
   gradients) appear by default on most section openers, whether or not
   they're doing real work — reads as a stock "premium template" flourish.

**Fix approach (targeted, not a rebuild)**:

- **Vary card treatment by content type instead of one universal card
  component.** Leadership portraits move to a photo-forward, borderless,
  editorial treatment (bigger image, name/role set directly against the
  page background, no boxed card) — distinct from the bordered
  `ExpandableCard` used for accommodation/experience listings, which stays
  boxed because that content is genuinely list-like (many comparable
  items) and benefits from a contained shape. The About "values" cards and
  "booking steps" cards get a lighter-weight treatment (numbered/labeled
  text blocks, not full bordered boxes) so not everything on the page
  reads as the same kind of object.
- **Introduce section-level layout variation** on at least About, Festival,
  and Leadership: break at least one section per page out of the
  center-header-then-grid formula (e.g. an asymmetric two-column split
  with unequal column widths, a section that intentionally runs
  edge-to-edge, or a text-first section with no heading-eyebrow-chevron
  preamble at all).
- **Deliberately vary vertical rhythm**: not every section is
  `py-20 md:py-28`. Sections with less content get tighter spacing;
  a section meant to carry more visual weight gets more. This is a small,
  surgical change per section, not a new spacing system.
- **Reduce decorative defaults**: keep the chevron motif and gradient
  scrims only where they do real work (scroll-progress indicator,
  text-legibility scrim over a photo) and remove them from places they're
  purely decorative repetition (e.g. don't open every single section with
  chevron + eyebrow if the section doesn't need one).

**Explicitly out of scope for this pass** (per your "refine within system"
choice): no new color tokens, no new typefaces, no new page structure/IA,
no rebuild of the parallax hero system, no changes to routing.

## Files touched (expected)

- `components/site-header.tsx` — theme-aware unscrolled state (#1)
- `components/register-form.tsx` — phone field (#2)
- `app/leadership/page.tsx` — name fix, remove governance section, remove
  top image, redefine core team, photo-forward card treatment (#3–#6, Part B)
- `public/` — logo asset swap (#7)
- `components/site-footer.tsx` — icon socials, email fix (#8, #12)
- ~9 files with "Fumba" references — copy pass (#9)
- `app/layout.tsx` — favicon wiring (#10)
- `components/contact-form.tsx`, `components/register-form.tsx`,
  possibly `components/partnership-inquiry.tsx` — mailto fallback (#11)
- `app/contact/page.tsx`, `app/accommodation/page.tsx` — email fix (#12)
- `components/about` values/timeline sections, `components/expandable-card.tsx`
  usage, `app/festival/page.tsx`, booking-step cards — de-templating pass (Part B)

## Testing

- Manual verification in browser (dev server) for every fix, particularly:
  - Header legibility in light mode on an interior page, at scroll 0 and
    scrolled, compared against dark mode.
  - Register form phone field validation (empty, too short, valid).
  - Favicon showing correctly in a browser tab.
  - Mailto links open the system mail client pre-filled, for Contact and
    Register forms.
  - Footer social icons render and are keyboard/screen-reader accessible
    (`aria-label` present).
- No automated test suite exists in this repo currently (confirmed — no
  test files found); verification is manual/visual, consistent with how
  prior work in this repo (`docs/superpowers/plans/*`) was verified.
