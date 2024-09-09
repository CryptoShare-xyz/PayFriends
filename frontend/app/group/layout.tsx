'use client'

import { cn } from "@/lib/utils";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { useAccount } from "wagmi";


function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/"
                className="text-sm  transition-colors hover:text-primary text-[#6c63ff] font-bold"
            >
                Overview
            </Link>
            {/* <Link
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Settings
            </Link> */}
        </nav>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const notMobile = useMediaQuery({
        query: '(min-width: 640px)'
    })
    const { isConnected } = useAccount();
    const [mounted, setMounted] = useState<Boolean>(false);

    // TODO: probably should use middleware/nextauth
    // useEffect(() => {
    //     setMounted(true);
    //     if (!isConnected) {
    //         redirect("/");
    //     }
    // }, [isConnected])

    // if (!mounted) {
    //     return <></>
    // }

    return (
        <div className="flex-col md:flex px-8 lg:max-w-[70%] mx-auto bg-slate-100 min-h-screen lg:rounded-2xl" >
            <div className="border-b mb-6">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <ConnectKitButton showBalance={notMobile} />
                    </div>
                </div>
            </div>
            {children}
        </div >
    )
}