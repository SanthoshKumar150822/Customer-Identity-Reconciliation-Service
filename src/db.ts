//For Render.com
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "database.db");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}

const db = new Database(dbPath);

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


//For local test

// import Database from "better-sqlite3";

// const db = new Database("database.db"); // local file in project root

// db.exec(`
// CREATE TABLE IF NOT EXISTS Contact (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   phoneNumber TEXT,
//   email TEXT,
//   linkedId INTEGER,
//   linkPrecedence TEXT CHECK(linkPrecedence IN ('primary','secondary')),
//   createdAt TEXT,
//   updatedAt TEXT,
//   deletedAt TEXT
// )
// `);

// export default db;
