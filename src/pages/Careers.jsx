import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TURNSTILE_SITEKEY = '0x4AAAAAAC9x9LOMuUO7TNVQ';

export default function Careers() {
  const { t } = useTranslation();
  const [cvForm, setCvForm] = useState({ name: '', email: '', message: '' });
  const [cvSending, setCvSending] = useState(false);
  const [cvStatus, setCvStatus] = useState(null);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        });
      }
    };
    if (window.turnstile) { renderWidget(); }
    else {
      const iv = setInterval(() => { if (window.turnstile) { renderWidget(); clearInterval(iv); } }, 200);
      return () => clearInterval(iv);
    }
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch(e) {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  const handleCvSubmit = async (e) => {
    e.preventDefault();
    setCvSending(true);
    setCvStatus(null);
    try {
      const turnstileToken = window.turnstile?.getResponse(widgetIdRef.current);
      if (!turnstileToken) { setCvStatus('error'); setCvSending(false); return; }
      const res = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cvForm, turnstileToken }),
      });
      if (!res.ok) throw new Error();
      setCvStatus('success');
      setCvForm({ name: '', email: '', message: '' });
      if (window.turnstile) window.turnstile.reset(widgetIdRef.current);
    } catch { setCvStatus('error'); }
    finally { setCvSending(false); }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-up" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.intro_title')}</h1>
      <p className="text-base mb-10 animate-fade-up delay-100" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{t('careers.intro')}</p>

      {/* Open Position */}
      <div className="animate-fade-up delay-200">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.open_positions')}</h2>
        <div className="rounded-xl p-6 mb-8 relative overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #4F46E5, #06B6D4)' }} />
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.marketing_title')}</h3>
            <span className="text-xs px-3 py-1 rounded-full shrink-0" style={{ backgroundColor: 'rgba(79,70,229,0.08)', color: '#4F46E5' }}>Remote</span>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{t('careers.marketing_desc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.we_need')}</h4>
              <ul className="space-y-1.5">
                {t('careers.needs', { returnObjects: true }).map((need, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {need}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.we_offer')}</h4>
              <ul className="space-y-1.5">
                {t('careers.offers', { returnObjects: true }).map((offer, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {offer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-5">
            <a href="#cv-form" className="btn-primary text-sm">{t('careers.apply')} →</a>
          </div>
        </div>
      </div>

      {/* Send CV Form */}
      <div id="cv-form" className="animate-fade-up delay-300">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{t('careers.no_role_title')}</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t('careers.no_role')}</p>
          <form onSubmit={handleCvSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('contact.form.name')} *</label>
                <input type="text" required value={cvForm.name} onChange={e => setCvForm({...cvForm, name: e.target.value})} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('contact.form.email')} *</label>
                <input type="email" required value={cvForm.email} onChange={e => setCvForm({...cvForm, email: e.target.value})} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t('contact.form.message')}</label>
              <textarea rows="4" value={cvForm.message} onChange={e => setCvForm({...cvForm, message: e.target.value})} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
            </div>
            <div ref={turnstileRef} />
            {cvStatus === 'success' && <div className="text-sm font-medium px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(5,150,105,0.08)', color: '#059669' }}>{t('contact.form.success')}</div>}
            {cvStatus === 'error' && <div className="text-sm font-medium px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>{t('contact.form.error')}</div>}
            <button type="submit" disabled={cvSending} className="btn-primary text-sm" style={{ opacity: cvSending ? 0.6 : 1 }}>{cvSending ? t('contact.form.sending') : `${t('careers.send_cv')} →`}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
