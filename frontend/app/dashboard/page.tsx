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
import { redirect } from 'next/navigation'
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
import { useEffect, useState } from "react"
import { useAccount } from 'wagmi'


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

function CreateGroupDialog() {
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


function MainNav({
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

const ownedGroups = [
  {
    id: "67859517-b722-46e9-97e0-4bf9bebedb4f",
    name: "group 1",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
  {
    id: "12709677-68fa-4b92-8463-7a0e10037432",
    name: "group 2",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
  {
    id: "e38be1a6-c37f-4fa8-a0eb-d9d94cf35ec1",
    name: "group 3",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
  {
    id: "7e7064b7-75bb-4b1b-8ae4-6bd7af012d20",
    name: "group 4",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
  {
    id: "1bb6f88f-0567-4b23-8a72-cf5fe533dd02",
    name: "group 5",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
]

const involvedGroups = [
  {
    id: "76bfa1b2-cd46-46e6-bdaf-210a101f5bec",
    name: "group 1",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
  {
    id: "87e297f2-46d3-43a4-a6d2-5a9760f5a0ba",
    name: "group 2",
    description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis",
    amount: "123"
  },
]

const GroupCard: React.FC<typeof ownedGroups[number]> = ({ name, description, amount }) => {
  return (
    <Card className="md:w-[12rem]">
      < CardHeader className="" >
        <CardTitle className="mb-2 capitalize">
          {name}
        </CardTitle>
        <span className="text-slate-500 text-sm">{description}</span>
      </CardHeader >
      <CardContent>
        <span className="flex text-md text-slate-800">
          Collected <span className="ml-auto">{amount}</span>
        </span>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const notMobile = useMediaQuery({
    query: '(min-width: 640px)'
  })

  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState<Boolean>(false);

  // TODO: probably should use middleware/nextauth
  useEffect(() => {
    setMounted(true);
    if (!isConnected) {
      redirect("/");
    }
  }, [isConnected])

  if (!mounted) {
    return <></>
  }

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
                  {
                    ownedGroups.map(group => <GroupCard key={group.id} {...group} />)
                  }
                </div>
              </TabsContent>
              <TabsContent value="involved" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {
                    involvedGroups.map(group => <GroupCard key={group.id} {...group} />)
                  }
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
