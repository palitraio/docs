import { defineCollection } from "astro:content";
import { i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { resolveLocale } from "@/locales.mjs";

const locale = resolveLocale(process.env.SITE_LOCALE);

export const collections = {
  docs: defineCollection({
    // Starlight's docsLoader only accepts generateId, so it cannot be pointed at ru/ or en/.
    loader: glob({ base: `./src/content/docs/${locale}`, pattern: "**/[^_]*.{md,mdx}" }),
    schema: docsSchema({
      extend: z.object({
        editions: z.array(z.enum(["saas", "byoc"])).min(1),
        sources: z.array(z.string()).min(1),
      }),
    }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
