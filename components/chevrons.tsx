import { cn } from '@/lib/utils'

/**
 * The ">>>" motion motif from the brand deck, reused as a literal
 * directional device rather than static decoration.
 */
export function Chevrons({
  className,
  count = 3,
  animate = false,
}: {
  className?: string
  count?: number
  animate?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex items-center', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 12 16"
          className="h-[0.9em] w-[0.55em]"
          fill="none"
          style={
            animate
              ? {
                  animation: 'chevron-drift 1.6s ease-in-out infinite',
                  animationDelay: `${i * 0.14}s`,
                }
              : undefined
          }
        >
          <path
            d="M1 1L9 8L1 15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
        </svg>
      ))}
    </span>
  )
}
