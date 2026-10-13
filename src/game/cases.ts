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
    id: 1, name: 'Lucía Fernández', age: 34, treatment: 'filling', tooth: 2, cue: 'stain',
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
    id: 2, name: 'Marco Ruiz', age: 28, treatment: 'filling', tooth: 10, cue: 'stain',
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
    id: 3, name: 'Aisha Bello', age: 41, treatment: 'filling', tooth: 5, cue: 'stain',
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
    id: 4, name: 'Tom Becker', age: 52, treatment: 'filling', tooth: 12, cue: 'chip',
    en: {
      symptom: 'An old filling fell out while I was eating.',
      clue: 'Filling lost; the remaining tooth structure is healthy and the nerve is not exposed.',
      explanation: 'Lost filling with no nerve exposure: clean the cavity and place a new filling.',
    },
    es: {
      symptom: 'Se me cayó un empaste viejo comiendo.',
      clue: 'Empaste desprendido; la estructura dental restante está sana y el nervio no está expuesto.',
      explanation: 'Empaste perdido sin exposición del nervio: se limpia la cavidad y se coloca un empaste nuevo.',
    },
  },
  {
    id: 5, name: 'Elena Vidal', age: 23, treatment: 'filling', tooth: 1, cue: 'stain',
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
    id: 6, name: 'Diego Marín', age: 19, treatment: 'extraction', tooth: 7, cue: 'gumRed',
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
    id: 7, name: 'Rosa Jiménez', age: 63, treatment: 'extraction', tooth: 4, cue: 'crack',
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
    id: 8, name: 'Kenji Tanaka', age: 45, treatment: 'extraction', tooth: 9, cue: 'none',
    en: {
      symptom: 'The tooth wiggles when I touch it with my tongue.',
      clue: 'Advanced bone loss around the root; grade III mobility, hopeless prognosis.',
      explanation: 'Extreme mobility from bone loss: the tooth cannot be saved.',
    },
    es: {
      symptom: 'El diente se mueve cuando lo toco con la lengua.',
      clue: 'Pérdida ósea avanzada alrededor de la raíz; movilidad de grado III, pronóstico imposible.',
      explanation: 'Movilidad extrema por pérdida de hueso: el diente no se puede salvar.',
    },
  },
  {
    id: 9, name: 'Priya Nair', age: 31, treatment: 'extraction', tooth: 3, cue: 'none',
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
    id: 10, name: 'Omar Haddad', age: 57, treatment: 'extraction', tooth: 13, cue: 'crack',
    en: {
      symptom: 'There is a constant bitter taste in the same spot.',
      clue: 'Root fracture with chronic infection; the tooth is non-restorable.',
      explanation: 'A fractured root with chronic infection: it has to come out.',
    },
    es: {
      symptom: 'Noto un sabor amargo constante en el mismo punto.',
      clue: 'Fractura radicular con infección crónica; el diente no es restaurable.',
      explanation: 'Raíz fracturada con infección crónica: hay que extraer.',
    },
  },
  {
    id: 11, name: 'Ana Beltrán', age: 38, treatment: 'rootcanal', tooth: 6, cue: 'none',
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
    id: 12, name: 'Viktor Petrov', age: 49, treatment: 'rootcanal', tooth: 11, cue: 'crack',
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
    id: 13, name: 'Sofía Navarro', age: 26, treatment: 'rootcanal', tooth: 0, cue: 'stain',
    en: {
      symptom: 'My tooth changed color after a bike crash.',
      clue: 'Trauma months ago; necrotic pulp, darkening from within.',
      explanation: 'A dead nerve after the impact: a root canal cleans and seals the canal.',
    },
    es: {
      symptom: 'El diente me cambió de color tras una caída en bici.',
      clue: 'Traumatismo hace meses; pulpa necrótica, oscurecimiento desde el interior.',
      explanation: 'Nervio muerto tras el golpe: la endodoncia limpia y sella el conducto.',
    },
  },
  {
    id: 14, name: 'James Carter', age: 60, treatment: 'rootcanal', tooth: 14, cue: 'gumRed',
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
  {
    id: 15, name: 'Mei Lin', age: 33, treatment: 'rootcanal', tooth: 8, cue: 'none',
    en: {
      symptom: 'Cold water leaves an ache that lasts for minutes.',
      clue: 'Pain lingering after the stimulus; irreversible pulpitis.',
      explanation: 'Prolonged pain from cold: the nerve will not recover, it needs a root canal.',
    },
    es: {
      symptom: 'El agua fría me deja un dolor que dura varios minutos.',
      clue: 'Dolor que persiste tras el estímulo; pulpitis irreversible.',
      explanation: 'Dolor prolongado al frío: el nervio no se recupera, necesita endodoncia.',
    },
  },
];
