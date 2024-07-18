import { Button } from "@/components/ui/button";
import Image from "next/image";
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


const expenses = [
  {
    from: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    paymentStatus: "1/3",
    totalAmount: "$250.00",
  },
  {
    from: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
    paymentStatus: "2/4",
    totalAmount: "$150.00",
  },
  {
    from: " 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    paymentStatus: "0/8",
    totalAmount: "$350.00",
  },
  {
    from: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    paymentStatus: "4/5",
    totalAmount: "$450.00",
  },
]

export default function Home() {
  return (<div className="lg:max-w-[80%] mx-auto">
    <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
      <nav className="flex mb-4 lg:mb-16">
        <Button variant="secondary" className="ml-auto">Connect wallet</Button>
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
          <small>{"32,434$"}</small>
        </article>
        <article className="text-slate-700 lg:text-2xl text-xl" >
          <h1 className="uppercase">total expenses</h1>
          <small>{"435"}</small>
        </article>
        <article className="text-slate-700 lg:text-2xl text-xl" >
          <h1 className="uppercase">active expenses</h1>
          <small>{"34"}</small>
        </article>
      </section>


      <hr className="w-[90%] mx-auto bg-slate-200 h-[2px] my-8" />


      <section id="Expenses" className="py-8 w-[90%] mx-auto">
        <Table>
          <TableCaption >All active expenses</TableCaption>
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
                <TableCell>{expense.paymentStatus}</TableCell>
                <TableCell className="text-right">{expense.totalAmount}</TableCell>
                <TableCell className="text-center"><Button size="sm" className="bg-[#6c63ff]">Approve</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  </div >)
}