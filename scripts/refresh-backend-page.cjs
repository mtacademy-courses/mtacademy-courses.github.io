/** Optional authoring helper. The saved registration page needs no production build. */
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
const localized = value => sharedMarkup.localizedText(value, window.MTAcademyCore, true);
const text = (tag, key, value, css = '') => `<${tag}${css ? ` class="${css}"` : ''} data-config-text="${key}">${localized(value)}</${tag}>`;
const inquiry = `${site.contact.whatsapp}?text=${encodeURIComponent(copy.inquiryMessage)}`;
const linkedIn = `<a href="${escape(site.instructorProfile.linkedinUrl)}" data-config-href="instructorProfile.linkedinUrl" data-config-text="interface.instructorLinkedInLabel" target="_blank" rel="noopener noreferrer">${escape(site.translations.ar.interface.instructorLinkedInLabel)}</a>`;
const box = (onHomepage = false) => {
  const spec = diploma.visual;
  const v = spec.viewport;
  const styles = `--box-aspect: ${v.width} / ${v.height}; --box-width: ${spec.width / v.width * 100}%; --box-left: ${-v.left / v.width * 100}%; --box-top: ${-v.top / v.height * 100}%`;
  const binding = onHomepage ? 'data-path-image="backend-diploma"' : 'data-config-src="visual.src" data-config-alt="visualAlt"';
  return `<div class="backend-box-stage" style="${styles}"><img src="${spec.src}" width="${spec.width}" height="${spec.height}" alt="${escape(copy.visualAlt)}" ${binding} decoding="async" ${onHomepage ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`;
};
const heading = (key, id) => `<div class="diploma-section-heading">${copy[key].eyebrow ? text('p', `${key}.eyebrow`, copy[key].eyebrow, 'eyebrow') : ''}<h2 id="${id}" data-config-text="${key}.title">${localized(copy[key].title)}</h2>${copy[key].description ? text('p', `${key}.description`, copy[key].description) : ''}</div>`;
const metrics = (key, items) => items.map((item, index) => `<div class="diploma-metric">${text('dt', `${key}.${index}.label`, item.label)}${key === 'mentor.stats' ? `<dd dir="ltr" data-config-text="${key}.${index}.value">${escape(item.value)}</dd>` : text('dd', `${key}.${index}.value`, item.value)}</div>`).join('');
const inquiryLink = (message) => `${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
const register = (css = 'button', message = copy.inquiryMessage, key = 'hero.contactLabel', extra = '') => `<a class="${css}" href="${escape(inquiryLink(message))}" data-diploma-inquiry ${extra} target="_blank" rel="noopener noreferrer" data-config-text="${key}">${escape(window.MTAcademyCore.getByPath(copy,key))}</a>`;
const pdfActions = (compact = false) => `<div class="diploma-pdf-actions${compact ? ' diploma-pdf-actions--compact' : ''}"><a href="${diploma.document.url}" target="_blank" rel="noopener noreferrer" data-pdf-view><span data-config-text="document.view">${copy.document.view}</span><span aria-hidden="true"> ↗</span> <span class="visually-hidden" data-config-text="document.newTab">${copy.document.newTab}</span></a><a href="${diploma.document.url}" download="${diploma.document.filename}" data-pdf-download data-config-text="document.download">${copy.document.download}</a></div>`;
const list = (key, items, css = '') => `<ul${css ? ` class="${css}"` : ''}>${items.map((item,i)=>text('li',`${key}.${i}`,item)).join('')}</ul>`;
const practiceCards = (key, items) => items.map((item,i)=>`<article class="diploma-practice-card">${text('h3',`${key}.${i}.title`,item.title)}${text('p',`${key}.${i}.description`,item.description)}</article>`).join('');
const policyLinks = (includeApplication = true) => `<div class="diploma-policy-links">${includeApplication ? `<a href="#apply" data-config-text="application.title">${copy.application.title}</a>` : ''}<a href="#booking-terms" data-config-text="application.termsLabel">${copy.application.termsLabel}</a></div>`;
const faqDetails = (item,index) => `<details><summary data-config-text="faq.items.${index}.question">${localized(item.question)}</summary>${text('p',`faq.items.${index}.answer`,item.answer)}${item.href?`<a class="diploma-faq-reference" href="${escape(item.href)}" data-config-href="faq.items.${index}.href" data-config-text="faq.items.${index}.linkLabel">${localized(item.linkLabel)}</a>`:''}</details>`;
let moduleNumber = 0;
const sections = `
    <nav class="diploma-section-nav" aria-label="${copy.sectionNav.label}" data-config-aria="sectionNav.label">${copy.sectionNav.items.map((item,i)=>`<a href="${item.href}" data-config-text="sectionNav.items.${i}.label">${escape(item.label)}</a>`).join('')}</nav>
    <section class="diploma-section diploma-overview" id="study-plan" aria-labelledby="overview-title">
      ${heading('overview','overview-title')}
      <dl class="diploma-metrics">${metrics('overview.metrics',copy.overview.metrics)}</dl>
      ${text('p','overview.hoursNote',copy.overview.hoursNote,'diploma-hours-note')}
    </section>
    <section class="diploma-section diploma-audience-section" aria-labelledby="audience-title">
      <div>${heading('audience','audience-title')}</div>
      <div><h2 id="outcomes-title" data-config-text="outcomes.title">${localized(copy.outcomes.title)}</h2>${list('outcomes.items',copy.outcomes.items,'diploma-outcomes')}</div>
    </section>
    <section class="diploma-section" id="curriculum" aria-labelledby="curriculum-title">
      ${heading('curriculum','curriculum-title')}
      <div class="diploma-disclosure-controls" data-curriculum-controls hidden><button type="button" data-expand-curriculum data-config-text="curriculum.expand">${copy.curriculum.expand}</button><button type="button" data-collapse-curriculum data-config-text="curriculum.collapse">${copy.curriculum.collapse}</button></div>
      <div class="diploma-roadmap">${copy.curriculum.stages.map((stage,i)=>`<article class="diploma-stage">
        <div class="diploma-stage__heading"><span class="diploma-stage__index"><span data-config-text="curriculum.stageLabel">${copy.curriculum.stageLabel}</span> <bdi>${String(i+1).padStart(2,'0')}</bdi> / 08</span>${text('h3',`curriculum.stages.${i}.title`,stage.title)}</div>
        <div class="diploma-stage__modules">${stage.modules.map((module,j)=>`<details class="diploma-module"${++moduleNumber===1?' open':''}><summary><span class="diploma-module__number" dir="ltr">${String(moduleNumber).padStart(2,'0')}</span><h4 dir="ltr" lang="en" data-config-text="curriculum.stages.${i}.modules.${j}.title">${escape(module.title)}</h4></summary>${list(`curriculum.stages.${i}.modules.${j}.topics`,module.topics)}</details>`).join('')}</div>
      </article>`).join('')}</div>
      ${text('p','curriculum.depthNote',copy.curriculum.depthNote,'diploma-depth-note')}
    </section>
    <section class="diploma-section" id="projects" aria-labelledby="projects-title">
      ${heading('projects','projects-title')}
      <ol class="diploma-projects">${copy.projects.items.map((project,i)=>`<li class="diploma-project"><div class="diploma-project__month"><span data-config-text="projects.monthLabel">${copy.projects.monthLabel}</span> <bdi>${project.month}</bdi></div><div><h3 dir="ltr" lang="en" data-config-text="projects.items.${i}.title">${escape(project.title)}</h3>${text('p',`projects.items.${i}.description`,project.description)}</div></li>`).join('')}</ol>
    </section>
    <section class="diploma-section" id="experience" aria-labelledby="practice-title">
      ${heading('practice','practice-title')}
      <div class="diploma-practice-grid">${practiceCards('practice.items',copy.practice.items)}</div>
      <div class="diploma-session">${heading('session','session-title')}<ol class="diploma-session__blocks">${copy.session.items.map((block,i)=>`<li><strong><span data-config-text="session.items.${i}.minutes">${block.minutes}</span> <span data-config-text="session.minuteLabel">${copy.session.minuteLabel}</span></strong>${text('span',`session.items.${i}.label`,block.label)}</li>`).join('')}</ol></div>
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
    <section class="diploma-section" aria-labelledby="graduation-title">
      ${heading('graduation','graduation-title')}
      <div class="diploma-graduation">${practiceCards('graduation.items',copy.graduation.items)}</div>
    </section>
    <section class="diploma-section diploma-cohort" aria-labelledby="cohort-title">
      <div>${text('p','cohort.eyebrow',copy.cohort.eyebrow,'eyebrow')}<h2 id="cohort-title" data-config-text="cohort.title">${escape(copy.cohort.title)}</h2></div>
      <div>${text('p','cohort.description',copy.cohort.description)}${text('p','cohort.note',copy.cohort.note,'diploma-cohort__note')}</div>
    </section>
    <section class="diploma-section" id="pricing" aria-labelledby="pricing-title">
      ${heading('pricing','pricing-title')}
      <div class="diploma-pricing">${copy.pricing.plans.map((plan,i)=>`<article class="diploma-price-card">
        ${text('h3',`pricing.plans.${i}.title`,plan.title)}
        <p class="diploma-price" dir="ltr" data-config-text="pricing.plans.${i}.full">${plan.full}</p>
        ${text('p','pricing.fullLabel',copy.pricing.fullLabel)}
        <div class="diploma-price-card__installments">${text('p','pricing.installmentLabel',copy.pricing.installmentLabel)}<strong dir="ltr" data-config-text="pricing.plans.${i}.total">${plan.total}</strong><p><span data-config-text="pricing.depositLabel">${copy.pricing.depositLabel}</span>: <bdi data-config-text="pricing.plans.${i}.deposit">${plan.deposit}</bdi></p>${text('p',`pricing.plans.${i}.installments`,plan.installments)}<p class="diploma-price-equation" dir="ltr" data-config-text="pricing.plans.${i}.equation">${plan.equation}</p></div>
        ${register('button',plan.inquiryMessage,`pricing.plans.${i}.contactLabel`,`data-pricing-plan="${i}"`)}
      </article>`).join('')}</div>
      ${list('pricing.notes',copy.pricing.notes,'diploma-payment-notes')}${policyLinks()}
      ${text('p','registrationNote',copy.registrationNote,'diploma-registration-note')}
    </section>
    <section class="diploma-section diploma-application" id="apply" aria-labelledby="application-title">
      ${heading('application','application-title')}
      <div class="diploma-application-steps">
        <h3 data-config-text="application.stepsTitle">${localized(copy.application.stepsTitle)}</h3>
        <ol>${copy.application.steps.map((step,i)=>text('li',`application.steps.${i}`,step)).join('')}</ol>
        ${text('p','registrationNote',copy.registrationNote,'diploma-registration-note')}
        ${policyLinks(false)}
      </div>
      <div class="diploma-message-heading"><h3 id="application-message-title" data-config-text="application.templateTitle">${localized(copy.application.templateTitle)}</h3>${text('p','application.templateInstructions',copy.application.templateInstructions)}</div>
      <div class="diploma-application-message" tabindex="0" role="region" aria-labelledby="application-message-title" data-message-template="application">
        ${text('p','application.greeting',copy.application.greeting,'diploma-message-greeting')}
        ${text('p','application.introduction',copy.application.introduction)}
        <ol class="diploma-application-fields">${copy.application.fields.map((field,i)=>`<li data-application-field="${field.id}">${text('span',`application.fields.${i}.prompt`,field.prompt)}</li>`).join('')}</ol>
        ${text('p','application.nextSteps',copy.application.nextSteps)}
        ${text('p','application.confirmationNotice',copy.application.confirmationNotice,'diploma-confirmation-notice')}
        <p id="application-privacy" class="diploma-privacy-note" data-config-text="application.privacyNotice">${localized(copy.application.privacyNotice)}</p>
      </div>
      <div class="diploma-actions"><button class="button button--secondary" type="button" data-copy-template="application" aria-describedby="application-copy-feedback" data-config-text="application.copyLabel" hidden>${copy.application.copyLabel}</button>${register('button',copy.inquiryMessage,'application.whatsappLabel')}</div>
      <p class="diploma-copy-feedback" id="application-copy-feedback" data-copy-feedback="application" role="status" aria-live="polite" aria-atomic="true"></p>
    </section>
    <section class="diploma-section diploma-policy" id="booking-terms" aria-labelledby="booking-terms-title">
      ${heading('bookingTerms','booking-terms-title')}
      <ol class="diploma-terms-list">${copy.bookingTerms.clauses.map((clause,i)=>`<li id="terms-${clause.id}" data-booking-clause="${clause.id}">
        ${text('h3',`bookingTerms.clauses.${i}.title`,clause.title)}
        ${clause.paragraphs.map((paragraph,j)=>text('p',`bookingTerms.clauses.${i}.paragraphs.${j}`,paragraph)+(clause.id==='withdrawal-after-start'&&j===1?`<div class="diploma-refund-formula">${text('p','bookingTerms.refundFormula.perSession',copy.bookingTerms.refundFormula.perSession)}${text('p','bookingTerms.refundFormula.refund',copy.bookingTerms.refundFormula.refund)}${text('p','bookingTerms.refundFormula.inputs',copy.bookingTerms.refundFormula.inputs,'diploma-refund-inputs')}</div>`:'')).join('')}
      </li>`).join('')}</ol>
      <div class="diploma-acceptance" id="acceptance-message">
        <h3 id="acceptance-title" data-config-text="bookingTerms.acceptanceTitle">${localized(copy.bookingTerms.acceptanceTitle)}</h3>
        ${text('p','bookingTerms.acceptanceInstructions',copy.bookingTerms.acceptanceInstructions)}
        <div class="diploma-acceptance-message" tabindex="0" role="region" aria-labelledby="acceptance-title" data-message-template="bookingTerms">${text('p','bookingTerms.acceptanceTemplate',copy.bookingTerms.acceptanceTemplate)}</div>
        ${text('p','bookingTerms.acceptanceNote',copy.bookingTerms.acceptanceNote,'diploma-acceptance-note')}
        <div class="diploma-actions"><button class="button button--secondary" type="button" data-copy-template="bookingTerms" aria-describedby="acceptance-copy-feedback" data-config-text="bookingTerms.copyAcceptanceLabel" hidden>${copy.bookingTerms.copyAcceptanceLabel}</button>${register('button',copy.inquiryMessage,'bookingTerms.contactLabel')}</div>
        <p class="diploma-copy-feedback" id="acceptance-copy-feedback" data-copy-feedback="bookingTerms" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>
    </section>
    <section class="diploma-section diploma-document" id="roadmap-pdf" aria-labelledby="document-title">
      <div class="diploma-document__icon" aria-hidden="true">PDF<span>↗</span></div><div>${heading('document','document-title')}${text('p','document.meta',copy.document.meta,'diploma-document__meta')}${pdfActions()}${text('p','document.currentTermsNote',copy.document.currentTermsNote,'diploma-document-current')}${policyLinks()}</div>
    </section>
    <section class="diploma-section diploma-faq" id="faq" aria-labelledby="faq-title">
      ${heading('faq','faq-title')}
      <div>${copy.faq.groups.map((group,i)=>`<section class="diploma-faq-group" aria-labelledby="faq-group-${group.id}"><h3 id="faq-group-${group.id}" data-config-text="faq.groups.${i}.title">${localized(group.title)}</h3>${copy.faq.items.map((item,index)=>item.group===group.id?faqDetails(item,index):'').join('')}</section>`).join('')}</div>
      <div class="diploma-faq__contact">${text('p','faq.contact',copy.faq.contact)}${register('button button--secondary')}</div>
    </section>
    <section class="diploma-section diploma-closing" aria-labelledby="closing-title">
      <h2 id="closing-title" data-config-text="closing.title">${localized(copy.closing.title)}</h2>
      ${text('p','closing.description',copy.closing.description)}
      <div class="diploma-actions">${register()}<a class="button button--secondary" href="/#learning-paths" data-config-text="hero.returnLabel">${copy.hero.returnLabel}</a></div>
      ${text('p','registrationNote',copy.registrationNote,'diploma-registration-note')}
    </section>`;
const pageUrl = new URL(diploma.path, site.siteUrl).href;
const nav = kind => sharedMarkup.navigation(site, 'backend', kind);
const languages = kind => `<div class="language-switcher language-switcher--${kind}" data-language-switcher role="group" aria-label="تغيير اللغة"><button class="language-switcher__option is-active" type="button" data-language-option="ar" aria-pressed="true" lang="ar">${kind === 'mobile' ? 'العربية' : 'ع'}</button><button class="language-switcher__option" type="button" data-language-option="en" aria-pressed="false" lang="en">${kind === 'mobile' ? 'English' : 'EN'}</button></div>`;
const brand = `<a class="brand" href="/" aria-label="MT Academy — الصفحة الرئيسية"><img class="brand__logo" src="${site.logo.src}" width="1000" height="1000" alt=""><span class="brand__name">MT Academy</span></a>`;
const schema = { '@context': 'https://schema.org', '@graph': [
  window.MTAcademyCore.buildOrganizationSchema(site),
  diploma.courseSchema('ar'),
  { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: copy.seo.title, description: copy.seo.description, inLanguage: 'ar', publisher: { '@id': `${site.siteUrl}#organization` } }
] };
const html = `<!doctype html>
<!-- Static Arabic registration page; maintained through scripts/refresh-backend-page.cjs. -->
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
        ${text('span', 'statusLabel', copy.statusLabels[diploma.status], 'registration-badge')}
        ${text('p', 'hero.eyebrow', copy.hero.eyebrow, 'diploma-eyebrow')}
        <h1 id="diploma-title"><span data-config-text="hero.title">${localized(copy.hero.title)}</span><span class="diploma-hero__technologies" dir="ltr">Java &amp; Spring Boot</span></h1>
        ${text('p', 'hero.audience', copy.hero.audience, 'diploma-audience')}
        ${text('p', 'hero.description', copy.hero.description, 'diploma-description')}
        ${text('p', 'hero.summary', copy.hero.summary, 'diploma-hero__summary')}
        ${text('p', 'hero.announcement', copy.hero.announcement, 'diploma-announcement')}
        <div class="diploma-actions">${register()}<a class="button button--secondary" href="#curriculum" data-config-text="hero.detailsLabel">${copy.hero.detailsLabel}</a></div>
        ${text('p','registrationNote',copy.registrationNote,'diploma-registration-note')}
        ${policyLinks()}
        ${pdfActions(true)}
      </div>
      <div class="diploma-hero__visual">${box()}</div>
    </section>
${sections}
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
for (const key of ['tag', 'title', 'description', 'facts', 'cta', 'status']) {
  const binding = new RegExp(`(<([a-z][a-z0-9]*)\\b[^>]*data-path-text="backend\\.${key}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`);
  if (!binding.test(homepage)) throw new Error(`Missing homepage Backend binding: ${key}`);
  homepage = homepage.replace(binding, (_, start, tag, end) => start + sharedMarkup.localizedText(key === 'status' ? copy.statusLabels[diploma.status] : copy.card[key], window.MTAcademyCore) + end);
}
homepage = homepage.replace(/(data-path-status="backend-diploma" data-offering-status=")[^"]*/, `$1${diploma.status}`);
const previewVisual = /(<div class="learning-path__visual learning-path__visual--backend">)[\s\S]*?(<\/div>\s*<\/article>)/;
if (!previewVisual.test(homepage)) throw new Error('Missing homepage Backend visual');
homepage = homepage.replace(previewVisual, (_, start, end) => `${start}\n              ${box(true)}\n            ${end}`);
homepage = homepage.replace(/<a[^>]*data-config-href="instructorProfile.linkedinUrl"[^>]*>[^<]*<\/a>/, linkedIn);
fs.writeFileSync(homepagePath, homepage);
console.log('Updated static Backend registration page and Arabic homepage card.');
