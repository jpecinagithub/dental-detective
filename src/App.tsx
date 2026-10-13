import { useState } from 'react';
import GameScreen from './components/GameScreen';
import Landing from './components/Landing';
import Leaderboard from './components/Leaderboard';
import { LanguageProvider, useLang } from './i18n';

type View = 'landing' | 'game' | 'scores';

function Shell() {
  const [view, setView] = useState<View>('landing');
  const { t, lang, setLang } = useLang();

  return (
    <div className="app">
      {view !== 'game' && (
        <div className="lang-float">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
      )}
      {view === 'landing' && (
        <Landing onPlay={() => setView('game')} onScores={() => setView('scores')} />
      )}
      {view === 'game' && <GameScreen onExit={() => setView('landing')} />}
      {view === 'scores' && <Leaderboard onBack={() => setView('landing')} />}
      {view !== 'game' && (
        <footer className="footer">
          {t('developedBy')} · <a href="mailto:jpecina@gmail.com">jpecina@gmail.com</a>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
