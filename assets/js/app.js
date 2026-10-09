(() => {
  "use strict";

  const APP_STATE_KEY = "__mtAcademyCourseDialog";
  const COURSE_HASH_KEY = "course";
  const {
    lockPageScroll, unlockPageScroll, onReady, textValue,
    getByPath, firstValue, createElement, setAutoDirection, getValidRating, buildCatalogSchema,
    isNonEmptyArray, localeCode, getSupportedLocales, findLocaleDescriptor,
    localizedObject, getInitialLocale, safeMediaSource, safeHref,
    isExternalHttpLink, configureLink, applySiteConfiguration, applyAccessibleLabels,
    initLanguageSwitching, initMobileNavigation, absoluteHttpUrl, initActiveNavigation,
    initTopLinks, initPathNavigation, initMotionSystem, initHeaderMotion, motionDuration, saveLocale, renderKidsOffering, renderLearningPaths,
  } = window.MTAcademyCore;
  let motionController = {
    observeElements: () => {},
    refresh: () => {},
  };

  const getTagText = (tag) => {
    if (typeof tag === "string" || typeof tag === "number") return textValue(tag);
    if (!tag || typeof tag !== "object") return "";
    return textValue(tag.label || tag.name || tag.title);
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

  const resolvePromotionCopy = (promotionCopy, promotionConfig, locale) => {
    const copy = promotionCopy && typeof promotionCopy === "object" ? promotionCopy : {};
    const discountPercent = Number(promotionConfig && promotionConfig.discountPercent);
    const endTimestamp = Date.parse(textValue(promotionConfig && promotionConfig.endsAt));
    const timeZone = textValue(promotionConfig && promotionConfig.timeZone) || "UTC";
    let discount = Number.isFinite(discountPercent) ? String(discountPercent) : "";
    let endDate = "";

    try {
      if (Number.isFinite(discountPercent)) {
        discount = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(discountPercent);
      }
      if (Number.isFinite(endTimestamp)) {
        endDate = new Intl.DateTimeFormat(locale, {
          dateStyle: "long",
          timeZone,
        }).format(new Date(endTimestamp - 1));
      }
    } catch {
      if (Number.isFinite(endTimestamp)) endDate = new Date(endTimestamp - 1).toISOString().slice(0, 10);
    }

    return Object.fromEntries(Object.entries(copy).map(([key, value]) => [
      key,
      typeof value === "string"
        ? value.replaceAll("{discount}", discount).replaceAll("{endDate}", endDate)
        : value,
    ]));
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
    const rawPromotion = rawSiteConfig.promotion && typeof rawSiteConfig.promotion === "object"
      ? rawSiteConfig.promotion
      : {};
    const promotionCopy = resolvePromotionCopy(translation.promotion, rawPromotion, locale);

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
      promotion: {
        ...rawPromotion,
        ...promotionCopy,
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

  const renderHeroTopics = (siteConfig) => {
    const container = document.querySelector("[data-hero-topics]");
    if (!container) return;
    const topics = siteConfig.hero && Array.isArray(siteConfig.hero.topics)
      ? siteConfig.hero.topics.map(textValue).filter(Boolean)
      : [];
    const fragment = document.createDocumentFragment();
    topics.forEach((topic, index) => {
      const element = createElement("span", "", topic);
      element.style.setProperty("--hero-topic-index", String(index));
      setAutoDirection(element);
      fragment.append(element);
    });
    container.replaceChildren(fragment);
    const label = textValue(siteConfig.interface && siteConfig.interface.heroTopicsLabel);
    if (label) container.setAttribute("aria-label", label);
    container.hidden = topics.length === 0;
  };

  const parsePromotionTimestamp = (value) => {
    const timestamp = textValue(value);
    if (!timestamp || !/(?:z|[+-]\d{2}:\d{2})$/i.test(timestamp)) return Number.NaN;
    return Date.parse(timestamp);
  };

  const getPromotionState = (promotion, now = Date.now()) => {
    const config = promotion && typeof promotion === "object" ? promotion : {};
    const nowTimestamp = Number(now);
    const startTimestamp = parsePromotionTimestamp(config.startsAt);
    const endTimestamp = parsePromotionTimestamp(config.endsAt);
    const discountPercent = Number(config.discountPercent);
    const baseState = {
      state: "invalid",
      startTimestamp,
      endTimestamp,
      nowTimestamp,
      remainingMilliseconds: 0,
      millisecondsUntilStart: 0,
      millisecondsUntilEnd: 0,
      discountPercent,
    };

    if (config.enabled !== true) return { ...baseState, state: "disabled" };
    if (!Number.isFinite(nowTimestamp)
      || !Number.isFinite(startTimestamp)
      || !Number.isFinite(endTimestamp)
      || endTimestamp <= startTimestamp
      || !Number.isFinite(discountPercent)
      || discountPercent <= 0) {
      return baseState;
    }

    if (nowTimestamp < startTimestamp) {
      const millisecondsUntilStart = startTimestamp - nowTimestamp;
      return {
        ...baseState,
        state: "upcoming",
        remainingMilliseconds: millisecondsUntilStart,
        millisecondsUntilStart,
        millisecondsUntilEnd: endTimestamp - nowTimestamp,
      };
    }

    if (nowTimestamp >= endTimestamp) return { ...baseState, state: "expired" };

    const millisecondsUntilEnd = endTimestamp - nowTimestamp;
    return {
      ...baseState,
      state: "active",
      remainingMilliseconds: millisecondsUntilEnd,
      millisecondsUntilEnd,
    };
  };

  try {
    Object.defineProperty(window, "MTAcademyPromotion", {
      configurable: true,
      value: Object.freeze({ getState: getPromotionState }),
      writable: false,
    });
  } catch {
    // The campaign remains functional if a host page reserves this test hook.
  }

  const initPromotion = (initialConfig) => {
    const root = document.documentElement;
    const panel = document.querySelector("[data-promotion]");
    const flag = document.querySelector("[data-promotion-flag]");
    const dialog = document.querySelector("#promotion-dialog");
    const dialogClose = document.querySelector("#promotion-dialog-close");
    const dialogCta = document.querySelector("#promotion-dialog-cta");
    const status = document.querySelector("[data-promotion-status]");
    const countdowns = [...document.querySelectorAll("[data-promotion-countdown]")];
    const discounts = [...document.querySelectorAll("[data-promotion-discount]")];
    const values = Object.fromEntries(["days", "hours", "minutes", "seconds"].map((unit) => [
      unit,
      [...document.querySelectorAll(`[data-countdown-value="${unit}"]`)],
    ]));

    if (!panel
      || !(flag instanceof HTMLButtonElement)
      || !(dialog instanceof HTMLDialogElement)
      || !(dialogClose instanceof HTMLButtonElement)
      || !(dialogCta instanceof HTMLAnchorElement)
      || !countdowns.length
      || Object.values(values).some((elements) => !elements.length)) {
      root.removeAttribute("data-promotion-active");
      if (panel) panel.hidden = true;
      if (flag instanceof HTMLElement) flag.hidden = true;
      if (dialog instanceof HTMLElement) dialog.hidden = true;
      return { update: () => {} };
    }

    const MAX_TIMEOUT_DELAY = 2147483647;
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dialogs = [...document.querySelectorAll("dialog")];
    const memorySeenCampaigns = new Set();
    let promotion = {};
    let promotionState = getPromotionState(promotion);
    let intervalId = null;
    let boundaryTimeoutId = null;
    let autoOpenTimeoutId = null;
    let closeTimeoutId = null;
    let openFrameId = null;
    let isActive = false;
    let autoOpenAttemptedId = "";
    let focusReturnTarget = null;
    let restoreFocusAfterClose = true;
    let numberFormatter = new Intl.NumberFormat("en", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const clearIntervalTimer = () => {
      if (intervalId === null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    };

    const clearBoundaryTimer = () => {
      if (boundaryTimeoutId === null) return;
      window.clearTimeout(boundaryTimeoutId);
      boundaryTimeoutId = null;
    };

    const clearAutoOpenTimer = () => {
      if (autoOpenTimeoutId === null) return;
      window.clearTimeout(autoOpenTimeoutId);
      autoOpenTimeoutId = null;
    };

    const clearDialogTimers = () => {
      if (closeTimeoutId !== null) window.clearTimeout(closeTimeoutId);
      if (openFrameId !== null) window.cancelAnimationFrame(openFrameId);
      closeTimeoutId = null;
      openFrameId = null;
    };

    const removePromotionBadges = () => {
      document.querySelectorAll("[data-promotion-course-badge]").forEach((badge) => {
        const container = badge.parentElement;
        badge.remove();
        if (container
          && (container.classList.contains("course-card__badges")
            || container.classList.contains("dialog-course__eyebrow"))
          && !container.childElementCount) {
          container.remove();
        }
      });
    };

    const formatValue = (value) => {
      try {
        return numberFormatter.format(value);
      } catch {
        return String(value).padStart(2, "0");
      }
    };

    const renderRemainingTime = (remainingMilliseconds) => {
      const totalSeconds = Math.max(1, Math.ceil(remainingMilliseconds / SECOND));
      const remaining = {
        days: Math.floor(totalSeconds / (DAY / SECOND)),
        hours: Math.floor((totalSeconds % (DAY / SECOND)) / (HOUR / SECOND)),
        minutes: Math.floor((totalSeconds % (HOUR / SECOND)) / (MINUTE / SECOND)),
        seconds: totalSeconds % (MINUTE / SECOND),
      };

      Object.entries(remaining).forEach(([unit, value]) => {
        values[unit].forEach((element) => {
          element.textContent = formatValue(value);
        });
      });
    };

    const clearCountdowns = () => {
      Object.values(values).flat().forEach((element) => {
        element.textContent = "";
      });
      countdowns.forEach((countdown) => countdown.removeAttribute("datetime"));
    };

    const sessionKey = () => {
      const id = textValue(promotion.id);
      return id ? `mt-academy-promotion-${id}-seen` : "";
    };

    const wasSeenThisSession = () => {
      const key = sessionKey();
      if (!key) return true;
      if (memorySeenCampaigns.has(key)) return true;
      try {
        return window.sessionStorage.getItem(key) === "true";
      } catch {
        return false;
      }
    };

    const markSeenThisSession = () => {
      const key = sessionKey();
      if (!key) return;
      memorySeenCampaigns.add(key);
      clearAutoOpenTimer();
      try {
        window.sessionStorage.setItem(key, "true");
      } catch {
        // The in-memory marker still prevents another automatic opening on this page.
      }
    };

    const anotherDialogIsOpen = () => dialogs.some((candidate) => candidate !== dialog && candidate.open);
    const mobileNavigationIsOpen = () => document.body.classList.contains("mobile-nav-open")
      || document.querySelector("#mobile-menu-toggle")?.getAttribute("aria-expanded") === "true";
    const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

    const finishDialogClose = () => {
      closeTimeoutId = null;
      if (dialog.open) dialog.close();
    };

    const closePopup = (immediate = reducedMotion.matches, restoreFocus = true) => {
      if (!dialog.open) return;
      restoreFocusAfterClose = restoreFocus;
      dialog.inert = true;
      dialog.classList.remove("is-visible");
      dialog.classList.add("is-closing");
      if (closeTimeoutId !== null) window.clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
      if (immediate) finishDialogClose();
      else closeTimeoutId = window.setTimeout(finishDialogClose, motionDuration());
    };

    const openPopup = (trigger = null, automatic = false) => {
      const current = getPromotionState(promotion);
      if (current.state !== "active" || anotherDialogIsOpen() || mobileNavigationIsOpen()) return false;
      clearDialogTimers();
      focusReturnTarget = trigger instanceof HTMLElement
        ? trigger
        : (document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement
          : null);
      restoreFocusAfterClose = true;
      dialog.hidden = false;
      dialog.inert = false;
      dialog.removeAttribute("aria-hidden");
      try {
        dialog.showModal();
      } catch {
        return false;
      }
      markSeenThisSession();
      document.body.classList.add("promotion-dialog-open");
      lockPageScroll("promotion-dialog");
      void dialog.offsetHeight;
      openFrameId = window.requestAnimationFrame(() => {
        openFrameId = null;
        if (!dialog.open || !isActive) return;
        dialog.classList.add("is-visible");
        if (!automatic || document.activeElement === document.body) dialogClose.focus({ preventScroll: true });
      });
      return true;
    };

    const scheduleAutomaticOpen = () => {
      const id = textValue(promotion.id);
      const delay = Number(promotion.autoOpenDelay);
      if (!id
        || autoOpenTimeoutId !== null
        || autoOpenAttemptedId === id
        || wasSeenThisSession()
        || !Number.isFinite(delay)
        || delay < 0) return;

      autoOpenTimeoutId = window.setTimeout(() => {
        autoOpenTimeoutId = null;
        if (document.hidden) return;
        autoOpenAttemptedId = id;
        if (promotionState.state === "active") openPopup(null, true);
      }, delay);
    };

    const publishStateChange = (previousState) => {
      if (previousState === promotionState.state) return;
      document.dispatchEvent(new CustomEvent("mt:promotion-statechange", {
        detail: { previousState, state: promotionState.state },
      }));
    };

    const scheduleBoundary = () => {
      clearBoundaryTimer();
      const delay = promotionState.state === "upcoming"
        ? promotionState.millisecondsUntilStart
        : promotionState.millisecondsUntilEnd;
      if (!Number.isFinite(delay) || delay <= 0) return;
      boundaryTimeoutId = window.setTimeout(() => {
        boundaryTimeoutId = null;
        reconcilePromotionState();
      }, Math.min(delay, MAX_TIMEOUT_DELAY));
    };

    const updateCountdown = () => {
      const current = getPromotionState(promotion);
      if (current.state !== "active") {
        reconcilePromotionState();
        return;
      }
      promotionState = current;
      renderRemainingTime(current.remainingMilliseconds);
    };

    const startInterval = () => {
      if (intervalId !== null) return;
      intervalId = window.setInterval(updateCountdown, SECOND);
    };

    const showActivePromotion = () => {
      isActive = true;
      root.dataset.promotionActive = "true";
      panel.hidden = false;
      flag.hidden = false;
      dialog.hidden = false;
      if (!dialog.open) dialog.inert = false;
      dialog.removeAttribute("aria-hidden");
      countdowns.forEach((countdown) => {
        countdown.setAttribute("datetime", textValue(promotion.endsAt));
      });
      renderRemainingTime(promotionState.remainingMilliseconds);
      startInterval();
      scheduleBoundary();
      scheduleAutomaticOpen();
    };

    const hidePromotion = (announceExpiration = false) => {
      const wasActive = isActive;
      isActive = false;
      clearIntervalTimer();
      clearBoundaryTimer();
      clearAutoOpenTimer();
      if (dialog.open) closePopup(true, false);
      clearDialogTimers();
      panel.hidden = true;
      flag.hidden = true;
      dialog.hidden = true;
      dialog.inert = true;
      dialog.setAttribute("aria-hidden", "true");
      root.removeAttribute("data-promotion-active");
      removePromotionBadges();
      clearCountdowns();

      if (status && announceExpiration && wasActive) {
        status.textContent = textValue(promotion.expirationMessage);
      }
    };

    function reconcilePromotionState() {
      const previousState = promotionState.state;
      promotionState = getPromotionState(promotion);

      if (promotionState.state === "active") {
        if (status && previousState !== "upcoming") status.textContent = "";
        showActivePromotion();
        if (status && previousState === "upcoming") {
          status.textContent = textValue(promotion.activationMessage);
        }
      } else {
        hidePromotion(promotionState.state === "expired");
        if (promotionState.state === "upcoming") scheduleBoundary();
      }

      publishStateChange(previousState);
    }

    const update = (siteConfig) => {
      const nextPromotion = siteConfig.promotion && typeof siteConfig.promotion === "object"
        ? siteConfig.promotion
        : {};
      const previousId = textValue(promotion.id);
      promotion = nextPromotion;
      const locale = textValue(siteConfig.locale || siteConfig.language || "en");
      const discountPercent = Number(promotion.discountPercent);

      try {
        numberFormatter = new Intl.NumberFormat(locale, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      } catch {
        numberFormatter = new Intl.NumberFormat("en", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      }

      discounts.forEach((element) => {
        element.textContent = Number.isFinite(discountPercent) ? `${discountPercent}%` : "";
      });
      dialogClose.setAttribute("aria-label", textValue(promotion.closeLabel));
      flag.setAttribute("aria-label", textValue(promotion.floatingOpenLabel));

      if (previousId && previousId !== textValue(promotion.id)) {
        autoOpenAttemptedId = "";
        clearAutoOpenTimer();
        if (dialog.open) closePopup(true, false);
      }

      reconcilePromotionState();
    };

    flag.addEventListener("click", () => openPopup(flag, false));
    dialogClose.addEventListener("click", () => closePopup());
    dialogCta.addEventListener("click", () => closePopup(true, false));
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closePopup();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll(focusableSelector)]
        .filter((element) => element instanceof HTMLElement && !element.hidden && !element.inert);
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
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const inside = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom;
      if (!inside) closePopup();
    });
    dialog.addEventListener("close", () => {
      clearDialogTimers();
      dialog.classList.remove("is-visible", "is-closing");
      document.body.classList.remove("promotion-dialog-open");
      unlockPageScroll("promotion-dialog");
      dialog.hidden = !isActive;
      dialog.inert = !isActive;
      if (isActive) dialog.removeAttribute("aria-hidden");
      else dialog.setAttribute("aria-hidden", "true");
      if (restoreFocusAfterClose && focusReturnTarget && focusReturnTarget.isConnected && !focusReturnTarget.hidden) {
        focusReturnTarget.focus({ preventScroll: true });
      }
      focusReturnTarget = null;
      restoreFocusAfterClose = true;
    });

    const reconcileWhenAvailable = () => {
      if (!document.hidden) reconcilePromotionState();
    };
    const closeForCourseNavigation = () => {
      if (!dialog.open) return;
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      if (params.has(COURSE_HASH_KEY)) closePopup(true, false);
    };

    document.addEventListener("visibilitychange", reconcileWhenAvailable);
    window.addEventListener("pageshow", reconcileWhenAvailable);
    window.addEventListener("focus", reconcileWhenAvailable);
    window.addEventListener("hashchange", closeForCourseNavigation);
    window.addEventListener("popstate", closeForCourseNavigation);

    update(initialConfig);
    return { update, getState: () => ({ ...promotionState }) };
  };

  const initInstructorStats = () => {
    const stats = document.querySelector(".instructor-stats");
    const values = stats ? [...stats.querySelectorAll(".instructor-stat strong")] : [];
    if (!stats || !values.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hasAnimated = false;

    const numericValue = (value) => {
      const normalizedDigits = value
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
        .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
      const parsed = Number(normalizedDigits.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    };

    const animate = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      if (reducedMotion.matches) return;
      const entries = values.map((element) => ({
        element,
        finalText: element.textContent.trim(),
        value: numericValue(element.textContent),
      })).filter((entry) => entry.value !== null);
      if (!entries.length) return;

      entries.forEach(({ element, finalText }) => element.setAttribute("aria-label", finalText));
      const start = performance.now();
      const duration = motionDuration('counter', 620);
      const formatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      });

      const step = (timestamp) => {
        const progress = reducedMotion.matches ? 1 : Math.min(1, (timestamp - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        entries.forEach(({ element, finalText, value }) => {
          element.textContent = progress === 1 ? finalText : `${formatter.format(Math.round(value * eased))}+`;
        });
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      animate();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      animate();
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.3 });
    observer.observe(stats);
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
      let resizeTimer = 0;
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        const nextExpanded = !expanded;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const startHeight = list.getBoundingClientRect().height;
        if (resizeTimer) window.clearTimeout(resizeTimer);
        if (!reducedMotion) {
          list.classList.remove("is-resizing");
          list.style.removeProperty("height");
          list.style.overflow = "hidden";
        }
        extraItems.forEach((item) => {
          item.hidden = !nextExpanded;
        });
        list.classList.toggle("is-expanded", nextExpanded);
        toggle.setAttribute("aria-expanded", String(nextExpanded));
        toggle.setAttribute("aria-label", nextExpanded
          ? copy("hideMoreTags", { title: courseTitle })
          : copy("showMoreTags", { count: extraCount, title: courseTitle }));
        toggle.textContent = nextExpanded ? copy("closeTags") : `+${extraCount}`;
        if (!reducedMotion) {
          const endHeight = list.getBoundingClientRect().height;
          list.style.height = `${startHeight}px`;
          void list.offsetHeight;
          list.classList.add("is-resizing");
          window.requestAnimationFrame(() => {
            list.style.height = `${endHeight}px`;
          });
          resizeTimer = window.setTimeout(() => {
            list.classList.remove("is-resizing");
            list.style.removeProperty("height");
            list.style.removeProperty("overflow");
            resizeTimer = 0;
          }, 240);
        }
      });
      controlItem.append(toggle);
      list.append(controlItem);
    }

    return list;
  };

  const getCourseBadges = (course, siteConfig) => {
    const badges = [];
    const normalBadge = textValue(course.badge);
    if (normalBadge) badges.push({ label: normalBadge, promotional: false });

    const promotion = siteConfig.promotion && typeof siteConfig.promotion === "object"
      ? siteConfig.promotion
      : {};
    const promotionBadge = textValue(promotion.courseBadge);
    const courseStatus = textValue(course.status).toLowerCase();
    const promotionIsActive = document.documentElement.dataset.promotionActive === "true";
    if (promotionIsActive && promotion.enabled === true && courseStatus === "available" && promotionBadge) {
      badges.push({ label: promotionBadge, promotional: true });
    }

    return badges;
  };

  const createCourseBadge = (badge, className) => {
    const classes = [className];
    if (badge.promotional) classes.push(`${className}--promotion`);
    const element = createElement("span", classes.join(" "), badge.label);
    if (badge.promotional) element.dataset.promotionCourseBadge = "true";
    setAutoDirection(element);
    return element;
  };

  const createCourseCard = (course, courseIndex, siteConfig, copy, openDetails) => {
    const article = createElement("article", "course-card");
    const title = textValue(course.title) || copy("course");
    const slug = getCourseSlug(course, courseIndex);
    article.dataset.course = slug;

    const image = getCourseImage(course);
    const imageSource = safeMediaSource(image.src);
    const badges = getCourseBadges(course, siteConfig);
    if (imageSource || badges.length) {
      const media = createElement("div", "course-card__media");
      if (imageSource) {
        const imageElement = document.createElement("img");
        imageElement.className = "course-card__image";
        imageElement.src = imageSource;
        imageElement.alt = image.alt || copy("courseCover", { title });
        imageElement.width = image.width;
        imageElement.height = image.height;
        imageElement.loading = "lazy";
        imageElement.decoding = "async";
        media.append(imageElement);
      }

      if (badges.length) {
        const badgeStack = createElement("div", "course-card__badges");
        badges.forEach((badge) => badgeStack.append(createCourseBadge(badge, "course-card__badge")));
        media.append(badgeStack);
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
      const enrollmentLink = createElement("a", "button course-card__cta");
      configureLink(enrollmentLink, enrollmentHref);
      enrollmentLink.setAttribute("aria-label", `${ctaText}: ${title}`);
      const label = createElement("span", "", ctaText);
      const arrow = createElement("span", "button__arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      enrollmentLink.append(label, arrow);
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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let closeTimer = 0;

    const renderCourse = (course) => {
      const fragment = document.createDocumentFragment();
      const title = textValue(course.title) || copy("course");
      const header = createElement("header", "dialog-course__header");
      const category = textValue(course.category);
      const badges = getCourseBadges(course, siteConfig);

      if (category || badges.length) {
        const eyebrow = createElement("div", "dialog-course__eyebrow");
        if (category) {
          const categoryElement = createElement("span", "dialog-course__category", category);
          setAutoDirection(categoryElement);
          eyebrow.append(categoryElement);
        }
        badges.forEach((badge) => eyebrow.append(createCourseBadge(badge, "dialog-course__badge")));
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
          const enrollmentLink = createElement("a", "button dialog-course__cta");
          configureLink(enrollmentLink, enrollmentHref);
          enrollmentLink.setAttribute("aria-label", `${ctaText}: ${title}`);
          const label = createElement("span", "", ctaText);
          const arrow = createElement("span", "button__arrow", "↗");
          arrow.setAttribute("aria-hidden", "true");
          enrollmentLink.append(label, arrow);
          actions.append(enrollmentLink);
        }
        fragment.append(actions);
      }

      content.replaceChildren(fragment);
    };

    const showCourse = (course, slug) => {
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = 0;
      renderCourse(course);
      activeSlug = slug;
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute("open", "");
        }
      }
      dialog.inert = false;
      dialog.classList.remove("is-closing");
      document.body.classList.add("dialog-open");
      lockPageScroll("course-dialog");
      void dialog.offsetHeight;
      window.requestAnimationFrame(() => {
        dialog.classList.add("is-visible");
        closeButton.focus();
      });
    };

    const finishDialogClose = () => {
      closeTimer = 0;
      if (!dialog.open) return;
      if (typeof dialog.close === "function") dialog.close();
      else {
        dialog.removeAttribute("open");
        dialog.dispatchEvent(new Event("close"));
      }
    };

    const closeDialog = (fromUrl = false, immediate = reducedMotion.matches) => {
      if (!dialog.open) return;
      closingFromUrl = closingFromUrl || fromUrl;
      dialog.inert = true;
      dialog.classList.remove("is-visible");
      dialog.classList.add("is-closing");
      if (closeTimer) window.clearTimeout(closeTimer);
      if (immediate) finishDialogClose();
      else closeTimer = window.setTimeout(finishDialogClose, motionDuration());
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
      dialog.inert = false;
      dialog.classList.remove("is-visible", "is-closing");
      document.body.classList.remove("dialog-open");
      unlockPageScroll("course-dialog");
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
    const filterScroller = filterContainer && filterContainer.closest(".filter-scroller");
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
    let renderTimer = 0;
    let pendingMatches = null;
    let countAnimationTimer = 0;
    let emptyAnimationTimer = 0;

    const updateFilterOverflow = () => {
      if (!filterScroller) return;
      filterScroller.classList.toggle("has-overflow", filterScroller.scrollWidth > filterScroller.clientWidth + 2);
    };

    const revealActiveFilter = () => {
      const activeButton = filterButtons.find((button) => button.dataset.category === activeCategory);
      if (!activeButton || !filterScroller) return;
      const scrollerBounds = filterScroller.getBoundingClientRect();
      const buttonBounds = activeButton.getBoundingClientRect();
      const horizontalOffset = (buttonBounds.left + buttonBounds.width / 2)
        - (scrollerBounds.left + scrollerBounds.width / 2);
      if (Math.abs(horizontalOffset) < 1) return;
      filterScroller.scrollBy({
        left: horizontalOffset,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };

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

    const animateResultCount = () => {
      const meta = resultsCount && resultsCount.closest(".catalog-meta");
      if (!meta || reducedMotion.matches) return;
      if (countAnimationTimer) window.clearTimeout(countAnimationTimer);
      meta.classList.remove("is-count-changing");
      void meta.offsetHeight;
      meta.classList.add("is-count-changing");
      countAnimationTimer = window.setTimeout(() => {
        meta.classList.remove("is-count-changing");
        countAnimationTimer = 0;
      }, 240);
    };

    const showEmptyState = (shouldShow) => {
      if (!emptyState) return;
      if (emptyAnimationTimer) window.clearTimeout(emptyAnimationTimer);
      emptyState.classList.remove("is-entering");
      emptyState.hidden = !shouldShow;
      if (!shouldShow || reducedMotion.matches) return;
      void emptyState.offsetHeight;
      emptyState.classList.add("is-entering");
      emptyAnimationTimer = window.setTimeout(() => {
        emptyState.classList.remove("is-entering");
        emptyAnimationTimer = 0;
      }, 280);
    };

    const commitRender = (matches, animateGrid = true) => {
      const fragment = document.createDocumentFragment();
      matches.forEach(({ course, index }) => {
        fragment.append(createCourseCard(course, index, currentSiteConfig, currentCopy, currentOpenDetails));
      });
      grid.replaceChildren(fragment);
      grid.classList.remove("is-filtering-out");
      if (animateGrid && !reducedMotion.matches && matches.length) {
        grid.classList.remove("is-filtering-in");
        void grid.offsetHeight;
        grid.classList.add("is-filtering-in");
        window.setTimeout(() => grid.classList.remove("is-filtering-in"), motionDuration() + 16);
      }
      motionController.observeElements(grid.querySelectorAll(".course-card"));

      if (resultsCount) {
        const nextResultText = resultText(matches.length);
        if (resultsCount.textContent !== nextResultText) {
          resultsCount.textContent = nextResultText;
          animateResultCount();
        }
      }
      showEmptyState(matches.length === 0);
      grid.hidden = matches.length === 0;
      updateFilterButtons();
      updateClearButton();
    };

    const render = () => {
      const normalizedQuery = normalizeSearchText(query);
      const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
      pendingMatches = indexedCourses.filter(({ course, searchText }) => {
        const matchesCategory = !activeCategory || textValue(course.category) === activeCategory;
        const matchesSearch = !tokens.length || tokens.every((token) => searchText.includes(token));
        return matchesCategory && matchesSearch;
      });

      const canAnimateReplacement = !reducedMotion.matches && grid.childElementCount > 0 && !grid.hidden;
      if (!canAnimateReplacement) {
        if (renderTimer) window.clearTimeout(renderTimer);
        renderTimer = 0;
        commitRender(pendingMatches, false);
        pendingMatches = null;
        return;
      }

      grid.classList.add("is-filtering-out");
      if (renderTimer) return;
      renderTimer = window.setTimeout(() => {
        renderTimer = 0;
        const latestMatches = pendingMatches || [];
        pendingMatches = null;
        commitRender(latestMatches, true);
      }, motionDuration('micro'));
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
            revealActiveFilter();
          });
          filterButtons.push(button);
          filterContainer.append(button);
        });
        window.requestAnimationFrame(() => {
          updateFilterOverflow();
          revealActiveFilter();
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
          window.requestAnimationFrame(revealActiveFilter);
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
      const previousCategoryIndex = categories.indexOf(activeCategory);
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
      activeCategory = previousCategoryIndex >= 0 ? (categories[previousCategoryIndex] || "") : "";
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

    window.addEventListener("resize", updateFilterOverflow, { passive: true });

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
      card.dataset.paymentMethod = method.id;
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
      if (method.contactRequired && safeHref(whatsapp)) {
        const link = createElement('a', 'payment-method__inquiry', textValue(method.contactLabel) || textValue(payment.contactLabel));
        const url = new URL(whatsapp, document.baseURI);
        url.searchParams.set('text', siteConfig.locale === 'ar' ? `مرحبًا، أريد الاستفسار عن بيانات الدفع عبر ${name} مع MT Academy.` : `Hello, I would like to ask for ${name} payment details for MT Academy arrangements.`);
        configureLink(link, url.href);
        body.append(link);
      }
      card.append(body);
      fragment.append(card);
    });
    container.replaceChildren(fragment);
    motionController.observeElements(container.querySelectorAll(".payment-method, .payment-card"));
  };

  const renderStructuredData = (siteConfig, courses) => {
    const script = document.querySelector("#structured-data");
    if (!(script instanceof HTMLScriptElement)) return;
    const schema = buildCatalogSchema(siteConfig, courses);
    script.textContent = schema ? JSON.stringify(schema) : "";
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
      entry.closeTimer = window.setTimeout(() => finishClosingEntry(entry), motionDuration());
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
      panel.style.transition = reducedMotion.matches ? "none" : "max-height var(--transition-base)";
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

  const initInstructorDetails = () => {
    const details = document.querySelector(".instructor-details");
    const summary = details && details.querySelector("summary");
    const body = details && details.querySelector(".instructor-details__body");
    if (!(details instanceof HTMLDetailsElement) || !summary || !(body instanceof HTMLElement)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isExpanded = details.open;
    let animationTimer = 0;

    const clearAnimation = () => {
      if (animationTimer) window.clearTimeout(animationTimer);
      animationTimer = 0;
      body.style.removeProperty("height");
      body.style.removeProperty("opacity");
      body.style.removeProperty("overflow");
      details.classList.remove("is-animating", "is-closing");
    };

    const setExpanded = (nextExpanded) => {
      if (nextExpanded === isExpanded) return;
      isExpanded = nextExpanded;
      summary.setAttribute("aria-expanded", String(nextExpanded));
      if (animationTimer) window.clearTimeout(animationTimer);

      if (reducedMotion.matches) {
        clearAnimation();
        details.open = nextExpanded;
        body.inert = false;
        return;
      }

      details.classList.add("is-animating");
      if (nextExpanded) {
        details.open = true;
        body.inert = false;
        body.style.height = "0px";
        body.style.opacity = "0";
        body.style.overflow = "hidden";
        void body.offsetHeight;
        window.requestAnimationFrame(() => {
          body.style.height = `${body.scrollHeight}px`;
          body.style.opacity = "1";
        });
        animationTimer = window.setTimeout(clearAnimation, motionDuration() + 16);
        return;
      }

      details.classList.add("is-closing");
      body.inert = true;
      body.style.height = `${body.getBoundingClientRect().height}px`;
      body.style.opacity = "1";
      body.style.overflow = "hidden";
      void body.offsetHeight;
      window.requestAnimationFrame(() => {
        body.style.height = "0px";
        body.style.opacity = "0";
      });
      animationTimer = window.setTimeout(() => {
        details.open = false;
        body.inert = false;
        clearAnimation();
      }, motionDuration() + 16);
    };

    summary.setAttribute("aria-expanded", String(isExpanded));
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      setExpanded(!isExpanded);
    });
  };

  const initReviewsCarousel = (initialConfig) => {
    const track = document.querySelector("[data-reviews-track]");
    const previousButton = document.querySelector("[data-reviews-previous]");
    const nextButton = document.querySelector("[data-reviews-next]");
    const status = document.querySelector("[data-reviews-status]");
    const controls = previousButton && previousButton.closest(".reviews-controls");
    const lightbox = document.querySelector("#review-lightbox");
    const lightboxClose = document.querySelector("#review-lightbox-close");
    const lightboxImage = document.querySelector("#review-lightbox-image");
    const lightboxError = document.querySelector("#review-lightbox-error");
    const lightboxTitle = document.querySelector("#review-lightbox-title");
    if (!track || !(previousButton instanceof HTMLButtonElement) || !(nextButton instanceof HTMLButtonElement)) {
      return { update: () => {} };
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let config = initialConfig;
    let images = [];
    let pageSize = 1;
    let pageIndex = 0;
    let animationTimer = 0;
    let leaveTimer = 0;
    let isTransitioning = false;
    let queuedDirection = 0;
    let lightboxCloseTimer = 0;
    let activeLightboxIndex = -1;
    let lightboxTrigger = null;
    let touchStart = null;
    let suppressOpenUntil = 0;

    const getPageSize = () => {
      if (window.matchMedia("(min-width: 56rem)").matches) return 3;
      if (window.matchMedia("(min-width: 42rem)").matches) return 2;
      return 1;
    };

    const localizedLabel = (key, fallback) => textValue(
      getByPath(config, `reviewsSection.${key}`)
    ) || fallback;

    const isRtl = () => textValue(config.direction || config.dir).toLowerCase() === "rtl";
    const isArabic = () => textValue(config.locale).toLowerCase().startsWith("ar");
    const fallbackLabel = (arabic, english) => isArabic() ? arabic : english;

    const fullSourceFor = (imageData) => safeMediaSource(
      typeof imageData === "string" ? imageData : imageData && imageData.src
    );

    const thumbnailSourceFor = (imageData) => {
      const configured = imageData && typeof imageData === "object"
        ? safeMediaSource(imageData.thumbnail || imageData.thumbnailSrc || imageData.preview)
        : "";
      if (configured) return configured;
      const fullSource = fullSourceFor(imageData);
      return safeMediaSource(fullSource.replace(
        /\/reviews\/([^/?#]+)\.png(?=([?#]|$))/i,
        "/reviews/thumbs/$1.jpg"
      ));
    };

    const reviewAlt = (imageIndex) => `${localizedLabel("imageAltPrefix", "Student review image")} ${imageIndex + 1}`;

    const updateLightboxCopy = () => {
      if (!(lightboxClose instanceof HTMLButtonElement)) return;
      lightboxClose.setAttribute("aria-label", fallbackLabel("إغلاق صورة التقييم", "Close enlarged review"));
      if (lightboxError) {
        lightboxError.textContent = fallbackLabel("تعذر تحميل صورة التقييم.", "The review image could not be loaded.");
      }
      if (activeLightboxIndex >= 0 && lightboxTitle) {
        lightboxTitle.textContent = fallbackLabel(
          `صورة تقييم مكبرة رقم ${activeLightboxIndex + 1}`,
          `Enlarged review image ${activeLightboxIndex + 1}`
        );
      }
      if (activeLightboxIndex >= 0 && lightboxImage instanceof HTMLImageElement) {
        lightboxImage.alt = reviewAlt(activeLightboxIndex);
      }
    };

    const canUseLightbox = lightbox instanceof HTMLDialogElement
      && lightboxClose instanceof HTMLButtonElement
      && lightboxImage instanceof HTMLImageElement
      && lightboxError instanceof HTMLElement;

    const finishLightboxClose = () => {
      lightboxCloseTimer = 0;
      if (!canUseLightbox || !lightbox.open) return;
      if (typeof lightbox.close === "function") lightbox.close();
      else {
        lightbox.removeAttribute("open");
        lightbox.dispatchEvent(new Event("close"));
      }
    };

    const closeLightbox = (immediate = reducedMotion.matches) => {
      if (!canUseLightbox || !lightbox.open) return;
      lightbox.inert = true;
      lightbox.classList.remove("is-visible");
      lightbox.classList.add("is-closing");
      if (lightboxCloseTimer) window.clearTimeout(lightboxCloseTimer);
      if (immediate) finishLightboxClose();
      else lightboxCloseTimer = window.setTimeout(finishLightboxClose, motionDuration());
    };

    const openLightbox = (imageIndex, trigger) => {
      if (!canUseLightbox || !images[imageIndex]) return;
      const source = fullSourceFor(images[imageIndex]);
      if (!source) return;
      if (lightboxCloseTimer) window.clearTimeout(lightboxCloseTimer);
      lightboxCloseTimer = 0;
      activeLightboxIndex = imageIndex;
      lightboxTrigger = trigger instanceof HTMLElement ? trigger : null;
      lightboxImage.hidden = false;
      lightboxError.hidden = true;
      lightboxImage.alt = reviewAlt(imageIndex);
      lightboxImage.src = source;
      updateLightboxCopy();
      if (!lightbox.open) {
        try {
          lightbox.showModal();
        } catch {
          lightbox.setAttribute("open", "");
        }
      }
      lightbox.inert = false;
      lightbox.classList.remove("is-closing");
      document.body.classList.add("review-lightbox-open");
      lockPageScroll("review-lightbox");
      void lightbox.offsetHeight;
      window.requestAnimationFrame(() => {
        lightbox.classList.add("is-visible");
        lightboxClose.focus();
      });
    };

    if (canUseLightbox) {
      lightboxImage.addEventListener("load", () => {
        lightboxImage.hidden = false;
        lightboxError.hidden = true;
      });
      lightboxImage.addEventListener("error", () => {
        lightboxImage.hidden = true;
        lightboxError.hidden = false;
      });
      lightboxClose.addEventListener("click", () => closeLightbox());
      lightbox.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeLightbox();
      });
      lightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeLightbox();
          return;
        }
        if (event.key === "Tab") {
          event.preventDefault();
          lightboxClose.focus();
        }
      });
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
      lightbox.addEventListener("close", () => {
        lightbox.inert = false;
        lightbox.classList.remove("is-visible", "is-closing");
        document.body.classList.remove("review-lightbox-open");
        unlockPageScroll("review-lightbox");
        lightboxImage.removeAttribute("src");
        const fallbackTrigger = track.querySelector(`[data-review-index="${activeLightboxIndex}"]`);
        const restoreTarget = lightboxTrigger && lightboxTrigger.isConnected ? lightboxTrigger : fallbackTrigger;
        if (restoreTarget instanceof HTMLElement) restoreTarget.focus();
        activeLightboxIndex = -1;
        lightboxTrigger = null;
      });
    }

    const render = (navigationDirection = 0) => {
      const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
      pageIndex = Math.min(Math.max(0, pageIndex), totalPages - 1);
      const startIndex = pageIndex * pageSize;
      const visibleImages = Array.from(
        { length: Math.min(pageSize, images.length) },
        (_, offset) => {
          const imageIndex = (startIndex + offset) % images.length;
          return { imageData: images[imageIndex], imageIndex };
        }
      );
      const fragment = document.createDocumentFragment();
      const altPrefix = localizedLabel("imageAltPrefix", "Student review image");
      const enlargeLabel = fallbackLabel("تكبير", "Enlarge");
      const loadError = fallbackLabel("تعذر تحميل معاينة التقييم. يمكنك محاولة فتح الصورة المكبرة.", "The review preview could not be loaded. You can still try the enlarged image.");

      visibleImages.forEach(({ imageData, imageIndex }) => {
        const fullSource = fullSourceFor(imageData);
        const thumbnailSource = thumbnailSourceFor(imageData);
        if (!fullSource || !thumbnailSource) return;

        const slide = createElement("figure", "review-slide");
        const openButton = createElement("button", "review-slide__open");
        openButton.type = "button";
        openButton.dataset.reviewIndex = String(imageIndex);
        openButton.setAttribute("aria-label", fallbackLabel(
          `تكبير صورة التقييم رقم ${imageIndex + 1}`,
          `Enlarge review image ${imageIndex + 1}`
        ));
        const image = createElement("img", "review-slide__image");
        image.src = thumbnailSource;
        image.alt = `${altPrefix} ${imageIndex + 1}`;
        image.loading = "lazy";
        image.decoding = "async";
        if (imageData && typeof imageData === "object") {
          const width = Number(imageData.width);
          const height = Number(imageData.height);
          if (Number.isFinite(width) && width > 0) image.width = Math.round(width);
          if (Number.isFinite(height) && height > 0) image.height = Math.round(height);
        }
        const error = createElement("p", "review-slide__error", loadError);
        error.hidden = true;
        const zoom = createElement("span", "review-slide__zoom");
        const zoomIcon = createElement("span", "review-slide__zoom-icon", "⛶");
        zoomIcon.setAttribute("aria-hidden", "true");
        zoom.append(zoomIcon, createElement("span", "review-slide__zoom-label", enlargeLabel));
        image.addEventListener("error", () => {
          image.hidden = true;
          error.hidden = false;
          slide.classList.add("has-error");
        });
        openButton.addEventListener("click", () => {
          if (performance.now() < suppressOpenUntil) return;
          openLightbox(imageIndex, openButton);
        });
        openButton.append(image, error, zoom);
        slide.append(openButton);
        fragment.append(slide);
      });

      track.replaceChildren(fragment);
      track.hidden = track.childElementCount === 0;
      if (controls) controls.hidden = images.length <= pageSize;

      previousButton.textContent = isRtl() ? "→" : "←";
      nextButton.textContent = isRtl() ? "←" : "→";
      previousButton.setAttribute("aria-label", localizedLabel("previousLabel", "Previous reviews"));
      nextButton.setAttribute("aria-label", localizedLabel("nextLabel", "Next reviews"));

      if (status) {
        status.textContent = localizedLabel("pageTemplate", "{current} / {total}")
          .replaceAll("{current}", String(pageIndex + 1))
          .replaceAll("{total}", String(totalPages));
        status.setAttribute("dir", "ltr");
        status.setAttribute("aria-label", fallbackLabel(
          `الصفحة ${pageIndex + 1} من ${totalPages}`,
          `Page ${pageIndex + 1} of ${totalPages}`
        ));
      }

      if (animationTimer) window.clearTimeout(animationTimer);
      track.classList.remove("is-entering", "is-leaving");
      if (navigationDirection && !reducedMotion.matches) {
        const physicalDirection = navigationDirection * (isRtl() ? -1 : 1);
        track.style.setProperty("--review-enter-x", `${physicalDirection * 0.8}rem`);
        void track.offsetHeight;
        track.classList.add("is-entering");
        animationTimer = window.setTimeout(() => {
          track.classList.remove("is-entering");
          animationTimer = 0;
          isTransitioning = false;
          track.removeAttribute("aria-busy");
          if (queuedDirection) {
            const nextDirection = queuedDirection;
            queuedDirection = 0;
            navigate(nextDirection);
          }
        }, motionDuration() + 16);
      }
    };

    const clearReviewTransition = () => {
      if (animationTimer) window.clearTimeout(animationTimer);
      if (leaveTimer) window.clearTimeout(leaveTimer);
      animationTimer = 0;
      leaveTimer = 0;
      isTransitioning = false;
      queuedDirection = 0;
      track.classList.remove("is-entering", "is-leaving");
      track.removeAttribute("aria-busy");
    };

    const update = (nextConfig) => {
      clearReviewTransition();
      const firstVisibleIndex = pageIndex * pageSize;
      config = nextConfig || config;
      const gallery = config.reviewsGallery && typeof config.reviewsGallery === "object"
        ? config.reviewsGallery
        : {};
      images = Array.isArray(gallery.images) ? gallery.images : [];
      pageSize = getPageSize();
      pageIndex = Math.floor(firstVisibleIndex / pageSize);
      render();
      updateLightboxCopy();
    };

    const navigate = (direction) => {
      const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
      if (totalPages <= 1) return;
      if (reducedMotion.matches) {
        pageIndex = (pageIndex + direction + totalPages) % totalPages;
        render();
        return;
      }
      if (isTransitioning) {
        queuedDirection = Math.max(-totalPages, Math.min(totalPages, queuedDirection + direction));
        return;
      }

      isTransitioning = true;
      track.setAttribute("aria-busy", "true");
      const visualDirection = Math.sign(direction) || 1;
      const physicalDirection = visualDirection * (isRtl() ? -1 : 1);
      track.style.setProperty("--review-exit-x", `${physicalDirection * -0.8}rem`);
      track.classList.add("is-leaving");
      leaveTimer = window.setTimeout(() => {
        leaveTimer = 0;
        pageIndex = (pageIndex + direction + totalPages) % totalPages;
        render(visualDirection);
      }, motionDuration('micro') + 16);
    };

    previousButton.addEventListener("click", () => navigate(-1));
    nextButton.addEventListener("click", () => navigate(1));

    track.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
    }, { passive: true });

    track.addEventListener("touchend", (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      suppressOpenUntil = performance.now() + 450;
      const direction = isRtl() ? (deltaX > 0 ? 1 : -1) : (deltaX < 0 ? 1 : -1);
      navigate(direction);
    }, { passive: true });

    let resizeScheduled = false;
    window.addEventListener("resize", () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      window.requestAnimationFrame(() => {
        resizeScheduled = false;
        const nextPageSize = getPageSize();
        if (nextPageSize === pageSize) return;
        clearReviewTransition();
        const firstVisibleIndex = pageIndex * pageSize;
        pageSize = nextPageSize;
        pageIndex = Math.floor(firstVisibleIndex / pageSize);
        render();
      });
    }, { passive: true });

    update(initialConfig);
    return { update };
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
    saveLocale(currentLocale);
    let copyImplementation = () => "";
    const copy = (key, replacements) => copyImplementation(key, replacements);
    let mobileController = { update: () => {} };
    let dialogController = { open: () => {}, refresh: () => {} };
    let catalogController = { update: () => {} };
    let languageController = { update: () => {} };
    let reviewsController = { update: () => {} };
    let promotionController = { update: () => {} };
    const isErrorPage = document.body.dataset.page === "404";

    document.addEventListener("mt:promotion-statechange", (event) => {
      if (!event.detail || event.detail.state !== "active") return;
      catalogController.update(courses, siteConfig, copy, dialogController.open);
      dialogController.refresh();
    });

    const hydrateLocale = (locale) => {
      replaceObjectContents(siteConfig, resolveSiteConfig(rawSiteConfig, locale));
      rawCourses.forEach((course, index) => {
        replaceObjectContents(courses[index], resolveCourse(course, locale, fallbackLocale));
      });
      copyImplementation = createCopy(siteConfig);
    };

    const renderLocale = (initialRender = false) => {
      applySiteConfiguration(siteConfig);
      renderLearningPaths(currentLocale);
      renderKidsOffering(currentLocale);
      applyAccessibleLabels(siteConfig);
      languageController.update(currentLocale, siteConfig);
      if (isErrorPage) return;

      renderHeroTopics(siteConfig);
      if (initialRender) {
        promotionController = initPromotion(siteConfig);
        mobileController = initMobileNavigation(siteConfig);
        dialogController = initCourseDialog(courses, siteConfig, copy);
        catalogController = initCatalog(courses, siteConfig, copy, dialogController.open);
        initInstructorDetails();
        reviewsController = initReviewsCarousel(siteConfig);
      } else {
        promotionController.update(siteConfig);
        mobileController.update(siteConfig);
        catalogController.update(courses, siteConfig, copy, dialogController.open);
        dialogController.refresh();
        reviewsController.update(siteConfig);
      }
      initFaq(siteConfig);
      renderPaymentMethods(siteConfig);
      renderStructuredData(siteConfig, courses);
      motionController.refresh();
    };

    const selectLocale = (locale) => {
      const supportedCodes = supportedLocales.map(localeCode);
      if (!supportedCodes.includes(locale) || locale === currentLocale) return;
      currentLocale = locale;
      saveLocale(locale);
      hydrateLocale(locale);
      renderLocale(false);
    };

    hydrateLocale(currentLocale);
    languageController = initLanguageSwitching(supportedLocales, selectLocale);
    renderLocale(true);

    if (!isErrorPage) {
      motionController = initMotionSystem();
      initHeaderMotion();
      initInstructorStats();
      initPathNavigation();
      initActiveNavigation();
      initTopLinks();
    }
  };

  onReady(init);
})();
