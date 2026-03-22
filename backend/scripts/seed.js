const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Paper = require("../models/Paper");
const Review = require("../models/Review");
const PointTransaction = require("../models/PointTransaction");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blockreview";

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Paper.deleteMany({});
  await Review.deleteMany({});
  await PointTransaction.deleteMany({});
  console.log("Cleared existing data");

  // Create users (password will be hashed by User model pre-save hook)
  const plainPass = "password123";

  const admin = await User.create({
    name: "Admin User",
    email: "admin@blockreview.io",
    password: plainPass,
    role: "admin",
    institution: "BlockReview Foundation",
    points: 500,
    bio: "Platform administrator",
  });

  const publishers = await User.insertMany([
    {
      name: "Dr. Alice Chen",
      email: "alice@university.edu",
      password: plainPass,
      role: "publisher",
      institution: "MIT",
      points: 185,
      bio: "Researcher in distributed systems and blockchain technology",
      expertise: ["Blockchain", "Distributed Systems", "Computer Science"],
      stats: { papersSubmitted: 3, papersPublished: 2, reviewsCompleted: 0, totalEarned: 185 },
    },
    {
      name: "Prof. Bob Martinez",
      email: "bob@stanford.edu",
      password: plainPass,
      role: "publisher",
      institution: "Stanford University",
      points: 120,
      bio: "Professor of Computer Science specializing in AI and ML",
      expertise: ["AI", "Machine Learning", "Neural Networks"],
      stats: { papersSubmitted: 2, papersPublished: 1, reviewsCompleted: 0, totalEarned: 120 },
    },
    {
      name: "Dr. Priya Sharma",
      email: "priya@iit.ac.in",
      password: plainPass,
      role: "publisher",
      institution: "IIT Bombay",
      points: 60,
      bio: "Quantum computing researcher",
      expertise: ["Quantum Computing", "Physics", "Mathematics"],
      stats: { papersSubmitted: 1, papersPublished: 0, reviewsCompleted: 0, totalEarned: 60 },
    },
  ]);

  const reviewers = await User.insertMany([
    {
      name: "Dr. James Wilson",
      email: "james@oxford.ac.uk",
      password: plainPass,
      role: "reviewer",
      institution: "Oxford University",
      points: 275,
      bio: "Expert in cryptography and security protocols",
      expertise: ["Cryptography", "Security", "Blockchain"],
      stats: { papersSubmitted: 0, papersPublished: 0, reviewsCompleted: 8, totalEarned: 275 },
    },
    {
      name: "Dr. Sarah Kim",
      email: "sarah@eth.ch",
      password: plainPass,
      role: "reviewer",
      institution: "ETH Zurich",
      points: 200,
      bio: "Specializes in distributed systems and consensus algorithms",
      expertise: ["Distributed Systems", "Consensus Algorithms", "P2P Networks"],
      stats: { papersSubmitted: 0, papersPublished: 0, reviewsCompleted: 6, totalEarned: 200 },
    },
    {
      name: "Prof. Carlos Rodriguez",
      email: "carlos@cambridge.ac.uk",
      password: plainPass,
      role: "reviewer",
      institution: "Cambridge University",
      points: 150,
      bio: "AI ethics and responsible computing researcher",
      expertise: ["AI Ethics", "Machine Learning", "Data Privacy"],
      stats: { papersSubmitted: 0, papersPublished: 0, reviewsCompleted: 4, totalEarned: 150 },
    },
  ]);

  const publicUser = await User.create({
    name: "Public User",
    email: "public@example.com",
    password: plainPass,
    role: "public",
    institution: "",
    points: 0,
  });

  console.log("Created users");

  // Create papers
  const papers = await Paper.insertMany([
    {
      title: "Decentralized Identity Management Using Blockchain Technology",
      abstract: "This paper presents a novel approach to decentralized identity management using blockchain technology. We propose a self-sovereign identity framework that eliminates the need for centralized identity providers while maintaining security and privacy guarantees. Our implementation demonstrates 40% reduction in identity verification costs and 99.9% uptime.",
      keywords: ["blockchain", "identity", "decentralization", "self-sovereign", "privacy"],
      authors: ["Dr. Alice Chen", "Prof. Li Wei"],
      category: "Computer Science",
      status: "published",
      submittedBy: publishers[0]._id,
      assignedReviewers: [reviewers[0]._id, reviewers[1]._id],
      paperHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      metadataHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      fileUrl: "",
      readCount: 342,
      downloadCount: 87,
      averageRating: 4.5,
      reviewCount: 2,
      publishedAt: new Date("2024-11-15"),
    },
    {
      title: "Smart Contract Optimization: Reducing Gas Costs Through Pattern Analysis",
      abstract: "Gas costs remain a significant barrier to blockchain adoption. In this paper, we analyze common Solidity patterns and propose optimizations that reduce gas consumption by an average of 35%. We evaluate 500 production smart contracts and identify key anti-patterns along with their efficient alternatives.",
      keywords: ["smart contracts", "solidity", "gas optimization", "ethereum", "performance"],
      authors: ["Dr. Alice Chen"],
      category: "Computer Science",
      status: "published",
      submittedBy: publishers[0]._id,
      assignedReviewers: [reviewers[0]._id],
      paperHash: "QmZTR5bcpQD7cFgTorqxZDYaew1Wqfbx2zWn8C1Nzm6bX",
      metadataHash: "QmYXc5FzLwbTpVfXzFNxPLnzRJDiqq76sBqNkVMGpJ4bpU",
      fileUrl: "",
      readCount: 198,
      downloadCount: 54,
      averageRating: 4.2,
      reviewCount: 1,
      publishedAt: new Date("2024-12-01"),
    },
    {
      title: "Federated Learning on Blockchain: Privacy-Preserving Machine Learning",
      abstract: "We present FedChain, a framework that combines federated learning with blockchain technology to enable privacy-preserving collaborative machine learning. Our approach allows multiple parties to train shared models without exposing raw data, with model updates recorded immutably on-chain for auditability.",
      keywords: ["federated learning", "blockchain", "privacy", "machine learning", "distributed"],
      authors: ["Prof. Bob Martinez", "Dr. Emily Zhang"],
      category: "Computer Science",
      status: "under_review",
      submittedBy: publishers[1]._id,
      assignedReviewers: [reviewers[2]._id],
      paperHash: "QmSzgnPBxGCJdcfUBe7bqLfFHyqDiM5Nf3uaGKJfJgGKK",
      metadataHash: "QmVgKWDyGKFW5eQaBuZJABzHHaMnEkm5DLJiQ9NcRpFWLH",
      fileUrl: "",
      readCount: 45,
      downloadCount: 12,
      averageRating: 0,
      reviewCount: 0,
    },
    {
      title: "Quantum-Resistant Cryptographic Protocols for Blockchain Networks",
      abstract: "As quantum computers advance, current cryptographic schemes used in blockchain networks face existential threats. This paper proposes quantum-resistant alternatives based on lattice-based cryptography and hash-based signatures. We implement and benchmark these protocols on Ethereum-compatible networks.",
      keywords: ["quantum computing", "cryptography", "blockchain", "post-quantum", "lattice"],
      authors: ["Dr. Priya Sharma", "Prof. Arun Patel"],
      category: "Computer Science",
      status: "submitted",
      submittedBy: publishers[2]._id,
      paperHash: "QmPbcZkfRBJY5bWRHPPMdDERnbNbPZGFLGDPkiCpHqFWXH",
      metadataHash: "QmWSmE5kEjicGLZQwGRDMDEmCKzEJcBjhVmQhYkbLGxqDN",
      fileUrl: "",
      readCount: 23,
      downloadCount: 0,
      averageRating: 0,
      reviewCount: 0,
    },
    {
      title: "DeFi Security Analysis: A Systematic Review of Attack Vectors",
      abstract: "Decentralized Finance (DeFi) protocols have suffered over $3 billion in losses due to security vulnerabilities. This systematic review analyzes 150 DeFi exploits from 2020-2024, categorizing attack vectors and proposing mitigation strategies. We identify 12 common vulnerability patterns and provide secure coding guidelines.",
      keywords: ["DeFi", "security", "blockchain", "smart contracts", "vulnerabilities"],
      authors: ["Prof. Bob Martinez"],
      category: "Computer Science",
      status: "revision_required",
      submittedBy: publishers[1]._id,
      assignedReviewers: [reviewers[0]._id, reviewers[1]._id],
      paperHash: "QmRZxhDPXjqUHrPDqiRDBdPpZQcMXJkJBFrNJtaWWfhYKW",
      metadataHash: "QmNtLFkJHRZCYEhPmPJZCEkRxnWjGRZUhJJJCsj6mGLm",
      fileUrl: "",
      readCount: 67,
      downloadCount: 18,
      averageRating: 3.5,
      reviewCount: 2,
    },
  ]);

  console.log("Created papers");

  // Create reviews
  await Review.insertMany([
    {
      paper: papers[0]._id,
      reviewer: reviewers[0]._id,
      summary: "This paper presents a well-structured approach to decentralized identity management. The theoretical framework is solid and the experimental results are convincing.",
      strengths: "Strong mathematical foundations. Comprehensive evaluation against existing systems. Clear presentation of the protocol.",
      weaknesses: "Limited discussion of scalability beyond 10,000 users. Some edge cases in the revocation mechanism are not addressed.",
      comments: "Consider adding a formal security proof. The comparison with existing DID standards could be more thorough.",
      recommendation: "accept",
      rating: 5,
      reviewHash: "QmReview1HashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "approved",
      pointsAwarded: 25,
    },
    {
      paper: papers[0]._id,
      reviewer: reviewers[1]._id,
      summary: "A solid contribution to the self-sovereign identity space. The implementation is practical and the performance improvements are significant.",
      strengths: "Novel use of zero-knowledge proofs for attribute verification. Good coverage of threat model.",
      weaknesses: "The usability study could be more rigorous. Privacy analysis should cover more adversarial scenarios.",
      comments: "Overall a strong paper ready for publication with minor revisions to the privacy analysis section.",
      recommendation: "minor_revision",
      rating: 4,
      reviewHash: "QmReview2HashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "approved",
      pointsAwarded: 25,
    },
    {
      paper: papers[4]._id,
      reviewer: reviewers[0]._id,
      summary: "The systematic review covers a wide range of DeFi attacks but lacks depth in the mitigation strategies section.",
      strengths: "Comprehensive dataset of 150 exploits. Good categorization framework. Timely and relevant topic.",
      weaknesses: "Mitigation strategies are too generic. No formal verification of proposed fixes. Missing several major 2024 exploits.",
      comments: "Major revision needed to include recent exploits and provide more concrete mitigation code examples.",
      recommendation: "major_revision",
      rating: 3,
      reviewHash: "QmReview3HashXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      status: "submitted",
      pointsAwarded: 25,
    },
  ]);

  console.log("Created reviews");

  // Create point transactions
  await PointTransaction.insertMany([
    { user: publishers[0]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[0]._id },
    { user: publishers[0]._id, amount: 50, type: "earned", reason: "Paper Published", relatedPaper: papers[0]._id },
    { user: publishers[0]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[1]._id },
    { user: publishers[0]._id, amount: 50, type: "earned", reason: "Paper Published", relatedPaper: papers[1]._id },
    { user: publishers[0]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[2]._id },
    { user: publishers[1]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[2]._id },
    { user: publishers[1]._id, amount: 50, type: "earned", reason: "Paper Published", relatedPaper: papers[2]._id },
    { user: publishers[1]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[4]._id },
    { user: publishers[2]._id, amount: 10, type: "earned", reason: "Paper Submitted", relatedPaper: papers[3]._id },
    { user: reviewers[0]._id, amount: 25, type: "earned", reason: "Review Completed", relatedPaper: papers[0]._id },
    { user: reviewers[0]._id, amount: 25, type: "earned", reason: "Review Completed", relatedPaper: papers[4]._id },
    { user: reviewers[1]._id, amount: 25, type: "earned", reason: "Review Completed", relatedPaper: papers[0]._id },
    { user: reviewers[2]._id, amount: 25, type: "earned", reason: "Review Completed", relatedPaper: papers[2]._id },
  ]);

  console.log("Created point transactions");
  console.log("\n✅ Seed complete!\n");
  console.log("Test Accounts:");
  console.log("─────────────────────────────────────────");
  console.log("Admin:     admin@blockreview.io / password123");
  console.log("Publisher: alice@university.edu / password123");
  console.log("Publisher: bob@stanford.edu    / password123");
  console.log("Reviewer:  james@oxford.ac.uk  / password123");
  console.log("Reviewer:  sarah@eth.ch        / password123");
  console.log("Public:    public@example.com  / password123");
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
