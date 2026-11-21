// High-detail self-contained SVG images for CivicProof before & after field inspections
// Guaranteed to render 100% reliably in any environment without external network dependencies

export const PROOF_SVGS = {
  // 1. Stormwater Drain Desilting (#80005)
  stormwaterBefore: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2394A3B8"/><stop offset="100%" stop-color="%23CBD5E1"/></linearGradient>
      <linearGradient id="sludge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%233E2723"/><stop offset="100%" stop-color="%231B100E"/></linearGradient>
      <linearGradient id="concrete" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%2364748B"/><stop offset="100%" stop-color="%23475569"/></linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(%23sky1)"/>
    <!-- Canal Concrete Banks -->
    <polygon points="0,180 800,180 800,450 0,450" fill="%23334155"/>
    <polygon points="80,180 180,450 620,450 720,180" fill="url(%23concrete)"/>
    <polygon points="180,260 220,450 580,450 620,260" fill="%231E293B"/>
    <!-- Toxic stagnant sludge & sewage -->
    <path d="M 200,320 Q 400,310 600,325 L 610,450 L 190,450 Z" fill="url(%23sludge)"/>
    <!-- Plastic debris & trash buildup -->
    <ellipse cx="320" cy="340" rx="45" ry="15" fill="%23EF4444" opacity="0.9"/>
    <ellipse cx="460" cy="350" rx="55" ry="18" fill="%233B82F6" opacity="0.9"/>
    <ellipse cx="390" cy="330" rx="40" ry="14" fill="%23F59E0B" opacity="0.9"/>
    <ellipse cx="270" cy="360" rx="35" ry="12" fill="%23FFFFFF" opacity="0.8"/>
    <ellipse cx="510" cy="370" rx="50" ry="15" fill="%2310B981" opacity="0.8"/>
    <path d="M 330,310 L 370,330 L 350,345 Z" fill="%23E2E8F0"/>
    <path d="M 430,320 L 460,335 L 440,350 Z" fill="%23FDE047"/>
    <!-- Warning Badge -->
    <rect x="30" y="30" width="220" height="42" rx="10" fill="%23DC2626"/>
    <text x="140" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">BLOCKED CULVERT</text>
    <!-- Hazard sign -->
    <circle cx="720" cy="60" r="26" fill="%23EF4444" stroke="%23FFFFFF" stroke-width="3"/>
    <text x="720" y="70" fill="%23FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">!</text>
  </svg>`,

  stormwaterAfter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23BAE6FD"/><stop offset="100%" stop-color="%23E0F2FE"/></linearGradient>
      <linearGradient id="waterFlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230284C7"/><stop offset="100%" stop-color="%230369A1"/></linearGradient>
      <linearGradient id="cleanConc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%2394A3B8"/><stop offset="100%" stop-color="%2364748B"/></linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(%23sky2)"/>
    <!-- Clean Canal Concrete Banks -->
    <polygon points="0,180 800,180 800,450 0,450" fill="%23475569"/>
    <polygon points="80,180 180,450 620,450 720,180" fill="url(%23cleanConc)"/>
    <polygon points="180,260 220,450 580,450 620,260" fill="%23334155"/>
    <!-- Clear Flowing Blue Water -->
    <path d="M 210,310 Q 400,295 590,310 L 610,450 L 190,450 Z" fill="url(%23waterFlow)"/>
    <!-- Water Ripple Flow Lines -->
    <path d="M 250,340 Q 400,330 550,340" stroke="%237DD3FC" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M 230,370 Q 400,358 570,370" stroke="%2338BDF8" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 260,400 Q 400,390 540,400" stroke="%23BAE6FD" stroke-width="2.5" fill="none" opacity="0.6"/>
    <!-- Verification Badge -->
    <rect x="30" y="30" width="240" height="42" rx="10" fill="%23167A4D"/>
    <text x="150" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">CLEARED & DESILTED</text>
    <!-- Verified Checkmark -->
    <circle cx="720" cy="60" r="26" fill="%23167A4D" stroke="%23FFFFFF" stroke-width="3"/>
    <path d="M 710,60 L 717,67 L 732,52" stroke="%23FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,

  // 2. Road Pothole Crater Patch (#80001)
  potholeBefore: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%231E293B"/></linearGradient>
      <radialGradient id="crater" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%230F172A"/><stop offset="70%" stop-color="%231E293B"/><stop offset="100%" stop-color="%23475569"/></radialGradient>
    </defs>
    <rect width="800" height="450" fill="url(%23road)"/>
    <!-- Road Lane White Dashes -->
    <line x1="0" y1="80" x2="800" y2="80" stroke="%23F8FAFC" stroke-width="12" stroke-dasharray="60 40" opacity="0.7"/>
    <line x1="0" y1="380" x2="800" y2="380" stroke="%23F8FAFC" stroke-width="12" stroke-dasharray="60 40" opacity="0.7"/>
    <!-- Deep Crater Depression with ragged fractures -->
    <ellipse cx="400" cy="230" rx="180" ry="90" fill="url(%23crater)"/>
    <path d="M 230,220 Q 210,180 180,170 M 570,230 Q 610,210 650,220 M 410,320 Q 420,360 450,380 M 350,140 Q 330,110 320,90" stroke="%230F172A" stroke-width="5" fill="none"/>
    <!-- Exposed Aggregate Rocks & pooled dirty water -->
    <ellipse cx="380" cy="240" rx="100" ry="40" fill="%23475569" opacity="0.9"/>
    <circle cx="340" cy="235" r="12" fill="%2394A3B8"/>
    <circle cx="420" cy="250" r="15" fill="%2364748B"/>
    <circle cx="450" cy="225" r="10" fill="%2394A3B8"/>
    <circle cx="310" cy="245" r="9" fill="%23CBD5E1"/>
    <!-- Warning Badge -->
    <rect x="30" y="30" width="220" height="42" rx="10" fill="%23DC2626"/>
    <text x="140" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">ROAD CAVITATION</text>
  </svg>`,

  potholeAfter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
      <linearGradient id="road2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%231E293B"/></linearGradient>
      <linearGradient id="patch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231E293B"/><stop offset="100%" stop-color="%230F172A"/></linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(%23road2)"/>
    <!-- Road Lane White Dashes -->
    <line x1="0" y1="80" x2="800" y2="80" stroke="%23F8FAFC" stroke-width="12" stroke-dasharray="60 40" opacity="0.7"/>
    <line x1="0" y1="380" x2="800" y2="380" stroke="%23F8FAFC" stroke-width="12" stroke-dasharray="60 40" opacity="0.7"/>
    <!-- Freshly Compacted Bitumen Patch -->
    <rect x="220" y="140" width="360" height="180" rx="16" fill="url(%23patch)" stroke="%230F172A" stroke-width="3"/>
    <!-- Roller texture lines -->
    <line x1="240" y1="170" x2="560" y2="170" stroke="%23334155" stroke-width="3" stroke-dasharray="10 6"/>
    <line x1="240" y1="210" x2="560" y2="210" stroke="%23334155" stroke-width="3" stroke-dasharray="10 6"/>
    <line x1="240" y1="250" x2="560" y2="250" stroke="%23334155" stroke-width="3" stroke-dasharray="10 6"/>
    <line x1="240" y1="290" x2="560" y2="290" stroke="%23334155" stroke-width="3" stroke-dasharray="10 6"/>
    <!-- Fresh Yellow Lane Stripe across patch -->
    <line x1="220" y1="230" x2="580" y2="230" stroke="%23FBBF24" stroke-width="10"/>
    <!-- Verified Badge -->
    <rect x="30" y="30" width="240" height="42" rx="10" fill="%23167A4D"/>
    <text x="150" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">BITUMEN ROLLED</text>
    <!-- Verified Checkmark -->
    <circle cx="720" cy="60" r="26" fill="%23167A4D" stroke="%23FFFFFF" stroke-width="3"/>
    <path d="M 710,60 L 717,67 L 732,52" stroke="%23FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,

  // 3. Fallen Tree Obstruction (#80006)
  treeBefore: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <rect width="800" height="450" fill="%23D1FAE5"/>
    <!-- Brick Red Jogging Track -->
    <rect x="0" y="140" width="800" height="170" fill="%23B91C1C"/>
    <!-- Jogging Track Lines -->
    <line x1="0" y1="225" x2="800" y2="225" stroke="%23FFFFFF" stroke-width="4" stroke-dasharray="25 15"/>
    <!-- Fallen Massive Banyan Timber blocking the track -->
    <path d="M 160,280 Q 380,180 620,240 L 640,290 Q 390,240 180,340 Z" fill="%235C3A21"/>
    <!-- Broken boughs & leafy debris -->
    <ellipse cx="320" cy="200" rx="60" ry="35" fill="%2315803D" opacity="0.9"/>
    <ellipse cx="440" cy="220" rx="75" ry="40" fill="%23166534" opacity="0.9"/>
    <ellipse cx="540" cy="260" rx="50" ry="30" fill="%2315803D" opacity="0.8"/>
    <!-- Barrier Tape -->
    <line x1="120" y1="130" x2="680" y2="320" stroke="%23EAB308" stroke-width="8" stroke-dasharray="20 15"/>
    <!-- Warning Badge -->
    <rect x="30" y="30" width="220" height="42" rx="10" fill="%23DC2626"/>
    <text x="140" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">PATHWAY BLOCKED</text>
  </svg>`,

  treeAfter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <rect width="800" height="450" fill="%23D1FAE5"/>
    <!-- Brick Red Jogging Track - Clean & Open -->
    <rect x="0" y="140" width="800" height="170" fill="%23DC2626"/>
    <line x1="0" y1="225" x2="800" y2="225" stroke="%23FFFFFF" stroke-width="4" stroke-dasharray="25 15"/>
    <!-- Green Lawn Grass -->
    <circle cx="100" cy="80" r="40" fill="%2316A34A"/>
    <circle cx="700" cy="80" r="40" fill="%2316A34A"/>
    <circle cx="400" cy="70" r="50" fill="%2315803D"/>
    <!-- Swept clean pathway indicator -->
    <path d="M 280,225 L 340,225 M 460,225 L 520,225" stroke="%23FEF08A" stroke-width="3"/>
    <!-- Verified Badge -->
    <rect x="30" y="30" width="240" height="42" rx="10" fill="%23167A4D"/>
    <text x="150" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">OBSTACLE CLEARED</text>
    <circle cx="720" cy="60" r="26" fill="%23167A4D" stroke="%23FFFFFF" stroke-width="3"/>
    <path d="M 710,60 L 717,67 L 732,52" stroke="%23FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,

  // 4. Garbage Overflow (#80002)
  garbageBefore: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <rect width="800" height="450" fill="%23E2E8F0"/>
    <rect x="0" y="240" width="800" height="210" fill="%2364748B"/>
    <!-- Curb -->
    <rect x="0" y="225" width="800" height="25" fill="%2394A3B8"/>
    <!-- Overflowing Dumpster -->
    <rect x="280" y="120" width="240" height="160" rx="8" fill="%2315803D"/>
    <!-- Spilled bags and rubbish -->
    <ellipse cx="260" cy="270" rx="40" ry="20" fill="%23EF4444"/>
    <ellipse cx="320" cy="285" rx="50" ry="25" fill="%233B82F6"/>
    <ellipse cx="440" cy="280" rx="60" ry="22" fill="%23F59E0B"/>
    <ellipse cx="530" cy="275" rx="45" ry="18" fill="%23FFFFFF"/>
    <ellipse cx="380" cy="110" rx="70" ry="30" fill="%231E293B"/>
    <rect x="30" y="30" width="220" height="42" rx="10" fill="%23DC2626"/>
    <text x="140" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">GARBAGE OVERFLOW</text>
  </svg>`,

  garbageAfter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <rect width="800" height="450" fill="%23F1F5F9"/>
    <rect x="0" y="240" width="800" height="210" fill="%2364748B"/>
    <!-- Curb Bleached Clean with Lime powder -->
    <rect x="0" y="225" width="800" height="25" fill="%23CBD5E1"/>
    <line x1="0" y1="237" x2="800" y2="237" stroke="%23FFFFFF" stroke-width="6" stroke-dasharray="15 10"/>
    <!-- Sanitized Closed Dumpster -->
    <rect x="280" y="120" width="240" height="160" rx="8" fill="%2316A34A"/>
    <rect x="270" y="110" width="260" height="20" rx="5" fill="%2315803D"/>
    <!-- Verified Badge -->
    <rect x="30" y="30" width="240" height="42" rx="10" fill="%23167A4D"/>
    <text x="150" y="56" fill="%23FFFFFF" font-family="sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">SANITIZED & SWEPT</text>
    <circle cx="720" cy="60" r="26" fill="%23167A4D" stroke="%23FFFFFF" stroke-width="3"/>
    <path d="M 710,60 L 717,67 L 732,52" stroke="%23FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`
};
