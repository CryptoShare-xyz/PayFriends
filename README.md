# CryptoShare
A group payments app to split different payments among friends.

https://cryptoshare-phi.vercel.app/

The App contains:
* ExpenseSplitter.sol: a smart contract that operates expense creation and approval.

## Getting started

### Installation
1. Install root dependencies `npm i --include=dev`
2. Install backend dependencies `npm --prefix backend i --include=dev`
3. Install frontend dependencies `npm --prefix frontend i --include=dev`

### Running dev environment
1. Create a local environment `cp frontend/.env.local.example frontend/.env.local` and add your API keys.
2. Run `npm run dev` in the root folder.
3. (only first time) import the private keys to your wallet (Metamask, Coinbase).
4. Deploy the contract `npm run deploy-dev` and add the address to the `frontend/.env.local` to `NEXT_PUBLIC_CONTACT_ADDRESS`.

### Testing contract
Run `npx hardhat test` to test the contract

## TODO
- [x] switch to hardhat environment and Sepolia
- [ ] FrontEnd to interact with contract
- [ ] move to the most convenient L2
- [ ] consider supporting USDC instead of eth transfers
- [x] integration with metamask or another wallet
- [ ] make code more efficient
- [ ] probably need to make expenseID from each one created for uniqueness



