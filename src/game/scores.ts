export interface ScoreEntry {
  name: string;
  score: number;
  correct: number;
  date: string;
}

const KEY = 'dental-detective-3d-leaderboard';

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(arr) ? arr.sort((a, b) => b.score - a.score).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry): ScoreEntry[] {
  const all = [...loadScores(), entry].sort((a, b) => b.score - a.score).slice(0, 20);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
  return all;
}
