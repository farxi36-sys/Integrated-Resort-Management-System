const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'hero.jpg')
const destDir = path.join(__dirname, '..', 'frontend', 'src', 'assets')
const dest = path.join(destDir, 'resort-hero.jpg')

try {
  if (!fs.existsSync(src)) {
    console.error('Source hero image not found at:', src)
    process.exit(1)
  }
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(src, dest)
  console.log('Copied', src, '->', dest)
} catch (err) {
  console.error('Failed to copy resort hero image:', err.message)
  process.exit(2)
}
