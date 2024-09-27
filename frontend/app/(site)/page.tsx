'use client'

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/browser";
import Image from "next/image";


import { useEffect, useState } from "react";

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
import { fetchBaseLowGasPrice } from "@/contexts/ContractProvider";



import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { useContract } from "@/contexts/ContractProvider";
import { getEthRate } from "@/lib/ethRate";
import { formatMoney } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "connectkit";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAccount, useChainId } from "wagmi";
import { z } from "zod";

import Hero2 from "@/public/hero2.png";

const createGroupSchema = z.object({
  groupName: z.string().min(1).max(20),
  ownerNickname: z.string().min(1).max(20),
  currency: z.union([
    z.literal('ETH'),
    z.literal('USDC'),
  ])
})

function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { address, isConnected, chainId } = useAccount();
  const { openSIWE, openSwitchNetworks } = useModal()
  const { contract } = useContract()
  const { toast } = useToast()
  const myChain = useChainId()



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
    setLoading(true)


    const isUSDC = currency === "USDC"

    try {
      const lowGasPrice = await fetchBaseLowGasPrice();
      const gasLimit = await contract.methods.createGroup(groupName, ownerNickname, isUSDC).estimateGas({ from: address });
      const group = await contract.methods.createGroup(groupName, ownerNickname, isUSDC).send({
        from: address,
        gasPrice: lowGasPrice,
        gas: gasLimit
      });
      const groupId = group.events?.logGroupCreated.returnValues.groupId
      push(`/group/${groupId}`)
    } catch (error) {
      if (error instanceof Error) {
        toast({ variant: "destructive", description: error.message })
        Sentry.captureException(error);
      }
    } finally {
      setOpen(false)
      setLoading(false)
      form.reset()
    }
  }

  const onOpenDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    if (!isConnected) {
      openSIWE(true);
      return;
    }
    if (chainId !== myChain) {
      openSwitchNetworks()
      return;
    }

    setOpen(true)
  }

  const onCurrencyChange = (value: string) => {
    if (value === "ETH" || value === "USDC") {
      form.setValue("currency", value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={onOpenDialog} className="my-4 w-[60%] max-w-[240px] bg-gradient-to-br from-[#009BEB] to-[#005885] text-slate-100 text-lg">
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
              <Button variant="outline" className="bg-[#009BEB] text-slate-50" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default function Home() {
  const [openedGroups, setOpenedGroups] = useState(0);
  const [collected, setCollected] = useState(0);
  const { contract } = useContract()

  async function getContractStats() {
    const ethRate = await getEthRate();
    try {
      let res = await contract.methods.contractOpenedGroupsStat().call()
      setOpenedGroups(Number.parseInt(res))

      res = await contract.methods.contractTotalCollectedUSDCStat().call()
      const collectedUSDC = Math.floor(Number.parseInt(res) / 10 ** 6)

      res = await contract.methods.contractTotalCollectedEthStat().call()
      const collectedEth = Math.floor((Number.parseInt(res) / 10 ** 18) * ethRate)

      setCollected(collectedUSDC + collectedEth);

    } catch (error) {
      alert("Failed loading contract")
      Sentry.captureException(error);

    }

  }


  useEffect(() => {
    getContractStats();
  }, [])


  return (
    <div>
      <section id="hero" className="p-2 2xl:p-4 lg:rounded-2xl">
        <div className="mx-auto">
          <h1 className="text-[#1F92CE] lg:my-2 font-extrabold tracking-[2px] lg:text-[6rem] md:text-7xl text-5xl text-center md:text-left">PayFriends</h1>
          <div className="flex flex-col w-[80%] lg:my-8 mx-auto md:mr-auto md:ml-0 items-center md:items-start">
            <h2 className="text-black my-2 text-base md:text-2xl text-center md:text-left">Share Expenses, Save on Fees <br /> Powered by Crypto</h2>
            <CreateGroupDialog />
          </div>
        </div>
      </section>

      <div className="lg:max-w-[80%] mx-auto lg:rounded-2xl flex flex-col md:flex-row md:px-8 justify-center items-center">
        <figure id="image" className="md:max-w-[36rem] max-w-[28rem] lg:w-[60%] md:w-[50%]">
          <Image className="object-cover" src={Hero2} alt="friends" />
        </figure>

        <section id="stats" className="flex flex-col text-center justify-evenly mx-auto gap-4 mb-8 md:w-[30%]">
          <article className="flex justify-center items-center gap-4">
            <div className="max-w-[6rem]">
              <Image src="/group.svg" width={128} height={128} alt=" group" />
            </div>
            <aside className="flex flex-col items-start">
              <h1 className="lg:text-4xl text-3xl text-[#1F92CE]">{openedGroups}</h1>
              <small className="text-[#B2B2B2] text-base text-left">Opened Groups</small>
            </aside>
          </article>
          <hr className="w-[60%] mx-auto border-dashed border-[#D9D9D9]" />
          <article className="flex justify-center items-center gap-4">
            <div className="max-w-[6rem]">
              <Image src="/collected.svg" width={128} height={128} alt=" group" />
            </div>
            <aside className="flex flex-col items-start">
              <h1 className="lg:text-4xl text-3xl text-[#1F92CE]">{formatMoney(collected)}$</h1>
              <small className="text-[#B2B2B2] text-base text-left">Collected Volume</small>
            </aside>
          </article>
        </section>

      </div>
    </div>
  );
}
