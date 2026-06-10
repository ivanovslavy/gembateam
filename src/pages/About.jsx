import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1
        className="text-3xl sm:text-4xl font-bold mb-10 animate-fade-up"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('about.story_title')}
      </h1>

      <div className="space-y-5 mb-14 animate-fade-up delay-100">
        {['story_p1', 'story_p2', 'story_p3'].map(key => (
          <p
            key={key}
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
          >
            {t(`about.${key}`)}
          </p>
        ))}
        <p
          className="text-lg font-semibold italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {t('about.story_p4')}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up delay-200">
        <div
          className="rounded-xl p-6 relative overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #4F46E5, #6366F1)' }} />
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(79,70,229,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {t('about.mission_title')}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {t('about.mission')}
          </p>
        </div>

        <div
          className="rounded-xl p-6 relative overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #06B6D4, #0E7490)' }} />
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(6,182,212,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E7490" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {t('about.vision_title')}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {t('about.vision')}
          </p>
        </div>
      </div>
    </div>
  );
}
