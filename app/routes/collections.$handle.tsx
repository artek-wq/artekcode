import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {ProductListing} from '~/components/ProductListing';
import {loadListing} from '~/lib/listing.server';
import {ANIMALS, CATEGORIES, STORE, isAnimal, isCategory} from '~/lib/config';
import {translate, useLocale} from '~/lib/i18n';

/**
 * /collections/all            → todo el catálogo
 * /collections/reptiles       → por animal
 * /collections/iluminacion    → por categoría
 */
export async function loader({params, context, request}: Route.LoaderArgs) {
  const handle = params.handle ?? 'all';
  if (handle !== 'all' && !isAnimal(handle) && !isCategory(handle)) {
    throw new Response('Not found', {status: 404});
  }
  const data = await loadListing(context, request, {
    animal: isAnimal(handle) ? [handle] : undefined,
    category: isCategory(handle) ? [handle] : undefined,
  });
  return {...data, handle};
}

export const meta: Route.MetaFunction = ({data}) => {
  if (!data) return [];
  const h = data.handle;
  const name = isAnimal(h) ? ANIMALS[h][data.locale] : isCategory(h) ? CATEGORIES[h][data.locale] : translate(data.locale, 'nav.all');
  return [{title: `${name} · ${STORE.name}`}];
};

export default function Collection() {
  const {products, total, filters, facets, handle} = useLoaderData<typeof loader>();
  const locale = useLocale();
  const title = isAnimal(handle)
    ? `${ANIMALS[handle].emoji} ${ANIMALS[handle][locale]}`
    : isCategory(handle)
      ? `${CATEGORIES[handle].emoji} ${CATEGORIES[handle][locale]}`
      : translate(locale, 'nav.all');
  return (
    <ProductListing
      title={title}
      products={products}
      total={total}
      filters={filters}
      facets={facets}
      hide={isAnimal(handle) ? ['animal'] : isCategory(handle) ? ['category'] : []}
    />
  );
}
