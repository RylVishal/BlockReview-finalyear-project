#!/usr/bin/env bash
# ============================================================
# BlockReview — Automated Setup Script
# ============================================================
set -e

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
err()   { echo -e "${RED}[ERR]${NC}   $1"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       BlockReview Setup Script           ║${NC}"
echo -e "${CYAN}║  Blockchain Academic Publishing Platform ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Check prerequisites ───────────────────────────────────────
info "Checking prerequisites..."

command -v node >/dev/null 2>&1 || err "Node.js not found. Install from https://nodejs.org (v18+)"
command -v npm  >/dev/null 2>&1 || err "npm not found."
command -v mongod >/dev/null 2>&1 || warn "MongoDB not found locally. Make sure it's running or use MongoDB Atlas."

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
[ "$NODE_VER" -lt 18 ] && warn "Node.js v18+ recommended (you have v$(node -v))"

ok "Prerequisites OK"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Backend ───────────────────────────────────────────────────
info "Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm install --legacy-peer-deps
ok "Backend dependencies installed"

# Create .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  ok "Created backend/.env from template"
else
  info "backend/.env already exists, skipping"
fi

# Create uploads directory
mkdir -p uploads/papers
ok "Created uploads/papers directory"

# ── Frontend ──────────────────────────────────────────────────
info "Installing frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm install --legacy-peer-deps
ok "Frontend dependencies installed"

if [ ! -f .env ]; then
  cp .env.example .env
  ok "Created frontend/.env from template"
fi

# ── Blockchain ────────────────────────────────────────────────
info "Installing blockchain dependencies..."
cd "$ROOT_DIR/blockchain"
npm install --legacy-peer-deps
ok "Blockchain dependencies installed"

if [ ! -f .env ]; then
  cp .env.example .env
  ok "Created blockchain/.env from template"
fi

info "Compiling smart contracts..."
npx hardhat compile && ok "Smart contracts compiled" || warn "Contract compilation failed (optional for basic run)"

# ── Final Summary ─────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅  Setup Complete!                             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo ""
echo -e "  ${YELLOW}1. Start MongoDB${NC}"
echo -e "     mongod --dbpath /data/db"
echo ""
echo -e "  ${YELLOW}2. Seed the database with demo data${NC}"
echo -e "     cd backend && npm run seed"
echo ""
echo -e "  ${YELLOW}3. Start the Hardhat node (in a new terminal)${NC}"
echo -e "     cd blockchain && npx hardhat node"
echo ""
echo -e "  ${YELLOW}4. Deploy the smart contract (in another terminal)${NC}"
echo -e "     cd blockchain && npm run deploy:local"
echo ""
echo -e "  ${YELLOW}5. Start the backend API${NC}"
echo -e "     cd backend && npm run dev"
echo ""
echo -e "  ${YELLOW}6. Start the frontend${NC}"
echo -e "     cd frontend && npm run dev"
echo ""
echo -e "  ${CYAN}App:      ${GREEN}http://localhost:3000${NC}"
echo -e "  ${CYAN}API:      ${GREEN}http://localhost:5000/api/health${NC}"
echo -e "  ${CYAN}Hardhat:  ${GREEN}http://localhost:8545${NC}"
echo ""
echo -e "${CYAN}Demo Accounts (password: password123)${NC}"
echo -e "  Publisher:  alice@university.edu"
echo -e "  Reviewer:   james@oxford.ac.uk"
echo -e "  Admin:      admin@blockreview.io"
echo -e "  Public:     public@example.com"
echo ""
