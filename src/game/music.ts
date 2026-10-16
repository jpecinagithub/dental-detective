/**
 * Generative calm clinic music — 100% synthesized with the Web Audio API.
 * No audio files, no external assets, no licensing issues.
 *
 * Warm pad chords (Cmaj7 – Am7 – Fmaj7 – G6) with a soft sine bass and a
 * gentle pentatonic pluck melody wandering over the top through a subtle
 * delay. Everything passes through a low-pass filter so nothing sounds
 * harsh or metallic.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let delaySend: GainNode | null = null;
let timer: number | null = null;
let visibilityHooked = false;

let muted = false;
try {
  muted = localStorage.getItem('dd_music_muted') === '1';
} catch {
  /* storage unavailable */
}

let nextPluck = 0;
let nextChord = 0;
let chordIdx = 0;
let melIdx = 3;

const SCALE = [60, 62, 64, 67, 69, 72, 74, 76]; // C pentatonic, midi
const CHORDS = [
  { pad: [48, 52, 55, 59], bass: 36 }, // Cmaj7
  { pad: [45, 48, 52, 55], bass: 33 }, // Am7
  { pad: [41, 45, 48, 52], bass: 29 }, // Fmaj7
  { pad: [43, 47, 50, 52], bass: 31 }, // G6
];
const CHORD_LEN = 7; // seconds per chord
const PLUCK_STEP = 0.55; // seconds between melody slots

const MASTER_LEVEL = 0.5;

const mf = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function buildGraph(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext;
    ctx = new AC();
  } catch {
    return null;
  }

  master = ctx.createGain();
  master.gain.value = muted ? 0 : MASTER_LEVEL;

  // gentle top-end roll-off: keeps everything soft, never harsh/metallic
  const softener = ctx.createBiquadFilter();
  softener.type = 'lowpass';
  softener.frequency.value = 5200;

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.ratio.value = 4;
  comp.attack.value = 0.02;
  comp.release.value = 0.4;

  master.connect(softener);
  softener.connect(comp);
  comp.connect(ctx.destination);

  // subtle space for the melody: short feedback delay
  const delay = ctx.createDelay(1.2);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  delaySend = ctx.createGain();
  delaySend.gain.value = 1;
  delaySend.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  return ctx;
}

function schedulePad(chord: { pad: number[]; bass: number }, t: number) {
  if (!ctx || !master) return;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 850;
  padFilter.connect(master);

  for (const m of chord.pad) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.045, t + 1.8);
    g.gain.setValueAtTime(0.045, t + CHORD_LEN - 2.5);
    g.gain.linearRampToValueAtTime(0, t + CHORD_LEN);
    g.connect(padFilter);
    for (const det of [-5, 5]) {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = mf(m);
      o.detune.value = det;
      o.connect(g);
      o.start(t);
      o.stop(t + CHORD_LEN + 0.1);
    }
  }

  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0, t);
  bg.gain.linearRampToValueAtTime(0.085, t + 1.2);
  bg.gain.setValueAtTime(0.085, t + CHORD_LEN - 2);
  bg.gain.linearRampToValueAtTime(0, t + CHORD_LEN);
  bg.connect(master);
  const b = ctx.createOscillator();
  b.type = 'sine';
  b.frequency.value = mf(chord.bass);
  b.connect(bg);
  b.start(t);
  b.stop(t + CHORD_LEN + 0.1);
}

function schedulePluck(m: number, t: number) {
  if (!ctx || !master || !delaySend) return;
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.value = mf(m);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 2400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.11, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 1.6);
  o.connect(f);
  f.connect(g);
  g.connect(master); // dry
  g.connect(delaySend); // spacious echo
  o.start(t);
  o.stop(t + 1.8);
}

function tick() {
  if (!ctx) return;
  const now = ctx.currentTime;

  while (nextChord < now + 1.5) {
    schedulePad(CHORDS[chordIdx % CHORDS.length], Math.max(nextChord, now + 0.05));
    nextChord += CHORD_LEN;
    chordIdx += 1;
  }

  while (nextPluck < now + 1.0) {
    const t = Math.max(nextPluck, now + 0.05);
    if (Math.random() < 0.65) {
      melIdx += Math.floor(Math.random() * 5) - 2;
      melIdx = Math.max(0, Math.min(SCALE.length - 1, melIdx));
      schedulePluck(SCALE[melIdx], t);
    }
    nextPluck += PLUCK_STEP;
  }
}

function onVisibility() {
  if (!ctx || timer === null) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
}

/** Start the clinic music. Safe to call repeatedly. */
export function startMusic(): void {
  if (timer !== null) return;
  const ac = buildGraph();
  if (!ac) return;
  void ac.resume();
  const now = ac.currentTime;
  nextChord = now + 0.1;
  nextPluck = now + 0.6;
  chordIdx = 0;
  tick();
  timer = window.setInterval(tick, 200);
  if (!visibilityHooked) {
    document.addEventListener('visibilitychange', onVisibility);
    visibilityHooked = true;
  }
}

/** Stop the music and release the AudioContext. */
export function stopMusic(): void {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (ctx && master) {
    const c = ctx;
    const m = master;
    m.gain.setTargetAtTime(0, c.currentTime, 0.15);
    window.setTimeout(() => void c.close(), 700);
  }
  ctx = null;
  master = null;
  delaySend = null;
}

export function setMuted(m: boolean): void {
  muted = m;
  try {
    localStorage.setItem('dd_music_muted', m ? '1' : '0');
  } catch {
    /* storage unavailable */
  }
  if (ctx && master) {
    master.gain.setTargetAtTime(m ? 0 : MASTER_LEVEL, ctx.currentTime, 0.2);
  }
}

export function isMuted(): boolean {
  return muted;
}

/** For automated checks: 'running' | 'suspended' | 'stopped'. */
export function debugMusicState(): string {
  if (!ctx) return 'stopped';
  return ctx.state;
}

try {
  (window as unknown as { __ddMusic?: () => string }).__ddMusic = debugMusicState;
} catch {
  /* not in a browser */
}
