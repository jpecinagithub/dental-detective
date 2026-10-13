import { loadScores } from '../game/scores';
import { useLang } from '../i18n';

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const { t } = useLang();
  const scores = loadScores();
  return (
    <div className="scores-page">
      <div className="modal scores-modal">
        <h2 className="modal-title">🏅 {t('leaderboard')}</h2>
        {scores.length === 0 ? (
          <p>{t('noScores')}</p>
        ) : (
          <table className="score-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('yourName')}</th>
                <th>{t('score')}</th>
                <th>{t('accuracy')}</th>
                <th>{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={`${s.date}-${i}`} className={i === 0 ? 'top1' : ''}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td><strong>{s.score}</strong></td>
                  <td>{Math.round((s.correct / 15) * 100)}%</td>
                  <td>{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="btn btn-ghost" onClick={onBack}>← {t('back')}</button>
      </div>
    </div>
  );
}
