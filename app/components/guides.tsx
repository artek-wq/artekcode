import {Link} from 'react-router';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {Guide, Slide} from '~/content/guides';
import {ANIMALS} from '~/lib/config';
import {useLocale, useMoney, useT} from '~/lib/i18n';
import {minPrice, type Product} from '~/lib/catalog/types';
import {OriginBadge, ProductThumb} from './product';
import {useCart} from './providers';
import {IconChevron, IconPlay, IconSlides, IconX} from './icons';

const TINT: Record<Guide['tint'], string> = {
  sand: 'bg-tint-sand',
  leaf: 'bg-tint-leaf',
  water: 'bg-tint-water',
  sun: 'bg-tint-sun',
};

/* ---------------------------------- Tarjeta ---------------------------------- */

export function GuideCard({guide, compact = false, onOpen}: {guide: Guide; compact?: boolean; onOpen?: () => void}) {
  const t = useT();
  const locale = useLocale();
  const cover = (
    <div className={`relative grid aspect-[16/10] place-items-center ${TINT[guide.tint]}`}>
      <span className="text-6xl drop-shadow-sm">{guide.emoji}</span>
      <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-ink/85 px-2 py-0.5 text-[11px] font-semibold text-white">
        <IconSlides className="size-3.5" /> {t('guides.slides', {n: guide.slides.length})} · {t('guides.minutes', {n: guide.minutes})}
      </span>
    </div>
  );
  return (
    <article className={`card flex flex-col overflow-hidden transition hover:shadow-md ${compact ? 'w-64 shrink-0' : ''}`}>
      {onOpen ? (
        <button type="button" onClick={onOpen} className="text-left" aria-label={`${t('guides.view')}: ${guide.title}`}>
          {cover}
        </button>
      ) : (
        <Link to={`/guias/${guide.handle}?ver=1`}>{cover}</Link>
      )}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-muted">
          {ANIMALS[guide.animal].emoji} {ANIMALS[guide.animal][locale]}
        </span>
        <h3 className="leading-snug font-semibold">{guide.title}</h3>
        {!compact ? <p className="text-sm text-muted">{guide.summary}</p> : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {onOpen ? (
            <button type="button" onClick={onOpen} className="btn-cta px-3 py-1.5 text-xs">
              <IconPlay className="size-3.5" /> {t('guides.view')}
            </button>
          ) : (
            <Link to={`/guias/${guide.handle}?ver=1`} className="btn-cta px-3 py-1.5 text-xs">
              <IconPlay className="size-3.5" /> {t('guides.view')}
            </Link>
          )}
          <Link to={`/guias/${guide.handle}`} className="btn-ghost px-3 py-1.5 text-xs">
            {t('guides.read')}
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ Sugerencia discreta ------------------------------ */

export function ProductHint({product, label}: {product: Product | undefined; label?: string}) {
  const money = useMoney();
  const t = useT();
  const {add} = useCart();
  if (!product) return null;
  const v = product.variants.find((x) => x.available) ?? product.variants[0];
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface/90 p-2 text-left shadow-sm">
      <Link to={`/products/${product.handle}`} className="size-14 shrink-0 overflow-hidden rounded-md">
        <ProductThumb product={product} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">{label ?? t('guides.weUse')}</p>
        <Link to={`/products/${product.handle}`} className="line-clamp-1 text-sm hover:text-link">
          {product.title}
        </Link>
        <p className="flex items-center gap-2 text-sm">
          <strong>{money(minPrice(product))}</strong>
          <OriginBadge origin={product.origin} />
        </p>
      </div>
      <button type="button" onClick={() => add(product, v)} className="btn-ghost shrink-0 px-3 py-1.5 text-xs" aria-label={`${t('product.addToCart')}: ${product.title}`}>
        + 🛒
      </button>
    </div>
  );
}

/* ---------------------------------- Diálogo ---------------------------------- */

export function GuideDialog({
  guide,
  products,
  onClose,
}: {
  guide: Guide | null;
  products: Record<string, Product>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const t = useT();
  const total = guide?.slides.length ?? 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (guide && !d.open) {
      setI(0);
      d.showModal();
    } else if (!guide && d.open) d.close();
  }, [guide]);

  const go = useCallback((n: number) => setI((cur) => Math.max(0, Math.min(total, cur + n))), [total]);

  useEffect(() => {
    if (!guide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guide, go]);

  // Deslizar con el dedo
  const touchX = useRef<number | null>(null);

  const isKit = guide && i === total;
  const slide = guide && !isKit ? guide.slides[i] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto w-[min(96vw,720px)] overflow-hidden rounded-2xl bg-transparent p-0 backdrop:backdrop-blur-sm"
      aria-label={guide?.title}
    >
      {guide ? (
        <div
          className={`flex max-h-[92vh] flex-col ${TINT[guide.tint]}`}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <header className="flex items-center gap-3 px-4 pt-3">
            <div className="flex flex-1 gap-1" aria-hidden>
              {Array.from({length: total + 1}, (_, n) => (
                <span key={n} className={`h-1 flex-1 rounded-full ${n <= i ? 'bg-ink' : 'bg-ink/15'}`} />
              ))}
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="rounded-full bg-white/70 p-1.5 hover:bg-white" aria-label={t('guides.close')}>
              <IconX className="size-5" />
            </button>
          </header>

          <div className="min-h-[420px] flex-1 overflow-y-auto px-5 py-4 md:px-8" aria-live="polite">
            {slide ? <SlideView slide={slide} /> : null}
            {isKit ? (
              <div>
                <h2 className="mb-1 text-center text-2xl font-bold">🧰 {t('guides.kit')}</h2>
                <p className="mb-4 text-center text-sm text-muted">{t('guides.kitBody')}</p>
                <div className="grid gap-2">
                  {guide.kit.map((h) => (
                    <ProductHint key={h} product={products[h]} label=" " />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link to={`/guias/${guide.handle}`} onClick={() => ref.current?.close()} className="link text-sm">
                    {t('guides.done')} →
                  </Link>
                </div>
              </div>
            ) : null}
            {slide && 'product' in slide && slide.product ? (
              <div className="mx-auto mt-6 max-w-md">
                <ProductHint product={products[slide.product]} />
              </div>
            ) : null}
          </div>

          <footer className="flex items-center justify-between gap-2 px-4 pb-4">
            <button type="button" onClick={() => go(-1)} disabled={i === 0} className="btn-ghost px-3 disabled:invisible">
              <IconChevron dir="left" className="size-4" /> {t('guides.prev')}
            </button>
            <span className="text-xs text-muted">
              {i + 1} / {total + 1}
            </span>
            {i < total ? (
              <button type="button" onClick={() => go(1)} className="btn-dark px-4">
                {t('guides.next')} <IconChevron className="size-4" />
              </button>
            ) : (
              <button type="button" onClick={() => ref.current?.close()} className="btn-dark px-4">
                {t('guides.close')}
              </button>
            )}
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}

/* ------------------------------ Diapositivas ------------------------------ */

export function SlideView({slide}: {slide: Slide}) {
  switch (slide.type) {
    case 'cover':
      return (
        <div className="grid min-h-[360px] place-items-center text-center">
          <div>
            <div className="mb-4 text-[7rem] leading-none drop-shadow">{slide.emoji}</div>
            <h2 className="text-3xl font-extrabold md:text-4xl">{slide.title}</h2>
            <p className="mt-2 text-lg text-muted">{slide.subtitle}</p>
          </div>
        </div>
      );
    case 'stats':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <div className={`grid gap-3 ${slide.items.length > 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {slide.items.map((it) => (
              <div key={it.label} className="rounded-xl bg-white/80 p-4 text-center shadow-sm">
                <div className="text-4xl">{it.icon}</div>
                <div className="mt-1 text-2xl font-extrabold">{it.value}</div>
                <div className="text-sm text-muted">{it.label}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'gradient':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <div className="rounded-xl bg-white/80 p-4 shadow-sm">
            <div className="flex justify-between text-sm font-semibold">
              <span>❄️ {slide.cold.label}</span>
              <span>{slide.hot.label} 🔥</span>
            </div>
            <div className="my-3 h-16 rounded-xl bg-gradient-to-r from-sky-300 via-amber-200 to-orange-500 shadow-inner" />
            <div className="flex justify-between text-2xl font-extrabold">
              <span className="text-sky-700">{slide.cold.value}</span>
              <span className="text-orange-700">{slide.hot.value}</span>
            </div>
          </div>
          {slide.note ? <p className="mt-4 text-center text-base">💡 {slide.note}</p> : null}
        </div>
      );
    case 'checklist':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <ul className="grid gap-3 sm:grid-cols-3">
            {slide.items.map((it) => (
              <li key={it.text} className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm sm:flex-col sm:text-center">
                <span className="text-4xl">{it.icon}</span>
                <span className="font-semibold">{it.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'steps':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <ol className="space-y-2">
            {slide.steps.map((s, n) => (
              <li key={s} className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-lg font-bold text-white">{n + 1}</span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'dosdonts':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <ul className="space-y-2 rounded-xl bg-o-nacional-bg p-4">
              {slide.dos.map((d) => (
                <li key={d} className="flex gap-2 font-medium">
                  <span>✅</span>
                  {d}
                </li>
              ))}
            </ul>
            <ul className="space-y-2 rounded-xl bg-red-100 p-4">
              {slide.donts.map((d) => (
                <li key={d} className="flex gap-2 font-medium">
                  <span>❌</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case 'cycle':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center">
            {slide.nodes.map((n, idx) => (
              <li key={n.label} className="flex flex-1 flex-col items-center sm:flex-row">
                <div className="w-full rounded-xl bg-white/80 p-3 text-center shadow-sm">
                  <div className="text-3xl">{n.icon}</div>
                  <div className="font-bold">{n.label}</div>
                  {n.sub ? <div className="text-xs text-muted">{n.sub}</div> : null}
                </div>
                {idx < slide.nodes.length - 1 ? (
                  <span className="px-1 text-2xl text-muted" aria-hidden>
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-center text-sm text-muted">🦠 Las bacterias del filtro hacen cada paso.</p>
        </div>
      );
    case 'video':
      return (
        <div>
          <SlideTitle>{slide.title}</SlideTitle>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
            {slide.youtubeId ? (
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${slide.youtubeId}`}
                title={slide.title}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="grid size-full place-items-center text-white/80">
                <div className="text-center">
                  <IconPlay className="mx-auto size-14" />
                  <p className="mt-2 text-sm">{slide.caption}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
  }
}

function SlideTitle({children}: {children: React.ReactNode}) {
  return <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">{children}</h2>;
}
