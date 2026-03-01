import express, { Request, Response } from "express";
import db from "./db";

const router = express.Router();

type Contact = {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

router.post("/identify", (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body as {
    email?: string;
    phoneNumber?: string;
  };

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phone required" });
  }

  // 1️⃣ Find ANY matching contact (primary OR secondary)
  const matchedContact = db.prepare(`
    SELECT * FROM Contact
    WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL
    ORDER BY createdAt ASC
    LIMIT 1
  `).get(email ?? null, phoneNumber ?? null) as Contact | undefined;

  // 2️⃣ If no contact exists → create primary
  if (!matchedContact) {
    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt, updatedAt)
      VALUES (?, ?, 'primary', ?, ?)
    `).run(email ?? null, phoneNumber ?? null, now, now);

    return res.json({
      contact: {
        primaryContatctId: result.lastInsertRowid,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: []
      }
    });
  }

  // 3️⃣ Resolve primary ID
  const primaryId =
    matchedContact.linkPrecedence === "primary"
      ? matchedContact.id
      : matchedContact.linkedId!;

  // 4️⃣ Fetch all contacts under this primary
  const allContacts = db.prepare(`
    SELECT * FROM Contact
    WHERE id = ? OR linkedId = ?
  `).all(primaryId, primaryId) as Contact[];

  // 5️⃣ Insert secondary ONLY if new info is provided
  const hasNewEmail =
    email && !allContacts.some(c => c.email === email);

  const hasNewPhone =
    phoneNumber && !allContacts.some(c => c.phoneNumber === phoneNumber);

  if (hasNewEmail || hasNewPhone) {
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Contact
      (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
      VALUES (?, ?, ?, 'secondary', ?, ?)
    `).run(email ?? null, phoneNumber ?? null, primaryId, now, now);
  }

  // 6️⃣ Fetch again after possible insert
  const finalContacts = db.prepare(`
    SELECT * FROM Contact
    WHERE id = ? OR linkedId = ?
  `).all(primaryId, primaryId) as Contact[];

  const emails = [...new Set(finalContacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = finalContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  return res.json({
    contact: {
      primaryContatctId: primaryId,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  });
});

export default router;