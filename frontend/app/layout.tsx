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
    images: "/og_image.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: 'PayFriends',
    description: 'Share Expenses, Save on Fees - Powered by Crypto',
    images: "/og_image.jpg",
  },
  icons: [
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#1f92ce" },
  ],
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
