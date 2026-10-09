/** Shared browser utilities. Load before each page controller. */
(() => {
  "use strict";
  const LOCALE_STORAGE_KEY = "mt-academy-locale";
  const LOCALE_HISTORY_KEY = "__mtAcademyLocale";
  const EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);
  const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
  const scrollLockReasons = new Set();
  const lockPageScroll = (reason) => {
    if (!reason || scrollLockReasons.has(reason)) return;
    if (!scrollLockReasons.size) {
      const root = document.documentElement;
      const hasStableGutter = window.CSS
        && typeof window.CSS.supports === "function"
        && CSS.supports("scrollbar-gutter", "stable");
      const scrollbarWidth = hasStableGutter ? 0 : Math.max(0, window.innerWidth - root.clientWidth);
      const rootLeft = Math.max(0, Math.round(root.getBoundingClientRect().left));
      const leftCompensation = Math.min(scrollbarWidth, rootLeft);
      const rightCompensation = Math.max(0, scrollbarWidth - leftCompensation);
      document.body.style.setProperty("--scroll-lock-left", `${leftCompensation}px`);
      document.body.style.setProperty("--scroll-lock-right", `${rightCompensation}px`);
      document.body.classList.add("is-scroll-locked");
    }
    scrollLockReasons.add(reason);
  };


  const unlockPageScroll = (reason) => {
    scrollLockReasons.delete(reason);
    if (scrollLockReasons.size) return;
    document.body.classList.remove("is-scroll-locked");
    document.body.style.removeProperty("--scroll-lock-left");
    document.body.style.removeProperty("--scroll-lock-right");
  };


  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  };


  const textValue = (value) => {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return "";
  };


  const getByPath = (source, path) => {
    if (!source || typeof path !== "string" || !path.trim()) return undefined;

    return path.split(".").reduce((current, key) => {
      if (current === null || current === undefined || typeof current !== "object") {
        return undefined;
      }
      return current[key];
    }, source);
  };


  const firstValue = (source, paths) => {
    for (const path of paths) {
      const value = getByPath(source, path);
      if (textValue(value)) return value;
    }
    return undefined;
  };


  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  };


  const setAutoDirection = (element) => {
    if (!element.hasAttribute("dir")) element.setAttribute("dir", "auto");
  };


  const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;


  const localeCode = (locale) => {
    if (typeof locale === "string") return textValue(locale).toLowerCase();
    if (!locale || typeof locale !== "object") return "";
    return textValue(locale.code || locale.locale || locale.id).toLowerCase();
  };


  const getSupportedLocales = (siteConfig) => {
    const configured = Array.isArray(siteConfig.locales) ? siteConfig.locales : [];
    const translationLocales = siteConfig.translations && typeof siteConfig.translations === "object"
      ? Object.keys(siteConfig.translations)
      : [];
    const candidates = [...configured, ...translationLocales];
    const seen = new Set();
    return candidates.filter((locale) => {
      const code = localeCode(locale);
      if (!code || seen.has(code)) return false;
      seen.add(code);
      return true;
    });
  };


  const findLocaleDescriptor = (siteConfig, locale) => getSupportedLocales(siteConfig)
    .find((item) => localeCode(item) === locale) || locale;


  const localizedObject = (translations, locale, fallbackLocale) => {
    if (!translations || typeof translations !== "object") return {};
    const exact = translations[locale];
    if (exact && typeof exact === "object") return exact;
    const fallback = translations[fallbackLocale];
    if (fallback && typeof fallback === "object") return fallback;
    const first = Object.values(translations).find((value) => value && typeof value === "object");
    return first || {};
  };


  const getInitialLocale = (siteConfig) => {
    const supported = getSupportedLocales(siteConfig).map(localeCode).filter(Boolean);
    const fallback = textValue(siteConfig.defaultLocale || siteConfig.locale || supported[0] || "ar").toLowerCase();
    const requested = new URL(window.location.href).searchParams.get("lang");
    if (requested && supported.includes(requested.toLowerCase())) return requested.toLowerCase();

    try {
      const stored = textValue(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toLowerCase();
      if (stored && supported.includes(stored)) return stored;
    } catch {
      // Storage can be unavailable in strict privacy contexts.
    }

    return supported.includes(fallback) ? fallback : (supported[0] || fallback);
  };


  const safeMediaSource = (value) => {
    const source = textValue(value);
    if (!source) return "";

    try {
      const url = new URL(source, document.baseURI);
      if (!EXTERNAL_PROTOCOLS.has(url.protocol)) return "";
      return source;
    } catch {
      return "";
    }
  };


  const safeHref = (value) => {
    const href = textValue(value);
    if (!href) return "";

    if (href.startsWith("#") && href.length > 1) return href;

    try {
      const url = new URL(href, document.baseURI);
      if (!LINK_PROTOCOLS.has(url.protocol)) return "";
      return href;
    } catch {
      return "";
    }
  };


  const isExternalHttpLink = (href) => {
    try {
      const url = new URL(href, document.baseURI);
      return EXTERNAL_PROTOCOLS.has(url.protocol) && url.origin !== window.location.origin;
    } catch {
      return false;
    }
  };


  // Carry the visible locale across public routes even when storage is unavailable.
  const localizedSiteHref = (href) => {
    if (href.startsWith("#")) return href;
    const url = new URL(href, document.baseURI);
    const routes = ["/", "/index.html", "/kids-coding-bootcamp/", "/backend-development-diploma/", "/404.html"];
    if (url.origin !== window.location.origin || !routes.includes(url.pathname)) return href;
    const locale = document.documentElement.lang;
    if (locale !== "en" && !url.searchParams.has("lang")) return href;
    url.searchParams.set("lang", locale === "en" ? "en" : "ar");
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const configureLink = (link, href) => {
    const safeLink = safeHref(href);
    const validatedHref = safeLink ? localizedSiteHref(safeLink) : "";
    if (!validatedHref) return false;

    link.setAttribute("href", validatedHref);
    if (isExternalHttpLink(validatedHref)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }

    return true;
  };


  const sharedNavigationConfig = (locale) => {
    const site = window.MTAcademySite;
    if (!site) return {};
    const copy = localizedObject(site.translations, locale, site.defaultLocale);
    const onHome = ['/', '/index.html'].includes(window.location.pathname);
    const destination = (item) => {
      let href = item.href;
      if (onHome && href.startsWith('/#')) href = href.slice(1);
      else if (locale === 'en') {
        const url = new URL(href, window.location.href);
        url.searchParams.set('lang', 'en');
        href = `${url.pathname}${url.search}${url.hash}`;
      }
      return { ...item, href };
    };
    return { primaryNavigation: copy.primaryNavigation.map(destination), learningNavigation: copy.learningNavigation.map(destination), learningOverviewLabel: copy.learningOverviewLabel };
  };

  const updateNavigationState = () => {
    document.querySelectorAll('[data-learning-path]').forEach(link => {
      const url = new URL(link.href, window.location.href);
      const current = url.pathname === window.location.pathname && !url.hash;
      if (current) { link.setAttribute('aria-current', 'page'); link.classList.add('is-active'); }
      else if (link.getAttribute('aria-current') === 'page') { link.removeAttribute('aria-current'); link.classList.remove('is-active'); }
    });
    document.querySelectorAll('.nav-paths').forEach(group => {
      const routeActive = Boolean(group.querySelector('[aria-current="page"]'));
      group.querySelector('summary').classList.toggle('is-active', routeActive || Boolean(group.querySelector('[aria-current="location"]')));
    });
  };

  const initPathNavigation = () => {
    const groups = [...document.querySelectorAll('.nav-paths')];
    let focusedGroup = null;
    const close = (group, focus = false) => {
      group.open = false;
      if (focus) group.querySelector('summary').focus({ preventScroll: true });
    };
    groups.forEach(group => {
      group.addEventListener('focusin', () => { focusedGroup = group; });
      group.addEventListener('click', event => { if (event.target.closest('a[href]')) close(group); });
      group.addEventListener('focusout', () => {
        window.setTimeout(() => { if (!group.contains(document.activeElement)) close(group); }, 0);
      });
    });
    document.addEventListener('focusin', event => {
      if (event.target !== document.body && !groups.some(group => group.contains(event.target))) focusedGroup = null;
    });
    document.addEventListener('pointerdown', event => groups.forEach(group => { if (!group.contains(event.target)) close(group); }));
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const open = groups.find(group => group.open);
      if (open) { event.preventDefault(); close(open, true); }
    });
    window.matchMedia('(min-width: 70rem)').addEventListener('change', event => groups.forEach(group => {
      const hadFocus = group.contains(document.activeElement) || (focusedGroup === group && document.activeElement === document.body);
      close(group);
      if (hadFocus) {
        const target = event.matches ? group.querySelector('summary') : document.getElementById('mobile-menu-toggle');
        target?.focus({ preventScroll: true });
      }
    }));
    updateNavigationState();
  };

  // Preserve the source text while isolating familiar technical names in Arabic prose.
  // Authoring helpers use the same parts to keep saved HTML and runtime rendering aligned.
  const technicalTextParts = (value) => {
    const source = String(value);
    if (!/[\u0600-\u06ff]/.test(source)) return [{ text: source, technical: false }];
    const terms = /\b(?:MT Academy|Spring Boot|Code Review|Live Coding|MIT App Inventor|Code\.org|Scratch 3|REST APIs|JavaScript|Backend|Python|Udemy|Java|HTML|CSS|AI)\b/g;
    const parts = [];
    let position = 0;
    for (const match of source.matchAll(terms)) {
      if (match.index > position) parts.push({ text: source.slice(position, match.index), technical: false });
      parts.push({ text: match[0], technical: true });
      position = match.index + match[0].length;
    }
    if (position < source.length) parts.push({ text: source.slice(position), technical: false });
    return parts;
  };

  const setLocalizedText = (element, value) => {
    element.replaceChildren(...technicalTextParts(value).map(part => {
      if (!part.technical) return document.createTextNode(part.text);
      const term = createElement('bdi', 'technical-name', part.text);
      term.dir = 'ltr';
      term.lang = 'en';
      return term;
    }));
  };

  const applySiteConfiguration = (siteConfig) => {
    siteConfig = { ...siteConfig, ...sharedNavigationConfig(siteConfig.locale) };
    const root = document.documentElement;
    const locale = textValue(siteConfig.locale || siteConfig.language);
    const direction = textValue(siteConfig.direction || siteConfig.dir).toLowerCase();

    if (locale) root.setAttribute("lang", locale);
    if (direction === "rtl" || direction === "ltr") root.setAttribute("dir", direction);

    const colors = siteConfig.colors && typeof siteConfig.colors === "object"
      ? siteConfig.colors
      : {};
    const colorAliases = {
      background: ["--color-bg", "--background"],
      surface: ["--color-surface", "--surface"],
      primary: ["--color-primary", "--primary"],
      accent: ["--color-accent", "--accent"],
      text: ["--color-text", "--text"],
      muted: ["--color-muted", "--muted"],
      textMuted: ["--color-text-muted", "--text-muted"],
    };

    Object.entries(colors).forEach(([key, value]) => {
      const color = textValue(value);
      const safeKey = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      if (!color || !/^[a-z][a-z0-9-]*$/i.test(safeKey)) return;
      if (window.CSS && typeof window.CSS.supports === "function" && !CSS.supports("color", color)) {
        return;
      }

      root.style.setProperty(`--color-${safeKey}`, color);
      root.style.setProperty(`--${safeKey}`, color);
      (colorAliases[key] || []).forEach((property) => root.style.setProperty(property, color));
    });

    document.querySelectorAll("[data-config-text]").forEach((element) => {
      const value = textValue(getByPath(siteConfig, element.dataset.configText));
      if (!value) {
        element.hidden = true;
        return;
      }

      setLocalizedText(element, value);
      element.hidden = false;
      setAutoDirection(element);
    });

    document.querySelectorAll("[data-config-href]").forEach((element) => {
      const value = getByPath(siteConfig, element.dataset.configHref);
      const isValid = element instanceof HTMLAnchorElement && configureLink(element, value);
      element.hidden = !isValid;
    });

    document.querySelectorAll("[data-config-src]").forEach((element) => {
      const source = safeMediaSource(getByPath(siteConfig, element.dataset.configSrc));
      if (!(element instanceof HTMLImageElement) || !source) {
        element.hidden = true;
        return;
      }

      element.src = source;
      element.hidden = false;
    });

    document.querySelectorAll("[data-config-alt], [data-config-aria]").forEach((element) => {
      const isAlt = element.hasAttribute("data-config-alt");
      const value = textValue(getByPath(siteConfig, isAlt ? element.dataset.configAlt : element.dataset.configAria));
      if (value) element.setAttribute(isAlt ? "alt" : "aria-label", value);
    });

    document.querySelectorAll("[data-current-year], #current-year").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });

    updateNavigationState();

    const seo = siteConfig.seo && typeof siteConfig.seo === "object" ? siteConfig.seo : {};
    const errorPage = siteConfig.errorPage && typeof siteConfig.errorPage === "object"
      ? siteConfig.errorPage
      : {};
    const isErrorPage = document.body && document.body.dataset.page === "404";
    const seoTitle = isErrorPage
      ? (textValue(errorPage.pageTitle) || textValue(seo.title))
      : textValue(seo.title);
    const seoDescription = isErrorPage
      ? (textValue(errorPage.description) || textValue(seo.description))
      : textValue(seo.description);
    const baseCanonicalUrl = safeHref(seo.canonicalUrl || siteConfig.siteUrl);
    const canonical = baseCanonicalUrl ? new URL(baseCanonicalUrl, document.baseURI) : null;
    if (canonical && locale === "en") canonical.searchParams.set("lang", "en");
    const canonicalUrl = canonical ? canonical.href : "";
    const configuredBase = baseCanonicalUrl || safeHref(siteConfig.siteUrl) || document.baseURI;
    const socialImage = absoluteHttpUrl(seo.socialImage, configuredBase);
    if (seoTitle) document.title = seoTitle;

    const setMetaContent = (selector, value) => {
      const element = document.querySelector(selector);
      if (element && textValue(value)) element.setAttribute("content", textValue(value));
    };
    setMetaContent('meta[name="description"]', seoDescription);
    setMetaContent('meta[property="og:title"]', seoTitle);
    setMetaContent('meta[property="og:description"]', seoDescription);
    setMetaContent('meta[property="og:locale"]', textValue(seo.ogLocale) || (locale.startsWith("ar") ? "ar_EG" : "en_US"));
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', socialImage);
    setMetaContent('meta[property="og:image:alt"]', seo.socialImageAlt);
    setMetaContent('meta[name="twitter:title"]', seoTitle);
    setMetaContent('meta[name="twitter:description"]', seoDescription);
    setMetaContent('meta[name="twitter:image"]', socialImage);
    setMetaContent('meta[name="twitter:image:alt"]', seo.socialImageAlt);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink instanceof HTMLLinkElement && canonicalUrl) canonicalLink.href = canonicalUrl;

    document.querySelectorAll("[data-home-link]").forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;
      configureLink(link, "/");
    });
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = safeHref(link.getAttribute("href"));
      if (href) link.setAttribute("href", localizedSiteHref(href));
    });
  };


  const applyAccessibleLabels = (siteConfig) => {
    const isArabic = textValue(siteConfig.locale).startsWith("ar");
    const interfaceCopy = siteConfig.interface && typeof siteConfig.interface === "object"
      ? siteConfig.interface
      : {};
    const defaults = isArabic
      ? {
        mainNavigationLabel: "التنقل الرئيسي",
        mobileNavigationLabel: "التنقل على الهاتف",
        catalogControlsLabel: "أدوات البحث والتصفية",
        categoryFilterLabel: "تصفية حسب المجال",
        paymentMethodsLabel: "طرق الدفع المتاحة",
        languageSwitcherLabel: "اختيار اللغة",
        brandHomeLabel: "MT Academy — الصفحة الرئيسية",
      }
      : {
        mainNavigationLabel: "Main navigation",
        mobileNavigationLabel: "Mobile navigation",
        catalogControlsLabel: "Course search and filters",
        categoryFilterLabel: "Filter by category",
        paymentMethodsLabel: "Available payment methods",
        languageSwitcherLabel: "Choose language",
        brandHomeLabel: "MT Academy — Home",
      };
    const label = (key) => {
      const aliases = {
        mainNavigationLabel: ["mainNavigationLabel", "primaryNavigationLabel"],
      };
      const configured = (aliases[key] || [key])
        .map((candidate) => textValue(interfaceCopy[candidate]))
        .find(Boolean);
      return configured || defaults[key];
    };
    const setLabel = (selector, key) => {
      document.querySelectorAll(selector).forEach((element) => element.setAttribute("aria-label", label(key)));
    };

    setLabel(".desktop-nav", "mainNavigationLabel");
    setLabel("#mobile-nav nav", "mobileNavigationLabel");
    setLabel(".catalog-controls", "catalogControlsLabel");
    setLabel("#filter-buttons, .filter-scroller", "categoryFilterLabel");
    setLabel("#payment-methods", "paymentMethodsLabel");
    setLabel("[data-language-switcher]", "languageSwitcherLabel");
    setLabel(".brand", "brandHomeLabel");
  };


  const initLanguageSwitching = (supportedLocales, onSelect) => {
    const localeCodes = supportedLocales.map(localeCode).filter(Boolean);
    const options = [...document.querySelectorAll("[data-language-option]")];
    const toggles = [...document.querySelectorAll("[data-language-toggle]")];
    let currentLocale = "";

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.preventDefault();
        const nextLocale = textValue(option.dataset.languageOption).toLowerCase();
        if (!localeCodes.includes(nextLocale)) return;
        onSelect(nextLocale);
        if (option.closest(".language-switcher--mobile")) {
          document.dispatchEvent(new CustomEvent("mt:mobile-language-selected"));
        }
      });
    });

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        if (toggle.matches("[data-language-option]")) return;
        event.preventDefault();
        const requested = textValue(toggle.dataset.languageToggle).toLowerCase();
        if (localeCodes.includes(requested)) {
          onSelect(requested);
          return;
        }
        const index = Math.max(0, localeCodes.indexOf(currentLocale));
        if (localeCodes.length > 1) onSelect(localeCodes[(index + 1) % localeCodes.length]);
      });
    });

    window.addEventListener("popstate", (event) => {
      const requested = new URL(window.location.href).searchParams.get("lang");
      const saved = event.state && event.state[LOCALE_HISTORY_KEY];
      const fallback = textValue(window.MTAcademySite && window.MTAcademySite.defaultLocale) || "ar";
      const locale = localeCodes.includes(requested) ? requested : (localeCodes.includes(saved) ? saved : fallback);
      if (localeCodes.includes(locale)) onSelect(locale);
    });

    const update = (locale, siteConfig) => {
      currentLocale = locale;
      options.forEach((option) => {
        const active = textValue(option.dataset.languageOption).toLowerCase() === locale;
        option.setAttribute("aria-pressed", String(active));
        option.classList.toggle("is-active", active);
      });
      const switcherLabel = textValue(siteConfig.interface && siteConfig.interface.languageSwitcherLabel)
        || textValue(siteConfig.errorPage && siteConfig.errorPage.languageSwitcherLabel);
      if (switcherLabel) {
        document.querySelectorAll("[data-language-switcher]")
          .forEach((switcher) => switcher.setAttribute("aria-label", switcherLabel));
      }
    };

    return { update };
  };


  const initMobileNavigation = (siteConfig) => {
    const toggle = document.querySelector("#mobile-menu-toggle");
    const navigation = document.querySelector("#mobile-nav");
    if (!(toggle instanceof HTMLButtonElement) || !navigation) return { update: () => {} };

    if (!navigation.id) navigation.id = "mobile-nav";
    toggle.setAttribute("aria-controls", navigation.id);
    toggle.setAttribute("aria-expanded", "false");
    let openLabel = "";
    let closeLabel = "";
    const updateLabels = (config) => {
      openLabel = textValue(firstValue(config, ["interface.openMenuLabel", "labels.openMenu"]));
      closeLabel = textValue(firstValue(config, ["interface.closeMenuLabel", "labels.closeMenu"]));
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const nextLabel = expanded ? closeLabel : openLabel;
      if (nextLabel) toggle.setAttribute("aria-label", nextLabel);
    };
    updateLabels(siteConfig);
    if (openLabel) toggle.setAttribute("aria-label", openLabel);
    navigation.hidden = true;
    navigation.inert = true;
    navigation.setAttribute("aria-hidden", "true");

    const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isOpen = false;
    let closeTimer = 0;
    let openFrame = 0;

    const clearTimers = () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      if (openFrame) window.cancelAnimationFrame(openFrame);
      closeTimer = 0;
      openFrame = 0;
    };

    const focusVisibleControl = (preferToggle = true) => {
      if (preferToggle && !window.matchMedia("(min-width: 70rem)").matches) {
        toggle.focus({ preventScroll: true });
        return;
      }
      const desktopTarget = document.querySelector(".desktop-nav .nav-link.is-active, .desktop-nav .nav-link, .brand");
      if (desktopTarget instanceof HTMLElement) desktopTarget.focus({ preventScroll: true });
    };

    const finishClose = (desktopMode = false) => {
      clearTimers();
      navigation.classList.remove("is-open", "is-closing");
      navigation.hidden = true;
      navigation.inert = true;
      navigation.setAttribute("aria-hidden", "true");
      document.body.classList.remove("mobile-nav-open", "menu-open");
      unlockPageScroll("mobile-navigation");
      if (navigation.contains(document.activeElement) || (desktopMode && document.activeElement === toggle)) focusVisibleControl(!desktopMode);
    };

    const setOpen = (nextOpen, restoreFocus = false, immediate = false) => {
      if (isOpen === nextOpen && !(immediate && !nextOpen)) return;
      clearTimers();
      isOpen = nextOpen;
      toggle.setAttribute("aria-expanded", String(nextOpen));
      if (nextOpen && closeLabel) toggle.setAttribute("aria-label", closeLabel);
      if (!nextOpen && openLabel) toggle.setAttribute("aria-label", openLabel);

      if (nextOpen) {
        navigation.hidden = false;
        navigation.inert = false;
        navigation.removeAttribute("aria-hidden");
        navigation.classList.remove("is-closing");
        lockPageScroll("mobile-navigation");
        document.body.classList.add("mobile-nav-open", "menu-open");
        void navigation.offsetHeight;
        openFrame = window.requestAnimationFrame(() => {
          openFrame = 0;
          navigation.classList.add("is-open");
          const firstFocusable = navigation.querySelector(focusableSelector);
          if (firstFocusable instanceof HTMLElement) firstFocusable.focus();
        });
        return;
      }

      navigation.inert = true;
      navigation.setAttribute("aria-hidden", "true");
      navigation.classList.remove("is-open");
      navigation.classList.add("is-closing");
      document.body.classList.remove("mobile-nav-open", "menu-open");
      if ((restoreFocus || navigation.contains(document.activeElement)) && toggle.isConnected) {
        focusVisibleControl(true);
      }

      if (immediate || reducedMotion.matches) finishClose(immediate);
      else closeTimer = window.setTimeout(() => finishClose(false), motionDuration());
    };

    toggle.addEventListener("click", () => setOpen(!isOpen, false));

    navigation.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href") || "";
      setOpen(false, href === "#top");

      if (href.startsWith("#") && href !== "#top") {
        let target = null;
        try {
          target = document.querySelector(href);
        } catch {
          target = null;
        }
        const focusTarget = target && target.querySelector("h1, h2, h3");
        if (focusTarget instanceof HTMLElement) {
          window.setTimeout(() => {
            focusTarget.setAttribute("tabindex", "-1");
            focusTarget.focus({ preventScroll: true });
            focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
          }, motionDuration() + 30);
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setOpen(false, true);
        return;
      }

      if (event.key === "Tab" && isOpen) {
        const focusable = [toggle, ...navigation.querySelectorAll(focusableSelector)]
          .filter((element) => element instanceof HTMLElement && !element.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (!focusable.includes(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!isOpen || !(event.target instanceof Node)) return;
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) setOpen(false, false);
    });

    document.addEventListener("mt:mobile-language-selected", () => setOpen(false, true));

    const desktopQuery = window.matchMedia("(min-width: 70rem)");
    const handleViewportChange = (event) => {
      if (event.matches) {
        // The media query can hide and blur the mobile controls before this callback.
        const restoreDesktopFocus = isOpen || navigation.contains(document.activeElement) || document.activeElement === toggle;
        setOpen(false, false, true);
        if (restoreDesktopFocus) focusVisibleControl(false);
      }
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleViewportChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleViewportChange);
    }

    if (desktopQuery.matches) finishClose(true);

    return { update: updateLabels, close: () => setOpen(false, true) };
  };


  const absoluteHttpUrl = (value, base = document.baseURI) => {
    const source = textValue(value);
    if (!source) return "";
    try {
      const url = new URL(source, base);
      return EXTERNAL_PROTOCOLS.has(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };


  const motionDuration = (name = 'component', fallback = 240) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(`--motion-duration-${name}`).trim();
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number * (value.endsWith('ms') ? 1 : 1000) : fallback;
  };

  const initHeaderMotion = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const hero = document.querySelector('.hero');
    let frame = 0;

    const update = () => {
      frame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 16);
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
      document.body.classList.toggle('hero-in-view', Boolean(hero && hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(header);
    update();
  };

  const initMotionSystem = () => {
    if (window.__mtAcademyMotion) return window.__mtAcademyMotion;
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const configuredStagger = Number.parseFloat(
      window.getComputedStyle(root).getPropertyValue("--motion-stagger")
    );
    const staggerStep = Number.isFinite(configuredStagger) ? configuredStagger : 55;
    const observed = new WeakSet();
    let observer = null;

    const reveal = (element) => {
      if (!(element instanceof HTMLElement)) return;
      element.classList.add("is-revealed");
      if (observer) observer.unobserve(element);
    };

    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      }, { rootMargin: "0px 0px 10% 0px", threshold: 0.06 });
    }

    const observeElements = (elements, options = {}) => {
      const candidates = [...elements].filter((element) => element instanceof HTMLElement);
      candidates.forEach((element, index) => {
        if (observed.has(element) || element.closest("[hidden]")) return;
        observed.add(element);
        element.classList.add("motion-reveal");
        if (options.variant) element.classList.add(`motion-reveal--${options.variant}`);
        const stagger = options.stagger === false ? 0 : Math.min(index * staggerStep, staggerStep * 3);
        element.style.setProperty("--motion-delay", `${stagger}ms`);

        if (reducedMotion.matches || !observer) {
          reveal(element);
          return;
        }

        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top <= window.innerHeight * 0.94) {
          window.requestAnimationFrame(() => reveal(element));
          return;
        }
        observer.observe(element);
      });
    };

    const refresh = () => {
      observeElements(document.querySelectorAll(
        '.hero__content, .learning-paths__heading, .learning-path, .section-heading, .instructor-visual, .instructor-content, .payment-copy, .contact-card, .footer-grid > *, .footer-bottom, .kids-hero__copy, .kids-hero__media, .kids-section-heading, .kids-benefit, .kids-level, .kids-how article, .kids-session, .kids-instructor, .kids-final, .kids-footer, .diploma-hero__copy, .diploma-hero__visual, .diploma-section-heading, .diploma-metrics, .diploma-practice-card, .diploma-mentor, .diploma-cohort, .diploma-announcements article, .diploma-faq, .diploma-closing, .diploma-related__card, .diploma-footer'
      ), { stagger: false });
      observeElements(document.querySelectorAll('.course-card, .payment-method, .review-slide'));
    };

    root.classList.add("motion-ready");
    reducedMotion.addEventListener('change', () => {
      if (!reducedMotion.matches) return;
      document.querySelectorAll('.motion-reveal').forEach(reveal);
      if (observer) observer.disconnect();
    });
    refresh();

    window.__mtAcademyMotion = { observeElements, refresh };
    return window.__mtAcademyMotion;
  };

  const initActiveNavigation = () => {
    const candidates = document.querySelectorAll("[data-local-nav] a[href^='#'], header [data-nav-link][href^='#']");
    const links = [];
    const sectionMap = new Map();

    candidates.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.startsWith("#course=")) return;
      let id = "";
      try {
        id = decodeURIComponent(href.slice(1));
      } catch {
        return;
      }
      const section = document.getElementById(id);
      if (!section) return;
      links.push({ link, id });
      sectionMap.set(id, section);
    });

    if (!links.length || !sectionMap.size) return;

    const setActive = (id) => {
      links.forEach(({ link, id: linkId }) => {
        const isActive = linkId === id;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      updateNavigationState();
    };

    links.forEach(({ link, id }) => link.addEventListener("click", () => setActive(id)));

    let lastActive = null;
    const chooseByScrollPosition = () => {
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 80;
      const threshold = headerHeight + 24;
      const sections = [...sectionMap].map(([id, element]) => ({ id, bounds: element.getBoundingClientRect() })).sort((a,b) => a.bounds.top - b.bounds.top);
      let selected = sectionMap.has('top') ? 'top' : '';
      sections.forEach(({ id, bounds }) => { if (bounds.top <= threshold) selected = id; });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        const visible = sections.filter(({ bounds }) => bounds.top < window.innerHeight && bounds.bottom > headerHeight);
        if (visible.length) selected = visible[visible.length - 1].id;
      }
      if (selected !== lastActive) { lastActive = selected; setActive(selected); }
    };
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => { frame = 0; chooseByScrollPosition(); });
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    chooseByScrollPosition();

  };


  const initTopLinks = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.querySelectorAll('a[href="#top"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const nextUrl = `${window.location.pathname}${window.location.search}#top`;
        history.pushState(history.state, "", nextUrl);
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
      });
    });
  };


  const saveLocale = (locale) => {
    try { window.localStorage.setItem(LOCALE_STORAGE_KEY, locale); } catch { /* Private browsing. */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang") || locale !== "ar") {
      url.searchParams.set("lang", locale);
    }
    const state = history.state && typeof history.state === "object" ? history.state : {};
    history.replaceState({ ...state, [LOCALE_HISTORY_KEY]: locale }, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const asTextArrayForSchema = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (typeof item === "string" || typeof item === "number") return textValue(item);
      if (!item || typeof item !== "object") return "";
      return textValue(item.title || item.name || item.description);
    }).filter(Boolean);
  };

  const getValidRating = (rating) => {
    if (!rating || typeof rating !== "object") return null;
    const value = Number(rating.value);
    const max = Number(rating.max);
    const reviewCount = Number(rating.reviewCount);
    if (!Number.isFinite(value) || !Number.isFinite(max) || !Number.isFinite(reviewCount)) return null;
    if (value <= 0 || max <= 0 || reviewCount <= 0 || value > max) return null;
    return { value, max, reviewCount };
  };

  const buildOrganizationSchema = (siteConfig) => {
    const siteUrl = absoluteHttpUrl(siteConfig.siteUrl, siteConfig.siteUrl);
    const brandName = textValue(siteConfig.brandName);
    if (!siteUrl || !brandName) return null;
    const organizationId = `${siteUrl.replace(/#.*$/, "")}#organization`;
    const organization = {
      "@type": "Organization",
      "@id": organizationId,
      name: brandName,
      url: siteUrl,
    };
    const logo = siteConfig.logo && typeof siteConfig.logo === "object"
      ? absoluteHttpUrl(siteConfig.logo.src, siteUrl)
      : "";
    if (logo) organization.logo = logo;

    const sameAs = (Array.isArray(siteConfig.socialLinks) ? siteConfig.socialLinks : [])
      .map((link) => absoluteHttpUrl(link && (link.url || link.href), siteUrl))
      .filter(Boolean);
    if (sameAs.length) organization.sameAs = sameAs;

    return organization;
  };

  const buildCatalogSchema = (siteConfig, courses) => {
    const configuredSiteUrl = absoluteHttpUrl(siteConfig.siteUrl, siteConfig.siteUrl);
    const siteUrl = configuredSiteUrl;
    const brandName = textValue(siteConfig.brandName);
    if (!siteUrl || !brandName) {
      return null;
    }

    const organization = buildOrganizationSchema(siteConfig);
    const organizationId = organization["@id"];

    const itemListElements = [];
    courses.forEach((course) => {
      const name = textValue(course.title);
      if (!name) return;
      const item = {
        "@type": "Course",
        name,
        provider: { "@id": organizationId },
      };
      const description = textValue(course.shortDescription || course.fullDescription);
      const courseUrl = absoluteHttpUrl(course.enrollmentUrl || course.detailsUrl || course.url, siteUrl);
      const image = typeof course.image === "string" ? { src: course.image } : (course.image || {});
      const imageUrl = absoluteHttpUrl(image.src, siteUrl);
      const language = textValue(course.language);
      const category = textValue(course.category);
      const teaches = asTextArrayForSchema(course.learningOutcomes);
      const rating = getValidRating(course.rating);
      if (description) item.description = description;
      if (courseUrl) item.url = courseUrl;
      if (imageUrl) item.image = imageUrl;
      if (language) item.inLanguage = language;
      if (category) item.about = category;
      if (teaches.length) item.teaches = teaches;
      if (rating) {
        item.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: rating.value,
          bestRating: rating.max,
          ratingCount: rating.reviewCount,
        };
      }

      itemListElements.push({
        "@type": "ListItem",
        position: itemListElements.length + 1,
        item,
      });
    });

    const graph = [organization];
    if (itemListElements.length) {
      graph.push({
        "@type": "ItemList",
        name: textValue(siteConfig.catalog && siteConfig.catalog.title) || `${brandName} Courses`,
        numberOfItems: itemListElements.length,
        itemListElement: itemListElements,
      });
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  };

  const deepFreeze = (value) => {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  };


  const renderLearningPaths = (locale) => {
    const paths = window.MTAcademyPaths;
    const diploma = window.MTAcademyBackend;
    if (!paths || !diploma) return;
    const backendCopy = localizedObject(diploma.translations, locale, "ar");
    const copy = {
      ...localizedObject(paths.translations, locale, "ar"),
      backend: { ...backendCopy.card, visualAlt: backendCopy.visualAlt, status: backendCopy.statusLabels[diploma.status] },
    };
    document.querySelectorAll("[data-path-text]").forEach((element) => {
      setLocalizedText(element, textValue(getByPath(copy, element.dataset.pathText)));
    });
    document.querySelectorAll("[data-path-aria]").forEach((element) => {
      element.setAttribute("aria-label", textValue(getByPath(copy, element.dataset.pathAria)));
    });
    document.querySelectorAll("[data-path-href]").forEach((link) => {
      const offering = paths.offerings.find((item) => item.id === link.dataset.pathHref);
      if (offering) configureLink(link, offering.href);
    });
    document.querySelectorAll("[data-path-image]").forEach((image) => {
      const offering = paths.offerings.find((item) => item.id === image.dataset.pathImage);
      if (!offering?.image) return;
      image.src = offering.image.src;
      image.width = offering.image.width;
      image.height = offering.image.height;
      image.alt = textValue(getByPath(copy, offering.imageAltKey || "imageAlt"));
    });
    document.querySelectorAll("[data-path-status='backend-diploma']").forEach((card) => {
      card.dataset.offeringStatus = diploma.status;
    });
  };

  const renderKidsOffering = (locale) => {
    const data = window.MTAcademyKids;
    if (!data) return;
    const copy = localizedObject(data.translations, locale, "ar");
    const offer = data.promotion;
    const percent = Number(offer.upToPercent);
    const now = Date.now();
    const start = offer.startsAt ? Date.parse(offer.startsAt) : -Infinity;
    const end = offer.endsAt ? Date.parse(offer.endsAt) : Infinity;
    const active = offer.enabled === true && percent > 0 && percent <= 100 && now >= start && now < end;
    document.querySelectorAll("[data-kids-offer]").forEach((element) => {
      element.hidden = !active;
      element.textContent = active ? copy.offerTemplate.replace("{percent}", String(percent)) : "";
    });
  };

  window.MTAcademyCore = Object.freeze({
    lockPageScroll, unlockPageScroll, onReady, textValue, getByPath, firstValue, createElement, setAutoDirection, getValidRating, buildOrganizationSchema, buildCatalogSchema, technicalTextParts, isNonEmptyArray, localeCode, getSupportedLocales, findLocaleDescriptor, localizedObject, getInitialLocale, safeMediaSource, safeHref, isExternalHttpLink, configureLink, applySiteConfiguration, applyAccessibleLabels, initLanguageSwitching, initMobileNavigation, absoluteHttpUrl, initActiveNavigation, initTopLinks, initPathNavigation, initMotionSystem, initHeaderMotion, motionDuration, saveLocale, deepFreeze, renderKidsOffering, renderLearningPaths
  });
})();
