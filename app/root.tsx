import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Link,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/logo.png';
import tailwindCss from './styles/tailwind.css?url';
import {Layout as StoreLayout} from '~/components/Layout';
import {CartProvider, WishlistProvider} from '~/components/providers';
import {isDemoMode} from '~/lib/catalog';
import {getLocaleFromRequest, translate} from '~/lib/i18n';
import {STORE} from '~/lib/config';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
}

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront, env, customerAccount} = context;
  const locale = getLocaleFromRequest(request);
  const isDemo = isDemoMode(env);

  return {
    locale,
    isDemo,
    isLoggedIn: isDemo ? Promise.resolve(false) : customerAccount.isLoggedIn().catch(() => false),
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: isDemo
      ? null
      : getShopAnalytics({storefront, publicStorefrontId: env.PUBLIC_STOREFRONT_ID}),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

export const meta: Route.MetaFunction = ({data}) => {
  const locale = data?.locale ?? 'es';
  return [
    {title: `${STORE.name} · ${translate(locale, 'home.heroTitle')}`},
    {name: 'description', content: translate(locale, 'home.heroBody')},
    {name: 'theme-color', content: '#0c2a3e'},
  ];
};

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  return (
    <html lang={data?.locale ?? 'es'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function Providers({children}: {children: React.ReactNode}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <StoreLayout>{children}</StoreLayout>
      </WishlistProvider>
    </CartProvider>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  if (!data) return <Outlet />;

  if (!data.shop) {
    return (
      <Providers>
        <Outlet />
      </Providers>
    );
  }
  return (
    <Analytics.Provider cart={null} shop={data.shop} consent={data.consent}>
      <Providers>
        <Outlet />
      </Providers>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData<RootLoader>('root');
  const locale = data?.locale ?? 'es';
  let status = 500;
  let message = 'Error';
  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = typeof error.data === 'string' ? error.data : error.data?.message ?? '';
  } else if (error instanceof Error) {
    message = error.message;
  }

  const body = (
    <div className="container-x grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <p className="mb-2 text-6xl">🦎</p>
        <h1 className="mb-2 text-2xl font-bold">{status === 404 ? translate(locale, 'notFound.title') : `Error ${status}`}</h1>
        {status !== 404 && message ? <pre className="mb-6 text-sm whitespace-pre-wrap text-muted">{message}</pre> : null}
        <Link to="/" className="btn-cta">
          {translate(locale, 'notFound.cta')}
        </Link>
      </div>
    </div>
  );
  return data ? <Providers>{body}</Providers> : body;
}
