'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";

import { useMediaQuery } from 'react-responsive';

import { ConnectKitButton } from "connectkit";
import {
    ArrowLeft, Check,
    CircleChevronDown,
    Copy,
    Lock,
    Share2,
    User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contractAddress, useContract } from "@/contexts/ContractProvider";
import { formatAddress } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useBalance } from "wagmi";
import web3 from "web3";
import { z } from "zod";

const joinGroupSchema = z.object({
    nickname: z.string().min(1).max(20).optional(),
    isUSDC: z.boolean(),
    amount: z.coerce.number().positive()
}).refine((schema) => {
    if (schema.isUSDC) {
        return schema.amount >= 10 ** (-6);
    } else {
        return schema.amount >= 10 ** (-18);
    }
}, { message: "Must be at least one unit of the coin", path: ["amount"] })

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
                <div className="ml-auto mb-auto relative p-3 bg-blue-500 rounded-full cursor-pointer transition-transform hover:scale-110">
                    <div className="absolute inset-0 border-2 border-blue-300 rounded-full"></div>
                    <Share2 className="md:w-6 md:h-6 w-4 h-4 text-white" />
                </div>
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
                    <div className="p-3 bg-[#009BEB] hover:cursor-pointer text-white rounded-lg" onClick={copyText}>
                        <span className="sr-only">Copy</span>
                        {!copied ?
                            <Copy className="h-4 w-4" />
                            :
                            <Check className="h-4 w-4" />
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


const PayGroupDialog: React.FC<{ groupId: string, isParticipant: boolean, isUSDC: boolean }> = ({ groupId, isParticipant, isUSDC }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { address, } = useAccount();
    const { data } = useBalance({ address: address })
    const { toast } = useToast()
    const { contract, usdcContract } = useContract()
    const form = useForm<z.infer<typeof joinGroupSchema>>({
        resolver: zodResolver(joinGroupSchema),
        defaultValues: {
            nickname: undefined,
            amount: 0,
            isUSDC: isUSDC,
        },
    })

    async function onSubmit(values: z.infer<typeof joinGroupSchema>) {
        let { nickname, amount } = values;

        setLoading(true)


        try {
            if (nickname === undefined) {
                // should only happen if already participant
                if (!isParticipant) {
                    throw new Error('No nickname for new participant!');
                }
                nickname = ""
            }

            if (isUSDC) {
                const usdc = amount * (10 ** 6); // usdc decimal is 6 

                const balance = Number(await usdcContract.methods.balanceOf(address).call())

                // check user has enough balance
                if (balance < usdc) {
                    throw new Error(`Not enough balance (${balance / 10 ** 6} USDC)`)
                }

                const allowance = Number(await usdcContract.methods.allowance(address, contractAddress).call())
                if (!Number.isInteger(allowance)) {
                    throw new Error("Failed to get allowance")
                }

                if (allowance < usdc) {
                    const tx2 = await usdcContract.methods.approve(contractAddress, usdc - allowance).send({ from: address });
                }

                const tx3 = await contract.methods.depositToGroup(groupId, nickname, true, usdc).send({ from: address });
            } else {
                const wei = web3.utils.toWei(amount.toString(), 'ether')
                const balance = Number(data?.value)
                // check user has enough balance
                if (balance < Number(wei)) {
                    throw new Error(`Not enough balance (${balance / 10 ** 18} ETH)`)
                }

                const tx = await contract.methods.depositToGroup(groupId, nickname, false, 0).send({ from: address, value: web3.utils.toHex(wei) });

            }
            toast({ description: "Payed group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
        } finally {
            setOpen(false)
            setLoading(false)
            form.reset()
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-2xl bg-[#009BEB] border-1 border-[#1F92CE] text-white py-2 w-[90%]">{isParticipant ? "Deposit" : "Join group"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    {
                        isParticipant
                            ? <DialogTitle>Deposit group</DialogTitle>
                            : <DialogTitle>Join group</DialogTitle>
                    }

                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        {!isParticipant && <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname</FormLabel>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount to deposit</FormLabel>
                                    <FormDescription>
                                        This is the amount of eth to deposit to the group.
                                    </FormDescription>
                                    <FormControl >
                                        <div className="relative">
                                            <Input type="number" placeholder="1337" {...field} />
                                            <small className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">{isUSDC ? "USDC" : "ETH"}</small>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button variant="outline" className="bg-[#009BEB] text-slate-50" type="submit" disabled={loading}>{loading ? "Paying..." : "Pay group"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const WithdrawDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { address } = useAccount();
    const { toast } = useToast()
    const { contract } = useContract()

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
                <Button className="text-lg bg-[#E7F1FA] border-2 border-dashed border-[#19A5ED] text-[#1F92CE] py-2 w-[90%]">Withdraw Now <CircleChevronDown className="ml-1" size={16} /> </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to withdraw ?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-row w-full gap-2 justify-center items-center">
                        <Button variant="outline" className="bg-[#009BEB] text-slate-50" onClick={handleWithdraw} disabled={loading}>{loading ? "Withdrawing..." : "Withdraw balance"}</Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
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
    status: boolean,
    balance: number,
    totalCollected: number,
    totalWithdrawn: number,
    participantsAddresses: Participant[],
    isUSDC: boolean,
}

type Participant = {
    participantAddress: string;
    nickname: string;
    totalDeposits: number;
    lastDeposited: string
}



export default function Page({ params }: { params: { id: string } }) {
    const [isOwner, setIsOwner] = useState(false)
    const [isParticipant, setIsParticipant] = useState(false)
    const [group, setGroup] = useState<Group | undefined>(undefined);
    const [loading, setLoading] = useState(true)
    const { address } = useAccount();
    const { contract } = useContract()

    const notMobile = useMediaQuery({
        query: '(min-width: 640px)'
    })

    async function getGroupInfo(id: string) {
        const _GROUP_OPEN = 2;

        try {
            const groupInfo = await contract.methods.getGroupInfoById(id).call()
            const unit = groupInfo[2] ? 6 : 18


            const participants: Participant[] = await Promise.all<Participant>(groupInfo[10].map(async (participantsAddress: string): Promise<Participant> => {
                const participant = await contract.methods.getParticipantDetails(groupInfo[0], participantsAddress).call();
                return {
                    nickname: participant.nickname,
                    lastDeposited: participant.lastDeposited,
                    participantAddress: participantsAddress,
                    totalDeposits: Number.parseInt(participant.totalDeposits) / 10 ** unit
                };
            }))

            setGroup({
                groupId: groupInfo[0],
                groupName: groupInfo[1],
                isUSDC: groupInfo[2],
                owner: groupInfo[3],
                ownerNickname: groupInfo[4],
                creationTime: groupInfo[5],
                status: Number.parseInt(groupInfo[6]) === _GROUP_OPEN,
                balance: Number.parseInt(groupInfo[7]) / 10 ** unit,
                totalCollected: Number.parseInt(groupInfo[8]) / 10 ** unit,
                totalWithdrawn: Number.parseInt(groupInfo[9]) / 10 ** unit,
                participantsAddresses: participants
            })

            setIsOwner(groupInfo[3] === address);
            setIsParticipant(groupInfo[4] === address || groupInfo[10].some((participantsAddress: string) => participantsAddress === address));

        } catch (e) {
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
        return (
            <div className="flex flex-col lg:max-w-[60%] mx-auto min-h-screen" >
                <nav className="flex py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                    <Link
                        href="/"
                    >
                        <ArrowLeft className="text-[#009BEB]" size={24} />
                    </Link>
                    <div className="ml-auto flex items-center space-x-4">
                        <ConnectKitButton showBalance={notMobile} />
                    </div>
                </nav>
                <h2 className="text-4xl font-bold tracking-tight flex justify-center items-center gap-4 text-muted-foreground">Group not found</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:max-w-[60%] mx-auto h-screen" >

            {/* nav section */}
            <nav className="flex py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                <Link
                    href="/"
                >
                    <ArrowLeft className="text-[#009BEB]" size={24} />
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    <ConnectKitButton showBalance={notMobile} />
                </div>
            </nav>

            {/* group meta section */}
            <header className="relative px-16 flex flex-col items-start justify-center bg-[#E7F1FA] pb-8 rounded-b-2xl">
                <div className="flex flex-row justify-start items-center w-full">
                    <div className="flex flex-col items-start">
                        <h2 className="text-4xl font-bold tracking-tight flex justify-center items-center gap-4 float-left">{group.groupName} {!group.status && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            <Lock className="mr-1 h-3 w-3" />
                            Closed
                        </span>}</h2>
                        <p className="text-muted-foreground text-lg mb-4">created {moment.unix(Number(group.creationTime)).fromNow()}</p>
                    </div>
                    <ShareGroup />
                </div>
                <p className="text-muted-foreground text-sm">Group owner: {group.ownerNickname}</p>
                <p className="text-muted-foreground text-sm">Owner address: {formatAddress(group.owner)}</p>
            </header>

            {/* content section */}
            <div className="flex-grow overflow-auto">

                {/* stats section */}
                <section className="flex flex-col md:flex-row px-8 py-4 gap-4">
                    <div className="flex flex-grow px-8 py-4 justify-evenly gap-4 items-center bg-gradient-to-b from-[#E7F1FA] to-[#F5F5F5] border-2 border-dashed border-[#19A5ED] rounded-lg">
                        <span>
                            <h1 className="text-[#009BEB] text-center text-4xl font-bold">{group.balance}</h1>
                            <h2 className="text-lg text-center font-semibold">Balance</h2>
                        </span>
                        <figure className="flex flex-col items-center justify-center w-[20%]">
                            <Image src={group.isUSDC ? "/usdc.svg" : "/eth.svg"} width={64} height={64} alt="coin image" />
                            <small className="text-[#858585] text-center text-small">{group.isUSDC ? "USDC" : "ETH"}</small>
                        </figure>
                    </div>

                    <aside className="flex flex-grow flex-wrap flex-row md:flex-col md:items-end justify-evenly items-center gap-4">
                        <div className="bg-[#E7F1FA] flex flex-col items-center justify-center py-4 rounded-lg w-full max-w-[80%]">
                            <h1 className="text-[#009BEB] lg:text-2xl text-lg">{group.totalWithdrawn}</h1>
                            <small className="text-[#858585]  lg:text-xl text-sm">Withdrawn</small>
                        </div>
                        <div className="bg-[#E7F1FA] flex flex-col items-center justify-center py-4 rounded-lg w-full max-w-[80%]">
                            <h1 className="text-[#009BEB] lg:text-2xl text-lg">{group.totalCollected}</h1>
                            <small className="text-[#858585]  lg:text-xl text-sm">Collected</small>
                        </div>
                    </aside>
                </section>

                <hr className="w-[90%] mx-auto my-2 border-dashed border-[#D9D9D9]" />

                {/* members section */}
                <ScrollArea className="flex-grow p-4">
                    <section className="px-8 py-2">
                        <div className="flex p-1 mb-4 items-center">
                            <div className="mr-2 max-w-[32px] lg:max-w-[48px]"><User size={32} className="text-muted-foreground" /></div>
                            <h1 className="font-semibold text-base lg:text-2xl">Members</h1>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Last update</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {group.participantsAddresses.map(({ nickname, totalDeposits, participantAddress, lastDeposited }) => (
                                    <TableRow key={participantAddress}>
                                        <TableCell className="capitalize">{nickname}</TableCell>
                                        <TableCell>{formatAddress(participantAddress)}</TableCell>
                                        <TableCell>{totalDeposits}</TableCell>
                                        <TableCell>{moment.unix(Number(lastDeposited)).calendar()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                </ScrollArea>
            </div>

            {/* Fixed Button at Bottom */}
            {group.status &&
                <div className="flex flex-col items-center justify-center p-4 border-t gap-4">
                    {isOwner && <WithdrawDialog groupId={group.groupId} />}
                    <PayGroupDialog groupId={group.groupId} isParticipant={isParticipant} isUSDC={group.isUSDC} />
                </div>
            }

        </div>
    );
} 