# CryptoShare
A group payments app to split different payments among friends.

The App contains:
* ExpenseSplitter.sol: a smart contract that operates expense creation and approval.

## Getting started

### Install
Use `npm i --include=dev` to install dev requirements.

### Test
Run `npx hardhat test` to test the contract

### UI
1. Change folder to `fronend/` and run `npm i --include=dev`
2. Run in some terminal `npx hardhat node`
3. In another terminal run `npx hardhat ignition deploy ./ignition/modules/ExpenseSplitter.ts --network localhost`
4. Copy the contact address to `app/page.tsx`.
5. Then `cd` to `frontend/` and run `num run dev`

> Note it you compile the contract again replace `app/ExpenseSplitter.json` with the new one

## TODO
- [ ] switch to hardhat environment and Sepolia
- [ ] FrontEnd to interact with contract
- [ ] move to the most convenient L2
- [ ] consider supporting USDC instead of eth transfers
- [ ] integration with metamask or another wallet