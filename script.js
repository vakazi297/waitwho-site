/* =============================================================
   WaitWHO — landing script
   Pure vanilla. No external deps. Deployable from any static host.
   ============================================================= */

(function () {
    'use strict';

    /**
     * App Store product URL — paste when the listing is live (e.g. https://apps.apple.com/app/id…).
     * Leave empty to send every `[data-app-store]` badge to the on-page #download section instead.
     */
    const APP_STORE_URL = '';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- App Store badges (single source of truth) ---------------------
    (function wireAppStoreLinks() {
        const trimmed = typeof APP_STORE_URL === 'string' ? APP_STORE_URL.trim() : '';
        const href = trimmed ? trimmed : '#download';
        document.querySelectorAll('a[data-app-store]').forEach((a) => {
            a.setAttribute('href', href);
            if (!trimmed) {
                a.classList.add('app-store-badge--pending');
                a.setAttribute(
                    'title',
                    'App Store listing coming soon — jump to the download section on this page.'
                );
                a.removeAttribute('rel');
            } else {
                a.classList.remove('app-store-badge--pending');
                a.removeAttribute('title');
                a.setAttribute('rel', 'noopener noreferrer');
            }
        });
    })();

    // ---- Footer year ----------------------------------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // ---- Reveal on scroll ----------------------------------------------
    // IntersectionObserver with a one-shot unobserve pattern to avoid
    // re-triggering animations on every scroll direction change.
    (function setupReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px',
        });

        items.forEach((el) => io.observe(el));
    })();

    // ---- Hero terminal whispers ---------------------------------------
    // Mirrors iOS `ScanLoaderTerminalWhispers` in ScanView.swift — same
    // phrase pool and monospace green styling; random positions with a
    // rejection band so lines rarely sit behind the headline on desktop.
    (function setupHeroTerminalWhispers() {
        const host = document.getElementById('hero-terminal');
        if (!host || prefersReducedMotion) return;

        const PHRASES = [
            '> sweeping public index…',
            '> face vectors: online',
            '> cross-referencing sources',
            '> parsing archives',
            '> heuristic match: pending',
            '> signal channel open',
            '> probing social mirrors',
            '> cached index loaded',
            '> trace scope: open web',
            '> hashing biometrics',
            '> matching vectors…',
            '> dimensional compare',
            '> noise filter engaged',
            '> deep recall: active',
            '> query strata: unfiltered',
            '> reviewing reflections',
            '> phantoms indexed',
            '> latent faces: streaming',
            '> correlating silhouettes',
            '> scanning omninet…',
            '> watch surface extended',
            '> echo candidates: evaluating',
            '> shadow index: online',
            '> public index: open',
        ];

        function maxConcurrent() {
            const w = window.innerWidth;
            if (w <= 900) return 2;
            return w < 640 ? 3 : 5;
        }

        let active = 0;

        /** Below ~900px the hero stacks (phone first, copy under). Cap Y so
         *  whispers never land behind the subhead/CTAs — i.e. not past the phone. */
        function whisperMaxY01() {
            const w = window.innerWidth;
            if (w > 900) return 0.88;
            const hero = host.closest('.hero');
            if (!hero) return 0.38;
            const device = hero.querySelector('.hero__device');
            const hr = hero.getBoundingClientRect();
            if (!device || hr.height < 40) return 0.38;
            const dr = device.getBoundingClientRect();
            const padPx = 14;
            const frac = (dr.bottom - hr.top + padPx) / hr.height;
            return Math.min(0.52, Math.max(0.2, frac));
        }

        function samplePosition() {
            const w = window.innerWidth;
            const wide = w >= 900;
            const mid = w >= 640 && w < 900;
            /* Only (900, 910): two-col is gone but w still triggers old "stacked" — keep center-top reject. */
            const stackedNarrowTablet = w > 900 && w < 910;
            const yHi = whisperMaxY01();

            for (let attempt = 0; attempt < 22; attempt++) {
                const x = 0.04 + Math.random() * 0.92;
                const y = 0.06 + Math.random() * (yHi - 0.06);
                if (wide && x < 0.54 && y > 0.16 && y < 0.72) continue;
                if (mid && x < 0.62 && y > 0.12 && y < 0.55) continue;
                if (stackedNarrowTablet && y < 0.44 && x > 0.1 && x < 0.9) continue;
                if (y > yHi) continue;
                return { x, y };
            }
            return { x: 0.1 + Math.random() * 0.25, y: Math.min(0.28, yHi * 0.75) };
        }

        function fadeOutRemove(el) {
            el.classList.add('is-out');
            const done = () => {
                el.remove();
                active = Math.max(0, active - 1);
            };
            el.addEventListener('transitionend', done, { once: true });
            setTimeout(done, 650);
        }

        function typewrite(el, phrase, onDone) {
            let k = 0;
            function step() {
                if (k < phrase.length) {
                    el.textContent = phrase.slice(0, k + 1) + '\u258c';
                    k++;
                    setTimeout(step, 32 + ((Math.random() * 24) | 0));
                } else {
                    el.textContent = phrase;
                    onDone();
                }
            }
            step();
        }

        function spawnOne() {
            if (document.hidden || active >= maxConcurrent()) return;
            const phrase = PHRASES[(Math.random() * PHRASES.length) | 0];
            const { x, y } = samplePosition();

            const el = document.createElement('div');
            el.className = 'hero-terminal-whisper';
            el.setAttribute('aria-hidden', 'true');
            el.style.left = x * 100 + '%';
            el.style.top = y * 100 + '%';
            host.appendChild(el);

            active++;
            requestAnimationFrame(() => {
                el.classList.add('is-visible');
            });

            typewrite(el, phrase, () => {
                const linger = 1100 + Math.random() * 1700;
                setTimeout(() => fadeOutRemove(el), linger);
            });
        }

        function scheduleLoop() {
            const delay = 550 + Math.random() * 1100;
            setTimeout(() => {
                if (!document.hidden) spawnOne();
                scheduleLoop();
            }, delay);
        }

        let resizeTimer;
        window.addEventListener(
            'resize',
            () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    host.querySelectorAll('.hero-terminal-whisper').forEach((n) => n.remove());
                    active = 0;
                }, 250);
            },
            { passive: true }
        );

        setTimeout(spawnOne, 400);
        setTimeout(spawnOne, 1100);
        scheduleLoop();
    })();

    // ---- Hero typed line ------------------------------------------------
    (function setupTyped() {
        const target = document.getElementById('typed');
        if (!target) return;

        const line = "Some photos don't stay where you left them.";

        if (prefersReducedMotion) {
            target.textContent = line;
            return;
        }

        let i = 0;
        let forward = true;
        // Small pause before starting so the hero copy settles first.
        const tick = () => {
            target.textContent = line.slice(0, i);
            if (forward) {
                if (i < line.length) {
                    i += 1;
                    setTimeout(tick, 55 + Math.random() * 35);
                } else {
                    // Hold full line for a beat, then reverse.
                    setTimeout(() => { forward = false; tick(); }, 2400);
                }
            } else {
                if (i > 0) {
                    i -= 1;
                    setTimeout(tick, 28);
                } else {
                    forward = true;
                    setTimeout(tick, 900);
                }
            }
        };

        setTimeout(tick, 700);
    })();

    // ---- Particle canvas ------------------------------------------------
    // Lightweight, GPU-friendly particle drift. Kept under ~60 particles
    // to stay well-behaved on phones. Pauses while the tab is hidden and
    // while the user hasn't explicitly opted in to motion.
    (function setupParticles() {
        const canvas = document.getElementById('particles');
        if (!canvas || prefersReducedMotion) {
            if (canvas) canvas.remove();
            return;
        }

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        const config = {
            density: 0.00010, // particles per px² (viewport area based)
            maxParticles: 70,
            minR: 0.6,
            maxR: 1.8,
            speed: 0.12,
            colors: [
                'rgba(0, 229, 255, 0.75)',
                'rgba(255, 0, 255, 0.70)',
                'rgba(119, 57, 177, 0.80)',
                'rgba(120, 170, 255, 0.55)',
            ],
        };

        let particles = [];
        let width = 0;
        let height = 0;
        let running = true;
        /** True while the user is actively scrolling — skip draws to keep
         *  scrolling on the main thread smooth (canvas + blur shadows
         *  fight the compositor on every frame otherwise). */
        let scrollBusy = false;
        let scrollIdleTimer = null;

        function resize() {
            width = canvas.clientWidth = window.innerWidth;
            height = canvas.clientHeight = window.innerHeight;
            canvas.width = Math.floor(width * DPR);
            canvas.height = Math.floor(height * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

            const isNarrow = width < 768;
            const maxCap = isNarrow ? 42 : config.maxParticles;
            const count = Math.min(
                maxCap,
                Math.max(isNarrow ? 14 : 20, Math.round(width * height * config.density))
            );

            particles = new Array(count).fill(0).map(() => spawn());
        }

        function spawn() {
            const r = config.minR + Math.random() * (config.maxR - config.minR);
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r,
                vx: (Math.random() - 0.5) * config.speed,
                vy: -config.speed * (0.4 + Math.random() * 0.8),
                color: config.colors[(Math.random() * config.colors.length) | 0],
                phase: Math.random() * Math.PI * 2,
            };
        }

        function step() {
            if (!running) return;
            // Defer all canvas work while the user scrolls — the eye doesn't
            // notice static drift pausing for a moment, but jank is obvious.
            if (scrollBusy) {
                requestAnimationFrame(step);
                return;
            }

            ctx.clearRect(0, 0, width, height);
            // Per-particle shadowBlur is extremely expensive; soft glow comes
            // from the semi-transparent fill alone.
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx + Math.sin(p.phase) * 0.12;
                p.y += p.vy;
                p.phase += 0.008;

                if (p.y + p.r < -4) {
                    p.x = Math.random() * width;
                    p.y = height + 4;
                }
                if (p.x < -4) p.x = width + 4;
                if (p.x > width + 4) p.x = -4;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            requestAnimationFrame(step);
        }

        // Throttled resize
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 120);
        }, { passive: true });

        // Pause particle rendering during scroll — biggest win for scroll
        // smoothness on pages with fixed full-viewport canvas + glass UI.
        window.addEventListener('scroll', () => {
            scrollBusy = true;
            clearTimeout(scrollIdleTimer);
            scrollIdleTimer = setTimeout(() => {
                scrollBusy = false;
            }, 160);
        }, { passive: true, capture: true });

        // Pause while hidden — saves battery and GPU cycles.
        document.addEventListener('visibilitychange', () => {
            const shouldRun = !document.hidden;
            if (shouldRun === running) return;
            running = shouldRun;
            if (running) requestAnimationFrame(step);
        });

        resize();
        requestAnimationFrame(step);
    })();

    // ---- In-page anchor links ------------------------------------------
    // `scroll-behavior: smooth` on <html> can make wheel / trackpad scroll
    // feel heavy on some setups. We keep `html` at `auto` and only smooth
    // intentional nav clicks here (skips when reduced motion is on).
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const hash = a.getAttribute('href');
            if (!hash || hash === '#') {
                e.preventDefault();
                return;
            }
            const target = document.querySelector(hash);
            if (!target) return;

            if (prefersReducedMotion) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.replaceState) {
                history.replaceState(null, '', hash);
            }
        });
    });

    // ---- Mobile slide-in menu ------------------------------------------
    // Simple, keyboard-accessible drawer. No focus-trap library; we just
    // move focus into the panel on open and restore it on close, and close
    // on Escape / backdrop click / link click. That covers the realistic
    // a11y needs for a 6-link landing page menu without extra weight.
    (function setupMobileMenu() {
        const toggle = document.querySelector('.nav__hamburger');
        const menu = document.getElementById('mobile-menu');
        if (!toggle || !menu) return;

        const panel = menu.querySelector('.mobile-menu__panel');
        const backdrop = menu.querySelector('.mobile-menu__backdrop');
        const linkEls = menu.querySelectorAll('a, button');
        let lastFocus = null;

        function open() {
            lastFocus = document.activeElement;
            menu.classList.add('is-open');
            menu.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close menu');
            document.body.classList.add('menu-open');
            // Focus the panel so the very next Tab lands on the first link.
            if (panel && typeof panel.focus === 'function') {
                panel.setAttribute('tabindex', '-1');
                panel.focus({ preventScroll: true });
            }
        }

        function close() {
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
            document.body.classList.remove('menu-open');
            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus({ preventScroll: true });
            }
        }

        function toggleMenu() {
            if (menu.classList.contains('is-open')) close();
            else open();
        }

        /* iOS Safari: rely on touchend for the toggle; synthetic click follows
         * ~300ms later and would double-toggle (open then instantly close).
         * Desktop / trackpad: click only. */
        let lastTouchDrivenToggle = 0;
        toggle.addEventListener(
            'touchend',
            () => {
                lastTouchDrivenToggle = Date.now();
                toggleMenu();
            },
            { passive: true }
        );
        toggle.addEventListener('click', (e) => {
            if (Date.now() - lastTouchDrivenToggle < 500) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            toggleMenu();
        });
        backdrop && backdrop.addEventListener('click', close);

        // Any link or element marked with data-close-menu inside the drawer
        // should dismiss it — this makes "tap a nav link" feel native.
        linkEls.forEach((el) => el.addEventListener('click', close));
        menu.querySelectorAll('[data-close-menu]').forEach((el) =>
            el.addEventListener('click', close)
        );

        // Esc closes. Only active while the menu is open so we don't
        // interfere with any other keyboard handlers elsewhere.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                e.preventDefault();
                close();
            }
        });

        // If the viewport grows past the mobile breakpoint while the menu
        // is open (e.g. rotating a tablet), tidy state so the desktop
        // layout doesn't end up with the body scroll-lock stuck on.
        const mql = window.matchMedia('(min-width: 821px)');
        const onMql = () => {
            if (mql.matches && menu.classList.contains('is-open')) close();
        };
        // Older Safari uses addListener; newer uses addEventListener.
        if (mql.addEventListener) mql.addEventListener('change', onMql);
        else if (mql.addListener) mql.addListener(onMql);
    })();

    // ---- Privacy receipt timestamp -------------------------------------
    // Keep the demo purge receipt's "Purged at" line anchored to ~now so
    // it never looks stale. We show a formatted UTC timestamp rounded to
    // a plausible recent moment (15-60 minutes ago) to read as a real
    // operational log line rather than a dated marketing screenshot.
    (function setupReceiptTimestamp() {
        const el = document.getElementById('receipt-purged-at');
        if (!el) return;

        const now = new Date();
        // Round back a plausible amount so it always reads as "recently".
        const minutesAgo = 14 + Math.floor(Math.random() * 46);
        now.setMinutes(now.getMinutes() - minutesAgo);

        const pad = (n) => String(n).padStart(2, '0');
        const y = now.getUTCFullYear();
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const m = months[now.getUTCMonth()];
        const d = now.getUTCDate();
        const hh = pad(now.getUTCHours());
        const mm = pad(now.getUTCMinutes());

        el.textContent = `${m} ${d}, ${y} · ${hh}:${mm} UTC`;
    })();

    // ---- QR placeholder drawing ----------------------------------------
    // We render a visually convincing QR-style dot matrix client-side so
    // the HTML stays small. When the App Store URL is known, replace
    // <div id="qr-art"></div> with an <img> or <svg> of a real QR
    // generated from the listing URL (any QR generator produces SVG).
    //
    // The pattern uses the canonical three finder squares plus a
    // deterministic pseudo-random data grid so it always looks the same
    // on every load (no flicker, no hydration mismatch concerns).
    (function drawQrPlaceholder() {
        const host = document.getElementById('qr-art');
        if (!host) return;

        // When APP_STORE_URL is non-empty, replace this block with a real QR
        // (e.g. checked-in apps/qr-download.svg or a build-time generated PNG).

        const GRID = 21;           // QR v1 module count
        const CELL = 10;           // module size in the SVG viewBox
        const CANVAS = GRID * CELL;
        const parts = [];

        parts.push(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
            CANVAS + ' ' + CANVAS + '" shape-rendering="crispEdges">'
        );
        parts.push('<rect width="100%" height="100%" fill="#ffffff"/>');

        // Draw a 7x7 finder pattern at (gx, gy) in grid coords.
        function finder(gx, gy) {
            const x = gx * CELL;
            const y = gy * CELL;
            parts.push('<rect x="' + x + '" y="' + y + '" width="' + (7 * CELL) + '" height="' + (7 * CELL) + '" fill="#000"/>');
            parts.push('<rect x="' + (x + CELL) + '" y="' + (y + CELL) + '" width="' + (5 * CELL) + '" height="' + (5 * CELL) + '" fill="#fff"/>');
            parts.push('<rect x="' + (x + 2 * CELL) + '" y="' + (y + 2 * CELL) + '" width="' + (3 * CELL) + '" height="' + (3 * CELL) + '" fill="#000"/>');
        }
        finder(0, 0);
        finder(GRID - 7, 0);
        finder(0, GRID - 7);

        // Deterministic pseudo-random cell fill. Good enough to look like
        // a real code at a glance; obviously not scannable, which is
        // intentional since we don't yet have the App Store URL.
        function isSet(x, y) {
            const h = ((x * 73856093) ^ (y * 19349663) ^ 83492791) >>> 0;
            return (h % 10) < 5;
        }
        function inFinder(x, y) {
            if (x < 8 && y < 8) return true;
            if (x >= GRID - 8 && y < 8) return true;
            if (x < 8 && y >= GRID - 8) return true;
            return false;
        }

        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (inFinder(x, y)) continue;
                if (isSet(x, y)) {
                    parts.push(
                        '<rect x="' + (x * CELL) + '" y="' + (y * CELL) +
                        '" width="' + CELL + '" height="' + CELL + '" fill="#000"/>'
                    );
                }
            }
        }

        // Timing patterns along row/col 6 — small realism touch.
        for (let i = 8; i < GRID - 8; i++) {
            if (i % 2 === 0) {
                parts.push('<rect x="' + (i * CELL) + '" y="' + (6 * CELL) + '" width="' + CELL + '" height="' + CELL + '" fill="#000"/>');
                parts.push('<rect x="' + (6 * CELL) + '" y="' + (i * CELL) + '" width="' + CELL + '" height="' + CELL + '" fill="#000"/>');
            }
        }

        parts.push('</svg>');
        host.innerHTML = parts.join('');
    })();
})();
