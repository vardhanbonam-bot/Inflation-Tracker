const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const iconSvgPath = path.join(publicDir, 'icon.svg');
  const coverSvgPath = path.join(publicDir, 'cover-logo.svg');

  console.log('Reading icon.svg & cover-logo.svg...');
  const iconSvgBuffer = fs.readFileSync(iconSvgPath);
  const coverSvgBuffer = fs.readFileSync(coverSvgPath);

  // 1. Generate pwa-512x512.png
  console.log('Generating pwa-512x512.png...');
  await sharp(iconSvgBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 2. Generate pwa-192x192.png
  console.log('Generating pwa-192x192.png...');
  await sharp(iconSvgBuffer)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. Generate apple-touch-icon.png (180x180)
  console.log('Generating apple-touch-icon.png...');
  await sharp(iconSvgBuffer)
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. Generate maskable icon (safe zone padded)
  console.log('Generating pwa-maskable-512x512.png...');
  const paddedIcon = await sharp(iconSvgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 9, g: 13, b: 22, alpha: 1 }
    }
  })
    .composite([{ input: paddedIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. Generate cover-logo.png & og-image.png (1200x630)
  console.log('Generating cover-logo.png & og-image.png...');
  await sharp(coverSvgBuffer)
    .resize(1200, 630)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'cover-logo.png'));

  await sharp(coverSvgBuffer)
    .resize(1200, 630)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('All icons and cover images successfully generated!');
}

main().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
