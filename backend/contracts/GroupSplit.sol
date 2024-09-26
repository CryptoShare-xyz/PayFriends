/* ToDo:
[] test new withdrawFromGroup (with reentrancy protection)
[] test USDC supporting version
[X] improve generateRandomNumber (gpt recommendation)
[] revise again withdrawFromGroup for edge cases
[] implement open/close group
[] consider using a proxy contract
*/

// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

pragma solidity ^0.8.20;

contract GroupSplit is Initializable {
    // Use uint256 instead of bool for group state, see:
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27
    uint256 private constant _GROUP_CLOSED = 1;
    uint256 private constant _GROUP_OPEN = 2;

    struct Participant {
        address participantAddress;
        string nickname;
        uint256 totalDeposits;
        uint256 lastDeposited;
    }

    struct Group {
        uint256 groupId;
        string groupName;
        bool isUSDC; // New field to indicate if this group deals with USDC (true) or ETH (false)
        uint256 status;
        uint256 creationTime;
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

    // stats
    uint256 public contractOpenedGroupsStat;
    uint256 public contractTotalCollectedEthStat;
    uint256 public contractTotalCollectedUSDCStat;

    IERC20 public USDC;

    function initialize(address _usdcTokenAddress) public initializer {
        contractOpenedGroupsStat = 0;
        contractTotalCollectedEthStat = 0;
        contractTotalCollectedUSDCStat = 0;
        groups.push();
        USDC = IERC20(_usdcTokenAddress);
    }

    // Modifier to check if the group is open
    modifier isGroupOpen(uint256 _groupId) {
        uint256 index = getGroupIndexById(_groupId);
        require(groups[index].status == _GROUP_OPEN, "Group is closed");
        _;
    }

    // Add a participant to a group
    function addParticipantToGroup(
        uint256 _groupId,
        address _participantAddress,
        string memory _nickname,
        uint256 _deposit
    ) private {
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

            group.participantDetails[_participantAddress].lastDeposited = block
                .timestamp;
        } else {
            // Create a new participant

            Participant memory newParticipant = Participant({
                participantAddress: _participantAddress,
                nickname: _nickname,
                totalDeposits: _deposit,
                lastDeposited: block.timestamp
            });
            group.participantDetails[_participantAddress] = newParticipant;

            group.participantsAddresses.push(_participantAddress);
        }
    }

    // Define events for logging
    event logGroupCreated(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 creationTime,
        bool isUSDC
    );
    event logGroupClosed(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 closingTime,
        bool isUSDC
    );
    event logGroupOpened(
        uint256 indexed groupId,
        address indexed owner,
        string indexed groupName,
        uint256 openingTime,
        bool isUSDC
    );
    event logGroupDepositReceived(
        uint256 indexed groupId,
        address indexed participant,
        string nickname,
        uint256 deposit,
        bool isUSDC
    );
    event logGroupWithdrawal(
        uint256 indexed groupId,
        uint256 amountWithdrawn,
        uint256 time,
        uint256 totalCollected,
        uint256 totalWithdrawn,
        bool isUSDC
    );
    event logWithdrawalFailed(
        uint256 indexed groupId,
        address indexed owner,
        uint256 amount,
        bool isUSDC
    );

    function createGroup(
        string memory _groupName,
        string memory _ownerNickname,
        bool isUSDC // New flag to indicate if the group will use USDC or ETH
    ) external {
        // add to groups:
        Group storage newGroup = groups.push();

        // global stat update
        contractOpenedGroupsStat += 1;

        // initiate all parameters:
        newGroup.groupId = uint256(
            keccak256(
                abi.encodePacked(
                    _groupName,
                    msg.sender,
                    _ownerNickname,
                    block.timestamp,
                    block.prevrandao,
                    groups.length
                )
            )
        );

        newGroup.groupName = _groupName;
        newGroup.owner = msg.sender;
        newGroup.ownerNickname = _ownerNickname;
        newGroup.creationTime = block.timestamp;
        newGroup.status = _GROUP_OPEN;
        newGroup.balance = 0; // the current group balance
        newGroup.totalCollected = 0; // the total payments received to the group by the participants
        newGroup.totalWithdrawn = 0; // the total withdrawals from the group by the owner
        newGroup.isUSDC = isUSDC; // Store whether the group will deal with USDC or ETH

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
            newGroup.creationTime,
            newGroup.isUSDC
        );
    }

    function getGroupIndexById(
        uint256 _groupId
    ) private view returns (uint256) {
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
        external
        view
        returns (
            uint256,
            string memory,
            bool,
            address,
            string memory,
            uint256,
            uint256,
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
            group.isUSDC,
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
        string memory _nickname,
        bool isUSDCDeposit,
        uint256 usdcAmount // Specify the USDC amount in case of USDC deposit
    ) external payable isGroupOpen(_groupId) {
        uint256 index = getGroupIndexById(_groupId); // Get the index of the group
        Group storage group = groups[index]; // Load the group struct

        // Check if the deposit is in USDC or ETH
        require(
            group.isUSDC == isUSDCDeposit,
            "Invalid deposit type for this group"
        );

        uint256 _deposit;

        if (isUSDCDeposit) {
            // For USDC, ensure the deposit amount is specified
            require(usdcAmount > 0, "Deposit amount must be greater than zero");
            require(msg.value == 0, "No ether should be sent");

            // Check if user has enough USDC
            uint256 userBalance = USDC.balanceOf(msg.sender);
            require(userBalance >= usdcAmount, "Insufficient USDC balance");

            // Transfer USDC from the sender to the contract
            require(
                USDC.transferFrom(msg.sender, address(this), usdcAmount),
                "USDC Transfer failed"
            );
            _deposit = usdcAmount;
        } else {
            require(msg.value > 0, "Deposit amount must be greater than zero");
            _deposit = msg.value;
            // add participant address and nickname to list
        }

        addParticipantToGroup(_groupId, msg.sender, _nickname, _deposit);
        // Update group's balance and totalCollected
        group.balance += _deposit;
        group.totalCollected += _deposit;

        // global stat update
        if (isUSDCDeposit) {
            contractTotalCollectedUSDCStat += _deposit;
        } else {
            contractTotalCollectedEthStat += _deposit;
        }

        emit logGroupDepositReceived(
            _groupId,
            msg.sender,
            _nickname,
            _deposit,
            group.isUSDC
        );
    }

    function withdrawFromGroup(uint256 _groupId) external payable {
        uint256 index = getGroupIndexById(_groupId);
        Group storage group = groups[index];
        // make sure the msg.sender is the group owner
        require(msg.sender == group.owner, "Only group owner can withdraw");
        require(group.balance > 0, "No balance to withdraw");

        bool success;
        uint256 amount = group.balance;

        // Update state before the external call to avoid reentrancy
        group.totalWithdrawn += amount;
        group.balance = 0;

        if (group.isUSDC) {
            // For USDC withdrawal
            success = USDC.transfer(group.owner, amount);
            require(success, "USDC Transfer failed");
        } else {
            // For ETH withdrawal
            (success, ) = payable(group.owner).call{value: amount}("");
            require(success, "ETH Transfer failed");
        }

        if (!success) {
            // In case of failure, revert the balance changes
            group.balance = amount;
            group.totalWithdrawn -= amount;
            emit logWithdrawalFailed(
                _groupId,
                group.owner,
                group.balance,
                group.isUSDC
            );
            return;
        }

        group.status = _GROUP_CLOSED;

        emit logGroupWithdrawal(
            _groupId,
            amount,
            block.timestamp,
            group.totalCollected,
            group.totalWithdrawn,
            group.isUSDC
        );

        emit logGroupClosed(
            _groupId,
            group.owner,
            group.groupName,
            block.timestamp,
            group.isUSDC
        );
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
            uint256 totalDeposits,
            uint256 lastDeposited
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
            participant.totalDeposits,
            participant.lastDeposited
        );
    }
}
