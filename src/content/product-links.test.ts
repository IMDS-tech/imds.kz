import { describe, expect, it } from 'vitest';
import { productHref, productsBySlug } from './products';

describe('product live links', () => {
  it('opens deployed products on their production URLs', () => {
    expect(productHref(productsBySlug.beles)).toBe('https://beles.imds.kz');
    expect(productHref(productsBySlug.mis)).toBe('https://mis.imds.kz');
  });

  it('keeps undeployed products on their informational pages', () => {
    for (const slug of ['resto', 'omnichannel', 'analytics', 'ai', 'finance'] as const) {
      expect(productHref(productsBySlug[slug])).toBe(`/products/${slug}`);
    }
  });
});
