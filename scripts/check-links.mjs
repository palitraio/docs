import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const INTERNAL_HREF = /href="(\/(?!\/)[^"]*)"/g;

function listHtml(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

function resolves(distDir, href) {
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  const target = join(distDir, path);
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, "index.html"));
}

/**
 * Finds internal `href="/..."` links in built pages that match no built page or file.
 *
 * @param {string} distDir Built site directory.
 * @returns {string[]} One message per dead link; empty when all resolve.
 */
export function checkLinks(distDir) {
  const errors = [];
  for (const page of listHtml(distDir)) {
    const html = readFileSync(page, "utf8");
    for (const [, href] of html.matchAll(INTERNAL_HREF)) {
      if (!resolves(distDir, href)) errors.push(`${page}: dead internal link ${href}`);
    }
  }
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = checkLinks(process.argv[2] ?? "dist");
  for (const error of errors) console.error(error);
  if (errors.length > 0) {
    console.error(`check-links: ${errors.length} dead link(s)`);
    process.exit(1);
  }
}
