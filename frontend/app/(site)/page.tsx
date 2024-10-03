'use client'

import { useGroupSplitterStats } from "@/actions/GroupSplitter";
import CreateGroupDialog from "@/components/dialogs/CreateGroupDialog";
import { getEthRate } from "@/lib/ethRate";
import { formatMoney } from "@/lib/utils";
import Hero2 from "@/public/hero2.png";
import * as Sentry from "@sentry/browser";
import Image from "next/image";
import { useEffect, useState } from "react";

function StatsSection() {
  const [openedGroups, setOpenedGroups] = useState(0);
  const [collected, setCollected] = useState(0);

  const { data, isSuccess } = useGroupSplitterStats()

  useEffect(() => {
    const getStats = async () => {
      const ethRate = await getEthRate();

      setOpenedGroups(data.openedGroups);

      const collectedUSDC = Math.floor(data.totalCollectedUSDC / 10 ** 6)
      const collectedEth = Math.floor((data.totalCollectedEth / 10 ** 18) * ethRate)

      setCollected(collectedUSDC + collectedEth);
    }

    if (isSuccess) {
      getStats().catch(error => {
        alert("Failed loading contract")
        Sentry.captureException(error);
      })
    }

  }, [isSuccess, data])

  return (
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
  );
}

export default function Home() {
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
        <StatsSection />
      </div>
    </div>
  );
}
