# [PayFriends](https://payfriends.xyz)
Share Expenses, Save on Fees Powered by Crypto

## Getting started

### Installation
1. Install root dependencies `npm i --include=dev`
2. Install backend dependencies `npm --prefix backend i --include=dev`
3. Install frontend dependencies `npm --prefix frontend i --include=dev`

### Running dev environment
1. Create a local environment `cp frontend/.env.local.example frontend/.env.local` and add your API keys.
2. Run `npm run dev` in the root folder.
3. (only first time) import the private keys to your wallet (Metamask, Coinbase).
4. Deploy the contract `npm run deploy-dev` and add the address to the `frontend/.env.local`.

## Contract 

Work in the `backend/` folder and 

### Testing contract
Run `npx hardhat test` to test the contract create a local environment `cp .env.example .env` with your API keys.

### Deploying contract
1. For initial deploy change USDC addresses in `scripts/deploy.ts` and run `npx hardhat run scripts/deploy.ts --network {network}`
2. For an upgrade change `PROXY_ADDRESS` in `scripts/_deployV2.ts`  and run `npx hardhat run scripts/_deployV2.ts --network {network}`

### Verifying contract
1. Make sure `ETHERSCAN_API_KEY` is set in .env (for base use basescan API key).
2. Run `npx hardhat verify --network {network} {PROXY_ADDRESS}`

