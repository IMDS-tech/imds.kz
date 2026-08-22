# Full-Page Cinematic 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the `imds.kz` homepage into a continuous full-page cinematic 3D experience with scroll-driven scene choreography while preserving accessibility, product navigation, performance fallbacks, and production deployment safety.

**Architecture:** A fixed client-side native WebGL scene persists behind six semantic homepage chapters. Scroll progress drives scene transforms and visual intensity; DOM chapters remain fully functional without WebGL and receive lightweight CSS depth/presentation effects. The implementation extends the already-proven production WebGL approach and adds no large 3D dependency stack.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, native WebGL, CSS transforms, Playwright, Vitest.

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

- [x] **Step 1: Write the failing E2E contract**

Require the homepage to render one cinematic scene, six chapters, and seven 3D product cards while retaining BELES/MIS links.

- [x] **Step 2: Run CI and verify RED**

Observed: all checks through build passed; Playwright failed because the cinematic scene/chapter contract did not exist yet.

- [x] **Step 3: Commit the failing test**

### Task 2: Add the full-page scene runtime

**Files:**
- Create: `src/components/cinematic/CinematicExperience.tsx`

**Interfaces:**
- Produces: `<CinematicExperience />` with a fixed full-viewport WebGL canvas, deterministic scroll progress, pointer parallax and fallback behavior.

- [x] **Step 1: Implement `CinematicExperience`**

The canvas exposes `data-testid="cinematic-scene"`, reads document scroll progress, caps DPR, detects reduced motion and small screens, uses bounded particle counts, and leaves a CSS fallback if WebGL is unavailable.

- [x] **Step 2: Implement scene choreography**

Use native shaders for depth particles and DOM overlays for the IMDS core, orbital rings and seven product/network nodes. Scroll progress drives composition changes without a post-processing stack.

### Task 3: Recompose the homepage into six cinematic chapters

**Files:**
- Modify: `src/components/home/Home.tsx`
- Modify: `src/app/globals.css`
- Create: `src/styles/cinematic.css`

**Interfaces:**
- Consumes: `<CinematicExperience />`, existing product definitions and existing links.
- Produces: six semantic chapter sections with `data-cinematic-chapter`.

- [x] **Step 1: Replace the old standalone hero visual**

Mount the fixed cinematic experience once at the homepage root and keep the content layer above it.

- [x] **Step 2: Add six chapters**

Implement Origin, Dive, Product Constellation, Product Spotlight, Platform Network, and Final Orbit. Preserve existing CTA targets and product detail routing.

- [x] **Step 3: Add cinematic CSS**

Create full-viewport chapter spacing, dark middle journey, light entry/final surfaces, glass content plates, z-depth card transforms, product spotlight treatments, responsive layouts and reduced-motion overrides.

- [ ] **Step 4: Run full CI and verify GREEN**

Expected: prohibited-provider scan, lint, typecheck, unit tests, production build, Playwright and container build all PASS.

### Task 4: Production verification and rollout

**Files:**
- Modify: existing deployment workflow in `IMDS-tech/mis` only to point at the new immutable image and add read-only/full-page smoke assertions.

**Interfaces:**
- Consumes: immutable `ghcr.io/imds-tech/imds.kz:<merge-sha>`.
- Produces: verified production homepage with the exact image and six chapter markers.

- [ ] **Step 1: Merge website PR**

Only after all required checks are green.

- [ ] **Step 2: Publish immutable image**

Wait until GHCR manifest exists for the website merge SHA.

- [ ] **Step 3: Run read-only deploy preflight**

Verify SSH, Nginx, current health and image availability without mutating production.

- [ ] **Step 4: Redeploy only `imds-public-website`**

Replace the container, wait for health, preserve existing Nginx/TLS and all existing logo/BIMI smoke checks.

- [ ] **Step 5: Run independent production verification**

Assert exact image, `/api/health`, `cinematic-scene`, six `data-cinematic-chapter` markers and seven `data-3d-card="true"` elements. Close diagnostic PR without merge.