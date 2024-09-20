"use client"

import * as React from "react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "react-responsive"
import Wallet from "../ui/wallet"


export function Navbar() {
    const isMobile = !useMediaQuery({
        query: '(min-width: 640px)'
    })

    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <nav className="w-full flex flex-row p-4 mb-2 md:mb-4 lg:mb-8 items-center">
            <NavMenu isMobile={isMobile}>
                {!isHome && <ListItem href="/" title="Home" />}
                <ListItem href="/about" title="About" />
            </NavMenu>
            <div className="ml-auto">
                <Wallet isMobile={isMobile} />
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




const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none lg:text-2xl md:text-lg text-muted-foreground hover:text-[#009BEB] focus:text-[#009BEB]">{title}</div>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"