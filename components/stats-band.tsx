import { Chevrons } from '@/components/chevrons'

const STATS = [
  { value: '1,500+', label: 'Participants' },
  { value: '15', label: 'Countries' },
  { value: '2,000+', label: 'Spectators' },
  { value: '500K+', label: 'Media reach' },
]

export function StatsBand() {
  return (
    <section className="bg-deep-teal py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Chevrons count={3} className="text-amber" />
          <span className="eyebrow text-bone/80">By the numbers</span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-l-2 border-amber/40 pl-4">
              <div className="font-utility text-4xl font-semibold tracking-tight text-bone sm:text-5xl lg:text-6xl">
                {s.value}
              </div>
              <div className="mt-2 font-utility text-xs uppercase tracking-[0.18em] text-bone/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
