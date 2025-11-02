#!/usr/bin/env node
/**
 * export-project-md.js
 * جمع‌آوری ساختار پروژه (tree) + محتوای فایل‌ها در یک Markdown خوانا
 * اجرا: node export-project-md.js [--out FILE] [--max 500000] [--showHidden]
 *
 * نکات:
 * - از .gitignore (اگر موجود باشد) برای نادیده‌گرفتن مسیرها استفاده می‌کند.
 * - پوشه‌های حجیم/بی‌ربط به‌صورت پیش‌فرض نادیده گرفته می‌شوند (node_modules, .next, .git, ...)
 * - زبان کدِ code fence براساس پسوند فایل تنظیم می‌شود.
 */

import fsp from "fs/promises";
import os from "os";
import path from "path";

// ---- پیکربندی پیش‌فرض ----
const DEFAULT_OUT = "PROJECT_EXPORT.md";
const DEFAULT_MAX_BYTES = 800_000; // سقف هر فایل (برای جلوگیری از انفجارِ خروجی)
const DEFAULT_IGNORES = [
  "node_modules",
  ".git",
  ".next",
  ".vercel",
  ".turbo",
  "coverage",
  "build",
  "dist",
  ".pnpm-store",
  ".cache",
  ".DS_Store",
  "pnpm-lock.yaml", // اختیاری: قفل‌ها اغلب خیلی بزرگ‌اند
  "yarn.lock",
  "package-lock.json",
];

// نگاشت پسوند -> زبان مارک‌داون
const LANG_BY_EXT = {
  ".ts": "ts",
  ".tsx": "tsx",
  ".js": "js",
  ".jsx": "jsx",
  ".mjs": "js",
  ".cjs": "js",
  ".json": "json",
  ".jsonc": "json",
  ".md": "md",
  ".mdx": "md",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".env": "bash",
  ".env.local": "bash",
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".html": "html",
  ".htm": "html",
  ".svg": "xml",
  ".xml": "xml",
  ".sql": "sql",
  ".prisma": "prisma",
  ".dockerfile": "dockerfile",
  Dockerfile: "dockerfile",
  ".gitignore": "ini",
  ".gitattributes": "ini",
  ".prettierrc": "json",
  ".eslintrc": "json",
};

// آرگومان‌ها
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.findIndex((a) => a === name || a.startsWith(name + "="));
  if (i === -1) return fallback;
  const val = args[i].includes("=") ? args[i].split("=")[1] : args[i + 1];
  return val ?? fallback;
};

const OUT_FILE = getArg("--out", DEFAULT_OUT);
const MAX_BYTES = parseInt(getArg("--max", DEFAULT_MAX_BYTES), 10);
const SHOW_HIDDEN = args.includes("--showHidden");

// خواندن .gitignore (اختیاری)
async function readGitignore(root) {
  try {
    const gi = await fsp.readFile(path.join(root, ".gitignore"), "utf8");
    return gi
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  } catch {
    return [];
  }
}

function shouldIgnore(relPath, ignores, gitIgnores) {
  const base = relPath.split(path.sep).join("/"); // نرمال
  const parts = base.split("/");
  // فایل/پوشه‌های مخفی
  if (
    !SHOW_HIDDEN &&
    parts.some((p) => p.startsWith(".") && p !== "." && p !== ".." && p !== ".gitignore")
  ) {
    return true;
  }

  const all = new Set([...ignores, ...gitIgnores]);
  for (const rule of all) {
    // تطبیق ساده: اگر بخش/پسوند با rule شروع شود یا برابر باشد
    if (base === rule || base.startsWith(rule + "/") || parts.includes(rule)) return true;
    // ruleهایی که با * ختم می‌شوند
    if (rule.endsWith("*")) {
      const prefix = rule.slice(0, -1);
      if (base.startsWith(prefix)) return true;
      if (parts.some((p) => p.startsWith(prefix))) return true;
    }
    // ruleهایی که با / شروع شده‌اند (نسبت به ریشه)
    if (rule.startsWith("/") && ("/" + base).startsWith(rule)) return true;
  }
  return false;
}

// ساخت درخت پوشه‌ها به‌صورت رشته
async function buildTreeString(root, ignores, gitIgnores) {
  const lines = [];
  async function walk(dir, prefix = "") {
    let entries = await fsp.readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    const visible = [];
    for (const e of entries) {
      const rel = path.relative(root, path.join(dir, e.name));
      if (shouldIgnore(rel, ignores, gitIgnores)) continue;
      visible.push(e);
    }

    for (let i = 0; i < visible.length; i++) {
      const e = visible[i];
      const isLast = i === visible.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const rel = path.relative(root, path.join(dir, e.name));
      lines.push(prefix + connector + e.name);
      if (e.isDirectory()) {
        await walk(path.join(dir, e.name), prefix + (isLast ? "    " : "│   "));
      }
    }
  }
  lines.push(path.basename(root) || ".");
  await walk(root);
  return lines.join("\n");
}

// گرفتن لیست فایل‌ها
async function collectFiles(root, ignores, gitIgnores) {
  const files = [];
  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const rel = path.relative(root, full);
      if (shouldIgnore(rel, ignores, gitIgnores)) continue;
      if (e.isDirectory()) {
        await walk(full);
      } else {
        files.push({ full, rel });
      }
    }
  }
  await walk(root);
  // مرتب‌سازی: پوشه و بعد نام
  files.sort((a, b) => a.rel.localeCompare(b.rel, undefined, { numeric: true }));
  return files;
}

function detectLang(filePath) {
  const base = path.basename(filePath);
  if (LANG_BY_EXT[base]) return LANG_BY_EXT[base];
  const ext = path.extname(filePath).toLowerCase();
  return LANG_BY_EXT[ext] || "";
}

async function readFileSafe(full) {
  try {
    const stat = await fsp.stat(full);
    if (stat.size > MAX_BYTES) {
      const buf = await fsp.readFile(full, { encoding: "utf8" });
      // اگر فایل خیلی بزرگ بود، فقط ابتدای آن را می‌آوریم
      return {
        content:
          buf.slice(0, MAX_BYTES) + `\n\n/* ... File truncated at ${MAX_BYTES} bytes ... */\n`,
      };
    }
    const content = await fsp.readFile(full, "utf8");
    return { content };
  } catch (e) {
    return { content: `/* Failed to read file: ${e.message} */` };
  }
}

async function main() {
  const root = process.cwd();
  const projectName = path.basename(root) || "project";
  const gitIgnores = await readGitignore(root);

  const tree = await buildTreeString(root, DEFAULT_IGNORES, gitIgnores);
  const files = await collectFiles(root, DEFAULT_IGNORES, gitIgnores);

  const now = new Date();
  const header = [
    `# ${projectName} – Project Export`,
    "",
    `> Generated at \`${now.toISOString()}\` on \`${os.hostname()}\``,
    "",
    "## Project Structure (tree)",
    "",
    "```text",
    tree,
    "```",
    "",
    "## Files",
    "",
  ].join("\n");

  const chunks = [header];

  for (const f of files) {
    const lang = detectLang(f.full);
    const { content } = await readFileSafe(f.full);

    // به‌صورت پیش‌فرض فایل‌های باینری را کنار می‌گذاریم (اگر کاراکترهای NULL دیدیم)
    if (/\x00/.test(content)) continue;

    chunks.push(`### \`${f.rel}\``);
    chunks.push("");
    chunks.push("```" + lang);
    chunks.push(content.replace(/\uFEFF/g, "")); // حذف BOM
    chunks.push("```");
    chunks.push("");
  }

  const outPath = path.join(root, OUT_FILE);
  await fsp.writeFile(outPath, chunks.join("\n"), "utf8");

  console.log(`✅ Exported to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
