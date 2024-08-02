import {
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";


describe("GroupSplit", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
      // Contracts are deployed using the first signer/account by default
      const [owner, user1, user2, user3] = await hre.ethers.getSigners();

      const GroupSplit = await hre.ethers.getContractFactory("GroupSplit");
      const groupSplit = await GroupSplit.deploy();

      return { groupSplit, owner, user1, user2, user3 };
  }


  describe("Groups", function () {
      describe("Sanity", async function () {
          it("Should compile and deploy", async function () {
              const { groupSplit } = await loadFixture(deployFixture);
              expect(await groupSplit.getGroupsNum()).equal(0)
          });
          it("Create a Group", async function () {
              const { groupSplit, owner, user1, user2, user3 } = await loadFixture(deployFixture);
              const groupName = "test_group";
              const ownerNickname = "owner_nick";
              const url = "test_url";
              // const splitAddresses = [user1.address, user2.address, user3.address]
              
              // Perform the transaction
              const tx = await groupSplit.createGroup(groupName, ownerNickname, url);

              // Log the number of groups created
              // const groupCount = await groupSplit.getGroupsNum();
              // console.log(`Number of Groups Created: ${groupCount}`);
       
              // Wait for the transaction to be mined
              const receipt = await tx.wait();

              // Verify the event emission
              await expect(tx)
              .to.emit(groupSplit, "logGroupCreated")
              .withArgs(anyValue, owner.address, groupName, anyValue);
          });
          it("Get Group Info", async function(){
              const { groupSplit, owner, user1, user2, user3 } = await loadFixture(deployFixture);
              const groupName = "test_group1";
              const ownerNickname = "owner_nick1";
              const url = "test_url1";

              // Perform the transaction
              const tx = await groupSplit.createGroup(groupName, ownerNickname, url);

              const newGroupIds = await groupSplit.getAllGroupIds();
              console.log(`groupIds = ${newGroupIds}`);

              const groupInfo = await groupSplit.getGroupInfoById(newGroupIds[0]);
              console.log(groupInfo);

          });
              // expect(await expenseSplitter.getExpensesLength()).equal(1)
            
              // const expense = await expenseSplitter.getExpense(0);

              // expect(expense[0]).to.equal(owner.address); // creator
              // expect(expense[1]).to.equal(amount); // amount
              // expect(expense[2]).to.deep.equal(splitAddresses); // splitAddresses
              // expect(expense[3]).to.be.false; // completed
              // expect(expense[4]).to.deep.equal([false, false, false]); // approvals
              // expect(expense[5]).to.equal(0); // collectedAmount

          // it("Approve an expense", async function () {
          //     const { expenseSplitter, owner, user1, user2, user3 } = await loadFixture(deployFixture);
          //     const amount = 9
          //     const splitAddresses = [user1.address, user2.address, user3.address]

          //     await expect(expenseSplitter.createExpense(amount, splitAddresses))
          //         .to.emit(expenseSplitter, "LogExpenseCreated")
          //         .withArgs(0, owner.address, amount, splitAddresses);

          //     expect(await expenseSplitter.getExpensesLength()).equal(1)

          //     await expect(
          //         expenseSplitter.connect(user1).approveExpense(0, { value: 9 })
          //     )
          //         .to.emit(expenseSplitter, "LogExpenseApproved")
          //         .withArgs(0, user1.address, 9);

          //     const expense = await expenseSplitter.getExpense(0);

          //     expect(expense[0]).to.equal(owner.address); // creator
          //     expect(expense[1]).to.equal(amount); // amount
          //     expect(expense[2]).to.deep.equal(splitAddresses); // splitAddresses
          //     expect(expense[3]).to.be.false; // completed
          //     expect(expense[4]).to.deep.equal([true, false, false]); // approvals
          //     expect(expense[5]).to.equal(9); // collectedAmount

          // });

          // it("Complete an expense", async function () {
          //     const { expenseSplitter, owner, user1, user2, user3 } = await loadFixture(deployFixture);
          //     const amount = 9
          //     const splitAddresses = [user1.address, user2.address, user3.address]

          //     await expect(expenseSplitter.createExpense(amount, splitAddresses))
          //         .to.emit(expenseSplitter, "LogExpenseCreated")
          //         .withArgs(0, owner.address, amount, splitAddresses);

          //     expect(await expenseSplitter.getExpensesLength()).equal(1)

          //     // need to check this here because the expense costs money
          //     const ownerBalance = await ethers.provider.getBalance(owner)

          //     await expect(
          //         expenseSplitter.connect(user1).approveExpense(0, { value: 9 })
          //     )
          //         .to.emit(expenseSplitter, "LogExpenseApproved")
          //         .withArgs(0, user1.address, 9);

          //     await expect(
          //         expenseSplitter.connect(user2).approveExpense(0, { value: 9 })
          //     )
          //         .to.emit(expenseSplitter, "LogExpenseApproved")
          //         .withArgs(0, user2.address, 9);

          //     await expect(
          //         expenseSplitter.connect(user3).approveExpense(0, { value: 9 })
          //     )
          //         .to.emit(expenseSplitter, "LogExpenseApproved")
          //         .withArgs(0, user3.address, 9);

          //     const expense = await expenseSplitter.getExpense(0);

          //     expect(expense[0]).to.equal(owner.address); // creator
          //     expect(expense[1]).to.equal(amount); // amount
          //     expect(expense[2]).to.deep.equal(splitAddresses); // splitAddresses
          //     expect(expense[3]).to.be.true; // completed
          //     expect(expense[4]).to.deep.equal([true, true, true]); // approvals
          //     expect(expense[5]).to.equal(0); // collectedAmount

          //     expect(await ethers.provider.getBalance(owner)).to.equal(ownerBalance + BigInt(3 * 9))

          // });
      });
  });
});