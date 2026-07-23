import { cn } from '@/lib/utils'

export function SectionHeading({
  title,
  intro,
  align = 'left',
  tone = 'dark',
  className,
}: {
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
      <h2
        className={cn(
          'text-balance font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl',
          tone === 'light' ? 'text-ink' : 'text-surface-dark-foreground',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-pretty text-lg leading-relaxed',
            tone === 'light' ? 'text-ink/70' : 'text-surface-dark-foreground/65',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
