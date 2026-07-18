import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ExpandableCard } from '@/components/expandable-card'

export const metadata: Metadata = {
  title: 'Accommodation',
  description:
    'Where to stay for ZanziFit Festival — hotels, resorts, boutique stays and budget options around Fumba Town, Zanzibar. We help you book.',
}

const HOTELS = [
  {
    title: 'DoubleTree by Hilton Nungwi',
    area: 'Nungwi',
    badge: '~75 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A full-service international hotel on the island’s northern tip, with multiple restaurants and a spa.',
    details: [
      'Ocean-view rooms and suites, on-site pool and fitness centre',
      'Best for travellers who want a familiar hotel-brand experience',
      'A longer transfer from the festival village — plan race-morning logistics ahead',
    ],
  },
  {
    title: 'Green Turaco',
    area: 'Fumba',
    badge: '~5 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A simple, business-friendly hotel right in Fumba — the shortest possible commute to the start line.',
    details: [
      'Walkable or a short ride to the festival village',
      'Straightforward rooms, good for a no-frills race-weekend base',
    ],
  },
]

const RESORTS = [
  {
    title: 'Fumba Beach Lodge',
    area: 'Fumba',
    badge: '~5 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A secluded beach lodge inside the Menai Bay Conservation Area — the closest resort stay to the festival village.',
    details: [
      'Cottage and suite rooms with private terraces and ocean views',
      'On-site dive centre for reef trips and sandbank excursions',
      'Best paired with an early race-morning start given the short transfer',
    ],
  },
  {
    title: 'Essque Zalu Zanzibar',
    area: 'Nungwi',
    badge: '~75 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A five-star resort on Zanzibar’s northern point, known for dramatic ocean views and full-service spa.',
    details: [
      'A good choice for a post-race, stay-longer trip extension',
      'Multiple dining options and an infinity pool over the water',
    ],
  },
  {
    title: 'Zuri Zanzibar',
    area: 'Kendwa',
    badge: '~80 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'An eco-conscious resort with chic bungalows and a private stretch of Kendwa beach.',
    details: [
      'Kendwa’s beach stays swimmable at every tide',
      'Best for travellers extending their trip beyond race weekend',
    ],
  },
]

const BOUTIQUE_STAYS = [
  {
    title: 'Sharazād Wonders Boutique Hotel',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A small, historic courtyard hotel in the heart of Stone Town’s old city.',
    details: [
      'Handful of rooms around a quiet private courtyard',
      'Walking distance to the House of Wonders and Forodhani Gardens',
      'Best for travellers who want culture and nightlife over beachfront',
    ],
  },
  {
    title: 'Mwezi Boutique Resort',
    area: 'Paje',
    badge: '~55 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'An artistic, eco-conscious boutique resort on Zanzibar’s east coast, near Paje’s kite-surfing scene.',
    details: [
      'Stylish bungalow-style rooms',
      'Good base for combining race weekend with kite-surfing or a beach-town stay',
    ],
  },
]

const BUDGET_STAYS = [
  {
    title: 'Jambo Guesthouse',
    area: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/festival-village.png',
    summary: 'A family-run guesthouse in Stone Town with rooftop breakfast views — simple, friendly and central.',
    details: [
      'Private rooms at guesthouse rates',
      'Central to Stone Town’s old-city sights',
    ],
  },
  {
    title: 'Drifters Backpackers',
    area: 'Paje',
    badge: '~55 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary: 'A few steps from Paje beach — dorms and private bandas, communal kitchen and on-site bar.',
    details: [
      'The most affordable tier covered here',
      'Popular with solo travellers and the kite-surfing crowd',
    ],
  },
]

const TIERS = [
  { id: 'hotels', eyebrow: 'Hotels', title: 'Familiar comfort, full service.', items: HOTELS },
  { id: 'resorts', eyebrow: 'Resorts', title: 'Beachfront, all-inclusive ease.', items: RESORTS },
  { id: 'boutique', eyebrow: 'Boutique Stays', title: 'Small, characterful, personal.', items: BOUTIQUE_STAYS },
  { id: 'budget', eyebrow: 'Budget Stays', title: 'Simple, friendly, affordable.', items: BUDGET_STAYS },
]

const BOOKING_STEPS = [
  { step: '01', title: 'Tell us your dates & budget', detail: 'Message us your race-weekend dates, group size and the tier of stay you’re after.' },
  { step: '02', title: 'We check availability', detail: 'We reach out to the property on your behalf and confirm what’s open for your dates.' },
  { step: '03', title: 'You confirm', detail: 'Book directly with the property or let us handle the confirmation — either way, we stay in the loop.' },
]

export default function AccommodationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Accommodation"
        title={<>We&apos;re not a hotel. We&apos;re your local connection.</>}
        intro="ZanziFit doesn't run properties — we know them. Tell us what you're after and we'll help you find and book a place to stay for race weekend, from beachfront resorts to budget guesthouses."
      />

      {TIERS.map((tier) => (
        <section
          key={tier.id}
          id={tier.id}
          className="scroll-mt-24 border-b border-border px-6 py-20 md:py-28 odd:bg-ink-soft"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow={tier.eyebrow} title={tier.title} />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tier.items.map((item) => (
                <ExpandableCard
                  key={item.title}
                  image={item.image}
                  alt={item.title}
                  title={item.title}
                  badge={item.badge}
                  summary={`${item.area} — ${item.summary}`}
                  details={item.details}
                  enquiryLabel={item.title}
                  enquiryContext="accommodation"
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Booking Info" title="How booking through us works." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {BOOKING_STEPS.map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-ink-soft p-8">
              <div className="font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber">{s.step}</div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-bone">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-3 border-t border-border pt-10 text-sm text-muted-foreground">
          <p className="flex items-center gap-3">
            <Chevrons className="text-amber" count={1} />
            info@zanzifitfestival.com
          </p>
          <p className="flex items-center gap-3">
            <Chevrons className="text-amber" count={1} />
            +255 686 915 587
          </p>
          <p className="flex items-center gap-3">
            <Chevrons className="text-amber" count={1} />
            <a
              href="https://wa.me/255686915587"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Chat"
              className="transition-colors hover:text-amber"
            >
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
