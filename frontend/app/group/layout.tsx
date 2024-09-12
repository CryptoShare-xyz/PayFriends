'use client'

import { ConnectKitButton } from "connectkit";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const notMobile = useMediaQuery({
        query: '(min-width: 640px)'
    })
    return (
        <div className="flex flex-col lg:max-w-[60%] mx-auto  min-h-screen " >
            <nav className="flex py-8 items-center gap-4 bg-[#E7F1FA] lg:rounded-t-2xl px-4">
                <Link
                    href="/"
                >
                    <ArrowLeft className="text-[#009BEB]" size={24} />
                </Link>
                <span className="text-sm  font-bold">Overview</span>
                <div className="ml-auto flex items-center space-x-4">
                    <ConnectKitButton showBalance={notMobile} />
                </div>
            </nav>
            <main>
                {children}
            </main>
        </div>
    )
}