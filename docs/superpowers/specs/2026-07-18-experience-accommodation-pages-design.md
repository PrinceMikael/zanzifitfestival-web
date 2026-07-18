# Experience Zanzibar & Accommodation pages — design

Date: 2026-07-18

## Purpose

Add two new content pages, `/experience` and `/accommodation`, per the
site's planned sitemap. ZanziFit doesn't sell rooms or tours itself —
these pages position the festival as a local connector: they surface
real, well-known Zanzibar interest points and lodging options, and
every "enquire" action routes the visitor to the festival team via
WhatsApp so staff can broker the actual booking. Race/Event Experience
(the sitemap's fifth branch) is out of scope — it's already served by
the existing `/festival` and `/register` pages.

## Non-goals

- No live availability, pricing, or payment integration. This is a
  curated-directory-plus-concierge pattern, not a booking engine.
- No new sub-routes. Both pages are single scrollable pages, consistent
  with how `/festival` is built.
- No real third-party photography. The project's existing images
  (`cycling.png`, `zanzibar-coast.png`, etc.) are stylized/generated
  placeholders, not licensed photos of specific properties. New images
  follow the same convention — placeholder art, not a claim that this
  is a photo of the named property. This can be swapped later once the
  client supplies or licenses real photos.
- Named accommodations/attractions are illustrative, not confirmed
  commercial partners. Copy will not claim a partnership; it will read
  as "places we can help you book," sourced from public general
  knowledge of Zanzibar (Tripadvisor/hotel-aggregator listings,
  general travel content), not a live inventory feed.

## Site navigation change

Add two entries to the shared `NAV` array in
[components/site-header.tsx](components/site-header.tsx), between
"The Festival" and "Partnership":

```
{ href: '/experience', label: 'Experience Zanzibar' },
{ href: '/accommodation', label: 'Accommodation' },
```

This array drives both the desktop and mobile nav, so no other file
needs to change for nav wiring.

## Shared components (new)

### `components/enquiry-link.tsx`

A single link component used on every card in both new pages. Props:
`label` (the place/activity name), `context` ("accommodation" |
"experience"), optional `className`. Builds a `wa.me/255686915587`
link with a prefilled, URL-encoded message, e.g.
`Hi ZanziFit team, I'd like to know more about booking: Fumba Beach
Lodge.` Renders with the same visual treatment (icon + label) already
used for the WhatsApp link on `/contact`
([app/contact/page.tsx](app/contact/page.tsx)), so the two pages don't
invent a new visual language for "contact us." Opens in a new tab
(`target="_blank" rel="noopener noreferrer"`), matches existing
`data-cursor-label="Chat"` pattern.

### `components/expandable-card.tsx`

Client component (`'use client'`) for the tiered accommodation cards
and the "Things to Do" / "Culture & Heritage" cards. Props: `image`,
`alt`, `title`, `badge` (e.g. distance-from-venue or category tag),
`summary` (1–2 lines, always visible), `details` (string array,
revealed on expand), `enquiryLabel` (passed through to
`EnquiryLink`). Local `useState` toggle, chevron rotate affordance
matching `AccordionItem`'s open/close visual language, but built as
its own component since `AccordionItem` is text-only (question/answer)
and these need an image + badge + always-visible summary layer that
accordion doesn't have. Collapsed state shows summary + "View more"
affordance + the enquiry link is available in both states (visitors
shouldn't have to expand a card to find how to contact us).

## `/experience` page — `app/experience/page.tsx`

Structure mirrors `app/festival/page.tsx`: `PageHero` at top, then
stacked `<section>` blocks each opened with `SectionHeading`.

1. **Hero** — eyebrow "Experience Zanzibar", title along the lines of
   "Race here. Stay a while.", short intro locating the festival in
   Fumba Town on Zanzibar's west coast.
2. **About Zanzibar** — short prose block (no cards): archipelago off
   mainland Tanzania, Swahili/Arab/Persian/Indian/European cultural
   layering, Fumba Town as the race base on the Menai Bay coastline.
3. **Things to Do** — `ExpandableCard` grid, 5 entries: Stone Town
   (UNESCO old town, House of Wonders, spice tours), Forodhani Gardens
   night food market, Menai Bay dolphin tours & snorkeling (closest to
   Fumba), Nungwi/Kendwa beaches, Jozani-Chwaka Bay National Park (red
   colobus monkeys).
4. **Culture & Heritage** — prose + a short fact list: Swahili Coast
   and Omani Sultanate history, Stone Town's carved-door architecture,
   a respectful-dress note (Zanzibar's population is predominantly
   Muslim) framed as helpful visitor guidance, not a warning.
5. **Food & Cuisine** — `ExpandableCard` or simple list covering
   Zanzibar "pizza" (savory stuffed crepe), urojo soup, Forodhani
   Gardens seafood grills, spice tours/spice coffee.
6. **Travel Information** — a small info-grid (reuse the `INCLUDED`
   list visual pattern from `/festival`): best season (Jun–Oct &
   Jan–Feb dry vs Mar–May/Nov rains), arriving via Abeid Amani Karume
   International Airport (Zanzibar Town), a visa-on-arrival note,
   travel time from the airport/Stone Town to Fumba Town.
7. Closing CTA: a simple inline block (not `cta-band.tsx`, which has
   hardcoded register-specific copy and no prop for overriding it) —
   a short line plus an `EnquiryLink` ("Ask us about planning your
   stay").

## `/accommodation` page — `app/accommodation/page.tsx`

1. **Hero** — eyebrow "Accommodation", title along the lines of "We're
   not a hotel — we're your local connection.", intro explaining the
   agent model in one or two sentences.
2. Four tiered sections, each `SectionHeading` + `ExpandableCard` grid
   of 2–3 cards, badge shows approximate travel time from Fumba Town:
   - **Hotels** — DoubleTree by Hilton Nungwi (~75 min), Green Turaco,
     Fumba (~5 min).
   - **Resorts** — Fumba Beach Lodge (~5 min, closest to the festival
     village), Essque Zalu Zanzibar, Nungwi (~75 min), Zuri Zanzibar,
     Kendwa (~80 min).
   - **Boutique Stays** — Sharazād Wonders Boutique Hotel, Stone Town
     (~45 min), Mwezi Boutique Resort, Paje (~55 min).
   - **Budget Stays** — Jambo Guesthouse or Zlife Hostel, Stone Town
     (~45 min), Drifters Backpackers, Paje (~55 min).
   Each card's `details` (revealed on expand) covers what the tier/
   property is known for and a best-season note; each card carries an
   `EnquiryLink` pre-filled with that property's name.
3. **Booking Info** — closing section, no cards. Three-step explainer
   (Tell us your dates & budget → We check availability and connect
   you with the property → You confirm directly or through us), then
   the same contact channels block already used on `/contact` (email,
   phone, WhatsApp) so this page doesn't strand a visitor who wants a
   channel other than WhatsApp.

## Data shape

Both pages keep their content as local `const` arrays at the top of
the page file (same convention as `DISCIPLINES`/`SCHEDULE` in
`app/festival/page.tsx`) — no CMS, no new data layer. This keeps the
two pages consistent with the rest of the site and avoids introducing
a content-management abstraction the project doesn't otherwise have.

## Metadata

Both pages export a `Metadata` object (title + description) following
the exact pattern in every existing `app/*/page.tsx`.

## Testing / verification

No test suite exists in this project beyond `eslint`. Verification is:
`pnpm lint` (via `npx pnpm lint`, since `pnpm` isn't on PATH in this
environment — `corepack enable` fails here with EPERM on
`C:\Program Files\nodejs`), a production-parity check via the running
dev server (already up at `http://localhost:3000` from earlier in this
session), and a manual click-through per the `verify`/`run` skill
conventions: load both new pages, confirm nav links work, expand a
card, and confirm the WhatsApp link opens with the expected prefilled
text.

## Open questions for the client (flagged in copy, not blocking)

None blocking implementation — the "illustrative, not confirmed
partner" framing above resolves the main risk (implying a commercial
relationship that doesn't exist). The client can swap specific
property names or add real partnerships later without a structural
change to either page.
