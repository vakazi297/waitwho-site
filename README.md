# WaitWHO — Landing Site

Static marketing site for **WaitWHO**. Pure HTML / CSS / JS. No build step.
Drop-in deployable to **GitHub Pages**, Cloudflare Pages, Netlify, Vercel, S3,
or any plain static host.

---

## File structure

```
waitwho-web/
├── index.html          # All page sections
├── styles.css          # Cyberpunk dark theme, glass cards, neon accents, responsive
├── script.js           # Reveal on scroll, typed hero line, particle canvas
├── .nojekyll           # Tell GitHub Pages to skip Jekyll
├── assets/
│   ├── app-icon.png          # ASSET: swap in 512×512 WaitWHO icon (used for favicon + apple-touch-icon)
│   ├── og-cover.png          # ASSET: 1200×630 social share image
│   ├── hero-screens-loop.gif # Real app: looping home → pre-flight → results (hero phone)
│   ├── app-screen-home.png   # ASSET: optional single-frame hero (if not using the GIF)
│   ├── app-screen-results.png# ASSET: optional results screenshot (can swap into the split visual)
│   └── logo.png              # ASSET: optional standalone logo mark / wordmark
└── README.md
```

The hero phone uses a **real screenshot GIF loop** (`hero-screens-loop.gif`)
with the existing CSS scan-line overlay on top. Behind the headline, the
**green terminal whispers** (`#hero-terminal` + `script.js`) mirror the iOS
scan-loader atmosphere (same phrase pool as `ScanLoaderTerminalWhispers` in
`ScanView.swift`). They are disabled when `prefers-reduced-motion` is set.

The Results section still uses stylized mock UI cards until you swap in
`app-screen-results.png`.

---

## Swapping in real assets

### Hero phone (GIF or PNG)

The hero ships with **`assets/hero-screens-loop.gif`** — a short loop of real
screenshots (home → ready to scan → results). The scan-line overlay on
`.phone__screen::after` is unchanged and draws on top of the GIF.

To swap to a **single static PNG** instead, point `src` at e.g.
`assets/app-screen-home.png` and remove the `.gif` file if unused.

```html
<img class="phone__screen-img"
     src="assets/app-screen-home.png"
     alt="WaitWHO home screen" />
```

The CSS class `.phone__screen-img` is already styled for cover-fit inside
the phone frame.

Recommended static export: **828 × 1792 PNG**, black background at the edges
so the bezel blends cleanly. For a new GIF loop, rebuild with the same max
frame dimensions so padding matches the frame.

### Favicon / social preview

- `assets/app-icon.png` → 512×512 app icon for favicon + iOS home-screen.
- `assets/og-cover.png` → 1200×630 Open Graph / Twitter card image.

---

## Local preview

Any static server works. Two quick options:

```bash
# Python 3
cd waitwho-web
python3 -m http.server 8080
# → http://localhost:8080

# Node (one-liner, no install)
npx serve -l 8080 .
```

---

## Deploying to GitHub Pages

### Option A · User / Project Pages from repo root

1. Create a new public repo (e.g. `waitwho-web` or `waitwho.github.io`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial landing site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub → **Settings → Pages** → Source: `Deploy from a branch`,
   Branch: `main` / root. Save.
4. GitHub will publish at `https://<you>.github.io/<repo>/`.

The `.nojekyll` file is already included so GitHub Pages serves your CSS /
JS / asset files as-is without running them through Jekyll.

### Option B · Custom domain

After Pages is live, add a `CNAME` file to this folder containing your
domain (e.g. `waitwho.app`), push it, then configure the DNS record on
your registrar to point at GitHub's Pages servers.

### Option C · Cloudflare Pages / Netlify / Vercel

- Build command: *(leave empty)*
- Output directory: `.` (repo root)
- Deploy.

---

## Editing tips

### Brand colors

All colors are CSS variables at the top of `styles.css`. Update once, they
propagate everywhere:

```css
:root {
    --neon-cyan:    #00E5FF;
    --neon-magenta: #FF00FF;
    --neon-pink:    #D42C8C;
    --neon-purple:  #7739B1;
    --neon-indigo:  #4246C8;
    /* …surfaces, text, radii */
}
```

These match the iOS app's `Theme.swift` tokens — keep them in sync if you
retheme the app.

### Animations

Visual motion is intentionally subtle:

- `gradient-pan` — slow shift on headline gradients
- `hero-aura-spin-*` — chasing cyan / magenta blurred halo behind the hero phone
- `finale-ring-glow` — soft opacity pulse on the finale backdrop ring
- `phone-sweep` — scanline sweep across the device screen
- `pill-float` — curiosity pills gently bob
- Particle canvas — drifting neon specks

The whole page respects `prefers-reduced-motion: reduce`. When the user
has that system pref on, animations collapse to ~0ms and the particle
canvas is removed from the DOM entirely.

### Adding / removing sections

Each section in `index.html` is cleanly self-contained between comment
banners like:

```html
<!-- =========================================================
     3 · HOW IT WORKS
========================================================== -->
```

Copy one as a scaffold when adding a new section.

---

## What this site does *not* include

By design, per the brand brief:

- ❌ No fake testimonials or fake press logos
- ❌ No fake user counts or fabricated metrics
- ❌ No "find anyone", "stalk", "track", or "identify" language
- ❌ No analytics, no trackers, no third-party JS

If you add analytics later, consider privacy-preserving options (Plausible,
Cloudflare Web Analytics, or a self-hosted Umami).

---

## License

All rights reserved — WaitWHO / Hadalcore LLC.
