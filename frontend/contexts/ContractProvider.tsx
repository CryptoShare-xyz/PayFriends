import GroupSplitABI from "@/artifacts/contracts/GroupSplit.sol/GroupSplit.json";
import { GroupSplit } from "@/typechain-types";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import React, { createContext, useContext, useMemo } from 'react';
import { AbiItem } from 'web3-utils';

// Context to hold the contract instance
const ContractContext = createContext<GroupSplit | undefined>(undefined);

const contractAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS
const alchemyKey = `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const contract = useMemo(() => {
        const web3 = createAlchemyWeb3(alchemyKey);
        return new web3.eth.Contract(
            GroupSplitABI.abi as AbiItem[],
            contractAddress
        ) as any as GroupSplit;
    }, []);

    return (
        <ContractContext.Provider value={contract}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContract = () => {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error('useContractContext must be used within a ContractProvider');
    }
    return context;
};