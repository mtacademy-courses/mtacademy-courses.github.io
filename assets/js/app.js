(() => {
  "use strict";

  const APP_STATE_KEY = "__mtAcademyCourseDialog";
  const COURSE_HASH_KEY = "course";
  const LOCALE_STORAGE_KEY = "mt-academy-locale";
  const EXTERNAL_PROTOCOLS = new Set(["http:", "https:"]);
  const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

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

  const getTagText = (tag) => {
    if (typeof tag === "string" || typeof tag === "number") return textValue(tag);
    if (!tag || typeof tag !== "object") return "";
    return textValue(tag.label || tag.name || tag.title);
  };

  const asTextArrayForSchema = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (typeof item === "string" || typeof item === "number") return textValue(item);
      if (!item || typeof item !== "object") return "";
      return textValue(item.title || item.name || item.description);
    }).filter(Boolean);
  };

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

  const resolvePaymentMethods = (rawSiteConfig, locale, fallbackLocale) => {
    const legacyMethods = rawSiteConfig.payment && Array.isArray(rawSiteConfig.payment.methods)
      ? rawSiteConfig.payment.methods
      : [];
    const methods = Array.isArray(rawSiteConfig.paymentMethods)
      ? rawSiteConfig.paymentMethods
      : legacyMethods;

    return methods.map((method) => {
      if (!method || typeof method !== "object") return {};
      const translation = localizedObject(method.translations, locale, fallbackLocale);
      return {
        ...method,
        ...translation,
        image: method.image && typeof method.image === "object" ? { ...method.image } : method.image,
      };
    });
  };

  const resolveSiteConfig = (rawSiteConfig, locale) => {
    const fallbackLocale = textValue(rawSiteConfig.defaultLocale || rawSiteConfig.locale || "ar").toLowerCase();
    const translation = localizedObject(rawSiteConfig.translations, locale, fallbackLocale);
    const descriptor = findLocaleDescriptor(rawSiteConfig, locale);
    const descriptorDirection = descriptor && typeof descriptor === "object"
      ? textValue(descriptor.direction || descriptor.dir).toLowerCase()
      : "";
    const direction = textValue(translation.direction || translation.dir || descriptorDirection)
      || (locale.startsWith("ar") ? "rtl" : "ltr");
    const paymentMethods = resolvePaymentMethods(rawSiteConfig, locale, fallbackLocale);
    const translatedPayment = translation.payment && typeof translation.payment === "object"
      ? translation.payment
      : (rawSiteConfig.payment && typeof rawSiteConfig.payment === "object" ? rawSiteConfig.payment : {});

    return {
      ...rawSiteConfig,
      ...translation,
      locale,
      direction,
      seo: {
        ...(rawSiteConfig.seo && typeof rawSiteConfig.seo === "object" ? rawSiteConfig.seo : {}),
        ...(translation.seo && typeof translation.seo === "object" ? translation.seo : {}),
      },
      headerCta: {
        ...(translation.headerCta && typeof translation.headerCta === "object" ? translation.headerCta : {}),
        url: textValue(translation.headerCta && translation.headerCta.url)
          || textValue(rawSiteConfig.contact && rawSiteConfig.contact.whatsapp),
      },
      paymentMethods,
      payment: { ...translatedPayment, methods: paymentMethods },
    };
  };

  const resolveCourse = (rawCourse, locale, fallbackLocale) => {
    const translation = localizedObject(rawCourse.translations, locale, fallbackLocale);
    const image = rawCourse.image && typeof rawCourse.image === "object"
      ? { ...rawCourse.image, alt: textValue(translation.imageAlt) || textValue(rawCourse.image.alt) }
      : rawCourse.image;

    return {
      ...rawCourse,
      ...translation,
      image,
      _bilingualSearchText: flattenSearchValue(rawCourse.translations),
    };
  };

  const replaceObjectContents = (target, source) => {
    Object.keys(target).forEach((key) => delete target[key]);
    Object.assign(target, source);
    return target;
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

  const getCourseImage = (course) => {
    if (typeof course.image === "string") {
      return { src: textValue(course.image), alt: "", width: 1200, height: 1600 };
    }

    const image = course.image && typeof course.image === "object" ? course.image : {};
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      src: textValue(image.src),
      alt: textValue(image.alt),
      width: Number.isFinite(width) && width > 0 ? Math.round(width) : 1200,
      height: Number.isFinite(height) && height > 0 ? Math.round(height) : 1600,
    };
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
    const defaultLocale = textValue(siteConfig.defaultLocale || "ar").toLowerCase();
    let canonicalUrl = baseCanonicalUrl;
    if (baseCanonicalUrl && locale && locale.toLowerCase() !== defaultLocale) {
      try {
        const localizedCanonical = new URL(baseCanonicalUrl, document.baseURI);
        localizedCanonical.searchParams.set("lang", locale.toLowerCase());
        localizedCanonical.hash = "";
        canonicalUrl = localizedCanonical.href;
      } catch {
        canonicalUrl = baseCanonicalUrl;
      }
    }
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
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical instanceof HTMLLinkElement && canonicalUrl) canonical.href = canonicalUrl;

    document.querySelectorAll("[data-home-link]").forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;
      link.href = locale === textValue(siteConfig.defaultLocale || "ar").toLowerCase()
        ? "/"
        : `/?lang=${encodeURIComponent(locale)}`;
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

  const renderHeroTopics = (siteConfig) => {
    const container = document.querySelector("[data-hero-topics]");
    if (!container) return;
    const topics = siteConfig.hero && Array.isArray(siteConfig.hero.topics)
      ? siteConfig.hero.topics.map(textValue).filter(Boolean)
      : [];
    const fragment = document.createDocumentFragment();
    topics.forEach((topic) => {
      const element = createElement("span", "", topic);
      setAutoDirection(element);
      fragment.append(element);
    });
    container.replaceChildren(fragment);
    const label = textValue(siteConfig.interface && siteConfig.interface.heroTopicsLabel);
    if (label) container.setAttribute("aria-label", label);
    container.hidden = topics.length === 0;
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
        if (localeCodes.includes(nextLocale)) onSelect(nextLocale);
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

  const createCopy = (siteConfig) => {
    const language = textValue(siteConfig.locale || siteConfig.language || document.documentElement.lang)
      .toLowerCase();
    const useArabic = language.startsWith("ar");
    const defaults = useArabic
      ? {
        allCourses: "كل الدورات",
        details: "تفاصيل الدورة",
        enroll: "عرض الدورة",
        results: "{count} دورة",
        course: "دورة",
        category: "التصنيف",
        level: "المستوى",
        language: "اللغة",
        duration: "المدة",
        lessons: "الدروس",
        instructor: "المحاضر",
        learningOutcomes: "ماذا ستتعلم",
        curriculum: "محتوى الدورة",
        about: "عن الدورة",
        price: "السعر",
        available: "متاحة الآن",
        comingSoon: "قريبًا",
        closed: "التسجيل مغلق",
        closeDialog: "إغلاق تفاصيل الدورة",
        courseCover: "غلاف دورة {title}",
        reviews: "{count} تقييم",
        rating: "التقييم",
        ratingAria: "تقييم {value} من {max} بناءً على {count} تقييم",
        showMoreTags: "عرض {count} من الوسوم الإضافية لكورس {title}",
        hideMoreTags: "إخفاء الوسوم الإضافية لكورس {title}",
        closeTags: "إغلاق",
      }
      : {
        allCourses: "All Courses",
        details: "Course details",
        enroll: "View course",
        results: "{count} courses",
        course: "Course",
        category: "Category",
        level: "Level",
        language: "Language",
        duration: "Duration",
        lessons: "Lessons",
        instructor: "Instructor",
        learningOutcomes: "What you’ll learn",
        curriculum: "Course content",
        about: "About this course",
        price: "Price",
        available: "Available now",
        comingSoon: "Coming soon",
        closed: "Enrollment closed",
        closeDialog: "Close course details",
        courseCover: "Cover for {title}",
        reviews: "{count} reviews",
        rating: "Rating",
        ratingAria: "{value} out of {max} from {count} ratings",
        showMoreTags: "Show {count} more tags for {title}",
        hideMoreTags: "Hide additional tags for {title}",
        closeTags: "Close",
      };

    const paths = {
      allCourses: ["labels.allCourses", "ui.allCourses", "catalog.allCoursesLabel"],
      details: ["labels.courseDetails", "ui.courseDetails", "courseDetails.detailsLabel", "catalog.detailsLabel"],
      enroll: ["labels.enroll", "ui.enroll", "courseDetails.enrollmentLabel", "catalog.enrollmentLabel"],
      results: ["labels.resultsCount", "ui.resultsCount", "catalog.resultCountTemplate", "catalog.resultsCountLabel"],
      category: ["labels.category", "ui.category"],
      level: ["labels.level", "ui.level", "courseDetails.levelLabel"],
      language: ["labels.language", "ui.language", "courseDetails.languageLabel"],
      duration: ["labels.duration", "ui.duration", "courseDetails.durationLabel"],
      lessons: ["labels.lessons", "ui.lessons", "courseDetails.lessonCountLabel"],
      instructor: ["labels.instructor", "ui.instructor", "courseDetails.instructorLabel"],
      learningOutcomes: ["labels.learningOutcomes", "ui.learningOutcomes", "courseDetails.learningOutcomesTitle"],
      curriculum: ["labels.curriculum", "ui.curriculum", "courseDetails.curriculumTitle"],
      about: ["labels.aboutCourse", "ui.aboutCourse"],
      price: ["labels.price", "ui.price"],
      closeDialog: ["labels.closeDialog", "ui.closeDialog", "courseDetails.closeLabel"],
      reviews: ["courseDetails.reviewsLabel", "interface.reviewCountTemplate"],
      rating: ["courseDetails.ratingLabel"],
      ratingAria: ["interface.courseRatingLabelTemplate"],
      showMoreTags: ["catalog.showMoreTagsLabel"],
      hideMoreTags: ["catalog.hideMoreTagsLabel"],
      closeTags: ["catalog.closeTagsLabel"],
    };

    return (key, replacements = {}) => {
      const configured = paths[key] ? textValue(firstValue(siteConfig, paths[key])) : "";
      let value = configured || defaults[key] || key;
      Object.entries(replacements).forEach(([token, replacement]) => {
        value = value.replaceAll(`{${token}}`, String(replacement));
      });
      return value;
    };
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

    const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
    let isOpen = false;

    const setOpen = (nextOpen, restoreFocus = false) => {
      if (isOpen === nextOpen) return;
      isOpen = nextOpen;
      toggle.setAttribute("aria-expanded", String(nextOpen));
      if (nextOpen && closeLabel) toggle.setAttribute("aria-label", closeLabel);
      if (!nextOpen && openLabel) toggle.setAttribute("aria-label", openLabel);
      navigation.hidden = !nextOpen;
      navigation.classList.toggle("is-open", nextOpen);
      document.body.classList.toggle("mobile-nav-open", nextOpen);
      document.body.classList.toggle("menu-open", nextOpen);

      if (nextOpen) {
        window.requestAnimationFrame(() => {
          const firstFocusable = navigation.querySelector(focusableSelector);
          if (firstFocusable instanceof HTMLElement) firstFocusable.focus();
        });
      } else if (restoreFocus && toggle.isConnected) {
        toggle.focus();
      }
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

    const desktopQuery = window.matchMedia("(min-width: 52rem)");
    const handleViewportChange = (event) => {
      if (event.matches && isOpen) setOpen(false, false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleViewportChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleViewportChange);
    }

    return { update: updateLabels };
  };

  const normalizeSearchText = (value) => textValue(value)
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/[ـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

  const flattenSearchValue = (value) => {
    if (typeof value === "string" || typeof value === "number") return textValue(value);
    if (Array.isArray(value)) return value.map(flattenSearchValue).filter(Boolean).join(" ");
    if (!value || typeof value !== "object") return "";
    return Object.values(value).map(flattenSearchValue).filter(Boolean).join(" ");
  };

  const courseSearchText = (course) => normalizeSearchText([
    course.title,
    course.category,
    course.shortDescription,
    course.fullDescription,
    flattenSearchValue(course.tags),
    course._bilingualSearchText,
  ].map(flattenSearchValue).join(" "));

  const getCourseSlug = (course, index = 0) => {
    const suppliedSlug = textValue(course.slug || course.id);
    return suppliedSlug || `course-${index + 1}`;
  };

  const getPriceText = (course, siteConfig, copy) => {
    const price = course.price && typeof course.price === "object" ? course.price : null;
    if (!price) return "";

    const displayText = textValue(price.displayText);
    if (displayText) return displayText;
    if (textValue(price.type).toLowerCase() === "free") {
      return textValue(firstValue(siteConfig, ["labels.free", "ui.free"])) || "Free";
    }

    if (price.amount === null || price.amount === undefined || price.amount === "") return "";
    const amount = Number(price.amount);
    const currency = textValue(price.currency);
    if (!Number.isFinite(amount) || !currency) return "";

    try {
      return new Intl.NumberFormat(
        textValue(siteConfig.locale || siteConfig.language) || undefined,
        { style: "currency", currency }
      ).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const getPreviousPriceText = (course, siteConfig) => {
    const price = course.price && typeof course.price === "object" ? course.price : null;
    if (!price) return "";
    if (price.previousAmount === null || price.previousAmount === undefined || price.previousAmount === "") {
      return "";
    }
    const previousAmount = Number(price.previousAmount);
    const currency = textValue(price.currency);
    if (!Number.isFinite(previousAmount) || !currency) return "";

    try {
      return new Intl.NumberFormat(
        textValue(siteConfig.locale || siteConfig.language) || undefined,
        { style: "currency", currency }
      ).format(previousAmount);
    } catch {
      return `${previousAmount} ${currency}`;
    }
  };

  const getStatusText = (course, siteConfig, copy) => {
    const status = textValue(course.status).toLowerCase();
    if (!status) return "";

    const configured = getByPath(siteConfig, `labels.statuses.${status}`)
      || getByPath(siteConfig, `ui.statuses.${status}`);
    if (textValue(configured)) return textValue(configured);

    if (["available", "open", "enrolling"].includes(status)) return "";
    if (["coming-soon", "coming_soon", "soon"].includes(status)) return copy("comingSoon");
    if (["closed", "unavailable", "enrollment-closed"].includes(status)) return copy("closed");
    return textValue(course.status);
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

  const formatNumber = (value, locale, options = {}) => {
    try {
      return new Intl.NumberFormat(locale || undefined, options).format(value);
    } catch {
      return String(value);
    }
  };

  const createRatingRow = (rating, siteConfig, copy) => {
    const valid = getValidRating(rating);
    if (!valid) return null;
    const locale = textValue(siteConfig.locale);
    const value = formatNumber(valid.value, locale, { maximumFractionDigits: 1 });
    const max = formatNumber(valid.max, locale, { maximumFractionDigits: 1 });
    const reviewCount = formatNumber(valid.reviewCount, locale);
    const row = createElement("div", "course-rating");
    row.setAttribute("aria-label", copy("ratingAria", { value, max, count: reviewCount }));

    const numeric = createElement("span", "course-rating__value", value);
    const stars = createElement("span", "course-rating__stars", "★★★★★");
    stars.setAttribute("aria-hidden", "true");
    const fillPercent = Math.round(Math.max(0, Math.min(100, (valid.value / valid.max) * 100)) * 10) / 10;
    stars.style.setProperty("--rating-percent", `${fillPercent}%`);
    const count = createElement("span", "course-rating__count", copy("reviews", { count: reviewCount }));
    row.append(numeric, stars, count);
    return row;
  };

  const getMetadata = (course, copy) => {
    const metadata = [];
    const values = [
      ["level", course.level],
      ["language", course.language],
      ["duration", course.duration],
      ["instructor", course.instructor],
    ];

    values.forEach(([key, value]) => {
      const text = textValue(value);
      if (text) metadata.push({ label: copy(key), value: text });
    });

    const hasLessonCount = course.lessonCount !== null
      && course.lessonCount !== undefined
      && course.lessonCount !== "";
    const lessonCount = Number(course.lessonCount);
    if (hasLessonCount && Number.isFinite(lessonCount) && lessonCount >= 0) {
      metadata.push({ label: copy("lessons"), value: String(lessonCount) });
    }

    return metadata;
  };

  const hasCourseDetails = (course) => Boolean(
    textValue(course.fullDescription)
    || isNonEmptyArray(course.fullDescription)
    || isNonEmptyArray(course.learningOutcomes)
    || isNonEmptyArray(course.curriculum)
    || getMetadata(course, (key) => key).length
    || getPriceText(course, {}, (key) => key)
  );

  const createTags = (tags, className = "course-card__tags", options = {}) => {
    const labels = (Array.isArray(tags) ? tags : []).map(getTagText).filter(Boolean);
    if (!labels.length) return null;

    const collapsible = options.collapsible !== false;
    const copy = typeof options.copy === "function" ? options.copy : (key, replacements = {}) => {
      const isArabic = document.documentElement.lang.toLowerCase().startsWith("ar");
      const fallbacks = isArabic
        ? {
          showMoreTags: "عرض {count} من الوسوم الإضافية لكورس {title}",
          hideMoreTags: "إخفاء الوسوم الإضافية لكورس {title}",
          closeTags: "إغلاق",
        }
        : {
          showMoreTags: "Show {count} more tags for {title}",
          hideMoreTags: "Hide additional tags for {title}",
          closeTags: "Close",
        };
      let value = fallbacks[key] || key;
      Object.entries(replacements).forEach(([token, replacement]) => {
        value = value.replaceAll(`{${token}}`, String(replacement));
      });
      return value;
    };
    const list = createElement("ul", className);
    const visibleCount = collapsible ? 2 : labels.length;

    labels.slice(0, visibleCount).forEach((label) => {
      const item = createElement("li", "tag", label);
      setAutoDirection(item);
      list.append(item);
    });

    if (collapsible && labels.length > visibleCount) {
      const extraLabels = labels.slice(visibleCount);
      const extraCount = extraLabels.length;
      const courseTitle = textValue(options.title);
      const controlId = textValue(options.controlId) || `course-tags-${Math.random().toString(36).slice(2, 10)}`;
      const extraItems = extraLabels.map((label, index) => {
        const item = createElement("li", "tag tag--extra", label);
        item.id = `${controlId}-${index + 1}`;
        item.hidden = true;
        setAutoDirection(item);
        list.append(item);
        return item;
      });

      const controlItem = createElement("li", "tag-list__control");
      const toggle = createElement("button", "tag tag--count tag__toggle", `+${extraCount}`);
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", extraItems.map((item) => item.id).join(" "));
      toggle.setAttribute("aria-label", copy("showMoreTags", { count: extraCount, title: courseTitle }));
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        const nextExpanded = !expanded;
        extraItems.forEach((item) => {
          item.hidden = !nextExpanded;
        });
        list.classList.toggle("is-expanded", nextExpanded);
        toggle.setAttribute("aria-expanded", String(nextExpanded));
        toggle.setAttribute("aria-label", nextExpanded
          ? copy("hideMoreTags", { title: courseTitle })
          : copy("showMoreTags", { count: extraCount, title: courseTitle }));
        toggle.textContent = nextExpanded ? copy("closeTags") : `+${extraCount}`;
      });
      controlItem.append(toggle);
      list.append(controlItem);
    }

    return list;
  };

  const createCourseCard = (course, courseIndex, siteConfig, copy, openDetails) => {
    const article = createElement("article", "course-card");
    const title = textValue(course.title) || copy("course");
    const slug = getCourseSlug(course, courseIndex);
    article.dataset.course = slug;

    const image = getCourseImage(course);
    const imageSource = safeMediaSource(image.src);
    if (imageSource) {
      const media = createElement("div", "course-card__media");
      const imageElement = document.createElement("img");
      imageElement.className = "course-card__image";
      imageElement.src = imageSource;
      imageElement.alt = image.alt || copy("courseCover", { title });
      imageElement.width = image.width;
      imageElement.height = image.height;
      imageElement.loading = "lazy";
      imageElement.decoding = "async";
      media.append(imageElement);

      const badge = textValue(course.badge);
      if (badge) {
        const badgeElement = createElement("span", "course-card__badge", badge);
        setAutoDirection(badgeElement);
        media.append(badgeElement);
      }

      article.append(media);
    }

    const body = createElement("div", "course-card__body");
    const category = textValue(course.category);
    if (category) {
      const categoryElement = createElement("p", "course-card__category", category);
      setAutoDirection(categoryElement);
      body.append(categoryElement);
    }

    const heading = createElement("h3", "course-card__title", title);
    setAutoDirection(heading);
    body.append(heading);

    const rating = createRatingRow(course.rating, siteConfig, copy);
    if (rating) body.append(rating);

    const tags = createTags(course.tags, "course-card__tags", {
      copy,
      controlId: `course-tags-${courseIndex}`,
      title,
    });
    if (tags) body.append(tags);

    const description = textValue(course.shortDescription);
    if (description) {
      const descriptionElement = createElement("p", "course-card__description", description);
      setAutoDirection(descriptionElement);
      body.append(descriptionElement);
    }

    const metadata = getMetadata(course, copy).filter(({ label }) => label !== copy("instructor"));
    if (metadata.length) {
      const metadataList = createElement("ul", "course-card__meta");
      metadata.slice(0, 3).forEach(({ label, value }) => {
        const item = createElement("li", "metadata-item");
        item.setAttribute("aria-label", `${label}: ${value}`);
        item.textContent = value;
        setAutoDirection(item);
        metadataList.append(item);
      });
      body.append(metadataList);
    }

    const priceText = getPriceText(course, siteConfig, copy);
    const statusText = getStatusText(course, siteConfig, copy);
    if (priceText || statusText) {
      const commercial = createElement(
        "p",
        priceText ? "course-card__price" : "course-card__status",
        priceText || statusText
      );
      setAutoDirection(commercial);
      body.append(commercial);
    }

    const actions = createElement("div", "course-card__actions");
    if (hasCourseDetails(course)) {
      const detailsButton = createElement("button", "button button--secondary course-card__details", copy("details"));
      detailsButton.type = "button";
      detailsButton.setAttribute("aria-label", `${copy("details")}: ${title}`);
      detailsButton.addEventListener("click", () => openDetails(course, detailsButton));
      actions.append(detailsButton);
    }

    const enrollmentHref = safeHref(course.enrollmentUrl || course.detailsUrl || course.url);
    if (enrollmentHref) {
      const ctaText = textValue(course.ctaLabel) || copy("enroll");
      const enrollmentLink = createElement("a", "button course-card__cta", ctaText);
      configureLink(enrollmentLink, enrollmentHref);
      enrollmentLink.setAttribute("aria-label", `${ctaText}: ${title}`);
      actions.append(enrollmentLink);
    }

    if (actions.childElementCount) body.append(actions);
    article.append(body);
    return article;
  };

  const readCourseSlugFromHash = () => {
    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    if (!rawHash) return "";

    try {
      return textValue(new URLSearchParams(rawHash).get(COURSE_HASH_KEY));
    } catch {
      return "";
    }
  };

  const urlWithoutCourseHash = () => {
    const url = new URL(window.location.href);
    const rawHash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    const params = new URLSearchParams(rawHash);
    params.delete(COURSE_HASH_KEY);
    const nextHash = params.toString();
    url.hash = nextHash ? `#${nextHash}` : "";
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const appendTextContent = (container, value, className = "") => {
    const blocks = Array.isArray(value) ? value : [value];
    blocks.map(textValue).filter(Boolean).forEach((block) => {
      const paragraph = createElement("p", className, block);
      setAutoDirection(paragraph);
      container.append(paragraph);
    });
  };

  const appendStructuredListItem = (list, item) => {
    const listItem = createElement("li", "dialog-list__item");

    if (typeof item === "string" || typeof item === "number") {
      listItem.textContent = textValue(item);
      setAutoDirection(listItem);
      list.append(listItem);
      return;
    }

    if (!item || typeof item !== "object") return;
    const title = textValue(item.title || item.name || item.heading);
    const description = textValue(item.description || item.summary);
    if (title) {
      const heading = createElement("strong", "dialog-list__title", title);
      setAutoDirection(heading);
      listItem.append(heading);
    }
    if (description) appendTextContent(listItem, description, "dialog-list__description");

    const children = item.lessons || item.topics || item.items;
    if (Array.isArray(children) && children.length) {
      const nested = createElement("ul", "dialog-list dialog-list--nested");
      children.forEach((child) => appendStructuredListItem(nested, child));
      if (nested.childElementCount) listItem.append(nested);
    }

    if (listItem.childElementCount || textValue(listItem.textContent)) list.append(listItem);
  };

  const appendDialogSection = (container, headingText, content, className) => {
    if (!Array.isArray(content) || !content.length) return;

    const section = createElement("section", `dialog-section ${className || ""}`.trim());
    section.append(createElement("h3", "dialog-section__title", headingText));
    const list = createElement("ul", "dialog-list");
    content.forEach((item) => appendStructuredListItem(list, item));
    if (!list.childElementCount) return;
    section.append(list);
    container.append(section);
  };

  const initCourseDialog = (courses, siteConfig, copy) => {
    const dialog = document.querySelector("#course-dialog");
    const closeButton = document.querySelector("#dialog-close");
    const content = document.querySelector("#dialog-content");
    if (!(dialog instanceof HTMLDialogElement) || !(closeButton instanceof HTMLButtonElement) || !content) {
      return { open: () => {}, refresh: () => {} };
    }

    closeButton.type = "button";
    closeButton.setAttribute("aria-label", copy("closeDialog"));
    content.classList.add("dialog-course", "course-dialog__content");

    const courseMap = new Map();
    courses.forEach((course, index) => courseMap.set(getCourseSlug(course, index), course));

    let activeSlug = "";
    let lastTrigger = null;
    let closingFromUrl = false;
    let previousBodyOverflow = "";
    let scrollLocked = false;

    const lockPageScroll = () => {
      if (scrollLocked) return;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("dialog-open");
      scrollLocked = true;
    };

    const unlockPageScroll = () => {
      if (!scrollLocked) return;
      document.body.style.overflow = previousBodyOverflow;
      document.body.classList.remove("dialog-open");
      scrollLocked = false;
    };

    const renderCourse = (course) => {
      const fragment = document.createDocumentFragment();
      const title = textValue(course.title) || copy("course");
      const header = createElement("header", "dialog-course__header");
      const category = textValue(course.category);
      const badge = textValue(course.badge);

      if (category || badge) {
        const eyebrow = createElement("div", "dialog-course__eyebrow");
        if (category) {
          const categoryElement = createElement("span", "dialog-course__category", category);
          setAutoDirection(categoryElement);
          eyebrow.append(categoryElement);
        }
        if (badge) {
          const badgeElement = createElement("span", "dialog-course__badge", badge);
          setAutoDirection(badgeElement);
          eyebrow.append(badgeElement);
        }
        header.append(eyebrow);
      }

      const titleId = "course-dialog-title";
      const titleElement = createElement("h2", "dialog-course__title", title);
      titleElement.id = titleId;
      setAutoDirection(titleElement);
      header.append(titleElement);
      const rating = createRatingRow(course.rating, siteConfig, copy);
      if (rating) header.append(rating);
      fragment.append(header);
      dialog.setAttribute("aria-labelledby", titleId);

      const image = getCourseImage(course);
      const imageSource = safeMediaSource(image.src);
      if (imageSource) {
        const imageWrapper = createElement("div", "dialog-course__media");
        const imageElement = document.createElement("img");
        imageElement.className = "dialog-course__image";
        imageElement.src = imageSource;
        imageElement.alt = image.alt || copy("courseCover", { title });
        imageElement.width = image.width;
        imageElement.height = image.height;
        imageElement.decoding = "async";
        imageWrapper.append(imageElement);
        fragment.append(imageWrapper);
      }

      const tags = createTags(course.tags, "dialog-course__tags tag-list", { collapsible: false, copy });
      if (tags) fragment.append(tags);

      const fullDescriptionIsPresent = Array.isArray(course.fullDescription)
        ? course.fullDescription.some((item) => textValue(item))
        : Boolean(textValue(course.fullDescription));
      const descriptionValue = fullDescriptionIsPresent ? course.fullDescription : course.shortDescription;
      const hasDescription = Array.isArray(descriptionValue)
        ? descriptionValue.some((item) => textValue(item))
        : Boolean(textValue(descriptionValue));
      if (hasDescription) {
        const section = createElement("section", "dialog-section dialog-course__about");
        section.append(createElement("h3", "dialog-section__title", copy("about")));
        const description = createElement("div", "dialog-course__description");
        appendTextContent(description, descriptionValue);
        section.append(description);
        fragment.append(section);
      }

      const metadata = getMetadata(course, copy);
      if (metadata.length) {
        const list = createElement("dl", "dialog-course__meta dialog-course__metadata dialog-meta");
        metadata.forEach(({ label, value }) => {
          list.append(createElement("dt", "dialog-course__meta-label", label));
          const definition = createElement("dd", "dialog-course__meta-value", value);
          setAutoDirection(definition);
          list.append(definition);
        });
        fragment.append(list);
      }

      appendDialogSection(fragment, copy("learningOutcomes"), course.learningOutcomes, "dialog-course__outcomes");
      appendDialogSection(fragment, copy("curriculum"), course.curriculum, "dialog-course__curriculum");

      const priceText = getPriceText(course, siteConfig, copy);
      const previousPriceText = getPreviousPriceText(course, siteConfig);
      const statusText = getStatusText(course, siteConfig, copy);
      const enrollmentHref = safeHref(course.enrollmentUrl || course.detailsUrl || course.url);
      if (priceText || statusText || enrollmentHref) {
        const actions = createElement("div", "dialog-actions");
        if (priceText || statusText) {
          const commercial = createElement("p", priceText ? "dialog-course__price" : "dialog-course__status");
          if (priceText) {
            const currentPrice = createElement("span", "dialog-course__current-price", priceText);
            commercial.append(currentPrice);
            if (previousPriceText) commercial.append(createElement("del", "dialog-course__previous-price", previousPriceText));
          } else {
            commercial.textContent = statusText;
          }
          setAutoDirection(commercial);
          actions.append(commercial);
        }

        if (enrollmentHref) {
          const ctaText = textValue(course.ctaLabel) || copy("enroll");
          const enrollmentLink = createElement("a", "button dialog-course__cta", ctaText);
          configureLink(enrollmentLink, enrollmentHref);
          enrollmentLink.setAttribute("aria-label", `${ctaText}: ${title}`);
          actions.append(enrollmentLink);
        }
        fragment.append(actions);
      }

      content.replaceChildren(fragment);
    };

    const showCourse = (course, slug) => {
      renderCourse(course);
      activeSlug = slug;
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute("open", "");
        }
      }
      lockPageScroll();
      window.requestAnimationFrame(() => closeButton.focus());
    };

    const closeDialog = (fromUrl = false) => {
      if (!dialog.open) return;
      closingFromUrl = fromUrl;
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };

    const clearCourseFromUrl = () => {
      const state = history.state && typeof history.state === "object" ? history.state : {};
      if (state[APP_STATE_KEY]) {
        history.back();
        return;
      }
      history.replaceState(state, "", urlWithoutCourseHash());
      closeDialog(true);
    };

    const requestClose = () => {
      if (readCourseSlugFromHash()) clearCourseFromUrl();
      else closeDialog(false);
    };

    const syncFromLocation = () => {
      const slug = readCourseSlugFromHash();
      const course = courseMap.get(slug);
      if (course) {
        if (dialog.open && activeSlug === slug) return;
        showCourse(course, slug);
        return;
      }

      if (dialog.open) closeDialog(true);
    };

    const open = (course, trigger) => {
      const courseIndex = courses.indexOf(course);
      const slug = getCourseSlug(course, courseIndex < 0 ? 0 : courseIndex);
      lastTrigger = trigger instanceof HTMLElement ? trigger : null;

      if (readCourseSlugFromHash() === slug) {
        showCourse(course, slug);
        return;
      }

      const previousState = history.state && typeof history.state === "object" ? history.state : {};
      const nextState = { ...previousState, [APP_STATE_KEY]: true };
      const params = new URLSearchParams();
      params.set(COURSE_HASH_KEY, slug);
      history.pushState(nextState, "", `#${params.toString()}`);
      syncFromLocation();
    };

    closeButton.addEventListener("click", requestClose);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestClose();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      requestClose();
    });
    dialog.addEventListener("close", () => {
      const wasClosingFromUrl = closingFromUrl;
      closingFromUrl = false;
      activeSlug = "";
      unlockPageScroll();
      if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
      if (!wasClosingFromUrl && readCourseSlugFromHash()) clearCourseFromUrl();
    });

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const inside = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom;
      if (!inside) requestClose();
    });

    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    syncFromLocation();

    const refresh = () => {
      closeButton.setAttribute("aria-label", copy("closeDialog"));
      const course = courseMap.get(readCourseSlugFromHash());
      if (dialog.open && course) renderCourse(course);
    };

    return { open, refresh };
  };

  const initCatalog = (courses, siteConfig, copy, openDetails) => {
    const filterContainer = document.querySelector("#filter-buttons");
    const searchInput = document.querySelector("#course-search");
    const clearButton = document.querySelector("#search-clear");
    const resultsCount = document.querySelector("#results-count");
    const grid = document.querySelector("#course-grid");
    const emptyState = document.querySelector("#empty-state");
    const emptyReset = document.querySelector("#empty-reset");
    if (!grid) return { update: () => {} };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const footerCategories = document.querySelector("#footer-categories");
    let currentCourses = courses;
    let currentSiteConfig = siteConfig;
    let currentCopy = copy;
    let currentOpenDetails = openDetails;
    let indexedCourses = [];
    let categories = [];
    let activeCategory = "";
    let query = "";
    let filterButtons = [];

    const updateFilterButtons = () => {
      filterButtons.forEach((button) => {
        const isActive = button.dataset.category === activeCategory;
        button.setAttribute("aria-pressed", String(isActive));
        button.classList.toggle("is-active", isActive);
      });
    };

    const updateClearButton = () => {
      if (!(clearButton instanceof HTMLButtonElement)) return;
      const hasQuery = Boolean(query);
      clearButton.hidden = !hasQuery;
      clearButton.disabled = !hasQuery;
    };

    const resultText = (count) => currentCopy("results", { count });

    const render = () => {
      const normalizedQuery = normalizeSearchText(query);
      const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
      const matches = indexedCourses.filter(({ course, searchText }) => {
        const matchesCategory = !activeCategory || textValue(course.category) === activeCategory;
        const matchesSearch = !tokens.length || tokens.every((token) => searchText.includes(token));
        return matchesCategory && matchesSearch;
      });

      if (!reducedMotion.matches) grid.classList.add("is-updating");
      const fragment = document.createDocumentFragment();
      matches.forEach(({ course, index }) => {
        fragment.append(createCourseCard(course, index, currentSiteConfig, currentCopy, currentOpenDetails));
      });
      grid.replaceChildren(fragment);
      if (!reducedMotion.matches) {
        window.requestAnimationFrame(() => grid.classList.remove("is-updating"));
      }

      if (resultsCount) resultsCount.textContent = resultText(matches.length);
      if (emptyState) emptyState.hidden = matches.length !== 0;
      grid.hidden = matches.length === 0;
      updateFilterButtons();
      updateClearButton();
    };

    const reset = (focusSearch = false) => {
      activeCategory = "";
      query = "";
      if (searchInput instanceof HTMLInputElement) searchInput.value = "";
      render();
      if (focusSearch && searchInput instanceof HTMLInputElement) searchInput.focus();
    };

    const renderControls = () => {
      filterButtons = [];
      if (filterContainer) {
        filterContainer.replaceChildren();
        const options = [{ value: "", label: currentCopy("allCourses") }, ...categories.map((category) => ({
          value: category,
          label: category,
        }))];
        options.forEach(({ value, label }) => {
          const button = createElement("button", "filter-button", label);
          button.type = "button";
          button.dataset.category = value;
          button.setAttribute("aria-pressed", String(value === activeCategory));
          setAutoDirection(button);
          button.addEventListener("click", () => {
            activeCategory = value;
            render();
          });
          filterButtons.push(button);
          filterContainer.append(button);
        });
      }

      if (!footerCategories) return;
      footerCategories.replaceChildren();
      categories.forEach((category) => {
        const item = document.createElement("li");
        const link = createElement("a", "footer-category-link", category);
        link.href = "#courses";
        setAutoDirection(link);
        link.addEventListener("click", () => {
          activeCategory = category;
          query = "";
          if (searchInput instanceof HTMLInputElement) searchInput.value = "";
          render();
        });
        item.append(link);
        footerCategories.append(item);
      });
      const column = footerCategories.closest(".footer-column");
      if (column) column.hidden = categories.length === 0;
    };

    const applyCatalogCopy = () => {
      const catalog = currentSiteConfig.catalog && typeof currentSiteConfig.catalog === "object"
        ? currentSiteConfig.catalog
        : {};
      if (searchInput instanceof HTMLInputElement) {
        const placeholder = textValue(catalog.searchPlaceholder);
        const searchLabel = textValue(catalog.searchLabel);
        if (placeholder) searchInput.placeholder = placeholder;
        if (searchLabel) {
          searchInput.setAttribute("aria-label", searchLabel);
          const visibleLabel = document.querySelector(`label[for="${searchInput.id}"]`);
          if (visibleLabel) visibleLabel.textContent = searchLabel;
        }
      }
      if (clearButton instanceof HTMLButtonElement && textValue(catalog.clearSearchLabel)) {
        clearButton.setAttribute("aria-label", textValue(catalog.clearSearchLabel));
      }
      if (emptyState) {
        const title = emptyState.querySelector("h3");
        const description = emptyState.querySelector("p");
        if (title && textValue(catalog.emptyTitle)) title.textContent = textValue(catalog.emptyTitle);
        if (description && textValue(catalog.emptyDescription)) description.textContent = textValue(catalog.emptyDescription);
      }
      if (emptyReset instanceof HTMLButtonElement && textValue(catalog.resetFiltersLabel)) {
        emptyReset.textContent = textValue(catalog.resetFiltersLabel);
      }
    };

    const update = (nextCourses, nextSiteConfig, nextCopy, nextOpenDetails = currentOpenDetails) => {
      currentCourses = nextCourses;
      currentSiteConfig = nextSiteConfig;
      currentCopy = nextCopy;
      currentOpenDetails = nextOpenDetails;
      indexedCourses = currentCourses.map((course, index) => ({
        course,
        index,
        searchText: courseSearchText(course),
      }));
      categories = [];
      const seenCategories = new Set();
      indexedCourses.forEach(({ course }) => {
        const category = textValue(course.category);
        if (category && !seenCategories.has(category)) {
          seenCategories.add(category);
          categories.push(category);
        }
      });
      activeCategory = "";
      query = "";
      if (searchInput instanceof HTMLInputElement) searchInput.value = "";
      applyCatalogCopy();
      renderControls();
      render();
    };

    if (searchInput instanceof HTMLInputElement) {
      searchInput.addEventListener("input", () => {
        query = searchInput.value;
        render();
      });
    }

    if (clearButton instanceof HTMLButtonElement) {
      clearButton.type = "button";
      clearButton.addEventListener("click", () => {
        query = "";
        if (searchInput instanceof HTMLInputElement) {
          searchInput.value = "";
          searchInput.focus();
        }
        render();
      });
    }

    if (emptyReset instanceof HTMLButtonElement) {
      emptyReset.type = "button";
      emptyReset.addEventListener("click", () => reset(true));
    }

    update(courses, siteConfig, copy, openDetails);
    return { update };
  };

  const renderPaymentMethods = (siteConfig) => {
    const container = document.querySelector("#payment-methods");
    if (!container) return;

    const payment = siteConfig.payment && typeof siteConfig.payment === "object"
      ? siteConfig.payment
      : {};
    const methodsSource = Array.isArray(siteConfig.paymentMethods) ? siteConfig.paymentMethods : payment.methods;
    const methods = Array.isArray(methodsSource)
      ? methodsSource.filter((method) => method && typeof method === "object" && textValue(method.name))
      : [];
    const section = container.closest("section");

    if (!methods.length) {
      container.replaceChildren();
      if (section) section.hidden = true;
      return;
    }

    if (section) section.hidden = false;
    const eyebrow = section && section.querySelector(".payment-copy .eyebrow");
    const heading = section && section.querySelector(".payment-copy h2");
    const description = section && section.querySelector(".payment-copy > p:not(.eyebrow)");
    if (eyebrow && textValue(payment.eyebrow)) eyebrow.textContent = textValue(payment.eyebrow);
    if (heading && textValue(payment.title)) heading.textContent = textValue(payment.title);
    if (description && textValue(payment.description)) description.textContent = textValue(payment.description);

    const paymentContact = section && section.querySelector(".payment-copy a[href]");
    const whatsapp = siteConfig.contact && siteConfig.contact.whatsapp;
    if (paymentContact instanceof HTMLAnchorElement && safeHref(whatsapp)) {
      configureLink(paymentContact, whatsapp);
      const contactLabel = textValue(payment.contactLabel);
      if (contactLabel) {
        const decorativeArrow = paymentContact.querySelector("[aria-hidden='true']");
        paymentContact.replaceChildren(document.createTextNode(`${contactLabel} `));
        if (decorativeArrow) paymentContact.append(decorativeArrow);
      }
    }

    const fragment = document.createDocumentFragment();
    methods.forEach((method) => {
      const name = textValue(method.name);
      const card = createElement("article", "payment-method");
      const image = method.image && typeof method.image === "object" ? method.image : {};
      const imageSource = safeMediaSource(image.src || method.image);
      if (imageSource) {
        const imageElement = document.createElement("img");
        const width = Number(image.width);
        const height = Number(image.height);
        imageElement.className = "payment-method__image";
        imageElement.src = imageSource;
        imageElement.alt = textValue(method.imageAlt || image.alt) || name;
        imageElement.width = Number.isFinite(width) && width > 0 ? Math.round(width) : 720;
        imageElement.height = Number.isFinite(height) && height > 0 ? Math.round(height) : 420;
        imageElement.loading = "lazy";
        imageElement.decoding = "async";
        card.append(imageElement);
      }
      const body = createElement("div", "payment-method__body");
      const title = createElement("h3", "", name);
      setAutoDirection(title);
      body.append(title);
      const methodDescription = textValue(method.description);
      if (methodDescription) {
        const paragraph = createElement("p", "", methodDescription);
        setAutoDirection(paragraph);
        body.append(paragraph);
      }
      card.append(body);
      fragment.append(card);
    });
    container.replaceChildren(fragment);
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

  const renderStructuredData = (siteConfig, courses) => {
    const script = document.querySelector("#structured-data");
    if (!(script instanceof HTMLScriptElement)) return;

    const configuredSiteUrl = absoluteHttpUrl(siteConfig.siteUrl);
    const siteUrl = configuredSiteUrl || absoluteHttpUrl(window.location.href);
    const brandName = textValue(siteConfig.brandName);
    if (!siteUrl || !brandName) {
      script.textContent = "";
      return;
    }

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
      const image = getCourseImage(course);
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

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  };

  const initFaq = (siteConfig) => {
    const list = document.querySelector("#faq-list");
    if (!list) return;

    const configuredFaqs = Array.isArray(siteConfig.faqs)
      ? siteConfig.faqs
      : (siteConfig.faq && Array.isArray(siteConfig.faq.items) ? siteConfig.faq.items : []);
    const faqs = configuredFaqs.filter((faq) => {
      if (!faq || typeof faq !== "object") return false;
      return Boolean(textValue(faq.question || faq.q) && (textValue(faq.answer || faq.a) || isNonEmptyArray(faq.answer || faq.a)));
    });
    const section = list.closest("section");

    if (!faqs.length) {
      list.replaceChildren();
      if (section) section.hidden = true;
      return;
    }

    if (section) section.hidden = false;
    list.replaceChildren();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const entries = [];

    const finishClosingEntry = (entry) => {
      if (entry.button.getAttribute("aria-expanded") !== "false") return;
      entry.panel.hidden = true;
      entry.panel.style.maxHeight = "0px";
      entry.closeTimer = 0;
    };

    const closeEntry = (entry, immediate = reducedMotion.matches) => {
      if (entry.closeTimer) window.clearTimeout(entry.closeTimer);
      entry.button.setAttribute("aria-expanded", "false");
      entry.item.classList.remove("is-open");
      if (immediate) {
        finishClosingEntry(entry);
        return;
      }

      entry.panel.style.maxHeight = `${entry.panel.scrollHeight}px`;
      void entry.panel.offsetHeight;
      window.requestAnimationFrame(() => {
        entry.panel.style.maxHeight = "0px";
      });
      entry.closeTimer = window.setTimeout(() => finishClosingEntry(entry), 320);
    };

    const openEntry = (entry) => {
      entries.forEach((candidate) => {
        if (candidate !== entry && candidate.button.getAttribute("aria-expanded") === "true") {
          closeEntry(candidate);
        }
      });

      if (entry.closeTimer) {
        window.clearTimeout(entry.closeTimer);
        entry.closeTimer = 0;
      }
      entry.panel.hidden = false;
      entry.panel.style.maxHeight = "0px";
      void entry.panel.offsetHeight;
      entry.button.setAttribute("aria-expanded", "true");
      entry.item.classList.add("is-open");
      if (reducedMotion.matches) {
        entry.panel.style.maxHeight = "none";
      } else {
        window.requestAnimationFrame(() => {
          if (entry.button.getAttribute("aria-expanded") === "true") {
            entry.panel.style.maxHeight = `${entry.panel.scrollHeight}px`;
          }
        });
      }
    };

    faqs.forEach((faq, index) => {
      const question = textValue(faq.question || faq.q);
      const answer = faq.answer || faq.a;
      const item = createElement("article", "faq-item");
      const heading = createElement("h3", "faq-item__heading");
      const button = createElement("button", "faq-question");
      const panel = createElement("div", "faq-answer");
      const buttonId = `faq-question-${index + 1}`;
      const panelId = `faq-answer-${index + 1}`;

      button.type = "button";
      button.id = buttonId;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      const questionText = createElement("span", "faq-question__text", question);
      setAutoDirection(questionText);
      const icon = createElement("span", "faq-question__icon", "+");
      icon.setAttribute("aria-hidden", "true");
      button.append(questionText, icon);
      heading.append(button);

      panel.id = panelId;
      panel.hidden = true;
      panel.style.maxHeight = "0px";
      panel.style.overflow = "hidden";
      panel.style.transition = reducedMotion.matches ? "none" : "max-height 280ms ease";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", buttonId);
      const answerContent = createElement("div", "faq-answer__content");
      appendTextContent(answerContent, answer);
      panel.append(answerContent);
      item.append(heading, panel);

      const entry = { item, button, panel, closeTimer: 0 };
      entries.push(entry);
      button.addEventListener("click", () => {
        if (button.getAttribute("aria-expanded") === "true") closeEntry(entry);
        else openEntry(entry);
      });
      list.append(item);
    });

    window.addEventListener("resize", () => {
      entries.forEach((entry) => {
        if (entry.button.getAttribute("aria-expanded") === "true" && !reducedMotion.matches) {
          entry.panel.style.maxHeight = `${entry.panel.scrollHeight}px`;
        }
      });
    }, { passive: true });
  };

  const initActiveNavigation = () => {
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

    const setActive = (id) => {
      links.forEach(({ link, id: linkId }) => {
        const isActive = linkId === id;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    links.forEach(({ link, id }) => link.addEventListener("click", () => setActive(id)));

    const chooseByScrollPosition = () => {
      const threshold = Math.max(100, window.innerHeight * 0.3);
      let selected = links[0].id;
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

  const init = () => {
    if (document.documentElement.dataset.mtAcademyAppReady === "true") return;
    document.documentElement.dataset.mtAcademyAppReady = "true";

    const source = window.MTAcademyData && typeof window.MTAcademyData === "object"
      ? window.MTAcademyData
      : {};
    const rawSiteConfig = source.siteConfig && typeof source.siteConfig === "object"
      ? source.siteConfig
      : {};
    const rawCourses = Array.isArray(source.courses)
      ? source.courses.filter((course) => course && typeof course === "object")
      : [];
    const supportedLocales = getSupportedLocales(rawSiteConfig);
    const fallbackLocale = textValue(rawSiteConfig.defaultLocale || rawSiteConfig.locale || "ar").toLowerCase();
    const siteConfig = {};
    const courses = rawCourses.map(() => ({}));
    let currentLocale = getInitialLocale(rawSiteConfig);
    let copyImplementation = () => "";
    const copy = (key, replacements) => copyImplementation(key, replacements);
    let mobileController = { update: () => {} };
    let dialogController = { open: () => {}, refresh: () => {} };
    let catalogController = { update: () => {} };
    let languageController = { update: () => {} };
    const isErrorPage = document.body.dataset.page === "404";

    const hydrateLocale = (locale) => {
      replaceObjectContents(siteConfig, resolveSiteConfig(rawSiteConfig, locale));
      rawCourses.forEach((course, index) => {
        replaceObjectContents(courses[index], resolveCourse(course, locale, fallbackLocale));
      });
      copyImplementation = createCopy(siteConfig);
    };

    const renderLocale = (initialRender = false) => {
      applySiteConfiguration(siteConfig);
      applyAccessibleLabels(siteConfig);
      languageController.update(currentLocale, siteConfig);
      if (isErrorPage) return;

      renderHeroTopics(siteConfig);
      if (initialRender) {
        mobileController = initMobileNavigation(siteConfig);
        dialogController = initCourseDialog(courses, siteConfig, copy);
        catalogController = initCatalog(courses, siteConfig, copy, dialogController.open);
      } else {
        mobileController.update(siteConfig);
        catalogController.update(courses, siteConfig, copy, dialogController.open);
        dialogController.refresh();
      }
      initFaq(siteConfig);
      renderPaymentMethods(siteConfig);
      renderStructuredData(siteConfig, courses);
    };

    const selectLocale = (locale) => {
      const supportedCodes = supportedLocales.map(localeCode);
      if (!supportedCodes.includes(locale) || locale === currentLocale) return;
      currentLocale = locale;
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      } catch {
        // The preference remains active for this page even without storage.
      }
      const url = new URL(window.location.href);
      url.searchParams.set("lang", locale);
      history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
      hydrateLocale(locale);
      renderLocale(false);
    };

    hydrateLocale(currentLocale);
    languageController = initLanguageSwitching(supportedLocales, selectLocale);
    renderLocale(true);

    if (!isErrorPage) {
      initActiveNavigation();
      initTopLinks();
    }
  };

  onReady(init);
})();
