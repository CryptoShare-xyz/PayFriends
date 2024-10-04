'use client'

import { Button } from "@/components/ui/button";
import Wallet from "@/components/ui/wallet";
import moment from "moment";

import {
    ArrowLeft,
    ClipboardIcon,
    Lock,
    User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Group } from "@/actions/GroupSplitter";
import { getGroupInfo } from "@/actions/GroupSplitter";
import DepositGroupDialog from "@/components/dialogs/DepositGroupDialog";
import ShareGroupDialog from "@/components/dialogs/ShareGroupDialog";
import WithdrawGroupDialog from "@/components/dialogs/WithdrawGroupDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VanishTooltip } from "@/components/ui/vanish-tooltip";
import { formatAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";

function LoadingGroup() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

export default function GroupPage({ params }: { params: { id: string } }) {
    const [isOwner, setIsOwner] = useState(false)
    const [isParticipant, setIsParticipant] = useState(false)
    const [group, setGroup] = useState<Group>();
    const [loading, setLoading] = useState(true)
    const { address } = useAccount();
    const chainId = useChainId();

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    useEffect(() => {
        getGroupInfo(chainId, params.id)
            .then((group) => {
                setGroup(group);
                setIsOwner(group.owner === address);
                setIsParticipant(group.owner === address || group.participants.some((participant) => participant.participantAddress === address));
            })
            .catch(() => {
                console.log(`Group id: ${params.id} not found`);
                setGroup(undefined);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [chainId, params.id, address])

    if (loading) {
        return <LoadingGroup />
    }

    if (group === undefined) {
        return (
            <div className="flex flex-col lg:max-w-[60%] mx-auto h-screen" >
                <nav className="flex py-2 md:py-4 lg:py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                    <Link
                        href="/"
                    >
                        <ArrowLeft className="text-[#009BEB] lg:w-[32px] md:w-[24px] w-[20px]" size={32} />
                    </Link>
                    <div className="ml-auto flex items-center space-x-4 ">
                        <Wallet />
                    </div>
                </nav>
                <h2 className="text-4xl font-bold tracking-tight flex justify-center items-center gap-4 text-muted-foreground opacity-60 h-full">
                    {`Group not found on chain (${chainId}), maybe try different chain.`}
                </h2>
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
                    <ShareGroupDialog />
                </div>
                <p className="text-muted-foreground md:text-base text-xs">Group owner: {group.ownerNickname}</p>

                <p className="text-muted-foreground md:text-base text-xs">
                    Owner address: {formatAddress(group.owner)}
                    <VanishTooltip content="Copied" onClick={() => copyText(group.owner)}>
                        <Button
                            variant="ghost"
                            className="p-1 text-muted-foreground h-fit"
                            size="sm"
                            aria-label="Copy owner address"
                        >
                            <ClipboardIcon className="md:h-4 md:w-4 h-3 w-3" />
                        </Button>
                    </VanishTooltip>
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
                                        <TableCell className=" text-xs sm:text-sm md:text-base hover:underline focus:underline cursor-pointer">
                                            <VanishTooltip content="Copied" onClick={() => copyText(participantAddress)}>
                                                <span>{formatAddress(participantAddress)}</span>
                                            </VanishTooltip>
                                        </TableCell>
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
                    {isOwner && group.balance > 0 && <WithdrawGroupDialog groupId={group.groupId} />}
                    <DepositGroupDialog groupId={group.groupId} isParticipant={isParticipant} isUSDC={group.isUSDC} />
                </div>
            }
        </div>
    );
} 