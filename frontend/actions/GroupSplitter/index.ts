import { erc20Abi, groupSplitAbi } from '@/abi/generated';
import { config } from '@/config';
import { estimateGas, getAccount, getBalance, getGasPrice, readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { encodeFunctionData, parseEventLogs } from 'viem';
import { useReadContracts } from "wagmi";

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

const groupSplitterContract = {
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS as `0x${string}`,
    abi: groupSplitAbi
} as const

const usdcContract = {
    address: process.env.NEXT_PUBLIC_USDC_CONTACT_ADDRESS as `0x${string}`,
    abi: erc20Abi
} as const

import { } from '@wagmi/core';

async function getLowGasPrice() {
    const currentGasPrice = Number(await getGasPrice(config));
    return BigInt(Math.floor(currentGasPrice * 0.8));  // Estimate a lower gas price, e.g., 80% of the average
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
    const gasPrice = await getLowGasPrice();
    const gas = await estimateGas(config, {
        to: address,
        /* @ts-ignore */
        data: encodeFunctionData({
            abi: abi,
            functionName,
            args
        }),
        value
    });

    /* @ts-ignore */
    const hash = await writeContract(config, {
        address,
        abi: abi,
        functionName,
        args,
        gasPrice,
        gas,
        value
    });

    const transactionReceipt = await waitForTransactionReceipt(config, { hash });
    return parseEventLogs({
        abi: groupSplitterContract.abi,
        logs: transactionReceipt.logs
    })
}

export function useGroupSplitterStats() {
    const { data, ...other } = useReadContracts({
        contracts: [
            {
                ...groupSplitterContract,
                functionName: "contractOpenedGroupsStat"
            },
            {
                ...groupSplitterContract,
                functionName: "contractTotalCollectedEthStat"
            },
            {
                ...groupSplitterContract,
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

export async function getGroupInfo(groupId: string): Promise<Group> {
    const _GROUP_OPEN = 2;
    const group = await readContract(config, {
        ...groupSplitterContract,
        functionName: "getGroupInfoById",
        args: [BigInt(groupId)],
    })

    const unit = group[2] ? 6 : 18;

    const participants: Participant[] = await Promise.all<Participant>(group[10].map(async (participantsAddress: string): Promise<Participant> => {
        const participant = await readContract(config, {
            ...groupSplitterContract,
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
    const parsed = await sendContract({
        ...groupSplitterContract,
        functionName: 'createGroup',
        args: [groupName, ownerNickname, isUSDC]
    });

    if (!('groupId' in parsed[0].args)) {
        throw Error("No groupId in event")
    }

    return parsed[0].args.groupId;
}


export async function depositUSDC(groupId: string, nickname: string, amount: number) {
    const usdc = amount * (10 ** 6); // usdc decimal is 6 
    const account = getAccount(config);
    if (account.address === undefined) {
        throw new Error("Account address not defined, try reconnecting");
    }

    const balance = Number(await readContract(config, {
        ...usdcContract,
        functionName: "balanceOf",
        args: [
            account.address,
        ]
    }));

    if (balance < usdc) {
        throw new Error(`Not enough balance (${balance / 10 ** 6} USDC)`)
    }

    const allowance = Number(await readContract(config, {
        ...usdcContract,
        functionName: "allowance",
        args: [
            account.address,
            groupSplitterContract.address
        ]
    }));

    // if missing allowance ask for more
    if (allowance < usdc) {
        await sendContract({
            ...usdcContract,
            functionName: 'approve',
            args: [groupSplitterContract.address, BigInt(usdc - allowance)]
        });
    }

    await sendContract({
        ...groupSplitterContract,
        functionName: "depositToGroup",
        args: [BigInt(groupId), nickname, true, BigInt(usdc)]
    });
}

export async function depositEth(groupId: string, nickname: string, amount: number) {
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
        ...groupSplitterContract,
        functionName: "depositToGroup",
        args: [BigInt(groupId), nickname, false, BigInt(0)],
        value: BigInt(wei)
    });
}

export async function withdrawFromGroup(groupId: string) {
    await sendContract({
        ...groupSplitterContract,
        functionName: "withdrawFromGroup",
        args: [BigInt(groupId)]
    })
}