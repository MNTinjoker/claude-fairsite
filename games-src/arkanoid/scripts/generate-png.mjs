import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// CRC32 Table for PNG generation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function encodeRGBAtoPNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowStride = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowStride));
  for (let y = 0; y < height; y++) {
    const rawOffset = y * (1 + rowStride);
    rawData[rawOffset] = 0;
    rgbaBuffer.copy(rawData, rawOffset + 1, y * rowStride, (y + 1) * rowStride);
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// High-fidelity procedural renderer for Arkanoid Retro Arcade icon
function renderArkanoidIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);

  const blendPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= size || y < 0 || y >= size || a <= 0) return;
    const idx = (y * size + x) * 4;
    const bgA = rgba[idx + 3] / 255;
    const fgA = Math.min(1, Math.max(0, a / 255));
    const outA = fgA + bgA * (1 - fgA);
    if (outA > 0) {
      rgba[idx] = Math.round((r * fgA + rgba[idx] * bgA * (1 - fgA)) / outA);
      rgba[idx + 1] = Math.round((g * fgA + rgba[idx + 1] * bgA * (1 - fgA)) / outA);
      rgba[idx + 2] = Math.round((b * fgA + rgba[idx + 2] * bgA * (1 - fgA)) / outA);
      rgba[idx + 3] = Math.round(outA * 255);
    }
  };

  const scale = size / 512;
  const cornerRadius = size * 0.22;

  // 1. Full-Bleed Deep Space Cosmos Gradient Background (for seamless PWA home screen)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Radial Deep Space Nebula from upper center
      const nx = x / size - 0.5;
      const ny = y / size - 0.35;
      const radDist = Math.hypot(nx, ny);

      // Deep dark indigo / violet nebula core fading to pitch black
      const t = Math.min(1, radDist * 1.5);
      const r = Math.round(30 * (1 - t) + 4 * t);
      const g = Math.round(24 * (1 - t) + 6 * t);
      const b = Math.round(80 * (1 - t) + 16 * t);

      blendPixel(x, y, r, g, b, 255);
    }
  }

  // 2. Cyber Horizon Grid Floor
  for (let y = Math.round(size * 0.55); y < Math.round(size * 0.95); y++) {
    const tFloor = (y - size * 0.55) / (size * 0.4);
    // Horizontal crossbars
    if (Math.abs(y - Math.round(size * 0.62)) < 1 ||
        Math.abs(y - Math.round(size * 0.70)) < 1 ||
        Math.abs(y - Math.round(size * 0.80)) < 1 ||
        Math.abs(y - Math.round(size * 0.92)) < 1) {
      for (let x = Math.round(size * 0.1); x < Math.round(size * 0.9); x++) {
        blendPixel(x, y, 56, 189, 248, Math.round(90 * tFloor));
      }
    }
  }

  // Converging perspective lines
  for (let angle = -3; angle <= 3; angle++) {
    const startX = size * 0.5;
    const startY = size * 0.52;
    const endX = size * 0.5 + angle * (size * 0.14);
    const endY = size * 0.95;
    const steps = Math.round(size * 0.45);
    for (let step = 0; step < steps; step++) {
      const prog = step / steps;
      const px = Math.round(startX + (endX - startX) * prog);
      const py = Math.round(startY + (endY - startY) * prog);
      blendPixel(px, py, 56, 189, 248, Math.round(70 * prog));
    }
  }

  // 3. Arcade Stars and Twinkles
  const stars = [
    [0.16, 0.17, 2.0], [0.84, 0.16, 2.5], [0.24, 0.42, 1.5],
    [0.78, 0.38, 2.0], [0.12, 0.32, 1.2], [0.86, 0.28, 1.8]
  ];
  for (const [sx, sy, sr] of stars) {
    const cx = Math.round(sx * size);
    const cy = Math.round(sy * size);
    const rad = Math.max(1, Math.round(sr * scale));
    for (let dy = -rad - 1; dy <= rad + 1; dy++) {
      for (let dx = -rad - 1; dx <= rad + 1; dx++) {
        const d = Math.hypot(dx, dy);
        if (d <= rad) {
          blendPixel(cx + dx, cy + dy, 255, 255, 255, 240);
        } else if (d <= rad + 1.2) {
          blendPixel(cx + dx, cy + dy, 56, 189, 248, 110);
        }
      }
    }
  }

  // 4. 3D Beveled Arcade Bricks
  const drawBeveledBrick = (bx, by, bw, bh, colTop, colMid, colBot, isShattered = false) => {
    for (let y = by; y < by + bh; y++) {
      for (let x = bx; x < bx + bw; x++) {
        const ty = (y - by) / bh;
        let r, g, b;
        if (ty < 0.5) {
          const tSub = ty / 0.5;
          r = Math.round(colTop[0] * (1 - tSub) + colMid[0] * tSub);
          g = Math.round(colTop[1] * (1 - tSub) + colMid[1] * tSub);
          b = Math.round(colTop[2] * (1 - tSub) + colMid[2] * tSub);
        } else {
          const tSub = (ty - 0.5) / 0.5;
          r = Math.round(colMid[0] * (1 - tSub) + colBot[0] * tSub);
          g = Math.round(colMid[1] * (1 - tSub) + colBot[1] * tSub);
          b = Math.round(colMid[2] * (1 - tSub) + colBot[2] * tSub);
        }

        // Specular Top Rim Bevel
        if (y === by || y === by + 1) {
          blendPixel(x, y, 255, 255, 255, 220);
        } else if (x === bx) {
          blendPixel(x, y, Math.min(255, r + 70), Math.min(255, g + 70), Math.min(255, b + 70), 220);
        } else if (y >= by + bh - 2 || x >= bx + bw - 1) {
          blendPixel(x, y, Math.max(0, r - 70), Math.max(0, g - 70), Math.max(0, b - 70), 220);
        } else {
          blendPixel(x, y, r, g, b, 255);
        }
      }
    }
  };

  const brickW = Math.round(86 * scale);
  const brickH = Math.round(30 * scale);
  const gap = Math.round(8 * scale);
  const startX = Math.round(68 * scale);

  // Row 1: Gold / Yellow
  for (let i = 0; i < 4; i++) {
    const bx = startX + i * (brickW + gap);
    const by = Math.round(74 * scale);
    drawBeveledBrick(bx, by, brickW, brickH, [254, 240, 138], [250, 204, 21], [161, 98, 7]);
  }

  // Row 2: Neon Magenta & Electric Cyan
  for (let i = 0; i < 4; i++) {
    const bx = startX + i * (brickW + gap);
    const by = Math.round(74 * scale + (brickH + gap));
    if (i < 2) {
      drawBeveledBrick(bx, by, brickW, brickH, [251, 207, 232], [244, 114, 182], [157, 23, 77]);
    } else {
      drawBeveledBrick(bx, by, brickW, brickH, [207, 250, 254], [56, 189, 248], [3, 105, 161]);
    }
  }

  // Row 3: Emerald Green, Chrome Silver, Exploding Ruby
  for (let i = 0; i < 4; i++) {
    const bx = startX + i * (brickW + gap);
    const by = Math.round(74 * scale + 2 * (brickH + gap));
    if (i === 0) {
      drawBeveledBrick(bx, by, brickW, brickH, [187, 247, 208], [74, 222, 128], [21, 128, 61]);
    } else if (i === 1) {
      drawBeveledBrick(bx, by, brickW, brickH, [255, 255, 255], [148, 163, 184], [51, 65, 85]);
    } else if (i === 2) {
      // Exploding Ruby Brick: fragments
      for (let frag = 0; frag < 6; frag++) {
        const fx = bx + Math.round((frag % 3) * (brickW / 3) + (frag === 1 ? -4 : 4));
        const fy = by + Math.round(Math.floor(frag / 3) * (brickH / 2) + (frag > 2 ? 6 : -2));
        const fw = Math.round(brickW * 0.28);
        const fh = Math.round(brickH * 0.38);
        drawBeveledBrick(fx, fy, fw, fh, [254, 202, 202], [239, 68, 68], [153, 27, 27]);
      }
    } else {
      drawBeveledBrick(bx, by, brickW, brickH, [254, 202, 202], [248, 113, 113], [185, 28, 28]);
    }
  }

  // Flying Shards & Sparks
  const sparks = [
    [0.55, 0.38, 3, [253, 224, 71]],
    [0.62, 0.41, 2.5, [248, 113, 113]],
    [0.58, 0.43, 2, [255, 255, 255]],
    [0.51, 0.40, 2, [56, 189, 248]],
  ];
  for (const [spx, spy, spr, col] of sparks) {
    const cx = Math.round(spx * size);
    const cy = Math.round(spy * size);
    const rad = Math.max(1, Math.round(spr * scale));
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (dx * dx + dy * dy <= rad * rad) {
          blendPixel(cx + dx, cy + dy, col[0], col[1], col[2], 250);
        }
      }
    }
  }

  // 5. Dynamic Motion Trail of Ball
  const trailStartX = Math.round(250 * scale);
  const trailStartY = Math.round(355 * scale);
  const ballTargetX = Math.round(282 * scale);
  const ballTargetY = Math.round(222 * scale);

  for (let step = 0; step < 60; step++) {
    const prog = step / 60;
    const tx = Math.round(trailStartX + (ballTargetX - trailStartX) * prog);
    const ty = Math.round(trailStartY + (ballTargetY - trailStartY) * prog);
    const spread = Math.round((3 + 12 * prog) * scale);
    for (let dy = -spread; dy <= spread; dy++) {
      for (let dx = -spread; dx <= spread; dx++) {
        const d = Math.hypot(dx, dy);
        if (d <= spread) {
          const a = Math.round((1 - d / spread) * (prog * 160));
          blendPixel(tx + dx, ty + dy, 56, 189, 248, a);
        }
      }
    }
  }

  // 6. Glowing Energy Plasma Ball
  const ballX = ballTargetX;
  const ballY = ballTargetY;
  const ballR = Math.max(6, Math.round(20 * scale));
  const ballAura = Math.round(ballR * 2.2);

  // Outer Bloom Flare
  for (let dy = -ballAura; dy <= ballAura; dy++) {
    for (let dx = -ballAura; dx <= ballAura; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= ballAura) {
        const a = Math.round(Math.pow(1 - d / ballAura, 2) * 190);
        blendPixel(ballX + dx, ballY + dy, 56, 189, 248, a);
      }
    }
  }

  // Core Plasma Sphere
  for (let dy = -ballR; dy <= ballR; dy++) {
    for (let dx = -ballR; dx <= ballR; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= ballR) {
        // Light source at upper-left of ball
        const lightDist = Math.hypot(dx + ballR * 0.35, dy + ballR * 0.35);
        const normLight = Math.min(1, lightDist / (ballR * 1.4));
        const r = Math.round(255 * (1 - normLight) + 2 * normLight);
        const g = Math.round(255 * (1 - normLight) + 132 * normLight);
        const b = Math.round(255 * (1 - normLight) + 199 * normLight);

        // Edge antialias
        const edgeA = d > ballR - 1 ? Math.round((ballR - d) * 255) : 255;
        blendPixel(ballX + dx, ballY + dy, r, g, b, edgeA);
      }
    }
  }

  // Hot white specular flare on ball
  const flareR = Math.max(2, Math.round(6 * scale));
  const flareX = ballX - Math.round(ballR * 0.35);
  const flareY = ballY - Math.round(ballR * 0.35);
  for (let dy = -flareR; dy <= flareR; dy++) {
    for (let dx = -flareR; dx <= flareR; dx++) {
      if (dx * dx + dy * dy <= flareR * flareR) {
        blendPixel(flareX + dx, flareY + dy, 255, 255, 255, 245);
      }
    }
  }

  // 7. Iconic Vaus Spacecraft Paddle
  const paddleW = Math.round(320 * scale);
  const paddleH = Math.round(32 * scale);
  const paddleX = Math.round((size - paddleW) / 2);
  const paddleY = Math.round(382 * scale);
  const pCorner = Math.round(paddleH / 2);

  // Thruster plume glow under paddle
  const plumeH = Math.round(24 * scale);
  for (let dy = 0; dy < plumeH; dy++) {
    const tPlume = dy / plumeH;
    const currentW = Math.round((paddleW * 0.8) * (1 - tPlume * 0.4));
    const startPx = paddleX + Math.round((paddleW - currentW) / 2);
    for (let x = startPx; x < startPx + currentW; x++) {
      const alpha = Math.round((1 - tPlume) * 140);
      blendPixel(x, paddleY + paddleH + dy, 56, 189, 248, alpha);
    }
  }

  // Metallic Paddle Hull
  for (let y = paddleY; y < paddleY + paddleH; y++) {
    for (let x = paddleX; x < paddleX + paddleW; x++) {
      // Round end caps
      let distCap = 0;
      if (x < paddleX + pCorner) distCap = Math.hypot(x - (paddleX + pCorner), y - (paddleY + pCorner));
      else if (x > paddleX + paddleW - pCorner) distCap = Math.hypot(x - (paddleX + paddleW - pCorner), y - (paddleY + pCorner));

      if (distCap > pCorner) continue;

      const tShade = (y - paddleY) / paddleH;
      // High-contrast chrome luster
      let r, g, b;
      if (tShade < 0.2) {
        r = 255; g = 255; b = 255; // Specular chrome highlight
      } else if (tShade < 0.5) {
        const sub = (tShade - 0.2) / 0.3;
        r = Math.round(230 * (1 - sub) + 148 * sub);
        g = Math.round(240 * (1 - sub) + 163 * sub);
        b = Math.round(250 * (1 - sub) + 184 * sub);
      } else {
        const sub = (tShade - 0.5) / 0.5;
        r = Math.round(148 * (1 - sub) + 15 * sub);
        g = Math.round(163 * (1 - sub) + 23 * sub);
        b = Math.round(184 * (1 - sub) + 42 * sub);
      }

      blendPixel(x, y, r, g, b, 255);
    }
  }

  // Cyan rim around paddle
  for (let x = paddleX + 4; x < paddleX + paddleW - 4; x++) {
    blendPixel(x, paddleY, 56, 189, 248, 230);
    blendPixel(x, paddleY + paddleH - 1, 15, 23, 42, 230);
  }

  // Dual Red Laser Weapon Pods on Wings
  const podW = Math.round(24 * scale);
  const podH = Math.round(34 * scale);
  const podY = paddleY - Math.round(2 * scale);

  const drawPod = (px) => {
    for (let y = podY; y < podY + podH; y++) {
      for (let x = px; x < px + podW; x++) {
        blendPixel(x, y, 239, 68, 68, 255);
      }
    }
    // Laser beam firing upward
    const beamX = px + Math.round(podW / 2);
    for (let by = podY - Math.round(36 * scale); by < podY; by++) {
      blendPixel(beamX - 1, by, 244, 63, 94, 220);
      blendPixel(beamX, by, 255, 255, 255, 255);
      blendPixel(beamX + 1, by, 244, 63, 94, 220);
    }
  };
  drawPod(paddleX - Math.round(14 * scale));
  drawPod(paddleX + paddleW - Math.round(10 * scale));

  // Glowing Cyan Cockpit Energy Reactor (Center of Paddle)
  const coreW = Math.round(72 * scale);
  const coreH = Math.round(16 * scale);
  const coreX = Math.round(paddleX + (paddleW - coreW) / 2);
  const coreY = Math.round(paddleY + (paddleH - coreH) / 2);

  for (let y = coreY; y < coreY + coreH; y++) {
    for (let x = coreX; x < coreX + coreW; x++) {
      blendPixel(x, y, 2, 132, 199, 255);
    }
  }
  // Reactor inner white filament
  for (let x = coreX + Math.round(10 * scale); x < coreX + coreW - Math.round(10 * scale); x++) {
    blendPixel(x, coreY + Math.round(coreH / 2), 255, 255, 255, 240);
  }

  // Red accent racing stripes on wings
  const drawStripe = (sx) => {
    for (let y = paddleY + Math.round(4 * scale); y < paddleY + paddleH - Math.round(4 * scale); y++) {
      blendPixel(sx, y, 244, 63, 94, 255);
      blendPixel(sx + 1, y, 244, 63, 94, 255);
    }
  };
  drawStripe(paddleX + Math.round(55 * scale));
  drawStripe(paddleX + Math.round(65 * scale));
  drawStripe(paddleX + paddleW - Math.round(55 * scale));
  drawStripe(paddleX + paddleW - Math.round(65 * scale));

  // 8. Glowing Neon Squircle Inset Border Frame (Cyan to Violet to Pink)
  const inset = Math.round(12 * scale);
  const innerSize = size - inset * 2;
  const innerCorner = cornerRadius * 0.85;
  const borderWidth = Math.max(3, Math.round(8 * scale));

  for (let y = inset; y < size - inset; y++) {
    for (let x = inset; x < size - inset; x++) {
      const lx = x - inset;
      const ly = y - inset;
      let distCorner = 0;
      if (lx < innerCorner && ly < innerCorner) distCorner = Math.hypot(lx - innerCorner, ly - innerCorner);
      else if (lx > innerSize - innerCorner && ly < innerCorner) distCorner = Math.hypot(lx - (innerSize - innerCorner), ly - innerCorner);
      else if (lx < innerCorner && ly > innerSize - innerCorner) distCorner = Math.hypot(lx - innerCorner, ly - (innerSize - innerCorner));
      else if (lx > innerSize - innerCorner && ly > innerSize - innerCorner) distCorner = Math.hypot(lx - (innerSize - innerCorner), ly - (innerSize - innerCorner));

      const isCorner = (lx < innerCorner || lx > innerSize - innerCorner) && (ly < innerCorner || ly > innerSize - innerCorner);
      const distFromEdge = isCorner ? (innerCorner - distCorner) : Math.min(lx, innerSize - 1 - lx, ly, innerSize - 1 - ly);

      if (distFromEdge >= 0 && distFromEdge <= borderWidth) {
        const diagT = (x + y) / (size * 2);
        let br, bg, bb;
        if (diagT < 0.5) {
          const sub = diagT / 0.5;
          br = Math.round(56 * (1 - sub) + 192 * sub);
          bg = Math.round(189 * (1 - sub) + 132 * sub);
          bb = Math.round(248 * (1 - sub) + 252 * sub);
        } else {
          const sub = (diagT - 0.5) / 0.5;
          br = Math.round(192 * (1 - sub) + 244 * sub);
          bg = Math.round(132 * (1 - sub) + 63 * sub);
          bb = Math.round(252 * (1 - sub) + 94 * sub);
        }
        blendPixel(x, y, br, bg, bb, 235);
      }
    }
  }

  return encodeRGBAtoPNG(size, size, rgba);
}

// Generate all target PNG files
const publicDir = path.join(root, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Rendering 512x512 PNG...');
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), renderArkanoidIcon(512));

console.log('Rendering 192x192 PNG...');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), renderArkanoidIcon(192));

console.log('Rendering 180x180 apple-touch-icon.png...');
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), renderArkanoidIcon(180));

console.log('Generated all pixel-perfect Arkanoid icons successfully!');
