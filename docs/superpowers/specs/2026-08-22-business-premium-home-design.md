# IMDS Business Premium Homepage Design

## Goal
Replace the current cinematic-first homepage with a high-contrast business-first dark premium landing page based on the approved visual mockup, while preserving IMDS product navigation, accessibility, self-hosted constraints and existing product-detail behavior.

## Approved Visual Direction
The approved direction is enterprise SaaS / business infrastructure rather than experimental art. Use deep navy/near-black backgrounds, teal/cyan accents from the IMDS logo, high-contrast white typography, controlled glow, clean cards and restrained depth.

## Homepage Structure
1. Business Hero — H1 `Не набор сервисов. Одна живая система.`, business copy, `/products` and `/contact` CTAs, IMDS logo visual, 7/1/∞ metrics.
2. Proof Bar — factual platform labels only: Self-hosted, PostgreSQL, Unified SSO, API-first, GitHub CI/CD.
3. Products — seven existing products and approved logos; cards keep `/products/<slug>` routing.
4. IMDS Platform — CSS layered stack for Infrastructure, Data & Security, Platform Services, Products & Workflows; link to `/platform`.
5. Why IMDS — factual cards: Единая экосистема, Контроль данных, Гибкая интеграция, Масштабирование.
6. Final CTA — `Готовы собрать единую систему для вашего бизнеса?` with `/contact` CTA.

## Header
Show the existing IMDS mark next to `IMDS TECH`. Preserve current nav destinations and mobile navigation.

## Motion
Use restrained hero orbit/network motion, logo float, card hover depth and CTA hover. Remove the full-page scroll-driven cinematic scene, chapter rail and blurred chapter transitions from the homepage. `prefers-reduced-motion: reduce` disables continuous motion.

## Accessibility & Performance
One visible H1, semantic headings, meaningful alt text, focus-visible states and strong contrast. No new external rendering service or heavy WebGL dependency for this homepage. Existing product PNG assets remain unchanged.

## Scope
Modify homepage component, header lockup, homepage-specific styles and E2E tests. Do not change product detail routing, contact backend, DNS, Nginx, database or other IMDS services.