import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const _GROUP_CLOSED = 1;
const _GROUP_OPEN = 2;

describe("GroupSplit", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployUSDCFixture() {
    const USDCMock = await hre.ethers.getContractFactory("USDCMock");
    const usdcMock = await USDCMock.deploy();
    await usdcMock.waitForDeployment();


    return { usdcMock };
  }

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, user3] = await hre.ethers.getSigners();
    const { usdcMock } = await loadFixture(deployUSDCFixture);

    const GroupSplit = await hre.ethers.getContractFactory("GroupSplit");
    const groupSplit = await GroupSplit.deploy(await usdcMock.getAddress());
    await groupSplit.waitForDeployment();

    console.log(await groupSplit.getAddress())
    await usdcMock.mint(owner.address, 1000000);
    await usdcMock.mint(user1.address, 1000000);
    await usdcMock.mint(user2.address, 1000000);
    await usdcMock.mint(user3.address, 1000000);

    return { groupSplit, usdcMock, owner, user1, user2, user3 };
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
        const isUSDC = false;

        // Perform the transaction
        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC)

        // Verify the event emission
        await expect(tx)
          .to.emit(groupSplit, "logGroupCreated")
          .withArgs(anyValue, owner.address, groupName, anyValue, false);
      });

      it("Get Group Info", async function () {
        const { groupSplit, owner } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const isUSDC = true;

        // Perform the transaction
        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]
        const timestamp = receipt?.logs[0]?.args[3]
        const group = await groupSplit.getGroupInfoById(groupId)
        expect(group).to.deep.equal([
          groupId,
          groupName,
          isUSDC,
          owner.address,
          ownerNickname,
          timestamp,
          _GROUP_OPEN,
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
        const isUSDC = false;

        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        // Perform the transaction
        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, isUSDC, 0, { value: depositAmount })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount, isUSDC);

        const groupInfo2 = await groupSplit.getGroupInfoById(groupId);
        expect(groupInfo2[7]).equal(123);
        expect(groupInfo2[8]).equal(123);
        expect(groupInfo2[10]).to.deep.equal([owner.address, user1.address])

      });

      it("depositUSDCToGroup", async function () {
        const { groupSplit, usdcMock, owner, user1 } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const participantNickname = "test_nickname1";
        const depositAmount = 123; // 1 WEI
        const isUSDC = true;

        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        await usdcMock.connect(user1).approve(await groupSplit.getAddress(), depositAmount);
        // Perform the transaction
        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, isUSDC, depositAmount, { value: 0 })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount, isUSDC);

        const groupInfo2 = await groupSplit.getGroupInfoById(groupId);
        expect(groupInfo2[7]).equal(123);
        expect(groupInfo2[8]).equal(123);
        expect(groupInfo2[10]).to.deep.equal([owner.address, user1.address])

      });

      it("withdrawFromGroup", async function () {
        const { groupSplit, owner, user1 } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const participantNickname = "test_nickname1";
        const depositAmount = 123; // 1 WEI
        const isUSDC = false;

        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, isUSDC, 0, { value: depositAmount })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount, isUSDC);

        // Perform the transaction
        const tx3 = await groupSplit.withdrawFromGroup(groupId);
        await expect(tx3).to.changeEtherBalance(owner, depositAmount);

        await expect(tx3)
          .to.emit(groupSplit, "logGroupWithdrawal")
          .withArgs(groupId, depositAmount, anyValue, depositAmount, depositAmount, isUSDC);


      });

      it("withdrawUSDCFromGroup", async function () {
        const { groupSplit, usdcMock, owner, user1 } = await loadFixture(deployFixture);
        const groupName = "test_group1";
        const ownerNickname = "owner_nick1";
        const participantNickname = "test_nickname1";
        const depositAmount = 123; // 1 WEI
        const isUSDC = true;

        const tx = await groupSplit.createGroup(groupName, ownerNickname, isUSDC);
        const receipt = await tx.wait()
        const groupId = receipt?.logs[0]?.args[0]

        await usdcMock.connect(user1).approve(await groupSplit.getAddress(), depositAmount);

        const tx2 = await groupSplit.connect(user1).depositToGroup(groupId, participantNickname, isUSDC, depositAmount, { value: 0 })
        await expect(tx2)
          .to.emit(groupSplit, "logGroupDepositReceived")
          .withArgs(groupId, user1.address, participantNickname, depositAmount, isUSDC);

        const beforeOwnerUSDCBalance = await usdcMock.balanceOf(owner.address);
        // Perform the transaction
        const tx3 = await groupSplit.withdrawFromGroup(groupId);
        const afterOwnerUSDCBalance = await usdcMock.balanceOf(owner.address);
        expect(afterOwnerUSDCBalance - beforeOwnerUSDCBalance).to.equal(depositAmount);
        await expect(tx3).to.changeEtherBalance(owner, 0);

        await expect(tx3)
          .to.emit(groupSplit, "logGroupWithdrawal")
          .withArgs(groupId, depositAmount, anyValue, depositAmount, depositAmount, isUSDC);


      });

    });
  });
});