'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Link from "next/link";
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
import { formatAddress } from "@/lib/utils";
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
        <Button className="my-2 mr-auto bg-[#6c63ff] text-slate-100">
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
              <Button className="bg-[#6c63ff]" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
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
      <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
        <nav className="flex mb-4 lg:mb-16 justify-end gap-4">
          {/* {isConnected && <Button variant="secondary" className="bg-[#6c63ff] text-slate-100"><Link href="dashboard">Dashboard</Link></Button>} */}
          <ConnectKitButton />
        </nav>
        <div className="flex flex-wrap gap-8 justify-center text-center lg:mb-48 mb-8">
          <div className="my-auto">
            <h1 className="text-slate-50 font-extrabold tracking-[6px] lg:text-6xl text-4xl my-2">CryptoShare</h1>
            <h2 className="text-slate-400 my-2 w-[80%] mx-auto ">A group payments app to split different payments among friends</h2>
            <CreateGroupDialog />
          </div>
          <aside className="w-[80%] max-w-[480px] my-2 mx-auto">
            <Image src="/hero.svg" width={640} height={640} alt=" hero" />
          </aside>
        </div>
      </section>

      <div className="lg:max-w-[80%] bg-slate-100 mx-auto min-h-screen lg:rounded-2xl lg:-mt-24 py-4">
        <section id="stats" className="flex flex-col text-center lg:flex-row justify-evenly py-8 mx-auto gap-4 ">
          <article className="text-slate-700 lg:text-2xl text-xl" >
            <h1 className="uppercase ">cash flow</h1>
            <small>{cashFlow} ETH</small>
          </article>
          <article className="text-slate-700 lg:text-2xl text-xl" >
            <h1 className="uppercase">total expenses</h1>
            <small>{totalExpenses}</small>
          </article>
          <article className="text-slate-700 lg:text-2xl text-xl" >
            <h1 className="uppercase">active expenses</h1>
            <small>{activeExpenses}</small>
          </article>
        </section>

        <hr className="w-[90%] mx-auto bg-slate-200 h-[2px] my-8" />

        <section id="Expenses" className="py-8 w-[90%] mx-auto max-w-[48rem]">
          <Table>
            <TableCaption >All active expenses on contract <Link target="_blank" className="hover:underline" href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_CONTACT_ADDRESS}`}>{formatAddress(process.env.NEXT_PUBLIC_CONTACT_ADDRESS)}</Link></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Request address</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{formatAddress(expense.from)}</TableCell>
                  <TableCell className="text-right">{expense.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

      </div>
    </main>
  );
}
