import { useCallback, useEffect, useState } from 'react';
import { CASES } from '../game/cases';
import type { DentalCase, Treatment } from '../game/cases';
import { answer, currentCase, newGame } from '../game/logic';
import type { GameState } from '../game/logic';
import { loadScores, saveScore } from '../game/scores';
import { treatmentName, useLang } from '../i18n';
import type { Lang } from '../i18n';
import ClinicScene3D from './ClinicScene3D';
import { startMusic, stopMusic, setMuted as setMusicMuted, isMuted as isMusicMuted } from '../game/music';

type Phase = 'welcome' | 'case' | 'reveal' | 'end';

function WelcomeModal({ onStart }: { onStart: () => void }) {
  const { t } = useLang();
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">🦷</div>
        <h2 className="modal-title">{t('welcomeTitle')}</h2>
        <p className="modal-sub">{t('welcomeSubtitle')}</p>
        <p>{t('welcomeText1')}</p>
        <p className="warn">{t('welcomeText2')}</p>
        <div className="score-box">
          <div className="score-row"><span>💰 {t('startBalance')}:</span><strong className="gold">75 {t('points')}</strong></div>
          <div className="score-row"><span>✅ {t('correctDx')}:</span><strong className="green">+30 {t('points')}</strong></div>
          <div className="score-row"><span>❌ {t('wrongDx')}:</span><strong className="red">−50 {t('points')}</strong></div>
          <p className="score-note">{t('endsBelowZero')}</p>
        </div>
        <button className="btn btn-primary btn-big" onClick={onStart}>▶ {t('openClinic')}</button>
      </div>
    </div>
  );
}

function GuideModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{t('guideTitle')}</h2>
        <ol className="guide-list">
          <li>{t('guide1')}</li>
          <li>{t('guide2')}</li>
          <li>{t('guide3')}</li>
          <li>{t('guide4')}</li>
        </ol>
        <button className="btn btn-primary" onClick={onClose}>{t('close')}</button>
      </div>
    </div>
  );
}

function PatientCard({ dentalCase, patientNo, total, hidden }: {
  dentalCase: DentalCase; patientNo: number; total: number; hidden: boolean;
}) {
  const { t, lang } = useLang();
  const text = dentalCase[lang];
  return (
    <aside className="patient-card">
      <div className="pc-head">
        <span className="pc-name">💬 {dentalCase.name}</span>
        <span className="pc-case">{t('caseOf')} {patientNo}/{total}</span>
      </div>
      <p className="pc-age">{dentalCase.age} {t('yearsOld')}</p>
      {hidden ? (
        <p className="pc-hidden">🙈 ···</p>
      ) : (
        <>
          <p className="pc-symptom">“{text.symptom}”</p>
          <div className="clue-box">
            <strong>{t('clinicalClue')}:</strong>
            <p>{text.clue}</p>
          </div>
        </>
      )}
    </aside>
  );
}

export default function GameScreen({ onExit }: { onExit: () => void }) {
  const { t, lang, setLang } = useLang();
  const [game, setGame] = useState<GameState>(() => newGame(CASES));
  // NB: same shuffle as `game` above — a second newGame() call would desync display from logic
  const [caseId, setCaseId] = useState<number>(() => game.order[0]);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [zoom, setZoom] = useState<1 | 2 | 3>(1);
  const [hidden, setHidden] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [name, setName] = useState('');
  const [mutedUi, setMutedUi] = useState(isMusicMuted());

  useEffect(() => {
    startMusic();
    return () => stopMusic();
  }, []);

  const toggleMute = useCallback(() => {
    const m = !mutedUi;
    setMusicMuted(m);
    setMutedUi(m);
  }, [mutedUi]);
  const [saved, setSaved] = useState(false);

  const activeCase = CASES.find((c) => c.id === caseId) as DentalCase;
  const patientNo = game.order.indexOf(caseId) + 1;
  const treated = game.correct + game.wrong;

  const doPick = (tr: Treatment) => {
    if (phase !== 'case') return;
    setGame((g) => answer(g, CASES, tr));
    setPhase('reveal');
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (phase !== 'case' || showGuide) return;
      const k = ev.key.toLowerCase();
      if (k === 'e') setZoom((z) => (z >= 3 ? 1 : ((z + 1) as 1 | 2 | 3)));
      else if (k === '1') doPick('filling');
      else if (k === '2') doPick('extraction');
      else if (k === '3') doPick('rootcanal');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, game, showGuide]);

  const next = () => {
    if (game.status !== 'playing') {
      setPhase('end');
      return;
    }
    const c = currentCase(game, CASES);
    setCaseId(c.id);
    setZoom(1);
    setHidden(false);
    setPhase('case');
  };

  const playAgain = () => {
    const g = newGame(CASES);
    setGame(g);
    setCaseId(g.order[0]);
    setZoom(1);
    setHidden(false);
    setName('');
    setSaved(false);
    setPhase('case');
  };

  const result = game.lastResult;
  const revealed = result ? CASES.find((c) => c.id === result.caseId) as DentalCase : null;

  return (
    <div className="game">
      {phase === 'welcome' && <WelcomeModal onStart={() => setPhase('case')} />}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      <header className="hud">
        <span className="chip chip-clinic">{t('clinicName').toUpperCase()}</span>
        <span className="chip">{t('balance')}: <strong className={game.balance < 30 ? 'red' : 'green'}>{game.balance} {t('pts')}</strong></span>
        <span className="chip">🏅 {t('patients')}: <strong>{treated}</strong></span>
        {(phase === 'case' || phase === 'reveal') && (
          <span className="chip">🫀 {t('patient')} #{patientNo}: <strong>{activeCase.name}</strong></span>
        )}
        <span className="hud-spacer" />
        <button className={`chip chip-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`chip chip-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>ES</button>
        <button className="chip chip-btn" onClick={() => setShowGuide(true)}>❓ {t('guide')}</button>
        <button
          className="chip chip-btn"
          onClick={toggleMute}
          title={lang === 'es' ? 'Activar/silenciar música' : 'Mute/unmute music'}
          aria-label={lang === 'es' ? 'Activar/silenciar música' : 'Mute/unmute music'}
        >
          {mutedUi ? '🔇' : '🔊'}
        </button>
        <button className="chip chip-btn chip-menu" onClick={onExit}>☰ {t('menu')}</button>
      </header>

      {(phase === 'case' || phase === 'reveal') && (
        <>
          <main className="game-main">
            <ClinicScene3D dentalCase={activeCase} zoom={zoom} />
            <PatientCard dentalCase={activeCase} patientNo={patientNo} total={CASES.length} hidden={hidden} />
          </main>

          <footer className="controls">
            <div className="controls-row">
              <button className="btn btn-ghost" onClick={() => setZoom((z) => (z >= 3 ? 1 : ((z + 1) as 1 | 2 | 3)))} disabled={phase !== 'case'}>
                👁 {zoom}/3. {t('examine')} (<kbd>E</kbd>)
              </button>
              <button className="btn btn-ghost" onClick={() => setHidden((h) => !h)}>
                💬 {hidden ? t('showSymptoms') : t('hideSymptoms')}
              </button>
            </div>
            <div className="treat-row">
              <button className="treat-btn treat-filling" onClick={() => doPick('filling')} disabled={phase !== 'case'}>
                <span className="treat-num">1. {t('tFilling')}</span>
                <span className="treat-sub">✨ {t('tFillingSub')}</span>
              </button>
              <button className="treat-btn treat-extraction" onClick={() => doPick('extraction')} disabled={phase !== 'case'}>
                <span className="treat-num">2. {t('tExtraction')}</span>
                <span className="treat-sub">〰️ {t('tExtractionSub')}</span>
              </button>
              <button className="treat-btn treat-rootcanal" onClick={() => doPick('rootcanal')} disabled={phase !== 'case'}>
                <span className="treat-num">3. {t('tRootcanal')}</span>
                <span className="treat-sub">⚡ {t('tRootcanalSub')}</span>
              </button>
            </div>
          </footer>
        </>
      )}

      {phase === 'reveal' && result && revealed && (
        <div className="modal-overlay">
          <div className={`modal reveal ${result.correct ? 'reveal-good' : 'reveal-bad'}`}>
            <div className="reveal-badge">{result.correct ? '✅' : '❌'}</div>
            <h2 className="modal-title">{result.correct ? t('correctTitle') : t('wrongTitle')}</h2>
            <p className="reveal-points">{result.correct ? '+30' : '−50'} {t('pts')}</p>
            {!result.correct && (
              <p>{t('rightWas')}: <strong>{treatmentName(result.expected, lang as Lang)}</strong></p>
            )}
            <p className="reveal-expl">{revealed[lang as Lang].explanation}</p>
            <button className="btn btn-primary btn-big" onClick={next}>
              {game.status === 'playing' ? t('nextPatient') : t('seeResults')} →
            </button>
          </div>
        </div>
      )}

      {phase === 'end' && (
        <div className="end-screen">
          <div className="modal end-modal">
            <div className="modal-icon">{game.status === 'won' ? '🏆' : '🚪'}</div>
            <h2 className="modal-title">{game.status === 'won' ? t('victory') : t('gameOver')}</h2>
            <p>{game.status === 'won' ? t('victoryText') : t('gameOverText')}</p>
            <div className="end-stats">
              <div><span>{t('finalScore')}</span><strong>{game.balance} {t('pts')}</strong></div>
              <div><span>{t('accuracy')}</span><strong>{treated ? Math.round((game.correct / treated) * 100) : 0}%</strong></div>
              <div><span>{t('patients')}</span><strong>{treated}/{CASES.length}</strong></div>
            </div>
            {game.status === 'won' && !saved && (
              <div className="save-row">
                <span>{t('enterName')}</span>
                <div className="save-input-row">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('yourName')}
                    maxLength={24}
                  />
                  <button
                    className="btn btn-primary"
                    disabled={!name.trim()}
                    onClick={() => {
                      saveScore({
                        name: name.trim(),
                        score: game.balance,
                        correct: game.correct,
                        total: CASES.length,
                        date: new Date().toISOString().slice(0, 10),
                      });
                      setSaved(true);
                    }}
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            )}
            {saved && <p className="green">✅ {t('leaderboard')}</p>}
            <div className="end-actions">
              <button className="btn btn-primary" onClick={playAgain}>↻ {t('playAgain')}</button>
              <button className="btn btn-ghost" onClick={onExit}>{t('backToMenu')}</button>
            </div>
            {loadScores().length > 0 && (
              <p className="score-note">🏅 {t('leaderboard')}: {loadScores()[0].name} — {loadScores()[0].score} {t('pts')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
