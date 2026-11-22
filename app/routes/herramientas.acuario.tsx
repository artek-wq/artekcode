import {Link, useLoaderData} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/herramientas.acuario';
import {getCatalog} from '~/lib/catalog';
import {getLocaleFromRequest, useT} from '~/lib/i18n';
import {ProductHint} from '~/components/guides';
import {STORE} from '~/lib/config';

export async function loader({context, request}: Route.LoaderArgs) {
  const all = await getCatalog(context, getLocaleFromRequest(request)).getAllProducts();
  return {products: Object.fromEntries(all.map((p) => [p.handle, p]))};
}

export const meta = () => [{title: `Calculadora de acuario · ${STORE.name}`}];

export default function AquariumCalculator() {
  const {products} = useLoaderData<typeof loader>();
  const t = useT();
  const [dims, setDims] = useState({l: 60, w: 30, h: 35});
  const liters = Math.round((dims.l * dims.w * dims.h) / 1000);
  const realLiters = Math.round(liters * 0.85); // descontando sustrato, decoración y nivel de agua
  const flow = Math.ceil((realLiters * 4.5) / 50) * 50;
  const watts = Math.max(25, Math.ceil(realLiters / 25) * 25);
  const weight = Math.round(liters * 1.25);

  const filter = realLiters <= 60 ? 'filtro-esponja' : 'filtro-canister';
  const heater = 'calentador-sumergible';

  const field = (key: 'l' | 'w' | 'h', label: string) => (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        type="number"
        min={10}
        max={300}
        inputMode="numeric"
        value={dims[key]}
        onChange={(e) => setDims((d) => ({...d, [key]: Math.max(0, Number(e.target.value) || 0)}))}
        className="rounded-lg border border-line bg-surface px-3 py-2 text-lg"
      />
    </label>
  );

  return (
    <div className="container-x max-w-4xl py-6">
      <Link to="/guias" className="text-sm text-link hover:underline">
        ← {t('guides.title')}
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold">🧮 {t('tools.aquarium')}</h1>
      <p className="mb-6 text-muted">{t('tools.aquariumBody')}</p>

      <div className="card grid gap-4 p-4 sm:grid-cols-3">
        {field('l', t('tools.length'))}
        {field('w', t('tools.width'))}
        {field('h', t('tools.height'))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Result icon="💧" title={t('tools.liters')} value={`${liters} L`} body={`≈ ${realLiters} L de agua real`} />
        <Result icon="⚖️" title={t('tools.weight')} value={`${weight} kg`} body={t('tools.weightBody', {n: weight})} />
        <Result icon="🌀" title={t('tools.filter')} value={`${flow} L/h`} body={t('tools.filterBody', {n: flow})}>
          <ProductHint product={products[filter]} />
        </Result>
        <Result icon="🌡️" title={t('tools.heater')} value={`${watts} W`} body={t('tools.heaterBody', {n: watts})}>
          <ProductHint product={products[heater]} />
        </Result>
      </div>
      <p className="mt-4 text-xs text-muted">
        Cálculos orientativos. Los ajolotes no necesitan calentador; las tortugas requieren un filtro de 2 a 3 veces el volumen.
      </p>
    </div>
  );
}

function Result({icon, title, value, body, children}: {icon: string; title: string; value: string; body: string; children?: React.ReactNode}) {
  return (
    <div className="card flex flex-col gap-2 p-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-extrabold">{value}</p>
        </div>
      </div>
      <p className="text-sm">{body}</p>
      {children}
    </div>
  );
}
