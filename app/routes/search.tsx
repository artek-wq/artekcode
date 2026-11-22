import {useLoaderData} from 'react-router';
import type {Route} from './+types/search';
import {ProductListing} from '~/components/ProductListing';
import {loadListing} from '~/lib/listing.server';
import {useT} from '~/lib/i18n';
import {STORE} from '~/lib/config';

export async function loader({context, request}: Route.LoaderArgs) {
  return loadListing(context, request);
}

export const meta: Route.MetaFunction = ({data}) => [{title: `${data?.filters.q ?? ''} · ${STORE.name}`}];

export default function Search() {
  const {products, total, filters, facets} = useLoaderData<typeof loader>();
  const t = useT();
  return (
    <ProductListing
      title={filters.q ? `${t('search.results')} “${filters.q}”` : t('nav.all')}
      products={products}
      total={total}
      filters={filters}
      facets={facets}
    />
  );
}
