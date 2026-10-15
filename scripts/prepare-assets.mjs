import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const [logo, wall] = process.argv.slice(2);
if (!logo || !wall) throw new Error('Uso: node scripts/prepare-assets.mjs logo.png aplicacao.png');
await mkdir('public/images', { recursive: true });
await sharp(logo).trim({ background: '#ffffff', threshold: 15 }).resize({ width: 400 }).png().toFile('public/images/logo.png');
await sharp(wall).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/images/brand-wall.webp');
console.log('Imagens da marca preparadas.');
