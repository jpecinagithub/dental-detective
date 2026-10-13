export type Treatment = 'filling' | 'extraction' | 'rootcanal';
export type VisualCue = 'stain' | 'crack' | 'gumRed' | 'chip' | 'none';

export interface CaseText {
  symptom: string;
  clue: string;
  explanation: string;
}

export interface DentalCase {
  id: number;
  name: string;
  age: number;
  treatment: Treatment;
  /** tooth index: 0-7 upper row, 8-15 lower row */
  tooth: number;
  cue: VisualCue;
  en: CaseText;
  es: CaseText;
}

export const CASES: DentalCase[] = [
  {
    id: 1, name: 'Michel Bibian', age: 34, treatment: 'filling', tooth: 2, cue: 'stain',
    en: {
      symptom: 'It only hurts when I drink something very cold, and the tooth looks perfect.',
      clue: 'The explorer catches in a hidden fissure; the X-ray shows decay limited to enamel, pulp intact.',
      explanation: 'Early decay confined to the enamel: a filling stops it before it reaches the nerve.',
    },
    es: {
      symptom: 'Solo me duele cuando bebo algo muy frío, y el diente se ve perfecto.',
      clue: 'El explorador se engancha en una fisura oculta; la radiografía muestra caries limitada al esmalte, pulpa intacta.',
      explanation: 'Caries temprana limitada al esmalte: un empaste la detiene antes de que alcance el nervio.',
    },
  },
  {
    id: 2, name: 'Jesús Pedroche', age: 28, treatment: 'filling', tooth: 10, cue: 'stain',
    en: {
      symptom: 'The tooth looks dark between the teeth, but it does not hurt at all.',
      clue: 'Interproximal caries visible on the X-ray, with no pulp involvement.',
      explanation: 'A painless cavity between teeth: a filling removes it before it truly starts hurting.',
    },
    es: {
      symptom: 'El diente se ve oscuro entre los dientes, pero no me duele nada.',
      clue: 'Caries interproximal visible en la radiografía, sin afectación de la pulpa.',
      explanation: 'Caries indolora entre los dientes: un empaste la elimina antes de que duela de verdad.',
    },
  },
  {
    id: 3, name: 'Javier Curier', age: 41, treatment: 'filling', tooth: 5, cue: 'stain',
    en: {
      symptom: 'Food always gets trapped in the same molar.',
      clue: 'Decay on the chewing surface; pulp sensitivity tests come back normal.',
      explanation: 'Decay on the chewing surface with a healthy nerve: a filling is enough.',
    },
    es: {
      symptom: 'La comida siempre se me queda atrapada en la misma muela.',
      clue: 'Caries en la superficie de masticación; las pruebas de sensibilidad pulpar son normales.',
      explanation: 'Caries en la superficie masticatoria con nervio sano: basta un empaste.',
    },
  },
  {
    id: 4, name: 'Javier Cabezón', age: 23, treatment: 'filling', tooth: 1, cue: 'stain',
    en: {
      symptom: 'A black dot appeared on my molar, but I feel nothing.',
      clue: 'Superficial pit decay; the pulp is vital and healthy.',
      explanation: 'A symptom-free surface cavity: a filling seals it in time.',
    },
    es: {
      symptom: 'Me ha salido un punto negro en la muela, pero no siento nada.',
      clue: 'Caries de fisura superficial; la pulpa está vital y sana.',
      explanation: 'Caries superficial sin síntomas: el empaste la sella a tiempo.',
    },
  },
  {
    id: 5, name: 'Rafa Garlito', age: 19, treatment: 'extraction', tooth: 7, cue: 'gumRed',
    en: {
      symptom: 'My wisdom tooth aches and the gum around it is swollen.',
      clue: 'Wisdom tooth impacted against the second molar; there is no room left in the arch.',
      explanation: 'A retained wisdom tooth with no space: extraction protects the neighboring molar.',
    },
    es: {
      symptom: 'La muela del juicio me duele y tengo la encía de alrededor hinchada.',
      clue: 'Muela del juicio impactada contra el segundo molar; no queda espacio en la arcada.',
      explanation: 'Muela del juicio retenida sin espacio: la extracción protege al molar vecino.',
    },
  },
  {
    id: 6, name: 'Don Anselmo', age: 63, treatment: 'extraction', tooth: 4, cue: 'crack',
    en: {
      symptom: 'My molar split in half while I was chewing.',
      clue: 'Fracture below the gum line; the root cannot be restored.',
      explanation: 'An unrestorable fracture under the gum: extraction is the only way out.',
    },
    es: {
      symptom: 'La muela se me partió por la mitad masticando.',
      clue: 'Fractura por debajo de la línea de la encía; la raíz no se puede restaurar.',
      explanation: 'Fractura irreparable bajo la encía: la extracción es la única salida.',
    },
  },
  {
    id: 7, name: 'Don Pablo', age: 31, treatment: 'extraction', tooth: 3, cue: 'none',
    en: {
      symptom: 'A tooth never came out, and now it is pushing the others.',
      clue: 'Retained canine on the X-ray, pressing against the neighboring roots.',
      explanation: 'A retained tooth threatening its neighbors: surgical extraction.',
    },
    es: {
      symptom: 'Un diente nunca me salió y ahora está empujando a los demás.',
      clue: 'Canino retenido en la radiografía, presionando las raíces vecinas.',
      explanation: 'Diente retenido que amenaza a los vecinos: extracción quirúrgica.',
    },
  },
  {
    id: 8, name: 'Mariano', age: 38, treatment: 'rootcanal', tooth: 6, cue: 'none',
    en: {
      symptom: 'From the outside the molar looks white and healthy, but at night I feel unbearable throbbing inside.',
      clue: 'Pulsating night pain; irreversibly inflamed pulp, cold brings no relief.',
      explanation: 'Irreversible pulpitis: only a root canal removes the damaged nerve.',
    },
    es: {
      symptom: 'Por fuera la muela se ve blanca y sana, pero de noche siento latidos insoportables dentro.',
      clue: 'Dolor pulsátil nocturno; pulpa inflamada de forma irreversible, el frío no lo alivia.',
      explanation: 'Pulpitis irreversible: solo la endodoncia elimina el nervio dañado.',
    },
  },
  {
    id: 9, name: 'Antxón Pérez', age: 49, treatment: 'rootcanal', tooth: 11, cue: 'crack',
    en: {
      symptom: 'It hurts when I bite, but there is no cavity to see.',
      clue: 'A hairline crack reaching the pulp chamber; bite test positive.',
      explanation: 'A crack reaching the nerve: a root canal saves the tooth before it splits completely.',
    },
    es: {
      symptom: 'Me duele al morder, pero no se ve ninguna caries.',
      clue: 'Fisura capilar que alcanza la cámara pulpar; prueba de mordida positiva.',
      explanation: 'Fisura que alcanza el nervio: la endodoncia salva el diente antes de que se parta del todo.',
    },
  },
  {
    id: 10, name: 'Marcos Salvador', age: 60, treatment: 'rootcanal', tooth: 14, cue: 'gumRed',
    en: {
      symptom: 'A pimple on my gum keeps coming and going.',
      clue: 'A draining fistula; the X-ray shows an abscess at the root tip, pulp dead.',
      explanation: 'An abscess from a dead nerve: a root canal clears the infection from within.',
    },
    es: {
      symptom: 'Me sale un granito en la encía que va y viene.',
      clue: 'Fístula que drena; la radiografía muestra un absceso en la punta de la raíz, pulpa muerta.',
      explanation: 'Absceso por nervio muerto: la endodoncia elimina la infección desde dentro.',
    },
  },
];
