
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Activity, CreditCard, DollarSign } from "lucide-react";
import React from "react";

type StatProp = {
  title: string,
  icon: React.ReactNode,
  value: string
}
function Stat({ title, icon, value }: StatProp) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase text-sm flex justify-between items-center p-2">
          {title}
          <span className="pl-4">
            {icon}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex text-center justify-center">
        <div>{value}</div>
      </CardContent>
    </Card>
  )
}

function StatSection() {
  return (
    <section id="stats" className="flex justify-center flex-wrap space-x-8 p-8">
      <Stat title="cash flow" icon={<DollarSign size={16} />} value="$45,231.89" />
      <Stat title="total expenses" icon={<CreditCard size={16} />} value="45" />
      <Stat title="active expenses" icon={<Activity size={16} />} value="12" />
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col p-8 text-center bg-slate-200 min-h-screen w-[70%] mx-auto my-8 rounded-xl">
      <section id="hero">
        <h1 className="text-4xl tracking-wider">CryptoShare</h1>
      </section>
      <StatSection />
      <hr className="w-[80%] bg-slate-400 h-[2px] mx-auto my-4" />
      <section id="activity">
        <h1 className="text-2xl tracking-wider">Activity</h1>
      </section>
    </div>
  )
}