/** Program preview controller: no enrollment, offer, or notification subscription. */
(() => {
  "use strict";
  const core = window.MTAcademyCore;
  const site = window.MTAcademySite;
  const diploma = window.MTAcademyBackend;
  if (!core || !site || !diploma) return;
  core.onReady(() => {
    if (document.body.dataset.page !== 'backend' || document.documentElement.dataset.backendReady) return;
    document.documentElement.dataset.backendReady = 'true';
    let locale = core.getInitialLocale(site);
    let menu;
    const language = core.initLanguageSwitching(site.locales, (next) => {
      if (next === locale) return;
      locale = next;
      core.saveLocale(locale);
      render();
    });
    const render = (initial = false) => {
      const copy = core.localizedObject(diploma.translations, locale, site.defaultLocale);
      const config = {
        ...site, ...copy, evidenceLinks: diploma.evidenceLinks, visual: diploma.visual, locale, direction: locale === 'ar' ? 'rtl' : 'ltr',
        statusLabel: copy.statusLabels[diploma.status],
        interface: site.translations[locale].interface,
        seo: { ...copy.seo, canonicalUrl: new URL(diploma.path, site.siteUrl).href, socialImage: diploma.socialImage },
      };
      core.applySiteConfiguration(config);
      core.applyAccessibleLabels(config);
      document.querySelector('[data-diploma-status]').dataset.offeringStatus = diploma.status;
      language.update(locale, config);
      if (initial) menu = core.initMobileNavigation(config);
      else menu.update(config);
      const contact = new URL(site.contact.whatsapp);
      contact.searchParams.set('text', copy.inquiryMessage);
      document.querySelectorAll('[data-diploma-inquiry]').forEach(link => core.configureLink(link, contact.href));
      const pageUrl = config.seo.canonicalUrl + (locale === 'en' ? '?lang=en' : '');
      if (window.__mtAcademyMotion) window.__mtAcademyMotion.refresh();
      document.getElementById('structured-data').textContent = JSON.stringify({
        '@context': 'https://schema.org', '@graph': [
          core.buildOrganizationSchema(site),
          { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: copy.seo.title, description: copy.seo.description, inLanguage: locale, publisher: { '@id': `${site.siteUrl}#organization` } }
        ]
      });
    };
    core.saveLocale(locale);
    render(true);
    core.initPathNavigation();
    core.initActiveNavigation();
    core.initTopLinks();
    core.initHeaderMotion();
    core.initMotionSystem();
  });
})();
