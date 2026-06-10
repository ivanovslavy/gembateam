import { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

function LangWrapper({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['en', 'bg', 'es'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <SEOHead />
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />} />
            <Route path="/:lang" element={<LangWrapper><Home /></LangWrapper>} />
            <Route path="/:lang/about" element={<LangWrapper><About /></LangWrapper>} />
            <Route path="/:lang/team" element={<LangWrapper><Team /></LangWrapper>} />
            <Route path="/:lang/careers" element={<LangWrapper><Careers /></LangWrapper>} />
            <Route path="/:lang/contact" element={<LangWrapper><Contact /></LangWrapper>} />
            <Route path="*" element={<Navigate to="/en" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
