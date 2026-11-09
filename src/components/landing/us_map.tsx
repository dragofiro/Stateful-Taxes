// Outline map of the 50 states, a D.C. marker and a Puerto Rico inset.
// Every shape has its own flag layer built up front, so hover only changes visibility.
import { memo, useId, useRef, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { DC_ANCHOR, MAP_HEIGHT, MAP_SHAPES, MAP_WIDTH, type MapShape } from './us_map_data.ts';
import { flagUrl, jurisdictionKind, jurisdictionName } from './jurisdictions.ts';

const DC_R = 8;
const DC_CENTER = { x: DC_ANCHOR.x + 44, y: DC_ANCHOR.y + 26 };
const DC_SHAPE: MapShape = {
  code: 'DC',
  d: `M${DC_CENTER.x - DC_R},${DC_CENTER.y}a${DC_R},${DC_R} 0 1,0 ${2 * DC_R},0a${DC_R},${DC_R} 0 1,0 ${-2 * DC_R},0Z`,
  box: { x: DC_CENTER.x - DC_R, y: DC_CENTER.y - DC_R, w: 2 * DC_R, h: 2 * DC_R },
};
const STATES = MAP_SHAPES.filter((s) => s.code !== 'PR');
const PR_SHAPE = MAP_SHAPES.find((s) => s.code === 'PR');
const ALL_SHAPES: readonly MapShape[] = [...MAP_SHAPES, DC_SHAPE];
const SHAPE_BY_CODE = new Map(ALL_SHAPES.map((s) => [s.code, s]));

export const MAP_CODES: readonly string[] = ALL_SHAPES.map((s) => s.code);

export interface HoverEvent {
  code: string | null;
  /** Viewport coordinates of the pointer, or of the shape's center for keyboard focus. */
  clientX: number;
  clientY: number;
}

interface UsMapProps {
  activeCode: string | null;
  onHover: (e: HoverEvent) => void;
  onActivate: (code: string) => void;
  onFocusMap?: () => void;
}

function ariaLabel(code: string): string {
  const name = jurisdictionName(code);
  switch (jurisdictionKind(code)) {
    case 'no-tax': return `${name}: no state taxes needed`;
    case 'coming-soon': return `${name}: coming soon`;
    default: return `Start filing for ${name}`;
  }
}

function codeFromEvent(e: { target: EventTarget }): string | null {
  const el = (e.target as Element).closest?.('[data-code]');
  return el?.getAttribute('data-code') ?? null;
}

function UsMapImpl({ activeCode, onHover, onActivate, onFocusMap }: UsMapProps) {
  const uid = useId().replace(/:/g, '');
  const lastPointer = useRef<string>('mouse');
  const active = activeCode ? SHAPE_BY_CODE.get(activeCode) : undefined;

  const shapeProps = (code: string) => ({
    'data-code': code,
    className: `lp-shape lp-shape--${jurisdictionKind(code)}`,
    tabIndex: 0,
    role: jurisdictionKind(code) === 'file' ? 'link' : 'img',
    'aria-label': ariaLabel(code),
  });

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    lastPointer.current = e.pointerType;
    if (e.pointerType !== 'mouse') return; // touch and pen preview on tap instead
    onHover({ code: codeFromEvent(e), clientX: e.clientX, clientY: e.clientY });
  };

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    lastPointer.current = e.pointerType;
  };

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    const code = codeFromEvent(e);
    if (!code) return;
    // On touch screens the first tap previews the state, the second tap starts filing.
    if (lastPointer.current !== 'mouse' && code !== activeCode) {
      onHover({ code, clientX: e.clientX, clientY: e.clientY });
      return;
    }
    onActivate(code);
  };

  const handleKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const code = codeFromEvent(e);
    if (!code) return;
    e.preventDefault();
    onActivate(code);
  };

  const handleFocus = (e: FocusEvent<SVGSVGElement>) => {
    const code = codeFromEvent(e);
    if (!code) return;
    onFocusMap?.();
    const r = (e.target as Element).getBoundingClientRect();
    onHover({ code, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
  };

  return (
    <svg
      className="lp-map"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="group"
      aria-label="Map of the United States. Choose a state to start filing."
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onHover({ code: null, clientX: 0, clientY: 0 })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={() => onHover({ code: null, clientX: 0, clientY: 0 })}
    >
      <defs>
        {ALL_SHAPES.map((s) => (
          <clipPath key={s.code} id={`${uid}-clip-${s.code}`}>
            <path d={s.d} />
          </clipPath>
        ))}
      </defs>

      <g>
        {STATES.map((s) => (
          <path key={s.code} d={s.d} {...shapeProps(s.code)} />
        ))}
      </g>

      {PR_SHAPE && (
        <g className="lp-extra">
          <path d={PR_SHAPE.d} {...shapeProps('PR')} />
          <text className="lp-map-label" x={PR_SHAPE.box.x + PR_SHAPE.box.w / 2} y={PR_SHAPE.box.y + PR_SHAPE.box.h + 13} textAnchor="middle">
            P.R.
          </text>
        </g>
      )}

      <g className="lp-extra">
        <line className="lp-leader" x1={DC_ANCHOR.x} y1={DC_ANCHOR.y} x2={DC_CENTER.x - DC_R * 0.7} y2={DC_CENTER.y - DC_R * 0.7} />
        <circle cx={DC_CENTER.x} cy={DC_CENTER.y} r={DC_R} {...shapeProps('DC')} />
        <text className="lp-map-label" x={DC_CENTER.x + DC_R + 5} y={DC_CENTER.y + 3.5}>D.C.</text>
      </g>

      {/* Flag layers: all mounted and loaded now, only the active one is visible. */}
      <g aria-hidden="true">
        {ALL_SHAPES.map((s) => (
          <image
            key={s.code}
            href={flagUrl(s.code)}
            x={s.box.x}
            y={s.box.y}
            width={s.box.w}
            height={s.box.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${uid}-clip-${s.code})`}
            visibility={s.code === activeCode ? 'visible' : 'hidden'}
            className="lp-flag"
          />
        ))}
      </g>

      {active && <path className="lp-active-outline" d={active.d} aria-hidden="true" />}
    </svg>
  );
}

export const UsMap = memo(UsMapImpl);
