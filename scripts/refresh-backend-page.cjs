/** Optional authoring helper. The saved announcement page needs no production build. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const window = {};
for (const file of ['site-core.js', 'site-data.js', 'backend-diploma-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), { window, URL, Set });
}
const site = window.MTAcademySite;
const diploma = window.MTAcademyBackend;
const copy = diploma.translations.ar;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (tag, key, value, css = '') => `<${tag}${css ? ` class="${css}"` : ''} data-config-text="${key}">${escape(value)}</${tag}>`;
const pageUrl = new URL(diploma.path, site.siteUrl).href;
const inquiry = `${site.contact.whatsapp}?text=${encodeURIComponent(copy.inquiryMessage)}`;
const nav = kind => copy.navigation.map((item, index) => `<a class="${kind === 'desktop' ? 'nav-link' : 'mobile-nav__link'}" href="${item.href}" data-config-text="navigation.${index}.label" data-config-href="navigation.${index}.href"${item.href === diploma.path ? ' data-current-page aria-current="page"' : ''}>${escape(item.label)}</a>`).join('\n');
const languages = kind => `<div class="language-switcher language-switcher--${kind}" data-language-switcher role="group" aria-label="تغيير اللغة"><button class="language-switcher__option is-active" type="button" data-language-option="ar" aria-pressed="true" lang="ar">${kind === 'mobile' ? 'العربية' : 'ع'}</button><button class="language-switcher__option" type="button" data-language-option="en" aria-pressed="false" lang="en">${kind === 'mobile' ? 'English' : 'EN'}</button></div>`;
const brand = `<a class="brand" href="/" aria-label="MT Academy — الصفحة الرئيسية"><img class="brand__logo" src="${site.logo.src}" width="1000" height="1000" alt=""><span class="brand__name">MT Academy</span></a>`;
const schema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': `${site.siteUrl}#organization`, name: site.brandName, url: site.siteUrl, logo: new URL(site.logo.src, site.siteUrl).href },
  { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: copy.seo.title, description: copy.seo.description, inLanguage: 'ar', publisher: { '@id': `${site.siteUrl}#organization` } }
] };
const html = `<!doctype html>
<!-- Static Arabic announcement; maintained through scripts/refresh-backend-page.cjs. -->
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f8f6f2"><meta name="color-scheme" content="light">
  <title>${escape(copy.seo.title)}</title><meta name="description" content="${escape(copy.seo.description)}">
  <link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="ar" href="${pageUrl}"><link rel="alternate" hreflang="en" href="${pageUrl}?lang=en"><link rel="alternate" hreflang="x-default" href="${pageUrl}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="MT Academy"><meta property="og:locale" content="ar_EG">
  <meta property="og:title" content="${escape(copy.seo.title)}"><meta property="og:description" content="${escape(copy.seo.description)}"><meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${new URL(diploma.socialImage, site.siteUrl).href}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(copy.seo.socialImageAlt)}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(copy.seo.title)}"><meta name="twitter:description" content="${escape(copy.seo.description)}"><meta name="twitter:image" content="${new URL(diploma.socialImage, site.siteUrl).href}"><meta name="twitter:image:alt" content="${escape(copy.seo.socialImageAlt)}">
  <link rel="icon" type="image/jpeg" href="${site.logo.src}"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/backend-diploma.css">
  <script id="structured-data" type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
  ${['site-core.js', 'site-data.js', 'backend-diploma-data.js', 'backend-diploma.js'].map(file => `<script defer src="/assets/js/${file}"></script>`).join('\n  ')}
</head>
<body data-page="backend">
  <span class="top-anchor" id="top" aria-hidden="true"></span>
  <a class="skip-link" href="#main-content" data-config-text="interface.skipToContentLabel">انتقل إلى المحتوى الرئيسي</a>
  <header class="site-header">
    <div class="container header-inner">
      ${brand}
      <nav class="desktop-nav" aria-label="التنقل الرئيسي">${nav('desktop')}</nav>
      ${languages('desktop')}
      <a class="button button--compact header-cta" href="${inquiry}" data-diploma-inquiry target="_blank" rel="noopener noreferrer" data-config-text="hero.contactLabel">${copy.hero.contactLabel}</a>
      <button class="menu-toggle" id="mobile-menu-toggle" type="button" aria-label="فتح القائمة" aria-controls="mobile-nav" aria-expanded="false"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
    </div>
    <div class="mobile-nav" id="mobile-nav" hidden><nav class="mobile-nav__inner container" aria-label="التنقل على الهاتف">${nav('mobile')}${languages('mobile')}<a class="button mobile-nav__cta" href="${inquiry}" data-diploma-inquiry target="_blank" rel="noopener noreferrer" data-config-text="hero.contactLabel">${copy.hero.contactLabel}</a></nav></div>
  </header>
  <main class="container diploma-main" id="main-content">
    <section class="diploma-hero" aria-labelledby="diploma-title" data-diploma-status data-offering-status="${diploma.status}">
      <div class="diploma-hero__copy">
        ${text('span', 'statusLabel', copy.statusLabels[diploma.status], 'coming-soon-badge')}
        ${text('p', 'hero.eyebrow', copy.hero.eyebrow, 'diploma-eyebrow')}
        <h1 id="diploma-title"><span data-config-text="hero.title">${copy.hero.title}</span><span class="diploma-hero__technologies" dir="ltr">Java &amp; Spring Boot</span></h1>
        ${text('p', 'hero.audience', copy.hero.audience, 'diploma-audience')}
        ${text('p', 'hero.description', copy.hero.description, 'diploma-description')}
        ${text('p', 'hero.announcement', copy.hero.announcement, 'diploma-announcement')}
        <div class="diploma-actions"><a class="button" href="/#learning-paths" data-config-text="hero.returnLabel">${copy.hero.returnLabel}</a><a class="button button--secondary" href="${inquiry}" data-diploma-inquiry target="_blank" rel="noopener noreferrer" data-config-text="hero.contactLabel">${copy.hero.contactLabel}</a></div>
      </div>
      <div class="diploma-hero__visual" aria-hidden="true"><img class="backend-illustration" src="${diploma.visual.src}" width="1200" height="800" alt="" decoding="async" fetchpriority="high"></div>
    </section>
    <section class="diploma-related" aria-labelledby="related-title">
      <h2 id="related-title" data-config-text="related.title">${copy.related.title}</h2>
      <div class="diploma-related__grid">
        <article class="diploma-related__card">${text('h3', 'related.udemyTitle', copy.related.udemyTitle)}${text('p', 'related.udemyDescription', copy.related.udemyDescription)}<a href="/#courses" data-config-text="related.udemyCta">${copy.related.udemyCta}</a></article>
        <article class="diploma-related__card">${text('h3', 'related.kidsTitle', copy.related.kidsTitle)}${text('p', 'related.kidsDescription', copy.related.kidsDescription)}<a href="/kids-coding-bootcamp/" data-config-text="related.kidsCta">${copy.related.kidsCta}</a></article>
      </div>
    </section>
  </main>
  <footer class="site-footer"><div class="container diploma-footer">${brand}${text('p', 'footer.statement', copy.footer.statement)}<nav aria-label="${copy.footer.navigationLabel}" data-config-aria="footer.navigationLabel"><a href="/" data-config-text="footer.home">${copy.footer.home}</a><a href="/#learning-paths" data-config-text="footer.paths">${copy.footer.paths}</a><a href="/#courses" data-config-text="footer.udemy">${copy.footer.udemy}</a><a href="/kids-coding-bootcamp/" data-config-text="footer.kids">${copy.footer.kids}</a><a href="${diploma.path}" aria-current="page" data-config-text="footer.backend">${copy.footer.backend}</a><a href="#top" data-config-text="footer.top">${copy.footer.top}</a></nav><p>© <span data-current-year>2026</span> <span data-config-text="footer.copyright">${copy.footer.copyright}</span></p></div></footer>
</body>
</html>`;
fs.writeFileSync(path.join(root, 'backend-development-diploma/index.html'), html + '\n');
console.log('Updated static Backend announcement page.');
