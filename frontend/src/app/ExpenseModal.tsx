import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { useState } from "react";

import { WithContext as ReactTags } from "react-tag-input";
import { Tag } from "react-tag-input/types/components/SingleTag";


function removeButton({ className, onRemove }) {
    return (
        <button onClick={onRemove} className={className}>
            <Trash size={12} className="mx-2" />
        </button>
    )
}

export function ExpenseModal({ createExpense }) {
    const [addresses, setAddresses] = useState<Array<Tag>>([
    ]);
    const [amount, setAmount] = useState();

    const handleDelete = (index: number) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const onAddressUpdate = (index: number, newTag: Tag) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1, newTag);
        setAddresses(updatedTags);
    };

    const handleAddition = (tag: Tag) => {
        setAddresses((prevTags) => {
            return [...prevTags, tag];
        });
    };

    const handleCreate = async (e) => {
        const addressStrings = addresses.map(({ text }) => text)
        await createExpense(amount, addressStrings);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="my-2 mr-auto bg-[#6c63ff] text-slate-100">Create Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create expense request</DialogTitle>
                    <DialogDescription>
                        Create an expense request to collect money from friends.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="amount of ethereum"
                            className="col-span-3"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="addresses" className="text-right">
                            Addresses
                        </Label>
                        <ReactTags
                            id="addresses"
                            tags={addresses}
                            inputFieldPosition="top"
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            onTagUpdate={onAddressUpdate}
                            allowAdditionFromPaste
                            allowUnique
                            placeholder="Press enter to add address"
                            allowDragDrop={false}
                            removeComponent={removeButton}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}