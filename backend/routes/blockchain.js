const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

// GET /api/blockchain/status
router.get("/status", (req, res) => {
  try {
    const deploymentPath = path.join(__dirname, "../blockchain/deployment.json");
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      res.json({
        success: true,
        connected: true,
        contractAddress: deployment.contractAddress,
        network: deployment.network,
        deployedAt: deployment.deployedAt,
      });
    } else {
      res.json({
        success: true,
        connected: false,
        message: "Smart contract not deployed yet. Run: cd blockchain && npm run deploy:local",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blockchain/paper/:id - get on-chain paper data
router.get("/paper/:id", auth, (req, res) => {
  // Simulated response when blockchain not connected
  res.json({
    success: true,
    onChain: false,
    message: "Paper stored off-chain. Connect blockchain for on-chain verification.",
    paperHash: "Qm" + "a".repeat(44),
  });
});

module.exports = router;
