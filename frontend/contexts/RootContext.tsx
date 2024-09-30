"use client";
// This "RootContext" needs to be in a separate file as
// the providers are required to be client side components, yet
// the root layout is a server side. Making the entire root layout
// a client side component makes NextJS run in to an hydration error.
import { Toaster } from "@/components/ui/toaster";
import { Web3Context } from "@/contexts/Web3Context";
import Script from "next/script";

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

export default function RootContext({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MicrosoftClarity />
            <Web3Context>
                {children}
            </Web3Context>
            <Toaster />
        </>
    );
}