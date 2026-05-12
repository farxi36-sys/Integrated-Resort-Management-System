#!/usr/bin/env node
// Simple smoke check: fetch the public landing page and verify hero text exists
const url = process.argv[2] || process.env.URL || 'http://localhost:5174/'
const expected = process.argv[3] || process.env.EXPECTED || 'Simple public booking entry point'

async function run() {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`ERROR: failed to fetch ${url} - status ${res.status}`)
      process.exit(2)
    }
    const text = await res.text()
    if (text.includes(expected)) {
      console.log(`OK: found expected hero text on ${url}`)
      process.exit(0)
    } else {
      console.error(`FAIL: expected text not found on ${url}`)
      process.exit(3)
    }
  } catch (err) {
    console.error('ERROR:', err.message || err)
    process.exit(4)
  }
}

run()
