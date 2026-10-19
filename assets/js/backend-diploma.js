/** Bilingual registration page controller. Native disclosures and PDF links also work without JavaScript. */
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
    let copyRevision = 0;
    const language = core.initLanguageSwitching(site.locales, (next) => {
      if (next === locale) return;
      locale = next;
      core.saveLocale(locale);
      render();
    });
    const render = (initial = false) => {
      copyRevision++;
      document.querySelectorAll('[data-copy-feedback]').forEach(status => { status.textContent = ''; });
      const copy = core.localizedObject(diploma.translations, locale, site.defaultLocale);
      const config = {
        ...site, ...copy, isolateTechnicalTerms: true, evidenceLinks: diploma.evidenceLinks, visual: diploma.visual, locale, direction: locale === 'ar' ? 'rtl' : 'ltr',
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
      document.querySelectorAll('[data-diploma-inquiry]').forEach(link => {
        const plan = link.dataset.pricingPlan;
        contact.searchParams.set('text', plan === undefined ? copy.inquiryMessage : copy.pricing.plans[Number(plan)].inquiryMessage);
        core.configureLink(link, contact.href);
      });
      const pageUrl = config.seo.canonicalUrl + (locale === 'en' ? '?lang=en' : '');
      if (window.__mtAcademyMotion) window.__mtAcademyMotion.refresh();
      document.getElementById('structured-data').textContent = JSON.stringify({
        '@context': 'https://schema.org', '@graph': [
          core.buildOrganizationSchema(site),
          diploma.courseSchema(locale),
          { '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: copy.seo.title, description: copy.seo.description, inLanguage: locale, publisher: { '@id': `${site.siteUrl}#organization` } }
        ]
      });
    };
    document.querySelector('[data-curriculum-controls]').hidden = false;
    for (const [selector, open] of [['[data-expand-curriculum]', true], ['[data-collapse-curriculum]', false]]) {
      document.querySelector(selector).addEventListener('click', () => {
        document.querySelectorAll('.diploma-module').forEach(module => { module.open = open; });
      });
    }
    document.querySelectorAll('[data-copy-template]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', async () => {
        const key = button.dataset.copyTemplate;
        const copy = diploma.translations[locale][key];
        const message = key === 'application' ? copy.messageTemplate : copy.acceptanceTemplate;
        const status = document.querySelector(`[data-copy-feedback="${key}"]`);
        const revision = copyRevision;
        status.textContent = '';
        button.disabled = true;
        try {
          if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(message);
          if (revision === copyRevision) status.textContent = copy.copiedLabel;
        } catch {
          if (revision === copyRevision) status.textContent = copy.copyFailureLabel;
        } finally {
          button.disabled = false;
        }
      });
    });
    core.saveLocale(locale);
    render(true);
    core.initPathNavigation();
    core.initActiveNavigation();
    core.initTopLinks();
    core.initHeaderMotion();
    core.initMotionSystem();
  });
})();
