/* ToDo:
[x] finish getGroupInfo
[x] test getGroupInfo
[x] implement depositToGroup
[x]  test depositToGroup
[x] implement withdrawFromGroup
[]  test withdrawFromGroup
[] test events
[] handle exceptions and input validation


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
    uint256 public activeGroups = 0;

    constructor() {
        // make genesis group unvalid
        groups.push();
    }

    // Modifier to check if the group is open
    modifier isGroupOpen(uint256 _groupId) {
        uint256 index = getGroupIndexById(_groupId);
        require(groups[index].status == true, "Group is closed");
        _;
    }

    // Add a participant to a group
    function addParticipantToGroup(
        uint256 _groupId,
        address _participantAddress,
        string memory _nickname,
        uint256 _deposit
    ) public {
        uint256 index = getGroupIndexById(_groupId);
        // Ensure the group exists
        require(groups[index].groupId == _groupId, "Group does not exist");

        Group storage group = groups[index];

        // Check if the participant already exists in the mapping by verifying the address
        if (
            group.participantDetails[_participantAddress].participantAddress !=
            address(0)
        ) {
            // If participant already exists, update their total deposits
            group
                .participantDetails[_participantAddress]
                .totalDeposits += _deposit;
        } else {
            // Create a new participant

            Participant memory newParticipant = Participant({
                participantAddress: _participantAddress,
                nickname: _nickname,
                totalDeposits: _deposit
            });
            group.participantDetails[_participantAddress] = newParticipant;

            group.participantsAddresses.push(_participantAddress);
        }
        // Update group's balance and totalCollected
        group.balance += _deposit;
        group.totalCollected += _deposit;
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
    event logGroupDepositReceived(
        uint256 indexed groupId,
        address indexed participant,
        string nickname,
        uint256 deposit
    );
    event logGroupWithdrawal(
        uint256 indexed groupId,
        uint256 amountWithdrawn,
        uint256 time,
        uint256 totalCollected,
        uint256 totalWithdrawn
    );
    event logWithdrawalFailed(
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
        string memory _ownerNickname
    ) public {
        // add to groups:
        Group storage newGroup = groups.push();
        activeGroups += 1;

        // initiate all parameters:
        newGroup.groupId = generateRandomNumber();
        newGroup.groupName = _groupName;
        newGroup.owner = msg.sender;
        newGroup.ownerNickname = _ownerNickname;
        newGroup.creationTime = block.timestamp;
        newGroup.status = true; // True = opened; False = closed;
        newGroup.balance = 0; // the current group balance
        newGroup.totalCollected = 0; // the total payments received to the group by the participants
        newGroup.totalWithdrawn = 0; // the total withdrawals from the group by the owner

        // add group to groups list and mapping
        uint256 index = groups.length - 1;
        groupIndexById[newGroup.groupId] = index; // Mapping from groupId to index in the groups array

        groupIds.push(newGroup.groupId);

        // Make owner a participant
        addParticipantToGroup(newGroup.groupId, msg.sender, _ownerNickname, 0);
        // Emit the event with the index
        emit logGroupCreated(
            newGroup.groupId,
            newGroup.owner,
            newGroup.groupName,
            newGroup.creationTime
        );
    }

    function getGroupIndexById(uint256 _groupId) public view returns (uint256) {
        require(groupIndexById[_groupId] != 0, "Group does not exist");
        return groupIndexById[_groupId];
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
        string memory _nickname
    ) external payable isGroupOpen(_groupId) {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        uint256 _deposit = msg.value;
        // add participant address and nickname to list
        addParticipantToGroup(_groupId, msg.sender, _nickname, _deposit);
        emit logGroupDepositReceived(_groupId, msg.sender, _nickname, _deposit);
    }

    function withdrawFromGroup(uint256 _groupId) public payable {
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];
        // make sure the msg.sender is the group owner
        require(msg.sender == group.owner, "Only group owner can withdraw");
        (bool success, ) = payable(group.owner).call{value: group.balance}("");
        if (success) {
            group.totalWithdrawn = group.balance;
            group.balance = 0;

            emit logGroupWithdrawal(
                _groupId,
                group.balance,
                block.timestamp,
                group.totalCollected,
                group.totalWithdrawn
            );
        } else {
            emit logWithdrawalFailed(_groupId, group.owner, group.balance);
        }
    }

    function getActivegroups() public view returns (uint256) {
        return activeGroups;
    }

    function getParticipantDetails(
        uint256 _groupId,
        address _participantAddress
    )
        public
        view
        returns (
            address participantAddress,
            string memory nickname,
            uint256 totalDeposits
        )
    {
        // Ensure the group exists
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];

        // Ensure the participant exists in the group
        Participant memory participant = group.participantDetails[
            _participantAddress
        ];
        require(
            participant.participantAddress != address(0),
            "Participant does not exist"
        );

        // Return participant's details
        return (
            participant.participantAddress,
            participant.nickname,
            participant.totalDeposits
        );
    }

    receive() external payable {}
}
