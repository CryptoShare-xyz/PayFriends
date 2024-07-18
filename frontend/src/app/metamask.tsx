import type { NextPage } from "next";
import { useEffect } from "react";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { type FC } from "react";
import { formatAddress } from "./utils";

import Link from "next/link";
import { ThreeDots } from 'react-loader-spinner';


const dot = `rounded-full h-2 w-2 mx-0.5 bg-current animate-[blink_1s_ease_0s_infinite_normal_both]"`;

const Loading: FC = () => {
    return (
        <span className="inline-flex text-center items-center leading-7 h-6">
            <span className={dot} key="dot_1'" />
            <span className={dot} style={{ animationDelay: "0.2s" }} key="dot_2" />
            <span className={dot} style={{ animationDelay: "0.2s" }} key="dot_3" />
        </span>
    );
};

function Wallet() {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet, balance },
    } = useMetamask();
    const listen = useListen();

    const showInstallMetamask =
        status !== "pageNotLoaded" && !isMetamaskInstalled;
    const showConnectButton =
        status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

    const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    const handleConnect = async () => {
        dispatch({ type: "loading" });
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
            const balance = await window.ethereum!.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            });
            dispatch({ type: "connect", wallet: accounts[0], balance });

            // we can register an event listener for changes to the users wallet
            listen();
        }
    };

    const handleDisconnect = () => {
        dispatch({ type: "disconnect" });
    };

    if (wallet && balance) {
        return (<div className="flex ml-auto justify-center text-center gap-2">
            <Image src="/metamask.png" width={48} height={48} alt="metamask logo" />
            <small className="my-auto text-slate-400 text-lg">{`${formatAddress(wallet)}`}</small>
            <Button variant="secondary" className="ml-auto" onClick={handleDisconnect}>Disconnect</Button>
        </div>
        )
    }

    if (showConnectButton) {
        return (
            <div className="flex ml-auto justify-center text-center gap-2">
                <Image src="/metamask.png" width={48} height={48} alt="metamask logo" />
                <Button variant="secondary" className="ml-auto" onClick={handleConnect}>{status === "loading" ? <ThreeDots
                    height="40"
                    width="40"
                    radius="3"
                    color="#6c63ff"
                    ariaLabel="loading"
                /> : "Connect Wallet"}</Button>
            </div >
        )
    }

    if (showInstallMetamask) {
        return (
            <div className="flex ml-auto justify-center text-center gap-2">
                <Image src="/metamask.png" width={48} height={48} alt="metamask logo" />
                <Link
                    href="https://metamask.io/"
                    target="_blank"
                    className="my-auto text-slate-400 text-lg"
                >
                    Install Metamask
                </Link>
            </div>

        )

    }
}


const MetaMaskWallet: NextPage = () => {
    const { dispatch } = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {
            // start by checking if window.ethereum is present, indicating a wallet extension
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            // this could be other wallets so we can verify if we are dealing with metamask
            // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
            const isMetamaskInstalled =
                ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const { wallet, balance } = local
                ? JSON.parse(local)
                : // backup if local storage is empty
                { wallet: null, balance: null };

            dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
        }
    }, []);

    return (
        <>
            <Wallet />
        </>
    );
};

export default MetaMaskWallet;
