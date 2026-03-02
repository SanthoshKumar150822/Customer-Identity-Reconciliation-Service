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
  const { email, phoneNumber } = req.body as { email?: string; phoneNumber?: string };

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phone required" });
  }

  const matchedContact = db.prepare(`
    SELECT * FROM Contact
    WHERE (email = ? OR phoneNumber = ?) AND deletedAt IS NULL
    ORDER BY createdAt ASC
    LIMIT 1
  `).get(email ?? null, phoneNumber ?? null) as Contact | undefined;

  if (!matchedContact) {
    return res.json({
      contact: {
        primaryContatctId: null,
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
      }
    });
  }

  const primaryId = matchedContact.linkPrecedence === "primary" 
    ? matchedContact.id 
    : matchedContact.linkedId!;

  const allContacts = db.prepare(`
    SELECT * FROM Contact
    WHERE id = ? OR linkedId = ?
  `).all(primaryId, primaryId) as Contact[];

  const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = allContacts
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
