import { Hero } from '@/components/hero'
import { Disciplines } from '@/components/disciplines'
import { StatsBand } from '@/components/stats-band'
import { WhyZanzibar } from '@/components/why-zanzibar'
import { PartnerStrip } from '@/components/partner-strip'
import { CtaBand } from '@/components/cta-band'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Disciplines />
      <StatsBand />
      <WhyZanzibar />
      <PartnerStrip />
      <CtaBand />
    </main>
  )
}
