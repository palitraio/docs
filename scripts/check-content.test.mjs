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

function makeRoot(files) {
  const root = mkdtempSync(join(tmpdir(), "check-content-"));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, "src/content/docs", path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

describe("checkContent", () => {
  it("reports a ru article without an en twin", () => {
    const root = makeRoot({ "connectors/yandex-direct.md": VALID });
    expect(checkContent(root)).toContain("missing en: connectors/yandex-direct.md");
  });

  it("reports an en article without a ru twin", () => {
    const root = makeRoot({ "en/faq.md": VALID });
    expect(checkContent(root)).toContain("missing ru: en/faq.md");
  });

  it("accepts .md and .mdx twins with the same stem", () => {
    const root = makeRoot({ "faq.md": VALID, "en/faq.mdx": VALID });
    expect(checkContent(root)).toEqual([]);
  });

  it("reports empty sources", () => {
    const bad = VALID.replace(/sources:\n {2}- .*\n/, "sources: []\n");
    const root = makeRoot({ "faq.md": bad, "en/faq.md": VALID });
    const errors = checkContent(root);
    expect(errors.some((e) => e.includes("sources") && e.includes("faq.md"))).toBe(true);
  });

  it("reports an unknown edition", () => {
    const bad = VALID.replace("[saas, byoc]", "[cloud]");
    const root = makeRoot({ "faq.md": bad, "en/faq.md": VALID });
    expect(checkContent(root).some((e) => e.includes("editions"))).toBe(true);
  });
});
