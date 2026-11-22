import {Link} from 'react-router';
import type {Route} from './+types/account_.login';
import {isDemoMode} from '~/lib/catalog';
import {useT} from '~/lib/i18n';

export async function loader({request, context}: Route.LoaderArgs) {
  // En modo demo no hay Customer Account API: mostramos un aviso.
  if (isDemoMode(context.env)) return {demo: true};

  const url = new URL(request.url);
  const acrValues = url.searchParams.get('acr_values') || undefined;
  const loginHint = url.searchParams.get('login_hint') || undefined;
  const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
  const locale = url.searchParams.get('locale') || undefined;

  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
    acrValues,
    loginHint,
    loginHintMode,
    locale,
  });
}

export default function DemoLogin() {
  const t = useT();
  return (
    <div className="container-x grid min-h-[50vh] place-items-center py-16 text-center">
      <div className="card max-w-md p-8">
        <p className="mb-3 text-5xl">🐻</p>
        <h1 className="mb-2 text-xl font-bold">{t('account.rewards')}</h1>
        <p className="mb-5 text-sm text-muted">{t('demo.banner')}</p>
        <Link to="/" className="btn-cta">
          {t('notFound.cta')}
        </Link>
      </div>
    </div>
  );
}
