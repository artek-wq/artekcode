import {Link, useLoaderData, useSearchParams} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/guias._index';
import {GUIDES, type Guide} from '~/content/guides';
import {GuideCard, GuideDialog} from '~/components/guides';
import {getCatalog} from '~/lib/catalog';
import {ANIMALS, ANIMAL_KEYS, STORE, isAnimal} from '~/lib/config';
import {getLocaleFromRequest, translate, useLocale, useT} from '~/lib/i18n';

export async function loader({context, request}: Route.LoaderArgs) {
  const locale = getLocaleFromRequest(request);
  const all = await getCatalog(context, locale).getAllProducts();
  return {products: Object.fromEntries(all.map((p) => [p.handle, p])), locale};
}

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${translate(data?.locale ?? 'es', 'guides.title')} · ${STORE.name}`},
];

export default function GuidesHub() {
  const {products} = useLoaderData<typeof loader>();
  const t = useT();
  const locale = useLocale();
  const [params] = useSearchParams();
  const animal = params.get('animal');
  const [open, setOpen] = useState<Guide | null>(null);
  const list = isAnimal(animal) ? GUIDES.filter((g) => g.animal === animal) : GUIDES;
  const animalsWithGuides = ANIMAL_KEYS.filter((a) => GUIDES.some((g) => g.animal === a));

  return (
    <div>
      <section className="bg-brand text-white">
        <div className="container-x py-8 md:py-12">
          <p className="mb-2 text-sm font-semibold text-cta">📘 Oso Shop</p>
          <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">{t('guides.title')}</h1>
          <p className="max-w-2xl text-white/85">{t('guides.body')}</p>
        </div>
      </section>

      <div className="container-x py-6">
        <div className="scroll-row mb-5">
          <Link to="/guias" preventScrollReset className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${!animal ? 'border-ink bg-ink text-white' : 'border-line bg-surface'}`}>
            {t('guides.all')}
          </Link>
          {animalsWithGuides.map((a) => (
            <Link key={a} to={`/guias?animal=${a}`} preventScrollReset className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${animal === a ? 'border-ink bg-ink text-white' : 'border-line bg-surface'}`}>
              {ANIMALS[a].emoji} {ANIMALS[a][locale]}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <GuideCard key={g.handle} guide={g} onOpen={() => setOpen(g)} />
          ))}
          <Link to="/herramientas/acuario" className="card flex flex-col justify-center gap-2 border-dashed p-6 text-center hover:shadow-md">
            <span className="text-5xl">🧮</span>
            <span className="font-semibold">{t('tools.aquarium')}</span>
            <span className="text-sm text-muted">{t('tools.aquariumBody')}</span>
          </Link>
        </div>
      </div>

      <GuideDialog guide={open} products={products} onClose={() => setOpen(null)} />
    </div>
  );
}
