import {LOCALES, ORIGINS, type Locale, type Origin} from './config';

/** Suma días hábiles (lunes a viernes) a una fecha. */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

export function deliveryWindow(origin: Origin, now = new Date()) {
  const {minDays, maxDays} = ORIGINS[origin];
  return {from: addBusinessDays(now, minDays), to: addBusinessDays(now, maxDays)};
}

export function formatDeliveryDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(LOCALES[locale].intl, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/** Orden de rapidez para ordenar listados y agrupar envíos. */
export const ORIGIN_SPEED: Record<Origin, number> = {nacional: 0, express: 1, importacion: 2};
