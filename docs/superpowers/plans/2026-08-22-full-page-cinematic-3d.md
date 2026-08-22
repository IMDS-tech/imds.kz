# Full-Page Cinematic 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the `imds.kz` homepage into a continuous full-page cinematic 3D experience with scroll-driven camera choreography while preserving accessibility, product navigation, performance fallbacks, and production deployment safety.

**Architecture:** A fixed client-side React Three Fiber scene persists behind six semantic homepage chapters. Scroll progress drives camera and light interpolation; product nodes use the existing product definitions. DOM chapters remain fully functional without WebGL and receive lightweight CSS/GSAP presentation effects.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, three, @react-three/fiber, @react-three/drei, gsap, Playwright, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-22-full-page-cinematic-3d-design.md`

## Global Constraints

- Preserve all existing product routes and live app URLs.
- Do not introduce Cloudflare or Supabase.
- Do not modify DNS, Nginx, PostgreSQL, mail, MIS runtime, or other services.
- WebGL must be progressive enhancement; semantic HTML must remain usable without it.
- Respect `prefers-reduced-motion` and keep mobile scene complexity lower than desktop.
- Production rollout replaces only the `imds-public-website` container with an immutable GHCR image.

---

### Task 1: Lock the cinematic homepage contract

**Files:**
- Modify: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: current `/`, `/products/*`, and mobile navigation.
- Produces: stable selectors `data-testid="cinematic-scene"`, `data-cinematic-chapter`, and `data-3d-card="true"`.

- [ ] **Step 1: Write the failing E2E contract**

Require the homepage to render one cinematic scene, six chapters, and seven 3D product cards while retaining BELES/MIS links.

- [ ] **Step 2: Run CI and verify RED**

Expected: Playwright fails because `cinematic-scene` and six chapter markers do not yet exist.

- [ ] **Step 3: Commit the failing test**

### Task 2: Add the scene runtime dependencies and components

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/cinematic/CinematicExperience.tsx`
- Create: `src/components/cinematic/CinematicScene.tsx`
- Create: `src/components/cinematic/ProductConstellation.tsx`

**Interfaces:**
- Consumes: `products` from `src/content/products.ts`.
- Produces: `<CinematicExperience />` with a fixed scene and deterministic scroll progress.

- [ ] **Step 1: Add pinned dependencies**

Add `three`, `@react-three/fiber`, `@react-three/drei`, and `gsap` using versions compatible with React 19 and the current Next.js runtime.

- [ ] **Step 2: Implement `CinematicExperience`**

It must dynamically mount the canvas client-side, expose `data-testid="cinematic-scene"`, read document scroll progress, cap DPR, detect reduced motion and small screens, and gracefully fall back if WebGL is unavailable.

- [ ] **Step 3: Implement `CinematicScene`**

Create a camera path, IMDS core, orbital rings, depth particles, product nodes, connection lines, and scroll-dependent light/background transitions. No post-processing package.

- [ ] **Step 4: Implement `ProductConstellation`**

Map exactly seven existing products into stable 3D node positions and use their existing accent colors.

- [ ] **Step 5: Run lint/typecheck/build**

Expected: PASS before integrating into the homepage.

### Task 3: Recompose the homepage into six cinematic chapters

**Files:**
- Modify: `src/components/home/Home.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `<CinematicExperience />`, existing product definitions, existing links.
- Produces: six semantic chapter sections with `data-cinematic-chapter`.

- [ ] **Step 1: Replace the old standalone hero visual**

Mount the fixed cinematic experience once at the homepage root and keep the content layer above it.

- [ ] **Step 2: Add six chapters**

Implement Origin, Dive, Product Constellation, Product Spotlight, Platform Network, and Final Orbit. Preserve existing CTA targets and product detail routing.

- [ ] **Step 3: Add cinematic CSS**

Create full-viewport chapter spacing, dark middle journey, light entry/final surfaces, glass content plates, z-depth card transforms, sticky chapter cues, responsive layouts and reduced-motion overrides.

- [ ] **Step 4: Run Playwright**

Expected: the new E2E contract turns GREEN and existing public journey tests remain green.

### Task 4: Production verification and rollout

**Files:**
- Modify: existing deployment workflow in `IMDS-tech/mis` only to point at the new immutable image and add read-only/full-page smoke assertions.

**Interfaces:**
- Consumes: immutable `ghcr.io/imds-tech/imds.kz:<merge-sha>`.
- Produces: verified production homepage with the exact image and six chapter markers.

- [ ] **Step 1: Run full `imds.kz` CI**

Expected: prohibited-provider scan, lint, typecheck, unit tests, production build, Playwright, container build all PASS.

- [ ] **Step 2: Merge website PR**

Only after all required checks are green.

- [ ] **Step 3: Publish immutable image**

Wait until GHCR manifest exists for the website merge SHA.

- [ ] **Step 4: Run read-only deploy preflight**

Verify SSH, Nginx, current health and image availability without mutating production.

- [ ] **Step 5: Redeploy only `imds-public-website`**

Replace the container, wait for health, preserve existing Nginx/TLS and all existing logo/BIMI smoke checks.

- [ ] **Step 6: Run independent production verification**

Assert exact image, `/api/health`, `cinematic-scene`, six `data-cinematic-chapter` markers and seven `data-3d-card="true"` elements. Close diagnostic PR without merge.