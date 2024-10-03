'use client'

import { createGroup } from "@/actions/GroupSplitter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Sentry from "@sentry/browser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWalletCheck } from ".";

const createGroupSchema = z.object({
    groupName: z.string().min(1).max(20),
    ownerNickname: z.string().min(1).max(20),
    currency: z.union([
        z.literal('ETH'),
        z.literal('USDC'),
    ])
})

export default function CreateGroupDialog() {
    const [open, setOpen] = useState(false)
    const { push } = useRouter()
    const { toast } = useToast()
    const [isLoading, setLoading] = useState<boolean>();
    const walletCheck = useWalletCheck()

    const form = useForm<z.infer<typeof createGroupSchema>>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            groupName: "",
            ownerNickname: "",
            currency: "ETH"
        }
    })

    async function onSubmit(values: z.infer<typeof createGroupSchema>) {
        const { groupName, ownerNickname, currency } = values
        const isUSDC = currency === "USDC"
        setLoading(true);

        try {
            const groupId = await createGroup(groupName, ownerNickname, isUSDC);
            push(`/group/${groupId}`);
        } catch (error) {
            if (error instanceof Error) {
                toast({ variant: "destructive", description: error.message })
                Sentry.captureException(error);
            }
            console.log(error)
        } finally {
            setLoading(false)
            setOpen(false)
            form.reset()
        }
    }


    const onCurrencyChange = (value: string) => {
        if (value === "ETH" || value === "USDC") {
            form.setValue("currency", value)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={walletCheck(() => setOpen(true))} className="my-4 w-[60%] max-w-[240px] bg-gradient-to-br from-[#009BEB] to-[#005885] text-slate-100 text-lg">
                    Create group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create group</DialogTitle>
                    <DialogDescription>
                        Create group to share a common expense with friends by sending group link.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="groupName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group Name</FormLabel>
                                    <FormDescription>
                                        This is your public group name.
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="Field trip" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ownerNickname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner nickname</FormLabel>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <FormDescription>
                                        This currency to be used in group, this cannot be changed later.
                                    </FormDescription>
                                    <FormControl>
                                        <ToggleGroup type="single" defaultValue="ETH" value={form.watch("currency")} onValueChange={onCurrencyChange}>
                                            <ToggleGroupItem value="ETH"><Image className="mr-2" src="/eth.svg" width={16} height={16} alt="eth icon" />ETH</ToggleGroupItem>
                                            <ToggleGroupItem value="USDC"><Image className="mr-2" src="/usdc.svg" width={24} height={24} alt="usdc icon" />USDC</ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button variant="outline" className="bg-[#009BEB] text-slate-50" type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
