import Database from "better-sqlite3";

const db = new Database("database.db");

db.exec(`
CREATE TABLE IF NOT EXISTS Contact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phoneNumber TEXT,
  email TEXT,
  linkedId INTEGER,
  linkPrecedence TEXT CHECK(linkPrecedence IN ('primary','secondary')),
  createdAt TEXT,
  updatedAt TEXT,
  deletedAt TEXT
)
`);

export default db;