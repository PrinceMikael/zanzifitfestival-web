import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { GalleryGrid } from '@/components/gallery-grid'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos from ZanziFit Festival — road cycling, HYROX-style competition, and the festival village on the Zanzibar coast.',
}

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title={<>The horizon, in motion.</>}
        intro="Road cycling, HYROX-style competition, and the festival village along the Fumba peninsula — filter by discipline below."
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <GalleryGrid />
      </section>
    </main>
  )
}
