import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://docs.palitra.io",
  integrations: [
    starlight({
      title: { ru: "Палитра · Документация", en: "Palitra Docs" },
      disable404Route: true,
      defaultLocale: "root",
      locales: {
        root: { label: "Русский", lang: "ru" },
        en: { label: "English", lang: "en" },
      },
      social: [{ icon: "external", label: "palitra.io", href: "https://palitra.io" }],
      sidebar: [
        {
          label: "Начало работы",
          translations: { en: "Getting started" },
          items: [
            "getting-started/first-steps",
            "getting-started/owner-admin",
            "getting-started/manager",
          ],
        },
        {
          label: "Коннекторы",
          translations: { en: "Connectors" },
          items: ["connectors/yandex-direct", "connectors/yandex-metrika"],
        },
        "faq",
      ],
      components: {
        PageTitle: "./src/components/PageTitle.astro",
      },
    }),
  ],
});
