# CryptoShare
A group payments app to split different payments among friends.

https://cryptoshare-phi.vercel.app/

The App contains:
* ExpenseSplitter.sol: a smart contract that operates expense creation and approval.

## Getting started

### Install Backend
Change dir to `backend/` and run `npm i --include=dev` to install dev requirements.

### Test
Run `npx hardhat test` to test the contract

### UI
Change folder to `frontend/` and run `npm i --include=dev`

> Note it you compile the contract again replace `app/ExpenseSplitter.json` with the new one and if you deploy new maybe need to change contract address in code

## TODO
- [x] switch to hardhat environment and Sepolia
- [ ] FrontEnd to interact with contract
- [ ] move to the most convenient L2
- [ ] consider supporting USDC instead of eth transfers
- [x] integration with metamask or another wallet
- [ ] make code more efficient
- [ ] probably need to make expenseID from each one created for uniqueness



