import type { DentalCase, VisualCue } from '../game/cases';

const SKIN = ['#f6d7b8', '#eebd8d', '#d19a66', '#a06a3c', '#6f4426'];
const HAIR = ['#2b2b2b', '#6b4a2f', '#c9a06a', '#9aa0a6', '#d94f30'];
const SHIRT = ['#7c6cf0', '#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#f87171'];

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed * 7 + salt * 13) % arr.length];
}

interface Props {
  dentalCase: DentalCase;
  zoom: 1 | 2 | 3;
  clinicName: string;
  signSub: string;
}

function Tooth({ x, y, cue, upper }: { x: number; y: number; cue: VisualCue; upper: boolean }) {
  const w = 50;
  const h = 62;
  const cx = x + w / 2;
  return (
    <g>
      {cue === 'gumRed' && (
        <ellipse cx={cx} cy={upper ? y + 6 : y + h - 6} rx={32} ry={16} fill="#e05252" opacity={0.55} />
      )}
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#f7f3e8" stroke="#cfc8b4" strokeWidth={2} />
      {cue === 'stain' && <ellipse cx={cx} cy={y + h * 0.42} rx={11} ry={9} fill="#8a5a2b" opacity={0.85} />}
      {cue === 'crack' && (
        <polyline
          points={`${cx - 6},${y + 6} ${cx + 5},${y + h * 0.35} ${cx - 5},${y + h * 0.65} ${cx + 4},${y + h - 6}`}
          fill="none"
          stroke="#5a4a3a"
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}
      {cue === 'chip' && <polygon points={`${x + w - 18},${y} ${x + w},${y} ${x + w},${y + 20}`} fill="#3d0f1c" />}
    </g>
  );
}

function MouthExam({ dentalCase }: { dentalCase: DentalCase }) {
  const teeth: { x: number; y: number; upper: boolean; idx: number }[] = [];
  const startX = 400 - (8 * 54) / 2;
  for (let i = 0; i < 8; i++) {
    const arc = Math.abs(i - 3.5) * 7;
    teeth.push({ x: startX + i * 54, y: 168 + arc, upper: true, idx: i });
  }
  for (let i = 0; i < 8; i++) {
    const arc = Math.abs(i - 3.5) * 7;
    teeth.push({ x: startX + i * 54, y: 370 - arc, upper: false, idx: 8 + i });
  }
  return (
    <svg viewBox="0 0 800 600" className="mouth-svg" role="img" aria-label="Mouth examination">
      <defs>
        <radialGradient id="lipGrad" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#d98a80" />
          <stop offset="100%" stopColor="#a35a52" />
        </radialGradient>
      </defs>
      <ellipse cx={400} cy={300} rx={292} ry={188} fill="url(#lipGrad)" />
      <ellipse cx={400} cy={300} rx={248} ry={150} fill="#3d0f1c" />
      <ellipse cx={400} cy={408} rx={118} ry={38} fill="#a34a5a" />
      {teeth.map((t) => (
        <Tooth
          key={t.idx}
          x={t.x}
          y={t.y}
          upper={t.upper}
          cue={t.idx === dentalCase.tooth ? dentalCase.cue : 'none'}
        />
      ))}
    </svg>
  );
}

export default function ClinicScene({ dentalCase, zoom, clinicName, signSub }: Props) {
  const skin = pick(SKIN, dentalCase.id, 1);
  const hair = pick(HAIR, dentalCase.id, 2);
  const shirt = pick(SHIRT, dentalCase.id, 3);

  return (
    <div className="scene-frame">
      {zoom < 3 ? (
        <div
          className="scene-zoom"
          style={{
            transform: zoom === 2 ? 'scale(2.4)' : 'scale(1)',
            transformOrigin: '29% 39%',
          }}
        >
          <svg viewBox="0 0 1200 700" className="clinic-svg" role="img" aria-label={clinicName}>
            <defs>
              <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#101f38" />
                <stop offset="100%" stopColor="#0a1628" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#13253f" />
                <stop offset="100%" stopColor="#070d18" />
              </linearGradient>
              <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            <rect x={0} y={0} width={1200} height={470} fill="url(#wallGrad)" />
            <rect x={0} y={470} width={1200} height={230} fill="url(#floorGrad)" />
            <line x1={80} y1={585} x2={1120} y2={585} stroke="#22d3ee" strokeWidth={3} opacity={0.45} />

            {/* wall sign */}
            <rect x={70} y={66} width={520} height={112} rx={14} fill="#0f2a3a" stroke="#d4a24e" strokeWidth={3} />
            <text x={330} y={118} textAnchor="middle" fill="#7dd3fc" fontSize={34} fontWeight={800} fontFamily="inherit">
              {clinicName.toUpperCase()}
            </text>
            <text x={330} y={152} textAnchor="middle" fill="#d4a24e" fontSize={17} letterSpacing={3} fontFamily="inherit">
              {signSub.toUpperCase()}
            </text>

            {/* window light */}
            <polygon points="880,0 1010,0 940,470 760,470" fill="#fef9c3" opacity={0.05} />

            {/* lamp */}
            <line x1={730} y1={0} x2={660} y2={170} stroke="#334155" strokeWidth={18} strokeLinecap="round" />
            <circle cx={655} cy={185} r={30} fill="#475569" />
            <polygon points="628,205 682,205 760,470 550,470" fill="#fef9c3" opacity={0.1} />

            {/* chair */}
            <ellipse cx={620} cy={592} rx={95} ry={18} fill="#1e293b" />
            <rect x={600} y={500} width={40} height={95} fill="#334155" />
            <line x1={470} y1={430} x2={340} y2={265} stroke="url(#chairGrad)" strokeWidth={72} strokeLinecap="round" />
            <rect x={450} y={395} width={330} height={72} rx={30} fill="url(#chairGrad)" />
            <ellipse cx={352} cy={252} rx={52} ry={30} fill="#0e7490" />

            {/* patient */}
            <line x1={388} y1={312} x2={730} y2={400} stroke={shirt} strokeWidth={92} strokeLinecap="round" />
            <line x1={700} y1={395} x2={800} y2={440} stroke="#1e293b" strokeWidth={60} strokeLinecap="round" />
            <circle cx={352} cy={238} r={47} fill={hair} />
            <circle cx={352} cy={258} r={44} fill={skin} />
            <circle cx={342} cy={248} r={5} fill="#0f172a" />
            <ellipse cx={318} cy={278} rx={13} ry={17} fill="#5b1a26" />
            <rect x={310} y={268} width={16} height={8} rx={3} fill="#f7f3e8" />

            {/* dentist */}
            <line x1={150} y1={330} x2={150} y2={510} stroke="#eef2f7" strokeWidth={80} strokeLinecap="round" />
            <line x1={150} y1={330} x2={150} y2={510} stroke="#cbd5e1" strokeWidth={6} />
            <line x1={132} y1={505} x2={132} y2={610} stroke="#1e3a5f" strokeWidth={28} strokeLinecap="round" />
            <line x1={168} y1={505} x2={168} y2={610} stroke="#1e3a5f" strokeWidth={28} strokeLinecap="round" />
            <circle cx={150} cy={262} r={35} fill={hair} />
            <circle cx={150} cy={280} r={34} fill="#eebd8d" />
            <rect x={116} y={288} width={68} height={28} rx={9} fill="#7dd3fc" />
            <circle cx={138} cy={276} r={4} fill="#0f172a" />
            <circle cx={162} cy={276} r={4} fill="#0f172a" />
            <line x1={175} y1={370} x2={300} y2={305} stroke="#eef2f7" strokeWidth={28} strokeLinecap="round" />
            <circle cx={306} cy={302} r={15} fill="#eebd8d" />
            <line x1={312} y1={298} x2={342} y2={278} stroke="#94a3b8" strokeWidth={8} strokeLinecap="round" />
            <circle cx={348} cy={272} r={13} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={4} />

            {/* cabinet */}
            <rect x={950} y={390} width={180} height={150} rx={10} fill="#1e293b" stroke="#334155" strokeWidth={2} />
            <line x1={950} y1={440} x2={1130} y2={440} stroke="#334155" strokeWidth={2} />
            <line x1={950} y1={490} x2={1130} y2={490} stroke="#334155" strokeWidth={2} />
            <rect x={1025} y={408} width={30} height={8} rx={4} fill="#475569" />
            <rect x={1025} y={458} width={30} height={8} rx={4} fill="#475569" />
            <rect x={1025} y={508} width={30} height={8} rx={4} fill="#475569" />
            <rect x={975} y={352} width={26} height={38} rx={4} fill="#0ea5e9" />
            <rect x={1010} y={360} width={20} height={30} rx={4} fill="#34d399" />

            {/* plant */}
            <polygon points="880,540 930,540 920,600 890,600" fill="#b45309" />
            <circle cx={905} cy={500} r={34} fill="#16a34a" />
            <circle cx={880} cy={520} r={24} fill="#22c55e" />
            <circle cx={930} cy={520} r={24} fill="#15803d" />

            {/* stool */}
            <ellipse cx={855} cy={560} rx={34} ry={12} fill="#334155" />
            <rect x={849} y={560} width={12} height={50} fill="#475569" />
          </svg>
        </div>
      ) : (
        <div className="mouth-overlay">
          <MouthExam dentalCase={dentalCase} />
        </div>
      )}
    </div>
  );
}
