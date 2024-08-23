"use client";
import { Toaster } from "@/components/ui/toaster";
import { ContractProvider } from "@/contexts/ContractProvider";
import { WalletProvider } from "@/contexts/WalletProvider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
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
              "min-h-screen bg-background font-sans antialiased bg-slate-200",
              fontSans.variable
            )}
          >
            {children}
          </body>
        </ContractProvider>
      </WalletProvider>
      <Toaster />
    </html>
  );
}
