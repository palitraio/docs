import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";

import { LOCALES } from "../src/locales.mjs";

const ARTICLE = /\.mdx?$/;
const NOT_ARTICLES = new Set(["index", "404"]);
const EDITIONS = ["saas", "byoc"];
const HEADING = /^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/;
const BLOCK_MARKER = /^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/;
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const FENCE = /^\s*(```|~~~)/;

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Reduces one line of Markdown/MDX to plain text.
 *
 * @param {string} line
 * @returns {string}
 */
function stripInline(line) {
  return line
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])[*_](\S(?:.*?\S)?)[*_](?=$|[\s).,;:!?])/g, "$1$2");
}

/**
 * Reduces a block of Markdown/MDX lines to plain text paragraphs. Starlight asides keep their
 * body, MDX imports and component tags disappear, code keeps its content.
 *
 * @param {string[]} lines
 * @returns {string}
 */
function toPlainText(lines) {
  const paragraphs = [];
  const isCode = new Set();
  let continuing = false;
  let inFence = false;
  for (const line of lines) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continuing = false;
      continue;
    }
    if (inFence) {
      isCode.add(paragraphs.length);
      paragraphs.push(line.trim());
      continuing = false;
      continue;
    }
    if (/^\s*(import|export)\s.+$/.test(line) || /^\s*:::/.test(line)) {
      continuing = false;
      continue;
    }
    if (TABLE_RULE.test(line)) continue;
    const startsBlock = BLOCK_MARKER.test(line);
    const text = stripInline(line.replace(BLOCK_MARKER, ""))
      .replace(/\s*\|\s*/g, " ")
      .trim();
    if (text === "") {
      continuing = false;
    } else if (continuing && !startsBlock) {
      paragraphs[paragraphs.length - 1] += ` ${text}`;
    } else {
      paragraphs.push(text);
      continuing = true;
    }
  }
  return paragraphs.map((text, i) => (isCode.has(i) ? text : stripInline(text))).join("\n");
}

/**
 * Splits an article body on `##` headings. Every heading, whatever its level, goes through one
 * slugger in document order, so duplicate suffixes match the ids Starlight renders.
 *
 * @param {string} body
 * @returns {{heading: string | null, anchor: string | null, lines: string[]}[]}
 */
function splitSections(body) {
  const slugger = new GithubSlugger();
  const sections = [{ heading: null, anchor: null, lines: [] }];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (FENCE.test(line)) inFence = !inFence;
    const match = inFence ? null : HEADING.exec(line);
    if (!match) {
      sections.at(-1).lines.push(line);
      continue;
    }
    const heading = toPlainText([match[2]]);
    const anchor = slugger.slug(heading);
    if (match[1] === "##") {
      sections.push({ heading, anchor, lines: [] });
    } else {
      sections.at(-1).lines.push(line);
    }
  }
  return sections;
}

function listArticles(localeDir) {
  const found = [];
  for (const entry of readdirSync(localeDir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !ARTICLE.test(entry.name)) continue;
    const path = relative(localeDir, join(entry.parentPath, entry.name)).split(sep).join("/");
    const stem = path.replace(ARTICLE, "");
    if (NOT_ARTICLES.has(stem)) continue;
    found.push({ path, stem: stem.endsWith("/index") ? stem.slice(0, -"/index".length) : stem });
  }
  return found.sort((a, b) => a.stem.localeCompare(b.stem));
}

function articleChunks(locale, origin, localeDir, { path, stem }) {
  const { data, content } = matter(readFileSync(join(localeDir, path), "utf8"));
  const where = `${locale}/${path}`;
  if (typeof data.title !== "string" || data.title === "") {
    throw new Error(`${where}: frontmatter "title" is required for the help index`);
  }
  if (!Array.isArray(data.editions) || data.editions.length === 0) {
    throw new Error(`${where}: frontmatter "editions" is required for the help index`);
  }
  for (const edition of data.editions) {
    if (!EDITIONS.includes(edition)) {
      throw new Error(
        `${where}: editions entry "${edition}" must be one of ${EDITIONS.join(", ")}`,
      );
    }
  }
  const articleUrl = `${origin}/${stem}/`;
  const chunks = [];
  for (const section of splitSections(content)) {
    const text = toPlainText(section.lines);
    if (text === "") continue;
    chunks.push({
      locale,
      editions: data.editions,
      url:
        section.anchor === null
          ? articleUrl
          : `${articleUrl}#${encodeURIComponent(section.anchor)}`,
      article_title: data.title,
      heading: section.heading ?? data.title,
      text,
    });
  }
  return chunks;
}

/**
 * Builds the help index: one chunk per `##` section of every article in every published locale.
 *
 * @param {string} contentDir Directory holding one subdirectory of articles per locale.
 * @param {string} version Release tag the index belongs to.
 * @param {Record<string, {origin: string, published: boolean}>} locales Defaults to `LOCALES`.
 * @returns {{version: string, chunks: object[]}}
 */
export function buildHelpIndex(contentDir, version, locales = LOCALES) {
  const chunks = [];
  for (const [locale, { origin, published }] of Object.entries(locales)) {
    if (!published) continue;
    const localeDir = join(contentDir, locale);
    if (!existsSync(localeDir)) {
      throw new Error(
        `published locale "${locale}" has no content directory ${localeDir}; ` +
          "add its articles or set published: false",
      );
    }
    for (const article of listArticles(localeDir)) {
      chunks.push(...articleChunks(locale, origin, localeDir, article));
    }
  }
  return { version, chunks };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const version = process.env.HELP_INDEX_VERSION || "dev";
  const index = buildHelpIndex(join(REPO_ROOT, "src/content/docs"), version);
  const out = join(REPO_ROOT, "dist/help-index.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`${out}: ${index.chunks.length} chunks, version ${version}`);
}
