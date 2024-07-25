'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAddress } from "@/lib/utils";
import {
    Activity,
    Check,
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
import { useState } from "react";

export function ShareGroup() {
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


export function GroupActionsMenu() {
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
                        <span>Withdraw balance</span>
                    </DropdownMenuItem>
                    <ShareGroup />
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Stamp className="mr-2 h-4 w-4 text-red-700" />
                        <span className="text-red-700">Close group</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
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


export default function Page({ params }: { params: { id: string } }) {

    return (
        <div className="p-8 bg-slate-50 md:rounded-2xl md:max-w-[80%] w-full mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold tracking-tight">{`Group ${params.id?.substring(0, 4)}`}</h2>
                <div className="flex items-center space-x-2">
                    <GroupActionsMenu />
                </div>
            </div>
            <p className="p-2 max-w-[30rem] text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum id nihil illum animi </p>
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
                                123 ETH
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
                                123 ETH
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
                                123 ETH
                            </span>
                        </CardContent>
                    </Card>

                </div>
                <aside className="mt-2">
                    <div className="flex p-1 mb-4">
                        <small className="mr-2"><Activity size={16} className="text-muted-foreground" /></small>
                        <h1 className="font-semibold text-md">Group activity</h1>
                    </div>
                    <Table className="bg-white border border-separate rounded-xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Transaction</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map(({ address, transaction, amount }) => (
                                <TableRow key={address}>
                                    <TableCell className="font-medium capitalize">{address.startsWith("0x") ? formatAddress(address) : address}</TableCell>
                                    <TableCell className="font-medium uppercase">{transaction}</TableCell>
                                    <TableCell>{amount} ETH</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </aside>
            </div>
        </div>
    )
} 