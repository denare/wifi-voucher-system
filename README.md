
# 📶 Wi-Fi Voucher-Based Access and Monitoring System

> **Version:** 1.0  
> **Documented By:** Daniel Mgaya  
> **Date:** July 26, 2025

---

## 🚀 Overview

This project is a **web-based Wi-Fi management system** for businesses that offer prepaid internet using vouchers.  
It allows **users** to register, buy vouchers via Mobile Money, track usage, and lets **admins** monitor earnings, control active connections, and manage vouchers in real-time.

---

## ✅ Features

### 🎫 **User Features**
- Secure **Registration & Login**
- Purchase Wi-Fi vouchers using **Mobile Money (e.g., M-Pesa)**
- View **current usage**, data balance, and voucher expiry
- Mobile-friendly design

### 🔒 **Admin Features**
- Admin **login & dashboard**
- Create/manage vouchers (expiry, limits)
- Monitor connected users & active sessions
- View daily/monthly earnings & usage reports
- Basic logs & analytics

---

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend (User Portal)** | React.js / Vue.js |
| **Frontend (Mobile/Phase 2)** | Flutter or React Native |
| **Backend** | Python Flask or Django |
| **Database** | PostgreSQL or MongoDB |
| **Auth** | JWT Tokens (bcrypt for password hashing) |
| **Payments** | M-Pesa API / Flutterwave |
| **Router Integration** | MikroTik API or Radius |
| **Hosting** | Any VPS with HTTPS |

---

## 📂 Project Structure

```bash
wifi-voucher-system/
├── frontend/          # User Portal (React/Vue)
├── admin-dashboard/   # Admin Panel (Vercel prototype logic)
├── backend/           # Flask/Django API
├── database/          # DB migrations & schema
├── router-api/        # MikroTik integration scripts
├── tests/             # Unit & integration tests
├── README.md
└── .env               # Environment variables (not committed)
````

---

## 🔑 Installation

```bash
# 1️⃣ Clone the repo
git clone https://github.com/denare/wifi-voucher-system.git
cd wifi-voucher-system

# 2️⃣ Install backend dependencies
cd backend
pip install -r requirements.txt

# 3️⃣ Install frontend dependencies
cd ../frontend
npm install

# 4️⃣ Run local dev servers
# Backend (Flask)
flask run

# Frontend (React)
npm run dev
```

---

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
MPESA_API_KEY=your_mpesa_api_key
JWT_SECRET=your_jwt_secret
```

---

## 🧪 Testing

```bash
# Run backend unit tests
pytest

# Frontend tests
npm run test
```

---

## 🚩 Roadmap

* ✅ Core User Portal (Registration, Login, Purchase, Usage)
* ✅ Admin Dashboard (Vercel logic + improved UI)
* ✅ Payment Integration (M-Pesa)
* ✅ MikroTik Router API Integration
* 🚧 Mobile App (Phase 2)
* 🚧 WhatsApp alerts & expiry reminders
* 🚧 Offline voucher generation (PDF/Print)

---

## 👥 Contributors

| Name        | Role               |
| ----------- | ------------------ |
| Daniel Mgaya       | Project Lead & Backend Developer |
| Denis D | Frontend Developer |

---

## 📃 License

This project is licensed under the **MIT License**.
Feel free to fork, contribute, and build your custom Wi-Fi voucher system!

---

## 📞 Support

Questions or feature requests?
Contact **US** — \[[enersondenare01@gmail.com](mailto:enersondenare01@gmail.com)]

---
