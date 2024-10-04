import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React, { useEffect, useState } from "react"

export function VanishTooltip({ content, children, onClick, timeout = 1000 }: { content: string, children: React.ReactElement, onClick?: () => void, timeout?: number }) {
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (showTooltip) {
            onClick && onClick();
            timer = setTimeout(() => {
                setShowTooltip(false)
            }, timeout)
        }
        return () => clearTimeout(timer)
    }, [showTooltip, timeout, onClick])

    const handleClick = () => {
        setShowTooltip(true)
    }

    const Trigger = React.cloneElement(children, { onClick: handleClick });

    return (
        <TooltipProvider>
            <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                    {Trigger}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="z-50">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}