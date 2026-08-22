# IMDS Industry Site Replacement Design

## Goal
Replace the current public homepage presentation with the user-supplied `Industry.zip` website design while preserving the production Next.js application architecture, product detail routes, contact/API behavior, self-hosted constraints, and controlled deployment path.

## Source of truth
The approved visual source is the uploaded Industry package, primarily:
- `IMDS Homepage.html`
- `hero-scene.js`
- `assets/imds-brand-mark.png`
- the responsive styles embedded in `IMDS Homepage.html`

The current `IMDS-tech/imds.kz` repository remains the runtime source of truth for application routing and backend behavior.

## Chosen approach
Port the supplied static homepage into the existing Next.js application instead of replacing Next.js with a static HTML deployment.

This preserves:
- `/products/*` product detail routes;
- `/contact` and `/api/contact`;
- `/api/health`;
- privacy, terms, security, blog, platform and discovery routes;
- current Docker/GHCR deployment contract;
- existing product metadata and live-application CTA rules.

## Visual contract
The homepage should match the supplied site as closely as practical:
- near-black navy background;
- clean business typography with mono eyebrow labels;
- sticky translucent header;
- two-column hero;
- two-layer real WebGL particle/orbit scene;
- IMDS mark integrated into the WebGL scene and pointer tilt;
- compact metrics below hero copy;
- bordered proof strip;
- seven compact product cards;
- 3D platform stack;
- four-value `Почему IMDS` grid;
- strong final CTA;
- responsive mobile navigation and layouts.

The supplied visual spacing, proportions, color balance and restrained business-tech motion are the reference. Do not reintroduce the previous oversized cinematic typography or full-page cinematic scroll experience.

## WebGL
Adapt `hero-scene.js` into a React client component with no external rendering dependency.

Required behavior:
- two canvases: back and front layers;
- dots with perspective/depth;
- line-orbit geometry on the back layer;
- pointer-reactive camera/mark tilt;
- mobile particle reduction;
- DPR cap;
- `prefers-reduced-motion` renders a static frame;
- canvas exposes a stable `data-webgl="ready"` state after successful initialization;
- cleanup removes listeners, RAF and GL resources.

## Content safety / factual corrections
Do not copy unsupported claims from the supplied static mockup.

Specifically:
- remove invented customer/company names from the proof bar;
- do not claim `Поддержка 24/7` unless independently established;
- replace `Масштабируемая облачная архитектура` with accurate self-hosted wording;
- do not claim certifications, customer counts or unsupported adoption metrics.

Use factual proof items already established in the current site:
- Self-hosted;
- PostgreSQL;
- Unified SSO;
- API-first;
- GitHub CI/CD.

For `Почему IMDS`, use grounded values:
- Единая экосистема;
- Контроль данных;
- Гибкая интеграция;
- Масштабирование.

## Product routing
Homepage cards must use current `productCardHref(product)` behavior and stay internal:
- BELES -> `/products/beles`
- MIS -> `/products/mis`
- Resto -> `/products/resto`
- Omnichannel -> `/products/omnichannel`
- Analytics -> `/products/analytics`
- AI -> `/products/ai`
- Finance -> `/products/finance`

Live application CTAs remain only on detail pages where currently configured.

## Assets
Use the uploaded IMDS visual as the hero mark where needed, but retain the existing canonical public brand assets required elsewhere by production smoke/BIMI checks.

No font binaries are added. Typography must use CSS/system/web-safe fallbacks or the current app font strategy; do not create a new externally hosted infrastructure dependency for fonts.

## Header and footer
Restyle the existing Next.js header/mobile navigation to match the supplied homepage rather than embedding a second static header. Preserve current navigation destinations from `siteConfig`.

Keep the existing site footer route coverage, but visually align it with the new dark homepage. The homepage can include the compact `© 2026 IMDS TECH / imds.kz` treatment as part of the global footer if it does not remove existing legal/navigation access.

## Responsive behavior
Verify at minimum:
- 2560x1440
- 2048x1152
- 1920x1080
- 1440x900
- 1280x800
- tablet
- 390x844

Hero copy must not become oversized or wrap erratically. Product cards must remain readable: seven columns only where sufficient width exists, degrading to 4/3/2/1 columns as needed.

## Accessibility
- one H1;
- semantic H2 section headings;
- keyboard-focus states;
- accessible mobile menu button with `aria-expanded`;
- decorative WebGL and brand effects `aria-hidden`;
- all content remains usable without WebGL;
- reduced-motion support.

## Performance
- no Three.js/R3F/hosted renderer;
- native WebGL only;
- mobile particle reduction and DPR cap;
- no loader screen;
- no audio;
- no additional external infrastructure service.

## Architecture constraints
Forbidden:
- Cloudflare;
- Supabase.

External infrastructure remains limited to GitHub/GitHub Actions/GHCR. Runtime stays self-hosted.

## Files expected to change
- `src/components/home/Home.tsx`
- `src/components/business/BusinessHeroScene.tsx`
- `src/components/site/Header.tsx`
- `src/components/site/MobileNav.tsx`
- `src/components/site/Footer.tsx` if needed for visual alignment
- `src/styles/business-home.css`
- `tests/e2e/public-site.spec.ts`
- uploaded visual asset copied under `public/` only if it materially improves fidelity and does not replace required canonical assets.

## Definition of done
1. New regression E2E contract fails against the previous implementation.
2. Homepage matches the supplied Industry design structure and visual hierarchy.
3. Real two-layer WebGL reaches ready state in browser.
4. Seven product cards and internal routes are preserved.
5. Mobile navigation still works.
6. Prohibited-provider scan, lint, typecheck, unit tests, production build, Playwright and container build all pass.
7. Site PR merges only after GREEN.
8. Immutable GHCR image is deployed through the existing `IMDS-tech/mis` workflow without changing DNS/Nginx/PostgreSQL.
9. Independent read-only server verification confirms exact image and HTML markers.
10. Independent browser verification confirms live WebGL and responsive layout before completion is claimed.