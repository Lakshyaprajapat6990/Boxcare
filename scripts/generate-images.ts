import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'images');

async function generateImages() {
  const zai = await ZAI.create();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const images = [
    {
      prompt: 'Professional product photography of a small brown cardboard shipping box, clean white background, studio lighting, e-commerce packaging, high quality',
      filename: 'small-shipping-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a medium brown cardboard moving box, clean white background, studio lighting, packing box, high quality',
      filename: 'medium-moving-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a tall wardrobe cardboard box with hanging bar, clean white background, studio lighting, moving supplies, high quality',
      filename: 'large-wardrobe-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a premium custom printed cardboard box with brand logo, colorful design, clean white background, studio lighting, high quality',
      filename: 'custom-printed-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a heavy duty triple-wall cardboard box, strong industrial packaging, clean white background, studio lighting, high quality',
      filename: 'heavy-duty-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a self-locking mailer cardboard box, premium e-commerce packaging, clean white background, studio lighting, high quality',
      filename: 'mailer-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a food grade cardboard box for bakery, kraft paper material, clean white background, studio lighting, high quality',
      filename: 'food-grade-box.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Professional product photography of a luxury gift box with magnetic closure, premium rigid packaging, clean white background, studio lighting, high quality',
      filename: 'gift-box-premium.png',
      size: '1024x1024' as const,
    },
    {
      prompt: 'Wide panoramic hero banner for cardboard box manufacturing company, warehouse interior with stacks of cardboard boxes, warm amber lighting, professional photography, industrial setting',
      filename: 'hero-banner.png',
      size: '1440x720' as const,
    },
    {
      prompt: 'Professional product photography of a collection of various sized cardboard boxes arranged neatly, top down view, clean white background, studio lighting, high quality',
      filename: 'gallery-collection.png',
      size: '1344x768' as const,
    },
  ];

  for (let i = 0; i < images.length; i++) {
    const { prompt, filename, size } = images[i];
    const outputPath = path.join(outputDir, filename);

    try {
      console.log(`Generating ${i + 1}/${images.length}: ${filename}...`);
      const response = await zai.images.generations.create({
        prompt,
        size,
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`  Saved: ${outputPath} (${buffer.length} bytes)`);
    } catch (error) {
      console.error(`  Failed ${filename}:`, error);
    }
  }

  console.log('Done!');
}

generateImages().catch(console.error);
