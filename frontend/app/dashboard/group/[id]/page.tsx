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
            <DialogContent className="sm:max-w-md">
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

const events = []

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



export default function Page({ params }: { params: { id: string } }) {

    return (
        <div className="p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{`Group ${params.id?.substring(0, 4)}`}</h2>
                <div className="flex items-center space-x-2">
                    <GroupActionsMenu />
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="space-y-4 xl:w-3/5 mb-4">
                    <Card className="md:w-[12rem] hover:scale-105 hover:border-2 hover:border-[#6b63ffa1] focus:scale-105 focus:border-2 focus:border-[#6b63ffa1]">
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
                    <Card className="md:w-[12rem] hover:scale-105 hover:border-2 hover:border-[#6b63ffa1] focus:scale-105 focus:border-2 focus:border-[#6b63ffa1]">
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
                    <Card className="md:w-[12rem] hover:scale-105 hover:border-2 hover:border-[#6b63ffa1] focus:scale-105 focus:border-2 focus:border-[#6b63ffa1]">
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
                <aside className="xl:w-2/5 w-full mt-2">
                    <div className="flex p-1 mb-4">
                        <h1 className="font-semibold text-md">Recent activity</h1>
                        <small className="ml-auto"><Activity size={16} className="text-muted-foreground" /></small>
                    </div>
                    <Table className="bg-white border border-separate rounded-xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Address</TableHead>
                                <TableHead>Transaction</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map(({ address, transaction, amount }) => (
                                <TableRow key={address}>
                                    <TableCell className="font-medium">{formatAddress(address)}</TableCell>
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