"use client";

import { Navbar } from "@/components/navbar/navbar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TermAndConditionsDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <h1 className="text-muted-foreground cursor-pointer hover:underline focus:underline">Terms of service</h1>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" showOverlay={false}>
                <DialogHeader>
                    <DialogTitle>PayFriends Terms of service</DialogTitle>
                    <DialogDescription className="text-left">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae numquam, saepe error assumenda porro ipsum accusantium natus recusandae, odit aperiam nostrum, veritatis amet reiciendis quam maxime quaerat. Minus, quod fuga!
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

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
                    <Link href="https://github.com/CryptoShare-xyz/cryptoshare" target="_blank">
                        <div className="max-w-[48px] w-[8vw]">
                            <Image src="/github.svg" width={128} height={128} alt="github" />
                        </div>
                    </Link>
                    <Link href="https://t.me/danieli4444" target="_blank">
                        <div className="max-w-[48px] w-[8vw]">
                            <Image src="/telegram.svg" width={128} height={128} alt="telegram" />
                        </div>
                    </Link>
                </section>
                <TermAndConditionsDialog />
            </footer>
        </div>
    );
}
