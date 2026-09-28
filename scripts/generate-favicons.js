const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_IMAGE = path.join(ROOT, 'public', 'images', 'emanon.png');

function createDibEntry(rawRgbaBuffer, size) {
  const xorSize = size * size * 4;
  const andRowBytes = Math.ceil(size / 32) * 4;
  const andSize = andRowBytes * size;
  const dibSize = 40 + xorSize + andSize;
  const dib = Buffer.alloc(dibSize);

  // BITMAPINFOHEADER (40 bytes)
  dib.writeUInt32LE(40, 0);                 // biSize
  dib.writeInt32LE(size, 4);                // biWidth
  dib.writeInt32LE(size * 2, 8);            // biHeight (XOR + AND mask)
  dib.writeUInt16LE(1, 12);                 // biPlanes
  dib.writeUInt16LE(32, 14);                // biBitCount (32 bpp BGRA)
  dib.writeUInt32LE(0, 16);                 // biCompression (BI_RGB)
  dib.writeUInt32LE(xorSize + andSize, 20); // biSizeImage
  dib.writeInt32LE(0, 24);                  // biXPelsPerMeter
  dib.writeInt32LE(0, 28);                  // biYPelsPerMeter
  dib.writeUInt32LE(0, 32);                 // biClrUsed
  dib.writeUInt32LE(0, 36);                 // biClrImportant

  // XOR mask: bottom-to-top, BGRA order
  let dibOffset = 40;
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      dib[dibOffset++] = rawRgbaBuffer[srcIdx + 2]; // Blue
      dib[dibOffset++] = rawRgbaBuffer[srcIdx + 1]; // Green
      dib[dibOffset++] = rawRgbaBuffer[srcIdx];     // Red
      dib[dibOffset++] = rawRgbaBuffer[srcIdx + 3]; // Alpha
    }
  }

  // AND mask: bottom-to-top, 1-bit per pixel (1 = transparent, 0 = opaque)
  for (let y = size - 1; y >= 0; y--) {
    const rowStart = dibOffset;
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const alpha = rawRgbaBuffer[srcIdx + 3];
      if (alpha < 128) {
        const byteIdx = rowStart + Math.floor(x / 8);
        const bitIdx = 7 - (x % 8);
        dib[byteIdx] |= (1 << bitIdx);
      }
    }
    dibOffset += andRowBytes;
  }

  return dib;
}

function assembleIco(items) {
  // items: array of { size, isDib, buf }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // Reserved (must be 0)
  header.writeUInt16LE(1, 2);            // Image type: 1 = ICO
  header.writeUInt16LE(items.length, 4); // Number of images

  let currentOffset = 6 + 16 * items.length;
  const dirEntries = [];

  for (const item of items) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0); // Width
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1); // Height
    entry.writeUInt8(0, 2);                                  // Color palette count
    entry.writeUInt8(0, 3);                                  // Reserved
    entry.writeUInt16LE(1, 4);                               // Color planes
    entry.writeUInt16LE(32, 6);                              // Bits per pixel
    entry.writeUInt32LE(item.buf.length, 8);                 // Resource size
    entry.writeUInt32LE(currentOffset, 12);                  // Resource offset
    dirEntries.push(entry);
    currentOffset += item.buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...items.map(i => i.buf)]);
}

async function main() {
  console.log('Generating website favicons and icons from:', SOURCE_IMAGE);

  if (!fs.existsSync(SOURCE_IMAGE)) {
    throw new Error('Source logo not found at: ' + SOURCE_IMAGE);
  }

  // 1. Trim transparency around the logo for maximum clarity in small icons
  const trimmedBuffer = await sharp(SOURCE_IMAGE).trim().toBuffer();
  console.log('Logo trimmed to non-transparent bounds.');

  // Helper for generating transparent centered PNG
  async function makeTransparentSquare(size, paddingPercent = 0.05) {
    const innerSize = Math.max(1, Math.round(size * (1 - paddingPercent * 2)));
    const resizedInner = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedInner, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  // Helper for solid/cream background icon (Apple Touch / PWA Maskable)
  async function makeSolidSquare(size, bgColor = '#F5F0E8', paddingPercent = 0.15) {
    const innerSize = Math.max(1, Math.round(size * (1 - paddingPercent * 2)));
    const resizedInner = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgColor
      }
    })
      .composite([{ input: resizedInner, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  // Generate PNG buffers for ICO
  const icoSizes = [16, 32, 48];
  const icoItems = [];

  for (const s of icoSizes) {
    // For small sizes, 0 padding ensures max crispness
    const pad = s <= 16 ? 0.02 : 0.05;
    const pngBuf = await makeTransparentSquare(s, pad);
    const rawBuf = await sharp(pngBuf).raw().toBuffer();
    const dibBuf = createDibEntry(rawBuf, s);
    icoItems.push({ size: s, buf: dibBuf });
  }

  // 256x256 PNG frame inside ICO
  const png256 = await makeTransparentSquare(256, 0.06);
  icoItems.push({ size: 256, buf: png256 });

  const icoBuffer = assembleIco(icoItems);

  // Write favicon.ico to both src/app/ and public/
  const appFaviconPath = path.join(ROOT, 'src', 'app', 'favicon.ico');
  const publicFaviconPath = path.join(ROOT, 'public', 'favicon.ico');
  fs.writeFileSync(appFaviconPath, icoBuffer);
  fs.writeFileSync(publicFaviconPath, icoBuffer);
  console.log(`Saved favicon.ico (${icoBuffer.length} bytes) to:\n  - ${appFaviconPath}\n  - ${publicFaviconPath}`);

  // Write standard standalone PNG favicons
  const pngFavicons = [
    { size: 16, pad: 0.02, file: 'favicon-16x16.png' },
    { size: 32, pad: 0.04, file: 'favicon-32x32.png' },
    { size: 48, pad: 0.05, file: 'favicon-48x48.png' },
    { size: 192, pad: 0.08, file: 'icon-192.png' },
    { size: 512, pad: 0.08, file: 'icon-512.png' }
  ];

  for (const item of pngFavicons) {
    const buf = await makeTransparentSquare(item.size, item.pad);
    const outPath = path.join(ROOT, 'public', item.file);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved public/${item.file} (${buf.length} bytes)`);
  }

  // Next.js App Router metadata icons: src/app/icon.png and public/icon.png
  const appIconBuf = await makeTransparentSquare(512, 0.08);
  fs.writeFileSync(path.join(ROOT, 'src', 'app', 'icon.png'), appIconBuf);
  fs.writeFileSync(path.join(ROOT, 'public', 'icon.png'), appIconBuf);
  console.log(`Saved src/app/icon.png & public/icon.png (${appIconBuf.length} bytes)`);

  // Apple Touch Icon (180x180):
  // With editorial warm background (#F5F0E8) to ensure stunning display on iOS home screens without black background
  const appleIconBuf = await makeSolidSquare(180, '#F5F0E8', 0.14);
  fs.writeFileSync(path.join(ROOT, 'src', 'app', 'apple-icon.png'), appleIconBuf);
  fs.writeFileSync(path.join(ROOT, 'public', 'apple-touch-icon.png'), appleIconBuf);
  console.log(`Saved src/app/apple-icon.png & public/apple-touch-icon.png (${appleIconBuf.length} bytes)`);

  // Maskable icon for PWA (512x512 with safe area margin on brand cream)
  const maskableIconBuf = await makeSolidSquare(512, '#F5F0E8', 0.18);
  fs.writeFileSync(path.join(ROOT, 'public', 'icon-maskable-512.png'), maskableIconBuf);
  console.log(`Saved public/icon-maskable-512.png (${maskableIconBuf.length} bytes)`);

  console.log('All favicons and icons successfully generated!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
