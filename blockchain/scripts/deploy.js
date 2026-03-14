const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying BlockReview contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const BlockReview = await hre.ethers.getContractFactory("BlockReview");
  const blockReview = await BlockReview.deploy();
  await blockReview.waitForDeployment();

  const contractAddress = await blockReview.getAddress();
  console.log("✅ BlockReview deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../artifacts/contracts/BlockReview.sol/BlockReview.json"),
        "utf8"
      )
    ).abi,
  };

  const outputDir = path.join(__dirname, "../../backend/blockchain");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Also save to frontend
  const frontendDir = path.join(__dirname, "../../frontend/src/blockchain");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to backend/blockchain/ and frontend/src/blockchain/");
  console.log("\n📋 Add this to your .env files:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`NETWORK_URL=http://127.0.0.1:8545`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
