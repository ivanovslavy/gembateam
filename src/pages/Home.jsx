import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GembaLogo from '../components/GembaLogo';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 sm:py-24 px-4 relative overflow-hidden">
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)' }}
        />
        <div className="relative z-10">
          <div className="flex justify-center mb-6 animate-fade-up">
            <GembaLogo size={72} animated />
          </div>
          <span
            className="inline-block text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full mb-5 animate-fade-up delay-100"
            style={{ color: '#4F46E5', backgroundColor: 'rgba(79,70,229,0.08)' }}
          >
            {t('hero.badge')}
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl mx-auto mb-4 animate-fade-up delay-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('hero.title1')} <span className="gradient-text">{t('hero.title_industry')}</span>{' '}
            {t('hero.title2')} <span className="gradient-text">{t('hero.title_innovation')}</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto mb-8 animate-fade-up delay-300"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            {t('hero.subtitle')}
          </p>
          <div className="animate-fade-up delay-400">
            <Link to={`/${lang}/contact`} className="btn-primary">
              {t('hero.cta')} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sector Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Industrial */}
          <a
            href="https://gembaindustrial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 no-underline group relative overflow-hidden"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #06B6D4, #0E7490)' }} />
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(6,182,212,0.1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E7490" strokeWidth="2">
                <path d="M2 20h20M5 20V8l5 4V8l5 4V4h4v16"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {t('sectors.industrial.title')}
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('sectors.industrial.description')}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {t('sectors.industrial.tags', { returnObjects: true }).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-sm font-medium inline-flex items-center gap-1 transition-all duration-200 group-hover:gap-2" style={{ color: '#06B6D4' }}>
              {t('sectors.industrial.link')} <span>→</span>
            </span>
          </a>

          {/* Tech */}
          <a
            href="https://gembait.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 no-underline group relative overflow-hidden"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #4F46E5, #6366F1)' }} />
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(79,70,229,0.1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {t('sectors.tech.title')}
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {t('sectors.tech.description')}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {t('sectors.tech.tags', { returnObjects: true }).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-sm font-medium inline-flex items-center gap-1 transition-all duration-200 group-hover:gap-2" style={{ color: '#4F46E5' }}>
              {t('sectors.tech.link')} <span>→</span>
            </span>
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '20+', label: t('stats.years_it') },
            { num: '10+', label: t('stats.years_industry') },
            { num: '6+', label: t('stats.refineries') },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center py-5 rounded-xl"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="gradient-text text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.num}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div style={{ borderLeft: '3px solid #4F46E5', paddingLeft: '1.25rem' }}>
          <p className="text-base sm:text-lg italic" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-display)' }}>
            "{t('quote.text')}"
          </p>
          <p className="text-sm mt-3" style={{ color: 'var(--text-tertiary)' }}>
            {t('quote.attr')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {t('contact.title')}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('contact.subtitle')}
        </p>
        <Link to={`/${lang}/contact`} className="btn-primary">
          {t('hero.cta')} <span>→</span>
        </Link>
      </section>
    </div>
  );
}
