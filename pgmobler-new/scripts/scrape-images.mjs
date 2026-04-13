/**
 * Scrape product images from pgmobler.no and save locally.
 * Also scrapes category images and site assets.
 *
 * Usage: node scripts/scrape-images.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';

const BASE_URL = 'https://pgmobler.no';
const MEDIA_DIR = join(process.cwd(), 'public', 'media');
const PRODUCT_IMG_DIR = join(MEDIA_DIR, 'product_images');
const CATEGORY_IMG_DIR = join(MEDIA_DIR, 'category_images');
const SITE_IMG_DIR = join(MEDIA_DIR, 'site');

// Create directories
[MEDIA_DIR, PRODUCT_IMG_DIR, CATEGORY_IMG_DIR, SITE_IMG_DIR].forEach(dir => {
  mkdirSync(dir, { recursive: true });
});

// Rate limiting
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PGMobler-Migration/1.0' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    console.error(`  Failed to fetch ${url}: ${e.message}`);
    return null;
  }
}

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) {
    return true; // Already downloaded
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PGMobler-Migration/1.0' }
    });
    if (!res.ok) {
      console.error(`  HTTP ${res.status} for ${url}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch (e) {
    console.error(`  Download failed ${url}: ${e.message}`);
    return false;
  }
}

function extractProductImages(html, slug) {
  // Find all image sources that are product images
  // Pattern 1: src="/media/product_images/..."
  const imgRegex = /src=["']([^"']*?\/media\/product_images\/[^"']+)["']/gi;
  const images = new Set();
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    images.add(match[1]);
  }

  // Pattern 2: data-lightbox images (href in <a> tags)
  const lightboxRegex = /href=["']([^"']*?\/media\/product_images\/[^"']+)["']/gi;
  while ((match = lightboxRegex.exec(html)) !== null) {
    images.add(match[1]);
  }

  // Pattern 3: look for the specific product section images only
  // Filter to only include images that appear in the product-page section
  // (before "related products" section)
  const productSection = html.split('Relaterte produkter')[0] || html;
  const sectionRegex = /(?:src|href)=["']([^"']*?\/media\/product_images\/[^"']+)["']/gi;
  const mainImages = new Set();
  while ((match = sectionRegex.exec(productSection)) !== null) {
    mainImages.add(match[1]);
  }

  return mainImages.size > 0 ? [...mainImages] : [...images].slice(0, 5);
}

function extractCategoryImages(html) {
  const imgRegex = /src=["']([^"']*?\/media\/category_images\/[^"']+)["']/gi;
  const images = new Set();
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.add(match[1]);
  }
  return [...images];
}

function extractSiteImages(html) {
  // Get banner, logo, header images
  const patterns = [
    /src=["']([^"']*?\/media\/[^"']+\.(?:png|jpg|jpeg|webp|avif))["']/gi,
  ];
  const images = new Set();
  for (const regex of patterns) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!match[1].includes('product_images/') && !match[1].includes('category_images/')) {
        images.add(match[1]);
      }
    }
  }
  return [...images];
}

async function main() {
  console.log('=== PG Møbler Image Scraper ===\n');

  // Get all product slugs from the database
  const dbOutput = execSync(
    'npx wrangler d1 execute pgmobler-db --local --command="SELECT id, slug, title FROM products ORDER BY id" --json',
    { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 }
  );

  const dbData = JSON.parse(dbOutput);
  const products = dbData[0].results;
  console.log(`Found ${products.length} products in database\n`);

  // Track image mappings for DB update
  const imageInserts = [];
  let totalDownloaded = 0;
  let totalFailed = 0;

  // 1. Scrape category page for category images
  console.log('--- Scraping category images ---');
  const catHtml = await fetchPage(`${BASE_URL}/categories`);
  if (catHtml) {
    const catImages = extractCategoryImages(catHtml);
    for (const imgPath of catImages) {
      const fullUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
      const filename = basename(imgPath.split('?')[0]);
      const dest = join(CATEGORY_IMG_DIR, filename);
      const ok = await downloadImage(fullUrl, dest);
      if (ok) totalDownloaded++;
      else totalFailed++;
    }
    console.log(`  Downloaded ${catImages.length} category images\n`);

    // Also grab site-level images
    const siteImages = extractSiteImages(catHtml);
    for (const imgPath of siteImages) {
      const fullUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
      const filename = basename(imgPath.split('?')[0]);
      const dest = join(SITE_IMG_DIR, filename);
      await downloadImage(fullUrl, dest);
    }
  }

  // 2. Scrape each product page
  console.log('--- Scraping product images ---');
  for (let i = 0; i < products.length; i++) {
    const { id, slug, title } = products[i];
    const url = `${BASE_URL}/product/${slug}/`;

    process.stdout.write(`[${i + 1}/${products.length}] ${title} (${slug})... `);

    const html = await fetchPage(url);
    if (!html) {
      console.log('SKIP (404 or error)');
      await sleep(200);
      continue;
    }

    const images = extractProductImages(html, slug);

    if (images.length === 0) {
      console.log('no images found');
      await sleep(200);
      continue;
    }

    let downloaded = 0;
    for (let j = 0; j < images.length; j++) {
      const imgPath = images[j];
      const fullUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
      const filename = basename(imgPath.split('?')[0]);
      const dest = join(PRODUCT_IMG_DIR, filename);

      const ok = await downloadImage(fullUrl, dest);
      if (ok) {
        downloaded++;
        totalDownloaded++;
        imageInserts.push({
          productId: id,
          imageKey: `product_images/${filename}`,
          imageUrl: `/media/product_images/${filename}`,
          sortOrder: j,
          color: null,
        });
      } else {
        totalFailed++;
      }
    }

    console.log(`${downloaded}/${images.length} images`);

    // Rate limit: 200ms between requests
    await sleep(200);
  }

  // 3. Generate SQL to insert image records
  console.log('\n--- Generating image database records ---');
  const sqlLines = ['-- Product image records', 'DELETE FROM product_images;'];
  for (const img of imageInserts) {
    const colorVal = img.color ? `'${img.color}'` : 'NULL';
    sqlLines.push(
      `INSERT INTO product_images (product_id, image_key, image_url, sort_order, color) VALUES (${img.productId}, '${img.imageKey.replace(/'/g, "''")}', '${img.imageUrl.replace(/'/g, "''")}', ${img.sortOrder}, ${colorVal});`
    );
  }

  const sqlPath = join(process.cwd(), 'scripts', 'insert-images.sql');
  writeFileSync(sqlPath, sqlLines.join('\n'));
  console.log(`Written ${imageInserts.length} image records to ${sqlPath}`);

  // 4. Apply the SQL
  console.log('\nApplying image records to database...');
  try {
    execSync(`npx wrangler d1 execute pgmobler-db --local --file=scripts/insert-images.sql`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log('Database updated successfully!');
  } catch (e) {
    console.error('Failed to apply SQL:', e.message);
  }

  // Summary
  console.log(`\n=== Summary ===`);
  console.log(`Products scraped: ${products.length}`);
  console.log(`Images downloaded: ${totalDownloaded}`);
  console.log(`Failed downloads: ${totalFailed}`);
  console.log(`Database records created: ${imageInserts.length}`);
  console.log(`\nImages saved to: ${MEDIA_DIR}`);
}

main().catch(console.error);
