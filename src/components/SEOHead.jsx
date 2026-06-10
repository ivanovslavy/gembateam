import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const meta = {
  en: {
    home: { title: 'GEMBA Team — Where Industry Meets Innovation', desc: 'GEMBA Team unites decades of industrial expertise with cutting-edge technology solutions. Industrial services and IT solutions under one roof.' },
    about: { title: 'About Us — GEMBA Team', desc: 'Our story: from reactor vessels to server rooms. Learn about the unique journey behind GEMBA Team.' },
    team: { title: 'Our Team — GEMBA Team', desc: 'Meet the leadership behind GEMBA Team. Over 20 years in IT and 10+ years in industrial services.' },
    careers: { title: 'Careers — GEMBA Team', desc: 'Join GEMBA Team. We are looking for talented people to help us grow our industrial and technology divisions.' },
    contact: { title: 'Contact — GEMBA Team', desc: 'Get in touch with GEMBA Team. Whether you need reactor specialists or technology solutions — we are here.' },
  },
  bg: {
    home: { title: 'ГЕМБА Тийм — Където индустрията среща иновацията', desc: 'ГЕМБА Тийм обединява десетилетия индустриален опит с модерни технологични решения.' },
    about: { title: 'За нас — ГЕМБА Тийм', desc: 'Нашата история: от реакторни съдове до сървърни стаи.' },
    team: { title: 'Екип — ГЕМБА Тийм', desc: 'Запознайте се с ръководството на ГЕМБА Тийм.' },
    careers: { title: 'Кариери — ГЕМБА Тийм', desc: 'Присъединете се към ГЕМБА Тийм. Търсим талантливи хора.' },
    contact: { title: 'Контакти — ГЕМБА Тийм', desc: 'Свържете се с ГЕМБА Тийм.' },
  },
  es: {
    home: { title: 'GEMBA Team — Donde la industria se encuentra con la innovación', desc: 'GEMBA Team une décadas de experiencia industrial con soluciones tecnológicas de vanguardia.' },
    about: { title: 'Sobre nosotros — GEMBA Team', desc: 'Nuestra historia: de recipientes de reactores a salas de servidores.' },
    team: { title: 'Equipo — GEMBA Team', desc: 'Conozca al liderazgo de GEMBA Team.' },
    careers: { title: 'Carreras — GEMBA Team', desc: 'Únete a GEMBA Team. Buscamos personas con talento.' },
    contact: { title: 'Contacto — GEMBA Team', desc: 'Ponte en contacto con GEMBA Team.' },
  },
};

export default function SEOHead() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language || 'en';
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  const page = pathParts[1] || 'home';
  
  const pageMeta = meta[lang]?.[page] || meta[lang]?.home || meta.en.home;
  const baseUrl = 'https://gembateam.com';
  const canonicalUrl = `${baseUrl}${location.pathname}`;

  const alternates = ['en', 'bg', 'es'].map(l => ({
    lang: l,
    href: `${baseUrl}/${l}${pathParts[1] ? '/' + pathParts[1] : ''}`,
  }));

  return (
    <Helmet>
      <html lang={lang} />
      <title>{pageMeta.title}</title>
      <meta name="description" content={pageMeta.desc} />
      <link rel="canonical" href={canonicalUrl} />
      
      {alternates.map(alt => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${pathParts[1] ? '/' + pathParts[1] : ''}`} />

      {/* Open Graph */}
      <meta property="og:title" content={pageMeta.title} />
      <meta property="og:description" content={pageMeta.desc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="GEMBA Team" />
      <meta property="og:locale" content={lang === 'bg' ? 'bg_BG' : lang === 'es' ? 'es_ES' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageMeta.title} />
      <meta name="twitter:description" content={pageMeta.desc} />

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GEMBA Team EOOD',
          url: 'https://gembateam.com',
          logo: 'https://gembateam.com/logo.svg',
          description: pageMeta.desc,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Varna',
            addressCountry: 'BG',
          },
          sameAs: [
            'https://gembaindustrial.com',
            'https://gembait.com',
            'https://gembapay.com',
          ],
        })}
      </script>
    </Helmet>
  );
}
