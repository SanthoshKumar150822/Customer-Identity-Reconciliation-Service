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

POST `http://localhost:3000/identify`

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

### Option 1: Using VS Code Extension (Recommended)

1. Open VS Code
2. Install a SQLite extension (e.g., **SQLite Viewer** or **SQLite Explorer**)
3. Open the file: `database.db`

### Option 2: Using SQLite CLI

Open terminal in the project root and run:

```bash
sqlite3 database.db

.tables

SELECT * FROM Contact;
```

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

---

## Conclusion
This project demonstrates backend fundamentals such as API design, data modeling, identity reconciliation, and cloud deployment. It ensures accurate customer identity tracking by consolidating multiple identifiers into a single unified profile.


## Developed By
**Santhosh Kumar**
