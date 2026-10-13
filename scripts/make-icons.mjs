import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'public', 'icon.svg');

await sharp(src).resize(192, 192).png().toFile(path.join(root, 'public', 'icon-192.png'));
await sharp(src).resize(512, 512).png().toFile(path.join(root, 'public', 'icon-512.png'));
// maskable: icon centered on solid background with padding
const padded = await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#0a1628' },
})
  .composite([{ input: await sharp(src).resize(384, 384).png().toBuffer(), gravity: 'center' }])
  .png()
  .toBuffer();
await sharp(padded).toFile(path.join(root, 'public', 'icon-maskable-512.png'));
console.log('icons generated');
