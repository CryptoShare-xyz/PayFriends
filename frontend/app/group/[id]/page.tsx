'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

import moment from "moment";

import {
    Check,
    ChevronsLeftRight,
    Coins,
    Copy,
    EllipsisVertical,
    LinkIcon,
    Settings,
    Stamp,
    User
} from "lucide-react";

import { useContract } from "@/contexts/ContractProvider";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import web3 from "web3";

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


function GroupActionsMenu({ isOwner, groupId }: { isOwner: boolean, groupId: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <EllipsisVertical className="hover:cursor-pointer hover:opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Group actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <PayGroupDialog groupId={groupId} />
                    {isOwner && <WithdrawDialog groupId={groupId} />}
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


const JoinGroupDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [open, setOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount();
    const { toast } = useToast()
    const contract = useContract()

    const handlePay = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const wei = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'wei'))
            console.log(groupId, nickname, address, wei)
            const tx = await contract.methods.depositToGroup(groupId, nickname).send({ from: address, value: wei });
            toast({ description: "Payed group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
        } finally {
            setOpen(false)
            setLoading(false)
            setNickname("")
            setAmount("");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#6c63ff]">Join group</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join group</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                            Nickname
                        </Label>
                        <Input
                            id="name"
                            placeholder="John"
                            className="col-span-3"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-left">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="1337"
                            className="col-span-3"
                            maxLength={100}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button className="bg-[#6c63ff]" onClick={handlePay} disabled={loading}>{loading ? "Paying..." : "Pay group"}</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const PayGroupDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [open, setOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount();
    const { toast } = useToast()
    const contract = useContract()

    const handlePay = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const wei = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'wei'))
            console.log(groupId, nickname, address, wei)
            const tx = await contract.methods.depositToGroup(groupId, nickname).send({ from: address, value: wei });
            toast({ description: "Payed group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
        } finally {
            setOpen(false)
            setLoading(false)
            setNickname("")
            setAmount("");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Coins className="mr-2 h-4 w-4" />
                    <span>Pay group</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Pay group</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-left">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="1337"
                            className="col-span-3"
                            maxLength={100}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button className="bg-[#6c63ff]" onClick={handlePay} disabled={loading}>{loading ? "Paying..." : "Pay group"}</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const WithdrawDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount();
    const { toast } = useToast()
    const contract = useContract()

    const handleWithdraw = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const tx = await contract.methods.withdrawFromGroup(groupId).send({ from: address });
            toast({ description: "Withdrawn from group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
        } finally {
            setOpen(false)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ChevronsLeftRight className="mr-2 h-4 w-4" />
                    <span>Withdraw balance</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to withdraw ?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex items-center justify-center sm:justify-center gap-4">
                    <DialogTrigger asChild>
                        <Button className="bg-[#6c63ff]" onClick={handleWithdraw} disabled={loading}>{loading ? "Withdrawing..." : "Withdraw balance"}</Button>
                    </DialogTrigger>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
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
    const contract = useContract()

    async function getGroupInfo(id: string) {
        try {
            const groupInfo = await contract.methods.getGroupInfoById(id).call()

            const participants: Participant[] = await Promise.all<Participant>(groupInfo[9].map(async (participantsAddress: string): Promise<Participant> => {
                return {} as Participant
            }))

            setGroup({
                groupId: groupInfo[0],
                groupName: groupInfo[1],
                owner: groupInfo[2],
                ownerNickname: groupInfo[3],
                creationTime: groupInfo[4],
                status: groupInfo[5] ? "True" : "False",
                balance: groupInfo[6],
                totalCollected: groupInfo[7],
                totalWithdrawn: groupInfo[8],
                participantsAddresses: participants
            })

            setIsOwner(groupInfo[2] === address);
            setIsParticipant(groupInfo[2] === address || groupInfo[9].some((participantsAddress: string) => participantsAddress === address));

        } catch {
            console.log(`Group id: ${id} not found`)
            setGroup(undefined)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getGroupInfo(params.id);

    }, [params.id, address])

    if (loading) {
        return <Loading />
    }

    if (group === undefined) {
        return <span>Group {params.id} no found</span>
    }


    return (
        <div className="p-8 bg-slate-50 md:rounded-2xl md:max-w-[80%] w-full mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{group.groupName}</h2>
                <div className="flex items-center space-x-2">
                    {isParticipant ? <GroupActionsMenu isOwner={isOwner} groupId={group.groupId} /> : <JoinGroupDialog groupId={group.groupId} />}
                </div>
            </div>
            <p className="text-muted-foreground text-xs">created {moment.unix(Number(group.creationTime)).fromNow()}</p>

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
                    <div className="flex p-1 mb-4 items-center">
                        <small className="mr-2"><User size={16} className="text-muted-foreground" /></small>
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