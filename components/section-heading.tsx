import { cn } from '@/lib/utils'
import { Chevrons } from '@/components/chevrons'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'flex items-center gap-2',
            align === 'center' && 'justify-center',
          )}
        >
          <Chevrons count={3} className="text-amber" />
          <span
            className={cn(
              'eyebrow',
              tone === 'light' ? 'text-deep-teal' : 'text-amber',
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={cn(
          'mt-4 text-balance font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl',
          tone === 'light' ? 'text-ink' : 'text-bone',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-pretty text-lg leading-relaxed',
            tone === 'light' ? 'text-ink/70' : 'text-bone/65',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
