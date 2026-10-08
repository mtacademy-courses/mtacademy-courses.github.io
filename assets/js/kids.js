/** Kids page controller. The saved HTML already contains essential program content. */
(() => {
  "use strict";
  const core = window.MTAcademyCore;
  const shared = window.MTAcademySite;
  const data = window.MTAcademyKids;
  if (!core || !shared || !data) return;

  core.onReady(() => {
    if (document.body.dataset.page !== "kids" || document.documentElement.dataset.kidsReady) return;
    document.documentElement.dataset.kidsReady = "true";
    let locale = core.getInitialLocale(shared);
    let config;
    let mobile;
    let language;
    const dialog = document.getElementById("kids-lightbox");
    const image = document.getElementById("kids-lightbox-image");
    const status = dialog.querySelector(".kids-lightbox__status");
    const caption = document.getElementById("kids-lightbox-title");
    const position = dialog.querySelector("[data-gallery-position]");
    const closeButton = dialog.querySelector(".kids-lightbox__close");
    let activeIndex = 0;
    let trigger = null;
    let requestId = 0;
    let loadState = "loading";

    const resolveConfig = () => {
      const copy = core.localizedObject(data.translations, locale, "ar");
      return {
        ...shared, ...copy, locale, direction: locale === "ar" ? "rtl" : "ltr",
        seo: { ...copy.seo, canonicalUrl: `${shared.siteUrl}kids-coding-bootcamp/`, socialImage: '/assets/images/kids/social/kids-bootcamp.png' },
        levels: data.levels.map((level, index) => ({ ...level, ...copy.levels[index] })),
        sessions: data.sessions.map((session, index) => ({ ...session, ...copy.sessions[index] }))
      };
    };

    const updateGalleryCopy = () => {
      const session = config.sessions[activeIndex];
      caption.textContent = session.caption;
      image.alt = session.alt;
      position.textContent = config.gallery.positionTemplate.replace("{current}", String(activeIndex + 1)).replace("{total}", String(config.sessions.length));
      status.hidden = loadState === "loaded";
      status.textContent = loadState === "error" ? config.gallery.error : loadState === "loading" ? config.gallery.loading : "";
    };

    const displayImage = () => {
      const id = ++requestId;
      loadState = "loading";
      image.hidden = true;
      image.removeAttribute("src");
      updateGalleryCopy();
      const preload = new Image();
      preload.onload = () => {
        if (id !== requestId || !dialog.open) return;
        image.src = preload.src;
        image.hidden = false;
        loadState = "loaded";
        updateGalleryCopy();
      };
      preload.onerror = () => {
        if (id !== requestId || !dialog.open) return;
        loadState = "error";
        updateGalleryCopy();
      };
      preload.src = config.sessions[activeIndex].image.src;
    };

    document.querySelector(".kids-gallery").addEventListener("click", (event) => {
      const link = event.target.closest("[data-session-index]");
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== "function") return;
      event.preventDefault();
      activeIndex = Number(link.dataset.sessionIndex);
      trigger = link;
      dialog.showModal();
      core.lockPageScroll("kids-gallery");
      closeButton.focus();
      displayImage();
    });
    const closeGallery = () => { if (dialog.open) dialog.close(); };
    const navigateGallery = (delta) => {
      if (!dialog.open) return;
      activeIndex = (activeIndex + delta + config.sessions.length) % config.sessions.length;
      displayImage();
    };
    closeButton.addEventListener("click", closeGallery);
    dialog.querySelector("[data-gallery-previous]").addEventListener("click", () => navigateGallery(-1));
    dialog.querySelector("[data-gallery-next]").addEventListener("click", () => navigateGallery(1));
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeGallery();
    });
    dialog.addEventListener("close", () => {
      ++requestId;
      image.removeAttribute("src");
      core.unlockPageScroll("kids-gallery");
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const physical = event.key === "ArrowRight" ? 1 : -1;
        navigateGallery(locale === "ar" ? -physical : physical);
      }
      if (event.key === "Tab") {
        const controls = [...dialog.querySelectorAll("button")].filter(button => !button.disabled && !button.hidden);
        const first = controls[0]; const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    const renderSchema = () => {
      const pageUrl = config.seo.canonicalUrl + (locale === "en" ? '?lang=en' : '');
      const organizationId = `${shared.siteUrl}#organization`;
      const courseId = `${config.seo.canonicalUrl}#course`;
      document.getElementById("structured-data").textContent = JSON.stringify({
        "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": organizationId, name: shared.brandName, url: shared.siteUrl, logo: new URL(shared.logo.src, shared.siteUrl).href, sameAs: shared.socialLinks.map(link => link.url) },
          { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: config.seo.title, description: config.seo.description, inLanguage: locale, about: { "@id": courseId } },
          { "@type": "Course", "@id": courseId, name: data.name, description: config.seo.description, url: config.seo.canonicalUrl, provider: { "@id": organizationId }, educationalLevel: "Beginner", teaches: data.levels.map(level => level.tool) }
        ]
      });
    };

    const render = (initial = false) => {
      config = resolveConfig();
      core.applySiteConfiguration(config);
      core.applyAccessibleLabels(config);
      core.renderKidsOffering(locale);
      const inquiry = new URL(shared.contact.whatsapp);
      inquiry.searchParams.set("text", config.inquiryMessage);
      document.querySelectorAll("[data-kids-inquiry]").forEach(link => core.configureLink(link, inquiry.href));
      document.querySelectorAll("[data-session-index]").forEach(link => {
        link.setAttribute("aria-label", config.gallery.openTemplate.replace("{caption}", config.sessions[Number(link.dataset.sessionIndex)].caption));
      });
      language.update(locale, config);
      if (initial) mobile = core.initMobileNavigation(config);
      else mobile.update(config);
      if (dialog.open) updateGalleryCopy();
      renderSchema();
    };
    const selectLocale = (next) => {
      if (next === locale) return;
      locale = next;
      core.saveLocale(locale);
      render();
    };
    core.saveLocale(locale);
    language = core.initLanguageSwitching(shared.locales, selectLocale);
    render(true);
    core.initActiveNavigation();
    core.initTopLinks();
    const header = document.querySelector(".site-header");
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  });
})();
