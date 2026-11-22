import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/favoritos';
import {getCatalog} from '~/lib/catalog';
import {getLocaleFromRequest, useT} from '~/lib/i18n';
import {ProductCard} from '~/components/product';
import {useWishlist} from '~/components/providers';
import {STORE} from '~/lib/config';

export async function loader({context, request}: Route.LoaderArgs) {
  return {products: await getCatalog(context, getLocaleFromRequest(request)).getAllProducts()};
}

export const meta = () => [{title: `Favoritos · ${STORE.name}`}];

export default function Wishlist() {
  const {products} = useLoaderData<typeof loader>();
  const {handles} = useWishlist();
  const t = useT();
  const items = handles.map((h) => products.find((p) => p.handle === h)).filter(Boolean);
  return (
    <div className="container-x py-6">
      <h1 className="mb-1 text-2xl font-bold">♡ {t('wishlist.title')}</h1>
      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="mb-3 text-5xl">♡</p>
          <p className="mx-auto mb-4 max-w-md text-muted">{t('wishlist.empty')}</p>
          <Link to="/collections/all" className="btn-cta">
            {t('cart.continue')}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => (
            <li key={p!.id} className="flex">
              <ProductCard product={p!} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
