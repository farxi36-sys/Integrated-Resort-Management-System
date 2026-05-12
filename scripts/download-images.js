const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

async function run() {
  const assetsPath = path.join(__dirname, '..', 'frontend', 'public', 'assets.json');
  if (!fs.existsSync(assetsPath)) {
    console.error('assets.json not found at', assetsPath);
    process.exit(1);
  }
  const assets = JSON.parse(fs.readFileSync(assetsPath,'utf8'));
  const outDir = path.join(__dirname, '..', 'frontend', 'public', 'assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const url of assets.images) {
    try {
      console.log('Downloading', url);
      const res = await fetch(url);
      if (!res.ok) { console.error('Failed', res.status); continue; }
      const buf = await res.arrayBuffer();
      const filename = path.basename(new URL(url).pathname);
      const outPath = path.join(outDir, filename);
      fs.writeFileSync(outPath, Buffer.from(buf));
      console.log('Saved to', outPath);
    } catch (err) {
      console.error('Error downloading', url, err.message);
    }
  }
}

run();
