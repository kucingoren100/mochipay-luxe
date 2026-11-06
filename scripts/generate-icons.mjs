// Generates kawaii mochi PWA icons (512, 192, 180) using only Node built-ins.
import zlib from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function makePng(size) {
  const w = size;
  const h = size;
  const rowLen = w * 4 + 1;
  const raw = Buffer.alloc(rowLen * h);
  const cx = w / 2;
  const cy = h / 2;
  const mochiR = w * 0.28;
  const eyeR = w * 0.022;
  const eyeOffX = w * 0.07;
  const eyeY = cy - h * 0.04;
  const cheekR = w * 0.04;
  const cheekOff = w * 0.13;
  const cheekY = cy + h * 0.02;
  const smileR = w * 0.06;
  const smileY = cy + h * 0.05;

  for (let y = 0; y < h; y += 1) {
    const rowStart = y * rowLen;
    raw[rowStart] = 0;
    for (let x = 0; x < w; x += 1) {
      const t = (x + y) / (w + h);
      let r = lerp(0xe3, 0xb8, t);
      let g = lerp(0xd7, 0xa7, t);
      let b = lerp(0xff, 0xe0, t);

      const dx = x - cx;
      const dy = y - cy;
      const nx = dx / mochiR;
      const ny = dy / mochiR;
      const blob = Math.pow(Math.abs(nx), 2.4) + Math.pow(Math.abs(ny), 2.4);
      if (blob <= 1) {
        r = 255;
        g = 252;
        b = 250;
      }

      for (const ex of [cx - eyeOffX, cx + eyeOffX]) {
        const ed = Math.sqrt((x - ex) ** 2 + (y - eyeY) ** 2);
        if (ed <= eyeR) {
          r = 0x4a;
          g = 0x3f;
          b = 0x5c;
        }
      }

      for (const chx of [cx - cheekOff, cx + cheekOff]) {
        const cd = Math.sqrt((x - chx) ** 2 + (y - cheekY) ** 2);
        if (cd <= cheekR) {
          r = 0xf4;
          g = 0xa6;
          b = 0xcd;
        }
      }

      const sdist = Math.sqrt(dx * dx + (y - smileY) ** 2);
      if (y >= smileY && sdist >= smileR - 1.5 && sdist <= smileR + 0.5) {
        r = 0x4a;
        g = 0x3f;
        b = 0x5c;
      }

      const off = rowStart + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
}

mkdirSync(iconsDir, { recursive: true });
writeFileSync(join(iconsDir, "icon-512x512.png"), makePng(512));
writeFileSync(join(iconsDir, "icon-192x192.png"), makePng(192));
writeFileSync(join(iconsDir, "apple-touch-icon.png"), makePng(180));
console.log("Icons generated: 512, 192, 180");
