# SplitSmart — Smart Bill Splitting App

A full-stack bill splitting application with AI-powered receipt scanning, multi-bill support, and intelligent settlement calculation.

🔗 **Live Demo:** [your-frontend-url]  
🖥️ **Backend API:** [https://smart-splitter.onrender.com](https://smart-splitter.onrender.com)

---

## Features

- 📸 **AI Receipt Scanning** — Photograph a bill and items are auto-extracted using Groq Vision API
- 🧾 **Multi-Bill Support** — Create multiple bills per session, each with its own participants, tax, discount, and payer
- 👥 **Per-Bill Participants** — Different people can be part of different bills; quick-add from other bills
- 🧮 **Greedy Settlement Algorithm** — Minimizes total transactions needed to settle all debts across all bills
- 💰 **Upfront Payment Tracking** — Record who paid what upfront; enforces payments must equal bill total
- 🔄 **Per-Bill & Combined View** — See each bill's split individually or toggle to a combined global settlement
- 🌍 **Multi-Currency** — Switch between INR, USD, EUR, GBP, JPY
- 🏷️ **Expense Categories** — Tag items as Food, Drinks, Travel, Stay, Entertainment, Shopping, or Other
- 💾 **Save Bills** — Save settlements to your account and view history
- 📱 **Share** — Share settlement summaries via WhatsApp or copy to clipboard
- 🔐 **JWT Authentication** — Register/login with bcrypt-hashed passwords

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (memory storage)
- Groq Vision API

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
split-smart/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       │   ├── Bill/       # AddItem, AddParticipants, AddPayments, BillExtras, BillTable
│       │   ├── Common/     # AnimatedNumber, CurrencySelector, ErrorBoundary
│       │   ├── Settlement/ # Result (per-bill + combined view)
│       │   └── Upload/     # UploadBill
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── BillContext.jsx
│       ├── pages/
│       │   ├── BillEditor.jsx
│       │   ├── BillsHistory.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── PreviewPage.jsx
│       │   ├── Register.jsx
│       │   └── Summary.jsx
│       └── utils/
│           ├── calculateContribution.js
│           └── calculateSettlement.js
└── server/                 # Express backend
    ├── controllers/
    │   ├── authController.js
    │   └── billController.js
    ├── models/
    │   ├── Bill.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── billRoutes.js
    │   └── billsRoutes.js
    └── app.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/split-smart.git
cd split-smart
```

### 2. Setup the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

```bash
npm start
```

### 3. Setup the client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Key Engineering Decisions

**Per-bill participants** — Each bill has its own participant list instead of a global one, so different people can be in different bills without getting ₹0 in calculations.

**Greedy settlement algorithm** — Balances debtors and creditors greedily to minimize the number of transactions. Handles cross-bill payments correctly.

**Payments mutual exclusivity** — "Who Paid Full Bill" and upfront payments are mutually exclusive. Upfront payments must sum exactly to the bill total to prevent settlement errors.

**Stale payment prevention** — Changing items, tax, or discount automatically clears upfront payments since the bill total has changed.

**Multer memory storage** — Uses `memoryStorage()` instead of disk storage for Render compatibility (ephemeral filesystem).

**Floating-point safe arithmetic** — All financial calculations use `parseFloat(value.toFixed(2))` to prevent errors like ₹99.9999 instead of ₹100.

---

## Screenshots

> Add screenshots here

---

## License

MIT
