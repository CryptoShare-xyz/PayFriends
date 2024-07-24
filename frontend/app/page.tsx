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

import ExpenseSplitter from "@/artifacts/contracts/ExpenseSplitter.sol/ExpenseSplitter.json";
import { formatAddress } from "@/lib/utils";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { AbiItem } from 'web3-utils';

type Expense = {
  id: string,
  amount: string,
  from: string
}

// TODO: probably need to dynamically read this from somewhere
const contractAddress = "0xF5e2a7e572094b035bfC1E6070ee98fB5Eb79a21";
const contractGenesisBlock = 6333314

// TODO: probably dont want to expose NEXT_PUBLIC_ALCHEMY_API_KEY
const alchemyKey = `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
const web3 = createAlchemyWeb3(alchemyKey);
const expenseSplitterContract = new web3.eth.Contract(
  ExpenseSplitter.abi as AbiItem[],
  contractAddress
);

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [activeExpenses, setActiveExpenses] = useState(0);
  const { address, isConnected } = useAccount();

  const getContractStats = async () => {
    const totalExpenses = await expenseSplitterContract.methods.getExpensesLength().call();
    setTotalExpenses(Number.parseInt(totalExpenses))

    const cashFlow = await expenseSplitterContract.methods.cashFlow().call();
    setCashFlow(cashFlow)

    const activeExpenses = await expenseSplitterContract.methods.getActiveExpenses().call();
    setActiveExpenses(activeExpenses)
  }

  const getRecentExpenses = async () => {
    await expenseSplitterContract.getPastEvents("LogExpenseCreated", {
      fromBlock: contractGenesisBlock
    }, (err, events) => {
      const expenses = events.map(event => ({
        from: event.returnValues.creator,
        amount: event.returnValues.amount,
        id: event.transactionHash,
      }))
      setExpenses(expenses)
    }
    )
  }

  // useEffect(() => {
  //   getContractStats();
  //   getRecentExpenses();
  // }, [])

  return (
    <main className="lg:max-w-[80%] mx-auto">
      <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
        <nav className="flex mb-4 lg:mb-16 justify-end gap-4">
          {isConnected && <Button variant="secondary" className="bg-[#6c63ff] text-slate-100"><Link href="dashboard">Dashboard</Link></Button>}
          <ConnectKitButton />
        </nav>
        <div className="flex flex-wrap gap-8 justify-center text-center lg:mb-48 mb-8">
          <div className="my-auto">
            <h1 className="text-slate-50 font-extrabold tracking-[6px] lg:text-6xl text-4xl my-2">CryptoShare</h1>
            <h2 className="text-slate-400 my-2 w-[80%] mx-auto ">A group payments app to split different payments among friends</h2>
            <Button variant="secondary" className="my-2 mr-auto bg-[#6c63ff] text-slate-100">Getting started</Button>
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