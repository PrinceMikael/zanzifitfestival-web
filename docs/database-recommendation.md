# Database Recommendation — ZanziFit Festival Website

This is a recommendation only. No backend or database is implemented as part of
this round of work — per explicit instruction, that planning happens separately.

## What needs no database today

Home, About, Festival, Partnership, Leadership, Gallery, and FAQ are static
marketing content. They render the same for every visitor and don't need a
database — keep them statically rendered.

## What needs a database as soon as you want to keep submissions

Right now, four forms (Newsletter, Partnership Inquiry, Contact, Register)
validate input correctly but only simulate success in the browser — submitted
data is never sent anywhere and disappears on page refresh. The moment you want
to actually see who submitted what, this needs a real datastore. This doesn't
require the full architecture below — a single managed Postgres instance
(e.g. Supabase or Neon, both have generous free tiers) with one `submissions`
table (columns: `id`, `form_type`, `payload` as JSON, `created_at`) plus one API
route per form would close this gap without much engineering effort.

## What needs a real backend before it can process money

The Register page is currently a "notify me" interest form by design — no
payment provider is wired up. Turning this into real paid registration needs:
a proper database (not just a submissions table — registrant records, payment
status, category capacity limits), a hosted checkout integration (Stripe, or a
mobile-money provider relevant to the East African market, e.g. Selcom), and
webhook handling for payment confirmation. This is a meaningfully larger build
than the marketing site and should be scoped as its own project phase.

## What needs the full event-day architecture

A live leaderboard (real-time race results for spectators) is a fan-out
problem, not just a database problem — thousands of people refreshing the
same data needs a broadcast mechanism (WebSocket/SSE + Redis pub/sub), not
everyone hitting Postgres directly. This is explicitly a post-launch,
event-day-only feature and doesn't need to exist before the festival's
marketing site and registration flow are live.

## Suggested order, when you're ready to revisit this

1. Managed Postgres + one API route per form, so submissions persist (small effort).
2. Registration/payment backend, once a payment provider is chosen (larger effort, own project).
3. Live leaderboard real-time stack, closer to event day (largest effort, time-boxed to when it's actually needed).
