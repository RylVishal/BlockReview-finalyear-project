# BlockReview — MongoDB Schema Documentation

## Collections

### users
| Field              | Type       | Description                                    |
|--------------------|------------|------------------------------------------------|
| _id                | ObjectId   | Auto-generated document ID                    |
| name               | String     | Full name                                      |
| email              | String     | Unique email (lowercase)                       |
| password           | String     | Bcrypt hashed                                  |
| role               | String     | publisher / reviewer / public / admin          |
| walletAddress      | String     | Ethereum wallet (optional)                     |
| points             | Number     | Current reward points                          |
| institution        | String     | University / organization                      |
| bio                | String     | Short bio                                      |
| expertise          | [String]   | Domain expertise tags                          |
| stats.papersSubmitted   | Number | Lifetime submitted count                  |
| stats.papersPublished   | Number | Lifetime published count                  |
| stats.reviewsCompleted  | Number | Lifetime review count                     |
| stats.totalEarned       | Number | Total points ever earned                  |
| createdAt          | Date       | Auto timestamp                                 |

### papers
| Field              | Type       | Description                                    |
|--------------------|------------|------------------------------------------------|
| _id                | ObjectId   | Auto-generated                                 |
| title              | String     | Paper title (text-indexed)                     |
| abstract           | String     | Full abstract (text-indexed)                   |
| keywords           | [String]   | Search keywords (text-indexed)                 |
| authors            | [String]   | Author names list                              |
| category           | String     | Domain category                                |
| status             | String     | submitted / under_review / revision_required / published / rejected |
| submittedBy        | ObjectId   | ref: User                                      |
| assignedReviewers  | [ObjectId] | ref: User                                      |
| blockchainPaperId  | Number     | On-chain ID (if blockchain connected)          |
| paperHash          | String     | Simulated IPFS hash of paper content           |
| metadataHash       | String     | Simulated IPFS hash of metadata                |
| txHash             | String     | Ethereum transaction hash                      |
| fileUrl            | String     | Server file path (simulated IPFS URL)          |
| fileName           | String     | Original filename                              |
| fileSize           | Number     | File size in bytes                             |
| readCount          | Number     | View counter                                   |
| downloadCount      | Number     | Download counter                               |
| averageRating      | Number     | Computed average review rating (1-5)           |
| reviewCount        | Number     | Total number of reviews                        |
| publishedAt        | Date       | When status changed to published               |
| createdAt          | Date       | Submission timestamp                           |

### reviews
| Field              | Type       | Description                                    |
|--------------------|------------|------------------------------------------------|
| _id                | ObjectId   | Auto-generated                                 |
| paper              | ObjectId   | ref: Paper                                     |
| reviewer           | ObjectId   | ref: User                                      |
| summary            | String     | Overall review summary                         |
| strengths          | String     | Paper strengths                                |
| weaknesses         | String     | Paper weaknesses                               |
| comments           | String     | Additional notes (optional)                    |
| recommendation     | String     | accept / minor_revision / major_revision / reject |
| rating             | Number     | 1–5 score                                      |
| reviewHash         | String     | Simulated IPFS/blockchain hash of review       |
| blockchainReviewId | Number     | On-chain review ID                             |
| status             | String     | pending / submitted / approved / rejected      |
| pointsAwarded      | Number     | Points given for this review                   |
| createdAt          | Date       | Auto timestamp                                 |

### pointtransactions
| Field              | Type       | Description                                    |
|--------------------|------------|------------------------------------------------|
| _id                | ObjectId   | Auto-generated                                 |
| user               | ObjectId   | ref: User                                      |
| amount             | Number     | Points amount                                  |
| type               | String     | earned / spent                                 |
| reason             | String     | Human-readable reason                          |
| relatedPaper       | ObjectId   | ref: Paper (optional)                          |
| relatedReview      | ObjectId   | ref: Review (optional)                         |
| txHash             | String     | On-chain transaction hash (optional)           |
| createdAt          | Date       | Auto timestamp                                 |

## Points System
| Action              | Points |
|---------------------|--------|
| Submit a paper      | +10    |
| Paper published     | +50    |
| Complete a review   | +25    |
| Review accepted     | +10    |
