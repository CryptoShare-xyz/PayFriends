'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Check,
    Copy,
    Share2
} from "lucide-react";

import React, { useState } from "react";


export default function ShareGroupDialog() {
    const shareUrl = window.location.href;
    const [copied, setCopied] = useState(false)

    const copyText = (e: React.MouseEvent<HTMLElement>) => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="ml-auto mb-auto relative p-3 bg-blue-500 rounded-full cursor-pointer transition-transform hover:scale-110 focus:scale-110 translate-x-1/2">
                    <div className="absolute inset-0 border-2 border-blue-300 rounded-full"></div>
                    <Share2 className="md:w-6 md:h-6 w-4 h-4 text-white" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" showOverlay={false}>
                <DialogHeader>
                    <DialogTitle>Share group link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to join the group.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={shareUrl}
                            readOnly
                        />
                    </div>
                    <div className="p-3 bg-[#009BEB] hover:cursor-pointer text-white rounded-lg" onClick={copyText}>
                        <span className="sr-only">Copy</span>
                        {!copied ?
                            <Copy className="h-4 w-4" />
                            :
                            <Check className="h-4 w-4" />
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
