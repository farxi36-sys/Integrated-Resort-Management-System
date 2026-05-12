const path = require('path')

let db = null
let Database = null
try {
  Database = require('better-sqlite3')
} catch (err) {
  console.warn('better-sqlite3 not installed; SQLite DB disabled.', err && err.message)
}

if (Database) {
  const dbPath = path.join(__dirname, '..', '..', 'data', 'dev.sqlite')
  db = new Database(dbPath)

  // initialize tables if missing
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    businessName TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )`).run()
}

const _notAvailable = () => { throw new Error('SQLite database not available on this system') }

const findUserByEmail = (email) => db ? db.prepare('SELECT * FROM users WHERE email = ?').get(email) : _notAvailable()
const findUserById = (id) => db ? db.prepare('SELECT * FROM users WHERE id = ?').get(id) : _notAvailable()
const createUser = ({ id, name, businessName, email, password, role }) => {
  if (!db) return _notAvailable()
  const createdAt = new Date().toISOString()
  return db.prepare('INSERT INTO users (id,name,businessName,email,password,role,createdAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, businessName || null, email, password, role || 'owner', createdAt)
}

module.exports = { findUserByEmail, findUserById, createUser }
