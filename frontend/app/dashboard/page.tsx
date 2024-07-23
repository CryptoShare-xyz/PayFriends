'use client'


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ConnectKitButton } from "connectkit"
import { useMediaQuery } from 'react-responsive'

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, formatAddress } from "@/lib/utils"
import { Activity } from 'lucide-react'

const events = [
  {
    address: "0x2b51b1941dfdb01fb54ce439295455b12a01da5d06ed0cc9073b61a5f9a7e4e1",
    transaction: "pay",
    amount: 5
  },
  {
    address: "0x5e1ff4a84beb13cdc03ecc6d5d553a6763edd0e8789eeb8faef744b0c9c87e84",
    transaction: "collect",
    amount: 10
  },
  {
    address: "0x5f66df09cea2c715be958d025374fc965fe239260f2a6c3c924b56631dbceacc",
    transaction: "pay",
    amount: 2
  },
  {
    address: "0x3af2e55285f092d375cc50f4aa12d944dd96ef8abc299fa4ea89fdf9f2457e5f",
    transaction: "pay",
    amount: 4
  },
]

export function CreateGroupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-2 mr-auto bg-[#6c63ff] text-slate-100">
          <span className="sm:hidden rounded-[50%]">+</span>
          <span className="hidden sm:block">Create group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>
            Create group to share a common expense with friends by sending group link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Group name
            </Label>
            <Input
              id="name"
              placeholder="Fun school trip"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Gathering money for the best school trip ever!"
              className="col-span-3"
              maxLength={100}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-[#6c63ff]">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm  transition-colors hover:text-primary text-[#6c63ff] font-bold"
      >
        Overview
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  )
}

export default function DashboardPage() {
  const notMobile = useMediaQuery({
    query: '(min-width: 640px)'
  })

  return (
    <>
      <div className="flex-col md:flex px-8 lg:max-w-[70%] mx-auto bg-slate-100 min-h-screen lg:rounded-2xl">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ConnectKitButton showBalance={notMobile} />
            </div>
          </div>
        </div>
        <div className="p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CreateGroupDialog />
            </div>
          </div>
          <div className="flex flex-wrap">
            <Tabs defaultValue="owned" className="space-y-4 xl:w-3/5 mb-4">
              <TabsList>
                <TabsTrigger value="owned">Owned groups</TabsTrigger>
                <TabsTrigger value="involved">
                  Involved groups
                </TabsTrigger>
              </TabsList>
              <TabsContent value="owned" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 1
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 2
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 3
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 4
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 5
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="involved" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 1
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="md:w-[12rem]">
                    <CardHeader className="">
                      <CardTitle className="mb-2">
                        Group 2
                      </CardTitle>
                      <span className="text-slate-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis </span>
                    </CardHeader>
                    <CardContent>
                      <span className="flex text-md text-slate-800">
                        Collected <span className="ml-auto">123 ETH</span>
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            <aside className="xl:w-2/5 w-full mt-2">
              <div className="flex p-1 mb-4">
                <h1 className="font-semibold text-md">Recent activity</h1>
                <small className="ml-auto"><Activity size={16} className="text-muted-foreground" /></small>
              </div>
              <Table className="bg-white border border-separate rounded-xl">
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map(({ address, transaction, amount }) => (
                    <TableRow key={address}>
                      <TableCell className="font-medium">{formatAddress(address)}</TableCell>
                      <TableCell className="font-medium uppercase">{transaction}</TableCell>
                      <TableCell>{amount} ETH</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </aside>
          </div>
        </div>
      </div >
    </>
  )
}
