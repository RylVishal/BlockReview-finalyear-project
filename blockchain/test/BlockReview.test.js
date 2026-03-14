const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockReview", function () {
  let blockReview, admin, author, reviewer;

  beforeEach(async function () {
    [admin, author, reviewer] = await ethers.getSigners();
    const BlockReview = await ethers.getContractFactory("BlockReview");
    blockReview = await BlockReview.deploy();
    await blockReview.waitForDeployment();
  });

  it("Should deploy with correct admin", async function () {
    expect(await blockReview.admin()).to.equal(admin.address);
  });

  it("Should submit a paper and award points", async function () {
    const tx = await blockReview.connect(author).submitPaper(
      "QmPaperHash123456789",
      "QmMetadataHash123456"
    );
    await tx.wait();
    expect(await blockReview.paperCount()).to.equal(1);
    expect(await blockReview.getUserPoints(author.address)).to.equal(10);
  });

  it("Should submit a review and award points", async function () {
    await blockReview.connect(author).submitPaper("QmPaperHash", "QmMetaHash");
    await blockReview.connect(admin).assignReviewer(1, reviewer.address);
    await blockReview.connect(reviewer).submitReview(1, "QmReviewHash", 4);
    expect(await blockReview.getUserPoints(reviewer.address)).to.equal(25);
    expect(await blockReview.reviewCount()).to.equal(1);
  });

  it("Should update paper status and award publish bonus", async function () {
    await blockReview.connect(author).submitPaper("QmHash", "QmMeta");
    await blockReview.connect(admin).updatePaperStatus(1, 3); // Published = 3
    expect(await blockReview.getUserPoints(author.address)).to.equal(60); // 10 + 50
    const paper = await blockReview.getPaper(1);
    expect(paper.status).to.equal(3);
  });

  it("Should compute average rating correctly", async function () {
    await blockReview.connect(author).submitPaper("QmHash", "QmMeta");
    await blockReview.connect(admin).assignReviewer(1, reviewer.address);
    await blockReview.connect(reviewer).submitReview(1, "QmReview", 4);
    expect(await blockReview.getAverageRating(1)).to.equal(4);
  });
});
