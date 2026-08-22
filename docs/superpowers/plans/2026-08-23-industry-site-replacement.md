# IMDS Industry Site Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the user-approved `Industry.zip` homepage into the existing Next.js public site while retaining existing routes, APIs, product metadata, deployment safety and self-hosted architecture.

**Architecture:** Keep Next.js as the application shell. Rebuild the homepage markup/styles to match `IMDS Homepage.html`, adapt `hero-scene.js` into a React client component with two native WebGL canvases, and reuse current product/link configuration for routing. Existing non-home routes and APIs remain untouched.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, native WebGL 1, Playwright, Vitest, Docker/GHCR.

**Spec:** `docs/superpowers/specs/2026-08-23-industry-site-replacement-design.md`

## Global Constraints

- Do not add Cloudflare or Supabase.
- No external hosted renderer or new runtime infrastructure dependency.
- Preserve `/products/*`, `/contact`, `/api/contact`, `/api/health` and legal/discovery routes.
- Homepage product cards must route internally with `productCardHref(product)`.
- Do not copy unsupported customer names, `24/7` support, cloud-architecture or certification claims from the static mockup.
- Keep current canonical brand/BIMI assets intact.
- Use native WebGL with mobile particle reduction, DPR cap and reduced-motion support.

---

### Task 1: Lock the Industry homepage regression contract

**Files:**
- Modify: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Consumes: current homepage route `/`.
- Produces: stable DOM contract used by Tasks 2–5: `data-industry-home`, `data-industry-hero`, two `business-webgl` canvases, `data-industry-product-card`, `data-platform-plane`, `data-industry-value`, `data-final-cta`.

- [ ] **Step 1: Write the failing test**

Add a Playwright test that requires:
- `[data-industry-home]` and `[data-industry-hero]`;
- two canvases under the hero, each reaching `data-webgl="ready"`;
- exactly two controlled hero lines;
- seven product cards;
- three platform planes;
- four grounded value cards;
- final CTA;
- BELES `/products/beles` and MIS `/products/mis`;
- at 2048×1152 hero height below 780px and H1 height below 170px;
- mobile menu opens at 390×844.

- [ ] **Step 2: Run test to verify it fails**

Run through the existing `Public Website CI` workflow after the test-only commit.
Expected: Playwright FAIL because `data-industry-home` and the second WebGL canvas do not exist yet, while lint/typecheck/unit/build remain green.

- [ ] **Step 3: Commit**

Commit message: `test: lock Industry homepage replacement contract`.

### Task 2: Port the two-layer Industry WebGL hero

**Files:**
- Modify: `src/components/business/BusinessHeroScene.tsx`

**Interfaces:**
- Consumes: hero container dimensions and pointer events.
- Produces: two canvases (`back` and `front`), both `data-testid="business-webgl"`, `data-webgl` readiness, IMDS mark tilt, static reduced-motion frame.

- [ ] **Step 1: Implement the portable scene**

Translate the approved `hero-scene.js` geometry/shaders into TypeScript inside the client component:
- point vertex shader with perspective and pointer rotation;
- dot fragment shader;
- line fragment shader;
- spherical point fields;
- seven back-layer rings and orbit points;
- mobile counts back/front = 90/26; desktop = 260/70;
- DPR cap mobile 1.25, desktop 2;
- additive blending;
- pointer target normalized to the hero scene;
- mark transform callback;
- visibility and resize handling;
- full RAF/listener/GL cleanup.

- [ ] **Step 2: Verify TypeScript/build in CI**

Expected: lint, typecheck and Next.js build PASS.

- [ ] **Step 3: Commit**

Commit message: `feat: port Industry two-layer WebGL hero`.

### Task 3: Replace homepage structure with approved Industry layout

**Files:**
- Modify: `src/components/home/Home.tsx`

**Interfaces:**
- Consumes: `products`, `productCardHref`, `BusinessHeroScene`.
- Produces: approved hero/proof/products/platform/why/final-CTA section hierarchy and the Task 1 DOM markers.

- [ ] **Step 1: Replace homepage markup**

Build these sections in this order:
1. hero with eyebrow, two-line H1, lead, two CTA buttons and three metrics;
2. proof strip with factual items `Self-hosted`, `PostgreSQL`, `Unified SSO`, `API-first`, `GitHub CI/CD`;
3. products section with all seven current products and internal detail links;
4. platform card with three stacked planes and factual features: unified SSO/access, self-hosted runtime, isolated data ownership/PostgreSQL, API contracts/integrations, controlled CI/CD, scalable product composition;
5. four-value section: `Единая экосистема`, `Контроль данных`, `Гибкая интеграция`, `Масштабирование`;
6. final CTA to `/contact`.

Do not embed a duplicate static header or footer.

- [ ] **Step 2: Verify product route contract**

Expected: seven cards, first `/products/beles`, second `/products/mis`; product detail tests remain green.

- [ ] **Step 3: Commit**

Commit message: `feat: replace homepage with approved Industry layout`.

### Task 4: Port the approved visual system and responsive proportions

**Files:**
- Modify: `src/styles/business-home.css`
- Modify: `src/components/site/Header.tsx`
- Modify: `src/components/site/MobileNav.tsx`
- Modify: `src/components/site/Footer.tsx` only if required for visual consistency.

**Interfaces:**
- Consumes: Task 3 class names/markers.
- Produces: visual parity with the supplied static design across target desktop/mobile widths.

- [ ] **Step 1: Replace homepage-specific CSS**

Use the supplied design tokens and proportions:
- `--navy:#040a0e`, `--panel:#0a1a20`, `--panel-2:#0d2029`, `--teal:#12b39a`, `--teal-2:#0d8f7c`, `--cyan:#3ee0d4`, `--fg:#eaf6f4`, muted tones and `--shell:min(1520px,92vw)`;
- hero grid `.84fr / 1.16fr` with compact 36–58px H1;
- scene aspect ratio ~1.12/1 and 640px desktop cap;
- 7-column products above 1400px, then 4/3/2/1;
- platform `.85fr / 1.15fr`;
- why `.78fr / 2.22fr` and four columns, degrading to 2/1;
- sticky translucent header;
- restrained borders, gradients and teal/cyan glow;
- explicit focus-visible states;
- reduced-motion rule.

- [ ] **Step 2: Align header/mobile/footer**

Keep `siteConfig` destinations and accessible navigation while matching the supplied compact dark header. Keep legal/footer links available.

- [ ] **Step 3: Commit**

Commit message: `style: match approved Industry homepage system`.

### Task 5: Full verification, PR and controlled production deployment

**Files:**
- Modify only if required by new smoke markers: `IMDS-tech/mis/.github/workflows/redeploy-imds-kz-product-links.yml`

**Interfaces:**
- Consumes: merged immutable website image.
- Produces: production deployment of only `imds-public-website` and independent verification evidence.

- [ ] **Step 1: Run complete website CI**

Required commands/workflow stages:
- `node scripts/check-prohibited-dependencies.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- `npm run test:e2e`
- container build

Expected: all PASS.

- [ ] **Step 2: Merge website PR after GREEN**

Use the checked head SHA. Wait until the immutable GHCR image for the merged commit exists.

- [ ] **Step 3: Update deployment image and smoke markers**

In `IMDS-tech/mis`, update only `WEBSITE_IMAGE` plus homepage smoke assertions that changed from the previous implementation. PR run must remain read-only; push run replaces only `imds-public-website`. Do not change DNS, Nginx, PostgreSQL or other workloads.

- [ ] **Step 4: Independent server verification**

Confirm exact running image, `/api/health`, `data-industry-home`, `data-industry-hero`, two WebGL canvases in HTML, seven product cards, three platform planes, four value cards, final CTA, BELES/MIS links.

- [ ] **Step 5: Independent browser verification**

Open live `https://imds.kz` with Chromium at 2048×1152 and 390×844. Confirm both canvases reach `data-webgl="ready"`, desktop hero/H1 geometry remains bounded, seven cards render and mobile navigation opens.

- [ ] **Step 6: Close diagnostic verification PRs without merge**

Report completion only after both server and browser verification PASS.