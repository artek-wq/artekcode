/**
 * Catálogo de demostración (30 productos, máx. 3 variantes).
 * Sirve para ver y probar la tienda antes de conectar Shopify.
 * Precios en MXN. Marcas ficticias.
 */
import type {Animal, Category, Origin} from '~/lib/config';
import type {Product} from '~/lib/catalog/types';

type V = [title: string, price: number, compareAt?: number | null, available?: boolean];

interface Seed {
  handle: string;
  title: string;
  brand: string;
  origin: Origin;
  animals: Animal[];
  category: Category;
  emoji: string;
  rating: number | null;
  reviews: number;
  option?: string;
  variants: V[];
  description: string;
  highlights: string[];
  guides?: string[];
  tags?: string[];
}

const seeds: Seed[] = [
  // ---------------------------------------------------------------- Hábitats
  {
    handle: 'terrario-vidrio-frontal',
    title: 'Terrario de vidrio con apertura frontal y ventilación superior',
    brand: 'Terravida', origin: 'nacional', animals: ['reptiles', 'anfibios'], category: 'habitats', emoji: '🏠',
    rating: 4.7, reviews: 128, option: 'Tamaño',
    variants: [['45×45×60 cm', 2899, 3299], ['60×45×45 cm', 3199, 3599], ['90×45×45 cm', 4499]],
    description: 'Terrario de vidrio templado con puertas frontales independientes que evitan que el animal escape al darle de comer. Tapa de malla metálica para colocar lámparas UVB y de calor por encima.',
    highlights: ['Puertas frontales con seguro', 'Tapa de malla apta para lámparas', 'Base elevada para manta térmica', 'Pasacables cerrables'],
    guides: ['gecko-leopardo', 'dragon-barbudo', 'iluminacion-uvb'],
  },
  {
    handle: 'acuario-kit-60-litros',
    title: 'Kit de acuario 60 L con filtro, luz LED y tapa',
    brand: 'Aquanorte', origin: 'nacional', animals: ['peces', 'invertebrados'], category: 'habitats', emoji: '🐟',
    rating: 4.5, reviews: 214, option: 'Color de base',
    variants: [['Negro', 2499, 2799], ['Blanco', 2499, 2799]],
    description: 'Todo lo necesario para empezar: pecera de 60 L, filtro de mochila, iluminación LED de día y noche y tapa con compuerta para alimentar.',
    highlights: ['60 litros reales', 'Filtro incluido de 300 L/h', 'LED blanco y azul', 'Ideal para principiantes'],
    guides: ['ciclo-del-nitrogeno', 'pez-betta'],
  },
  {
    handle: 'tortuguero-con-isla',
    title: 'Tortuguero con isla de asoleo y rampa',
    brand: 'Terravida', origin: 'express', animals: ['tortugas'], category: 'habitats', emoji: '🐢',
    rating: 4.4, reviews: 87, option: 'Tamaño',
    variants: [['Mediano 40 L', 1299], ['Grande 80 L', 1899, 2199]],
    description: 'Contenedor para tortugas acuáticas con zona de agua y una isla seca para asolearse, con rampa antideslizante.',
    highlights: ['Isla y rampa integradas', 'Espacio para filtro', 'Plástico libre de BPA'],
    guides: ['tortuga-orejas-rojas'],
  },
  {
    handle: 'paludario-bioactivo',
    title: 'Paludario 60×45×60 cm con fondo 3D y cascada',
    brand: 'Terravida', origin: 'importacion', animals: ['anfibios', 'reptiles'], category: 'habitats', emoji: '🌴',
    rating: 4.6, reviews: 41,
    variants: [['Único', 5499, 6299]],
    description: 'Terrario mixto tierra-agua con fondo texturizado tipo roca, bomba para cascada y zona de drenaje. Perfecto para ranas arborícolas y montajes bioactivos.',
    highlights: ['Fondo 3D incluido', 'Bomba para cascada', 'Drenaje inferior'],
    guides: ['ajolote'],
  },
  {
    handle: 'faunario-plastico',
    title: 'Faunario de plástico con tapa ventilada',
    brand: 'Oso Basics', origin: 'nacional', animals: ['invertebrados', 'anfibios', 'reptiles'], category: 'habitats', emoji: '📦',
    rating: 4.3, reviews: 302, option: 'Tamaño',
    variants: [['Chico', 199], ['Mediano', 329], ['Grande', 499]],
    description: 'Contenedor ligero para transporte, cuarentena o invertebrados. Tapa ventilada con compuerta para alimentar.',
    highlights: ['Ideal para cuarentena', 'Apilable', 'Compuerta para alimentar'],
  },
  // ------------------------------------------------------------ Iluminación
  {
    handle: 'lampara-uvb-t5-ho',
    title: 'Tubo UVB T5 HO 10.0 para reptiles desérticos',
    brand: 'Sonora Reptil', origin: 'express', animals: ['reptiles', 'tortugas'], category: 'iluminacion', emoji: '☀️',
    rating: 4.8, reviews: 176, option: 'Largo',
    variants: [['55 cm / 24 W', 649, 749], ['85 cm / 39 W', 799, 899]],
    description: 'Fluorescente T5 de alto rendimiento que emite rayos UVB para que el reptil sintetice vitamina D3 y absorba calcio. Indispensable para dragones barbudos, iguanas y tortugas.',
    highlights: ['UVB 10% para desérticos', 'Hasta 12 meses de vida útil', 'Usar con reflector'],
    guides: ['iluminacion-uvb', 'dragon-barbudo', 'tortuga-orejas-rojas'],
  },
  {
    handle: 'lampara-uvb-t5-5',
    title: 'Tubo UVB T5 HO 5.0 para reptiles tropicales y nocturnos',
    brand: 'Sonora Reptil', origin: 'express', animals: ['reptiles', 'anfibios'], category: 'iluminacion', emoji: '🌤️',
    rating: 4.7, reviews: 92, option: 'Largo',
    variants: [['55 cm / 24 W', 599], ['85 cm / 39 W', 749]],
    description: 'UVB de intensidad media para geckos, camaleones y especies de bosque. Complemento ideal para animales crepusculares.',
    highlights: ['UVB 5% intensidad media', 'Para geckos y camaleones', 'Reemplazar cada 12 meses'],
    guides: ['iluminacion-uvb', 'gecko-leopardo'],
  },
  {
    handle: 'reflector-t5-aluminio',
    title: 'Reflector de aluminio para tubo T5 con balastro',
    brand: 'Sonora Reptil', origin: 'importacion', animals: ['reptiles', 'tortugas'], category: 'iluminacion', emoji: '🔦',
    rating: 4.2, reviews: 58, option: 'Largo',
    variants: [['55 cm', 549], ['85 cm', 699]],
    description: 'Gabinete con reflector que duplica la cantidad de UVB que llega al animal. Incluye balastro electrónico y cable con interruptor.',
    highlights: ['Hasta 2× más UVB', 'Balastro incluido', 'Ganchos para tapa de malla'],
    guides: ['iluminacion-uvb'],
  },
  {
    handle: 'foco-basking-halogeno',
    title: 'Foco halógeno de asoleo (basking)',
    brand: 'Oso Basics', origin: 'nacional', animals: ['reptiles', 'tortugas'], category: 'iluminacion', emoji: '💡',
    rating: 4.6, reviews: 241, option: 'Potencia',
    variants: [['50 W', 179], ['75 W', 199], ['100 W', 229]],
    description: 'Foco que crea un punto caliente con luz visible, imitando al sol. Úsalo con socket de cerámica y termostato.',
    highlights: ['Luz y calor focalizado', 'Rosca E27', 'Usar con socket de cerámica'],
    guides: ['dragon-barbudo', 'tortuga-orejas-rojas'],
  },
  {
    handle: 'lampara-led-plantado',
    title: 'Lámpara LED para acuario plantado con temporizador',
    brand: 'Aquanorte', origin: 'importacion', animals: ['peces', 'invertebrados'], category: 'iluminacion', emoji: '🌱',
    rating: 4.4, reviews: 133, option: 'Largo',
    variants: [['30–45 cm', 459, 599], ['60–75 cm', 689, 849]],
    description: 'Espectro completo para crecimiento de plantas con amanecer y atardecer programables.',
    highlights: ['Espectro completo', 'Amanecer/atardecer', 'Soportes extensibles'],
    guides: ['pez-betta'],
  },
  // ------------------------------------------------------------ Calefacción
  {
    handle: 'manta-termica-adhesiva',
    title: 'Manta térmica adhesiva para terrario',
    brand: 'Terravida', origin: 'nacional', animals: ['reptiles', 'invertebrados'], category: 'calefaccion', emoji: '🔥',
    rating: 4.5, reviews: 189, option: 'Tamaño',
    variants: [['14×15 cm / 8 W', 249], ['28×28 cm / 16 W', 349], ['28×42 cm / 24 W', 449]],
    description: 'Calor desde abajo para especies que digieren con el vientre, como el gecko leopardo. Siempre conéctala a un termostato.',
    highlights: ['Calor ventral constante', 'Bajo consumo', 'Usar con termostato'],
    guides: ['gecko-leopardo'],
  },
  {
    handle: 'termostato-digital',
    title: 'Termostato digital con sonda para lámparas y mantas',
    brand: 'Oso Basics', origin: 'express', animals: ['reptiles', 'anfibios', 'tortugas', 'invertebrados'], category: 'calefaccion', emoji: '🎛️',
    rating: 4.8, reviews: 312,
    variants: [['Único', 699, 849]],
    description: 'Controla la temperatura encendiendo y apagando tu fuente de calor. Evita quemaduras y sobrecalentamiento. Hasta 1000 W.',
    highlights: ['Sonda de 2 m', 'Pantalla digital', 'Soporta hasta 1000 W', 'Imprescindible por seguridad'],
    guides: ['gecko-leopardo', 'dragon-barbudo'],
  },
  {
    handle: 'calentador-sumergible',
    title: 'Calentador sumergible ajustable para acuario',
    brand: 'Aquanorte', origin: 'nacional', animals: ['peces', 'tortugas'], category: 'calefaccion', emoji: '🌡️',
    rating: 4.3, reviews: 267, option: 'Potencia',
    variants: [['50 W (hasta 50 L)', 289], ['100 W (hasta 100 L)', 349], ['200 W (hasta 200 L)', 449]],
    description: 'Calentador de vidrio resistente con termostato integrado y apagado automático fuera del agua.',
    highlights: ['Termostato integrado', 'Apagado de seguridad', 'Ventosas incluidas'],
    guides: ['pez-betta', 'tortuga-orejas-rojas'],
  },
  {
    handle: 'emisor-ceramico',
    title: 'Emisor cerámico de calor (sin luz)',
    brand: 'Sonora Reptil', origin: 'importacion', animals: ['reptiles', 'tortugas'], category: 'calefaccion', emoji: '♨️',
    rating: 4.4, reviews: 76, option: 'Potencia',
    variants: [['60 W', 149], ['100 W', 179], ['150 W', 199]],
    description: 'Calor nocturno sin luz para no alterar el ciclo de sueño. Requiere socket de cerámica y termostato.',
    highlights: ['Calor sin luz', 'Ideal de noche', 'Vida útil larga'],
    guides: ['dragon-barbudo'],
  },
  // --------------------------------------------------------------- Sustratos
  {
    handle: 'fibra-de-coco',
    title: 'Fibra de coco compactada para terrario húmedo',
    brand: 'Oso Basics', origin: 'nacional', animals: ['reptiles', 'anfibios', 'invertebrados'], category: 'sustratos', emoji: '🥥',
    rating: 4.6, reviews: 401, option: 'Presentación',
    variants: [['Ladrillo 650 g', 89], ['Paquete 3 ladrillos', 239, 267]],
    description: 'Sustrato natural que retiene humedad. Se expande al hidratarse hasta 8 litros por ladrillo.',
    highlights: ['Retiene humedad', '100% natural', 'Rinde 8 L por ladrillo'],
  },
  {
    handle: 'sustrato-desertico',
    title: 'Sustrato desértico de arcilla y arena compactable',
    brand: 'Terravida', origin: 'express', animals: ['reptiles'], category: 'sustratos', emoji: '🏜️',
    rating: 4.2, reviews: 64,
    variants: [['Bolsa 10 kg', 459]],
    description: 'Mezcla que se compacta como suelo natural, permite excavar y evita la ingestión de arena suelta.',
    highlights: ['Se compacta al secar', 'Permite excavar', 'Sin polvo'],
    guides: ['dragon-barbudo', 'gecko-leopardo'],
  },
  {
    handle: 'grava-acuario-natural',
    title: 'Grava natural para acuario lavada',
    brand: 'Aquanorte', origin: 'nacional', animals: ['peces', 'tortugas', 'invertebrados'], category: 'sustratos', emoji: '🪨',
    rating: 4.5, reviews: 155, option: 'Color',
    variants: [['Río', 149], ['Negra', 169], ['Blanca', 169]],
    description: 'Grava de grano medio, prelavada y sin colorantes. Bolsa de 5 kg.',
    highlights: ['Prelavada', 'pH neutro', 'Bolsa 5 kg'],
  },
  // ---------------------------------------------------------------- Alimento
  {
    handle: 'calcio-con-d3',
    title: 'Suplemento de calcio con vitamina D3 en polvo',
    brand: 'Sonora Reptil', origin: 'express', animals: ['reptiles', 'anfibios', 'tortugas'], category: 'alimento', emoji: '🦴',
    rating: 4.9, reviews: 523, option: 'Presentación',
    variants: [['90 g', 189], ['250 g', 389, 429]],
    description: 'Previene la enfermedad metabólica ósea. Espolvorea los insectos antes de dárselos a tu reptil.',
    highlights: ['Con D3', 'Sin fósforo', 'Polvo ultrafino'],
    guides: ['gecko-leopardo', 'dragon-barbudo'],
  },
  {
    handle: 'alimento-tortuga-acuatica',
    title: 'Alimento en barritas para tortuga acuática',
    brand: 'Terravida', origin: 'nacional', animals: ['tortugas'], category: 'alimento', emoji: '🐢',
    rating: 4.4, reviews: 289, option: 'Presentación',
    variants: [['120 g', 129], ['500 g', 389]],
    description: 'Barritas flotantes con calcio y vitaminas para tortugas acuáticas en crecimiento y adultas.',
    highlights: ['Flotante', 'Con calcio', 'No enturbia el agua'],
    guides: ['tortuga-orejas-rojas'],
  },
  {
    handle: 'pellets-betta',
    title: 'Pellets premium para pez betta',
    brand: 'Aquanorte', origin: 'importacion', animals: ['peces'], category: 'alimento', emoji: '🐠',
    rating: 4.3, reviews: 98,
    variants: [['30 g', 99, 129]],
    description: 'Pellets pequeños ricos en proteína que realzan el color del betta.',
    highlights: ['Alto en proteína', 'Realza colores', 'Tamaño ideal'],
    guides: ['pez-betta'],
  },
  {
    handle: 'pellets-ajolote',
    title: 'Pellets hundibles para ajolote',
    brand: 'Lagu', origin: 'nacional', animals: ['anfibios'], category: 'alimento', emoji: '🦎',
    rating: 4.7, reviews: 141, option: 'Presentación',
    variants: [['100 g', 159], ['250 g', 319]],
    description: 'Alimento hundible formulado para ajolotes, rico en proteína de pescado. Hecho en México.',
    highlights: ['Se hunde', 'Hecho en México', 'Alta proteína'],
    guides: ['ajolote'],
  },
  // -------------------------------------------------------------- Decoración
  {
    handle: 'refugio-humedo-roca',
    title: 'Refugio húmedo tipo roca con depósito de agua',
    brand: 'Terravida', origin: 'importacion', animals: ['reptiles'], category: 'decoracion', emoji: '🪨',
    rating: 4.5, reviews: 112, option: 'Tamaño',
    variants: [['Chico', 199], ['Mediano', 259]],
    description: 'Cueva de resina con depósito superior para mantener la humedad que necesitan para mudar la piel.',
    highlights: ['Ayuda a la muda', 'Fácil de limpiar', 'Aspecto natural'],
    guides: ['gecko-leopardo'],
  },
  {
    handle: 'plantas-artificiales-set',
    title: 'Set de 6 plantas artificiales para terrario',
    brand: 'Oso Basics', origin: 'importacion', animals: ['reptiles', 'anfibios'], category: 'decoracion', emoji: '🌿',
    rating: 4.1, reviews: 207,
    variants: [['Set selva', 249, 329], ['Set desierto', 249, 329]],
    description: 'Plantas de plástico seguras con ventosas y base de peso para crear escondites visuales.',
    highlights: ['Sin tóxicos', 'Con ventosas', 'Lavables'],
  },
  {
    handle: 'tronco-mopani',
    title: 'Tronco natural mopani para acuario y terrario',
    brand: 'Aquanorte', origin: 'express', animals: ['peces', 'reptiles', 'invertebrados'], category: 'decoracion', emoji: '🪵',
    rating: 4.6, reviews: 73, option: 'Tamaño',
    variants: [['20–30 cm', 289], ['30–40 cm', 429]],
    description: 'Madera dura que se hunde y no se pudre. Ideal para escondites y anclar plantas.',
    highlights: ['Se hunde fácil', 'No se pudre', 'Pieza única'],
  },
  {
    handle: 'hamaca-reptil',
    title: 'Hamaca de malla para reptiles',
    brand: 'Oso Basics', origin: 'importacion', animals: ['reptiles'], category: 'decoracion', emoji: '🛏️',
    rating: 4.0, reviews: 39,
    variants: [['Único', 129]],
    description: 'Zona de descanso elevada con ventosas, perfecta para dragones barbudos.',
    highlights: ['Ventosas fuertes', 'Lavable', 'Enriquecimiento'],
    guides: ['dragon-barbudo'],
  },
  // --------------------------------------------------------------- Filtración
  {
    handle: 'filtro-canister',
    title: 'Filtro canister externo de 4 etapas',
    brand: 'Aquanorte', origin: 'express', animals: ['peces', 'tortugas'], category: 'filtracion', emoji: '💧',
    rating: 4.6, reviews: 158, option: 'Capacidad',
    variants: [['Hasta 150 L (800 L/h)', 1599, 1899], ['Hasta 300 L (1200 L/h)', 2199, 2499]],
    description: 'Filtración mecánica, biológica y química silenciosa. Imprescindible para tortugas, que ensucian mucho el agua.',
    highlights: ['4 etapas de filtrado', 'Muy silencioso', 'Medios incluidos'],
    guides: ['tortuga-orejas-rojas', 'ciclo-del-nitrogeno'],
  },
  {
    handle: 'filtro-esponja',
    title: 'Filtro de esponja con bomba de aire',
    brand: 'Lagu', origin: 'nacional', animals: ['peces', 'anfibios', 'invertebrados'], category: 'filtracion', emoji: '🫧',
    rating: 4.7, reviews: 264,
    variants: [['Hasta 60 L', 299]],
    description: 'Flujo suave ideal para ajolotes, bettas y camarones. No succiona crías.',
    highlights: ['Corriente suave', 'Seguro para crías', 'Incluye bomba'],
    guides: ['ajolote', 'pez-betta'],
  },
  {
    handle: 'acondicionador-agua',
    title: 'Acondicionador de agua que elimina cloro y cloraminas',
    brand: 'Aquanorte', origin: 'nacional', animals: ['peces', 'anfibios', 'tortugas', 'invertebrados'], category: 'filtracion', emoji: '🧴',
    rating: 4.8, reviews: 612, option: 'Presentación',
    variants: [['120 ml', 119], ['500 ml', 299]],
    description: 'Hace segura el agua de la llave al instante. Úsalo en cada cambio de agua.',
    highlights: ['Acción inmediata', 'Rinde hasta 3,600 L', 'Seguro para anfibios'],
    guides: ['ciclo-del-nitrogeno', 'ajolote', 'pez-betta'],
  },
  // --------------------------------------------------------------- Medición
  {
    handle: 'termohigrometro-digital',
    title: 'Termohigrómetro digital con sonda',
    brand: 'Oso Basics', origin: 'nacional', animals: ['reptiles', 'anfibios', 'invertebrados'], category: 'medicion', emoji: '🌡️',
    rating: 4.5, reviews: 344, option: 'Presentación',
    variants: [['Individual', 159], ['Paquete de 2', 279, 318]],
    description: 'Mide temperatura y humedad para mantener los rangos correctos en zona fría y caliente.',
    highlights: ['Temperatura y humedad', 'Sonda externa', 'Batería incluida'],
    guides: ['gecko-leopardo', 'dragon-barbudo'],
  },
  {
    handle: 'kit-pruebas-agua',
    title: 'Kit de pruebas de agua (amoniaco, nitritos, nitratos, pH)',
    brand: 'Aquanorte', origin: 'express', animals: ['peces', 'anfibios', 'tortugas'], category: 'medicion', emoji: '🧪',
    rating: 4.7, reviews: 201,
    variants: [['Kit maestro', 899, 1049]],
    description: 'Pruebas líquidas precisas para saber cuándo tu acuario está ciclado y seguro.',
    highlights: ['Más de 500 pruebas', 'Resultados en 5 min', 'Tabla de colores'],
    guides: ['ciclo-del-nitrogeno', 'ajolote'],
  },
];

export const DEMO_PRODUCTS: Product[] = seeds.map((s, i) => {
  const optionName = s.option ?? 'Presentación';
  return {
    id: `gid://demo/Product/${i + 1}`,
    handle: s.handle,
    title: s.title,
    description: s.description,
    highlights: s.highlights,
    brand: s.brand,
    origin: s.origin,
    animals: s.animals,
    category: s.category,
    tags: s.tags ?? [],
    images: [],
    emoji: s.emoji,
    rating: s.rating,
    reviewCount: s.reviews,
    options: s.variants.length > 1 ? [{name: optionName, values: s.variants.map((v) => v[0])}] : [],
    variants: s.variants.map(([title, price, compareAt, available], j) => ({
      id: `gid://demo/ProductVariant/${i + 1}0${j + 1}`,
      title,
      price,
      compareAtPrice: compareAt ?? null,
      available: available ?? true,
      options: {[optionName]: title},
    })),
    guides: s.guides ?? [],
    rank: i,
  };
});
