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
import { formatAddress } from "@/lib/utils"
import { Activity, XIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'


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


const initialOwnedGroups = [
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

const initialInvolvedGroups = [
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


function CreateGroupDialog({ groups, setGroups }: { groups: typeof initialInvolvedGroups, setGroups: Dispatch<SetStateAction<typeof initialInvolvedGroups>> }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleGroupCreation = (e) => {
    // TODO: add validation

    const id = uuidv4()
    setGroups([{
      id: id,
      name: name,
      description: description,
      amount: "123"
    }, ...groups])
    setName("")
    setDescription("")
  }

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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button className="bg-[#6c63ff]" onClick={handleGroupCreation}>Create</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}



const GroupCard: React.FC<typeof initialOwnedGroups[number]> = ({ id, name, description, amount }) => {
  return (
    <Link href={`/dashboard/group/${id}`}>
      <Card className="flex flex-col md:w-[12rem] h-full hover:scale-105 hover:border-2 hover:border-[#6b63ffa1] focus:scale-105 focus:border-2 focus:border-[#6b63ffa1]">
        <CardHeader>
          <CardTitle className="mb-2 capitalize">
            {name}
          </CardTitle>
          <span className="text-slate-500 text-sm">{description}</span>
        </CardHeader >
        <CardContent className="mt-auto">
          <span className="flex text-md text-slate-800">
            Collected <span className="ml-auto">{amount}</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const [ownedGroups, setOwnedGroups] = useState(initialOwnedGroups);
  const [filterOwnedGroups, setFilterOwnedGroups] = useState(ownedGroups);
  const [involvedGroups, setInvolvedGroups] = useState(initialInvolvedGroups);
  const [filterInvolvedGroups, setFilterInvolvedGroups] = useState(involvedGroups);
  const [filter, setFilter] = useState("");

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    setFilterOwnedGroups(ownedGroups.filter(({ name }, _) => name.includes(filter)))
    setFilterInvolvedGroups(involvedGroups.filter(({ name }, _) => name.includes(filter)))
  }, [ownedGroups, involvedGroups, filter]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CreateGroupDialog groups={ownedGroups} setGroups={setOwnedGroups} />
        </div>
      </div>
      <div className="flex flex-wrap">
        <Tabs defaultValue="owned" className="space-y-4 xl:w-3/5 mb-4">
          <div className="flex items-center relative max-w-[25rem]">
            <Input placeholder="Search group" value={filter} onChange={handleFilter} className="focus-visible:ring-transparent focus-visible:border-[#6b63ffa1]" />
            {filter && <button className="z-1 opacity-40 absolute right-2 hover:opacity-60" onClick={(e) => setFilter("")}><XIcon size={16} /></button>}
          </div>
          <TabsList>
            <TabsTrigger value="owned">Owned groups</TabsTrigger>
            <TabsTrigger value="involved">
              Involved groups
            </TabsTrigger>
          </TabsList>
          <TabsContent value="owned" className="space-y-4">
            <div className="flex flex-wrap gap-4 md:flex-row flex-col">
              {
                filterOwnedGroups.length !== 0 ?
                  filterOwnedGroups.map(group => <GroupCard key={group.id} {...group} />)
                  : <span className="p-2 text-muted-foreground">No group was found :(</span>
              }
            </div>
          </TabsContent>
          <TabsContent value="involved" className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {
                filterInvolvedGroups.length !== 0 ?
                  filterInvolvedGroups.map(group => <GroupCard key={group.id} {...group} />)
                  : <span className="p-2 text-muted-foreground">No group was found :(</span>
              }
            </div>
          </TabsContent>
        </Tabs>
        <aside className="xl:w-2/5 w-full mt-2">
          <div className="flex p-1 mb-4 items-center gap-2 ">
            <small><Activity size={16} className="text-[#6b63ffa1]" /></small>
            <h1 className="font-semibold text-md">Recent activity</h1>
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
  )
}
