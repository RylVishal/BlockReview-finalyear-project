# BlockReview 🔗

**A Blockchain-Based Academic Publishing and Peer Review Platform**

BlockReview combines Ethereum smart contracts, IPFS-style storage, and a modern React frontend to create a transparent, incentivized academic publishing ecosystem.

---

## ✨ Features

| Role | Capabilities |
|------|-------------|
| **Publisher** | Submit papers, track status, view points history |
| **Reviewer** | Review assigned papers, earn points, view statistics |
| **Public** | Browse & search published papers, read abstracts, download |
| **Admin** | Manage paper statuses, assign reviewers, view blockchain status |

### Blockchain Features
- Paper metadata hash recorded on Ethereum (Hardhat local / Sepolia testnet)
- Review content hashed and stored on-chain
- Points transactions tracked immutably
- Gas-optimized Solidity contract (`BlockReview.sol`)
- IPFS simulation for file storage (upgradeable to real IPFS)

### Points System
| Action | Points |
|--------|--------|
| Submit a paper | +10 |
| Paper published | +50 |
| Complete a review | +25 |
| Review accepted | +10 |

---

## 🗂️ Project Structure

```
BlockReview/
├── frontend/                  # React + TailwindCSS SPA
│   ├── src/
│   │   ├── pages/             # Landing, Login, Register, Dashboards, etc.
│   │   ├── components/        # Layout, PaperCard, StatCard, StatusBadge, etc.
│   │   ├── services/          # Axios API client (api.js)
│   │   └── context/           # AuthContext (JWT auth state)
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                   # Node.js + Express REST API
│   ├── models/                # User, Paper, Review, PointTransaction
│   ├── routes/                # auth, papers, reviews, users, blockchain
│   ├── middleware/            # JWT auth, role-based access
│   ├── scripts/seed.js        # Demo data seeder
│   └── server.js
│
├── blockchain/                # Hardhat + Solidity
│   ├── contracts/
│   │   └── BlockReview.sol    # Main smart contract
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   └── hardhat.config.js
│
├── database/
│   └── schema.md              # MongoDB schema documentation
│
├── setup.sh                   # One-command setup script
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas URI
- Git

### 1. Run the Setup Script
```bash
cd BlockReview
chmod +x setup.sh
./setup.sh
```

### 2. Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas — update MONGODB_URI in backend/.env
```

### 3. Seed Demo Data
```bash
cd backend
npm run seed
```

### 4. Start All Services

**Terminal 1 — Hardhat Node (Blockchain)**
```bash
cd blockchain
npx hardhat node
```

**Terminal 2 — Deploy Contract**
```bash
cd blockchain
npm run deploy:local
```

**Terminal 3 — Backend API**
```bash
cd backend
npm run dev
```

**Terminal 4 — Frontend**
```bash
cd frontend
npm run dev
```

### 5. Open the App
- **Frontend:** http://localhost:3000
- **API Health:** http://localhost:5000/api/health
- **Hardhat JSON-RPC:** http://localhost:8545

---

## 👥 Demo Accounts

All accounts use password: `password123`

| Role | Email |
|------|-------|
| Admin | admin@blockreview.io |
| Publisher | alice@university.edu |
| Publisher | bob@stanford.edu |
| Reviewer | james@oxford.ac.uk |
| Reviewer | sarah@eth.ch |
| Public | public@example.com |

---

## 🔑 Environment Variables

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blockreview
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
CONTRACT_ADDRESS=          # filled after deploy
NETWORK_URL=http://127.0.0.1:8545
```

### `blockchain/.env` (for testnet only)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/papers` | — | List published papers |
| POST | `/api/papers/submit` | Publisher | Submit paper |
| GET | `/api/papers/my` | Publisher | My papers |
| GET | `/api/papers/assigned` | Reviewer | Assigned papers |
| PUT | `/api/papers/:id/status` | Admin | Update status |
| PUT | `/api/papers/:id/assign` | Admin | Assign reviewer |
| POST | `/api/reviews` | Reviewer | Submit review |
| GET | `/api/reviews/my` | Reviewer | My reviews |
| GET | `/api/reviews/stats` | Reviewer | Review stats |
| GET | `/api/users/points` | ✅ | Points history |
| GET | `/api/users/leaderboard` | — | Top contributors |
| GET | `/api/blockchain/status` | — | Contract info |

---

## ⛓️ Smart Contract

**`BlockReview.sol`** — Deployed on Hardhat local network

Key functions:
```solidity
submitPaper(paperHash, metadataHash) → paperId
submitReview(paperId, reviewHash, rating) → reviewId
updatePaperStatus(paperId, status)        // admin only
assignReviewer(paperId, reviewer)         // admin only
getUserPoints(address) → uint256
getAverageRating(paperId) → uint256
```

To deploy on Sepolia testnet:
```bash
cd blockchain
npm run deploy:sepolia
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TailwindCSS, Vite, React Router, Recharts |
| Backend | Node.js, Express, Mongoose, JWT, Multer |
| Database | MongoDB |
| Blockchain | Solidity 0.8.19, Hardhat, Ethers.js v6 |
| Storage | Local filesystem (IPFS-simulated) |

---

## 📦 Building for Production

```bash
# Frontend build
cd frontend && npm run build

# Serve with Express (add to backend/server.js):
# app.use(express.static(path.join(__dirname, '../frontend/dist')))
```

---

## 📄 License

MIT License — Free for academic and commercial use.
