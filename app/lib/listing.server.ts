import {applyFilters, facetCounts, getCatalog, parseFilters, type CatalogContext, type ProductFilters} from '~/lib/catalog';
import {getLocaleFromRequest} from '~/lib/i18n';

/** Carga + filtra productos para cualquier página de listado. */
export async function loadListing(
  context: CatalogContext,
  request: Request,
  base: Partial<ProductFilters> = {},
) {
  const locale = getLocaleFromRequest(request);
  const catalog = getCatalog(context, locale);
  const all = await catalog.getAllProducts();
  const urlFilters = parseFilters(new URL(request.url));
  const filters: ProductFilters = {
    ...urlFilters,
    animal: base.animal ?? urlFilters.animal,
    category: base.category?.length ? base.category : urlFilters.category,
  };
  const products = applyFilters(all, filters);
  return {products, total: products.length, filters: urlFilters, facets: facetCounts(all, filters), locale};
}
