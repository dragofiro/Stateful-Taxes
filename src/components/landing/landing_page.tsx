// Landing page: a headline over a blurred US outline. Scrolling lifts the headline and
// brings the map into focus. Once the map is sharp, hovering a state fills it with its flag.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './landing.css';
import { UsMap, MAP_CODES, type HoverEvent } from './us_map.tsx';
import { useFireworks, type Point } from './fireworks.ts';
import { flagUrl, jurisdictionKind, jurisdictionName } from './jurisdictions.ts';

/** Share of the hero's scroll at which the map is fully sharp and becomes interactive. */
const CLEAR_AT = 0.78;

interface LandingPageProps {
  onStartFiling: (code: string) => void;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function PopupText({ code }: { code: string }) {
  const name = <b>{jurisdictionName(code)}</b>;
  switch (jurisdictionKind(code)) {
    case 'no-tax': return <>No state taxes needed in {name}</>;
    case 'coming-soon': return <>{name}: coming soon!</>;
    default: return <>start filing for: {name}</>;
  }
}

export function LandingPage({ onStartFiling }: LandingPageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointRef = useRef<Point | null>(null);
  const [clear, setClear] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [touchFirst] = useState(() => window.matchMedia('(hover: none)').matches);

  useFireworks(canvasRef, pointRef, clear && activeCode !== null && jurisdictionKind(activeCode) === 'no-tax');

  // The landing page is white; the rest of the app keeps its dark body.
  useEffect(() => {
    document.body.classList.add('lp-body');
    return () => document.body.classList.remove('lp-body');
  }, []);

  // Download and decode every flag up front so the first hover paints at once.
  useEffect(() => {
    for (const code of MAP_CODES) {
      const img = new Image();
      img.src = flagUrl(code);
      img.decode().catch(() => undefined);
    }
  }, []);

  // Scroll drives CSS variables directly, so scrolling never re-renders the map.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      const stage = stageRef.current;
      if (!hero || !stage) return;
      const rect = hero.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      const t = Math.min(1, p / CLEAR_AT);
      stage.style.setProperty('--p', easeInOut(t).toFixed(4));
      stage.style.setProperty('--blur', (1.4 * (1 - t) * (1 - t)).toFixed(4));
      stage.style.setProperty('--cue', Math.max(0, 1 - p * 6).toFixed(3));
      const isClear = p >= CLEAR_AT;
      setClear(isClear);
      if (!isClear) setActiveCode(null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const placePopup = useCallback(() => {
    const popup = popupRef.current;
    const stage = stageRef.current;
    const at = pointRef.current;
    if (!popup || !stage || !at) return;
    const w = popup.offsetWidth;
    const h = popup.offsetHeight;
    let x = at.x + 16;
    let y = at.y + 18;
    if (x + w > stage.clientWidth - 8) x = at.x - w - 12;
    if (y + h > stage.clientHeight - 8) y = at.y - h - 12;
    popup.style.transform = `translate(${Math.max(8, x)}px, ${Math.max(8, y)}px)`;
  }, []);

  const handleHover = useCallback(
    ({ code, clientX, clientY }: HoverEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      if (code && !clear) return;
      const r = stage.getBoundingClientRect();
      pointRef.current = code ? { x: clientX - r.left, y: clientY - r.top } : null;
      setActiveCode(code);
      placePopup();
    },
    [clear, placePopup],
  );

  // A new state changes the popup's width, so place it again after it renders.
  useLayoutEffect(placePopup, [activeCode, placePopup]);

  const handleActivate = useCallback(
    (code: string) => {
      if (clear && jurisdictionKind(code) === 'file') onStartFiling(code);
    },
    [clear, onStartFiling],
  );

  // Keyboard users can tab into the map before scrolling. Jump to the sharp map for them.
  // The scroll waits one frame so the browser's own focus scrolling does not undo it.
  const handleFocusMap = useCallback(() => {
    if (clear) return;
    requestAnimationFrame(() => {
      const hero = heroRef.current;
      if (!hero) return;
      const top = hero.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (hero.offsetHeight - window.innerHeight) * CLEAR_AT + 1 });
    });
  }, [clear]);

  // When the map turns sharp while a state has keyboard focus, show that state's flag and popup.
  useEffect(() => {
    if (!clear) return;
    const el = document.activeElement;
    const code = el?.getAttribute('data-code');
    if (!el || !code || !stageRef.current?.contains(el)) return;
    const r = el.getBoundingClientRect();
    handleHover({ code, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
  }, [clear, handleHover]);

  return (
    <div className="lp">
      <section className="lp-hero" ref={heroRef} aria-label="Choose your state">
        <div className="lp-stage" ref={stageRef} data-clear={clear}>
          <div className="lp-map-wrap">
            <UsMap activeCode={activeCode} onHover={handleHover} onActivate={handleActivate} onFocusMap={handleFocusMap} />
          </div>
          <h1 className="lp-headline">Filing your state taxes should be free.</h1>
          <p className="lp-hint">{touchFirst ? 'Tap your state to start' : 'Hover over your state to start'}</p>
          <p className="lp-scroll-cue" aria-hidden="true">Scroll</p>
          <canvas className="lp-fx" ref={canvasRef} aria-hidden="true" />
          <div className="lp-popup" ref={popupRef} role="status" hidden={!activeCode}>
            {activeCode && <PopupText code={activeCode} />}
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <p>
          Everything you enter stays on your computer. Stateful Taxes has no accounts and no servers that see
          your data, and it fills in the official state PDF in your browser.
        </p>
        <p>
          Stateful Taxes is not affiliated with the IRS or any state tax agency. Check every form before you
          mail it. We are not liable for errors on forms made with this site.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
