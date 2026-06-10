import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://gembateam.com';
const LANGS = ['en', 'bg', 'es'];
const PAGES = ['home', 'about', 'team', 'careers', 'contact'];

const meta = {
  en: {
    home: {
      title: 'GEMBA Team — Where Industry Meets Innovation',
      desc: 'GEMBA Team unites decades of industrial expertise with cutting-edge technology solutions. Industrial services and IT solutions under one roof.',
    },
    about: {
      title: 'About Us — GEMBA Team',
      desc: 'Our story: from reactor vessels to server rooms. Learn about the unique journey behind GEMBA Team.',
    },
    team: {
      title: 'Our Team — GEMBA Team',
      desc: 'Meet the leadership behind GEMBA Team. Over 20 years in IT and 10+ years in industrial services.',
    },
    careers: {
      title: 'Careers — GEMBA Team',
      desc: 'Join GEMBA Team. We are looking for talented people to help us grow our industrial and technology divisions.',
    },
    contact: {
      title: 'Contact — GEMBA Team',
      desc: 'Get in touch with GEMBA Team. Whether you need reactor specialists or technology solutions — we are here.',
    },
  },
  bg: {
    home: {
      title: 'ГЕМБА Тийм — Където индустрията среща иновацията',
      desc: 'ГЕМБА Тийм обединява десетилетия индустриален опит с модерни технологични решения.',
    },
    about: {
      title: 'За нас — ГЕМБА Тийм',
      desc: 'Нашата история: от реакторни съдове до сървърни стаи.',
    },
    team: {
      title: 'Екип — ГЕМБА Тийм',
      desc: 'Запознайте се с ръководството на ГЕМБА Тийм.',
    },
    careers: {
      title: 'Кариери — ГЕМБА Тийм',
      desc: 'Присъединете се към ГЕМБА Тийм. Търсим талантливи хора.',
    },
    contact: {
      title: 'Контакти — ГЕМБА Тийм',
      desc: 'Свържете се с ГЕМБА Тийм.',
    },
  },
  es: {
    home: {
      title: 'GEMBA Team — Donde la industria se encuentra con la innovación',
      desc: 'GEMBA Team une décadas de experiencia industrial con soluciones tecnológicas de vanguardia.',
    },
    about: {
      title: 'Sobre nosotros — GEMBA Team',
      desc: 'Nuestra historia: de recipientes de reactores a salas de servidores.',
    },
    team: {
      title: 'Equipo — GEMBA Team',
      desc: 'Conozca al liderazgo de GEMBA Team.',
    },
    careers: {
      title: 'Carreras — GEMBA Team',
      desc: 'Únete a GEMBA Team. Buscamos personas con talento.',
    },
    contact: {
      title: 'Contacto — GEMBA Team',
      desc: 'Ponte en contacto con GEMBA Team.',
    },
  },
};

const ogLocale = { en: 'en_US', bg: 'bg_BG', es: 'es_ES' };

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pathFor(lang, page) {
  return page === 'home' ? `/${lang}` : `/${lang}/${page}`;
}

function buildHeadBlock(lang, page) {
  const m = meta[lang][page];
  const url = `${BASE_URL}${pathFor(lang, page)}`;
  const alternates = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}${pathFor(l, page)}" />`,
  ).join('\n');
  const xDefault = `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}${pathFor('en', page)}" />`;
  return [
    `    <title>${escapeAttr(m.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(m.desc)}" />`,
    `    <meta name="keywords" content="GEMBA Team, industrial services, IT solutions, reactor servicing, catalyst changeout, software development, DevOps, blockchain, Bulgaria" />`,
    `    <meta name="author" content="GEMBA Team EOOD" />`,
    `    <meta name="robots" content="index, follow" />`,
    `    <link rel="canonical" href="${url}" />`,
    alternates,
    xDefault,
    ``,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:title" content="${escapeAttr(m.title)}" />`,
    `    <meta property="og:description" content="${escapeAttr(m.desc)}" />`,
    `    <meta property="og:image" content="${BASE_URL}/favicon.svg" />`,
    `    <meta property="og:site_name" content="GEMBA Team" />`,
    `    <meta property="og:locale" content="${ogLocale[lang]}" />`,
    ``,
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:title" content="${escapeAttr(m.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttr(m.desc)}" />`,
  ].join('\n');
}

function renderRoute(template, lang, page) {
  const headBlock = buildHeadBlock(lang, page);
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<!--SEO_HEAD_START-->[\s\S]*?<!--SEO_HEAD_END-->/, `<!--SEO_HEAD_START-->\n${headBlock}\n    <!--SEO_HEAD_END-->`);
}

function main() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`prerender: ${indexPath} not found — run \`vite build\` first.`);
    process.exit(1);
  }
  const template = fs.readFileSync(indexPath, 'utf-8');
  if (!template.includes('<!--SEO_HEAD_START-->') || !template.includes('<!--SEO_HEAD_END-->')) {
    console.error('prerender: SEO_HEAD markers missing in dist/index.html. Did the source index.html lose them?');
    process.exit(1);
  }

  let count = 0;
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const html = renderRoute(template, lang, page);
      const routePath = pathFor(lang, page);
      const outDir = path.join(DIST, routePath.slice(1));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
      count++;
    }
  }

  // Replace the bundled root index.html with the x-default (en home) variant so any
  // SPA-fallback hit also returns the correct canonical instead of a stale template.
  fs.writeFileSync(indexPath, renderRoute(template, 'en', 'home'));

  console.log(`prerender: wrote ${count} per-route HTML files + refreshed root index.html`);
}

main();
