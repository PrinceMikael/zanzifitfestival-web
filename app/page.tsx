import { Hero } from '@/components/hero'
import { Disciplines } from '@/components/disciplines'
import { PartnerStrip } from '@/components/partner-strip'
import { CtaBand } from '@/components/cta-band'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Disciplines />
      <PartnerStrip />
      <CtaBand />
    </main>
  )
}
