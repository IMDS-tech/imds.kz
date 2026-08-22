# Business Hero Layout and WebGL Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance the IMDS business homepage hero across wide desktop sizes and restore a real lightweight WebGL scene without changing product routing or backend behavior.

**Architecture:** Keep the current business-premium page structure. Replace the CSS-only hero visual with a dedicated client-side `BusinessHeroScene` that owns a lightweight WebGL particle/depth field while the IMDS SVG mark remains a DOM overlay inside the same scene. Use a dedicated wide hero container and controlled heading lines to make layout deterministic from 1280 through 2560px.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, native WebGL 1, CSS, Playwright, Vitest.

**Spec:** User-approved business-premium homepage direction plus PR #14 regression contract.

## Global Constraints

- Do not add Cloudflare, Supabase or external hosted rendering services.
- Preserve `/products/<slug>` routing for all seven product cards.
- Preserve contact backend, PostgreSQL, DNS, Nginx, Mailcow, MIS and BELES runtimes.
- Use `/imds-brand-mark.svg` in the hero.
- Reduced-motion must disable continuous animation while leaving content usable.
- Mobile must use fewer particles and capped device pixel ratio.

---

### Task 1: Restore real WebGL in the business hero

**Files:**
- Create: `src/components/business/BusinessHeroScene.tsx`
- Modify: `src/components/home/Home.tsx`
- Test: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Produces: `BusinessHeroScene(): JSX.Element`
- DOM contract: `[data-testid="business-webgl"]`, `data-webgl="ready|fallback"`

- [x] **Step 1: Write the failing regression test**

The test already exists in PR #14 and requires the hero marker, WebGL canvas and `data-webgl="ready"`.

- [x] **Step 2: Run CI and verify RED**

Observed Playwright failure: `[data-business-hero]` does not exist; 10 tests passed, 2 regression instances failed.

- [ ] **Step 3: Implement the lightweight WebGL scene**

Create a client component using native WebGL with compiled vertex/fragment shaders, bounded particles, pointer parallax, resize handling, reduced-motion handling and explicit fallback state.

- [ ] **Step 4: Mount the scene inside the hero**

Replace the CSS-only orbit stack with `BusinessHeroScene` while keeping `/imds-brand-mark.svg` visually integrated as a DOM overlay.

- [ ] **Step 5: Run full CI and verify GREEN**

Expected: prohibited scan, lint, typecheck, 14 unit tests, build, Playwright and container build all pass.

### Task 2: Fix wide-desktop hero composition

**Files:**
- Modify: `src/components/home/Home.tsx`
- Modify: `src/styles/business-home.css`
- Test: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- DOM contract: `[data-business-hero]`, exactly two `[data-hero-line]` elements.

- [ ] **Step 1: Add controlled heading lines**

Render two block spans inside H1:
- `Не набор сервисов.`
- `Одна живая система.`

- [ ] **Step 2: Add a dedicated wide hero container**

Use a max width around 1660px and viewport padding independent of global `--max:1240px`.

- [ ] **Step 3: Normalize hero typography and height**

Keep desktop hero below 900px at 2048×1330, heading below 260px high and above 620px wide.

- [ ] **Step 4: Verify responsive breakpoints**

Check 2560, 2048, 1920, 1440, 1280, tablet and 390px mobile behavior through CSS breakpoints and Playwright.

### Task 3: Improve product grid readability without changing routing

**Files:**
- Modify: `src/styles/business-home.css`
- Test: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Existing `[data-business-product-card]` remains seven links.

- [ ] **Step 1: Replace seven-column desktop grid**

Use four columns on wide desktop, then 3/2/1 across narrower breakpoints.

- [ ] **Step 2: Preserve product links**

BELES remains `/products/beles`, MIS remains `/products/mis`, all others `/products/<slug>`.

- [ ] **Step 3: Re-run E2E routing checks**

Expected: seven product cards and existing routing assertions pass.

### Task 4: Merge, deploy and verify production

**Files:**
- Modify after website merge: `IMDS-tech/mis/.github/workflows/redeploy-imds-kz-product-links.yml`

- [ ] **Step 1: Merge website PR after all checks are green**
- [ ] **Step 2: Wait for immutable GHCR image for merge SHA**
- [ ] **Step 3: Update only `WEBSITE_IMAGE` and obsolete hero smoke checks in the deploy workflow**
- [ ] **Step 4: Run read-only preflight PR**
- [ ] **Step 5: Merge deploy PR and let push-run replace only `imds-public-website`**
- [ ] **Step 6: Independently verify exact image SHA, health, business hero marker, WebGL marker, IMDS brand mark, seven product cards, BELES/MIS hrefs, platform section and final CTA**
