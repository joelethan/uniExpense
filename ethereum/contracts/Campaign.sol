// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign() public {
        address newCampaign = address(new Campaign(msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint256 public numRequests;
    mapping(uint256 => Request) public requests;

    address public manager;
    uint256 public BOGcount;
    mapping(address => bool) boardOfGov;
    mapping(address => uint256) memberContributions;

    constructor(address creator) {
        manager = creator;
    }

    modifier isManager() {
        require(manager == msg.sender, "Please use the Manager Account");
        _;
    }

    function constractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function addMember(address governor) public payable isManager {
        require(!boardOfGov[governor], "Address is already on the Board");
        boardOfGov[governor] = true;
        BOGcount++;
    }

    function fundContract() public payable {
        require(
            boardOfGov[msg.sender],
            "Funds are allocated by only Board members"
        );
        require(
            msg.value < msg.sender.balance,
            "You don not have enough funds"
        );
        memberContributions[msg.sender] += msg.value;
    }

    function getMemberContribution(address member)
        public
        view
        isManager
        returns (uint256)
    {
        return memberContributions[member];
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public isManager {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage r = requests[index];
        require(boardOfGov[msg.sender], "Only Board members can vote");
        require(
            !r.approvals[msg.sender],
            "You have already voted for this request"
        );
        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint256 index) public isManager {
        Request storage request = requests[index];
        require(!request.complete, "Request is already complte");
        require(
            request.approvalCount > BOGcount / 2,
            "Not enough votes to complte Request"
        );
        require(
            request.value < address(this).balance,
            "Not enough funds on the contract"
        );
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}

// deploy
// addMember
// contribute
// createRequest
// vote
// finalize
