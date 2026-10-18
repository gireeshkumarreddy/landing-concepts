// Original illustrated avatars for the invented sample customers, drawn in code on a 64 × 64 grid
// (framed to its 50 × 50 centre, so the face fills the circle).
// Every face is built the same way (one set of eyes, brows, nose and smile); people differ by
// face shape, skin tone, hair, clothing and accessories — set per person in `look` (data.js).
// Shapes are kept bold so each portrait still reads at 20–46 px.

const SKIN = {
  fair: { base: '#f6d4ba', shade: '#e6b896', lip: '#b8605a' },
  light: { base: '#f0c9a2', shade: '#dcab80', lip: '#b25d50' },
  olive: { base: '#dcab83', shade: '#c38f67', lip: '#a3523f' },
  tan: { base: '#c78e64', shade: '#ac764f', lip: '#8f4434' },
  medium: { base: '#b07650', shade: '#946040', lip: '#7c3a2c' },
  deep: { base: '#7c4c31', shade: '#663c25', lip: '#4a2218' },
  rich: { base: '#5e3a27', shade: '#4b2c1c', lip: '#381810' },
};

const FACES = {
  oval: { w: 11, hb: 13.6, jaw: 0.48 },
  round: { w: 12, hb: 12.6, jaw: 0.7 },
  long: { w: 10.6, hb: 14.4, jaw: 0.56 },
  square: { w: 11.6, hb: 13, jaw: 0.84 },
  heart: { w: 11.5, hb: 13.6, jaw: 0.36 },
};

const CX = 32;
const CY = 28; // centre of the head; the crown sits 13 units above it
const HT = 13;
const INK = '#1b1426';

const f = n => +n.toFixed(2);

function headPath({ w, hb, jaw }) {
  return `M${f(CX - w)},${CY}A${w} ${HT} 0 0 1 ${f(CX + w)},${CY}C${f(CX + w)},${f(CY + hb * 0.55)} ${f(CX + w * jaw)},${f(CY + hb)} ${CX},${f(CY + hb)}C${f(CX - w * jaw)},${f(CY + hb)} ${f(CX - w)},${f(CY + hb * 0.55)} ${f(CX - w)},${CY}Z`;
}

/* ---------- hair: a back layer (behind the head) and a front layer (over the forehead) ---------- */
function hairShapes(style, w, color, shade) {
  const L = d => f(CX - w + d); // x measured in from the left face edge
  const R = d => f(CX + w - d); // x measured in from the right face edge
  switch (style) {
    case 'long': // centre parting, falls past the shoulders
      return {
        back: <path d={`M${L(-3.6)},28C${L(-4.4)},10 ${R(-4.4)},10 ${R(-3.6)},28L${R(-5)},53Q${CX},58.5 ${L(-5)},53Z`} fill={color} />,
        front: (
          <path
            d={`M${L(-1.8)},36C${L(-3)},6 ${R(-3)},6 ${R(-1.8)},36C${R(-0.2)},27 ${R(0.6)},21 ${f(CX + 3.6)},17.6Q${f(CX + 0.6)},16.8 ${CX},19.2Q${f(CX - 0.6)},16.8 ${f(CX - 3.6)},17.6C${L(0.6)},21 ${L(-0.2)},27 ${L(-1.8)},36Z`}
            fill={color}
          />
        ),
      };
    case 'sweep': // short, side-swept with a soft wave
      return {
        front: (
          <>
            <path
              d={`M${L(-0.8)},28.6C${L(-2.6)},10 ${R(-2.8)},9.4 ${R(-0.8)},27.6L${R(0.5)},23.4C${R(1.6)},20 ${f(CX + 3)},18.6 ${f(CX - 1.5)},19.8C${f(CX - 5.5)},20.8 ${L(1.6)},23 ${L(0.8)},25.4Z`}
              fill={color}
            />
            <path d={`M${f(CX - 5)},17.6C${f(CX - 1)},15.6 ${f(CX + 3.5)},15.8 ${R(2)},18.8`} stroke={shade} strokeWidth="1" strokeLinecap="round" fill="none" />
          </>
        ),
      };
    case 'afro': // rounded natural curls
      return {
        back: (
          <g fill={color}>
            <circle cx={CX} cy="24.2" r="15.2" />
            {[186, 208, 230, 252, 274, 296, 318, 340, 2].map(a => {
              const r = (a * Math.PI) / 180;
              return <circle key={a} cx={f(CX + 14.4 * Math.cos(r))} cy={f(24.2 + 14.4 * Math.sin(r))} r="3.1" />;
            })}
          </g>
        ),
        front: <path d={`M${L(-0.6)},28C${L(-1)},10 ${R(-1)},10 ${R(-0.6)},28C${R(0.8)},22.6 ${f(CX + 6)},20.2 ${CX},20.4C${f(CX - 6)},20.2 ${L(0.8)},22.6 ${L(-0.6)},28Z`} fill={color} />,
      };
    case 'bob': // chin-length bob with a straight fringe
      return {
        back: <path d={`M${L(-3.2)},22C${L(-3.8)},9 ${R(-3.8)},9 ${R(-3.2)},22L${R(-3.6)},35.4Q${R(-3.6)},40.6 ${R(1.6)},40L${L(1.6)},40Q${L(-3.6)},40.6 ${L(-3.6)},35.4Z`} fill={color} />,
        front: (
          <>
            <path
              d={`M${L(-3.4)},34.6C${L(-4.2)},8.4 ${R(-4.2)},8.4 ${R(-3.4)},34.6L${R(0.2)},34.6C${R(-0.2)},28 ${R(0.2)},25.4 ${R(1.6)},23.6Q${CX},25.4 ${L(1.6)},23.6C${L(0.2)},25.4 ${L(-0.2)},28 ${L(0.2)},34.6Z`}
              fill={color}
            />
            <path d={`M${f(CX - 6)},15.4Q${CX},12.6 ${f(CX + 6.5)},15`} stroke={shade} strokeWidth="1" strokeLinecap="round" fill="none" opacity=".7" />
          </>
        ),
      };
    case 'parted': // short, side parting, pushed up off the forehead
      return {
        front: (
          <>
            <path
              d={`M${L(-0.8)},27.4C${L(-2.2)},8.6 ${R(-2.2)},8.6 ${R(-0.8)},27.4C${R(0.4)},23 ${R(1.2)},20.4 ${f(CX + 5)},19.6Q${f(CX + 1)},19 ${f(CX - 3.2)},18.4C${L(2.6)},18.8 ${L(0.6)},22.2 ${L(-0.8)},27.4Z`}
              fill={color}
            />
            <path d={`M${f(CX - 3.4)},18.4C${f(CX - 3.6)},16.6 ${f(CX - 2.8)},15.2 ${f(CX - 0.8)},14.4`} stroke={shade} strokeWidth="1" strokeLinecap="round" fill="none" />
          </>
        ),
      };
    case 'bun': // smooth, pulled back into a high bun
      return {
        back: (
          <>
            <circle cx={CX} cy="12.8" r="6" fill={color} />
            <path d={`M${f(CX - 4)},11.2Q${CX},8.4 ${f(CX + 4)},11.4M${f(CX - 4.6)},14.4Q${CX},11.8 ${f(CX + 4.6)},14.6`} stroke={shade} strokeWidth=".9" fill="none" strokeLinecap="round" />
          </>
        ),
        front: (
          <>
            <path d={`M${L(-0.4)},27C${L(-1)},12.6 ${R(-1)},12.6 ${R(-0.4)},27C${R(0.8)},22 ${f(CX + 6)},19 ${CX},19.2C${f(CX - 6)},19 ${L(0.8)},22 ${L(-0.4)},27Z`} fill={color} />
            <path
              d={`M${f(CX - 7.2)},21.4Q${f(CX - 6)},17 ${f(CX - 2.8)},15.4M${f(CX + 7.2)},21.4Q${f(CX + 6)},17 ${f(CX + 2.8)},15.4`}
              stroke={shade}
              strokeWidth=".9"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ),
      };
    case 'crop': // short back and sides with a side parting
      return {
        front: (
          <path
            d={`M${L(-0.6)},27.4C${L(-1.6)},10.6 ${R(-1.6)},10.6 ${R(-0.6)},27.4C${R(0.6)},22.6 ${R(2)},20.6 ${f(CX + 4)},20.2C${f(CX - 1)},19.8 ${L(3)},20.4 ${L(0.9)},23.6C${L(0.5)},24.8 ${L(0.2)},26 ${L(-0.6)},27.4Z`}
            fill={color}
          />
        ),
      };
    case 'receding': // short, a little higher at the temples
      return {
        front: (
          <path
            d={`M${L(-0.6)},26.6C${L(-1.4)},10.4 ${R(-1.4)},10.4 ${R(-0.6)},26.6C${R(0.5)},23 ${R(1.4)},19.8 ${f(CX + 6.4)},19.4Q${CX},17.4 ${f(CX - 6.4)},19.4C${L(1.4)},19.8 ${L(0.5)},23 ${L(-0.6)},26.6Z`}
            fill={color}
          />
        ),
      };
    default:
      return {};
  }
}

/* ---------- clothing: shoulders plus a neckline ---------- */
function Top({ top, skin }) {
  const { color, trim, neck, inner } = top;
  return (
    <>
      <path d="M5,64C5,53.4 15.6,47.4 32,47.4C48.4,47.4 59,53.4 59,64Z" fill={color} />
      {/* neck runs on under the shoulder line, so no hairline of the top shows above the neckline */}
      <rect x="27.4" y="46.8" width="9.2" height="1.6" fill={skin.shade} />
      {neck === 'crew' && (
        <>
          <path d="M26.6,47.6Q32,52.4 37.4,47.6Z" fill={skin.shade} />
          <path d="M26.2,47.7Q32,53.2 37.8,47.7" stroke={trim} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {neck === 'scoop' && (
        <>
          <path d="M25.4,47.6Q32,56 38.6,47.6Z" fill={skin.shade} />
        </>
      )}
      {neck === 'v' && (
        <>
          <path d="M27.2,47.6L32,55L36.8,47.6Z" fill={skin.shade} />
          <path d="M26.6,47.6L32,56L37.4,47.6" stroke={trim} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        </>
      )}
      {neck === 'collar' && (
        <>
          <path d="M27.6,47.6L32,53.6L36.4,47.6Z" fill={skin.shade} />
          <path d="M26.4,46.6L32,53.4L29,56.2L24.4,48.6Z M37.6,46.6L32,53.4L35,56.2L39.6,48.6Z" fill={trim} />
        </>
      )}
      {neck === 'turtle' && (
        <>
          <path d="M26.2,48.4V44.6Q26.2,41.6 29.2,41.6H34.8Q37.8,41.6 37.8,44.6V48.4Z" fill={trim} />
          <path d="M27.4,45.4Q32,46.8 36.6,45.4" stroke={color} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".7" />
        </>
      )}
      {neck === 'open' && (
        <>
          <path d="M25.4,47.7Q32,50 38.6,47.7L36.6,64H27.4Z" fill={inner} />
          <path d="M28.2,47.8Q32,51.4 35.8,47.8Z" fill={skin.shade} />
          <path d="M25.4,47.7L28.4,64M38.6,47.7L35.6,64" stroke={trim} strokeWidth="1.3" />
        </>
      )}
    </>
  );
}

export default function Avatar({ person, size = 44, className = '' }) {
  const { look } = person;
  const skin = SKIN[look.skin];
  const face = FACES[look.face];
  const { w, hb } = face;
  const hair = hairShapes(look.hair.style, w, look.hair.color, look.hair.shade);
  const brow = look.hair.brow || look.hair.color;
  const eyeY = CY + 1.2;
  const ex = 4.6; // eye offset from the centre line
  return (
    <svg
      className={`ar-avatar ${className}`}
      viewBox="7 6 50 50"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="7" y="6" width="50" height="50" fill={look.bg} />
      <circle cx="22" cy="17" r="22" fill="#fff" opacity=".18" />
      {hair.back}
      <rect x="27.4" y={f(CY + hb - 7)} width="9.2" height="14" rx="3" fill={skin.shade} />
      <g transform="translate(0 -1.4)">
        <Top top={look.top} skin={skin} />
      </g>
      <ellipse cx={f(CX - w + 0.2)} cy={CY + 2} rx="2.3" ry="3.3" fill={skin.base} />
      <ellipse cx={f(CX + w - 0.2)} cy={CY + 2} rx="2.3" ry="3.3" fill={skin.base} />
      <path d={headPath(face)} fill={skin.base} />
      {look.freckles && (
        <g fill={skin.shade}>
          {[[-7.6, 5.4], [-6, 6.6], [-8.2, 7], [7.6, 5.4], [6, 6.6], [8.2, 7]].map(([x, y]) => (
            <circle key={`${x},${y}`} cx={CX + x} cy={CY + y} r=".55" />
          ))}
        </g>
      )}
      <g fill="#ff7c7c" opacity=".2">
        <circle cx={CX - 6.8} cy={CY + 6.4} r="2.4" />
        <circle cx={CX + 6.8} cy={CY + 6.4} r="2.4" />
      </g>
      {look.beard && (
        <g fill={look.beard}>
          <path
            d={`M${f(CX - w + 0.3)},${CY}C${f(CX - w + 0.2)},${f(CY + hb * 0.95)} ${CX - 4.5},${f(CY + hb + 1.8)} ${CX},${f(CY + hb + 1.8)}C${CX + 4.5},${f(CY + hb + 1.8)} ${f(CX + w - 0.2)},${f(CY + hb * 0.95)} ${f(CX + w - 0.3)},${CY}L${f(CX + w - 1.7)},${CY + 0.6}C${f(CX + w - 2.2)},${CY + 5.5} ${CX + 6.5},${CY + 8.4} ${CX + 4.6},${CY + 8.4}L${CX - 4.6},${CY + 8.4}C${CX - 6.5},${CY + 8.4} ${f(CX - w + 2.2)},${CY + 5.5} ${f(CX - w + 1.7)},${CY + 0.6}Z`}
          />
          <path d={`M${CX - 5},${CY + 8.6}C${CX - 3.5},${CY + 6} ${CX + 3.5},${CY + 6} ${CX + 5},${CY + 8.6}C${CX + 2.5},${CY + 7.8} ${CX - 2.5},${CY + 7.8} ${CX - 5},${CY + 8.6}Z`} />
        </g>
      )}
      {hair.front}
      {/* brows, eyes (with a catch-light), nose, smile */}
      <path
        d={`M${CX - ex - 2.2},${eyeY - 4}Q${CX - ex},${eyeY - 5.3} ${CX - ex + 2.2},${eyeY - 4.2}M${CX + ex - 2.2},${eyeY - 4.2}Q${CX + ex},${eyeY - 5.3} ${CX + ex + 2.2},${eyeY - 4}`}
        stroke={brow}
        strokeWidth="1.35"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx={CX - ex} cy={eyeY} rx="1.35" ry="1.6" fill={INK} />
      <ellipse cx={CX + ex} cy={eyeY} rx="1.35" ry="1.6" fill={INK} />
      <circle cx={CX - ex + 0.5} cy={eyeY - 0.6} r=".45" fill="#fff" />
      <circle cx={CX + ex + 0.5} cy={eyeY - 0.6} r=".45" fill="#fff" />
      <path d={`M${CX + 0.2},${CY + 3}Q${CX - 1.4},${CY + 5.8} ${CX + 0.9},${CY + 6.2}`} stroke={skin.shade} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path
        d={`M${CX - 3.3},${CY + 8.4}Q${CX},${CY + 11.2} ${CX + 3.3},${CY + 8.4}`}
        stroke={look.beard ? '#3a1d14' : skin.lip}
        strokeWidth="1.35"
        strokeLinecap="round"
        fill="none"
      />
      {look.glasses === 'round' && (
        <g stroke={look.glassesColor || '#2b2140'} strokeWidth="1.15" fill="#fff" fillOpacity=".12">
          <circle cx={CX - ex} cy={eyeY} r="3.2" />
          <circle cx={CX + ex} cy={eyeY} r="3.2" />
          <path d={`M${CX - ex + 3.2},${eyeY - 0.4}Q${CX},${eyeY - 1.4} ${CX + ex - 3.2},${eyeY - 0.4}`} fill="none" />
        </g>
      )}
      {look.glasses === 'square' && (
        <g stroke={look.glassesColor || '#2b2140'} strokeWidth="1.05" fill="#fff" fillOpacity=".12">
          <rect x={CX - ex - 3.3} y={eyeY - 2.5} width="6.6" height="5" rx="1.5" />
          <rect x={CX + ex - 3.3} y={eyeY - 2.5} width="6.6" height="5" rx="1.5" />
          <path d={`M${CX - ex + 3.3},${eyeY - 0.8}H${CX + ex - 3.3}`} fill="none" />
        </g>
      )}
      {look.earrings === 'stud' && (
        <g fill="#f2c14e">
          <circle cx={f(CX - w - 0.4)} cy={CY + 5.4} r="1.15" />
          <circle cx={f(CX + w + 0.4)} cy={CY + 5.4} r="1.15" />
        </g>
      )}
      {look.earrings === 'hoop' && (
        <g stroke="#f2c14e" strokeWidth="1.1" fill="none">
          <circle cx={f(CX - w - 0.3)} cy={CY + 7.6} r="2.4" />
          <circle cx={f(CX + w + 0.3)} cy={CY + 7.6} r="2.4" />
        </g>
      )}
    </svg>
  );
}
