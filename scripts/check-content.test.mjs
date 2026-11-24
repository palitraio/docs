import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

import { checkContent } from "./check-content.mjs";

const VALID = `---
title: T
description: D
editions: [saas, byoc]
sources:
  - palitra-frontend/app/[locale]
---
Body
`;

function makeRoot(files, siblings = []) {
  const parent = mkdtempSync(join(tmpdir(), "check-content-"));
  const root = join(parent, "docs");
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, "src/content/docs", path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  for (const sibling of siblings) {
    const full = join(parent, sibling);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, "");
  }
  return root;
}

const withSource = (source) => VALID.replace("palitra-frontend/app/[locale]", source);

describe("checkContent", () => {
  it("reports a ru article without an en twin", () => {
    const root = makeRoot({ "ru/connectors/yandex-direct.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain(
      "missing en: ru/connectors/yandex-direct.md",
    );
  });

  it("reports an en article without a ru twin", () => {
    const root = makeRoot({ "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain("missing ru: en/faq.md");
  });

  it("accepts .md and .mdx twins with the same stem", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/faq.mdx": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toEqual([]);
  });

  it("reports an article outside ru/ and en/", () => {
    const root = makeRoot({ "faq.md": VALID, "ru/faq.md": VALID, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain("outside ru/ and en/: faq.md");
  });

  it("reports an en article without a ru twin in a nested path", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/connectors/x.md": VALID, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain(
      "missing ru: en/connectors/x.md",
    );
  });

  it("reports empty sources", () => {
    const bad = VALID.replace(/sources:\n {2}- .*\n/, "sources: []\n");
    const root = makeRoot({ "ru/faq.md": bad, "en/faq.md": VALID });
    const errors = checkContent(root, { sidebarSlugs: ["faq"] });
    expect(errors.some((e) => e.includes("sources") && e.includes("faq.md"))).toBe(true);
  });

  it("reports an unknown edition", () => {
    const bad = VALID.replace("[saas, byoc]", "[cloud]");
    const root = makeRoot({ "ru/faq.md": bad, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] }).some((e) => e.includes("editions"))).toBe(
      true,
    );
  });

  it("reports an absolute source path", () => {
    const bad = VALID.replace("palitra-frontend/app/[locale]", "/etc/passwd");
    const root = makeRoot({ "ru/faq.md": bad, "en/faq.md": VALID });
    const errors = checkContent(root, { sidebarSlugs: ["faq"] });
    expect(errors.some((e) => e.includes("faq.md") && e.includes("/etc/passwd"))).toBe(true);
  });

  it("reports a source path with ..", () => {
    const bad = VALID.replace("palitra-frontend/app/[locale]", "palitra-frontend/../secret");
    const root = makeRoot({ "ru/faq.md": bad, "en/faq.md": VALID });
    const errors = checkContent(root, { sidebarSlugs: ["faq"] });
    expect(errors.some((e) => e.includes("faq.md") && e.includes("../secret"))).toBe(true);
  });

  it("reports an article missing from the sidebar", () => {
    const root = makeRoot({
      "ru/faq.md": VALID,
      "en/faq.md": VALID,
      "ru/extra.md": VALID,
      "en/extra.md": VALID,
    });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain("not in sidebar: extra");
  });

  it("does not require index and 404 in the sidebar", () => {
    const files = {};
    for (const name of ["index.mdx", "404.md", "faq.md"]) {
      files[`ru/${name}`] = VALID;
      files[`en/${name}`] = VALID;
    }
    expect(checkContent(makeRoot(files), { sidebarSlugs: ["faq"] })).toEqual([]);
  });

  it("reports a sidebar slug without an article", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq", "ghost"] })).toContain(
      "sidebar slug without article: ghost",
    );
  });

  it("reports twins with different editions", () => {
    const saasOnly = VALID.replace("[saas, byoc]", "[saas]");
    const root = makeRoot({ "ru/faq.md": saasOnly, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toContain(
      "editions differ between twins: faq",
    );
  });

  it("treats editions order as irrelevant", () => {
    const reversed = VALID.replace("[saas, byoc]", "[byoc, saas]");
    const root = makeRoot({ "ru/faq.md": reversed, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toEqual([]);
  });

  it("reports a source that does not start with a known repo", () => {
    const bad = withSource("some-repo/file.ts");
    const root = makeRoot({ "ru/faq.md": bad, "en/faq.md": VALID });
    const errors = checkContent(root, { sidebarSlugs: ["faq"] });
    expect(errors.some((e) => e.includes("some-repo/file.ts") && e.includes("known repo"))).toBe(
      true,
    );
  });

  it("reports a source missing from an existing sibling repo", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/faq.md": VALID }, [
      "palitra-frontend/README.md",
    ]);
    const errors = checkContent(root, { sidebarSlugs: ["faq"] });
    expect(
      errors.some((e) => e.includes("palitra-frontend/app/[locale]") && e.includes("exist")),
    ).toBe(true);
  });

  it("accepts a source that exists in the sibling repo", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/faq.md": VALID }, [
      "palitra-frontend/app/[locale]/page.tsx",
    ]);
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toEqual([]);
  });

  it("skips the existence check when the sibling repo is absent", () => {
    const root = makeRoot({ "ru/faq.md": VALID, "en/faq.md": VALID });
    expect(checkContent(root, { sidebarSlugs: ["faq"] })).toEqual([]);
  });

  it("reports a slug segment containing a dot", () => {
    const root = makeRoot({ "ru/release-2.0.md": VALID, "en/release-2.0.md": VALID });
    const errors = checkContent(root, { sidebarSlugs: ["release-2.0"] });
    expect(errors).toContain("slug segment contains a dot: release-2.0");
  });
});
