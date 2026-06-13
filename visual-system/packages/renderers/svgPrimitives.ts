import { tokens } from "../design-tokens/tokens.ts";

// Tiny string-building SVG helpers. The renderer is a PURE function that returns
// an SVG string. The same function feeds (a) the headless export below and
// (b) the React studio, which wraps the identical output and adds Framer Motion
// for interactivity. Export never touches the animation library, so there is no
// animation-timing flake (issue 5). No Canvas anywhere (issue 5).

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function rect(x: number, y: number, w: number, h: number, opts: {
  fill?: string; stroke?: string; sw?: number; rx?: number; evidenceId?: string;
} = {}): string {
  const ev = opts.evidenceId ? ` data-evidence-id="${esc(opts.evidenceId)}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.rx ?? 6}" `
    + `fill="${opts.fill ?? tokens.color.surface.panel}" `
    + `stroke="${opts.stroke ?? "none"}" stroke-width="${opts.sw ?? 0}"${ev} />`;
}

export function text(x: number, y: number, s: string, opts: {
  fill?: string; size?: number; weight?: number; anchor?: string; mono?: boolean;
} = {}): string {
  const family = opts.mono ? tokens.typography.mono : tokens.typography.body;
  return `<text x="${x}" y="${y}" fill="${opts.fill ?? tokens.color.text.primary}" `
    + `font-family="${family}" font-size="${opts.size ?? 13}" `
    + `font-weight="${opts.weight ?? 400}" text-anchor="${opts.anchor ?? "start"}">${esc(s)}</text>`;
}

export function arrow(x1: number, y1: number, x2: number, y2: number, color = tokens.color.text.muted): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" `
    + `stroke-width="${tokens.stroke.normal}" marker-end="url(#arrow)" />`;
}

export const ARROW_DEFS =
  `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">`
  + `<path d="M0,0 L10,5 L0,10 z" fill="${tokens.color.text.muted}" /></marker></defs>`;
