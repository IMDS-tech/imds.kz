# IMDS Business Premium Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current cinematic homepage with the approved high-contrast business-premium IMDS landing page while preserving product routing and current backend behavior.

**Architecture:** Keep the existing Next.js app and product content model. Replace only homepage composition and homepage-specific styles, reuse existing IMDS/product assets, and update the header brand lockup. Remove the homepage dependency on the full-page cinematic scene while keeping other pages untouched.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript, CSS, Next Image, Playwright, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-22-business-premium-home-design.md`

## Global Constraints
- No Cloudflare or Supabase dependencies.
- Product cards continue to route to `/products/<slug>`.
- BELES/MIS live URLs remain on product detail pages only.
- No fake customer logos, adoption counts, certifications or support claims.
- Existing product logo assets remain unchanged.
- Reduced-motion users must not receive continuous decorative movement.

---

### Task 1: Lock the new homepage contract

**Files:**
- Modify: `tests/e2e/public-site.spec.ts`

**Interfaces:**
- Produces: E2E contract for business hero, proof bar, seven product cards, platform stack, why-IMDS cards and final CTA.

- [ ] **Step 1: Write the failing test**
  Assert the homepage has `[data-business-home]`, heading `Не набор сервисов. Одна живая система.`, `[data-proof-bar]`, seven `[data-business-product-card]`, four `[data-platform-layer]`, four `[data-business-value]`, and `/contact` CTA.
- [ ] **Step 2: Run CI and verify RED**
  Expected: Playwright fails because the new business homepage markers do not exist.
- [ ] **Step 3: Commit the RED test**
  Commit message: `test: require business premium homepage`.

### Task 2: Build the homepage and header

**Files:**
- Modify: `src/components/home/Home.tsx`
- Modify: `src/components/site/Header.tsx`
- Create: `src/styles/business-home.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `products`, `productCardHref`, `/imds-mark.svg`, existing product logo paths.
- Produces: semantic business-premium homepage and branded header.

- [ ] **Step 1: Implement the hero**
  Build dark high-contrast hero with two CTAs, IMDS mark visual, orbit decoration and 7/1/∞ metrics.
- [ ] **Step 2: Implement proof bar and products**
  Use factual platform proof labels and render seven existing products with current routing.
- [ ] **Step 3: Implement platform stack and values**
  Render four CSS platform layers and four factual business value cards.
- [ ] **Step 4: Implement final CTA and header lockup**
  Add IMDS mark to header and business conversion block.
- [ ] **Step 5: Add responsive/reduced-motion CSS**
  Keep strong contrast and mobile readability; disable continuous decorative movement under reduced-motion.
- [ ] **Step 6: Run full CI and verify GREEN**
  Required: prohibited-provider scan, lint, typecheck, unit tests, production build, Playwright, container build.

### Task 3: Merge, deploy and verify production

**Files:**
- Modify in `IMDS-tech/mis`: `.github/workflows/redeploy-imds-kz-product-links.yml`
- Create diagnostic workflow only if needed for independent verification.

**Interfaces:**
- Consumes: immutable GHCR image from merged `imds.kz` main.
- Produces: running `imds-public-website` with business-premium homepage.

- [ ] **Step 1: Merge website PR after GREEN**
- [ ] **Step 2: Wait for immutable GHCR image publication**
- [ ] **Step 3: Update deployment workflow without removing existing health/logo/BIMI safety checks**
- [ ] **Step 4: Run read-only preflight, merge deploy PR, and let push workflow redeploy only the website container**
- [ ] **Step 5: Independently verify exact running image and new homepage markers**
- [ ] **Step 6: Close diagnostic PR without merge**
