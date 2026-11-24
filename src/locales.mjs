export const LOCALES = {
  en: {
    lang: "en",
    label: "English",
    origin: "https://docs.palitra.io",
    title: "Palitra Docs",
    sidebar: { gettingStarted: "Getting started", connectors: "Connectors" },
  },
  ru: {
    lang: "ru",
    label: "Русский",
    origin: "https://docs.ru.palitra.io",
    title: "Палитра · Документация",
    sidebar: { gettingStarted: "Начало работы", connectors: "Коннекторы" },
  },
};

/**
 * Resolves the build locale from `SITE_LOCALE`.
 *
 * @param {string | undefined} value Raw environment value; `en` when unset.
 * @returns {"en" | "ru"} The locale code.
 */
export function resolveLocale(value = "en") {
  if (value !== "en" && value !== "ru") {
    throw new Error(`SITE_LOCALE must be "en" or "ru", got "${value}"`);
  }
  return value;
}

/**
 * Returns the locale served by the other domain.
 *
 * @param {"en" | "ru"} locale
 * @returns {"en" | "ru"}
 */
export function otherLocale(locale) {
  return locale === "en" ? "ru" : "en";
}
