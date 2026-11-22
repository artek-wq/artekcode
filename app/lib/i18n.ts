import {useRouteLoaderData} from 'react-router';
import {LOCALES, type Locale, STORE} from './config';

export const LOCALE_COOKIE = 'oso_lang';

/** Lee el idioma de la cookie; si no hay, intenta Accept-Language; por defecto español. */
export function getLocaleFromRequest(request: Request): Locale {
  const cookie = request.headers.get('Cookie') ?? '';
  const match = cookie.match(new RegExp(`${LOCALE_COOKIE}=(es|en)`));
  if (match) return match[1] as Locale;
  const accept = request.headers.get('Accept-Language') ?? '';
  if (/^en\b/i.test(accept)) return 'en';
  return 'es';
}

const es = {
  'nav.all': 'Todo',
  'nav.guides': 'Guías gratis',
  'nav.tools': 'Calculadoras',
  'nav.deals': 'Ofertas',
  'nav.menu': 'Menú',
  'nav.shopBy': 'Comprar por animal',
  'nav.categories': 'Categorías',
  'search.placeholder': 'Buscar terrarios, lámparas UVB, filtros…',
  'search.button': 'Buscar',
  'search.results': 'Resultados para',
  'account.signIn': 'Iniciar sesión',
  'account.hello': 'Hola',
  'account.rewards': 'Descuentos para miembros',
  'wishlist.title': 'Favoritos',
  'wishlist.empty': 'Aún no guardas productos. Toca el ♡ en cualquier producto para guardarlo aquí, sin necesidad de cuenta.',
  'wishlist.add': 'Guardar en favoritos',
  'wishlist.remove': 'Quitar de favoritos',
  'cart.title': 'Carrito',
  'cart.empty': 'Tu carrito está vacío.',
  'cart.continue': 'Seguir comprando',
  'cart.subtotal': 'Subtotal',
  'cart.checkout': 'Proceder al pago',
  'cart.viewCart': 'Ver carrito',
  'cart.added': 'Agregado al carrito',
  'cart.remove': 'Eliminar',
  'cart.qty': 'Cant.',
  'cart.splitTitle': 'Tu pedido llegará en {n} envíos',
  'cart.splitBody': 'Algunos productos salen de almacenes distintos, por eso llegan en paquetes y fechas diferentes. No pagas envío extra por esto.',
  'cart.shipment': 'Envío {n}',
  'cart.taxes': 'Envío e impuestos se calculan en el pago.',
  'cart.demoCheckout': 'Modo demo: el pago se activará al conectar la tienda de Shopify.',
  'ship.freeFrom': 'Envío gratis en compras desde {amount}',
  'ship.missingPre': 'Te faltan',
  'ship.missingPost': 'para envío gratis',
  'ship.unlocked': '¡Tienes envío gratis!',
  'origin.nacional': 'Entrega 1–3 días',
  'origin.express': 'Entrega 2–5 días',
  'origin.importacion': 'Entrega 10–20 días',
  'origin.filter': 'Tiempo de entrega',
  'delivery.arrives': 'Llega entre el {from} y el {to}',
  'delivery.business': 'días hábiles',
  'product.addToCart': 'Agregar al carrito',
  'product.buyNow': 'Comprar ahora',
  'product.soldOut': 'Agotado',
  'product.reviews': 'opiniones',
  'product.noReviews': 'Sin opiniones todavía',
  'product.description': 'Descripción',
  'product.forAnimals': 'Ideal para',
  'product.learnMore': 'Aprende a usarlo',
  'product.related': 'También te puede servir',
  'product.secure': 'Pago seguro con Shopify',
  'product.returns': 'Devoluciones según política',
  'product.save': 'Ahorras',
  'filters.title': 'Filtros',
  'filters.clear': 'Limpiar filtros',
  'filters.animal': 'Animal',
  'filters.category': 'Categoría',
  'filters.price': 'Precio',
  'filters.min': 'Mín',
  'filters.max': 'Máx',
  'filters.apply': 'Aplicar',
  'filters.rating': 'Calificación',
  'filters.ratingUp': 'y más',
  'filters.deals': 'Solo ofertas',
  'filters.inStock': 'Disponible',
  'filters.brand': 'Marca',
  'filters.show': 'Ver {n} resultados',
  'sort.label': 'Ordenar por',
  'sort.relevance': 'Más relevantes',
  'sort.priceAsc': 'Menor precio',
  'sort.priceDesc': 'Mayor precio',
  'sort.rating': 'Mejor calificados',
  'sort.fastest': 'Entrega más rápida',
  'list.results': '{n} resultados',
  'list.none': 'No encontramos productos con esos filtros.',
  'home.heroTitle': 'Todo para reptiles, anfibios, peces y tortugas',
  'home.heroBody': 'Equipo confiable, guías gratuitas y asesoría para que tu mascota viva sana.',
  'home.heroCta': 'Ver productos',
  'home.heroGuide': 'Asesoría gratis',
  'home.shopByAnimal': 'Compra por animal',
  'home.shopByCategory': 'Categorías populares',
  'home.fast': 'Llegan en pocos días',
  'home.deals': 'Ofertas',
  'home.guides': 'Aprende antes de comprar',
  'home.guidesBody': 'Guías visuales y cortas, revisadas por especialistas.',
  'home.seeAll': 'Ver todo',
  'home.trust1': 'Envío gratis desde {amount}',
  'home.trust2': 'Pago seguro',
  'home.trust3': 'Asesoría gratis',
  'home.trust4': 'Compra sin crear cuenta',
  'legend.title': '¿Cuándo llega?',
  'legend.body': 'Cada producto muestra su color de entrega.',
  'guides.title': 'Guías y asesoría gratis',
  'guides.body': 'Aprende lo esencial en minutos. Toca una guía para verla en diapositivas o lee el artículo completo.',
  'guides.view': 'Ver guía rápida',
  'guides.read': 'Leer artículo',
  'guides.slides': '{n} diapositivas',
  'guides.minutes': '{n} min',
  'guides.kit': 'Lo que vas a necesitar',
  'guides.kitBody': 'Sugerencias basadas en esta guía.',
  'guides.weUse': 'Recomendado para esto',
  'guides.next': 'Siguiente',
  'guides.prev': 'Anterior',
  'guides.close': 'Cerrar',
  'guides.reviewed': 'Contenido revisado por un especialista',
  'guides.pendingReview': 'Contenido en revisión por un especialista',
  'guides.all': 'Todas',
  'guides.video': 'Video',
  'guides.done': 'Ver artículo completo',
  'tools.title': 'Calculadoras',
  'tools.aquarium': 'Calculadora de acuario',
  'tools.aquariumBody': 'Ingresa las medidas y te decimos litros, filtro y calentador adecuados.',
  'tools.length': 'Largo (cm)',
  'tools.width': 'Ancho (cm)',
  'tools.height': 'Alto (cm)',
  'tools.liters': 'Litros aproximados',
  'tools.filter': 'Filtro recomendado',
  'tools.filterBody': 'Que mueva al menos {n} L/h (4–5 veces el volumen por hora).',
  'tools.heater': 'Calentador recomendado',
  'tools.heaterBody': 'Aprox. {n} W (1 W por litro, para elevar 5–8 °C).',
  'tools.weight': 'Peso con agua',
  'tools.weightBody': 'Aprox. {n} kg. Usa un mueble que lo soporte.',
  'footer.help': 'Ayuda',
  'footer.shipping': 'Envíos y tiempos de entrega',
  'footer.returns': 'Devoluciones',
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos',
  'footer.about': 'Oso Shop',
  'footer.aboutBody': 'Productos para reptiles, anfibios, peces y tortugas, con asesoría gratuita.',
  'footer.contact': 'Contacto',
  'footer.language': 'Idioma y moneda',
  'footer.rights': 'Todos los derechos reservados.',
  'demo.banner': 'Vista previa con catálogo de demostración — aún no conectada a Shopify.',
  'notFound.title': 'No encontramos esta página',
  'notFound.cta': 'Volver al inicio',
  'common.from': 'Desde',
};

type Dict = typeof es;
export type TKey = keyof Dict;

const en: Dict = {
  'nav.all': 'All',
  'nav.guides': 'Free guides',
  'nav.tools': 'Calculators',
  'nav.deals': 'Deals',
  'nav.menu': 'Menu',
  'nav.shopBy': 'Shop by animal',
  'nav.categories': 'Categories',
  'search.placeholder': 'Search terrariums, UVB lamps, filters…',
  'search.button': 'Search',
  'search.results': 'Results for',
  'account.signIn': 'Sign in',
  'account.hello': 'Hello',
  'account.rewards': 'Member discounts',
  'wishlist.title': 'Wishlist',
  'wishlist.empty': 'Nothing saved yet. Tap ♡ on any product to save it here — no account needed.',
  'wishlist.add': 'Save to wishlist',
  'wishlist.remove': 'Remove from wishlist',
  'cart.title': 'Cart',
  'cart.empty': 'Your cart is empty.',
  'cart.continue': 'Continue shopping',
  'cart.subtotal': 'Subtotal',
  'cart.checkout': 'Proceed to checkout',
  'cart.viewCart': 'View cart',
  'cart.added': 'Added to cart',
  'cart.remove': 'Remove',
  'cart.qty': 'Qty',
  'cart.splitTitle': 'Your order will arrive in {n} shipments',
  'cart.splitBody': 'Some items ship from different warehouses, so they arrive in separate packages and dates. No extra shipping charge.',
  'cart.shipment': 'Shipment {n}',
  'cart.taxes': 'Shipping and taxes calculated at checkout.',
  'cart.demoCheckout': 'Demo mode: checkout will be enabled once the Shopify store is connected.',
  'ship.freeFrom': 'Free shipping on orders over {amount}',
  'ship.missingPre': '',
  'ship.missingPost': 'away from free shipping',
  'ship.unlocked': 'You unlocked free shipping!',
  'origin.nacional': 'Arrives in 1–3 days',
  'origin.express': 'Arrives in 2–5 days',
  'origin.importacion': 'Arrives in 10–20 days',
  'origin.filter': 'Delivery time',
  'delivery.arrives': 'Arrives {from} – {to}',
  'delivery.business': 'business days',
  'product.addToCart': 'Add to cart',
  'product.buyNow': 'Buy now',
  'product.soldOut': 'Sold out',
  'product.reviews': 'reviews',
  'product.noReviews': 'No reviews yet',
  'product.description': 'Description',
  'product.forAnimals': 'Great for',
  'product.learnMore': 'Learn how to use it',
  'product.related': 'You may also need',
  'product.secure': 'Secure checkout by Shopify',
  'product.returns': 'Returns per policy',
  'product.save': 'You save',
  'filters.title': 'Filters',
  'filters.clear': 'Clear filters',
  'filters.animal': 'Animal',
  'filters.category': 'Category',
  'filters.price': 'Price',
  'filters.min': 'Min',
  'filters.max': 'Max',
  'filters.apply': 'Apply',
  'filters.rating': 'Rating',
  'filters.ratingUp': '& up',
  'filters.deals': 'Deals only',
  'filters.inStock': 'In stock',
  'filters.brand': 'Brand',
  'filters.show': 'Show {n} results',
  'sort.label': 'Sort by',
  'sort.relevance': 'Most relevant',
  'sort.priceAsc': 'Price: low to high',
  'sort.priceDesc': 'Price: high to low',
  'sort.rating': 'Top rated',
  'sort.fastest': 'Fastest delivery',
  'list.results': '{n} results',
  'list.none': 'No products match those filters.',
  'home.heroTitle': 'Everything for reptiles, amphibians, fish and turtles',
  'home.heroBody': 'Reliable gear, free guides and advice so your pet lives a healthy life.',
  'home.heroCta': 'Shop now',
  'home.heroGuide': 'Free advice',
  'home.shopByAnimal': 'Shop by animal',
  'home.shopByCategory': 'Popular categories',
  'home.fast': 'Arrives in a few days',
  'home.deals': 'Deals',
  'home.guides': 'Learn before you buy',
  'home.guidesBody': 'Short, visual guides reviewed by specialists.',
  'home.seeAll': 'See all',
  'home.trust1': 'Free shipping over {amount}',
  'home.trust2': 'Secure payment',
  'home.trust3': 'Free advice',
  'home.trust4': 'Guest checkout',
  'legend.title': 'When does it arrive?',
  'legend.body': 'Every product shows its delivery color.',
  'guides.title': 'Free guides & advice',
  'guides.body': 'Learn the essentials in minutes. Tap a guide to view it as slides or read the full article.',
  'guides.view': 'Quick guide',
  'guides.read': 'Read article',
  'guides.slides': '{n} slides',
  'guides.minutes': '{n} min',
  'guides.kit': 'What you will need',
  'guides.kitBody': 'Suggestions based on this guide.',
  'guides.weUse': 'Recommended for this',
  'guides.next': 'Next',
  'guides.prev': 'Previous',
  'guides.close': 'Close',
  'guides.reviewed': 'Reviewed by a specialist',
  'guides.pendingReview': 'Pending specialist review',
  'guides.all': 'All',
  'guides.video': 'Video',
  'guides.done': 'Read the full article',
  'tools.title': 'Calculators',
  'tools.aquarium': 'Aquarium calculator',
  'tools.aquariumBody': 'Enter the dimensions and we will suggest volume, filter and heater.',
  'tools.length': 'Length (cm)',
  'tools.width': 'Width (cm)',
  'tools.height': 'Height (cm)',
  'tools.liters': 'Approx. liters',
  'tools.filter': 'Recommended filter',
  'tools.filterBody': 'At least {n} L/h (4–5× tank volume per hour).',
  'tools.heater': 'Recommended heater',
  'tools.heaterBody': 'About {n} W (1 W per liter, to raise 5–8 °C).',
  'tools.weight': 'Weight when full',
  'tools.weightBody': 'About {n} kg. Use a stand that can hold it.',
  'footer.help': 'Help',
  'footer.shipping': 'Shipping & delivery times',
  'footer.returns': 'Returns',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.about': 'Oso Shop',
  'footer.aboutBody': 'Supplies for reptiles, amphibians, fish and turtles, with free advice.',
  'footer.contact': 'Contact',
  'footer.language': 'Language & currency',
  'footer.rights': 'All rights reserved.',
  'demo.banner': 'Preview with demo catalog — not yet connected to Shopify.',
  'notFound.title': 'We could not find this page',
  'notFound.cta': 'Back to home',
  'common.from': 'From',
};

const DICTS: Record<Locale, Dict> = {es, en};

export function translate(locale: Locale, key: TKey, vars?: Record<string, string | number>) {
  let s: string = DICTS[locale][key] ?? es[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

/* ----------------------------- Hooks de cliente ---------------------------- */

type RootData = {locale: Locale; isDemo: boolean; isLoggedIn?: Promise<boolean>};

export function useRootData() {
  return useRouteLoaderData('root') as RootData | undefined;
}

export function useLocale(): Locale {
  return useRootData()?.locale ?? 'es';
}

export function useT() {
  const locale = useLocale();
  return (key: TKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

/* --------------------------------- Dinero --------------------------------- */

export function formatMoney(amount: number, locale: Locale) {
  const {currency, intl} = LOCALES[locale];
  return new Intl.NumberFormat(intl, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function useMoney() {
  const locale = useLocale();
  return (amount: number) => formatMoney(amount, locale);
}

/** Umbral de envío gratis convertido a la moneda activa. */
export function freeShippingThreshold(locale: Locale) {
  return locale === 'es'
    ? STORE.freeShippingThresholdMXN
    : Math.round(STORE.freeShippingThresholdMXN / STORE.demoUsdRate);
}
