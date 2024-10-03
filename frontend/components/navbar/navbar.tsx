"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import Link, { LinkProps } from "next/link"
import React, { HTMLAttributeAnchorTarget } from "react"
import { useMediaQuery } from "react-responsive"
import Wallet from "../ui/wallet"


export const ListItem: React.FC<{ title: string, target?: HTMLAttributeAnchorTarget } & LinkProps> = ({ title, target, ...props }) => {
    return (
        <li>
            <Link {...props} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} target={target}>
                    <div className="text-sm font-medium leading-none lg:text-2xl md:text-lg text-muted-foreground hover:text-[#009BEB] focus:text-[#009BEB]">{title}</div>
                </NavigationMenuLink>
            </Link>
        </li>
    )
}

export function Navbar({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMobile = !useMediaQuery({
        query: '(min-width: 640px)'
    })

    return (
        <nav className="w-full flex flex-row p-4 items-center">
            <NavMenu isMobile={isMobile}>
                {children}
            </NavMenu>
            <div className="ml-auto">
                <Wallet />
            </div>
        </nav>
    )
}

function NavMenu({ isMobile, children }: { isMobile: boolean, children: React.ReactNode }) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    {isMobile
                        // on mobile wrap children in hamburger menu
                        ? <>
                            <NavigationMenuTrigger onPointerMove={(e) => e.preventDefault()} ><Menu className="text-[#009BEB]" /></NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="px-2 w-[12rem]">
                                    {children}
                                </ul>
                            </NavigationMenuContent>
                        </>
                        : <ul className="flex flex-row items-center gap-2">
                            {children}
                        </ul>

                    }
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

