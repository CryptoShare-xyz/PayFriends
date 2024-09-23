import RootContext from "@/contexts/RootContext";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'PayFriends',
  description: 'Share Expenses, Save on Fees - Powered by Crypto',
  openGraph: {
    title: 'PayFriends',
    description: 'Share Expenses, Save on Fees - Powered by Crypto',
    images: "/frontend/public/hero2.png",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-white",
          fontSans.variable
        )}>
        <RootContext>
          {children}
        </RootContext>
      </body>
    </html >
  );
}
