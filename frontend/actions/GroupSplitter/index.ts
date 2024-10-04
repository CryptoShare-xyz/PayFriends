import { groupSplitAbi, erc20Abi as usdcAbi } from '@/abi/generated';
import { config } from '@/config';
import { getAccount, getBalance, getChainId, readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { base, baseSepolia, hardhat } from "wagmi/chains";

import type { Abi, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { parseEventLogs } from 'viem';
import { useChainId, useReadContracts } from "wagmi";

export type Group = {
    groupId: string,
    groupName: string,
    owner: string,
    ownerNickname: string,
    creationTime: string,
    status: boolean,
    balance: number,
    totalCollected: number,
    totalWithdrawn: number,
    participants: Participant[],
    isUSDC: boolean,
}

export type Participant = {
    participantAddress: string;
    nickname: string;
    totalDeposits: number;
    lastDeposited: string
}


function getContractAddress(chainId: number) {
    switch (chainId) {
        case base.id:
            return {
                contractAddress: process.env.NEXT_PUBLIC_BASE_CONTACT_ADDRESS as `0x${string}`,
                usdcAddress: process.env.NEXT_PUBLIC_BASE_USDC_CONTACT_ADDRESS as `0x${string}`,
            };
        case baseSepolia.id:
            return {
                contractAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CONTACT_ADDRESS as `0x${string}`,
                usdcAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC_CONTACT_ADDRESS as `0x${string}`,
            };
        case hardhat.id:
            return {
                contractAddress: process.env.NEXT_PUBLIC_HARDHAT_CONTACT_ADDRESS as `0x${string}`,
                usdcAddress: process.env.NEXT_PUBLIC_HARDHAT_USDC_CONTACT_ADDRESS as `0x${string}`,
            };
        default:
            throw new Error(`chain ${chainId} not supported`);
    }
}

type sendContractParameters<
    ABI extends Abi,
    FN extends ContractFunctionName<ABI, 'nonpayable' | 'payable'>
> = {
    address: `0x${string}`,
    abi: ABI,
    functionName: FN,
    args: ContractFunctionArgs<ABI, 'nonpayable' | 'payable', FN>
    value?: bigint
}

async function sendContract<
    const ABI extends Abi,
    FN extends ContractFunctionName<ABI, 'nonpayable' | 'payable'>
>
    (parameters: sendContractParameters<ABI, FN>) {
    const { address, abi, functionName, args, value } = parameters;

    /* @ts-ignore */
    const hash = await writeContract(config, {
        address,
        abi,
        functionName,
        args,
        value
    });

    const transactionReceipt = await waitForTransactionReceipt(config, { hash });
    return parseEventLogs({
        abi,
        logs: transactionReceipt.logs
    })
}

export function useGroupSplitterStats() {
    const chainId = useChainId()
    const { contractAddress: address } = getContractAddress(chainId);

    const { data, ...other } = useReadContracts({
        contracts: [
            {
                address,
                abi: groupSplitAbi,
                functionName: "contractOpenedGroupsStat"
            },
            {
                address,
                abi: groupSplitAbi,
                functionName: "contractTotalCollectedEthStat"
            },
            {
                address,
                abi: groupSplitAbi,
                functionName: "contractTotalCollectedUSDCStat"
            }
        ]
    });
    return {
        data: {
            openedGroups: Number(data?.[0].result),
            totalCollectedEth: Number(data?.[1].result),
            totalCollectedUSDC: Number(data?.[2].result)
        },
        ...other
    }
}

export async function getGroupInfo(chainId: number, groupId: string): Promise<Group> {
    const _GROUP_OPEN = 2;
    const { contractAddress: address } = getContractAddress(chainId);

    const group = await readContract(config, {
        address,
        abi: groupSplitAbi,
        functionName: "getGroupInfoById",
        args: [BigInt(groupId)],
    })

    const unit = group[2] ? 6 : 18;

    const participants: Participant[] = await Promise.all<Participant>(group[10].map(async (participantsAddress: string): Promise<Participant> => {
        const participant = await readContract(config, {
            address,
            abi: groupSplitAbi,
            functionName: "getParticipantDetails",
            args: [BigInt(groupId), participantsAddress as `0x${string}`],
        })
        return {
            participantAddress: participant[0],
            nickname: participant[1],
            totalDeposits: Number(participant[2]) / 10 ** unit,
            lastDeposited: participant[3].toString()
        };
    }))

    return {
        groupId: group[0].toString(),
        groupName: group[1],
        isUSDC: group[2],
        owner: group[3],
        ownerNickname: group[4],
        creationTime: group[5].toString(),
        status: Number(group[6]) === _GROUP_OPEN,
        balance: Number(group[7]) / 10 ** unit,
        totalCollected: Number(group[8]) / 10 ** unit,
        totalWithdrawn: Number(group[9]) / 10 ** unit,
        participants: participants
    };
}

export async function createGroup(groupName: string, ownerNickname: string, isUSDC: boolean) {
    const chainId = getChainId(config);
    const { contractAddress: address } = getContractAddress(chainId);

    const parsed = await sendContract({
        address,
        abi: groupSplitAbi,
        functionName: 'createGroup',
        args: [groupName, ownerNickname, isUSDC]
    });

    if (!('groupId' in parsed[0].args)) {
        throw Error("No groupId in event")
    }

    return parsed[0].args.groupId;
}


export async function depositUSDC(groupId: string, nickname: string, amount: number) {
    const chainId = getChainId(config);
    const { contractAddress, usdcAddress } = getContractAddress(chainId);

    const usdc = amount * (10 ** 6); // usdc decimal is 6 
    const account = getAccount(config);
    if (account.address === undefined) {
        throw new Error("Account address not defined, try reconnecting");
    }

    const balance = Number(await readContract(config, {
        address: usdcAddress,
        abi: usdcAbi,
        functionName: "balanceOf",
        args: [
            account.address,
        ]
    }));

    if (balance < usdc) {
        throw new Error(`Not enough balance (${balance / 10 ** 6} USDC)`)
    }

    const allowance = Number(await readContract(config, {
        address: usdcAddress,
        abi: usdcAbi,
        functionName: "allowance",
        args: [
            account.address,
            contractAddress
        ]
    }));

    // if missing allowance ask for more
    if (allowance < usdc) {
        await sendContract({
            address: usdcAddress,
            abi: usdcAbi,
            functionName: 'approve',
            args: [contractAddress, BigInt(usdc - allowance)]
        });
    }

    await sendContract({
        address: contractAddress,
        abi: groupSplitAbi,
        functionName: "depositToGroup",
        args: [BigInt(groupId), nickname, true, BigInt(usdc)]
    });
}

export async function depositEth(groupId: string, nickname: string, amount: number) {
    const chainId = getChainId(config);
    const { contractAddress: address } = getContractAddress(chainId);

    const wei = amount * (10 ** 18); // eth decimal is 18
    const account = getAccount(config);
    if (account.address === undefined) {
        throw new Error("Account address not defined, try reconnecting");
    }

    const balance = await getBalance(config, {
        address: account.address
    });

    const balanceWei = Number(balance.value);

    if (balanceWei < wei) {
        throw new Error(`Not enough balance (${balanceWei / 10 ** 18} USDC)`)
    }

    await sendContract({
        address,
        abi: groupSplitAbi,
        functionName: "depositToGroup",
        args: [BigInt(groupId), nickname, false, BigInt(0)],
        value: BigInt(wei)
    });
}

export async function withdrawFromGroup(groupId: string) {
    const chainId = getChainId(config);
    const { contractAddress: address } = getContractAddress(chainId);

    await sendContract({
        address,
        abi: groupSplitAbi,
        functionName: "withdrawFromGroup",
        args: [BigInt(groupId)]
    })
}