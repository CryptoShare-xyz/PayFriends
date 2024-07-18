import { Button } from "@/components/ui/button";
import Image from "next/image";



export default function Home() {
  return (<div className="lg:max-w-[80%] mx-auto">
    <section id="hero" className="bg-slate-700 px-4 py-4 lg:rounded-2xl">
      <nav className="flex mb-4">
        <Button variant="secondary" className="ml-auto">Connect wallet</Button>
      </nav>
      <div className="flex flex-wrap gap-8 justify-center text-center">
        <div className="my-auto">
          <h1 className="text-slate-200 font-extrabold tracking-[6px] lg:text-6xl text-4xl my-2">CryptoShare</h1>
          <h2 className="text-slate-400 my-2 w-[80%] mx-auto ">A group payments app to split different payments among friends</h2>
          <Button variant="secondary" className="my-2 mr-auto">Create Expense</Button>
        </div>
        <aside className="w-[80%] max-w-[480px] my-2 mx-auto">
          <Image src="/hero.svg" width={640} height={640} alt=" hero" />
        </aside>

      </div>
    </section >
    <div className="lg:max-w-[80%] bg-slate-100 mx-auto min-h-screen lg:rounded-2xl">
      <section id="Stats">
        Stats
      </section>
      <section id="Expenses">
        Expenses
      </section>
    </div>
  </div >)
}