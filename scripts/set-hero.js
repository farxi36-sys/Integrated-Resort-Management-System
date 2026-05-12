const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'nainital.jpg')
const dest = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'hero.jpg')

try {
  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src)
    process.exit(1)
  }
  fs.copyFileSync(src, dest)
  console.log('Copied', src, '->', dest)
} catch (err) {
  console.error('Failed to copy hero image:', err.message)
  process.exit(2)
}
