"use client";
import { Toaster } from "@/components/ui/toaster";
import { ContractProvider } from "@/contexts/ContractProvider";
import { WalletProvider } from "@/contexts/WalletProvider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WalletProvider>
        <ContractProvider>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased bg-white",
              fontSans.variable
            )}
          >
            {children}
            <footer className="flex flex-col justify-center items-center gap-2 p-8">
              <section className="flex justify-evenly items-center gap-2">
                <Link href="https://github.com/CryptoShare-xyz/cryptoshare" target="_blank">
                  <div className="max-w-[8vw]">
                    <Image src="/github.svg" width={128} height={128} alt="github" />
                  </div>
                </Link>
                <Link href="#" target="_blank">
                  <div className="max-w-[8vw]">
                    <Image src="/telegram.svg" width={128} height={128} alt="telegram" />
                  </div>
                </Link>
                <Link href="#" target="_blank">
                  <div className="max-w-[8vw]">
                    <Image src="/linkdin.svg" width={128} height={128} alt="linkdin" />
                  </div>
                </Link>
                <Link href="#" target="_blank">
                  <div className="max-w-[8vw]">
                    <Image src="/information.svg" width={128} height={128} alt="information" />
                  </div>
                </Link>
              </section>
              <h2 className="text-[#858585] text-sm">© PayFriends - 2024</h2>
            </footer>
          </body>
        </ContractProvider>
      </WalletProvider>
      <Toaster />
    </html>
  );
}
