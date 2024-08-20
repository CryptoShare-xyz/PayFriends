'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Activity,
    Check,
    ChevronsLeftRight,
    Coins,
    EllipsisVertical,
    LinkIcon,
    Settings,
    Stamp
} from "lucide-react";



import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";


import GroupSplit from "@/artifacts/contracts/GroupSplit.sol/GroupSplit.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useAccount } from "wagmi";
import { AbiItem } from 'web3-utils';

// TODO: probably need to dynamically read this from somewhere
const contractAddress = "0x19076809aAb956D0Ea73EEDaC42D4ace4F46fb8F";
const contractGenesisBlock = 6333314

// TODO: probably dont want to expose NEXT_PUBLIC_ALCHEMY_API_KEY
const alchemyKey = `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
const web3 = createAlchemyWeb3(alchemyKey);
const groupSplitContract = new web3.eth.Contract(
    GroupSplit.abi as AbiItem[],
    contractAddress
);


function ShareGroup() {
    const shareUrl = window.location.href;
    const [copied, setCopied] = useState(false)

    const copyText = (e: React.MouseEvent<HTMLElement>) => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    <span>Share group</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" showOverlay={false}>
                <DialogHeader>
                    <DialogTitle>Share group link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to join the group.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={shareUrl}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3 bg-[#6c63ff]" onClick={copyText}>
                        <span className="sr-only">Copy</span>
                        {!copied ?
                            <Copy className="h-4 w-4" />
                            :
                            <Check className="h-4 w-4" />
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


function GroupActionsMenu({ isOwner }: { isOwner: boolean }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <EllipsisVertical className="hover:cursor-pointer hover:opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Group actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Coins className="mr-2 h-4 w-4" />
                        <span>Pay group</span>
                    </DropdownMenuItem>
                    {isOwner && <DropdownMenuItem>
                        <ChevronsLeftRight className="mr-2 h-4 w-4" />
                        <span>Withdraw balance</span>
                    </DropdownMenuItem>}
                    <ShareGroup />
                    {isOwner && <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>}
                </DropdownMenuGroup>
                {isOwner && <DropdownMenuSeparator />}
                {isOwner && <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Stamp className="mr-2 h-4 w-4 text-red-700" />
                        <span className="text-red-700">Close group</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const events = [
    {
        address: "0x2b51b1941dfdb01fb54ce439295455b12a01da5d06ed0cc9073b61a5f9a7e4e1",
        transaction: "pay",
        amount: 5
    },
    {
        address: "John",
        transaction: "pay",
        amount: 5
    },
    {
        address: "0x5e1ff4a84beb13cdc03ecc6d5d553a6763edd0e8789eeb8faef744b0c9c87e84",
        transaction: "collect",
        amount: 10
    },
    {
        address: "0x5f66df09cea2c715be958d025374fc965fe239260f2a6c3c924b56631dbceacc",
        transaction: "pay",
        amount: 2
    },
    {
        address: "0x3af2e55285f092d375cc50f4aa12d944dd96ef8abc299fa4ea89fdf9f2457e5f",
        transaction: "pay",
        amount: 4
    },
    {
        address: "Arnold",
        transaction: "collect",
        amount: 10
    },
]



const JoinGroupDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#6c63ff]">Join group</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join group {groupId}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center items-center gap-4">
                    <Label htmlFor="amount" className="text-right w-1/4">
                        Amount
                    </Label>
                    <Input id="amount" className="w-2/4" placeholder="Amount to pay group" />
                    <Button type="submit" className="bg-[#6c63ff]  w-1/4">Pay</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

type Group = {
    groupId: string,
    groupName: string,
    owner: string,
    ownerNickname: string,
    creationTime: string,
    status: string,
    balance: string,
    totalCollected: string,
    totalWithdrawn: string,
    participantsAddresses: Participant[]
}

type Participant = {
    participantAddress: string;
    nickname: string;
    totalDeposits: string;
}

export default function Page({ params }: { params: { id: string } }) {
    const [isOwner, setIsOwner] = useState(false)
    const [isParticipant, setIsParticipant] = useState(false)
    const [group, setGroup] = useState<Group | undefined>(undefined);
    const [loading, setLoading] = useState(true)
    const { address, isConnected } = useAccount();

    async function getGroupInfo(id: string) {
        try {
            const groupInfo = await groupSplitContract.methods.getGroupInfoById(id).call()

            const participants: Participant[] = await Promise.all<Participant>(groupInfo[9].map(async (participantsAddress): Promise<Participant> => {
                return {} as Participant
            }))

            setGroup({
                groupId: groupInfo[0],
                groupName: groupInfo[1],
                owner: groupInfo[2],
                ownerNickname: groupInfo[3],
                creationTime: groupInfo[4],
                status: groupInfo[5],
                balance: groupInfo[6],
                totalCollected: groupInfo[7],
                totalWithdrawn: groupInfo[8],
                participantsAddresses: participants
            })

            setIsOwner(groupInfo[2] !== address);
            setIsParticipant(groupInfo[2] === address || groupInfo[9].some(participantsAddress => participantsAddress === address));

        } catch {
            console.log(`Group id: ${id} not found`)
            setGroup(undefined)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getGroupInfo(params.id);

    }, [params.id])

    if (loading) {
        return <Loading />
    }

    if (group === undefined) {
        return <span>Group {params.id} no found</span>
    }


    return (
        <div className="p-8 bg-slate-50 md:rounded-2xl md:max-w-[80%] w-full mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold tracking-tight">{group.groupName}</h2>
                <div className="flex items-center space-x-2">
                    {isParticipant ? <GroupActionsMenu isOwner={isOwner} /> : <JoinGroupDialog groupId={group.groupId} />}
                </div>
            </div>
            <div className="flex flex-col my-8 ">
                <div className="mb-4 flex justify-evenly xl:flex-row flex-col gap-2">
                    <Card className="h-[8rem] xl:w-[12rem] w-[60%] mx-auto">
                        <CardHeader>
                            <CardTitle className="mb-2 capitalize">
                                collected
                            </CardTitle>
                        </CardHeader >
                        <CardContent>
                            <span className="flex text-md text-slate-800">
                                {group.totalCollected} WEI
                            </span>
                        </CardContent>
                    </Card>
                    <Card className="h-[8rem] xl:w-[12rem] w-[60%] mx-auto">
                        <CardHeader>
                            <CardTitle className="mb-2 capitalize">
                                withdrawn
                            </CardTitle>
                        </CardHeader >
                        <CardContent>
                            <span className="flex text-md text-slate-800">
                                {group.totalWithdrawn} WEI
                            </span>
                        </CardContent>
                    </Card>
                    <Card className="h-[8rem] xl:w-[12rem] w-[60%] mx-auto">
                        <CardHeader>
                            <CardTitle className="mb-2 capitalize">
                                balance
                            </CardTitle>
                        </CardHeader >
                        <CardContent>
                            <span className="flex text-md text-slate-800">
                                {group.balance} WEI
                            </span>
                        </CardContent>
                    </Card>

                </div>
                <aside className="mt-2">
                    <div className="flex p-1 mb-4">
                        <small className="mr-2"><Activity size={16} className="text-muted-foreground" /></small>
                        <h1 className="font-semibold text-md">Participants</h1>
                    </div>
                    <Table className="bg-white border border-separate rounded-xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {group.participantsAddresses.map(({ nickname, totalDeposits }) => (
                                <TableRow key={address}>
                                    <TableCell className="font-medium capitalize">{nickname}</TableCell>
                                    <TableCell>{totalDeposits} WEI</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </aside>
            </div>
        </div>
    )
} 