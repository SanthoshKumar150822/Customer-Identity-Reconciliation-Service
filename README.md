# Customer Identity Reconciliation Service

## Overview
Customer Identity Reconciliation Service is a backend API that consolidates customer identities across multiple emails and phone numbers. It ensures that a single customer is represented by one unified profile, even if they use different contact details across multiple purchases.

This project was built as part of a Backend Engineering Intern assignment.

---

## Problem Statement
Customers may place orders using different combinations of email addresses and phone numbers. This can lead to duplicate customer records, making customer tracking inaccurate.

The goal of this project is to:
- Identify whether an incoming email or phone number belongs to an existing customer
- Link all related identities together
- Return a single consolidated customer profile

---

## Solution Approach
- Store customer contact details in a relational database
- Maintain one **primary contact** for each customer (earliest record)
- Store additional emails or phone numbers as **secondary contacts**
- Resolve any incoming email or phone (primary or secondary) to the primary contact
- Return a unified customer identity through a single API endpoint

---

## Key Concepts

### Primary Contact
- The first and oldest contact created for a customer
- Acts as the root customer identity
- Has `linkedId = null`

### Secondary Contact
- Created when the same customer uses a new email or phone number
- Linked to the primary contact
- Represents alternative identifiers of the same customer

---

## Tech Stack
- Node.js
- TypeScript
- Express.js
- SQLite (better-sqlite3)
- Render.com (Deployment)

---

## Project Structure
```
Customer-Identity-Reconciliation-Service/
│
├── src/
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   └── index.html
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── database.db
├── .gitignore
├── README.md
```

---

## Setup Instructions

### 1. Install Node.js
Download and install [Nodejs](https://nodejs.org) (LTS version)

Verify installation:
```
node -v
```
```
npm -v
```


---

### 2. Clone the Repository
```
git clone https://github.com/SanthoshKumar150822/Customer-Identity-Reconciliation-Service.git
```

```
cd Customer-Identity-Reconciliation-Service
```

---

### 3. Install Dependencies
```
npm install
```

---

### 4. Run the Application Locally
```
npm run dev
```

The server will start at
```
http://localhost:3000
```
The SQLite database is auto-created on first run.

---

## API Usage

### Endpoint

POST `/identify`

### Headers

Content-Type: application/json


### Request Body (Email or Phone Required)

Example 1:
```
{
"email": "user@example.com"
}
```

Example 2:
```
{
"phoneNumber": "9876543210"
}
```

Example 3:
```
{
"email": "user@example.com",
"phoneNumber": "9876543210"
}
```


---

### Sample Response
```
{
"contact": {
"primaryContatctId": 1,
"emails": [
"user@example.com",
"alt@example.com"
],
"phoneNumbers": [
"9876543210"
],
"secondaryContactIds": [2, 3]
}
}
```

**Case 1:** If the email already exists, the service resolves it to the existing primary contact and returns the consolidated identity without creating a new record.

**Case 2:** If the email does not exist, a new primary contact is created and the newly created customer identity is returned.


## Testing the API
### You can test the API using tools like Postman or curl.

### Using curl
#### Using Email
```
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "example@gmail.com"
}'
```

or 
#### Using Mobile number

```
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{ "phoneNumber": "9876543210" }'
```

or
#### Using Email and Mobile number
```
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "dhoniplaybook@gmail.com",
  "phoneNumber": "6379314514"
}'
```

### Using Postman
POST `http://localhost:3000/identify`

Content-Type: application/json

```
{
  "email": "example@gmail.com"
}
```
or

```
{
  "phoneNumber": "9876543210"
}
```

or

```
{
  "email": "example@gmail.com",
  "phoneNumber": "9876543210"
}
```

## Web Interface (UI)

The application provides a simple web interface to check customer identity.

**URL**  
```
http://localhost:3000/
```

### UI Screen
**Check Customer Identity**

### Input Fields
- **Enter Email**
- **Enter Phone Number**

> At least one field (Email or Phone Number) must be provided.

### How It Works
1. Open `http://localhost:3000/` in a browser
2. Enter an email or phone number
3. Click **Check**
4. The consolidated customer identity is displayed in a table format

---

## Viewing Database Table in VS Code

This project uses **SQLite** as the database.

### Option 1: Using VS Code Extension

1. Open VS Code
2. Install a SQLite extension (e.g., **SQLite Viewer** or **SQLite Explorer**)
3. Open the file: `database.db`

### Option 2: Using SQLite CLI

Open terminal in the project root and run:

```bash
sqlite3 database.db
```

```bash
.tables
```

```bash
SELECT * FROM Contact;
```

## Database CRUD Operations (SQLite)

The application uses a `Contact` table to store customer identities. 

Below are basic **CRUD (Create, Read, Update, Delete)** operations for reference and debugging.

---

### Create (INSERT)

Insert a new primary contact

```sql
INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt, updatedAt)
VALUES ('user@example.com', '9876543210', 'primary', datetime('now'), datetime('now'));
```

Insert a secondary contact linked to a primary contact
```sql
INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt)
VALUES ('alt@example.com', NULL, 1, 'secondary', datetime('now'), datetime('now'));
Read (SELECT)
```

### Read (SELECT)

View all contacts
```sql
SELECT * FROM Contact;
```

Find contact by email
```sql
SELECT * FROM Contact WHERE email = 'user@example.com';
```

Find contact by phone number
```sql
SELECT * FROM Contact WHERE phoneNumber = '9876543210';
```

Find all contacts linked to a primary contact
```sql
SELECT * FROM Contact WHERE id = 1 OR linkedId = 1;
```

### Update (UPDATE)

Convert a primary contact to secondary


```sql
UPDATE Contact
SET linkPrecedence = 'secondary', linkedId = 1
WHERE id = 2;
```

Update email
```sql
UPDATE Contact
SET email = 'new@example.com', updatedAt = datetime('now')
WHERE id = 1;
```

Update phone number
```sql
UPDATE Contact
SET phoneNumber = '0123456789', updatedAt = datetime('now')
WHERE id = 1;
```

### Delete (Soft Delete)

Soft delete a contact record
```sql
UPDATE Contact
SET deletedAt = datetime('now')
WHERE id = 3;
```

Records are soft-deleted to preserve identity history.

---


## Deployment on Render.com

1. Create an account at [Render](https://render.com)  
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - Environment: Node
   - Build Command:
     ```
     npm install
     ```
   - Start Command:
     ```
     npm run dev
     ```
   - Port: `3000`
5. Click **Deploy**

After deployment, Render provides a public URL
```
https://your-app-name.onrender.com
```

## Create Records in the Table
### You can create records in the database using the API via tools like Postman or curl.

### Using curl
#### Using Email
```
curl -X POST https://your-app-name.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "example@gmail.com"
}'
```

or 
#### Using Mobile number

```
curl -X POST https://your-app-name.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{ "phoneNumber": "9876543210" }'
```

or
#### Using Email and Mobile number
```
curl -X POST https://your-app-name.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "dhoniplaybook@gmail.com",
  "phoneNumber": "6379314514"
}'
```

### Using Postman
POST `https://your-app-name.onrender.com/identify`

Content-Type: application/json

```
{
  "email": "example@gmail.com"
}
```
or

```
{
  "phoneNumber": "9876543210"
}
```

or

```
{
  "email": "example@gmail.com",
  "phoneNumber": "9876543210"
}
```

---

## Conclusion
This project demonstrates backend fundamentals such as API design, data modeling, identity reconciliation, and cloud deployment. It ensures accurate customer identity tracking by consolidating multiple identifiers into a single unified profile.


## Developed By
**Santhosh Kumar ❤️**
