
import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

// Configuration
const TARGET_WIDTHS = [400, 768, 1280, 1920];
const QUALITY = 80;
const INPUT_DIR = 'public/images'; // Ensure your images are here
const OUTPUT_DIR = 'public/images/optimized';

async function optimize() {
  console.log('🚀 Starting Image Optimization for FANN.ae...');
  
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {}

  // Find all images (jpg, png, jpeg)
  const files = await glob(`${INPUT_DIR}/*.{jpg,jpeg,png}`);

  console.log(`📸 Found ${files.length} images to process.`);

  for (const file of files) {
    const filename = path.basename(file, path.extname(file));
    const image = sharp(file);
    const metadata = await image.metadata();

    console.log(`Processing: ${filename}`);

    // 1. Generate WebP versions at different sizes
    for (const width of TARGET_WIDTHS) {
      if (metadata.width > width) {
        await image
          .clone()
          .resize(width)
          .webp({ quality: QUALITY })
          .toFile(`${OUTPUT_DIR}/${filename}-${width}.webp`);
      }
    }

    // 2. Generate original full-size WebP
    await image
      .clone()
      .webp({ quality: QUALITY })
      .toFile(`${OUTPUT_DIR}/${filename}-full.webp`);

    // 3. Generate a tiny blur placeholder (BLIP)
    await image
      .clone()
      .resize(20)
      .webp({ quality: 20 })
      .toFile(`${OUTPUT_DIR}/${filename}-placeholder.webp`);
  }

  console.log('✅ Optimization Complete!');
}

optimize();
