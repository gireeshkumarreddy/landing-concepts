// Declarative scroll motion. Mark elements inside a site's root with data attributes and call
// useMotion(rootRef) once in the page component. Everything is scoped, reverted on unmount and
// skipped (content fully visible) under prefers-reduced-motion.
//
//   data-reveal="lines|words|chars"  masked text rise on enter (SplitText; re-splits on resize)
//   data-reveal="fade"               soft rise + fade          data-reveal="stagger" → children
//   data-reveal="clip"               image/media wipe-in with inner scale settle
//   data-reveal-delay="0.1"  data-reveal-start="top 85%"
//   data-fill                         words light up as you scroll through (scrubbed)
//   data-fill-from="0.18"  data-fill-end="bottom 45%"
//   data-parallax="0.14"              element drifts inside its (overflow:hidden) parent
//   data-expand="10% 16%"             media opens from an inset frame to full bleed (scrubbed)
//   data-magnetic="0.3"               element leans toward the pointer (fine pointers only)
//   data-bg="#191919" | data-bg       section re-tints the whole page while it's centred;
//                                     bare data-bg uses the section's own background colour.
//                                     The root gets data-scroll-theme="dark|light" for navs.
//   data-velocity                     skews with scroll velocity (marquees, strips)
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, REDUCED } from '../gsap.js';
import { getLenis } from './smooth.js';

const EASE = 'expo.out';
const q = (root, sel) => [...root.querySelectorAll(sel)];

function luminance(color) {
  const [r, g, b] = gsap.utils.splitColor(color).map(v => v / 255);
  const lin = c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const themeOf = color => (luminance(color) < 0.35 ? 'dark' : 'light');
const isTransparent = c => !c || c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);

// Reveals fade with opacity, not autoAlpha: content waiting below the fold must stay focusable and
// in the accessibility tree. A keyboard user can reach it before it scrolls in, so focusing
// anything inside a pending reveal finishes that reveal at once.
function setupReveals(root) {
  const pending = [];
  q(root, '[data-reveal]').forEach(el => {
    const kind = el.dataset.reveal;
    const delay = parseFloat(el.dataset.revealDelay || 0);
    const start = el.dataset.revealStart || 'top 86%';
    const st = { trigger: el, start, once: true };

    if (kind === 'lines' || kind === 'words' || kind === 'chars') {
      SplitText.create(el, {
        type: kind === 'lines' ? 'lines' : `lines,${kind}`,
        mask: 'lines',
        autoSplit: true,
        onSplit: self =>
          gsap.from(self[kind], {
            yPercent: 110,
            duration: kind === 'chars' ? 0.9 : 1.15,
            ease: EASE,
            stagger: kind === 'chars' ? 0.018 : kind === 'words' ? 0.04 : 0.09,
            delay,
            scrollTrigger: st,
          }),
      });
    } else if (kind === 'fade') {
      pending.push(gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: EASE, delay, scrollTrigger: st }));
    } else if (kind === 'stagger') {
      pending.push(
        gsap.from(el.children, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: EASE,
          delay,
          stagger: parseFloat(el.dataset.revealStagger || 0.08),
          scrollTrigger: st,
        })
      );
    } else if (kind === 'clip') {
      const inner = el.querySelector('img, video, picture') || el.firstElementChild;
      const tl = gsap.timeline({ delay, scrollTrigger: st });
      tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut' });
      if (inner) tl.from(inner, { scale: 1.25, duration: 1.6, ease: EASE }, 0.1);
    }
  });
  const onFocus = e => {
    pending.forEach(tween => {
      if (tween.progress() < 1 && tween.targets().some(t => t.contains(e.target))) tween.progress(1);
    });
  };
  root.addEventListener('focusin', onFocus);
  return () => root.removeEventListener('focusin', onFocus);
}

function setupFills(root) {
  q(root, '[data-fill]').forEach(el => {
    const from = parseFloat(el.dataset.fillFrom || 0.18);
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: self =>
        gsap.fromTo(
          self.words,
          { opacity: from },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: el.dataset.fillStart || 'top 78%', end: el.dataset.fillEnd || 'bottom 45%', scrub: 0.6 },
          }
        ),
    });
  });
}

function setupParallax(root) {
  q(root, '[data-parallax]').forEach(el => {
    const s = parseFloat(el.dataset.parallax || 0.14);
    gsap.set(el, { scale: 1 + s, transformOrigin: '50% 50%' });
    gsap.fromTo(
      el,
      { yPercent: -s * 45 },
      { yPercent: s * 45, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });
}

function setupExpand(root) {
  q(root, '[data-expand]').forEach(el => {
    const [v = '10%', h = '16%'] = (el.dataset.expand || '').split(/\s+/).filter(Boolean);
    const radius = el.dataset.expandRadius || '28px';
    gsap.fromTo(
      el,
      { clipPath: `inset(${v} ${h} ${v} ${h} round ${radius})` },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: el.dataset.expandStart || 'top 92%', end: el.dataset.expandEnd || 'center 55%', scrub: 0.8 },
      }
    );
  });
}

function setupMagnetic(root) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const offs = q(root, '[data-magnetic]').map(el => {
    const strength = parseFloat(el.dataset.magnetic || 0.3);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = e => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    // Return through the same quickTo tweens; a separate overwrite tween would kill them
    // and leave the element unresponsive after the first hover.
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
  return () => offs.forEach(off => off());
}

function setupBackgrounds(root, { instant }) {
  const sections = q(root, '[data-bg]');
  if (!sections.length) return () => {};
  const base = root.dataset.bgBase || getComputedStyle(root).backgroundColor;
  const baseTheme = themeOf(base);
  const canvases = [root, document.body, document.documentElement];
  const inline = canvases.map(c => c.style.backgroundColor);
  const entries = sections.map(el => {
    const own = getComputedStyle(el).backgroundColor;
    const color = el.dataset.bg || (isTransparent(own) ? base : own);
    // The section lets the page colour show through, so the whole page re-tints.
    el.style.backgroundColor = 'transparent';
    return { el, color, theme: el.dataset.bgTheme || themeOf(color) };
  });
  const active = new Set();
  let current = null;
  const apply = () => {
    const top = entries.filter(e => active.has(e)).pop();
    const color = top ? top.color : base;
    if (color === current) return;
    current = color;
    root.dataset.scrollTheme = top ? top.theme : baseTheme;
    gsap.to(canvases, { backgroundColor: color, duration: instant ? 0 : 0.85, ease: 'power2.out', overwrite: 'auto' });
  };
  const triggers = entries.map(entry =>
    ScrollTrigger.create({
      trigger: entry.el,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: self => {
        self.isActive ? active.add(entry) : active.delete(entry);
        apply();
      },
    })
  );
  root.dataset.scrollTheme = baseTheme;
  return () => {
    triggers.forEach(t => t.kill());
    gsap.killTweensOf(canvases);
    entries.forEach(({ el }) => (el.style.backgroundColor = ''));
    canvases.forEach((c, i) => (c.style.backgroundColor = inline[i]));
    delete root.dataset.scrollTheme;
  };
}

function setupVelocity(root) {
  const els = q(root, '[data-velocity]');
  const lenis = getLenis();
  if (!els.length || !lenis) return () => {};
  const setters = els.map(el => gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' }));
  const onScroll = ({ velocity }) => setters.forEach(set => set(gsap.utils.clamp(-7, 7, -velocity * 0.35)));
  const off = lenis.on('scroll', onScroll);
  return () => {
    off?.();
    gsap.set(els, { skewX: 0 });
  };
}

export function useMotion(rootRef, deps = []) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const offs = [setupReveals(root)];
        setupFills(root);
        setupParallax(root);
        setupExpand(root);
        offs.push(setupMagnetic(root), setupVelocity(root), setupBackgrounds(root, { instant: false }));
        return () => offs.forEach(fn => fn());
      });
      mm.add(REDUCED, () => setupBackgrounds(root, { instant: true }));
      // Late-loading images and fonts change layout; re-measure once things settle.
      let alive = true;
      const refresh = () => alive && ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);
      return () => {
        alive = false;
        window.removeEventListener('load', refresh);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: deps }
  );
}
