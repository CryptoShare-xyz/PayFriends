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
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const ExpenseSplitter = await hre.ethers.getContractFactory("ExpenseSplitter");
        const expense_splitter = await ExpenseSplitter.deploy();

        return { expense_splitter, owner, otherAccount };
    }


    describe("Expenses", function () {
        describe("Sanity", function () {
            it("Should return the current expenses", async function () {
                const { expense_splitter } = await loadFixture(deployFixture);

                expect(expense_splitter.expenses.length).to.eq(0,
                    "There are some expenses that were not expected"
                );
            });
        });
    });
});