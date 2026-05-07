# Aaryasinh Vaghela — Personal Site

Personal portfolio site for Aaryasinh Vaghela: Valedictorian, Stanford & Harvard researcher, USPTO patent holder, and UN speaker.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — custom navy/gold/teal palette
- **Framer Motion** — scroll-triggered animations
- **React Three Fiber + Three.js** — 3D Earth globe intro, particle field
- **Web Audio API** — procedural engine sound

## Getting Started

```bash
npm install
npm run dev
```

Opens on [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build   # production build
npm start       # serve production build locally
```

Deployed via Netlify. Config in `netlify.toml`.

## Project Structure

```
app/
  layout.tsx        # fonts, metadata
  page.tsx          # root page, assembles all sections
  globals.css       # scrollbar, glass utilities, gradient text

components/
  KoenigseggIntro   # procedural 3D Earth globe intro animation
  Hero              # name, typewriter roles, headshot, stats
  ParticleField     # 120-node particle graph background
  Nav               # navigation
  Research          # 3D tilt cards with MITRE classified badge
  Publications      # peer-reviewed publications
  Experience        # vertical timeline
  Awards            # competition wins
  Service           # volunteer / service work
  Athletics         # sports
  Contact           # contact form

public/
  headshot.png
```
