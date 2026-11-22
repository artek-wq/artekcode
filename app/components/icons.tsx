type P = {className?: string};
const base = (className = 'size-5') => ({
  className,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
});

export const IconSearch = ({className}: P) => (
  <svg {...base(className)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconCart = ({className}: P) => (
  <svg {...base(className)}><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>
);
export const IconHeart = ({className, filled}: P & {filled?: boolean}) => (
  <svg {...base(className)} fill={filled ? 'currentColor' : 'none'}><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.3 5c2 0 3.2 1.1 3.9 2.2l1.8 2 1.8-2C14.5 6.1 15.7 5 17.7 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20Z" /></svg>
);
export const IconUser = ({className}: P) => (
  <svg {...base(className)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const IconMenu = ({className}: P) => (
  <svg {...base(className)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const IconX = ({className}: P) => (
  <svg {...base(className)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconChevron = ({className, dir = 'right'}: P & {dir?: 'left' | 'right' | 'down'}) => (
  <svg {...base(className)} style={{transform: dir === 'left' ? 'rotate(180deg)' : dir === 'down' ? 'rotate(90deg)' : undefined}}><path d="m9 6 6 6-6 6" /></svg>
);
export const IconTruck = ({className}: P) => (
  <svg {...base(className)}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
);
export const IconShield = ({className}: P) => (
  <svg {...base(className)}><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconChat = ({className}: P) => (
  <svg {...base(className)}><path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 10h8M8 13h5" /></svg>
);
export const IconBag = ({className}: P) => (
  <svg {...base(className)}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const IconClock = ({className}: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const IconPlay = ({className}: P) => (
  <svg {...base(className)}><path d="M8 5v14l11-7L8 5Z" fill="currentColor" /></svg>
);
export const IconSlides = ({className}: P) => (
  <svg {...base(className)}><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M8 21h8" /></svg>
);
export const IconFilter = ({className}: P) => (
  <svg {...base(className)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);
export const IconGlobe = ({className}: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></svg>
);
