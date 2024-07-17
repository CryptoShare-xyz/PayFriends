import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ExpenseSplitter", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, user1, user2, user3] = await hre.ethers.getSigners();

        const ExpenseSplitter = await hre.ethers.getContractFactory("ExpenseSplitter");
        const expenseSplitter = await ExpenseSplitter.deploy();

        return { expenseSplitter, owner, user1, user2, user3 };
    }


    describe("Expenses", function () {
        describe("Sanity", async function () {
            it("Should return the current expenses", async function () {
                const { expenseSplitter } = await loadFixture(deployFixture);

                expect(expenseSplitter.expenses.length).to.eq(0,
                    "There are some expenses that were not expected"
                );
            });

            it("Create an expense", async function () {
                const { expenseSplitter, owner, user1, user2, user3 } = await loadFixture(deployFixture);
                const amount = 9
                const splitAddresses = [user1.address, user2.address, user3.address]

                await expect(expenseSplitter.createExpense(amount, splitAddresses))
                    .to.emit(expenseSplitter, "LogExpenseCreated")
                    .withArgs(0, owner.address, amount, splitAddresses);

                const expense = await expenseSplitter.getExpense(0);

                expect(expense[0]).to.equal(owner.address); // creator
                expect(expense[1]).to.equal(amount); // amount
                expect(expense[2]).to.deep.equal(splitAddresses); // splitAddresses
                expect(expense[3]).to.be.false; // completed
                expect(expense[4]).to.deep.equal([false, false, false]); // approvals
                expect(expense[5]).to.equal(0); // collectedAmount
            });
        });
    });
});