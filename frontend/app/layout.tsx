"use client";
import { Toaster } from "@/components/ui/toaster";
import { ContractProvider } from "@/contexts/ContractProvider";
import { WalletProvider } from "@/contexts/WalletProvider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import "./globals.css";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


const MicrosoftClarity = () => {
  return (
    <Script
      id="microsoft-clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}");
                `,
      }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <MicrosoftClarity />
      <WalletProvider>
        <ContractProvider>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased bg-white",
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
