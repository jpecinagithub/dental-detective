import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'es';

const STRINGS = {
  appTitle: { en: 'Dental Detective 3D', es: 'Dental Detective 3D' },
  clinicName: { en: 'Aurora Dental Clinic', es: 'Clínica Dental Aurora' },
  author: { en: 'Jon Peciña', es: 'Jon Peciña' },
  tagline: {
    en: 'Examine dental patients, decode deceptive clues, and choose the right treatment to cure tricky teeth and rack up points.',
    es: 'Examina pacientes dentales, descifra pistas engañosas y elige el tratamiento correcto para curar dientes difíciles y sumar puntos.',
  },
  tagCases: { en: '15 cases', es: '15 casos' },
  tagPlayers: { en: '1 player', es: '1 jugador' },
  tagGenre: { en: 'Puzzle', es: 'Puzzle' },
  playNow: { en: 'Play now', es: 'Jugar ahora' },
  leaderboard: { en: 'Leaderboard', es: 'Marcador' },
  back: { en: 'Back', es: 'Volver' },
  menu: { en: 'Menu', es: 'Menú' },
  guide: { en: 'Guide', es: 'Guía' },
  balance: { en: 'Balance', es: 'Saldo' },
  patients: { en: 'Patients', es: 'Pacientes' },
  patient: { en: 'Patient', es: 'Paciente' },
  caseOf: { en: 'Case', es: 'Caso' },
  yearsOld: { en: 'years old', es: 'años' },
  clinicalClue: { en: 'Clinical clue', es: 'Pista clínica' },
  hideSymptoms: { en: 'Hide symptoms', es: 'Ocultar síntomas' },
  showSymptoms: { en: 'Show symptoms', es: 'Mostrar síntomas' },
  examine: { en: 'Examine mouth', es: 'Examinar boca' },
  welcomeTitle: { en: 'AURORA DENTAL CLINIC', es: 'CLÍNICA DENTAL AURORA' },
  welcomeSubtitle: { en: 'DENTAL DETECTIVE 3D', es: 'DENTAL DETECTIVE 3D' },
  welcomeText1: {
    en: 'Welcome to the Aurora Dental Clinic. Treat 15 different patients with their 15 unique symptoms and 15 specialized clinical clues. Examine their teeth with the 3-step zoom (press E).',
    es: 'Bienvenido a la Clínica Dental Aurora. Atiende a 15 pacientes distintos con sus 15 síntomas únicos y 15 pistas clínicas especializadas. Examina su dentadura con el zoom de 3 pasos (pulsa E).',
  },
  welcomeText2: {
    en: 'Careful! Symptoms are sometimes deceptive. Choose precisely between Filling, Extraction and Root canal.',
    es: '¡Cuidado! Los síntomas a veces engañan. Elige con precisión entre Empaste, Extracción y Endodoncia.',
  },
  startBalance: { en: 'Starting balance', es: 'Saldo inicial' },
  correctDx: { en: 'Correct diagnosis', es: 'Diagnóstico correcto' },
  wrongDx: { en: 'Wrong diagnosis', es: 'Diagnóstico erróneo' },
  points: { en: 'Points', es: 'Puntos' },
  endsBelowZero: {
    en: 'The game ends if your balance drops below zero (< 0).',
    es: 'La partida finaliza si tu saldo cae por debajo de cero (< 0).',
  },
  openClinic: { en: 'Open the Aurora Dental Clinic', es: 'Abrir la Clínica Dental Aurora' },
  tFilling: { en: 'Filling', es: 'Empaste' },
  tFillingSub: { en: 'For cavities', es: 'Para caries' },
  tExtraction: { en: 'Extraction', es: 'Extracción' },
  tExtractionSub: { en: 'For broken / retained tooth', es: 'Para diente roto / retenido' },
  tRootcanal: { en: 'Root canal', es: 'Endodoncia' },
  tRootcanalSub: { en: 'For damaged nerve', es: 'Para nervio dañado' },
  correctTitle: { en: 'Correct diagnosis!', es: '¡Diagnóstico correcto!' },
  wrongTitle: { en: 'Wrong diagnosis', es: 'Diagnóstico erróneo' },
  rightWas: { en: 'The right treatment was', es: 'El tratamiento correcto era' },
  nextPatient: { en: 'Next patient', es: 'Siguiente paciente' },
  seeResults: { en: 'See results', es: 'Ver resultados' },
  gameOver: { en: 'Game over', es: 'Partida terminada' },
  gameOverText: {
    en: 'Your balance dropped below zero. The clinic has to close its doors… for today.',
    es: 'Tu saldo cayó por debajo de cero. La clínica tiene que cerrar sus puertas… por hoy.',
  },
  victory: { en: 'Clinic complete!', es: '¡Clínica completada!' },
  victoryText: {
    en: 'You treated all 15 patients. The waiting room applauds you.',
    es: 'Has atendido a los 15 pacientes. La sala de espera te aplaude.',
  },
  finalScore: { en: 'Final score', es: 'Puntuación final' },
  accuracy: { en: 'Accuracy', es: 'Precisión' },
  playAgain: { en: 'Play again', es: 'Jugar de nuevo' },
  backToMenu: { en: 'Back to menu', es: 'Volver al menú' },
  enterName: { en: 'Enter your name for the leaderboard', es: 'Escribe tu nombre para el marcador' },
  yourName: { en: 'Your name', es: 'Tu nombre' },
  save: { en: 'Save', es: 'Guardar' },
  noScores: {
    en: 'No scores yet. Be the first detective on the board!',
    es: 'Aún no hay puntuaciones. ¡Sé el primer detective del marcador!',
  },
  date: { en: 'Date', es: 'Fecha' },
  score: { en: 'Score', es: 'Puntos' },
  guideTitle: { en: 'How to play', es: 'Cómo jugar' },
  guide1: {
    en: 'Read the patient’s symptom and the clinical clue. Symptoms can be misleading; the clue tells the truth.',
    es: 'Lee el síntoma del paciente y la pista clínica. Los síntomas pueden engañar; la pista dice la verdad.',
  },
  guide2: {
    en: 'Use the 3-step zoom (button or key E) to examine the mouth closely.',
    es: 'Usa el zoom de 3 pasos (botón o tecla E) para examinar la boca de cerca.',
  },
  guide3: {
    en: 'Pick a treatment: keys 1, 2, 3 or the buttons. +30 for a hit, −50 for a miss.',
    es: 'Elige un tratamiento: teclas 1, 2, 3 o los botones. +30 por acierto, −50 por fallo.',
  },
  guide4: {
    en: 'Treat all 15 patients without dropping below zero points.',
    es: 'Atiende a los 15 pacientes sin caer por debajo de cero puntos.',
  },
  close: { en: 'Close', es: 'Cerrar' },
  developedBy: { en: 'Developed by Jon Peciña Iturbe', es: 'Desarrollado por Jon Peciña Iturbe' },
  pts: { en: 'pts', es: 'pts' },
} as const;

export type StringKey = keyof typeof STRINGS;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (k) => STRINGS[k].en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (k: StringKey) => STRINGS[k][lang];
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function treatmentName(tr: 'filling' | 'extraction' | 'rootcanal', lang: Lang): string {
  const map = {
    filling: { en: 'Filling', es: 'Empaste' },
    extraction: { en: 'Extraction', es: 'Extracción' },
    rootcanal: { en: 'Root canal', es: 'Endodoncia' },
  } as const;
  return map[tr][lang];
}
