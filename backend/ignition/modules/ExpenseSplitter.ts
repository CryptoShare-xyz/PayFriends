import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ExpenseSplitterModule = buildModule("ExpenseSplitterModule", (m) => {
    const expense_splitter = m.contract("ExpenseSplitter", [], {});

    return { expense_splitter };
});

export default ExpenseSplitterModule