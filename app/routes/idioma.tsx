import {redirect} from 'react-router';
import type {Route} from './+types/idioma';
import {LOCALE_COOKIE} from '~/lib/i18n';

/** Cambia idioma/moneda y regresa a la página anterior. */
export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'es';
  const to = url.searchParams.get('to') ?? '/';
  const safeTo = to.startsWith('/') && !to.startsWith('//') ? to : '/';
  return redirect(safeTo, {
    headers: {
      'Set-Cookie': `${LOCALE_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`,
    },
  });
}
