import GroupSplitABI from "@/artifacts/contracts/GroupSplit.sol/GroupSplit.json";
import { GroupSplit } from "@/typechain-types/contracts";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import React, { createContext, useContext, useMemo } from 'react';
import Web3 from 'web3';
import type { Contract } from "web3-eth-contract";
import type { AbiItem } from 'web3-utils';
import USDCAbi from "./USDC.json";
// Context to hold the contract instance
const ContractContext = createContext<{ contract: GroupSplit | undefined, usdcContract: Contract<typeof USDCAbi> }>({ contract: undefined, usdcContract: undefined });

export const contractAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS
export const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTACT_ADDRESS

const createWeb3 = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545")
        return new Web3(provider)
    } else {
        const alchemyUrl = `wss://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        return createAlchemyWeb3(alchemyUrl);
    }
}


export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const contract = useMemo(() => {
        const web3 = createWeb3()
        return new web3.eth.Contract(
            GroupSplitABI.abi as AbiItem[],
            contractAddress
        ) as any as GroupSplit;
    }, []);

    const usdcContract = useMemo(() => {
        const web3 = createWeb3()
        return new web3.eth.Contract(
            USDCAbi as AbiItem[],
            usdcContractAddress
        ) as any as Contract<typeof USDCAbi>;
    }, []);

    return (
        <ContractContext.Provider value={{ contract, usdcContract }}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContract = () => {
    const { contract, usdcContract } = useContext(ContractContext);
    if (!contract || !usdcContract) {
        throw new Error('useContractContext must be used within a ContractProvider');
    }

    return { contract, usdcContract } as { contract: GroupSplit, usdcContract: Contract<typeof USDCAbi> };
};