// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GroupSplit {
    struct Group {
        uint256 groupId;   // ToDo: generate random id
        string groupName;
        bool groupStatus; // True = opened; False = closed;
        string url;
        uint256 creationTime; // ToDo: to understand how time can be registered on-chain
        address creator;
        uint256 balance; // the current group balance
        uint256 totalCollected; // the total payments received to the group by the participants
        uint256 totalWithdrawn; // the total withdrawals from the group by the creator
        address[] participantsAddresses; // the addresses of all participants who sent payments to the group
        mapping(address => string) nicknames; // mapping between the participant address and a nickname (so the creator can see who paid)
        
    }

    Group[] public groups;
    uint256 public activeGroups = 0;
    uint256 public cashFlow = 0;

    // Define events for logging
    event logGroupCreated(
        uint256 indexed groupId,
        address indexed creator,
        string indexed groupName;
        uint256 creationTime,
    );
    event logGroupPaymentReceived(
        uint256 indexed groupId,
        address indexed participant,
        string nickname,
        uint256 paymentAmount
    );
    event logGroupWithdrawal(
        uint256 indexed groupId,
        uint256 amountTransferred,
        string time,
        uint256 balance; // the current group balance
        uint256 totalCollected; // the total payments received to the group by the participants
        uint256 totalWithdrawn; // the total withdrawals from the group by the creator
    );
    event logTransferFailed(
        uint256 indexed groupId,
        address indexed creator,
        uint256 amount
    );
    
    function generateRandomNumber() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 1000000;
    }

    function createGroup(
        string groupName
    ) public {
        uint256 groupId = generateRandomNumber();
        bool groupStatus = True; // True = opened; False = closed;
        string url; // ToDo: understand if we want to pass this as a variable
        uint256 creationTime = block.timestamp;
        address creator = msg.sender;
        uint256 balance = 0; // the current group balance
        uint256 totalCollected = 0; // the total payments received to the group by the participants
        uint256 totalWithdrawn = 0; // the total withdrawals from the group by the creator
        address[] participantsAddresses; // the addresses of all participants who sent payments to the group
        mapping(address => string) nicknames; // mapping between the participant address and a nickname (so the creator can see who paid)

        // Emit the event with the index
        activeGroups += 1;
        emit LogGroupCreated(groupId,creator,groupName,creationTime);
    }
/* 
    function approvegroup(uint256 _groupId) public payable {
        group storage group = groups[_groupId];
        require(!group.completed, "group already completed");
        require(!group.approvals[msg.sender], "Already approved");
        require(msg.value > 0, "Must send ETH to approve");

        bool isApproverValid = false;
        for (uint256 i = 0; i < group.splitAddresses.length; i++) {
            if (group.splitAddresses[i] == msg.sender) {
                isApproverValid = true;
                break;
            }
        }
        require(
            isApproverValid,
            "You are not authorized to approve this group"
        );

        group.approvals[msg.sender] = true;
        group.collectedAmount += msg.value;
        cashFlow += msg.value;
        emit LoggroupApproved(_groupId, msg.sender, msg.value);

        // Check if all approvals are received
        bool allApproved = true;
        for (uint256 i = 0; i < group.splitAddresses.length; i++) {
            if (!group.approvals[group.splitAddresses[i]]) {
                allApproved = false;
                break;
            }
        }

        if (allApproved) {
            group.completed = true;
            activegroups -= 1;
            uint256 amountToTransfer = group.collectedAmount;
            group.collectedAmount = 0;
            (bool success, ) = payable(group.creator).call{
                value: amountToTransfer
            }("");
            if (success) {
                emit LoggroupCompleted(_groupId, amountToTransfer);
            } else {
                emit LogTransferFailed(
                    _groupId,
                    group.creator,
                    amountToTransfer
                );
            }
        }
    }

    function getgroup(
        uint256 _index
    )
        public
        view
        returns (
            address,
            uint256,
            address[] memory,
            bool,
            bool[] memory,
            uint256
        )
    {
        group storage group = groups[_index];
        bool[] memory approvalsArray = new bool[](
            group.splitAddresses.length
        );
        for (uint256 i = 0; i < group.splitAddresses.length; i++) {
            approvalsArray[i] = group.approvals[group.splitAddresses[i]];
        }
        return (
            group.creator,
            group.amount,
            group.splitAddresses,
            group.completed,
            approvalsArray,
            group.collectedAmount
        );

    }

    function getgroupsLength() public view returns (uint256) {
        return groups.length;
    }

    function getActivegroups() public view returns (uint256) {
        return groups.length;
    }

    receive() external payable {}
}
*/