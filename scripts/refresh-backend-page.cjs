/** Optional authoring helper. The saved program preview needs no production build. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharedMarkup = require('./shared-markup.cjs');
const root = path.resolve(__dirname, '..');
const window = {};
for (const file of ['site-core.js', 'site-data.js', 'backend-diploma-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), { window, URL, Set });
}
const site = window.MTAcademySite;
const diploma = window.MTAcademyBackend;
const copy = diploma.translations.ar;
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (tag, key, value, css = '') => `<${tag}${css ? ` class="${css}"` : ''} data-config-text="${key}">${sharedMarkup.localizedText(value, window.MTAcademyCore)}</${tag}>`;
const inquiry = `${site.contact.whatsapp}?text=${encodeURIComponent(copy.inquiryMessage)}`;
const linkedIn = `<a href="${escape(site.instructorProfile.linkedinUrl)}" data-config-href="instructorProfile.linkedinUrl" data-config-text="interface.instructorLinkedInLabel" target="_blank" rel="noopener noreferrer">${escape(site.translations.ar.interface.instructorLinkedInLabel)}</a>`;
const box = (onHomepage = false) => {
  const spec = diploma.visual;
  const v = spec.viewport;
  const styles = `--box-aspect: ${v.width} / ${v.height}; --box-width: ${spec.width / v.width * 100}%; --box-left: ${-v.left / v.width * 100}%; --box-top: ${-v.top / v.height * 100}%`;
  const binding = onHomepage ? 'data-path-image="backend-diploma"' : 'data-config-src="visual.src" data-config-alt="visualAlt"';
  return `<div class="backend-box-stage" style="${styles}"><img src="${spec.src}" width="${spec.width}" height="${spec.height}" alt="${escape(copy.visualAlt)}" ${binding} decoding="async" ${onHomepage ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`;
};
const heading = (key, id) => `<div class="diploma-section-heading">${copy[key].eyebrow ? text('p', `${key}.eyebrow`, copy[key].eyebrow, 'eyebrow') : ''}<h2 id="${id}" data-config-text="${key}.title">${escape(copy[key].title)}</h2>${copy[key].description ? text('p', `${key}.description`, copy[key].description) : ''}</div>`;
const metrics = (key, items) => items.map((item, index) => `<div class="diploma-metric">${text('dt', `${key}.${index}.label`, item.label)}${key === 'mentor.stats' ? `<dd dir="ltr" data-config-text="${key}.${index}.value">${escape(item.value)}</dd>` : text('dd', `${key}.${index}.value`, item.value)}</div>`).join('');
const previewSections = `
    <section class="diploma-section diploma-overview" id="study-plan" aria-labelledby="overview-title">
      ${heading('overview', 'overview-title')}
      <dl class="diploma-metrics">${metrics('overview.metrics', copy.overview.metrics)}</dl>
      ${text('p', 'overview.hoursNote', copy.overview.hoursNote, 'diploma-hours-note')}
    </section>
    <section class="diploma-section" aria-labelledby="practice-title">
      ${heading('practice', 'practice-title')}
      <div class="diploma-practice-grid">${copy.practice.items.map((item, index) => `<article class="diploma-practice-card"><span class="diploma-step" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>${text('h3', `practice.items.${index}.title`, item.title)}${text('p', `practice.items.${index}.description`, item.description)}</article>`).join('')}</div>
    </section>
    <section class="diploma-section diploma-mentor" aria-labelledby="mentor-title">
      <figure class="diploma-mentor__portrait"><img src="${site.instructorProfile.image.src}" width="${site.instructorProfile.image.width}" height="${site.instructorProfile.image.height}" alt="${escape(copy.mentor.portraitAlt)}" data-config-src="instructorProfile.image.src" data-config-alt="mentor.portraitAlt" loading="lazy" decoding="async"></figure>
      <div class="diploma-mentor__copy">
        ${text('p', 'mentor.eyebrow', copy.mentor.eyebrow, 'eyebrow')}
        <h2 id="mentor-title" data-config-text="mentor.name">${escape(copy.mentor.name)}</h2>
        ${text('p', 'mentor.role', copy.mentor.role, 'diploma-mentor__role')}
        ${text('p', 'mentor.description', copy.mentor.description)}
        ${text('p', 'mentor.experience', copy.mentor.experience, 'diploma-mentor__experience')}
        ${text('h3', 'mentor.title', copy.mentor.title)}
        <dl class="diploma-experience">${metrics('mentor.stats', copy.mentor.stats)}</dl>
        ${text('p', 'mentor.attribution', copy.mentor.attribution, 'diploma-attribution')}
        ${text('p', 'mentor.evidence', copy.mentor.evidence)}
        <div class="diploma-evidence-links"><a href="${escape(diploma.evidenceLinks.udemy)}" data-config-href="evidenceLinks.udemy" data-config-text="mentor.udemyLabel" target="_blank" rel="noopener noreferrer">${escape(copy.mentor.udemyLabel)}</a><a href="${diploma.evidenceLinks.reviews}" data-config-href="evidenceLinks.reviews" data-config-text="mentor.reviewsLabel">${escape(copy.mentor.reviewsLabel)}</a>${linkedIn}</div>
      </div>
    </section>
    <section class="diploma-section diploma-cohort" aria-labelledby="cohort-title">
      <div>${text('p', 'cohort.eyebrow', copy.cohort.eyebrow, 'eyebrow')}<h2 id="cohort-title" data-config-text="cohort.title">${escape(copy.cohort.title)}</h2></div>
      <div>${text('p', 'cohort.description', copy.cohort.description)}${text('p', 'cohort.note', copy.cohort.note, 'diploma-cohort__note')}</div>
    </section>
    <section class="diploma-section" aria-labelledby="announcements-title">
      ${heading('announcements', 'announcements-title')}
      <div class="diploma-announcements">${copy.announcements.items.map((item, index) => `<article>${text('h3', `announcements.items.${index}.title`, item.title)}${text('p', `announcements.items.${index}.description`, item.description)}</article>`).join('')}</div>
    </section>
    <section class="diploma-section diploma-faq" aria-labelledby="faq-title">
      ${heading('faq', 'faq-title')}
      <div>${copy.faq.items.map((item, index) => `<details><summary data-config-text="faq.items.${index}.question">${escape(item.question)}</summary>${text('p', `faq.items.${index}.answer`, item.answer)}</details>`).join('')}</div>
    </section>
    <section class="diploma-section diploma-closing" aria-labelledby="closing-title">
      <h2 id="closing-title" data-config-text="closing.title">${escape(copy.closing.title)}</h2>
      ${text('p', 'closing.description', copy.closing.description)}
      <div class="diploma-actions"><a class="button" href="${inquiry}" data-diploma-inquiry target="_blank" rel="noopener noreferrer" data-config-text="hero.contactLabel">${copy.hero.contactLabel}</a><a class="button button--secondary" href="/#learning-paths" data-config-text="hero.returnLabel">${copy.hero.returnLabel}</a></div>
    </section>`;
const pageUrl = new URL(diploma.path, site.siteUrl).href;
const nav = kind => sharedMarkup.navigation(site, 'backend', kind);
const languages = kind => `<div class="language-switcher language-switcher--${kind}" data-language-switcher role="group" aria-label="تغيير اللغة"><button class="language-switcher__option is-active" type="button" data-language-option="ar" aria-pressed="true" lang="ar">${kind === 'mobile' ? 'العربية' : 'ع'}</button><button class="language-switcher__option" type="button" data-language-option="en" aria-pressed="false" lang="en">${kind === 'mobile' ? 'English' : 'EN'}</button></div>`;
const brand = `<a class="brand" href="/" aria-label="MT Academy — الصفحة الرئيسية"><img class="brand__logo" src="${site.logo.src}" width="1000" height="1000" alt=""><span class="brand__name">MT Academy</span></a>`;
const schema = { '@context': 'https://schema.org', '@graph': [
  window.MTAcademyCore.buildOrganizationSchema(site),
  { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: copy.seo.title, description: copy.seo.description, inLanguage: 'ar', publisher: { '@id': `${site.siteUrl}#organization` } }
] };
const html = `<!doctype html>
<!-- Static Arabic program preview; maintained through scripts/refresh-backend-page.cjs. -->
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
        ${text('p', 'hero.summary', copy.hero.summary, 'diploma-hero__summary')}
        ${text('p', 'hero.announcement', copy.hero.announcement, 'diploma-announcement')}
        <div class="diploma-actions"><a class="button" href="#study-plan" data-config-text="hero.detailsLabel">${copy.hero.detailsLabel}</a><a class="button button--secondary" href="${inquiry}" data-diploma-inquiry target="_blank" rel="noopener noreferrer" data-config-text="hero.contactLabel">${copy.hero.contactLabel}</a></div>
      </div>
      <div class="diploma-hero__visual">${box()}</div>
    </section>
${previewSections}
    <section class="diploma-related" aria-labelledby="related-title">
      <h2 id="related-title" data-config-text="related.title">${copy.related.title}</h2>
      <div class="diploma-related__grid">
        <article class="diploma-related__card">${text('h3', 'related.udemyTitle', copy.related.udemyTitle)}${text('p', 'related.udemyDescription', copy.related.udemyDescription)}<a href="/#courses" data-config-text="related.udemyCta">${copy.related.udemyCta}</a></article>
        <article class="diploma-related__card">${text('h3', 'related.kidsTitle', copy.related.kidsTitle)}${text('p', 'related.kidsDescription', copy.related.kidsDescription)}<a href="/kids-coding-bootcamp/" data-config-text="related.kidsCta">${copy.related.kidsCta}</a></article>
      </div>
    </section>
  </main>
  <footer class="site-footer"><div class="container diploma-footer">${brand}${text('p', 'footer.statement', copy.footer.statement)}<nav aria-label="${copy.footer.navigationLabel}" data-config-aria="footer.navigationLabel">${sharedMarkup.footerLinks(site, 'backend')}<a href="#top" data-config-text="footer.top">${copy.footer.top}</a></nav><p>© <span data-current-year>2026</span> <span data-config-text="footer.copyright">${copy.footer.copyright}</span></p></div></footer>
</body>
</html>`;
fs.writeFileSync(path.join(root, 'backend-development-diploma/index.html'), html + '\n');
// Keep only this offering's Arabic homepage fallback in sync with its data.
const homepagePath = path.join(root, 'index.html');
let homepage = fs.readFileSync(homepagePath, 'utf8');
for (const key of ['tag', 'title', 'description', 'facts', 'cta']) {
  const binding = new RegExp(`(<([a-z][a-z0-9]*)\\b[^>]*data-path-text="backend\\.${key}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`);
  if (!binding.test(homepage)) throw new Error(`Missing homepage Backend binding: ${key}`);
  homepage = homepage.replace(binding, (_, start, tag, end) => start + sharedMarkup.localizedText(copy.card[key], window.MTAcademyCore) + end);
}
const previewVisual = /(<div class="learning-path__visual learning-path__visual--backend">)[\s\S]*?(<\/div>\s*<\/article>)/;
if (!previewVisual.test(homepage)) throw new Error('Missing homepage Backend visual');
homepage = homepage.replace(previewVisual, (_, start, end) => `${start}\n              ${box(true)}\n            ${end}`);
homepage = homepage.replace(/<a[^>]*data-config-href="instructorProfile.linkedinUrl"[^>]*>[^<]*<\/a>/, linkedIn);
fs.writeFileSync(homepagePath, homepage);
console.log('Updated static Backend program preview and Arabic homepage card.');
