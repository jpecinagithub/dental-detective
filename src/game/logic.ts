import type { DentalCase, Treatment } from './cases';

export const START_BALANCE = 75;
export const CORRECT_POINTS = 30;
export const WRONG_POINTS = -50;

export type GameStatus = 'playing' | 'won' | 'lost';

export interface LastResult {
  correct: boolean;
  picked: Treatment;
  expected: Treatment;
  caseId: number;
}

export interface GameState {
  order: number[];
  index: number;
  balance: number;
  correct: number;
  wrong: number;
  status: GameStatus;
  lastResult: LastResult | null;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newGame(cases: DentalCase[]): GameState {
  return {
    order: shuffle(cases.map((c) => c.id)),
    index: 0,
    balance: START_BALANCE,
    correct: 0,
    wrong: 0,
    status: 'playing',
    lastResult: null,
  };
}

export function currentCase(state: GameState, cases: DentalCase[]): DentalCase {
  const found = cases.find((c) => c.id === state.order[state.index]);
  if (!found) throw new Error('currentCase: case not found for game state');
  return found;
}

export function answer(state: GameState, cases: DentalCase[], picked: Treatment): GameState {
  if (state.status !== 'playing') return state;
  const dentalCase = currentCase(state, cases);
  const correct = picked === dentalCase.treatment;
  const balance = state.balance + (correct ? CORRECT_POINTS : WRONG_POINTS);
  const nextIndex = state.index + 1;
  const finished = nextIndex >= state.order.length;
  const status: GameStatus = balance < 0 ? 'lost' : finished ? 'won' : 'playing';
  return {
    ...state,
    index: nextIndex,
    balance,
    correct: state.correct + (correct ? 1 : 0),
    wrong: state.wrong + (correct ? 0 : 1),
    status,
    lastResult: { correct, picked, expected: dentalCase.treatment, caseId: dentalCase.id },
  };
}

/** Case that was just answered (index already advanced). */
export function answeredCase(state: GameState, cases: DentalCase[]): DentalCase {
  const found = cases.find((c) => c.id === state.order[state.index - 1]);
  if (!found) throw new Error('answeredCase: case not found for game state');
  return found;
}
