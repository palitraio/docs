/**
 * Per-locale site settings. `published` is true once the locale's domain answers: only then do
 * the other locale's builds show the language switch and hreflang alternates for it.
 */
export const LOCALES = {
  en: {
    lang: "en",
    label: "English",
    origin: "https://docs.palitra.io",
    title: "Palitra Docs",
    brand: "Palitra",
    section: "Docs",
    published: false,
    sidebar: {
      gettingStarted: "Getting started",
      connectors: "Connectors",
      data: "Data",
      organization: "Organization management",
      projectSettings: "Project management",
    },
  },
  ru: {
    lang: "ru",
    label: "Русский",
    origin: "https://docs.ru.palitra.io",
    title: "Палитра · Документация",
    brand: "Палитра",
    section: "Документация",
    published: true,
    sidebar: {
      gettingStarted: "Начало работы",
      connectors: "Коннекторы",
      data: "Данные",
      organization: "Управление организацией",
      projectSettings: "Управление проектами",
    },
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

/**
 * Sidebar structure shared by all locales: a group names its label by key in each locale's
 * `sidebar` labels, a plain string is a top-level article slug.
 */
export const SIDEBAR = [
  {
    labelKey: "gettingStarted",
    items: [
      "getting-started/first-steps",
      "getting-started/owner-admin",
      "getting-started/manager",
    ],
  },
  "chat",
  "workflows",
  "artifacts",
  {
    labelKey: "connectors",
    items: ["connectors/overview", "connectors/yandex-direct", "connectors/yandex-metrika"],
  },
  {
    labelKey: "data",
    items: [
      "data/overview",
      "data/explorer",
      "data/events",
      "data/attribution",
      "data/pixel",
      "data/uploads",
      "data/webhooks",
    ],
  },
  "jobs",
  "skills",
  "media-plans",
  "action-log",
  {
    labelKey: "organization",
    items: [
      "organization/general",
      "organization/members",
      "organization/projects",
      "organization/sso",
      "organization/billing",
    ],
  },
  {
    labelKey: "projectSettings",
    items: [
      "project-settings/general",
      "project-settings/instructions",
      "project-settings/members",
      "project-settings/notifications",
      "project-settings/domains",
    ],
  },
  "faq",
];

/**
 * Builds the Starlight sidebar for one locale.
 *
 * @param {Record<string, string>} labels Group labels of the locale.
 * @returns {Array<string | {label: string, items: string[]}>}
 */
export function sidebarFor(labels) {
  return SIDEBAR.map((entry) =>
    typeof entry === "string" ? entry : { label: labels[entry.labelKey], items: entry.items },
  );
}

/** @returns {string[]} Every article slug the sidebar lists. */
export function sidebarSlugs() {
  return SIDEBAR.flatMap((entry) => (typeof entry === "string" ? [entry] : entry.items));
}
