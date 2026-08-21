export type ProductSlug = 'beles' | 'mis' | 'resto' | 'omnichannel' | 'analytics' | 'ai' | 'finance';

export const productSlugs = ['beles','mis','resto','omnichannel','analytics','ai','finance'] as const satisfies readonly ProductSlug[];

export const siteConfig = {
  origin: 'https://imds.kz',
  name: 'IMDS TECH',
  description: 'Единая технологическая экосистема для управления и развития современного бизнеса.',
  products: productSlugs,
  nav: [
    { label: 'Продукты', href: '/products' },
    { label: 'Платформа', href: '/platform' },
    { label: 'Почему IMDS', href: '/why-imds' },
    { label: 'О компании', href: '/about' },
    { label: 'Блог', href: '/blog' }
  ] as const,
  contactHref: '/contact'
} as const;
