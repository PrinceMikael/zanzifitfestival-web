# ZanziFit Festival — Website Blueprint
### Design Direction, Content Architecture & Technical Build Plan

---

## Part 1 — What this event actually is (read from the profile)

Before designing anything, here's what the profile tells us, distilled:

- **Category**: hybrid endurance sports festival — road cycling + HYROX-style functional fitness, plus corporate wellness activations.
- **Location/date**: Zanzibar, Tanzania — 6 November 2026, Fumba Town.
- **Scale**: 1,500+ participants, athletes from 15 countries, 2,000+ spectators, 500,000+ media reach.
- **Audience segments**: professional athletes/fitness enthusiasts, gyms/fitness communities, corporates, tourism & hospitality partners.
- **Commercial layer**: tiered sponsorship (Gold/Silver + category partners — Airline, Water, Media, Tourism/Hospitality).
- **Positioning tension you need to design for**: this is simultaneously a *gritty, high-intensity sport event* (HYROX, ropes, sleds, sweat) and a *premium tourism destination play* (Zanzibar, dhows, ocean, CSR, sponsor visibility). Most fitness-event sites pick one lane. Your differentiation is holding both — that's where "modern + luxury" actually comes from, not from adding gold foil to a gym website.

---

## Part 2 — Design Direction

### The idea
**"Horizon meets the start line."** The signature visual motif is the Zanzibar coastline horizon — ocean, dhow sails, palm silhouettes — colliding with the hard geometry of a HYROX arena (sled lanes, rope stations, timing boards). Luxury comes from restraint, spacing, and material quality (photography, motion). Intensity comes from the competition-grade grid, condensed type, and motion timing. Not from decoration.

This also directly answers your "layering" note: the site is built as literal depth layers (background horizon → mid-ground athletes/course → foreground UI/typography) that move at different speeds as someone scrolls — a parallax system, not just a scroll-fade.

### Token system

**Color** (named, not just hex — use these names in your Figma/CSS variables so the team stays consistent):
| Name | Hex | Role |
|---|---|---|
| Ink | `#0B0E12` | Primary background — near-black with a blue undertone, not flat black (flat black reads cheap on camera-heavy sections) |
| Bone | `#EDE7D8` | Light section background / reversed text |
| Amber | `#DFA23B` | Primary accent — refined from the deck's stock orange, slightly deeper/warmer so it reads premium under photography, not like a sports-app default |
| Deep Teal | `#0E4F4C` | Ocean/luxury layer — used in the tourism, partnership, and CSR sections to shift register away from "gym" |
| Ember | `#C64A2C` | Secondary accent, used sparingly for live/urgent moments only (countdown, "registration closing," live leaderboard) — this is what keeps Amber from being overused |

Reasoning: HYROX brands lean hard on orange-on-black (see the source photography itself). If the whole site is orange-on-black, it reads like a template of the sport, not like this event's identity. Deep Teal is the move that pulls Zanzibar's ocean/tourism identity into the palette and is what makes this feel "luxury" rather than "gym."

**Type**:
- **Display**: a high-contrast condensed serif or slab with editorial weight — something like *Fraunces* (or *Canela*, *Editorial New*) set in a heavy weight, used only for section headers and the hero statement. This is the "luxury" signal — it's what a boutique hospitality brand would use, not a sports app.
- **Utility/Data**: a condensed technical sans (e.g. *Space Grotesk* or *Neue Montreal*) for stats, countdowns, race numbers, category labels — this is the "sport" signal, evokes a timing board.
- **Body**: a plain humanist sans (*Inter* or *General Sans*) for all reading copy — stays invisible, does its job.

Never mix more than these three roles. The tension between the editorial serif and the technical condensed sans *is* the brand voice — luxury headline, athletic data.

**Layout concept — the parallax horizon system**:
```
┌─────────────────────────────────────┐
│ ░░░░░ sky/gradient (slowest layer) ░░│
│  ▲▲▲  palm/dhow silhouettes (mid)    │
│    ●●● athlete/course imagery (fast) │
│  HEADLINE TYPE — fixed, sharpest layer│
└─────────────────────────────────────┘
        ↓ scroll
   layers shift at different rates,
   chevron motif (already in your deck)
   becomes the scroll-progress marker,
   not just a decoration
```
The `>>>` chevron from the source deck is a gift here — reuse it as a literal motion device: it can animate as a scroll-progress indicator, a section-transition wipe, or a "next" affordance, rather than sitting static as a logo flourish like it does in the PDF.

**Signature element**: the hero is a full-bleed layered-parallax scene — ocean horizon and dhow sails in the background, a HYROX sled-pull silhouette in the mid-ground, and the event name set in the editorial serif in the foreground, sharp while everything behind it drifts. This single moment should embody the whole brand in one scroll gesture. Everything else on the site stays disciplined and quiet around it — no other page should compete with the hero for spectacle.

**What to avoid**: don't default to (a) cream background + serif + terracotta (reads generic-AI-luxury), (b) pure black + neon single accent with no second color doing real work, (c) heavy skeuomorphic gold/foil treatments — "luxury" here should come from spacing, restraint, and photography quality, not ornamentation.

---

## Part 3 — Sitemap & Page-Level Content

### 1. Home
- Hero: parallax horizon scene, event name, date/location, primary CTA ("Register Your Category") + secondary CTA ("Become a Partner")
- Live countdown to 6 Nov 2026 (Ember accent, technical type)
- "Two disciplines, one festival" — cycling + HYROX split panel
- Quick stats band: 1,500+ participants / 15 countries / 2,000+ spectators / 500,000+ reach
- "Why Zanzibar" teaser (tourism angle) → links to About
- Partner logo strip (once secured)
- Footer CTA: newsletter / social

### 2. About / Who We Are
- Mission statement (from deck, tightened — the deck copy has typos to fix: "fitnes" → "fitness")
- Vision / Mission / Commitment / Approach — as four distinct cards, not a wall of text
- Short founding story (currently missing from the deck — worth asking client for 2–3 sentences on *why* this started; that's the most human, least templated content on the whole site)

### 3. The Festival
- Full event detail: date, venue (Fumba Town), format explanation
- Cycling competition details: distances, categories, route map (embed or static map graphic)
- HYROX-style competition details: stations, format, categories (elite/open/corporate)
- Schedule/program (this doesn't exist in the deck yet — flag to client as a content gap; without a schedule page, athletes can't plan travel)

### 4. Register
- Category selector (cycling / HYROX / corporate team) with pricing
- This is the highest-load, highest-stakes page on the entire site — treated as its own product in Part 4 below, not just a page
- Clear cancellation/refund policy, waiver, category cutoffs

### 5. Partnership & Sponsorship
- "Why Partner With Us" (deck content, reworked as benefit-led not list-led)
- Tiered packages: Gold / Silver, plus category partners (Airline, Water, Media, Tourism & Hospitality)
- Downloadable sponsorship deck (PDF) + direct contact form routed to partnerships lead

### 6. Leadership / Team
- Six leadership profiles from the deck — needs consistent photography treatment (the source deck has mismatched photo qualities/crops; flag this to client before launch, it undercuts the luxury positioning immediately)

### 7. Gallery / Media
- Photo/video from past editions or brand shoot; press kit download; logo assets for media

### 8. News & Press
- Announcements, results archive (grows over years — plan the data model now even if empty at launch)

### 9. FAQ
- Travel to Zanzibar, visas, accommodation partners, what to bring, spectator info

### 10. Contact
- Form + WhatsApp (very relevant for Tanzania/East Africa audience) + physical location (Fumba Town) + socials

### 11. (Event-day only) Live Leaderboard
- Real-time race results/standings — this is the feature that actually demands the heavy engineering in Part 4. Doesn't need to exist pre-launch but the architecture must be planned for it now.

---

## Part 4 — Technical Architecture

You flagged the real requirement clearly: this isn't a brochure site, it's a system that has to survive **registration-opening traffic spikes** and **event-day concurrent load** (live results, thousands of simultaneous spectators refreshing standings) without falling over, plus handle **payments and personal data** for people across 15 countries. Here's how I'd lay that out as an engineer, not just a designer.

### 4.1 Architecture overview

```
                         ┌─────────────────────┐
   Users ── DNS ──────▶  │  CDN + WAF + DDoS    │  (Cloudflare)
                         │  edge cache, bot mgmt│
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐             ┌────────▼────────┐
            │ Static/marketing │             │   Application    │
            │ pages (SSG/ISR)  │             │   API layer      │
            │ Next.js on edge  │             │  (autoscaled)    │
            └──────────────────┘             └────────┬────────┘
                                                       │
                        ┌──────────────────────────────┼───────────────────┐
                        │                               │                   │
                ┌───────▼───────┐             ┌─────────▼────────┐  ┌───────▼───────┐
                │ Postgres (RDS) │             │  Redis (cache +   │  │  Job queue     │
                │ primary + read │             │  rate-limit +     │  │  (BullMQ/SQS)  │
                │ replica        │             │  session/pubsub)  │  │  emails,       │
                └────────────────┘             └────────┬──────────┘  │  webhooks,     │
                                                          │            │  PDF tickets   │
                                                ┌─────────▼─────────┐  └────────────────┘
                                                │ WebSocket/SSE      │
                                                │ fan-out for live   │
                                                │ leaderboard        │
                                                └────────────────────┘
```

### 4.2 Why each piece is there

- **CDN + WAF in front of everything (Cloudflare or equivalent)**: absorbs DDoS, caches static assets and images globally (important — you have athletes/spectators across 15 countries, latency matters), and does bot management. This is also your first line of defense against ticket-registration bots/scalping.
- **Static marketing pages pre-rendered (Next.js SSG/ISR)**: Home, About, Festival, Partnership, Gallery, FAQ don't need a database hit per visitor. Serve them from the edge. This is what lets the "brochure" side of the site handle essentially unlimited concurrent traffic for free.
- **Application API layer, stateless and horizontally autoscaled**: handles registration, payments, forms. Stateless so you can scale instances up during the registration-opening window and back down after — don't pay for peak capacity year-round.
- **Postgres with a read replica**: writes (new registrations) go to primary; leaderboard/read-heavy traffic on event day gets routed to the replica so it can't starve the write path that's processing entries.
- **Redis**: three jobs — response caching (so repeated identical queries don't hit Postgres), rate limiting (protects the registration endpoint from bot floods), and pub/sub backbone for live updates.
- **Job queue (BullMQ/SQS)**: registration confirmation emails, payment webhook processing, ticket/PDF generation — all pushed to a queue instead of done inline. If email delivery is slow, it should never make someone's registration hang or fail.
- **WebSocket/SSE fan-out for the live leaderboard**: thousands of spectators watching results update in real time is a fan-out problem, not a database problem — every client can't poll Postgres directly. Redis pub/sub (or Kafka if you want to over-engineer for future scale) broadcasts one update to all connected clients.

### 4.3 Security

- **Payments**: never touch card data directly — use a hosted checkout (Stripe, or Selcom/mobile-money integration relevant to the East African market) so PCI scope stays off your servers entirely.
- **WAF + rate limiting** on all write endpoints (registration, contact forms) — this is standard bot/abuse defense, and directly relevant given your own VAPT/CVE work at Yas.
- **RBAC on the admin/organizer panel** — leadership team, partnerships, and registration-ops likely need different access levels; don't build one shared admin login.
- **Secrets management** (Vault, AWS Secrets Manager, or even just properly scoped environment variables per environment) — no credentials in code or repo.
- **TLS everywhere**, HSTS, secure cookie flags, input validation/sanitization on every form (contact, registration, sponsorship inquiry).
- **Audit logging** on registration and payment state changes — you'll want this for disputes and for finance reconciliation with the 15-country athlete base.
- **Scheduled VAPT before the registration window opens and again before event day** — the two moments where you're most exposed to real attack traffic and real abuse incentive (ticket fraud).

### 4.4 Resilience

- **Multi-AZ deployment** for the database and app tier — a single availability zone going down shouldn't take the whole registration flow with it.
- **Health checks + auto-restart** on all app instances; **circuit breakers** on the payment provider integration so a slow third-party doesn't cascade into your whole API timing out.
- **Graceful degradation plan**: if the live-leaderboard service has an incident on event day, the rest of the site (schedule, info, contact) should keep functioning independently — don't let one feature's outage take down the whole domain.
- **Automated backups + point-in-time recovery** on Postgres — non-negotiable once you're holding payment records and personal data for 1,500+ people.
- **A public status page** — small thing, but for an event with international travelers, being able to check "is registration up" without emailing support matters.

### 4.5 Observability

- Centralized logging (e.g. Loki/ELK), metrics (Prometheus/Grafana or a hosted equivalent), error tracking (Sentry), uptime alerting (e.g. Better Uptime/Pingdom) piping to whoever's on call during the registration window and event day specifically — those are your two real risk windows, not every day of the year.

### 4.6 CI/CD & environments

- Staging environment that mirrors production, automated tests on the registration/payment path specifically (this is the one flow you cannot afford to have silently break), infrastructure as code (Terraform) so the whole stack is reproducible, and a blue-green or canary deploy strategy so releases close to the registration deadline or event day carry minimal risk.

---

## Part 5 — Build Sequence (Phased)

| Phase | Focus | Key deliverable |
|---|---|---|
| 0 — Discovery & content gaps | Get client to fill the gaps flagged above: founding story, schedule/program, consistent leadership photography, refund policy, route map | Signed-off content doc |
| 1 — Design system | Tokens, type pairing, component library, hero parallax prototype | Figma file + one working hero prototype in-browser |
| 2 — Marketing pages | Home, About, Festival, Partnership, Leadership, Gallery, FAQ, Contact — statically rendered | Deployed staging site |
| 3 — Registration & payments | Category selection, checkout, hosted payment integration, confirmation emails via queue | Working registration flow, load-tested |
| 4 — Event-day features | Live leaderboard (WebSocket/SSE), schedule/results data model | Feature-flagged, tested against simulated concurrent load |
| 5 — Hardening | WAF rules, rate limits, VAPT, backup/DR drill, load test at 3–5x expected peak | Security sign-off |
| 6 — Launch & monitor | Go-live, on-call rotation for registration window and event day | Live site + status page |

---

**Flag for the client conversation**: the deck currently has real content gaps that will show up as broken pages if you build straight from it — no schedule/program, no refund/cancellation policy, no founding story, and inconsistent leadership photo quality. Worth raising before Phase 1 so it doesn't stall Phase 2.
