import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import { sidebarSlugs as configuredSidebarSlugs } from "../src/locales.mjs";

const EDITIONS = ["saas", "byoc"];
const ARTICLE = /\.mdx?$/;
const REPOS = [
  "palitra-frontend",
  "palitra-backend",
  "palitra-tag",
  "palitra-desktop",
  "deploy",
  "license-server",
  "landing-page",
  "docs-internal",
];
const UNLISTED_IN_SIDEBAR = new Set(["index", "404"]);

function listArticles(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && ARTICLE.test(entry.name)) {
      found.push(relative(dir, join(entry.parentPath, entry.name)).split(sep).join("/"));
    }
  }
  return found.sort();
}

function stem(path) {
  return path.replace(ARTICLE, "");
}

const ABSOLUTE_SOURCE = /^([/\\~]|[A-Za-z]:)/;

function sourceProblem(source) {
  if (typeof source !== "string" || source === "") return "must be a non-empty string";
  if (ABSOLUTE_SOURCE.test(source)) return "must be workspace-relative, not absolute";
  if (source.split(/[/\\]/).includes("..")) return 'must not contain ".." segments';
  return null;
}

function sourceErrors(rootDir, path, source) {
  const repo = source.split("/")[0];
  if (!REPOS.includes(repo)) {
    return [
      `${path}: sources entry "${source}" must start with a known repo (${REPOS.join(", ")})`,
    ];
  }
  const siblingDir = join(rootDir, "..", repo);
  if (existsSync(siblingDir) && !existsSync(join(rootDir, "..", source))) {
    return [`${path}: sources entry "${source}" does not exist in ${siblingDir}`];
  }
  return [];
}

function frontmatterErrors(rootDir, docsDir, path) {
  const { data } = matter(readFileSync(join(docsDir, path), "utf8"));
  const errors = [];
  const { editions, sources } = data;
  const editionsValid =
    Array.isArray(editions) &&
    editions.length > 0 &&
    editions.every((edition) => EDITIONS.includes(edition));
  if (!editionsValid) {
    errors.push(`${path}: editions must be a non-empty subset of [${EDITIONS.join(", ")}]`);
  }
  if (!Array.isArray(sources) || sources.length === 0) {
    errors.push(`${path}: sources must be a non-empty list of workspace-relative paths`);
  } else {
    for (const source of sources) {
      const problem = sourceProblem(source);
      if (problem) errors.push(`${path}: sources entry "${source}" ${problem}`);
      else errors.push(...sourceErrors(rootDir, path, source));
    }
  }
  return errors;
}

function editionsOf(docsDir, path) {
  const { editions } = matter(readFileSync(join(docsDir, path), "utf8")).data;
  return Array.isArray(editions) ? [...editions].sort().join(",") : "";
}

function structureErrors(docsDir, byLocale, slugsInSidebar) {
  const errors = [];
  const slugs = new Set(byLocale.en.map((path) => stem(path.slice("en/".length))));
  const ruByStem = new Map(byLocale.ru.map((path) => [stem(path.slice("ru/".length)), path]));
  for (const slug of [...slugs].sort()) {
    if (slug.split("/").some((segment) => segment.includes("."))) {
      errors.push(`slug segment contains a dot: ${slug}`);
    }
    if (!UNLISTED_IN_SIDEBAR.has(slug) && !slugsInSidebar.includes(slug)) {
      errors.push(`not in sidebar: ${slug}`);
    }
    const ruPath = ruByStem.get(slug);
    const enPath = byLocale.en.find((path) => stem(path.slice("en/".length)) === slug);
    if (ruPath && editionsOf(docsDir, ruPath) !== editionsOf(docsDir, enPath)) {
      errors.push(`editions differ between twins: ${slug}`);
    }
  }
  for (const slug of slugsInSidebar) {
    if (!slugs.has(slug)) errors.push(`sidebar slug without article: ${slug}`);
  }
  return errors;
}

/**
 * Validates content under `<rootDir>/src/content/docs`.
 *
 * Russian articles live in `ru/`, English in `en/`. Every `ru/<path>` needs an `en/<path>`
 * twin and vice versa; `.md` and `.mdx` count as the same stem. Frontmatter `editions` and
 * `sources` must be present and valid; twins share `editions`; every article is in the sidebar
 * and every sidebar slug has an article; slugs contain no dots. Sources must start with a known
 * repo and, when that repo sits next to this one, must exist there.
 *
 * @param {string} rootDir Repository root.
 * @param {{sidebarSlugs?: string[]}} [options] Sidebar slugs; defaults to the site configuration.
 * @returns {string[]} Error messages; empty when the content is valid.
 */
export function checkContent(rootDir, { sidebarSlugs = configuredSidebarSlugs() } = {}) {
  const docsDir = join(rootDir, "src/content/docs");
  const articles = listArticles(docsDir);
  const byLocale = { ru: [], en: [] };
  const errors = [];
  for (const path of articles) {
    const locale = path.split("/")[0];
    if (path.includes("/") && Object.hasOwn(byLocale, locale)) {
      byLocale[locale].push(path);
    } else {
      errors.push(`outside ru/ and en/: ${path}`);
    }
  }
  const stems = {
    ru: new Set(byLocale.ru.map((path) => stem(path.slice("ru/".length)))),
    en: new Set(byLocale.en.map((path) => stem(path.slice("en/".length)))),
  };
  for (const path of byLocale.ru) {
    if (!stems.en.has(stem(path.slice("ru/".length)))) errors.push(`missing en: ${path}`);
  }
  for (const path of byLocale.en) {
    if (!stems.ru.has(stem(path.slice("en/".length)))) errors.push(`missing ru: ${path}`);
  }
  for (const path of articles) {
    errors.push(...frontmatterErrors(rootDir, docsDir, path));
  }
  errors.push(...structureErrors(docsDir, byLocale, sidebarSlugs));
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = checkContent(process.cwd());
  for (const error of errors) console.error(error);
  if (errors.length > 0) {
    console.error(`check-content: ${errors.length} error(s)`);
    process.exit(1);
  }
}
