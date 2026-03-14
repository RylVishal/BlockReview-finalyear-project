// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlockReview
 * @dev Blockchain-Based Academic Publishing and Peer Review Platform
 */
contract BlockReview {
    
    // ─── Structs ──────────────────────────────────────────────────────────────
    
    struct Paper {
        uint256 id;
        string paperHash;       // IPFS hash of the paper
        string metadataHash;    // IPFS hash of metadata (title, abstract, etc.)
        address author;
        uint256 submittedAt;
        PaperStatus status;
        uint256 reviewCount;
        uint256 totalRating;
    }
    
    struct Review {
        uint256 id;
        uint256 paperId;
        address reviewer;
        string reviewHash;      // IPFS hash of review content
        uint8 rating;           // 1-5 rating
        uint256 submittedAt;
        bool isApproved;
    }
    
    struct PointTransaction {
        address user;
        uint256 amount;
        string reason;
        uint256 timestamp;
        TransactionType txType;
    }
    
    enum PaperStatus { Submitted, UnderReview, RevisionRequired, Published, Rejected }
    enum TransactionType { Earned, Spent }
    
    // ─── State Variables ──────────────────────────────────────────────────────
    
    address public admin;
    uint256 public paperCount;
    uint256 public reviewCount;
    
    // Points constants
    uint256 public constant SUBMIT_PAPER_REWARD = 10;
    uint256 public constant COMPLETE_REVIEW_REWARD = 25;
    uint256 public constant PAPER_PUBLISHED_REWARD = 50;
    uint256 public constant REVIEW_ACCEPTED_REWARD = 10;
    
    mapping(uint256 => Paper) public papers;
    mapping(uint256 => Review) public reviews;
    mapping(address => uint256) public userPoints;
    mapping(address => uint256[]) public userPapers;
    mapping(address => uint256[]) public userReviews;
    mapping(uint256 => uint256[]) public paperReviews;
    mapping(address => PointTransaction[]) public pointHistory;
    mapping(uint256 => address[]) public paperReviewers;
    
    // ─── Events ───────────────────────────────────────────────────────────────
    
    event PaperSubmitted(uint256 indexed paperId, address indexed author, string paperHash);
    event PaperStatusUpdated(uint256 indexed paperId, PaperStatus newStatus);
    event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed paperId, address indexed reviewer);
    event PointsAwarded(address indexed user, uint256 amount, string reason);
    event ReviewerAssigned(uint256 indexed paperId, address indexed reviewer);
    
    // ─── Modifiers ────────────────────────────────────────────────────────────
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier paperExists(uint256 _paperId) {
        require(_paperId > 0 && _paperId <= paperCount, "Paper does not exist");
        _;
    }
    
    // ─── Constructor ──────────────────────────────────────────────────────────
    
    constructor() {
        admin = msg.sender;
    }
    
    // ─── Paper Functions ──────────────────────────────────────────────────────
    
    /**
     * @dev Submit a new research paper
     */
    function submitPaper(string memory _paperHash, string memory _metadataHash) 
        external 
        returns (uint256) 
    {
        paperCount++;
        
        papers[paperCount] = Paper({
            id: paperCount,
            paperHash: _paperHash,
            metadataHash: _metadataHash,
            author: msg.sender,
            submittedAt: block.timestamp,
            status: PaperStatus.Submitted,
            reviewCount: 0,
            totalRating: 0
        });
        
        userPapers[msg.sender].push(paperCount);
        
        // Award points for submission
        _awardPoints(msg.sender, SUBMIT_PAPER_REWARD, "Paper Submitted");
        
        emit PaperSubmitted(paperCount, msg.sender, _paperHash);
        
        return paperCount;
    }
    
    /**
     * @dev Update paper status (admin only)
     */
    function updatePaperStatus(uint256 _paperId, PaperStatus _newStatus) 
        external 
        onlyAdmin 
        paperExists(_paperId) 
    {
        PaperStatus oldStatus = papers[_paperId].status;
        papers[_paperId].status = _newStatus;
        
        // Award extra points when paper is published
        if (_newStatus == PaperStatus.Published && oldStatus != PaperStatus.Published) {
            _awardPoints(papers[_paperId].author, PAPER_PUBLISHED_REWARD, "Paper Published");
        }
        
        emit PaperStatusUpdated(_paperId, _newStatus);
    }
    
    /**
     * @dev Assign reviewer to a paper
     */
    function assignReviewer(uint256 _paperId, address _reviewer) 
        external 
        onlyAdmin 
        paperExists(_paperId) 
    {
        require(papers[_paperId].author != _reviewer, "Author cannot review own paper");
        
        papers[_paperId].status = PaperStatus.UnderReview;
        paperReviewers[_paperId].push(_reviewer);
        
        emit ReviewerAssigned(_paperId, _reviewer);
    }
    
    // ─── Review Functions ─────────────────────────────────────────────────────
    
    /**
     * @dev Submit a review for a paper
     */
    function submitReview(
        uint256 _paperId, 
        string memory _reviewHash, 
        uint8 _rating
    ) 
        external 
        paperExists(_paperId)
        returns (uint256)
    {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(papers[_paperId].author != msg.sender, "Author cannot review own paper");
        require(papers[_paperId].status == PaperStatus.UnderReview, "Paper is not under review");
        
        reviewCount++;
        
        reviews[reviewCount] = Review({
            id: reviewCount,
            paperId: _paperId,
            reviewer: msg.sender,
            reviewHash: _reviewHash,
            rating: _rating,
            submittedAt: block.timestamp,
            isApproved: false
        });
        
        paperReviews[_paperId].push(reviewCount);
        userReviews[msg.sender].push(reviewCount);
        
        // Update paper rating
        papers[_paperId].reviewCount++;
        papers[_paperId].totalRating += _rating;
        
        // Award points for completing review
        _awardPoints(msg.sender, COMPLETE_REVIEW_REWARD, "Review Completed");
        
        emit ReviewSubmitted(reviewCount, _paperId, msg.sender);
        
        return reviewCount;
    }
    
    /**
     * @dev Approve a review (admin only)
     */
    function approveReview(uint256 _reviewId) external onlyAdmin {
        require(_reviewId > 0 && _reviewId <= reviewCount, "Review does not exist");
        require(!reviews[_reviewId].isApproved, "Review already approved");
        
        reviews[_reviewId].isApproved = true;
        _awardPoints(reviews[_reviewId].reviewer, REVIEW_ACCEPTED_REWARD, "Review Accepted");
    }
    
    // ─── Points Functions ─────────────────────────────────────────────────────
    
    /**
     * @dev Internal function to award points
     */
    function _awardPoints(address _user, uint256 _amount, string memory _reason) internal {
        userPoints[_user] += _amount;
        
        pointHistory[_user].push(PointTransaction({
            user: _user,
            amount: _amount,
            reason: _reason,
            timestamp: block.timestamp,
            txType: TransactionType.Earned
        }));
        
        emit PointsAwarded(_user, _amount, _reason);
    }
    
    // ─── View Functions ───────────────────────────────────────────────────────
    
    function getPaper(uint256 _paperId) 
        external 
        view 
        paperExists(_paperId) 
        returns (Paper memory) 
    {
        return papers[_paperId];
    }
    
    function getReview(uint256 _reviewId) external view returns (Review memory) {
        require(_reviewId > 0 && _reviewId <= reviewCount, "Review does not exist");
        return reviews[_reviewId];
    }
    
    function getUserPoints(address _user) external view returns (uint256) {
        return userPoints[_user];
    }
    
    function getUserPapers(address _user) external view returns (uint256[] memory) {
        return userPapers[_user];
    }
    
    function getUserReviews(address _user) external view returns (uint256[] memory) {
        return userReviews[_user];
    }
    
    function getPaperReviews(uint256 _paperId) external view returns (uint256[] memory) {
        return paperReviews[_paperId];
    }
    
    function getAverageRating(uint256 _paperId) 
        external 
        view 
        paperExists(_paperId)
        returns (uint256) 
    {
        Paper memory paper = papers[_paperId];
        if (paper.reviewCount == 0) return 0;
        return paper.totalRating / paper.reviewCount;
    }
    
    function getPointHistory(address _user) 
        external 
        view 
        returns (PointTransaction[] memory) 
    {
        return pointHistory[_user];
    }
    
    function getPaperReviewers(uint256 _paperId) 
        external 
        view 
        returns (address[] memory) 
    {
        return paperReviewers[_paperId];
    }
    
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
