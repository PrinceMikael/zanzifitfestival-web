/**
 * Flat, graphic horizon scene — ocean gradient, dhow sails, palm silhouettes.
 * Kept illustrative (no photography) so it composites cleanly with the
 * mid-ground athlete layer.
 */
export function HorizonLayer() {
  return (
    <div className="absolute inset-0">
      {/* Sky / ocean gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0b0e12 0%, #10312f 46%, #0e4f4c 62%, #123b39 78%, #0b0e12 100%)',
        }}
      />
      {/* Sun glow near the horizon */}
      <div
        className="absolute left-1/2 top-[52%] h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(223,162,59,0.55) 0%, rgba(223,162,59,0) 70%)',
        }}
      />

      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* horizon line */}
        <line x1="0" y1="470" x2="1440" y2="470" stroke="#dfa23b" strokeOpacity="0.25" strokeWidth="1" />

        {/* dhow sails — simple triangles */}
        <g fill="#0b0e12" fillOpacity="0.9">
          <path d="M250 470 L300 300 L305 470 Z" />
          <path d="M305 470 L312 340 L360 470 Z" />
        </g>
        <g fill="#0b0e12" fillOpacity="0.75">
          <path d="M1040 470 L1078 356 L1082 470 Z" />
          <path d="M1082 470 L1088 386 L1124 470 Z" />
        </g>
        <g fill="#0b0e12" fillOpacity="0.55">
          <path d="M690 470 L716 392 L720 470 Z" />
        </g>

        {/* palm silhouettes flanking the frame */}
        <g fill="#0b0e12">
          <PalmLeft />
          <PalmRight />
        </g>
      </svg>
    </div>
  )
}

function PalmLeft() {
  return (
    <g transform="translate(70 470)">
      <path d="M18 0 C10 -150 22 -300 34 -430 L46 -430 C40 -300 42 -150 40 0 Z" />
      <g transform="translate(38 -430)">
        <path d="M0 0 C-70 -30 -140 -20 -190 20 C-120 -6 -50 -8 0 8 Z" />
        <path d="M0 0 C70 -30 140 -20 190 20 C120 -6 50 -8 0 8 Z" />
        <path d="M0 0 C-40 -70 -90 -110 -150 -120 C-90 -80 -40 -30 0 6 Z" />
        <path d="M0 0 C40 -70 90 -110 150 -120 C90 -80 40 -30 0 6 Z" />
        <path d="M0 0 C-10 -80 0 -150 20 -200 C10 -130 6 -60 6 6 Z" />
      </g>
    </g>
  )
}

function PalmRight() {
  return (
    <g transform="translate(1370 470) scale(-1 1)">
      <path d="M18 0 C10 -120 20 -240 30 -340 L42 -340 C36 -240 40 -120 38 0 Z" />
      <g transform="translate(34 -340)">
        <path d="M0 0 C-58 -24 -116 -16 -158 16 C-100 -4 -42 -6 0 6 Z" />
        <path d="M0 0 C58 -24 116 -16 158 16 C100 -4 42 -6 0 6 Z" />
        <path d="M0 0 C-32 -58 -74 -92 -124 -100 C-74 -66 -32 -24 0 5 Z" />
        <path d="M0 0 C32 -58 74 -92 124 -100 C74 -66 32 -24 0 5 Z" />
      </g>
    </g>
  )
}
