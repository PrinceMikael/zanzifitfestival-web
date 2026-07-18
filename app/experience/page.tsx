import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Chevrons } from '@/components/chevrons'
import { ExpandableCard } from '@/components/expandable-card'
import { EnquiryLink } from '@/components/enquiry-link'

export const metadata: Metadata = {
  title: 'Experience Zanzibar',
  description:
    'What to see, taste and understand on the island that hosts ZanziFit — Stone Town, the coast, the culture and the food, all a short ride from Fumba Town.',
}

const THINGS_TO_DO = [
  {
    title: 'Stone Town',
    badge: '~45 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The UNESCO-listed old town: narrow alleys, carved wooden doors, and centuries of Swahili, Omani and Indian history.',
    details: [
      'House of Wonders — former Sultan’s palace, now a museum of Swahili and Zanzibar history',
      'Guided spice tours run daily from the Old Fort area',
      'Forodhani Gardens waterfront, best visited at sunset',
    ],
  },
  {
    title: 'Forodhani Gardens Night Market',
    badge: 'Stone Town',
    image: '/images/festival-village.png',
    summary:
      'Every evening the seafront gardens turn into an open-air food market — grilled seafood skewers, samosas and Zanzibar “pizza” cooked to order.',
    details: [
      'Best visited 6–9pm as vendors set up for the evening',
      'Try urojo, Zanzibar’s tangy spiced soup, alongside the grills',
      'A five-minute walk from most Stone Town accommodation',
    ],
  },
  {
    title: 'Menai Bay',
    badge: '~10 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The conservation area right on Fumba’s doorstep — dolphin encounters, snorkeling and sandbank boat trips.',
    details: [
      'Boat trips typically depart from Fumba and nearby jetties',
      'Snorkeling over the reef is best at low tide',
      'The closest of these excursions to the festival village',
    ],
  },
  {
    title: 'Nungwi & Kendwa Beaches',
    badge: '~70–80 min from Fumba',
    image: '/images/zanzibar-coast.png',
    summary:
      'The island’s north-tip beaches — turquoise water, sandbars and the liveliest sunset scene in Zanzibar.',
    details: [
      'Kendwa’s beach stays swimmable at every tide, unlike much of the east coast',
      'A popular day-trip or stay-over add-on after race weekend',
    ],
  },
  {
    title: 'Jozani-Chwaka Bay National Park',
    badge: '~50 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'Zanzibar’s only national park — home to the red colobus monkey, found nowhere else on Earth.',
    details: [
      'Guided forest walks last roughly 45 minutes to an hour',
      'Combine with the adjacent mangrove boardwalk',
    ],
  },
  {
    title: 'Mnemba Atoll',
    badge: '~2 hrs incl. boat',
    image: '/images/zanzibar-coast.png',
    summary:
      'A marine conservation area off the north-east coast — some of the clearest water in Zanzibar for snorkeling and diving.',
    details: [
      'Visibility typically ranges 15–30 metres',
      'A relaxed drive plus a short boat transfer from most of the island',
      'Best combined with a full-day excursion given the distance from Fumba',
    ],
  },
  {
    title: 'Kizimkazi',
    badge: '~40 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'A fishing village on the south coast, known for wild dolphin encounters and one of East Africa’s oldest mosques.',
    details: [
      'Boat trips have a strong chance of dolphin sightings, though they are wild and not guaranteed',
      'The 12th-century mosque holds early Kufic script inscriptions, among the earliest evidence of Islam in East Africa',
    ],
  },
  {
    title: 'Prison Island (Changuu)',
    badge: '~50 min incl. boat',
    image: '/images/zanzibar-coast.png',
    summary:
      'A short boat ride from Stone Town, now home to giant Aldabra tortoises brought over from Seychelles in the 1820s.',
    details: [
      'Some resident tortoises are recorded as over 100 years old',
      'The island also has a beach and snorkeling spot alongside the tortoise sanctuary',
    ],
  },
  {
    title: 'Michamvi Peninsula',
    badge: '~75 min from Fumba',
    image: '/images/festival-village.png',
    summary:
      'A quiet east-coast peninsula known for a walkable sandbank that appears at low tide.',
    details: [
      'The sandbank is a popular sunset spot, reachable on foot at low tide',
      'Less developed than Nungwi or Kendwa — a quieter alternative for a day trip',
    ],
  },
]

const CULTURE_FACTS = [
  'Zanzibar sits on the historic Swahili Coast, shaped by centuries of Arab, Persian, Indian and European trade and, later, Omani Sultanate rule.',
  'Stone Town’s carved wooden doors are a signature craft — each pattern historically signalled the wealth and trade of the household.',
  'The islands are predominantly Muslim, so modest dress (shoulders and knees covered) is appreciated away from the beach, particularly in Stone Town.',
  'Taarab, a musical style blending Swahili, Arab and Indian influences, remains a living tradition across the islands.',
  'Stone Town hosts Sauti za Busara, a four-day pan-African music festival held every February.',
  'Swahili is the language of daily life alongside English, which is widely spoken in tourism and business.',
]

const FOOD_HIGHLIGHTS = [
  {
    name: 'Zanzibar "Pizza"',
    detail: 'A savoury stuffed crepe, grilled fresh at Forodhani Gardens and street stalls island-wide.',
  },
  {
    name: 'Urojo',
    detail: 'A tangy, spiced soup with cassava, potato fritters and mango — a Stone Town staple.',
  },
  {
    name: 'Spice Coffee',
    detail: 'Coffee brewed with island-grown cinnamon, cardamom and ginger, sold by street vendors across Stone Town.',
  },
  {
    name: 'Forodhani Seafood Grills',
    detail: 'Fresh-caught skewers of octopus, prawn and reef fish, grilled to order every evening.',
  },
  {
    name: 'Mchuzi wa Pweza',
    detail: 'Octopus curry — tender octopus simmered in a coconut sauce with garlic, ginger and turmeric.',
  },
  {
    name: 'Biryani',
    detail: 'A saffron-spiced layered rice dish with marinated meat and fried onions, reflecting the island’s Indian Ocean trade history.',
  },
  {
    name: 'Kashata',
    detail: 'A coconut and sesame sweet, sold across Stone Town’s markets and street stalls.',
  },
  {
    name: 'Mandazi',
    detail: 'Lightly sweetened Swahili doughnuts, flavoured with cardamom — a common breakfast snack with tea or coffee.',
  },
]

const TRAVEL_INFO = [
  'Dry season: June–October and January–February — the best window for racing and sightseeing',
  'Rains: mid-March–May and November bring heavier showers',
  'Arrive via Abeid Amani Karume International Airport (ZNZ), Zanzibar Town',
  'Visa on arrival is available for most nationalities — confirm your requirement before you fly',
  'Fumba Town is roughly 30–45 minutes by road from the airport and Stone Town',
  'Currency: Tanzanian Shilling (TZS) — US dollars are widely accepted at hotels and tour operators',
  'Time zone: East Africa Time (EAT, UTC+3) year-round',
  'Power: UK-style three-pin plugs, 230V',
]

export default function ExperiencePage() {
  return (
    <main>
      <PageHero
        eyebrow="Experience Zanzibar"
        title={<>Race here. Stay a while.</>}
        intro="ZanziFit is based in Fumba Town, on Zanzibar's west coast — a short ride from Stone Town's old city and the island's best-known beaches. Here's what to see beyond the finish line."
        image={{ src: '/images/zanzibar-coast.png', alt: 'A traditional dhow sailing off the Zanzibar coast at golden hour' }}
      />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="About Zanzibar" title="An island shaped by centuries of trade." align="left" />
            <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
              Zanzibar is an archipelago off the coast of mainland Tanzania, its culture
              layered by Swahili, Arab, Persian, Indian and European influence over
              hundreds of years of Indian Ocean trade. ZanziFit races out of Fumba Town,
              a quiet stretch of the west coast on Menai Bay — close enough to Stone
              Town for an afternoon of sightseeing, far enough to still feel like your
              own stretch of coastline.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/festival-village.png"
              alt="The ZanziFit festival village on the Zanzibar coast"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="things-to-do" className="scroll-mt-24 border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Things to Do" title="Beyond race day." />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {THINGS_TO_DO.map((item) => (
              <ExpandableCard
                key={item.title}
                image={item.image}
                alt={item.title}
                title={item.title}
                badge={item.badge}
                summary={item.summary}
                details={item.details}
                enquiryLabel={item.title}
                enquiryContext="experience"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="Culture & Heritage" title="A crossroads of the Indian Ocean." align="left" />
            <ul className="mt-8 space-y-4">
              {CULTURE_FACTS.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Chevrons className="mt-0.5 shrink-0 text-amber" count={1} />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/zanzibar-coast.png"
              alt="Traditional dhow boats off the Zanzibar coast"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-dark-soft py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Food & Cuisine" title="Eat your way around the island." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {FOOD_HIGHLIGHTS.map((f) => (
              <div key={f.name} className="rounded-lg border border-border bg-background p-6">
                <h3 className="font-display text-xl font-semibold text-surface-dark-foreground">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow="Travel Information" title="Plan your trip." />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {TRAVEL_INFO.map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-sm border border-border bg-surface-dark-soft px-4 py-3 text-sm text-surface-dark-foreground">
              <Chevrons className="shrink-0 text-amber" count={1} />
              {i}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            Have questions about planning your stay around race weekend?
          </p>
          <EnquiryLink label="planning my trip to Zanzibar" context="experience" className="mt-3" />
        </div>
      </section>
    </main>
  )
}
