'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Web3, { Contract } from "web3";
import { MetamaskProvider } from "../hooks/useMetamask";
import ExpenseContract from "./ExpenseSplitter.json";
import MetaMaskWallet from "./metamask";
import { formatAddress } from "./utils";

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
import { useEffect, useState } from "react";

import { ExpenseModal } from "./ExpenseModal";

const contractAddress = "0xF5e2a7e572094b035bfC1E6070ee98fB5Eb79a21";

export default function Home() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [activeExpenses, setActiveExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [contract, setContract] = useState();
  const [owner, setOwner] = useState();

  const createExpenseFromOwner = (owner: string, contract: Contract) => {
    return async (amount: number, addresses: string[]) => {
      console.log(owner, amount, addresses)
      await contract.methods
        .createExpense(amount, addresses)
        .send({ from: owner });
    }
  }

  const approveExpense = async () => {
    alert("unimplemented")
  }

  const getContractInfo = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const ExpenseSplitter = new web3.eth.Contract(ExpenseContract.abi, contractAddress);

        setContract(ExpenseSplitter);
        const accounts = await web3.eth.getAccounts();
        setOwner(accounts[0]);

        let totalExpenses = await ExpenseSplitter.methods.getExpensesLength().call();
        setTotalExpenses(Number.parseInt(totalExpenses));

        let activeExpenses = await ExpenseSplitter.methods.activeExpenses().call();
        setActiveExpenses(Number.parseInt(activeExpenses));

        let cashFlow = await ExpenseSplitter.methods.cashFlow().call();
        setCashFlow(Number.parseInt(cashFlow));

        let expenses = await Promise.all(Array.from({ length: Number.parseInt(totalExpenses) }, async (v, index) => {
          const expense = await ExpenseSplitter.methods.getExpense(index).call();
          return {
            from: expense[0],
            amount: `${Number.parseInt(expense[1])} ETH`,
            completed: expense[3] ? "COMPLETE" : "PENDING"
          }
        }))

        setExpenses(expenses)

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getContractInfo();
  }, [])

  return (
    <MetamaskProvider>
      <div className="lg:max-w-[80%] mx-auto">
        <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
          <nav className="flex mb-4 lg:mb-16">
            <MetaMaskWallet />
          </nav>
          <div className="flex flex-wrap gap-8 justify-center text-center lg:mb-48 mb-8">
            <div className="my-auto">
              <h1 className="text-slate-50 font-extrabold tracking-[6px] lg:text-6xl text-4xl my-2">CryptoShare</h1>
              <h2 className="text-slate-400 my-2 w-[80%] mx-auto ">A group payments app to split different payments among friends</h2>
              <ExpenseModal createExpense={createExpenseFromOwner(owner, contract)} />
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
              <small>{`${cashFlow} ETH`}</small>
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


          <section id="Expenses" className="py-8 w-[90%] mx-auto">
            <Table>
              <TableCaption >All active expenses on contract <Link target="_blank" className="hover:underline" href={`https://sepolia.etherscan.io/address/${contractAddress}`}>{formatAddress(contractAddress)}</Link></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Request address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.from}>
                    <TableCell className="font-medium">{formatAddress(expense.from)}</TableCell>
                    <TableCell>{expense.completed}</TableCell>
                    <TableCell className="text-right">{expense.amount}</TableCell>
                    <TableCell className="text-center"><Button onClick={approveExpense} size="sm" className="bg-[#6c63ff]">Approve</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </div >
    </MetamaskProvider>)
}