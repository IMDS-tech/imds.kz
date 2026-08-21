import { describe, expect, it } from 'vitest';
import { productActionHref, productCardHref, productsBySlug } from './products';

describe('product navigation', () => {
  it('keeps every product card on its informational page', () => {
    for (const slug of ['beles', 'mis', 'resto', 'omnichannel', 'analytics', 'ai', 'finance'] as const) {
      expect(productCardHref(productsBySlug[slug])).toBe(`/products/${slug}`);
    }
  });

  it('opens deployed products from the detail-page action', () => {
    expect(productActionHref(productsBySlug.beles)).toBe('https://beles.imds.kz');
    expect(productActionHref(productsBySlug.mis)).toBe('https://mis.imds.kz');
  });

  it('sends undeployed products to the demo request from the detail page', () => {
    for (const slug of ['resto', 'omnichannel', 'analytics', 'ai', 'finance'] as const) {
      expect(productActionHref(productsBySlug[slug])).toBe('/contact');
    }
  });

  it('assigns a dedicated transparent logo asset to every product', () => {
    for (const slug of ['beles', 'mis', 'resto', 'omnichannel', 'analytics', 'ai', 'finance'] as const) {
      expect(productsBySlug[slug].logoPath).toBe(`/product-logos/${slug}.png`);
    }
  });
});
