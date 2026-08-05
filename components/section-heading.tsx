import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

export function SectionHeading({
  title,
  intro,
  align = 'left',
  tone = 'dark',
  voice = 'editorial',
  className,
}: {
  title: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  // 'editorial' (default) is the sitewide Fraunces/Source-Serif-4 voice
  // used on tourism-register pages (About, Experience, Accommodation,
  // Leadership). 'athletic' opts into the Syne/IBM-Plex-Sans pairing
  // reserved for competition-format content (Festival, HYROX-Style,
  // Road Cycling) — see app/globals.css for the two role classes.
  voice?: 'editorial' | 'athletic'
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2
        className={cn(
          'text-balance text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl',
          voice === 'athletic' ? 'font-display-athletic' : 'font-display',
          tone === 'light' ? 'text-ink' : 'text-surface-dark-foreground',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-pretty text-lg leading-relaxed',
            voice === 'athletic' && 'font-body-athletic',
            tone === 'light' ? 'text-ink/70' : 'text-surface-dark-foreground/65',
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}
