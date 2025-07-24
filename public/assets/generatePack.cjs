const fs = require('fs');
const path = require('path');

const ASSETS_DIR = './public/assets'; // Directory containing assets
const OUTPUT_FILE = './public/assets/assetsPack.json'; // Output file for the pack

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg'];
const AUDIO_EXTS = ['.mp3', '.ogg', '.wav'];

function detectType(file) {
  const ext = path.extname(file).toLowerCase();
  if (IMAGE_EXTS.includes(ext)) return 'image';
  if (AUDIO_EXTS.includes(ext)) return 'audio';
  return null;
}

function generatePackFiles(dir) {
  const files = fs.readdirSync(dir);
  const packEntries = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      packEntries.push(...generatePackFiles(fullPath)); // recursive
    } else {
      const type = detectType(file);
      if (!type) continue;

      packEntries.push({
        type,
        key: path.basename(file, path.extname(file)),
        url: path.relative('./public', fullPath).replace(/\\/g, '/')
      });
    }
  }

  return packEntries;
}

const files = generatePackFiles(ASSETS_DIR);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ files }, null, 2));
console.log(`Generated ${OUTPUT_FILE} with ${files.length} entries.`);
