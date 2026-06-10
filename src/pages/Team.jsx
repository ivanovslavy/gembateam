import { useTranslation } from 'react-i18next';

export default function Team() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1
        className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-up"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('team.leadership')}
      </h1>
      <p className="text-sm mb-10 animate-fade-up delay-100" style={{ color: 'var(--text-secondary)' }}>
        {t('team.page_title')}
      </p>

      <div
        className="rounded-xl p-6 sm:p-8 animate-fade-up delay-200"
        style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)' }}
          >
            <span className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              SI
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {t('team.name')}
            </h2>
            <p className="text-sm font-medium mb-4 gradient-text">
              {t('team.role')}
            </p>

            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {t('team.bio')}
            </p>

            <div
              className="rounded-lg p-4 italic text-sm"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                borderLeft: '3px solid #4F46E5',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.6,
              }}
            >
              "{t('team.tagline')}"
            </div>

            {/* Certifications */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['SCC/VCA (TÜV Rheinland)', 'BA/N2 Inert Entry', 'Confined Space', 'Crane Operator', 'DevOps', 'Full-Stack', 'Blockchain/Web3'].map(cert => (
                <span
                  key={cert}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
