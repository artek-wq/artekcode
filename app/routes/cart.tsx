import {Link} from 'react-router';
import {CartShipments, CartTotals} from '~/components/CartDrawer';
import {useCart} from '~/components/providers';
import {useT} from '~/lib/i18n';
import {STORE} from '~/lib/config';

export const meta = () => [{title: `Carrito · ${STORE.name}`}];

export default function CartPage() {
  const {lines} = useCart();
  const t = useT();
  return (
    <div className="container-x py-6">
      <h1 className="mb-4 text-2xl font-bold">{t('cart.title')}</h1>
      {lines.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="mb-3 text-5xl">🛒</p>
          <p className="mb-4 text-muted">{t('cart.empty')}</p>
          <Link to="/collections/all" className="btn-cta">
            {t('cart.continue')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card p-4">
            <CartShipments />
          </div>
          <div className="card h-fit lg:sticky lg:top-32">
            <CartTotals showViewCart={false} />
          </div>
        </div>
      )}
    </div>
  );
}
