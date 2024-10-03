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
import { useToast } from "@/components/ui/use-toast";

import * as Sentry from "@sentry/browser";

import { depositEth, depositUSDC } from "@/actions/GroupSplitter";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWalletCheck } from "./";


const depositGroupSchema = z.object({
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


const DepositGroupDialog: React.FC<{ groupId: string, isParticipant: boolean, isUSDC: boolean }> = ({ groupId, isParticipant, isUSDC }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const walletCheck = useWalletCheck()


    const form = useForm<z.infer<typeof depositGroupSchema>>({
        resolver: zodResolver(depositGroupSchema),
        defaultValues: {
            nickname: undefined,
            amount: 0,
            isUSDC: isUSDC,
        },
    })

    async function onSubmit(values: z.infer<typeof depositGroupSchema>) {
        let { nickname, amount } = values;
        setLoading(true)

        try {
            // nickname can be undefined for participant only as he already has one
            if (!isParticipant && nickname === undefined) {
                throw new Error('No nickname for new participant!');
            }

            nickname ??= ""

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={walletCheck(() => setOpen(true))} variant="outline" className="text-2xl bg-[#009BEB] border-1 border-[#1F92CE] text-white py-2 w-[90%]">{isParticipant ? "Deposit" : "Join group"}</Button>
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

export default DepositGroupDialog;