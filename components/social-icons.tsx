import type { SVGProps } from 'react'

/**
 * Minimal inline brand glyphs for footer social links.
 *
 * lucide-react (installed version) no longer ships brand/logo icons
 * (Instagram/Facebook/Youtube were removed from core). Rather than add a
 * new dependency (react-icons, simple-icons) for three glyphs, these are
 * small hand-drawn outline approximations at the same 24x24 viewBox/stroke
 * conventions lucide uses, so they sit visually consistent with
 * `MessageCircle` (still used for WhatsApp) at `size-4`.
 */

type IconProps = SVGProps<SVGSVGElement>

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M13.5 21v-7h2.2l.3-2.8h-2.5V9.4c0-.8.2-1.4 1.4-1.4h1.3V5.1c-.6-.1-1.4-.2-2.3-.2-2.3 0-3.9 1.4-3.9 3.9v2.4H7.5v2.8H10v7" />
    </svg>
  )
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}
