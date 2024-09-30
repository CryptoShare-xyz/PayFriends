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
import Wallet from "@/components/ui/wallet";
import moment from "moment";

import * as Sentry from "@sentry/browser";
import {
    ArrowLeft, Check,
    CheckIcon,
    CircleChevronDown,
    ClipboardIcon,
    Copy,
    Lock,
    Share2,
    User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Group } from "@/actions/GroupSplitter";
import { depositEth, depositUSDC, getGroupInfo, withdrawFromGroup } from "@/actions/GroupSplitter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAddress } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useChainModal,
    useConnectModal
} from '@rainbow-me/rainbowkit';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useChainId } from "wagmi";
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
                <div className="ml-auto mb-auto relative p-3 bg-blue-500 rounded-full cursor-pointer transition-transform hover:scale-110 focus:scale-110 translate-x-1/2">
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
    const { chainId, isConnected } = useAccount();
    const { toast } = useToast()
    const myChain = useChainId()
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

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
                await depositUSDC(groupId, nickname, amount);
            } else {
                await depositEth(groupId, nickname, amount);
            }
            toast({ description: "Payed group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
            Sentry.captureException(error);
        } finally {
            setOpen(false)
            setLoading(false)
            form.reset()
        }

    }

    const onOpenDialog = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()

        if (!isConnected && openConnectModal) {
            openConnectModal();
            return;
        }

        if (chainId !== myChain && openChainModal) {
            openChainModal()
            return;
        }

        setOpen(true)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={onOpenDialog} variant="outline" className="text-2xl bg-[#009BEB] border-1 border-[#1F92CE] text-white py-2 w-[90%]">{isParticipant ? "Deposit" : "Join group"}</Button>
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

    const handleWithdraw = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            await withdrawFromGroup(groupId);
            toast({ description: "Withdrawn from group" })
            window.location.reload()
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
            }
            Sentry.captureException(error);
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

export default function Page({ params }: { params: { id: string } }) {
    const [isOwner, setIsOwner] = useState(false)
    const [isParticipant, setIsParticipant] = useState(false)
    const [group, setGroup] = useState<Group>();
    const [loading, setLoading] = useState(true)
    const { address } = useAccount();
    const [copiedOwner, setCopiedOwner] = useState(false)

    const copyOwnerAddress = (address: string) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            navigator.clipboard.writeText(address)
            setCopiedOwner(true)
            setTimeout(() => setCopiedOwner(false), 2000)
        }
    }

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    useEffect(() => {
        getGroupInfo(params.id)
            .then((group) => {
                setGroup(group);
                setIsOwner(group.owner === address);
                setIsParticipant(group.owner === address || group.participants.some((participant) => participant.participantAddress === address));
            })
            .catch(() => {
                console.log(`Group id: ${params.id} not found`);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [params.id, address])

    if (loading) {
        return <Loading />
    }

    if (group === undefined) {
        return (
            <div className="flex flex-col lg:max-w-[60%] mx-auto h-screen" >
                <nav className="flex py-4 lg:py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                    <Link
                        href="/"
                    >
                        <ArrowLeft className="text-[#009BEB]" size={24} />
                    </Link>
                    <div className="ml-auto flex items-center space-x-4 ">
                        <Wallet />
                    </div>
                </nav>
                <h2 className="text-4xl font-bold tracking-tight flex justify-center items-center gap-4 text-muted-foreground opacity-60 h-full">Group not found</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:max-w-[60%] mx-auto h-screen" >

            {/* nav section */}
            <nav className="flex py-2 md:py-4 lg:py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                <Link
                    href="/"
                >
                    <ArrowLeft className="text-[#009BEB] lg:w-[32px] md:w-[24px] w-[20px]" size={32} />
                </Link>
                <div className="ml-auto flex items-center space-x-4">
                    <Wallet />
                </div>
            </nav>

            {/* group meta section */}
            <header className="relative md:px-16 px-8 flex flex-col items-start justify-center bg-[#E7F1FA] pb-4 lg:pb-8 rounded-b-2xl">
                <div className="flex flex-row justify-start items-center w-full">
                    <div className="flex flex-col items-start mb-4">
                        <h2 className="lg:text-6xl md:text-4xl text-3xl font-bold tracking-tight flex justify-center items-center gap-4 float-left">{group.groupName} {!group.status && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            <Lock className="mr-1 h-3 w-3" />
                            Closed
                        </span>}</h2>
                        <p className="text-muted-foreground text-xs md:text-sm">created {moment.unix(Number(group.creationTime)).fromNow()}</p>
                    </div>
                    <ShareGroup />
                </div>
                <p className="text-muted-foreground md:text-base text-xs">Group owner: {group.ownerNickname}</p>
                <p className="text-muted-foreground md:text-base text-xs">
                    Owner address: {formatAddress(group.owner)}
                    <Button
                        variant="ghost"
                        className="p-1 text-muted-foreground h-fit"
                        size="sm"
                        onClick={copyOwnerAddress(group.owner)}
                        aria-label="Copy owner address"
                    >
                        {copiedOwner ? (
                            <CheckIcon className="md:h-4 md:w-4 h-3 w-3 text-[#009BEB]" />
                        ) : (
                            <ClipboardIcon className="md:h-4 md:w-4 h-3 w-3" />
                        )}
                    </Button>
                </p>
            </header>

            {/* content section */}
            <div className="flex-grow overflow-auto md:py-4">

                {/* stats section */}
                <section className="flex flex-col md:flex-row px-8 py-4 gap-4">
                    <div className="flex flex-grow px-8 py-4 justify-evenly gap-4 items-center bg-gradient-to-b from-[#E7F1FA] to-[#F5F5F5] border-2 border-dashed border-[#19A5ED] rounded-lg">
                        <span>
                            <h1 className="text-[#009BEB] text-center md:text-4xl text-2xl font-bold">{group.balance}</h1>
                            <h2 className="md:text-lg text-sm text-center font-semibold">Balance</h2>
                        </span>
                        <figure className="flex flex-col items-center justify-center md:w-[20%] w-[10%]">
                            <Image src={group.isUSDC ? "/usdc.svg" : "/eth.svg"} width={64} height={64} alt="coin image" />
                            <small className="text-[#858585] text-center md:text-sm text-xs">{group.isUSDC ? "USDC" : "ETH"}</small>
                        </figure>
                    </div>

                    <aside className="flex flex-grow flex-wrap flex-row md:flex-col md:items-end justify-evenly items-center gap-4">
                        <div className="bg-[#E7F1FA] flex flex-grow flex-col items-center justify-center py-4 rounded-lg md:w-full max-w-[80%]">
                            <h1 className="text-[#009BEB]  md:text-2xl text-lg">{group.totalWithdrawn}</h1>
                            <small className="text-[#858585] md:text-lg text-xs">Withdrawn</small>
                        </div>
                        <div className="bg-[#E7F1FA] flex flex-grow flex-col items-center justify-center py-4 rounded-lg md:w-full max-w-[80%]">
                            <h1 className="text-[#009BEB] md:text-2xl text-lg">{group.totalCollected}</h1>
                            <small className="text-[#858585] md:text-lg text-xs">Collected</small>
                        </div>
                    </aside>
                </section>

                <hr className="w-[90%] lg:my-6 md:my-4 mx-auto border-dashed border-[#D9D9D9]" />

                {/* members section */}
                {/* [&>div>div[style]]:!block is a weird fix for scrollable area to have overflow-x-auto */}
                {/* src: https://github.com/shadcn-ui/ui/issues/2090#issuecomment-2103953170 */}
                <ScrollArea className="flex-grow md:p-4 p-2 [&>div>div[style]]:!block">
                    <section>
                        <div className="flex items-center md:mb-2 lg:mb-4">
                            <User size={32} className="text-muted-foreground mr-2 max-w-[24px] md:max-w-[32px] " />
                            <h1 className="font-semibold text-sm md:text-xl">Members</h1>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs sm:text-sm md:text-base">Name</TableHead>
                                    <TableHead className="text-xs sm:text-sm md:text-base">Address</TableHead>
                                    <TableHead className="text-xs sm:text-sm md:text-base">Amount</TableHead>
                                    <TableHead className="text-xs sm:text-sm md:text-base">Last update</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {group.participants.map(({ nickname, totalDeposits, participantAddress, lastDeposited }) => (
                                    <TableRow key={participantAddress}>
                                        <TableCell className="text-xs sm:text-sm md:text-base capitalize">{nickname}</TableCell>
                                        <TableCell className=" text-xs sm:text-sm md:text-base hover:underline focus:underline cursor-pointer" onClick={(e) => copyText(participantAddress)}>{formatAddress(participantAddress)}</TableCell>
                                        <TableCell className="text-xs sm:text-sm md:text-base">{totalDeposits}</TableCell>
                                        <TableCell className="text-xs sm:text-sm md:text-base">{moment.unix(Number(lastDeposited)).calendar()}</TableCell>
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
                    {isOwner && group.balance > 0 && <WithdrawDialog groupId={group.groupId} />}
                    <PayGroupDialog groupId={group.groupId} isParticipant={isParticipant} isUSDC={group.isUSDC} />
                </div>
            }

        </div>
    );
} 