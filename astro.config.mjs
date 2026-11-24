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
      components: {
        PageTitle: "./src/components/PageTitle.astro",
      },
    }),
  ],
});
