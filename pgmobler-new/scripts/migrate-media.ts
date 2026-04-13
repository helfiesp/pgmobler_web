/**
 * Media Migration Script: Filesystem -> Cloudflare R2
 *
 * Uploads all media files from the Django media directory to R2.
 *
 * Usage:
 *   npx tsx scripts/migrate-media.ts --media-dir /path/to/media --bucket pgmobler-media
 *
 * Prerequisites:
 *   - wrangler must be authenticated (`wrangler login`)
 *   - R2 bucket must exist (`wrangler r2 bucket create pgmobler-media`)
 */

import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

interface MigrateOptions {
  mediaDir: string;
  bucket: string;
  dryRun: boolean;
}

function parseArgs(): MigrateOptions {
  const args = process.argv.slice(2);
  let mediaDir = "";
  let bucket = "pgmobler-media";
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--media-dir" && args[i + 1]) mediaDir = args[++i];
    if (args[i] === "--bucket" && args[i + 1]) bucket = args[++i];
    if (args[i] === "--dry-run") dryRun = true;
  }

  if (!mediaDir) {
    console.error(
      "Usage: npx tsx scripts/migrate-media.ts --media-dir <path> [--bucket <name>] [--dry-run]"
    );
    process.exit(1);
  }

  return { mediaDir, bucket, dryRun };
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
  };
  return types[ext || ""] || "application/octet-stream";
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    for (const entry of readdirSync(currentDir)) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

async function migrate() {
  const opts = parseArgs();

  console.log(`Scanning ${opts.mediaDir}...`);
  const files = getAllFiles(opts.mediaDir);
  console.log(`Found ${files.length} files\n`);

  let uploaded = 0;
  let failed = 0;

  for (const filePath of files) {
    const key = relative(opts.mediaDir, filePath).replace(/\\/g, "/");
    const contentType = getContentType(filePath);

    if (opts.dryRun) {
      console.log(`[DRY RUN] Would upload: ${key} (${contentType})`);
      uploaded++;
      continue;
    }

    try {
      execSync(
        `wrangler r2 object put "${opts.bucket}/${key}" --file="${filePath}" --content-type="${contentType}"`,
        { stdio: "pipe" }
      );
      console.log(`Uploaded: ${key}`);
      uploaded++;
    } catch (err) {
      console.error(`Failed: ${key} - ${err}`);
      failed++;
    }
  }

  console.log(
    `\nDone. Uploaded: ${uploaded}, Failed: ${failed}, Total: ${files.length}`
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
