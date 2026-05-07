# Personal Site — Claude Context

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with custom color palette (navy/gold/teal)
- **Framer Motion** for scroll-triggered animations
- **@react-three/fiber + Three.js** for 3D elements
- **FBXLoader** for Koenigsegg model
- **Web Audio API** for engine sound synthesis

## Dev server
```
cd /Users/Aarya/Desktop/Personal_site
npm run dev
```
Opens on `http://localhost:3000` (or 3001 if 3000 is taken).

## Project structure
```
app/
  layout.tsx       — fonts (Inter, Playfair Display, JetBrains Mono)
  page.tsx         — assembles all sections; KoenigseggIntro loaded dynamically (ssr:false)
  globals.css      — custom scrollbar, .glass, .glass-hover, gradient-text utilities

components/
  KoenigseggIntro.tsx   — 3D Koenigsegg intro animation (see below)
  Hero.tsx              — typewriter roles, counter stats, headshot
  ParticleField.tsx     — 120-node particle graph + DNA helix + floating icosahedra
  Nav.tsx
  Research.tsx          — 3D tilt cards; MITRE has pulsing red "Classified" badge
  Publications.tsx
  Experience.tsx        — vertical timeline; MITRE as "Chemistry Research Intern (Classified)"
  Awards.tsx            — Startups @ Spring: 1st of 800+ internationally, $8K
  Service.tsx
  Athletics.tsx
  Contact.tsx
  SectionHeader.tsx

public/
  headshot.png
  koenigsegg/
    final_Model.fbx   (19 MB)
    *.png             (50 PBR texture files)
```

## KoenigseggIntro animation
File: `components/KoenigseggIntro.tsx`

### Timing
| Constant | Value | Meaning |
|---|---|---|
| IDLE_END | 3.0 s | Car sits front-facing, idle rock |
| TRANSITION_END | 7.0 s | Camera lifts to birds-eye, car shrinks + orbit begins |
| ORBIT_END | 12.0 s | Full orbit; then fade out |

### Orbit geometry
- Orbit center: `ORBIT_CX=3.5, ORBIT_CZ=0` (right column = pfp area in world space)
- `ORBIT_RADIUS=3.2`, `ORBIT_SPEED=1.3 rad/s` (clockwise from above)
- Car starts at leftmost orbit point: `START_X = ORBIT_CX - ORBIT_RADIUS ≈ 0.3`

### Key math
```ts
// CRITICAL: use time since orbit started, not total elapsed
const orbitTime  = Math.max(0, elapsed - IDLE_END);
const orbitAngle = Math.PI - orbitTime * ORBIT_SPEED;  // clockwise

// Seamless facing: at orbitTime=0 equals 0 (= front-facing, same as idle)
const facingY = inIdle ? 0 : (2 * Math.PI - orbitTime * ORBIT_SPEED) % (2 * Math.PI);
```

### Camera keyframes
```ts
CAM_FRONT     = (0, 1.8, 9)
CAM_BIRDS_EYE = (3.5, 15, 0)
LOOK_FRONT    = (START_X, 1.0, 0)
LOOK_ORBIT    = (ORBIT_CX, 0, ORBIT_CZ)
```
Interpolated with `easeInOut` during transition phase.

### Scale
`SCALE_BIG=1.0 → SCALE_SMALL=0.27` (multiplied on top of auto-normalised baseScale).

### Audio
Web Audio API: sawtooth (55 Hz) + square harmonic + lowpass filter (650 Hz). RPM ramps up during orbit.

## Known issues / things to verify
- **Car front-facing on idle**: `rotation.y = 0` during idle. If the model still shows rear, try `rotation.y = Math.PI`.
- **Orbit center**: `ORBIT_CX=3.5` targets the pfp. Adjust if it looks off on your screen.
- **Canvas transparency**: `gl={{ alpha: true }}` + `onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}` — no black box behind car.

## Deployment
`netlify.toml` is present. Run:
```
npm install @netlify/plugin-nextjs
```
Then push to GitHub and connect to Netlify. Build command: `npm run build`, publish dir: `.next`.

## Owner
**Aaryasinh Vaghela** — Valedictorian, Stanford & Harvard researcher, USPTO patent holder, UN speaker.
