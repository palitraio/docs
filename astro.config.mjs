import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import { LOCALES, resolveLocale } from "./src/locales.mjs";

const locale = resolveLocale(process.env.SITE_LOCALE);
const { lang, label, origin, title, sidebar } = LOCALES[locale];

export default defineConfig({
  site: origin,
  integrations: [
    starlight({
      title,
      disable404Route: true,
      defaultLocale: "root",
      locales: { root: { label, lang } },
      social: [{ icon: "external", label: "palitra.io", href: "https://palitra.io" }],
      sidebar: [
        {
          label: sidebar.gettingStarted,
          items: [
            "getting-started/first-steps",
            "getting-started/owner-admin",
            "getting-started/manager",
          ],
        },
        {
          label: sidebar.connectors,
          items: ["connectors/yandex-direct", "connectors/yandex-metrika"],
        },
        "faq",
      ],
      components: {
        PageTitle: "./src/components/PageTitle.astro",
        LanguageSelect: "./src/components/LanguageSelect.astro",
        Head: "./src/components/Head.astro",
      },
    }),
  ],
});
