import { LANG, BaseLang } from "./lang";

// case LANG.en
export function getCurrencyLabel() {
  const userLang = getUserLang();

  if (userLang === "en") {
    return BaseLang === "th" ? "THB" : "CHF";
  }

  return LANG[BaseLang].currency;
}

// --- validate ---
function validateLang(base, target, langName) {
  if (typeof base !== "object" || typeof target !== "object") return;

  Object.keys(base).forEach((key) => {
    // ignore metadata (ถ้ามี)
    if (key === "key") return;

    if (!(key in target)) {
      console.warn(`[i18n] Missing key "${key}" in ${langName}`);
    }
  });

  // (optional) check key เกิน
  Object.keys(target).forEach((key) => {
    if (key === "key") return;

    if (!(key in base)) {
      console.warn(`[i18n] Extra key "${key}" in ${langName}`);
    }
  });
}

// validate lang.js
if (import.meta.env.DEV) {
  const base = LANG[BaseLang];
  Object.entries(LANG).forEach(([langName, lang]) => {
    validateLang(base, lang, langName);
  });
}

// --- normalize ---
const normalizeLang = (locale) => {
  if (!locale) return BaseLang;
  return locale.toLowerCase().split("-")[0];
};

// --- detect lang en de th ---
export const getUserLang = () => {
  const dbLang = window.__USER_LANG__;
  const browserLang = navigator.language;

  const detected = normalizeLang(dbLang || browserLang);

  // ✅ fallback if no LANG
  return LANG[detected] ? detected : BaseLang;
};

const appLang = getUserLang();

// --- translator ---
export const L = new Proxy(LANG[appLang], {
  get(target, prop) {
    if (!(prop in target)) {
      console.warn(`[i18n] Missing key: ${String(prop)}`);
      return prop;
    }
    return target[prop];
  },
});

// --- currency ---
const CURRENCY_MAP = {
  th: { locale: "th-TH", currency: "THB" },
  de: { locale: "de-CH", currency: "CHF" },
  en: { locale: "en-US", currency: "CHF" }, // business rule
};

export const formatCurrency = (value) => {
  const cfg = CURRENCY_MAP[BaseLang] || CURRENCY_MAP.en;

  return new Intl.NumberFormat(cfg.locale, {
    style: "decimal", //not show currency name infont number (<> style: "currency")
    currency: cfg.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
