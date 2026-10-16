import { describe, expect, it } from 'vitest';
import { CASES } from './cases';
import {
  CORRECT_POINTS,
  START_BALANCE,
  WRONG_POINTS,
  answer,
  currentCase,
  newGame,
  shuffle,
} from './logic';
import type { GameState } from './logic';

describe('cases data integrity', () => {
  it('has exactly 10 unique cases', () => {
    expect(CASES).toHaveLength(10);
    expect(new Set(CASES.map((c) => c.id)).size).toBe(10);
  });

  it('uses each treatment a balanced number of times', () => {
    const counts: Record<string, number> = {};
    for (const c of CASES) counts[c.treatment] = (counts[c.treatment] ?? 0) + 1;
    expect(counts).toEqual({ filling: 4, extraction: 3, rootcanal: 3 });
  });

  it('every case has non-empty bilingual texts and a valid tooth index', () => {
    for (const c of CASES) {
      for (const lang of ['en', 'es'] as const) {
        expect(c[lang].symptom.length).toBeGreaterThan(10);
        expect(c[lang].clue.length).toBeGreaterThan(10);
        expect(c[lang].explanation.length).toBeGreaterThan(10);
      }
      expect(c.tooth).toBeGreaterThanOrEqual(0);
      expect(c.tooth).toBeLessThanOrEqual(15);
      expect(c.age).toBeGreaterThan(0);
    }
  });
});

describe('shuffle', () => {
  it('preserves all elements', () => {
    const s = shuffle([1, 2, 3, 4, 5]);
    expect([...s].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('game logic', () => {
  it('starts with the initial balance and first case', () => {
    const g = newGame(CASES);
    expect(g.balance).toBe(START_BALANCE);
    expect(g.index).toBe(0);
    expect(g.status).toBe('playing');
    expect(g.order).toHaveLength(10);
    expect(currentCase(g, CASES).id).toBe(g.order[0]);
  });

  it('adds +30 on a correct answer', () => {
    let g = newGame(CASES);
    const c = currentCase(g, CASES);
    g = answer(g, CASES, c.treatment);
    expect(g.balance).toBe(START_BALANCE + CORRECT_POINTS);
    expect(g.correct).toBe(1);
    expect(g.lastResult?.correct).toBe(true);
    expect(g.status).toBe('playing');
  });

  it('subtracts 50 on a wrong answer', () => {
    let g = newGame(CASES);
    const c = currentCase(g, CASES);
    const wrong = c.treatment === 'filling' ? 'extraction' : 'filling';
    g = answer(g, CASES, wrong);
    expect(g.balance).toBe(START_BALANCE + WRONG_POINTS);
    expect(g.wrong).toBe(1);
    expect(g.lastResult?.correct).toBe(false);
    expect(g.lastResult?.expected).toBe(c.treatment);
  });

  it('ends the game as lost when balance drops below zero', () => {
    let g = newGame(CASES);
    const c1 = currentCase(g, CASES);
    const wrong = c1.treatment === 'filling' ? 'extraction' : 'filling';
    g = answer(g, CASES, wrong); // 125 - 50 = 75
    expect(g.status).toBe('playing');
    const c2 = currentCase(g, CASES);
    const wrong2 = c2.treatment === 'filling' ? 'extraction' : 'filling';
    g = answer(g, CASES, wrong2); // 75 - 50 = 25
    expect(g.status).toBe('playing');
    const c3 = currentCase(g, CASES);
    const wrong3 = c3.treatment === 'filling' ? 'extraction' : 'filling';
    g = answer(g, CASES, wrong3); // 25 - 50 = -25
    expect(g.balance).toBe(-25);
    expect(g.status).toBe('lost');
  });

  it('ends the game as won after the 10th case with non-negative balance', () => {
    let g = newGame(CASES);
    for (let i = 0; i < 10; i++) {
      const c = currentCase(g, CASES);
      g = answer(g, CASES, c.treatment);
    }
    expect(g.status).toBe('won');
    expect(g.balance).toBe(START_BALANCE + 10 * CORRECT_POINTS);
    expect(g.correct).toBe(10);
  });

  it('ignores answers after the game ended', () => {
    let g: GameState = { ...newGame(CASES), status: 'lost' };
    const before = g.balance;
    g = answer(g, CASES, 'filling');
    expect(g.balance).toBe(before);
  });
});
