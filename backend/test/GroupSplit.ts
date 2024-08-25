import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";


describe("GroupSplit", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3] = await hre.ethers.getSigners();

    const GroupSplit = await hre.ethers.getContractFactory("GroupSplit");
    const groupSplit = await GroupSplit.deploy();
    await groupSplit.waitForDeployment();

    return { groupSplit, owner, user1, user2, user3 };
  }


  describe("Groups", function () {
    describe("Sanity", async function () {
      it("Should compile and deploy", async function () {
        const { groupSplit } = await loadFixture(deployFixture);
        expect(await groupSplit.getGroupsNum()).equal(1)
      });

      it("Create a Group", async function () {
        const { groupSplit, owner } = await loadFixture(deployFixture);
        const groupName = "test_group";
        const ownerNickname = "owner_nick";

        // Perform the transaction
        const tx = await groupSplit.createGroup(groupName, ownerNickname)

        // Verify the event emission
        await expect(tx)
          .to.emit(groupSplit, "logGroupCreated")
          .withArgs(anyValue, owner.address, groupName, anyValue);
      });

      it("Get Group Info", async function () {
        const { groupSplit, owner } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";

        // Perform the transaction
        const tx = await groupSplit.createGroup(groupName, ownerNickname);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]
        const timestamp = receipt?.logs[0]?.args[3]
        const group = await groupSplit.getGroupInfoById(groupId)
        expect(group).to.deep.equal([
          groupId,
          groupName,
          owner.address,
          ownerNickname,
          timestamp,
          true,
          0n,
          0n,
          0n,
          [owner.address]
        ])
      });


      it("depositToGroup", async function () {
        const { groupSplit, owner, user1 } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const participantNickname = "test_nickname1";
        const depositAmount = 123; // 1 WEI

        const tx = await groupSplit.createGroup(groupName, ownerNickname);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        // Perform the transaction
        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, { value: depositAmount })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount);

        const groupInfo2 = await groupSplit.getGroupInfoById(groupId);
        expect(groupInfo2[6]).equal(123);
        expect(groupInfo2[7]).equal(123);
        expect(groupInfo2[9]).to.deep.equal([owner.address, user1.address])

      });

      it("withdrawFromGroup", async function () {
        const { groupSplit, owner, user1 } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const participantNickname = "test_nickname1";
        const depositAmount = 123; // 1 WEI

        const tx = await groupSplit.createGroup(groupName, ownerNickname);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, { value: depositAmount })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount);

        // Perform the transaction
        const tx3 = await groupSplit.withdrawFromGroup(groupId);
        await expect(tx3).to.changeEtherBalance(owner, depositAmount);

        await expect(tx3)
          .to.emit(groupSplit, "logGroupWithdrawal")
          .withArgs(groupId, 0, anyValue, depositAmount, depositAmount);


      });

    });
  });
});