# 🎓 CertVerify

> A modern certificate management and verification platform built with Node.js and Express.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)]()
[![Express](https://img.shields.io/badge/Express-5.x-black.svg)]()
[![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)]()
[![License](https://img.shields.io/badge/License-ISC-orange.svg)]()

---

## 📖 Overview

CertVerify is a backend application designed to automate the complete lifecycle of training certificates.

The system enables organizations to create, manage, distribute, and verify digital certificates securely through unique identifiers and QR codes.

It was developed to reduce manual administrative work while providing a reliable verification mechanism for certificate authenticity.

---

## ✨ Key Features

### Certificate Management

- Generate professional PDF certificates
- Automatic unique certificate IDs
- QR Code generation
- Duplicate prevention
- Certificate validation

### Student Management

- Register participants
- Bulk import from Excel
- Export certificate records
- Search certificates
- Track issued certificates

### Verification

- QR Code verification
- URL-based verification
- Public verification endpoint
- Instant authenticity check

### Automation

- Scheduled jobs
- Email notifications
- Automatic PDF generation
- Logging
- Error handling

---

# 🏗 Architecture

```
                Browser
                    │
                    ▼
           Express Application
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
     Routes      Middleware    Static Files
        │
        ▼
 Business Logic (Services)
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
SQLite  PDF Engine   QR Generator
        │
        ▼
   Email Service
```

The application follows a layered architecture that separates routing, business logic, persistence, and external integrations.

---

# 📂 Project Structure

```
CertVerify
│
├── Certificates/
├── db/
├── exportToExcel/
├── logger/
├── mail/
├── public/
├── routes/
├── tests/
├── utils/
├── app.js
├── package.json
└── README.md
```

---

# ⚙ Technology Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | SQLite3 |
| PDF | pdf-lib |
| QR Codes | qrcode |
| Email | Nodemailer |
| Excel | ExcelJS |
| Authentication | bcrypt |
| Scheduler | node-schedule |
| Logging | Winston |
| Testing | Jest + Supertest |

---

# 🔄 Application Flow

```text
Admin
   │
   ▼
Create Student
   │
   ▼
Generate Certificate ID
   │
   ▼
Generate QR Code
   │
   ▼
Generate PDF
   │
   ▼
Store in SQLite
   │
   ▼
Email Certificate
   │
   ▼
Public Verification
```

---

# 🚀 Installation

```bash
git clone https://github.com/yourusername/CertVerify.git

cd CertVerify

npm install
```

Create:

```
.env
```

```
PORT=3000

EMAIL_USER=example@gmail.com
EMAIL_PASS=password
```

Run:

```bash
npm start
```

Development

```bash
npm run dev
```

---

# 📚 REST API

| Method | Endpoint | Description |
|----------|-----------------|------------------------|
| GET | /main | Main application |
| GET | /me/:course/:id | Verify certificate |
| POST | /addStudent | Register participant |
| POST | /generatePdf | Generate certificate |

Complete API documentation is available through Swagger:

```
http://localhost:3000/api-docs
```

---

# 🧪 Testing

Run all tests

```bash
npm test
```

Testing stack

- Jest
- Supertest

---

# 📸 Screenshots

## Dashboard

![Dashboard](docs/screenshots/dashboard.png)

---

## Certificate

![Certificate](docs/screenshots/certificate.png)

---

## QR Verification

![QR](docs/screenshots/verification.png)

---

# 🔒 Security

- Password hashing using bcrypt
- Environment variables
- UUID certificate identifiers
- Input validation
- Error logging
- Secure email handling

---

# 📈 Future Improvements

- JWT Authentication
- PostgreSQL migration
- Docker deployment
- CI/CD pipeline
- Role Based Access Control
- Redis caching
- Cloud storage
- REST API versioning

---

# 👨‍💻 Author

**Eda Isaku**

IT Specialist | Backend Developer

GitHub:
https://github.com/YourUsername

---

# ⭐ Why this project?

This project demonstrates practical backend development skills by combining REST APIs, PDF generation, QR code verification, database management, email automation, scheduled tasks, logging, and testing into a complete certificate management solution suitable for educational institutions and training providers.
