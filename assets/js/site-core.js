/** Shared browser utilities. Load before each page controller. */
(() => {
  "use strict";
  const LOCALE_STORAGE_KEY = "mt-academy-locale";
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


  const configureLink = (link, href) => {
    const validatedHref = safeHref(href);
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


  const applySiteConfiguration = (siteConfig) => {
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

      element.textContent = value;
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
      link.href = "/";
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
      if (navigation.contains(document.activeElement)) focusVisibleControl(!desktopMode);
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
      else closeTimer = window.setTimeout(() => finishClose(false), 240);
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
          }, 350);
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
      if (event.matches) setOpen(false, false, true);
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


  const initActiveNavigation = () => {
    const desktopNav = document.querySelector(".desktop-nav");
    const candidates = document.querySelectorAll(
      "[data-nav-link][href^='#'], header nav a[href^='#'], #mobile-nav a[href^='#']"
    );
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

    let pillFrame = 0;
    const updateDesktopPill = () => {
      pillFrame = 0;
      if (!(desktopNav instanceof HTMLElement) || desktopNav.offsetParent === null) return;
      const activeLink = desktopNav.querySelector(".nav-link.is-active");
      if (!(activeLink instanceof HTMLElement)) {
        desktopNav.style.setProperty("--nav-pill-opacity", "0");
        return;
      }
      const navBounds = desktopNav.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();
      desktopNav.style.setProperty("--nav-pill-left", `${linkBounds.left - navBounds.left}px`);
      desktopNav.style.setProperty("--nav-pill-width", `${linkBounds.width}px`);
      desktopNav.style.setProperty("--nav-pill-opacity", "1");
    };

    const schedulePillUpdate = () => {
      if (pillFrame) window.cancelAnimationFrame(pillFrame);
      pillFrame = window.requestAnimationFrame(updateDesktopPill);
    };

    const setActive = (id) => {
      links.forEach(({ link, id: linkId }) => {
        const isActive = linkId === id;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      schedulePillUpdate();
    };

    links.forEach(({ link, id }) => link.addEventListener("click", () => setActive(id)));

    const chooseByScrollPosition = () => {
      const threshold = Math.max(100, window.innerHeight * 0.3);
      let selected = sectionMap.has("top") ? "top" : "";
      sectionMap.forEach((section, id) => {
        if (section.getBoundingClientRect().top <= threshold) selected = id;
      });
      setActive(selected);
    };

    if ("IntersectionObserver" in window) {
      const visibility = new Map();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        const visible = [...visibility.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1]);
        if (visible.length) setActive(visible[0][0]);
        else chooseByScrollPosition();
      }, { rootMargin: "-20% 0px -60%", threshold: [0, 0.1, 0.5, 1] });
      sectionMap.forEach((section) => observer.observe(section));
    } else {
      let scheduled = false;
      window.addEventListener("scroll", () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
          scheduled = false;
          chooseByScrollPosition();
        });
      }, { passive: true });
    }

    chooseByScrollPosition();
    window.addEventListener("resize", schedulePillUpdate, { passive: true });
    if ("ResizeObserver" in window && desktopNav) {
      const resizeObserver = new ResizeObserver(schedulePillUpdate);
      resizeObserver.observe(desktopNav);
    }
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
      history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
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
      backend: { ...backendCopy.card, status: backendCopy.statusLabels[diploma.status] },
    };
    document.querySelectorAll("[data-path-text]").forEach((element) => {
      element.textContent = textValue(getByPath(copy, element.dataset.pathText));
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
      image.alt = copy.imageAlt;
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
    lockPageScroll, unlockPageScroll, onReady, textValue, getByPath, firstValue, createElement, setAutoDirection, isNonEmptyArray, localeCode, getSupportedLocales, findLocaleDescriptor, localizedObject, getInitialLocale, safeMediaSource, safeHref, isExternalHttpLink, configureLink, applySiteConfiguration, applyAccessibleLabels, initLanguageSwitching, initMobileNavigation, absoluteHttpUrl, initActiveNavigation, initTopLinks, saveLocale, deepFreeze, renderKidsOffering, renderLearningPaths
  });
})();
