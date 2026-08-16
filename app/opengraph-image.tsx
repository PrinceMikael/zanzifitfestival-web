import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'ZanziFit Festival, Zanzibar, 6-8 November 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Same brand tokens as app/globals.css / DESIGN.md ("Timing Board" system):
// void-black ground, amber accent, condensed uppercase mono utility type.
// Kept as literals rather than imported CSS since ImageResponse renders in
// an isolated Satori environment with no access to the app's stylesheet.
const INK = '#000000'
const BONE = '#ede7d8'
const AMBER = '#f2a944'

export default async function OpengraphImage() {
  const clashBold = await readFile(
    join(process.cwd(), 'public/fonts/clash-display/ClashDisplay-Bold.otf'),
  )
  const clashMedium = await readFile(
    join(process.cwd(), 'public/fonts/clash-display/ClashDisplay-Medium.otf'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: INK,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Faint horizon glow, standing in for the coastline photography
            without needing to composite a raster image through Satori. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(1100px 500px at 50% 120%, rgba(242,169,68,0.16), rgba(0,0,0,0) 60%)',
          }}
        />

        {/* Eyebrow row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width={20} height={28} viewBox="0 0 12 16" fill="none">
              <path
                d="M1 1L9 8L1 15"
                stroke={AMBER}
                strokeWidth={2.5}
                strokeLinecap="square"
              />
            </svg>
          ))}
          <span
            style={{
              fontFamily: 'Clash Display Medium',
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: BONE,
              opacity: 0.75,
            }}
          >
            Zanzibar, Tanzania
          </span>
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Clash Display Bold',
              fontSize: 108,
              lineHeight: 0.98,
              letterSpacing: -2,
              color: BONE,
            }}
          >
            ZanziFit Festival
          </span>
          <span
            style={{
              marginTop: 28,
              fontFamily: 'Clash Display Medium',
              fontSize: 34,
              color: AMBER,
            }}
          >
            Road Cycling &amp; HYROX-Style Racing
          </span>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid rgba(237,231,216,0.16)`,
            paddingTop: 32,
          }}
        >
          <span
            style={{
              fontFamily: 'Clash Display Medium',
              fontSize: 26,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: BONE,
            }}
          >
            6 – 8 November 2026
          </span>
          <span
            style={{
              fontFamily: 'Clash Display Medium',
              fontSize: 26,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: AMBER,
            }}
          >
            zanzifitfestival.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Clash Display Bold', data: clashBold, weight: 700, style: 'normal' },
        { name: 'Clash Display Medium', data: clashMedium, weight: 500, style: 'normal' },
      ],
    },
  )
}
