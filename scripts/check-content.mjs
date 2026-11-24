import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const EDITIONS = ["saas", "byoc"];
const ARTICLE = /\.mdx?$/;

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

function frontmatterErrors(docsDir, path) {
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
    }
  }
  return errors;
}

/**
 * Validates content under `<rootDir>/src/content/docs`.
 *
 * Every Russian article needs an English twin at `en/<same path>` and vice versa;
 * `.md` and `.mdx` count as the same stem. Frontmatter `editions` and `sources`
 * must be present and valid.
 *
 * @param {string} rootDir Repository root.
 * @returns {string[]} Error messages; empty when the content is valid.
 */
export function checkContent(rootDir) {
  const docsDir = join(rootDir, "src/content/docs");
  const articles = listArticles(docsDir);
  const en = articles.filter((path) => path.startsWith("en/"));
  const ru = articles.filter((path) => !path.startsWith("en/"));
  const enStems = new Set(en.map((path) => stem(path.slice("en/".length))));
  const ruStems = new Set(ru.map(stem));

  const errors = [];
  for (const path of ru) {
    if (!enStems.has(stem(path))) errors.push(`missing en: ${path}`);
  }
  for (const path of en) {
    if (!ruStems.has(stem(path.slice("en/".length)))) errors.push(`missing ru: ${path}`);
  }
  for (const path of articles) {
    errors.push(...frontmatterErrors(docsDir, path));
  }
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
