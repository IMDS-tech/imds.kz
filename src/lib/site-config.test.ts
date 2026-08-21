import { describe, expect, it } from 'vitest';
import { siteConfig } from './site-config';

describe('siteConfig', () => {
  it('uses canonical imds.kz and unique product slugs', () => {
    expect(siteConfig.origin).toBe('https://imds.kz');
    expect(new Set(siteConfig.products).size).toBe(siteConfig.products.length);
  });

  it('does not configure prohibited infrastructure providers', () => {
    const value = JSON.stringify(siteConfig).toLowerCase();
    expect(value).not.toContain('cloudflare');
    expect(value).not.toContain('supabase');
  });
});
