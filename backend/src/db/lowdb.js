const path = require('path')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

const file = path.join(__dirname, '..', '..', 'data', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { users: [] })

async function init() {
  await db.read()
  db.data = db.data || { users: [] }
  await db.write()
}

async function findUserByEmail(email) {
  await db.read()
  return db.data.users.find(u => u.email === email)
}

async function findUserById(id) {
  await db.read()
  return db.data.users.find(u => u.id === id)
}

async function createUser(user) {
  await db.read()
  db.data.users.push(user)
  await db.write()
}

module.exports = { init, findUserByEmail, findUserById, createUser }
