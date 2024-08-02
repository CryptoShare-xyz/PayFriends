/* ToDo:
[x] finish getGroupInfo
[x] test getGroupInfo
[] test events
[] implement depositToGroup
[] implement withdrawFunds
[] handle exceptions and input validation
[] implement a new contract for each group. this is the only way to deposit funds a separte eth account address for each group (without this the contract GroupSplit has the money of all groups which is clearly very unsecure)


*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract GroupSplit {
    struct Participant {
        address participantAddress;
        string nickname;
        uint256 totalDeposits;
    }

    struct Group {
        uint256 groupId; // ToDo: generate random id
        string groupName;
        bool status; // True = opened; False = closed;
        string url;
        uint256 creationTime; // ToDo: to understand how time can be registered on-chain
        address owner;
        string ownerNickname;
        uint256 balance; // the current group balance
        uint256 totalCollected; // the total payments received to the group by the participants
        uint256 totalWithdrawn; // the total withdrawals from the group by the owner
        address[] participantsAddresses; // the addresses of all participants who sent payments to the group
        mapping(address => Participant) participantDetails; // Mapping to store participants' details
    }

    Group[] public groups;
    uint256[] public groupIds;
    mapping(uint256 => uint256) private groupIndexById; // Mapping from groupId to index in the groups array
    mapping(bytes32 => uint256) private groupIdByUrl; // Mapping from url to groupId in the groups array
    uint256 public activeGroups = 0;

    // Add a participant to a group
    function addParticipantToGroup(
        uint256 _groupId,
        address _participantAddress,
        string memory _nickname,
        uint256 _totalDeposits
    ) public {
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];
        group.participantDetails[_participantAddress] = Participant(
            _participantAddress,
            _nickname,
            _totalDeposits
        );
        group.participantsAddresses.push(_participantAddress);
    }

    // Define events for logging
    event logGroupCreated(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 creationTime
    );
    event logGroupClosed(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 closingTime
    );
    event logGroupOpened(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 openingTime
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
        uint256 balance,
        uint256 totalCollected,
        uint256 totalWithdrawn
    );
    event logTransferFailed(
        uint256 indexed groupId,
        address indexed owner,
        uint256 amount
    );

    function generateRandomNumber() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % 1000000;
    }

    function createGroup(
        string memory _groupName,
        string memory _ownerNickname,
        string memory _url
    ) public {
        // add to groups:
        Group storage newGroup = groups.push();
        activeGroups += 1;

        // initiate all parameters:
        newGroup.groupId = generateRandomNumber();
        newGroup.groupName = _groupName;
        newGroup.owner = msg.sender;
        newGroup.ownerNickname = _ownerNickname;
        newGroup.url = _url;
        newGroup.creationTime = block.timestamp;
        newGroup.status = true; // True = opened; False = closed;
        newGroup.balance = 0; // the current group balance
        newGroup.totalCollected = 0; // the total payments received to the group by the participants
        newGroup.totalWithdrawn = 0; // the total withdrawals from the group by the owner

        // add group to groups list and mapping
        uint256 index = groups.length - 1;
        groupIndexById[newGroup.groupId] = index; // Mapping from groupId to index in the groups array
        groupIdByUrl[keccak256(abi.encodePacked(newGroup.url))] = newGroup
            .groupId; // Mapping from url to groupId in the groups array

        groupIds.push(newGroup.groupId);
        // Emit the event with the index
        emit logGroupCreated(
            newGroup.groupId,
            newGroup.owner,
            newGroup.groupName,
            newGroup.creationTime
        );
    }

    function getGroupIndexById(uint256 _groupId) public view returns (uint256) {
        require(
            groupIndexById[_groupId] < groups.length,
            "Group does not exist"
        );
        return groupIndexById[_groupId];
    }

    // Example function to show usage
    function getGroupIdByUrl(uint256 _url) public view returns (uint256) {
        return groupIdByUrl[keccak256(abi.encodePacked(_url))];
    }

    // Function to return all group IDs
    function getAllGroupIds() public view returns (uint256[] memory) {
        return groupIds;
    }

    function getGroupInfoById(
        uint256 _groupId
    )
        public
        view
        returns (
            uint256,
            string memory,
            address,
            string memory,
            string memory,
            uint256,
            bool,
            uint256,
            uint256,
            uint256,
            address[] memory
        )
    {
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];
        return (
            group.groupId,
            group.groupName,
            group.owner,
            group.ownerNickname,
            group.url,
            group.creationTime,
            group.status,
            group.balance,
            group.totalCollected,
            group.totalWithdrawn,
            group.participantsAddresses
        );
    }

    function getGroupsNum() public view returns (uint256) {
        return groups.length;
    }

    function depositToGroup(
        uint256 _groupId,
        string memory nickname
    ) public payable {
        // add participant address and nickname to list
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];
        group.participantsAddresses.push(msg.sender);
    }

    function withdrawFunds(uint256 _groupId) public payable {
        // make sure the msg.sender is the group owner
        uint256 x;
    }
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
