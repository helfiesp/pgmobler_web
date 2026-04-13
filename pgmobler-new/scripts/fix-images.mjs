/**
 * Re-scrape product images correctly - only gallery images, not related products.
 * The Django site structure:
 *   - Product gallery is in a section with class "product-image-section"
 *   - Thumbnails have class "product-thumbnail"
 *   - Main image has id "main-image"
 *   - Related products are in a separate "Nye produkter" section BELOW
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';

const BASE_URL = 'https://pgmobler.no';
const PRODUCT_IMG_DIR = join(process.cwd(), 'public', 'media', 'product_images');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) return true;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PGMobler-Migration/1.0' } });
    if (!res.ok) return false;
    writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch { return false; }
}

function extractGalleryImages(html) {
  // Strategy: find only images within the product-image-section,
  // or referenced by product-thumbnail elements, or the main-image.
  // Stop before "Nye produkter" or "Relaterte" sections.

  // First, try to isolate the product image section
  // The gallery section ends before related products / "Nye produkter"
  let galleryHtml = html;

  // Cut at "Nye produkter" section or "Relaterte produkter" or the product info tabs
  const cutPoints = [
    'Nye produkter',
    'Relaterte produkter',
    'Bestselgere',
    'class="products-grid"',  // the related products grid
  ];
  for (const cut of cutPoints) {
    const idx = galleryHtml.indexOf(cut);
    if (idx > 0) {
      galleryHtml = galleryHtml.substring(0, idx);
    }
  }

  // Now extract images from this truncated HTML
  // Look for: product-thumbnail src, main-image src, lightbox href within gallery
  const images = new Set();

  // Pattern 1: thumbnail images (class="product-thumbnail")
  const thumbRegex = /class="[^"]*product-thumbnail[^"]*"[^>]*src=["']([^"']+)["']/gi;
  let match;
  while ((match = thumbRegex.exec(galleryHtml)) !== null) {
    if (match[1].includes('/media/product_images/')) {
      images.add(match[1]);
    }
  }

  // Pattern 2: src before class (img src="..." class="product-thumbnail")
  const thumbRegex2 = /src=["']([^"']+)["'][^>]*class="[^"]*product-thumbnail[^"]*"/gi;
  while ((match = thumbRegex2.exec(galleryHtml)) !== null) {
    if (match[1].includes('/media/product_images/')) {
      images.add(match[1]);
    }
  }

  // Pattern 3: main-image
  const mainRegex = /id=["']main-image["'][^>]*src=["']([^"']+)["']/gi;
  while ((match = mainRegex.exec(galleryHtml)) !== null) {
    if (match[1].includes('/media/product_images/')) {
      images.add(match[1]);
    }
  }
  const mainRegex2 = /src=["']([^"']+)["'][^>]*id=["']main-image["']/gi;
  while ((match = mainRegex2.exec(galleryHtml)) !== null) {
    if (match[1].includes('/media/product_images/')) {
      images.add(match[1]);
    }
  }

  // Pattern 4: lightbox links (a href with data-lightbox)
  const lightboxRegex = /href=["']([^"']*\/media\/product_images\/[^"']+)["'][^>]*data-lightbox/gi;
  while ((match = lightboxRegex.exec(galleryHtml)) !== null) {
    images.add(match[1]);
  }
  const lightboxRegex2 = /data-lightbox[^>]*href=["']([^"']*\/media\/product_images\/[^"']+)["']/gi;
  while ((match = lightboxRegex2.exec(galleryHtml)) !== null) {
    images.add(match[1]);
  }

  // Pattern 5: If we still have nothing, look for ALL product_images in the gallery section only
  if (images.size === 0) {
    // More aggressive: find the product-image-section specifically
    const sectionMatch = galleryHtml.match(/class="[^"]*product-image-section[^"]*"[\s\S]*?(?=class="[^"]*product-info|$)/i);
    const section = sectionMatch ? sectionMatch[0] : galleryHtml.substring(0, Math.min(galleryHtml.length, 5000));

    const allImgRegex = /(?:src|href)=["']([^"']*\/media\/product_images\/[^"']+)["']/gi;
    while ((match = allImgRegex.exec(section)) !== null) {
      images.add(match[1]);
    }
  }

  return [...images];
}

// Slug mapping (same as before)
const SLUG_MAP = {
  'carnella-3s': 'carnella', 'fossano': 'fossano-1', 'malmoe-215cm': 'malm-1',
  'kiwi-2': 'kiwi-1', 'hvile-8022': 'hjort-knudsen-8022', 'country-hoy': 'country-hy',
  'cuba': 'cuba-1', 'elegance-100x200': 'elegance-100x240',
  'orn-rundt': 'rn-rundt-spisebord-1', 'orn-220': 'rn-220',
  'gro-o120': 'gro-120-spisebord', 'gro-o140': 'gro-140-spisebord',
  'thor-spisebord-o115': 'thor-spisebord-115', 'caso-701-langbord': 'cas-701-langbord',
  'tucan-120-kjokkenbord': 'tucan-110-kjkkenbord', 'ashton-o135cm': 'ashton',
  'sweet-seat-stoff': 'sweet-seat', 'maddox-armlen': 'maddox-1',
  'sweet-seat-lav': 'sweet-seat-1', 'james-spisestol': 'james-med-armlen',
  'annie': 'annie-hy', 'bristol-armlen': 'bristol-1', 'thor-6': 'thor-2',
  'ravn-80-65': 'ravn-80cm65cm', 'caso-502-sofabord': 'cas-502-sofabord',
  'caso-500-o80': 'cas-500-80cm', 'caso-500-o60': 'cas-500-60cm',
  'hauk-130-60-60': 'hauk-1306060', 'hauk-80-60-60': 'hauk-806060',
  'ani-80-50': 'ani-8050', 'ani-40-50-60-80': 'ani-40506080',
  'fossekall-80-50': 'fossekall-8050', 'fossekall-40-50-60': 'fossekall-40506080',
  'ara-80-60': 'ara-8060', 'tucan-skjenk': 'tucan-skjenk-1',
  'bonzo': 'lenestol', 'geilo-bokhylle': 'geilo', 'mood-bokhylle': 'mood',
  'caso-777-skjenk': 'cas-777-skjenk', 'broholm-xl': 'broholm-tv-benk-stor',
  'caso-700': 'cas-700-tv-bord', 'caso-501-tv-benk': 'cas-500-tv-benk',
  'caso-901-skjenk': 'cas-901-skjenk', 'caso-900-skjenk': 'cas-900-skjenk',
  'mood-skjenk': 'mood-1', 'caso-500-skrivebord': 'cas-500-skrivebord',
  'mood-konsollbord': 'mood-2', 'verona-spisesofa': 'verona-1',
  'caso-900-vitrine': 'cas-900-vitrine', 'lean-back': 'stol-lean-back',
  'de-kontinentalseng': 'de-kontinentalseng-1', 'dc-kontinentalseng': 'dc-kontinentalseng-1',
  'dream-delight-kontinental': 'dream-delight-kontinental-1',
  'vendbare-madrasser': 'vendbare-madrasser-1',
  'josefine-kontinentalseng': 'josefine-kontinentalseng-1',
  'sofie-kontinentalseng': 'sofie-kontinentalseng-1',
  'veslemoy-kontinentalseng': 'veslemy-kontinentalseng-1',
  'vendbare-madrasser-etter-mal': 'vendbare-madrasser-etter-mal-1',
  'overmadrasser': 'overmadrasser-60-cm-latex-kjerne',
  'familiekoye': 'familiekye', 'karma-exclusive-pernille': 'pernille-kontintalseng-1',
  'karma-lux-veslemoy': 'veslemy-kontinental-1',
  'karma-lux-evelyn': 'evelyn-regulerbar-seng', 'symphony': 'syphony',
  'garderobeskap': 'garderobeskap-1', 'hovik-kommode': 'hvik-kommode-1',
  'nattbord-hytte': 'nattbord-1', 'mood-tv-benk': 'mood-3',
  'mood-salongbord-130': 'mood-4', 'mood-salongbord-sett': 'mood-5',
  'mood-sidebord': 'moo',
};

async function main() {
  console.log('=== Re-scraping product images (gallery only) ===\n');

  const dbOutput = execSync(
    'npx wrangler d1 execute pgmobler-db --local --command="SELECT id, slug, title FROM products ORDER BY id" --json',
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );
  const products = JSON.parse(dbOutput)[0].results;

  const imageInserts = [];
  let scraped = 0, skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const { id, slug, title } = products[i];

    // Determine the live site slug
    let liveSlug = slug;
    if (SLUG_MAP[slug] !== undefined) {
      if (SLUG_MAP[slug] === null) { skipped++; continue; }
      liveSlug = SLUG_MAP[slug];
    }

    const url = `${BASE_URL}/product/${liveSlug}/`;
    process.stdout.write(`[${i + 1}/${products.length}] ${title}... `);

    const res = await fetch(url, { headers: { 'User-Agent': 'PGMobler-Migration/1.0' } });
    if (!res.ok) {
      console.log('404');
      skipped++;
      await sleep(150);
      continue;
    }

    const html = await res.text();
    const images = extractGalleryImages(html);

    if (images.length === 0) {
      console.log('0 gallery images');
      skipped++;
    } else {
      let ok = 0;
      for (let j = 0; j < images.length; j++) {
        const imgPath = images[j];
        const fullUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
        const filename = basename(imgPath.split('?')[0]);
        const dest = join(PRODUCT_IMG_DIR, filename);
        if (await downloadImage(fullUrl, dest)) {
          ok++;
          imageInserts.push({
            productId: id,
            imageKey: `product_images/${filename}`,
            imageUrl: `/media/product_images/${filename}`,
            sortOrder: j,
          });
        }
      }
      console.log(`${ok} images`);
      scraped++;
    }

    await sleep(150);
  }

  // Clear old image records and insert new ones
  console.log(`\nClearing old image records and inserting ${imageInserts.length} new ones...`);

  const sqlLines = ['DELETE FROM product_images;'];
  for (const img of imageInserts) {
    sqlLines.push(
      `INSERT INTO product_images (product_id, image_key, image_url, sort_order, color) VALUES (${img.productId}, '${img.imageKey.replace(/'/g, "''")}', '${img.imageUrl.replace(/'/g, "''")}', ${img.sortOrder}, NULL);`
    );
  }

  writeFileSync('scripts/fix-images.sql', sqlLines.join('\n'));
  execSync('npx wrangler d1 execute pgmobler-db --local --file=scripts/fix-images.sql', { stdio: 'pipe' });

  console.log(`\nDone! Scraped: ${scraped}, Skipped: ${skipped}, Image records: ${imageInserts.length}`);
}

main().catch(console.error);
