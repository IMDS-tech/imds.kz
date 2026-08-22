# IMDS Full-Page Cinematic 3D Design

## Goal
Transform the `imds.kz` homepage from a conventional sectioned landing page into one continuous cinematic product story inspired by high-end interactive studio sites, while preserving IMDS branding, accessibility, product navigation, and production reliability.

## Approved Direction
The experience follows the approved dynamic direction: a bright entry transitions into a dark immersive 3D world, then returns to a lighter final conversion scene.

The site must feel like one continuous scene rather than a stack of unrelated rectangular sections.

## Experience Architecture

### 1. Full-page scene layer
A fixed, viewport-sized native WebGL canvas sits behind the homepage content and remains mounted throughout the scroll journey.

It owns:
- central IMDS core;
- orbital rings;
- product nodes;
- connection beams;
- particles and depth haze;
- scene transforms tied to document scroll progress;
- pointer-reactive parallax;
- light intensity and environment changes across chapters.

The scene is decorative and never replaces semantic HTML content. The implementation extends the native WebGL runtime already proven in production instead of introducing a large new 3D dependency stack.

### 2. Scroll chapters
The homepage becomes six semantic chapters:
1. **Origin / Hero** — IMDS core and headline.
2. **Dive** — scene dives through the core into the ecosystem.
3. **Product constellation** — seven product nodes become the visual focus.
4. **Product spotlight** — BELES and MIS are highlighted; the remaining products retain product-detail links.
5. **Platform network** — shared identity, contracts, data boundaries and integrations are visualized as connected infrastructure.
6. **Final orbit** — scene pulls back to the full ecosystem and returns the foreground to a lighter conversion surface.

Each chapter remains normal accessible HTML in the document flow. Visual animation is progressive enhancement.

### 3. Product behavior
All seven existing product cards continue to link to `/products/<slug>`.

Live application URLs are not moved into product cards. BELES and MIS keep their existing live-product CTA behavior on their detail pages.

Product logos remain the existing approved PNG assets.

### 4. Motion
Desktop:
- scroll-driven 3D scene interpolation;
- slow orbital motion;
- pointer parallax;
- glow and depth response;
- 3D card tilt and floating logos.

Mobile:
- reduced particle count;
- simpler scene transforms;
- shallower pointer/tilt effects.

`prefers-reduced-motion: reduce`:
- freezes scroll choreography at stable compositions;
- disables continuous orbital movement and floating effects;
- leaves all text and navigation fully usable.

### 5. Visual language
- IMDS deep navy / near-black cinematic background through the middle journey;
- cyan, teal and restrained electric-blue light accents;
- luminous product nodes using product accents;
- subtle glass surfaces only for content legibility;
- light opening and closing sections so the experience retains IMDS corporate identity instead of becoming a permanently dark gaming interface.

### 6. Performance constraints
- Use the existing native WebGL approach already in production.
- Device pixel ratio is capped at 2.
- No post-processing dependency stack.
- Particle/node complexity is bounded and lowered on small screens.
- Semantic content renders without waiting for WebGL.
- If WebGL fails, the CSS background and content remain usable.

### 7. Technical stack
- Next.js 16.3.1 / React 19.2.8 (existing)
- native WebGL API through the existing client component pattern
- native scroll/pointer listeners with requestAnimationFrame batching
- CSS transforms and transitions for DOM depth effects

No new hosted service or external rendering runtime is introduced.

## Components
- `src/components/cinematic/CinematicExperience.tsx` — fixed canvas, scroll progress, reduced-motion/pointer state and DOM scene overlays.
- `src/components/home/Home.tsx` — semantic six-chapter homepage markup and existing product links.
- `src/app/globals.css` — chapter layout, visual transitions, glass layers, 3D card states and responsive/reduced-motion rules.

## Testing
E2E must prove:
- a full-page cinematic scene container is present;
- six cinematic chapters render;
- seven product cards remain navigable to product detail pages;
- BELES and MIS navigation contracts remain unchanged;
- mobile navigation still works;
- reduced-motion mode does not hide content.

CI must continue to pass prohibited-provider scan, lint, typecheck, unit tests, production build, Playwright and container build.

## Production rollout
Use the existing immutable GHCR image workflow and deploy only `imds-public-website`. Do not modify DNS, Nginx, PostgreSQL, mail, MIS runtime, or other IMDS services.