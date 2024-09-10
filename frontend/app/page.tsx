'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useState } from "react";

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


import { useContract } from "@/contexts/ContractProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectKitButton, useModal } from "connectkit";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { z } from "zod";

type Expense = {
  id: string,
  amount: string,
  from: string
}

const createGroupSchema = z.object({
  groupName: z.string().min(1).max(20),
  ownerNickname: z.string().min(1).max(20)
})

function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { address, isConnected } = useAccount();
  const { openSIWE } = useModal()
  const contract = useContract()
  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupName: "",
      ownerNickname: ""
    }
  })

  async function onSubmit(values: z.infer<typeof createGroupSchema>) {
    const { groupName, ownerNickname } = values
    setLoading(true)

    if (!isConnected) {
      openSIWE(true);
      setLoading(false);
      return;
    }

    try {
      const group = await contract.methods.createGroup(groupName, ownerNickname).send({ from: address });
      const groupId = group.events?.logGroupCreated.returnValues.groupId
      push(`/group/${groupId}`)
    } finally {
      setOpen(false)
      setLoading(false)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="my-4 w-[70%] bg-gradient-to-br from-[#009BEB] to-[#005885] text-slate-100 text-lg">
          <span>Create group</span>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
            <DialogFooter>
              <Button variant="outline" className="bg-[#009BEB] text-slate-50" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}



export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [activeExpenses, setActiveExpenses] = useState(0);

  return (
    <main className="lg:max-w-[80%] mx-auto">
      <section id="hero" className="p-8 lg:rounded-2xl">
        <nav className="flex mb-8 lg:mb-16 justify-end gap-4">
          <ConnectKitButton />
        </nav>
        <div className="flex flex-wrap gap-4 items-center">
          <h1 className="text-[#1F92CE] font-extrabold tracking-[2px] lg:text-7xl text-5xl">PayFriends</h1>
          <div className="flex justify-center items-center gap-4 text-left">
            <div className="my-auto w-[70%] mr-auto">
              <h2 className="text-black my-2">Share Expenses, Save on Fees <br /> Powered by Crypto</h2>
              <CreateGroupDialog />
            </div>
            <aside className="w-[30%] max-w-[480px] my-2 mx-auto">
              <Image src="/hero.svg" width={320} height={320} alt=" hero" />
            </aside>
          </div>
        </div>
      </section>

      <div className="lg:max-w-[80%] mx-auto lg:rounded-2xl">
        <section id="stats" className="flex flex-col text-center lg:flex-row justify-evenly mx-auto gap-4 mb-8 ">
          <article className="flex justify-center items-center gap-4">
            <div className="max-w-[15vw]">
              <Image src="/group.svg" width={128} height={128} alt=" group" />
            </div>
            <aside className="flex flex-col items-start">
              <h1 className="lg:text-3xl text-2xl text-[#1F92CE]">203</h1>
              <small className="text-[#B2B2B2] text-sm">Opened Groups</small>
            </aside>
          </article>
          <hr className="w-[50%] mx-auto my-5 border-dashed border-[#D9D9D9]" />
          <article className="flex justify-center items-center gap-4">
            <div className="max-w-[10vw]">
              <Image src="/collected.svg" width={128} height={128} alt=" group" />
            </div>
            <aside className="flex flex-col items-start">
              <h1 className="lg:text-3xl text-2xl text-[#1F92CE]">100,000$</h1>
              <small className="text-[#B2B2B2] text-sm">Collected Volume</small>
            </aside>
          </article>
        </section>

        <section id="image" className="mx-auto max-w-[48rem]">
          <Image className="object-cover" src="/hero2.svg" width={1028} height={1028} alt="friends" />
        </section>

      </div>
    </main>
  );
}
