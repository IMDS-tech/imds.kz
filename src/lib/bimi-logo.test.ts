import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const logoPath = resolve(process.cwd(), "public/.well-known/bimi/imds.svg");

describe("BIMI logo", () => {
  it("publishes a Gmail-compatible SVG Tiny P/S asset", () => {
    const exists = existsSync(logoPath);
    const svg = exists ? readFileSync(logoPath, "utf8") : "";
    const bytes = exists ? statSync(logoPath).size : 0;
    const root = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";

    expect(exists).toBe(true);
    expect(bytes).toBeGreaterThan(0);
    expect(bytes).toBeLessThanOrEqual(32 * 1024);
    expect(root).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(root).toContain('version="1.2"');
    expect(root).toContain('baseProfile="tiny-ps"');
    expect(root).toContain('width="96"');
    expect(root).toContain('height="96"');
    expect(root).toContain('viewBox="0 0 96 96"');
    expect(root).not.toMatch(/\s[xy]=/i);
    expect(svg).toMatch(/<title>IMDS TECH<\/title>/i);
    expect(svg).toMatch(/<desc>[^<]+<\/desc>/i);
    expect(svg).not.toMatch(/<(script|animate|set|foreignObject|image)\b/i);
    expect(svg).not.toMatch(/\b(?:href|xlink:href)=/i);
  });
});
