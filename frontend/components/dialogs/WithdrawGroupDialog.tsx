'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import * as Sentry from "@sentry/browser";

import { withdrawFromGroup } from "@/actions/GroupSplitter";
import { CircleChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useWalletCheck } from "./";



const WithdrawGroupDialog: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const walletCheck = useWalletCheck()

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
                <Button onClick={walletCheck(() => setOpen(true))} className="text-lg bg-[#E7F1FA] border-2 border-dashed border-[#19A5ED] text-[#1F92CE] py-2 w-[90%]">Withdraw Now <CircleChevronDown className="ml-1" size={16} /> </Button>
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

export default WithdrawGroupDialog;