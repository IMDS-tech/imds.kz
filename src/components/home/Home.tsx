import Link from 'next/link';
import { BusinessHeroScene } from '@/components/business/BusinessHeroScene';
import { productCardHref, products } from '@/content/products';

const proofItems = ['Self-hosted', 'PostgreSQL', 'Unified SSO', 'API-first', 'GitHub CI/CD'];

const platformFeatures = [
  'Единый вход (SSO) и управление доступом',
  'Self-hosted runtime на инфраструктуре IMDS',
  'Раздельное владение данными и PostgreSQL-контуры',
  'Открытые API-контракты и интеграции',
  'Контролируемый CI/CD через GitHub',
  'Масштабирование продуктов по мере роста бизнеса',
];

const businessValues = [
  { icon: '◎', title: 'Единая экосистема', text: 'Продукты работают в одном технологическом контексте с общими платформенными правилами.' },
  { icon: '◇', title: 'Контроль данных', text: 'Runtime и критичные данные остаются под контролем собственной инфраструктуры IMDS.' },
  { icon: '↗', title: 'Гибкая интеграция', text: 'API-контракты связывают продукты и внешние системы без прямого DB coupling.' },
  { icon: '＋', title: 'Масштабирование', text: 'Можно начать с одного направления и подключать новые продукты по мере роста задач.' },
];

function ProductGlyph({ slug }: { slug: string }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (slug === 'beles') return <svg {...common}><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" /></svg>;
  if (slug === 'mis') return <svg {...common}><circle cx="12" cy="6" r="2.4" /><circle cx="6" cy="16" r="2.4" /><circle cx="18" cy="16" r="2.4" /><path d="M10.4 7.6 7.6 13.6M13.6 7.6l2.8 6M8.4 16h7.2" /></svg>;
  if (slug === 'resto') return <svg {...common}><path d="M7 3v7a2 2 0 0 1-4 0V3M5 12v9M19 3l-2.6 5.4L19 11v10" /></svg>;
  if (slug === 'omnichannel') return <svg {...common}><path d="M4 5h16v10h-8l-5 4v-4H4V5z" /><path d="M8.5 10h.01M12 10h.01M15.5 10h.01" /></svg>;
  if (slug === 'analytics') return <svg {...common}><path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7" /></svg>;
  if (slug === 'ai') return <svg {...common}><circle cx="12" cy="12" r="3.6" /><path d="M12 2.6v4M12 17.4v4M2.6 12h4M17.4 12h4M5.4 5.4l2.8 2.8M15.8 15.8l2.8 2.8M18.6 5.4l-2.8 2.8M8.2 15.8l-2.8 2.8" /></svg>;
  return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2.6" /><path d="M3 10.5h18M7 14.5h4" /></svg>;
}

function Arrow() {
  return <svg className="industry-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Home() {
  return (
    <main className="industry-home business-home" data-industry-home data-business-home>
      <section className="industry-hero business-hero" data-industry-hero data-business-hero>
        <div className="industry-hero-inner">
          <div className="industry-hero-copy">
            <p className="industry-eyebrow">Единая экосистема для роста бизнеса</p>
            <h1 className="industry-hero-h1">
              <span className="industry-hero-line" data-hero-line>Не набор сервисов.</span>
              <span className="industry-hero-line accent" data-hero-line>Одна живая система.</span>
            </h1>
            <p className="industry-hero-desc">
              IMDS объединяет продукты, данные, права доступа и API в единую технологическую среду — чтобы бизнес управлял процессами из общего контекста.
            </p>
            <div className="industry-hero-cta">
              <Link className="industry-btn industry-btn-primary" href="/products">Смотреть продукты <Arrow /></Link>
              <Link className="industry-btn industry-btn-ghost" href="/contact">Запросить демо</Link>
            </div>
            <div className="industry-metrics" aria-label="Ключевые показатели платформы">
              <div><strong>07</strong><span>Продуктов</span></div>
              <div><strong>01</strong><span>Платформа</span></div>
              <div><strong>∞</strong><span>Связанных процессов</span></div>
            </div>
          </div>

          <BusinessHeroScene />
        </div>
      </section>

      <section className="industry-proof" data-proof-bar aria-label="Технологический фундамент IMDS">
        <p>Технологический фундамент IMDS</p>
        <ul>
          {proofItems.map((item) => <li key={item}><span className="industry-proof-dot" />{item}</li>)}
        </ul>
      </section>

      <section className="industry-section" id="products">
        <div className="industry-shell">
          <div className="industry-section-head">
            <div>
              <p className="industry-eyebrow">Наши продукты</p>
              <h2>Решения для ключевых направлений вашего бизнеса</h2>
            </div>
            <Link className="industry-btn industry-btn-ghost" href="/products">Все продукты <Arrow /></Link>
          </div>

          <div className="industry-products">
            {products.map((product) => (
              <Link
                className="industry-product-card"
                data-industry-product-card
                data-business-product-card
                href={productCardHref(product)}
                key={product.slug}
              >
                <span className="industry-product-hex"><ProductGlyph slug={product.slug} /></span>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <span className="industry-more">Подробнее <Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="industry-section" id="platform">
        <div className="industry-shell industry-platform">
          <div className="industry-stack" aria-hidden="true">
            <div className="industry-stack-mark"><span>IMDS</span></div>
            <div className="industry-plane plane-top" data-platform-plane><span>Платформенные сервисы</span></div>
            <div className="industry-plane plane-mid" data-platform-plane><span>Данные и безопасность</span></div>
            <div className="industry-plane plane-bottom" data-platform-plane><span>Инфраструктура</span></div>
          </div>

          <div className="industry-platform-copy">
            <p className="industry-eyebrow">Платформа IMDS</p>
            <h2>Технологический фундамент вашего бизнеса</h2>
            <p className="industry-platform-lead">Единая платформа связывает идентификацию, права доступа, данные, API и продуктовые процессы без потери контроля над инфраструктурой.</p>
            <ul className="industry-features">
              {platformFeatures.map((feature) => <li key={feature}><span className="industry-feature-check">✓</span>{feature}</li>)}
            </ul>
            <Link className="industry-text-link" href="/platform">Подробнее о платформе <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="industry-section" id="why">
        <div className="industry-shell industry-why">
          <div>
            <p className="industry-eyebrow">Почему IMDS</p>
            <h2>Система, которая растёт вместе с бизнесом</h2>
          </div>
          <div className="industry-why-grid">
            {businessValues.map((value) => (
              <article key={value.title} data-industry-value>
                <span className="industry-value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="industry-section industry-final-section">
        <div className="industry-shell industry-final" data-final-cta>
          <span className="industry-final-globe" aria-hidden="true" />
          <div>
            <h2>Готовы вывести ваш бизнес на новый уровень?</h2>
            <p>Расскажите о задаче — мы покажем, как собрать нужный контур из продуктов IMDS.</p>
          </div>
          <Link className="industry-btn industry-btn-primary" href="/contact">Связаться с нами <Arrow /></Link>
        </div>
      </section>
    </main>
  );
}
