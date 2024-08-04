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
              // console.log(`groupIds = ${newGroupIds}`);

              const groupInfo = await groupSplit.getGroupInfoById(newGroupIds[0]);
              // console.log(groupInfo);

          });
          it("depositToGroup", async function(){
            const { groupSplit, owner, user1, user2, user3 } = await loadFixture(deployFixture);
            const groupName = "test_group1";
            const ownerNickname = "owner_nick1";
            const url = "test_url1";
            const participantnickname = "test_nickname1";
            const depositAmount = 123; // 1 WEI
            // console.log(`user1 = ${user1.address}`);

            // Perform the transaction
            const tx = await groupSplit.createGroup(groupName, ownerNickname, url);

            const newGroupIds = await groupSplit.getAllGroupIds();
            // console.log(`groupIds = ${newGroupIds}`);

            const groupInfo = await groupSplit.getGroupInfoById(newGroupIds[0]);
            // console.log(groupInfo);

            const tx2 = await groupSplit.connect(user1).depositToGroup(newGroupIds[0],participantnickname,{value: depositAmount})

            const groupInfo2 = await groupSplit.getGroupInfoById(newGroupIds[0]);

            expect(groupInfo2[1]).equal("test_group1");
            expect(groupInfo2[2]).equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
            expect(groupInfo2[3]).equal("owner_nick1");
            expect(groupInfo2[4]).equal("test_url1");
            expect(groupInfo2[6]).equal(true);
            expect(groupInfo2[7]).equal(123);
            expect(groupInfo2[8]).equal(123);
            expect(groupInfo2[9]).equal(0);
            expect(groupInfo2[10]).deep.equal(['0x70997970C51812dc3A010C7d01b50e0d17dc79C8']);
            // console.log(groupInfo2);
            
        });
      });
  });
});