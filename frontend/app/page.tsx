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

import { formatAddress } from "@/lib/utils";
import { ConnectKitButton } from "connectkit";

type Expense = {
  id: string,
  amount: string,
  from: string
}

const contractAddress = "0xF5e2a7e572094b035bfC1E6070ee98fB5Eb79a21";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  return (
    <main className="lg:max-w-[80%] mx-auto">
      <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
        <nav className="flex mb-4 lg:mb-16 justify-end">
          <ConnectKitButton />
        </nav>
        <div className="flex flex-wrap gap-8 justify-center text-center lg:mb-48 mb-8">
          <div className="my-auto">
            <h1 className="text-slate-50 font-extrabold tracking-[6px] lg:text-6xl text-4xl my-2">CryptoShare</h1>
            <h2 className="text-slate-400 my-2 w-[80%] mx-auto ">A group payments app to split different payments among friends</h2>
            <Button variant="secondary" className="my-2 mr-auto bg-[#6c63ff] text-slate-100">Create Expense</Button>
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
            <small>{0} ETH</small>
          </article>
          <article className="text-slate-700 lg:text-2xl text-xl" >
            <h1 className="uppercase">total expenses</h1>
            <small>{0}</small>
          </article>
          <article className="text-slate-700 lg:text-2xl text-xl" >
            <h1 className="uppercase">active expenses</h1>
            <small>{0}</small>
          </article>
        </section>

        <hr className="w-[90%] mx-auto bg-slate-200 h-[2px] my-8" />

        <section id="Expenses" className="py-8 w-[90%] mx-auto max-w-[48rem]">
          <Table>
            <TableCaption >All active expenses on contract <Link target="_blank" className="hover:underline" href={`https://sepolia.etherscan.io/address/${contractAddress}`}>{formatAddress(contractAddress)}</Link></TableCaption>
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
