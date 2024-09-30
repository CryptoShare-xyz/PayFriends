"use client";

import { Navbar } from "@/components/navbar/navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ETHERSCAN_URL = `https://basescan.org/address/${process.env.NEXT_PUBLIC_CONTACT_ADDRESS}`

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, [])

    if (!mount) {
        return undefined;
    }

    return (
        <div className="h-screen">
            <main className="lg:max-w-[80%] mx-auto min-h-[80vh]">
                <Navbar />
                {children}
            </main>

            <hr className="my-4" />

            <footer className="flex flex-col justify-center items-center gap-2 p-4 max-h-[20vh]">
                <section className="flex justify-evenly items-center gap-2">
                    <Link href="https://github.com/CryptoShare-xyz/PayFriends" target="_blank">
                        <div className="max-w-[48px] w-[8vw]">
                            <Image src="/github.svg" width={128} height={128} alt="github" />
                        </div>
                    </Link>
                    <Link href="https://t.me/+Z09kZl7OiPtmNjBk" target="_blank">
                        <div className="max-w-[48px] w-[8vw]">
                            <Image src="/telegram.svg" width={128} height={128} alt="telegram" />
                        </div>
                    </Link>
                </section>
                <div className="flex flex-row justify-center items-center space-x-4">
                    <Link href="/terms">
                        <h1 className="text-muted-foreground cursor-pointer hover:underline focus:underline">Terms of Service</h1>
                    </Link>
                    <div className="w-px h-4 bg-gray-300" aria-hidden="true" />
                    <Link href={ETHERSCAN_URL} target="_blank">
                        <h1 className="text-muted-foreground cursor-pointer hover:underline focus:underline">Contract</h1>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
