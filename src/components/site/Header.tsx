import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
export function Header(){return <header className="site-header"><div className="container nav"><Link className="logo" href="/">IMDS TECH</Link><nav className="nav-links" aria-label="Основная навигация">{siteConfig.nav.map(i=><Link key={i.href} href={i.href}>{i.label}</Link>)}<Link className="button" href="/contact">Связаться</Link></nav><Link className="mobile-toggle button secondary" href="/products" aria-label="Открыть меню">Меню</Link></div></header>}
