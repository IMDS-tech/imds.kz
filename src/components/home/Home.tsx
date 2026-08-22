import Image from 'next/image';
import Link from 'next/link';
import { productCardHref, products } from '@/content/products';

const proofItems = ['Self-hosted', 'PostgreSQL', 'Unified SSO', 'API-first', 'GitHub CI/CD'];

const platformLayers = [
  { label: '04', title: 'Продукты и процессы', text: 'Связанные рабочие сценарии между продуктами IMDS.' },
  { label: '03', title: 'Платформенные сервисы', text: 'Identity, доступ, API-контракты и общие платформенные возможности.' },
  { label: '02', title: 'Данные и безопасность', text: 'Раздельное владение данными и PostgreSQL-контуры продуктов.' },
  { label: '01', title: 'Инфраструктура', text: 'Self-hosted runtime, CI/CD и контролируемая эксплуатация.' },
];

const businessValues = [
  { icon: '◎', title: 'Единая экосистема', text: 'Продукты работают как связанные контуры, а не как набор разрозненных сервисов.' },
  { icon: '◇', title: 'Контроль данных', text: 'Критичные данные и runtime остаются под контролем инфраструктуры IMDS.' },
  { icon: '↗', title: 'Гибкая интеграция', text: 'API-контракты позволяют подключать внешние системы без прямого DB coupling.' },
  { icon: '＋', title: 'Масштабирование', text: 'Можно начать с одного продукта и расширять платформу по мере роста задач.' },
];

export function Home() {
  return (
    <main className="business-home" data-business-home>
      <section className="business-hero">
        <div className="business-hero-grid container">
          <div className="business-hero-copy">
            <div className="business-eyebrow">Единая экосистема для роста бизнеса</div>
            <h1>Не набор сервисов. <span>Одна живая система.</span></h1>
            <p className="business-lead">
              IMDS объединяет продукты, данные, права доступа и API в одну технологическую среду — чтобы бизнес управлял процессами из единого контекста.
            </p>
            <div className="business-actions">
              <Link className="business-button primary" href="/products">Смотреть продукты <b>→</b></Link>
              <Link className="business-button secondary" href="/contact">Запросить демо</Link>
            </div>
            <div className="business-metrics" aria-label="Ключевые показатели платформы">
              <div><strong>07</strong><span>Продуктов<br/>в экосистеме</span></div>
              <div><strong>01</strong><span>Единая<br/>платформа</span></div>
              <div><strong>∞</strong><span>Связанных<br/>процессов</span></div>
            </div>
          </div>

          <div className="business-hero-visual" aria-hidden="true">
            <div className="business-globe" />
            <div className="business-orbit orbit-a" />
            <div className="business-orbit orbit-b" />
            <div className="business-orbit orbit-c" />
            <div className="business-hero-node node-a" />
            <div className="business-hero-node node-b" />
            <div className="business-hero-node node-c" />
            <div className="business-logo-stage">
              <Image src="/imds-brand-mark.svg" alt="" width={430} height={430} priority />
            </div>
            <div className="business-platform-rings"><i/><i/><i/><i/></div>
          </div>
        </div>
      </section>

      <section className="proof-section container" data-proof-bar aria-label="Технологический фундамент">
        <span className="proof-title">Технологический фундамент IMDS</span>
        <div className="proof-items">{proofItems.map(item => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="business-section products-section">
        <div className="container">
          <div className="business-section-head">
            <div>
              <div className="business-kicker">Наши продукты</div>
              <h2>Решения для ключевых направлений бизнеса</h2>
            </div>
            <Link className="business-text-link" href="/products">Все продукты <span>→</span></Link>
          </div>

          <div className="business-product-grid">
            {products.map((product) => (
              <Link
                href={productCardHref(product)}
                key={product.slug}
                className="business-product-card"
                data-business-product-card
              >
                <div className="business-product-logo-wrap">
                  <Image className="product-logo" src={product.logoPath} alt={`${product.name} logo`} width={110} height={110} />
                </div>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <span className="business-card-link">Подробнее <b>→</b></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="business-section platform-business-section">
        <div className="container platform-business-card">
          <div className="platform-stack" aria-hidden="true">
            {platformLayers.slice().reverse().map((layer, index) => (
              <div className={`platform-layer layer-${index + 1}`} key={layer.label} data-platform-layer>
                <span>{layer.label}</span><strong>{layer.title}</strong>
              </div>
            ))}
          </div>
          <div className="platform-business-copy">
            <div className="business-kicker">Платформа IMDS</div>
            <h2>Технологический фундамент вашего бизнеса</h2>
            <p>Общая платформа даёт продуктам единый вход, управляемые права, API-контракты и чёткие границы владения данными.</p>
            <div className="platform-points">
              {platformLayers.map(layer => <div key={layer.label}><span>{layer.label}</span><div><strong>{layer.title}</strong><p>{layer.text}</p></div></div>)}
            </div>
            <Link className="business-text-link light" href="/platform">Подробнее о платформе <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="business-section values-section">
        <div className="container values-layout">
          <div className="values-intro">
            <div className="business-kicker">Почему IMDS</div>
            <h2>Система, которая растёт вместе с бизнесом</h2>
            <p>Мы строим не отдельные интерфейсы, а связанную технологическую среду с понятными границами и единым контекстом.</p>
          </div>
          <div className="business-values-grid">
            {businessValues.map(value => (
              <article key={value.title} className="business-value-card" data-business-value>
                <span className="business-value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="business-section business-cta-section">
        <div className="container business-cta-card">
          <div>
            <div className="business-kicker">Следующий шаг</div>
            <h2>Готовы собрать единую систему для вашего бизнеса?</h2>
            <p>Начните с одного продукта или свяжите несколько направлений в единую экосистему IMDS.</p>
          </div>
          <Link className="business-button primary large" href="/contact">Связаться с IMDS <b>→</b></Link>
        </div>
      </section>
    </main>
  );
}
