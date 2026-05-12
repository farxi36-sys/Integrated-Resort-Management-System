let prisma = null
try {
	const { PrismaClient } = require('@prisma/client')
	prisma = new PrismaClient()
} catch (err) {
	console.warn('Prisma client not available (skipping).', err && err.message)
}

module.exports = prisma
