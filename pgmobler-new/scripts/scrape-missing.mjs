/**
 * Scrape images for products that had 404s by trying alternate slug formats.
 * Also fetches additional products from the live site not in our DB yet.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';

const BASE_URL = 'https://pgmobler.no';
const PRODUCT_IMG_DIR = join(process.cwd(), 'public', 'media', 'product_images');
mkdirSync(PRODUCT_IMG_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) return true;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'PGMobler-Migration/1.0' } });
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch { return false; }
}

function extractProductImages(html) {
  const productSection = html.split('Relaterte produkter')[0] || html;
  const regex = /(?:src|href)=["']([^"']*?\/media\/product_images\/[^"']+)["']/gi;
  const images = new Set();
  let match;
  while ((match = regex.exec(productSection)) !== null) images.add(match[1]);
  return [...images];
}

// Map our DB slugs to actual live site slugs
const SLUG_MAP = {
  'carnella-3s': 'carnella',
  'fossano': 'fossano-1',
  'malmoe-215cm': 'malm-1',
  'kiwi-2': 'kiwi-1',
  'hvile-8022': 'hjort-knudsen-8022',
  'country-hoy': 'country-hy',
  'cuba': 'cuba-1',
  'elegance-100x200': 'elegance-100x240',
  'orn-rundt': 'rn-rundt-spisebord-1',
  'orn-220': 'rn-220',
  'gro-o120': 'gro-120-spisebord',
  'gro-o140': 'gro-140-spisebord',
  'thor-spisebord-o115': 'thor-spisebord-115',
  'caso-701-langbord': 'cas-701-langbord',
  'tucan-120-kjokkenbord': 'tucan-110-kjkkenbord',
  'ashton-o135cm': 'ashton',
  'sweet-seat-stoff': 'sweet-seat',
  'maddox-armlen': 'maddox-1',
  'sweet-seat-lav': 'sweet-seat-1',
  'james-spisestol': 'james-med-armlen',
  'annie': 'annie-hy',
  'bristol-armlen': 'bristol-1',
  'sweet-seat-treverk': null,
  'thor-6': 'thor-2',
  'ravn-80-65': 'ravn-80cm65cm',
  'caso-502-sofabord': 'cas-502-sofabord',
  'caso-500-o80': 'cas-500-80cm',
  'caso-500-o60': 'cas-500-60cm',
  'hauk-130-60-60': 'hauk-1306060',
  'hauk-80-60-60': 'hauk-806060',
  'ani-80-50': 'ani-8050',
  'ani-40-50-60-80': 'ani-40506080',
  'fossekall-80-50': 'fossekall-8050',
  'fossekall-40-50-60': 'fossekall-40506080',
  'ara-80-60': 'ara-8060',
  'tucan-skjenk': 'tucan-skjenk-1',
  'bonzo': 'lenestol',
  'great-dane-stol': null,
  'geilo-bokhylle': 'geilo',
  'mood-bokhylle': 'mood',
  'caso-777-skjenk': 'cas-777-skjenk',
  'broholm-xl': 'broholm-tv-benk-stor',
  'caso-700': 'cas-700-tv-bord',
  'caso-501-tv-benk': 'cas-500-tv-benk',
  'caso-901-skjenk': 'cas-901-skjenk',
  'caso-900-skjenk': 'cas-900-skjenk',
  'mood-skjenk': 'mood-1',
  'caso-500-skrivebord': 'cas-500-skrivebord',
  'mood-konsollbord': 'mood-2',
  'verona-spisesofa': 'verona-1',
  'caso-900-vitrine': 'cas-900-vitrine',
  'lean-back': 'stol-lean-back',
  'de-kontinentalseng': 'de-kontinentalseng-1',
  'dc-kontinentalseng': 'dc-kontinentalseng-1',
  'dream-delight-kontinental': 'dream-delight-kontinental-1',
  'vendbare-madrasser': 'vendbare-madrasser-1',
  'josefine-kontinentalseng': 'josefine-kontinentalseng-1',
  'sofie-kontinentalseng': 'sofie-kontinentalseng-1',
  'veslemoy-kontinentalseng': 'veslemy-kontinentalseng-1',
  'vendbare-madrasser-etter-mal': 'vendbare-madrasser-etter-mal-1',
  'overmadrasser': 'overmadrasser-60-cm-latex-kjerne',
  'familiekoye': 'familiekye',
  'karma-exclusive-pernille': 'pernille-kontintalseng-1',
  'karma-lux-veslemoy': 'veslemy-kontinental-1',
  'karma-lux-evelyn': 'evelyn-regulerbar-seng',
  'symphony': 'syphony',
  'garderobeskap': 'garderobeskap-1',
  'hovik-kommode': 'hvik-kommode-1',
  'nattbord-hytte': 'nattbord-1',
  'mood-tv-benk': 'mood-3',
  'mood-salongbord-130': 'mood-4',
  'mood-salongbord-sett': 'mood-5',
  'mood-sidebord': 'moo',
};

async function main() {
  // Get products that had no images
  const dbOutput = execSync(
    `npx wrangler d1 execute pgmobler-db --local --command="SELECT p.id, p.slug, p.title FROM products p LEFT JOIN product_images pi ON p.id = pi.product_id WHERE pi.id IS NULL ORDER BY p.id" --json`,
    { encoding: 'utf-8', maxBuffer: 10*1024*1024 }
  );
  const missing = JSON.parse(dbOutput)[0].results;
  console.log(`${missing.length} products missing images\n`);

  const imageInserts = [];
  let downloaded = 0;

  for (const { id, slug, title } of missing) {
    const liveSlug = SLUG_MAP[slug];
    if (liveSlug === null) {
      console.log(`[${id}] ${title} — no live slug mapping, skipping`);
      continue;
    }
    if (liveSlug === undefined) {
      console.log(`[${id}] ${title} (${slug}) — no mapping found, skipping`);
      continue;
    }

    const url = `${BASE_URL}/product/${liveSlug}/`;
    process.stdout.write(`[${id}] ${title} (${liveSlug})... `);

    const res = await fetch(url, { headers: { 'User-Agent': 'PGMobler-Migration/1.0' } });
    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      await sleep(200);
      continue;
    }

    const html = await res.text();
    const images = extractProductImages(html);

    if (images.length === 0) {
      console.log('no images');
      await sleep(200);
      continue;
    }

    let count = 0;
    for (let j = 0; j < images.length; j++) {
      const imgPath = images[j];
      const fullUrl = imgPath.startsWith('http') ? imgPath : `${BASE_URL}${imgPath}`;
      const filename = basename(imgPath.split('?')[0]);
      const dest = join(PRODUCT_IMG_DIR, filename);
      const ok = await downloadImage(fullUrl, dest);
      if (ok) {
        count++;
        downloaded++;
        imageInserts.push({ productId: id, imageKey: `product_images/${filename}`, imageUrl: `/media/product_images/${filename}`, sortOrder: j });
      }
    }
    console.log(`${count} images`);
    await sleep(200);
  }

  // Write and apply SQL
  if (imageInserts.length > 0) {
    const sql = imageInserts.map(img =>
      `INSERT INTO product_images (product_id, image_key, image_url, sort_order, color) VALUES (${img.productId}, '${img.imageKey}', '${img.imageUrl}', ${img.sortOrder}, NULL);`
    ).join('\n');

    writeFileSync('scripts/insert-missing-images.sql', sql);
    execSync('npx wrangler d1 execute pgmobler-db --local --file=scripts/insert-missing-images.sql', { stdio: 'pipe' });
    console.log(`\nInserted ${imageInserts.length} new image records`);
  }

  console.log(`\nTotal new images downloaded: ${downloaded}`);
}

main().catch(console.error);
