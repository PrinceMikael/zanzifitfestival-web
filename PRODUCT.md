# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Athletes / fitness enthusiasts**: professional and amateur competitors deciding whether to travel to Zanzibar for road cycling or HYROX-style functional fitness competition. Need category, schedule, travel, and pricing detail to commit.
- **Gyms / fitness communities**: group organizers considering bringing a team or cohort.
- **Corporates**: evaluating the corporate wellness/team category and, separately, sponsorship.
- **Tourism & hospitality partners, sponsors (Gold/Silver + category partners: Airline, Water, Media, Tourism/Hospitality)**: evaluating brand visibility and partnership tiers.
- **Spectators**: general public deciding whether to attend or follow the event.

## Product Purpose

Marketing/interest-capture site for ZanziFit Festival, a hybrid endurance sports festival (road cycling + HYROX-style functional fitness + corporate wellness activations) held 6 November 2026 in Fumba Town, Zanzibar, Tanzania. The site's job pre-launch is to build awareness, capture registration interest, and win sponsors/partners ahead of official registration opening. Success = qualified interest submissions (register/partnership/contact/newsletter) and sponsor conversations.

## Positioning

Holds two identities at once that most fitness-event sites pick only one of: a gritty, high-intensity sport event (HYROX, ropes, sleds, sweat, competition-grade timing/data) **and** a premium tourism destination play (Zanzibar, ocean, dhows, CSR, sponsor visibility). The differentiation is genuinely holding both registers simultaneously, not defaulting to either "gym website" or "generic luxury travel site."

## Operating Context

- Scale: 1,500+ participants targeted, athletes from 15 countries, 2,000+ spectators, 500,000+ media reach (projected).
- Categories: road cycling, HYROX-style functional fitness (elite/open/corporate), corporate team.
- Commercial layer: tiered sponsorship (Gold/Silver) plus category partners (Airline, Water, Media, Tourism & Hospitality).
- Audience is international (15 countries) — travel, visas, and accommodation info matter (see FAQ/accommodation pages).
- Contact channels relevant to the East African / Tanzanian market: email + WhatsApp expected alongside standard contact form.

## Capabilities and Constraints

- **Pre-launch marketing site only.** No payment processing or live registration backend exists. `app/register`, `app/contact`, `app/partnership` submit via a shared API route ([app/api/submit-form/route.ts](app/api/submit-form/route.ts)) that emails submissions through Resend to `info@zanzifitfestival.com` — this is lead/interest capture, not checkout.
- Register page copy is explicit that "official registration hasn't opened yet"; the form collects name/email/phone/category to notify people when entries open.
- No live leaderboard, schedule/program, or results system built yet; these are planned future phases, not current site scope.
- **Known open content gaps (do not fabricate):**
  - Founding story / "why this started" narrative — not yet written.
  - Event schedule / program — does not exist yet.
  - Refund / cancellation policy — not yet defined.
  - Cycling route map — not yet available.
  - Leadership team photography — historically inconsistent quality across source material; treat as a real constraint when working on the leadership page.

## Brand Commitments

- Name: ZanziFit Festival.
- Brand idea: "Horizon meets the start line" — Zanzibar coastline horizon (ocean, dhow sails, palm silhouettes) colliding with HYROX arena geometry (sled lanes, rope stations, timing boards).
- Explicitly rejected treatments: cream + serif + terracotta ("generic AI luxury"), heavy skeuomorphic gold/foil ornamentation. Luxury signal must come from restraint, spacing, and photography/motion quality, not decoration.
- Domain: zanzifitfestival.com (verified sender/recipient domain for transactional email).

## Evidence on Hand

- Full design/technical blueprint at [ZanziFit_Festival_Website_Blueprint.md](ZanziFit_Festival_Website_Blueprint.md) — origin of the brand idea, token system, sitemap, and phased build plan. Treat as founding design rationale, not just historical notes.
- Photography assets in `Photos/`, `Zanz Pictures/` (untracked as of this writing) for disciplines/hero sections.
- No testimonials, past-edition results, or press coverage exist yet (event is pre-first-edition); do not fabricate any.

## Product Principles

1. Never collapse the dual identity into a single lane — every surface should read as both credibly athletic and credibly premium/tourism, not one at the expense of the other.
2. Don't present registration, schedule, or refund content as settled when it is explicitly still open; the site should be honest about pre-launch status ("hasn't opened yet") rather than implying a live system.
3. Luxury is expressed through restraint, spacing, and photography/motion quality — not gold/foil ornamentation or generic luxury-template defaults.
4. International athlete/sponsor audience (15 countries) — content and forms should not assume a single-market audience.

## Accessibility & Inclusion

No product-specific accessibility requirement established beyond standard web accessibility practice.
