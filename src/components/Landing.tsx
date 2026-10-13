import { useLang } from '../i18n';

function HeroArt() {
  return (
    <svg viewBox="0 0 420 420" className="hero-art" role="img" aria-label="Dental detective">
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="toothGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfe8f5" />
        </linearGradient>
      </defs>
      <circle cx={210} cy={200} r={190} fill="url(#heroGlow)" />
      <path
        d="M150 90 C150 66 172 56 196 66 C206 71 214 71 224 66 C248 56 270 66 270 90 C270 130 258 148 252 182 C246 216 240 246 226 246 C212 246 212 214 210 214 C208 214 208 246 194 246 C180 246 174 216 168 182 C162 148 150 130 150 90 Z"
        fill="url(#toothGrad)"
        stroke="#7dd3fc"
        strokeWidth={5}
      />
      <circle cx={188} cy={120} r={9} fill="#0f172a" />
      <circle cx={232} cy={120} r={9} fill="#0f172a" />
      <circle cx={191} cy={117} r={3} fill="#fff" />
      <circle cx={235} cy={117} r={3} fill="#fff" />
      <path d="M196 148 Q210 158 224 148" stroke="#0f172a" strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={292} cy={262} r={62} fill="none" stroke="#d4a24e" strokeWidth={12} />
      <line x1={338} y1={308} x2={392} y2={362} stroke="#d4a24e" strokeWidth={16} strokeLinecap="round" />
      <g fill="#fef9c3">
        <circle cx={96} cy={300} r={7} />
        <circle cx={330} cy={96} r={6} />
        <circle cx={356} cy={180} r={5} />
      </g>
      <path d="M96 288 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 Z" fill="#fef9c3" />
      <path d="M330 84 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 Z" fill="#fef9c3" />
    </svg>
  );
}

export default function Landing({ onPlay, onScores }: { onPlay: () => void; onScores: () => void }) {
  const { t } = useLang();
  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-text">
          <h1 className="hero-title">{t('appTitle')}</h1>
          <p className="hero-author">🧑‍⚕️ {t('author')}</p>
          <p className="hero-tagline">{t('tagline')}</p>
          <div className="tags">
            <span className="tag">▶ {t('tagCases')}</span>
            <span className="tag">👤 {t('tagPlayers')}</span>
            <span className="tag">🧩 {t('tagGenre')}</span>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary btn-big" onClick={onPlay}>{t('playNow')}</button>
            <button className="btn btn-dark" onClick={onScores}>🏅 {t('leaderboard')}</button>
          </div>
        </div>
        <HeroArt />
      </div>
    </div>
  );
}
