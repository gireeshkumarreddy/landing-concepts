import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import InboxWindow from './InboxWindow.jsx';
import Avatar from './Avatar.jsx';
import { useInbox } from './useInbox.js';
import { INCOMING, PEOPLE, SEED_CARDS } from '../data.js';
import { face, goToWaitlist, useMedia } from '../lib.js';
import { Bolt, Envelope } from '../icons.jsx';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';

const FEED_MS = 8000;
const ease = [0.2, 0.7, 0.2, 1];

function Tile({ side, person, tileRef, onOpen }) {
  const p = PEOPLE[person];
  const { src, srcSet } = face(p.photo, 124);
  return (
    <button
      type="button"
      ref={tileRef}
      className={`ta-ftile ta-ftile--${side}`}
      onClick={() => onOpen(person)}
      aria-label={`Open the conversation with ${p.name}`}
      data-cursor="Open"
    >
      <span className="ta-ftile__par">
        <span className="ta-ftile__float">
          <span className="ta-ftile__tilt">
          <span className="ta-ftile__card">
            <img src={src} srcSet={srcSet} width="124" height="124" alt="" decoding="async" fetchPriority="high" data-parallax="0.1" />
          </span>
          </span>
        </span>
      </span>
    </button>
  );
}

function Slot({ side, card, convos, onOpen }) {
  const c = card ? convos[card.convo] : null;
  const show = !!c && c.unread > 0;
  const p = c ? PEOPLE[c.person] : null;
  return (
    <div className={`ta-slot ta-slot--${side}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {show && (
          <motion.button
            key={card.key}
            type="button"
            className="ta-ncard"
            onClick={() => onOpen(side, card)}
            initial={{ opacity: 0, x: side === 'left' ? -40 : 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.28, ease } }}
            transition={{ duration: 0.7, ease }}
          >
            <Avatar id={c.person} size={46} shape="rounded" eager />
            <span className="ta-ncard__txt">
              <strong>{p.name}</strong>
              <span>{card.body}</span>
            </span>
            <span className="ta-ncard__side">
              <time>{card.time}</time>
              <span className="ta-ncard__badge">
                +{c.unread}
                <span className="sr-only"> unread. Open conversation</span>
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const [inbox, dispatch] = useInbox();
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const twoSlots = useMedia('(min-width: 1024px)', true);

  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const regionRef = useRef(null);
  const tileL = useRef(null);
  const tileR = useRef(null);
  const lastSlot = useRef('right');
  const selectedRef = useRef(inbox.selected);
  selectedRef.current = inbox.selected;

  const [paths, setPaths] = useState({ l: '', r: '' });
  const [slots, setSlots] = useState({ left: SEED_CARDS.left, right: SEED_CARDS.right });
  const [paused, setPaused] = useState(false);
  const [fed, setFed] = useState(0);
  const [inView, setInView] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const [announce, setAnnounce] = useState('');

  /* ---- curved connector lines: measured from layout boxes (transforms ignored) */
  const measure = useCallback(() => {
    const a = tileL.current;
    const b = tileR.current;
    const win = regionRef.current;
    if (!a || !b || !win || a.offsetParent === null) {
      setPaths({ l: '', r: '' });
      return;
    }
    const wl = win.offsetLeft;
    const wt = win.offsetTop;
    const W = win.offsetWidth;
    const ax = a.offsetLeft + a.offsetWidth / 2;
    const ay = a.offsetTop + a.offsetHeight / 2;
    const bx = b.offsetLeft + b.offsetWidth / 2;
    const by = b.offsetTop + b.offsetHeight / 2;
    const le = { x: wl + 8, y: wt + 98 };
    const re = { x: wl + W - 8, y: wt + 84 };
    const dl = le.y - ay;
    const dr = re.y - by;
    // Less bulge when there is little room beside the window (tablet widths).
    const side = stageRef.current.getBoundingClientRect().left + wl;
    const k = Math.max(0.25, Math.min(1, side / 150));
    const f = n => Math.round(n * 10) / 10;
    setPaths({
      l: `M${f(ax)},${f(ay)} C${f(ax + 62 * k)},${f(ay + dl * 0.46)} ${f(le.x - 88 * k)},${f(le.y - dl * 0.2)} ${f(le.x)},${f(le.y)}`,
      r: `M${f(bx)},${f(by)} C${f(bx - 44 * k)},${f(by + dr * 0.5)} ${f(re.x + 104 * k)},${f(re.y - dr * 0.26)} ${f(re.x)},${f(re.y)}`,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /* ---- only run the demo feed while the hero is actually being looked at */
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(stageRef.current);
    const vis = () => setDocVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || !inView || !docVisible || fed >= INCOMING.length) return;
    const t = setTimeout(() => {
      const item = INCOMING[fed];
      const key = `in-${fed}`;
      dispatch({ type: 'incoming', id: item.convo, body: item.body, msgId: key });
      setFed(n => n + 1);
      if (selectedRef.current === item.convo) return; // already open: it simply appears in the thread
      setAnnounce(`New demo message from ${PEOPLE[item.convo].name}`);
      setSlots(s => {
        let side;
        if (!twoSlots) side = 'right';
        else if (s.left?.convo === item.convo) side = 'left';
        else if (s.right?.convo === item.convo) side = 'right';
        else side = lastSlot.current === 'right' ? 'left' : 'right';
        lastSlot.current = side;
        return { ...s, [side]: { key, convo: item.convo, time: 'Just now', body: item.body } };
      });
    }, FEED_MS);
    return () => clearTimeout(t);
  }, [reduced, paused, inView, docVisible, fed, twoSlots, dispatch]);

  const openConvo = id => {
    dispatch({ type: 'select', id });
    regionRef.current?.focus({ preventScroll: true });
  };

  const openFromCard = (side, card) => {
    setSlots(s => ({ ...s, [side]: null }));
    openConvo(card.convo);
  };

  /* ---- motion: entrance, ambient float, pointer parallax */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from('.ta-badge', { y: 14, opacity: 0, duration: 0.9 }, 0.1)
          .from('.ta-h1__w', { yPercent: 50, opacity: 0, filter: 'blur(10px)', duration: 1.1, stagger: 0.07 }, 0.18)
          .from('.ta-mailtile', { scale: 0.35, opacity: 0, rotate: -20, duration: 1.1 }, 0.62)
          .from('.ta-hero__sub', { y: 16, opacity: 0, duration: 0.9 }, 0.5)
          .from('.ta-hero__cta', { y: 16, opacity: 0, duration: 0.9 }, 0.6)
          .from('.ta-win', { y: 80, opacity: 0, duration: 1.3 }, 0.7)
          .from('.ta-ftile__card, .ta-mtile img', { scale: 0.7, opacity: 0, duration: 1, stagger: 0.12 }, 0.95)
          .from('.ta-curves path', { strokeDashoffset: 1, duration: 1.5, ease: 'power2.inOut', stagger: 0.1 }, 1.15)
          .from('.ta-slot--left', { x: -48, opacity: 0, duration: 1 }, 1.3)
          .from('.ta-slot--right', { x: 48, opacity: 0, duration: 1 }, 1.45);

        gsap.to('.ta-ftile__float', {
          y: -7,
          duration: 3.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { each: 1.3 },
        });
      });

      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const hero = heroRef.current;
        const items = gsap.utils.toArray('.ta-ftile__par');
        const setters = items.map((el, i) => ({
          x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
          depth: i === 0 ? 16 : 22,
        }));
        const onMove = e => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          setters.forEach(s => {
            s.x(nx * s.depth);
            s.y(ny * s.depth);
          });
        };
        hero.addEventListener('pointermove', onMove);
        return () => hero.removeEventListener('pointermove', onMove);
      });
    },
    { scope: heroRef }
  );

  const left = PEOPLE.marcus;
  const right = PEOPLE.amara;
  const ml = face(left.photo, 64);
  const mr = face(right.photo, 64);

  return (
    <section className="ta-hero" id="top" ref={heroRef} aria-labelledby="ta-hero-title">
      <div className="ta-hero__grid" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="ta-hero__copy">
        <span className="ta-mtile ta-mtile--l" aria-hidden="true">
          <img src={ml.src} srcSet={ml.srcSet} width="64" height="64" alt="" decoding="async" />
        </span>
        <span className="ta-mtile ta-mtile--r" aria-hidden="true">
          <img src={mr.src} srcSet={mr.srcSet} width="64" height="64" alt="" decoding="async" />
        </span>

        <p className="ta-badge">
          <Bolt filled={false} size={14} />
          Now inviting small teams
        </p>
        <h1 id="ta-hero-title" className="ta-h1">
          <span className="ta-h1__line">
            <span className="ta-h1__w">Talk</span>{' '}
            <span className="ta-mailtile" aria-hidden="true">
              <Envelope />
            </span>{' '}
            <span className="ta-h1__w">to</span> <span className="ta-h1__w">people,</span>
          </span>
          <span className="ta-h1__line">
            <span className="ta-h1__w">not</span> <span className="ta-h1__w">to</span>{' '}
            <span className="ta-h1__w">piles</span> <span className="ta-h1__w">of</span>{' '}
            <span className="ta-h1__w">mail.</span>
          </span>
        </h1>
        <p className="ta-hero__sub">
          Emberpost groups every email by the person behind it, so you can catch up on a relationship in
          seconds and reply like you’re in the same room.
        </p>
        <a href="#waitlist" className="ta-btn ta-btn--violet ta-hero__cta" onClick={goToWaitlist} data-magnetic="0.3">
          Join the waitlist <Bolt size={14} />
        </a>
      </div>

      <div className="ta-stage" ref={stageRef}>
        <svg className="ta-curves" aria-hidden="true" focusable="false">
          <path d={paths.l || 'M0,0'} pathLength="1" className={paths.l ? '' : 'is-empty'} />
          <path d={paths.r || 'M0,0'} pathLength="1" className={paths.r ? '' : 'is-empty'} />
        </svg>
        <Tile side="l" person="marcus" tileRef={tileL} onOpen={openConvo} />
        <Tile side="r" person="amara" tileRef={tileR} onOpen={openConvo} />

        <InboxWindow
          inbox={inbox}
          dispatch={dispatch}
          regionRef={regionRef}
          reduced={reduced}
          live={{
            show: !reduced,
            paused,
            finished: fed >= INCOMING.length,
            onToggle: () => setPaused(p => !p),
          }}
        />

        <Slot side="left" card={slots.left} convos={inbox.convos} onOpen={openFromCard} />
        <Slot side="right" card={slots.right} convos={inbox.convos} onOpen={openFromCard} />
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  );
}
