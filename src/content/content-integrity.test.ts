import { describe, expect, it } from 'vitest';
import { products } from './products';

describe('public content integrity', () => {
  it('defines all seven unique products', () => {
    expect(products).toHaveLength(7);
    expect(new Set(products.map(p => p.slug)).size).toBe(7);
  });
  it('contains no unsupported certification or adoption claims', () => {
    const text = JSON.stringify(products).toLowerCase();
    for (const claim of ['soc 2','iso 27001','99.99%','million users']) expect(text).not.toContain(claim);
  });
});
