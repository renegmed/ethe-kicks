pragma solidity ^0.4.17;

// Contract used by user to create and deploy contract Campaign.
// The user will be charged of the cost of deploying a contract Campaign.
// And user will not be able to see and tamper the contract Campaign source code 
contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public { 
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    // restricted to owner that can create a Request
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    // Approver of the request must be a contributor first - mapping(address => bool) public approvers;
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);             // the sender is already listed in approves list
        require(!request.approvals[msg.sender]);    // not in the list of request approvers

        request.approvals[msg.sender] = true;       // add approving sender in the list of request approvers
        request.approvalCount++;                    // increase the approval count +1
    }

    function finalizeRequest(uint index) public restricted {    // only the owner/administrator can finalize request
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount/2));    // approval count must be more than half of approver's total count
        require(!request.complete);                             // request should not yet be completed

        request.recipient.transfer(request.value);              // transfer amount to requester
        request.complete = true;                                // request is now completed
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,    // campaign's minimum contribution
            //this.balance,           // campaign current amount contribution - function contribute() public payable
            address(this).balance,
            requests.length,        // campaign's total number of requests
            approversCount,         // campaign's number of approvers
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}