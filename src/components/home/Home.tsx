import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { productCardHref, products } from '@/content/products';
import { CinematicExperience } from '@/components/cinematic/CinematicExperience';

export function Home(){
  const featured=products.slice(0,2);
  return <main className="cinematic-home">
    <CinematicExperience />
    <div className="cinematic-content">
      <section className="cinematic-chapter chapter-origin" data-cinematic-chapter="origin">
        <div className="container cinematic-hero-copy">
          <div className="eyebrow cinematic-eyebrow">IMDS TECH · Unified Business Technology</div>
          <h1>Технологии, которые<br/>двигают бизнес.</h1>
          <p className="cinematic-lead">Одна экосистема для управления, маркетинга, коммуникаций, аналитики, AI и финансовых процессов.</p>
          <div className="actions"><Link className="button" href="/products">Смотреть продукты</Link><Link className="button secondary cinematic-secondary" href="/contact">Обсудить задачу</Link></div>
          <div className="scroll-cue"><span>Scroll to explore</span><i /></div>
        </div>
      </section>

      <section className="cinematic-chapter chapter-dive" data-cinematic-chapter="dive">
        <div className="container cinematic-panel narrow-panel">
          <div className="chapter-index">01 / ECOSYSTEM</div>
          <h2>Не набор сервисов.<br/>Одна живая система.</h2>
          <p>Каждый продукт решает свою задачу, но использует общие идентификацию, права доступа, API-контракты и технологический фундамент IMDS.</p>
          <div className="cinematic-stats"><div><strong>07</strong><span>connected products</span></div><div><strong>01</strong><span>shared platform</span></div><div><strong>∞</strong><span>connected workflows</span></div></div>
        </div>
      </section>

      <section className="cinematic-chapter chapter-products" data-cinematic-chapter="products">
        <div className="container">
          <div className="chapter-split"><div><div className="chapter-index">02 / PRODUCTS</div><h2>Семь продуктов.<br/>Один контекст.</h2></div><p>Выберите нужный контур и расширяйте экосистему постепенно. Карточка ведёт сначала на страницу продукта, где можно понять его роль и возможности.</p></div>
          <div className="cinematic-product-grid">{products.map((p,i)=><Link className="product-card product-card-3d cinematic-product-card" data-3d-card="true" style={{'--card-index':i,'--product-accent':p.accent} as CSSProperties} href={productCardHref(p)} key={p.slug}><div className="product-card-depth"><div className="product-orbit-mark"/><Image className="product-logo" src={p.logoPath} alt="" width={112} height={112}/><div className="product-card-meta"><span>0{i+1}</span><span>IMDS PRODUCT</span></div><h3>{p.name}</h3><p className="muted">{p.summary}</p><span className="product-arrow">↗</span></div></Link>)}</div>
        </div>
      </section>

      <section className="cinematic-chapter chapter-spotlight" data-cinematic-chapter="spotlight">
        <div className="container spotlight-stack">
          <div className="chapter-index">03 / SPOTLIGHT</div>
          {featured.map((p,i)=><article className="spotlight-item" key={p.slug}><div className="spotlight-number">0{i+1}</div><div className="spotlight-logo"><Image src={p.logoPath} alt="" width={190} height={190}/></div><div className="spotlight-copy"><span>{p.eyebrow}</span><h2>{p.name}</h2><p>{p.summary}</p><Link href={productCardHref(p)}>Изучить продукт <b>↗</b></Link></div></article>)}
        </div>
      </section>

      <section className="cinematic-chapter chapter-platform" data-cinematic-chapter="platform">
        <div className="container platform-stage">
          <div className="chapter-index">04 / PLATFORM</div>
          <h2>Общая архитектура.<br/>Чёткие границы.</h2>
          <div className="platform-orbit-grid"><div><span>IDENTITY</span><strong>Единый вход</strong><p>SSO и общие entitlements между продуктами.</p></div><div><span>DATA</span><strong>Свои данные</strong><p>Выделенные PostgreSQL-контексты и владение сущностями.</p></div><div><span>CONTRACTS</span><strong>API между продуктами</strong><p>Связи через определённые контракты вместо прямого DB coupling.</p></div><div><span>RUNTIME</span><strong>Self-hosted</strong><p>Критичный runtime работает на инфраструктуре IMDS.</p></div></div>
          <Link className="text-link-light" href="/platform">Изучить IMDS Platform <b>↗</b></Link>
        </div>
      </section>

      <section className="cinematic-chapter chapter-final" data-cinematic-chapter="final">
        <div className="container final-orbit-card">
          <div><div className="chapter-index">05 / NEXT</div><h2>Ваш процесс.<br/>Одна система.</h2><p>Начните с одного продукта или соберите связанную экосистему под задачи организации.</p></div>
          <div className="final-actions"><Link className="button" href="/contact">Связаться с IMDS</Link><Link className="button secondary" href="/products">Все продукты</Link></div>
        </div>
      </section>
    </div>
  </main>;
}
