import {Form, Link, NavLink, useLocation, useSearchParams} from 'react-router';
import {useEffect, useState} from 'react';
import {ANIMALS, ANIMAL_KEYS, CATEGORIES, CATEGORY_KEYS, LOCALES, ORIGIN_KEYS, STORE, type Locale} from '~/lib/config';
import {freeShippingThreshold, useLocale, useMoney, useRootData, useT} from '~/lib/i18n';
import {useCart, useWishlist} from './providers';
import {CartDrawer} from './CartDrawer';
import {OriginBadge} from './product';
import {IconCart, IconChevron, IconGlobe, IconHeart, IconMenu, IconSearch, IconUser, IconX} from './icons';

export function Layout({children}: {children: React.ReactNode}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-cta focus:p-2">
        Saltar al contenido
      </a>
      <TopBanner />
      <Header onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function TopBanner() {
  const t = useT();
  const money = useMoney();
  const locale = useLocale();
  const root = useRootData();
  return (
    <div className="bg-brand text-center text-xs text-white">
      <p className="container-x py-1.5">
        🚚 {t('ship.freeFrom', {amount: money(freeShippingThreshold(locale))})}
        {root?.isDemo ? <span className="ml-2 hidden opacity-80 md:inline">· {t('demo.banner')}</span> : null}
      </p>
    </div>
  );
}

export function Logo({className = ''}: {className?: string}) {
  // Reemplazar por el logo oficial: coloca el archivo en app/assets/logo.svg e impórtalo aquí.
  return (
    <Link to="/" className={`flex items-center gap-1.5 rounded px-1 font-extrabold tracking-tight text-white ${className}`} aria-label={STORE.name}>
      <span className="grid size-8 place-items-center rounded-full bg-cta text-lg">🐻</span>
      <span className="text-xl leading-none">
        Oso<span className="text-cta">Shop</span>
      </span>
    </Link>
  );
}

function SearchBar({className = ''}: {className?: string}) {
  const t = useT();
  const [params] = useSearchParams();
  const location = useLocation();
  const q = location.pathname === '/search' ? params.get('q') ?? '' : '';
  return (
    <Form method="get" action="/search" role="search" className={`flex h-10 overflow-hidden rounded-lg bg-white ring-cta focus-within:ring-2 ${className}`}>
      <label htmlFor="q" className="sr-only">
        {t('search.button')}
      </label>
      <input
        id="q"
        name="q"
        type="search"
        key={q}
        defaultValue={q}
        placeholder={t('search.placeholder')}
        className="min-w-0 flex-1 px-3 text-sm text-ink outline-none placeholder:text-muted"
        autoComplete="off"
      />
      <button type="submit" className="grid w-12 place-items-center bg-cta text-cta-ink hover:bg-cta-hover" aria-label={t('search.button')}>
        <IconSearch />
      </button>
    </Form>
  );
}

function Header({onMenu}: {onMenu: () => void}) {
  const t = useT();
  const locale = useLocale();
  const {count, setOpen} = useCart();
  const {handles} = useWishlist();

  return (
    <header className="sticky top-0 z-30 bg-ink text-white shadow">
      <div className="container-x flex items-center gap-2 py-2 md:gap-4">
        <button type="button" onClick={onMenu} className="rounded p-1.5 hover:bg-white/10 md:hidden" aria-label={t('nav.menu')}>
          <IconMenu className="size-6" />
        </button>
        <Logo />
        <SearchBar className="hidden flex-1 md:flex" />
        <nav className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-1" aria-label="Cuenta">
          <LanguageSwitch locale={locale} className="hidden lg:flex" />
          <Link to="/account" className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-white/10">
            <IconUser className="size-6" />
            <span className="hidden text-left text-xs leading-tight lg:block">
              {t('account.signIn')}
              <br />
              <strong className="text-sm">{t('account.rewards')}</strong>
            </span>
          </Link>
          <Link to="/favoritos" className="relative rounded p-1.5 hover:bg-white/10" aria-label={t('wishlist.title')}>
            <IconHeart className="size-6" />
            {handles.length ? <Badge n={handles.length} /> : null}
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="relative flex items-center gap-1 rounded p-1.5 hover:bg-white/10" aria-label={`${t('cart.title')} (${count})`}>
            <IconCart className="size-7" />
            <span className="hidden text-sm font-semibold md:inline">{t('cart.title')}</span>
            {count ? <Badge n={count} /> : null}
          </button>
        </nav>
      </div>
      <div className="container-x pb-2 md:hidden">
        <SearchBar />
      </div>
      <SubNav />
    </header>
  );
}

function Badge({n}: {n: number}) {
  return (
    <span className="absolute -top-0.5 left-5 min-w-5 rounded-full bg-cta px-1 text-center text-[11px] leading-5 font-bold text-cta-ink">
      {n > 99 ? '99+' : n}
    </span>
  );
}

function SubNav() {
  const t = useT();
  const locale = useLocale();
  const item = 'whitespace-nowrap rounded px-2.5 py-1 text-sm hover:bg-white/10';
  return (
    <nav className="bg-ink-2" aria-label="Principal">
      <div className="container-x scroll-row items-center gap-1 py-1 pb-1">
        <NavLink to="/collections/all" className={`${item} font-semibold`}>
          {t('nav.all')}
        </NavLink>
        {ANIMAL_KEYS.map((a) => (
          <NavLink key={a} to={`/collections/${a}`} className={({isActive}) => `${item} ${isActive ? 'bg-white/15' : ''}`}>
            {ANIMALS[a][locale]}
          </NavLink>
        ))}
        <span className="mx-1 h-4 w-px bg-white/20" aria-hidden />
        <NavLink to="/guias" className={`${item} font-semibold text-cta`}>
          📘 {t('nav.guides')}
        </NavLink>
        <NavLink to="/herramientas/acuario" className={item}>
          {t('nav.tools')}
        </NavLink>
        <NavLink to="/collections/all?ofertas=1" className={item}>
          {t('nav.deals')}
        </NavLink>
      </div>
    </nav>
  );
}

export function LanguageSwitch({locale, className = ''}: {locale: Locale; className?: string}) {
  const location = useLocation();
  const next: Locale = locale === 'es' ? 'en' : 'es';
  const to = `${location.pathname}${location.search}`;
  return (
    <a
      href={`/idioma?lang=${next}&to=${encodeURIComponent(to)}`}
      className={`items-center gap-1 rounded px-2 py-1.5 text-xs font-semibold hover:bg-white/10 ${className}`}
      title={LOCALES[next].label}
    >
      <IconGlobe className="size-4" />
      {locale.toUpperCase()} · {LOCALES[locale].currency}
    </a>
  );
}

function MobileMenu({open, onClose}: {open: boolean; onClose: () => void}) {
  const t = useT();
  const locale = useLocale();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label={t('guides.close')} />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-surface">
        <div className="flex items-center justify-between bg-ink p-4 text-white">
          <Link to="/account" className="flex items-center gap-2 font-semibold">
            <IconUser /> {t('account.signIn')}
          </Link>
          <button type="button" onClick={onClose} aria-label={t('guides.close')}>
            <IconX />
          </button>
        </div>
        <MenuGroup title={t('nav.shopBy')}>
          {ANIMAL_KEYS.map((a) => (
            <MenuLink key={a} to={`/collections/${a}`}>
              {ANIMALS[a].emoji} {ANIMALS[a][locale]}
            </MenuLink>
          ))}
        </MenuGroup>
        <MenuGroup title={t('nav.categories')}>
          {CATEGORY_KEYS.map((c) => (
            <MenuLink key={c} to={`/collections/all?categoria=${c}`}>
              {CATEGORIES[c].emoji} {CATEGORIES[c][locale]}
            </MenuLink>
          ))}
        </MenuGroup>
        <MenuGroup title={t('guides.title')}>
          <MenuLink to="/guias">📘 {t('nav.guides')}</MenuLink>
          <MenuLink to="/herramientas/acuario">🧮 {t('tools.aquarium')}</MenuLink>
          <MenuLink to="/favoritos">♡ {t('wishlist.title')}</MenuLink>
        </MenuGroup>
        <div className="p-4">
          <LanguageSwitch locale={locale} className="flex w-fit border border-line text-ink" />
        </div>
      </div>
    </div>
  );
}

function MenuGroup({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="border-b border-line py-2">
      <p className="px-4 py-2 text-sm font-bold">{title}</p>
      <ul>{children}</ul>
    </div>
  );
}
function MenuLink({to, children}: {to: string; children: React.ReactNode}) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-page">
        <span>{children}</span>
        <IconChevron className="size-4 text-muted" />
      </Link>
    </li>
  );
}

function Footer() {
  const t = useT();
  const locale = useLocale();
  return (
    <footer className="mt-12 bg-ink text-sm text-white/80">
      <a href="#main" className="block bg-ink-2 py-3 text-center text-xs hover:bg-white/10">
        ↑ {locale === 'es' ? 'Volver arriba' : 'Back to top'}
      </a>
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="-ml-1 mb-3" />
          <p className="max-w-xs">{t('footer.aboutBody')}</p>
        </div>
        <div>
          <p className="mb-3 font-bold text-white">{t('legend.title')}</p>
          <ul className="space-y-2">
            {ORIGIN_KEYS.map((o) => (
              <li key={o}>
                <OriginBadge origin={o} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold text-white">{t('footer.help')}</p>
          <ul className="space-y-2">
            <li><Link to="/policies/shipping-policy" className="hover:underline">{t('footer.shipping')}</Link></li>
            <li><Link to="/policies/refund-policy" className="hover:underline">{t('footer.returns')}</Link></li>
            <li><Link to="/policies/privacy-policy" className="hover:underline">{t('footer.privacy')}</Link></li>
            <li><Link to="/policies/terms-of-service" className="hover:underline">{t('footer.terms')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold text-white">{t('footer.contact')}</p>
          <p className="mb-4">
            <a className="hover:underline" href={`mailto:${STORE.supportEmail}`}>{STORE.supportEmail}</a>
          </p>
          <p className="mb-2 font-bold text-white">{t('footer.language')}</p>
          <LanguageSwitch locale={locale} className="flex w-fit border border-white/20" />
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {STORE.name} · {STORE.domain} · {t('footer.rights')}
      </p>
    </footer>
  );
}
