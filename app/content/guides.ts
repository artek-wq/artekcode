/**
 * Guías de asesoría.
 *
 * Cada guía tiene:
 *  - slides: diapositivas cortas y visuales que se ven en un diálogo (el "plus" de la tienda)
 *  - sections: artículo de lectura para quien quiere profundizar
 *  - kit: productos sugeridos de forma discreta al final
 *  Cada slide/sección puede llevar `product` (handle) para una sugerencia en contexto.
 *
 * ⚠️ Contenido base de referencia: debe revisarlo un especialista antes de publicar
 *    (marca `reviewed: true` cuando esté validado).
 */
import type {Animal} from '~/lib/config';

export type Slide =
  | {type: 'cover'; emoji: string; title: string; subtitle: string}
  | {type: 'stats'; title: string; items: {icon: string; value: string; label: string}[]; product?: string}
  | {type: 'gradient'; title: string; cold: {label: string; value: string}; hot: {label: string; value: string}; note?: string; product?: string}
  | {type: 'checklist'; title: string; items: {icon: string; text: string}[]; product?: string}
  | {type: 'steps'; title: string; steps: string[]; product?: string}
  | {type: 'dosdonts'; title: string; dos: string[]; donts: string[]; product?: string}
  | {type: 'cycle'; title: string; nodes: {icon: string; label: string; sub?: string}[]; product?: string}
  | {type: 'video'; title: string; youtubeId?: string; caption: string; product?: string};

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  product?: string;
}

export interface Guide {
  handle: string;
  title: string;
  summary: string;
  animal: Animal;
  emoji: string;
  /** Color de fondo de la portada (token CSS). */
  tint: 'sand' | 'leaf' | 'water' | 'sun';
  minutes: number;
  reviewed: boolean;
  slides: Slide[];
  sections: GuideSection[];
  kit: string[];
}

export const GUIDES: Guide[] = [
  {
    handle: 'gecko-leopardo',
    title: 'Gecko leopardo: guía de inicio',
    summary: 'Temperaturas, terrario y alimentación para un gecko sano y tranquilo.',
    animal: 'reptiles', emoji: '🦎', tint: 'sand', minutes: 4, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🦎', title: 'Gecko leopardo', subtitle: 'Lo esencial en 6 diapositivas'},
      {type: 'stats', title: 'De un vistazo', items: [
        {icon: '📏', value: '20–25 cm', label: 'Tamaño adulto'},
        {icon: '⏳', value: '15–20 años', label: 'Esperanza de vida'},
        {icon: '🌙', value: 'Crepuscular', label: 'Activo al atardecer'},
        {icon: '🏠', value: '90×45 cm', label: 'Terrario mínimo'},
      ], product: 'terrario-vidrio-frontal'},
      {type: 'gradient', title: 'Gradiente de temperatura', cold: {label: 'Zona fría', value: '24–27 °C'}, hot: {label: 'Zona caliente (suelo)', value: '30–33 °C'},
        note: 'Calor desde abajo con manta térmica, siempre controlada por termostato.', product: 'termostato-digital'},
      {type: 'checklist', title: 'Tres refugios', items: [
        {icon: '🔥', text: 'Refugio caliente'}, {icon: '❄️', text: 'Refugio frío'}, {icon: '💦', text: 'Refugio húmedo para mudar'},
      ], product: 'refugio-humedo-roca'},
      {type: 'steps', title: 'Alimentación', steps: [
        'Insectos vivos del tamaño del espacio entre sus ojos',
        'Espolvorea calcio con D3',
        'Juveniles: diario · Adultos: cada 2–3 días',
        'Agua limpia siempre disponible',
      ], product: 'calcio-con-d3'},
      {type: 'dosdonts', title: 'Evita errores comunes', dos: ['Medir con termohigrómetro', 'Sustrato firme o loseta', 'UVB suave (5%)'], donts: ['Arena suelta para crías', 'Piedras calientes sin control', 'Manipularlo recién llegado'], product: 'termohigrometro-digital'},
    ],
    sections: [
      {heading: 'El terrario', paragraphs: [
        'Un adulto necesita como mínimo un terrario de 90×45 cm de base; más espacio siempre es mejor. Las puertas frontales facilitan alimentar sin estresarlo, porque en la naturaleza los depredadores llegan desde arriba.',
        'Coloca la fuente de calor en un extremo para crear un gradiente: así el gecko elige la temperatura que necesita.',
      ], product: 'terrario-vidrio-frontal'},
      {heading: 'Calor y luz', paragraphs: [
        'El gecko leopardo digiere gracias al calor del suelo. Una manta térmica bajo un tercio del terrario, conectada a un termostato, mantiene la zona caliente entre 30 y 33 °C.',
        'Aunque es crepuscular, se beneficia de un UVB de baja intensidad (5%) durante 10–12 horas al día.',
      ], product: 'manta-termica-adhesiva'},
      {heading: 'Alimentación y suplementos', paragraphs: [
        'Ofrece grillos, cucarachas o larvas. Espolvorea calcio con vitamina D3 para prevenir la enfermedad metabólica ósea.',
      ], product: 'calcio-con-d3'},
    ],
    kit: ['terrario-vidrio-frontal', 'manta-termica-adhesiva', 'termostato-digital', 'refugio-humedo-roca', 'termohigrometro-digital', 'calcio-con-d3'],
  },
  {
    handle: 'dragon-barbudo',
    title: 'Dragón barbudo: calor, UVB y dieta',
    summary: 'El reptil más popular necesita mucho calor y luz. Te explicamos cómo lograrlo.',
    animal: 'reptiles', emoji: '🐉', tint: 'sun', minutes: 5, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🐉', title: 'Dragón barbudo', subtitle: 'Sol, espacio y verduras'},
      {type: 'stats', title: 'De un vistazo', items: [
        {icon: '📏', value: '45–60 cm', label: 'Tamaño adulto'},
        {icon: '⏳', value: '10–15 años', label: 'Esperanza de vida'},
        {icon: '☀️', value: 'Diurno', label: 'Necesita UVB fuerte'},
        {icon: '🏠', value: '120×60 cm', label: 'Terrario adulto'},
      ]},
      {type: 'gradient', title: 'Gradiente de temperatura', cold: {label: 'Zona fría', value: '24–29 °C'}, hot: {label: 'Punto de asoleo', value: '38–43 °C'},
        note: 'De noche puede bajar a 20 °C; si baja más, usa un emisor cerámico.', product: 'foco-basking-halogeno'},
      {type: 'checklist', title: 'Luz que necesita', items: [
        {icon: '🟦', text: 'Tubo UVB T5 al 10–12%'}, {icon: '💡', text: 'Foco de asoleo'}, {icon: '⏱️', text: '12–14 h de luz al día'},
      ], product: 'lampara-uvb-t5-ho'},
      {type: 'stats', title: 'Dieta según edad', items: [
        {icon: '🦗', value: '70%', label: 'Insectos (cría)'},
        {icon: '🥬', value: '80%', label: 'Verduras (adulto)'},
      ], product: 'calcio-con-d3'},
      {type: 'video', title: 'Cómo montar el terrario', caption: 'Video próximamente', product: 'reflector-t5-aluminio'},
    ],
    sections: [
      {heading: 'Iluminación UVB', paragraphs: [
        'Sin UVB el dragón no puede fijar el calcio y desarrolla enfermedad metabólica ósea. Usa un tubo T5 de alta intensidad en reflector, cubriendo la mitad o dos tercios del largo del terrario.',
      ], product: 'lampara-uvb-t5-ho'},
      {heading: 'Sustrato y decoración', paragraphs: [
        'Un sustrato compactable permite excavar sin riesgo de ingerir arena suelta. Agrega rocas o troncos para trepar y una hamaca cerca del punto de asoleo.',
      ], product: 'sustrato-desertico'},
    ],
    kit: ['terrario-vidrio-frontal', 'lampara-uvb-t5-ho', 'reflector-t5-aluminio', 'foco-basking-halogeno', 'termostato-digital', 'sustrato-desertico', 'hamaca-reptil'],
  },
  {
    handle: 'tortuga-orejas-rojas',
    title: 'Tortuga de orejas rojas: agua limpia y sol',
    summary: 'Crecen más de lo que parece y ensucian mucho el agua. Prepárate bien.',
    animal: 'tortugas', emoji: '🐢', tint: 'water', minutes: 4, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🐢', title: 'Tortuga de orejas rojas', subtitle: 'Agua, isla y UVB'},
      {type: 'stats', title: 'Espacio que necesita', items: [
        {icon: '💧', value: '40 L', label: 'Por cada 2.5 cm de caparazón'},
        {icon: '📏', value: '20–30 cm', label: 'Tamaño adulto'},
        {icon: '⏳', value: '20–30 años', label: 'Esperanza de vida'},
      ], product: 'tortuguero-con-isla'},
      {type: 'gradient', title: 'Temperaturas', cold: {label: 'Agua', value: '24–27 °C'}, hot: {label: 'Isla de asoleo', value: '32–35 °C'}, product: 'calentador-sumergible'},
      {type: 'checklist', title: 'Lo indispensable', items: [
        {icon: '🏝️', text: 'Isla seca para asolearse'}, {icon: '🟦', text: 'UVB sobre la isla'}, {icon: '🌀', text: 'Filtro potente (2× el volumen)'},
      ], product: 'filtro-canister'},
      {type: 'dosdonts', title: 'Muy importante', dos: ['Cambios de agua semanales', 'Calcio en la dieta'], donts: ['Liberarla en ríos o lagos: es especie invasora', 'Tenerla sin luz UVB'], product: 'acondicionador-agua'},
    ],
    sections: [
      {heading: 'El filtro lo es todo', paragraphs: [
        'Las tortugas comen y hacen sus necesidades en el agua. Elige un filtro externo calificado para al menos el doble del volumen real de tu tortuguero.',
      ], product: 'filtro-canister'},
      {heading: 'Responsabilidad', paragraphs: [
        'Es una especie exótica invasora en México. Nunca la liberes: si ya no puedes cuidarla, busca una asociación de rescate.',
      ]},
    ],
    kit: ['tortuguero-con-isla', 'filtro-canister', 'lampara-uvb-t5-ho', 'foco-basking-halogeno', 'calentador-sumergible', 'alimento-tortuga-acuatica'],
  },
  {
    handle: 'ajolote',
    title: 'Ajolote: agua fría y tranquila',
    summary: 'Nuestro anfibio mexicano necesita agua fresca, corriente suave y sin grava.',
    animal: 'anfibios', emoji: '🩷', tint: 'water', minutes: 4, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🩷', title: 'Ajolote', subtitle: 'Un tesoro de Xochimilco'},
      {type: 'stats', title: 'De un vistazo', items: [
        {icon: '🌡️', value: '14–20 °C', label: 'Agua fría, sin calentador'},
        {icon: '💧', value: '75 L', label: 'Acuario mínimo (1 ejemplar)'},
        {icon: '⏳', value: '10–15 años', label: 'Esperanza de vida'},
      ]},
      {type: 'checklist', title: 'El acuario ideal', items: [
        {icon: '🫧', text: 'Filtro de corriente suave'}, {icon: '⬜', text: 'Fondo desnudo o arena fina'}, {icon: '🌑', text: 'Poca luz y escondites'},
      ], product: 'filtro-esponja'},
      {type: 'dosdonts', title: 'Cuidado con…', dos: ['Ciclar el acuario antes', 'Acondicionar el agua de la llave'], donts: ['Grava que pueda tragar', 'Temperaturas arriba de 22 °C', 'Mezclar con peces'], product: 'acondicionador-agua'},
      {type: 'checklist', title: 'Compra responsable', items: [
        {icon: '✅', text: 'Solo de criaderos autorizados (UMA)'}, {icon: '🚫', text: 'Nunca ejemplares silvestres'},
      ]},
    ],
    sections: [
      {heading: 'Agua fría y limpia', paragraphs: [
        'El ajolote vive mejor entre 16 y 18 °C. Arriba de 22 °C se estresa y enferma. En climas cálidos usa ventiladores o ubica el acuario en el lugar más fresco de la casa.',
      ], product: 'kit-pruebas-agua'},
      {heading: 'Alimentación', paragraphs: ['Pellets hundibles específicos y lombrices. Retira lo que no coma en 15 minutos para no ensuciar el agua.'], product: 'pellets-ajolote'},
    ],
    kit: ['acuario-kit-60-litros', 'filtro-esponja', 'acondicionador-agua', 'kit-pruebas-agua', 'pellets-ajolote'],
  },
  {
    handle: 'pez-betta',
    title: 'Pez betta: más que una pecera',
    summary: 'Un betta feliz necesita espacio, agua templada y un filtro suave.',
    animal: 'peces', emoji: '🐠', tint: 'leaf', minutes: 3, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🐠', title: 'Pez betta', subtitle: 'Mito: “vive en un vaso”'},
      {type: 'stats', title: 'Lo que realmente necesita', items: [
        {icon: '💧', value: '20 L+', label: 'Volumen mínimo'},
        {icon: '🌡️', value: '24–28 °C', label: 'Necesita calentador'},
        {icon: '🫧', value: 'Suave', label: 'Corriente del filtro'},
      ], product: 'calentador-sumergible'},
      {type: 'checklist', title: 'Acuario ideal', items: [
        {icon: '🌱', text: 'Plantas para descansar'}, {icon: '🪵', text: 'Escondites'}, {icon: '🔒', text: 'Tapa: ¡salta!'},
      ], product: 'lampara-led-plantado'},
      {type: 'dosdonts', title: 'Convivencia', dos: ['Un macho por acuario'], donts: ['Juntar dos machos', 'Peces que muerden aletas'], product: 'pellets-betta'},
    ],
    sections: [
      {heading: 'Calor constante', paragraphs: ['El betta es tropical: a menos de 24 °C se vuelve lento y enferma. Un calentador con termostato es imprescindible.'], product: 'calentador-sumergible'},
    ],
    kit: ['acuario-kit-60-litros', 'calentador-sumergible', 'filtro-esponja', 'pellets-betta', 'acondicionador-agua'],
  },
  {
    handle: 'ciclo-del-nitrogeno',
    title: 'El ciclo del nitrógeno en 1 minuto',
    summary: 'La razón #1 por la que mueren peces en acuarios nuevos, explicada con un dibujo.',
    animal: 'peces', emoji: '🔄', tint: 'leaf', minutes: 3, reviewed: false,
    slides: [
      {type: 'cover', emoji: '🔄', title: 'Ciclo del nitrógeno', subtitle: 'Por qué esperar antes de meter peces'},
      {type: 'cycle', title: 'Cómo funciona', nodes: [
        {icon: '🐟', label: 'Desechos', sub: 'comida y heces'},
        {icon: '☠️', label: 'Amoniaco', sub: 'muy tóxico'},
        {icon: '⚠️', label: 'Nitritos', sub: 'tóxicos'},
        {icon: '🌱', label: 'Nitratos', sub: 'se retiran con cambios de agua'},
      ], product: 'filtro-esponja'},
      {type: 'stats', title: 'Tiempo', items: [{icon: '📅', value: '4–6 semanas', label: 'Para ciclar un acuario nuevo'}, {icon: '🔁', value: '20–30%', label: 'Cambio de agua semanal'}]},
      {type: 'steps', title: 'Cómo saber si está listo', steps: ['Amoniaco en 0', 'Nitritos en 0', 'Nitratos presentes (menos de 40 ppm)'], product: 'kit-pruebas-agua'},
    ],
    sections: [
      {heading: 'Las bacterias son tus aliadas', paragraphs: [
        'En el filtro viven bacterias que transforman el amoniaco en nitritos y luego en nitratos, mucho menos tóxicos. En un acuario nuevo aún no existen: por eso hay que esperar y medir.',
      ], product: 'kit-pruebas-agua'},
    ],
    kit: ['kit-pruebas-agua', 'acondicionador-agua', 'filtro-esponja'],
  },
  {
    handle: 'iluminacion-uvb',
    title: 'Cómo elegir lámpara UVB',
    summary: 'T5, porcentajes y distancias: lo que de verdad importa.',
    animal: 'reptiles', emoji: '☀️', tint: 'sun', minutes: 3, reviewed: false,
    slides: [
      {type: 'cover', emoji: '☀️', title: 'Luz UVB', subtitle: 'El “sol” de tu reptil'},
      {type: 'stats', title: 'Elige por especie', items: [
        {icon: '🏜️', value: '10–12%', label: 'Desérticos (dragón, uromastyx)'},
        {icon: '🌳', value: '5–6%', label: 'Bosque y crepusculares (gecko, camaleón)'},
      ], product: 'lampara-uvb-t5-ho'},
      {type: 'checklist', title: 'Reglas de oro', items: [
        {icon: '🪟', text: 'El vidrio bloquea el UVB'}, {icon: '📐', text: '30–45 cm de distancia'}, {icon: '📆', text: 'Reemplazar cada 12 meses'},
      ], product: 'reflector-t5-aluminio'},
    ],
    sections: [
      {heading: 'T5 vs. compactas', paragraphs: ['Los tubos T5 HO con reflector dan un UVB más uniforme y duradero que los focos compactos, que suelen perder potencia en pocos meses.'], product: 'reflector-t5-aluminio'},
    ],
    kit: ['lampara-uvb-t5-ho', 'lampara-uvb-t5-5', 'reflector-t5-aluminio'],
  },
];

export function getGuide(handle: string) {
  return GUIDES.find((g) => g.handle === handle) ?? null;
}
