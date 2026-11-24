import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import { buildHelpIndex } from "./build-help-index.mjs";

const LOCALES = {
  ru: { origin: "https://docs.ru.palitra.io", published: true },
  en: { origin: "https://docs.palitra.io", published: true },
  de: { origin: "https://docs.de.palitra.io", published: false },
};

function article({ title = "Яндекс Директ", editions = "[saas, byoc]", body }) {
  return `---\ntitle: ${title}\ndescription: d\neditions: ${editions}\nsources:\n  - palitra-backend/x.py\n---\n\n${body}\n`;
}

function makeDocs(files) {
  const root = mkdtempSync(join(tmpdir(), "help-index-"));
  for (const locale of Object.keys(LOCALES)) mkdirSync(join(root, locale));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

const RU_BODY =
  "Вступление.\n\n## Подключение\n\nТекст подключения.\n\n## Частые проблемы\n\nТекст проблем.";

describe("buildHelpIndex", () => {
  it("splits an article on ## headings", () => {
    const root = makeDocs({ "ru/connectors/yandex-direct.md": article({ body: RU_BODY }) });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks.map((c) => c.heading)).toEqual([
      "Яндекс Директ",
      "Подключение",
      "Частые проблемы",
    ]);
    expect(chunks.map((c) => c.text)).toEqual([
      "Вступление.",
      "Текст подключения.",
      "Текст проблем.",
    ]);
  });

  it("records the version", () => {
    const root = makeDocs({ "ru/faq.md": article({ body: "## A\n\nb" }) });
    expect(buildHelpIndex(root, "docs-2026.11.24-abc1234", LOCALES).version).toBe(
      "docs-2026.11.24-abc1234",
    );
  });

  it("builds urls with the locale origin", () => {
    const root = makeDocs({
      "ru/connectors/yandex-direct.md": article({ body: RU_BODY }),
      "en/connectors/yandex-direct.md": article({
        title: "Yandex Direct",
        body: "Intro.\n\n## Setup\n\nText.",
      }),
    });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks.find((c) => c.locale === "ru" && c.heading === "Яндекс Директ")?.url).toBe(
      "https://docs.ru.palitra.io/connectors/yandex-direct/",
    );
    expect(chunks.find((c) => c.locale === "en" && c.heading === "Setup")?.url).toBe(
      "https://docs.palitra.io/connectors/yandex-direct/#setup",
    );
  });

  it("percent-encodes cyrillic anchors the way Starlight slugs them", () => {
    const root = makeDocs({ "ru/connectors/yandex-direct.md": article({ body: RU_BODY }) });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks.find((c) => c.heading === "Частые проблемы")?.url).toBe(
      "https://docs.ru.palitra.io/connectors/yandex-direct/#%D1%87%D0%B0%D1%81%D1%82%D1%8B%D0%B5-%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B",
    );
  });

  it("disambiguates repeated headings like github-slugger", () => {
    const root = makeDocs({ "en/faq.md": article({ body: "## Q\n\na\n\n## Q\n\nb" }) });
    const urls = buildHelpIndex(root, "v1", LOCALES).chunks.map((c) => c.url);
    expect(urls).toEqual(["https://docs.palitra.io/faq/#q", "https://docs.palitra.io/faq/#q-1"]);
  });

  it("excludes unpublished locales", () => {
    const root = makeDocs({
      "ru/faq.md": article({ body: "## A\n\nb" }),
      "de/faq.md": article({ body: "## A\n\nb" }),
    });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(new Set(chunks.map((c) => c.locale))).toEqual(new Set(["ru"]));
  });

  it("gives the intro chunk the article url without an anchor", () => {
    const root = makeDocs({ "ru/faq.md": article({ title: "FAQ", body: "Intro.\n\n## A\n\nb" }) });
    expect(buildHelpIndex(root, "v1", LOCALES).chunks[0]?.url).toBe(
      "https://docs.ru.palitra.io/faq/",
    );
  });

  it("carries editions from frontmatter", () => {
    const root = makeDocs({ "ru/faq.md": article({ editions: "[byoc]", body: "## A\n\nb" }) });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks.every((c) => c.editions.length === 1 && c.editions[0] === "byoc")).toBe(true);
  });

  it("skips index and 404 pages and empty fragments", () => {
    const root = makeDocs({
      "ru/index.mdx": article({ body: "Hello\n\n## X\n\ny" }),
      "ru/404.md": article({ body: "Not found" }),
      "ru/faq.md": article({ body: "## A\n\nb\n\n## Empty\n" }),
    });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks.map((c) => c.heading)).toEqual(["A"]);
  });

  it("does not split on ## inside fenced code", () => {
    const root = makeDocs({
      "ru/faq.md": article({ body: "## A\n\n```sh\n## not a heading\n```\n\nafter" }),
    });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.text).toContain("## not a heading");
  });

  it("strips markdown/MDX syntax from text", () => {
    const body = [
      "import { Card } from '@astrojs/starlight/components';",
      "",
      "## A",
      "",
      "Это **важно**, см. [статью](/getting-started/manager/) и `код`.",
      "",
      ":::note[Заметка]",
      "Внутри aside.",
      ":::",
      "",
      '<Card title="x">',
      "Внутри карточки.",
      "</Card>",
      "",
      "- пункт один",
      "1. пункт два",
      "",
      "> цитата",
    ].join("\n");
    const root = makeDocs({ "ru/faq.md": article({ body }) });
    const text = buildHelpIndex(root, "v1", LOCALES)
      .chunks.map((c) => c.text)
      .join("\n");
    expect(text).toContain("Это важно, см. статью и код.");
    expect(text).toContain("Внутри aside.");
    expect(text).toContain("Внутри карточки.");
    expect(text).toContain("пункт один");
    expect(text).toContain("цитата");
    for (const leaked of ["**", "import", ":::", "<Card", "</Card>", "](", "`", "Заметка"]) {
      expect(text).not.toContain(leaked);
    }
  });

  it("fails on an article without a title", () => {
    const root = makeDocs({ "ru/faq.md": "---\neditions: [saas]\n---\n\n## A\n\nb\n" });
    expect(() => buildHelpIndex(root, "v1", LOCALES)).toThrow(/faq\.md.*title/);
  });
});

describe("buildHelpIndex with a missing locale directory", () => {
  it("fails for a published locale without content", () => {
    const root = mkdtempSync(join(tmpdir(), "help-index-"));
    expect(() => buildHelpIndex(root, "v1", LOCALES)).toThrow(/ENOENT/);
  });
});

describe("paragraph text", () => {
  it("joins soft-wrapped lines and keeps list items separate", () => {
    const root = makeDocs({
      "ru/faq.md": article({
        body: "## A\n\nпервая строка\nвторая строка\n\n- пункт\n- ещё пункт",
      }),
    });
    const { chunks } = buildHelpIndex(root, "v1", LOCALES);
    expect(chunks[0]?.text).toBe("первая строка вторая строка\nпункт\nещё пункт");
  });
});

describe("links wrapped across lines", () => {
  it("keeps the link text and drops the target", () => {
    const root = makeDocs({
      "ru/faq.md": article({
        body: "## A\n\nсм. [Менеджеру\nпроекта](/getting-started/manager/).",
      }),
    });
    expect(buildHelpIndex(root, "v1", LOCALES).chunks[0]?.text).toBe("см. Менеджеру проекта.");
  });
});
