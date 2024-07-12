// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExpenseSplitter {
    struct Expense {
        address creator;
        uint256 amount; // Total amount expected
        address[] splitAddresses;
        mapping(address => bool) approvals;
        bool completed;
        uint256 collectedAmount; // Collected amount from approvals
    }

    Expense[] public expenses;

    // Define events for logging
    event LogExpenseCreated(uint256 indexed index, address indexed creator, uint256 amount, address[] splitAddresses);
    event LogExpenseApproved(uint256 indexed expenseId, address indexed approver, uint256 amount);
    event LogExpenseCompleted(uint256 indexed expenseId, uint256 amountTransferred);
    event LogTransferFailed(uint256 indexed expenseId, address indexed creator, uint256 amount);

    function createExpense(uint256 _amount, address[] memory _splitAddresses) public {
        uint256 index = expenses.length;
        Expense storage newExpense = expenses.push();
        newExpense.creator = msg.sender;
        newExpense.amount = _amount;
        newExpense.splitAddresses = _splitAddresses;
        newExpense.collectedAmount = 0;

        // Emit the event with the index
        emit LogExpenseCreated(index, msg.sender, _amount, _splitAddresses);
    }

    function approveExpense(uint256 _expenseId) public payable {
        Expense storage expense = expenses[_expenseId];
        require(!expense.completed, "Expense already completed");
        require(!expense.approvals[msg.sender], "Already approved");
        require(msg.value > 0, "Must send ETH to approve");

        bool isApproverValid = false;
        for (uint256 i = 0; i < expense.splitAddresses.length; i++) {
            if (expense.splitAddresses[i] == msg.sender) {
                isApproverValid = true;
                break;
            }
        }
        require(isApproverValid, "You are not authorized to approve this expense");

        expense.approvals[msg.sender] = true;
        expense.collectedAmount += msg.value;
        emit LogExpenseApproved(_expenseId, msg.sender, msg.value);

        // Check if all approvals are received
        bool allApproved = true;
        for (uint256 i = 0; i < expense.splitAddresses.length; i++) {
            if (!expense.approvals[expense.splitAddresses[i]]) {
                allApproved = false;
                break;
            }
        }

        if (allApproved) {
            expense.completed = true;
            uint256 amountToTransfer = expense.collectedAmount;
            expense.collectedAmount = 0;
            (bool success, ) = payable(expense.creator).call{value: amountToTransfer}("");
            if (success) {
                emit LogExpenseCompleted(_expenseId, amountToTransfer);
            } else {
                emit LogTransferFailed(_expenseId, expense.creator, amountToTransfer);
            }
        }
    }

    function getExpense(uint256 _index) public view returns (address, uint256, address[] memory, bool, bool[] memory, uint256) {
        Expense storage expense = expenses[_index];
        bool[] memory approvalsArray = new bool[](expense.splitAddresses.length);
        for (uint256 i = 0; i < expense.splitAddresses.length; i++) {
            approvalsArray[i] = expense.approvals[expense.splitAddresses[i]];
        }
        return (expense.creator, expense.amount, expense.splitAddresses, expense.completed, approvalsArray, expense.collectedAmount);
    }

    receive() external payable {}
}
