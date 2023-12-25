import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, Button, InputError, Spacer, List } from "@/components";
import { ListItem } from "@/types";

type Inputs = {
  name: string;
  description: string;
};

export default function CreateLists() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [items, setItems] = useState<ListItem[]>([]);
  // Add Item State
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [itemLink, setItemLink] = useState<string>("");
  const [itemNote, setItemNote] = useState<string>("");
  const [addItemErrors, setAddItemErrors] = useState<("name" | "link")[]>([]);

  const addItem = () => {
    // validate fields
    if (itemName === "") {
      setAddItemErrors([...addItemErrors, "name"]);
    }
    if (itemLink === "") {
      setAddItemErrors([...addItemErrors, "link"]);
    }
    if (addItemErrors.length > 0) {
      return;
    }

    setItems([
      ...items,
      {
        // this is just a placeholder, we will get the id from the backend
        id: items.length,
        name: itemName,
        link: itemLink,
        note: itemNote === "" ? undefined : itemNote,
        isBought: false,
      },
    ]);
  };

  const cancelAddItem = () => {
    setIsAddingItem(false);
    setItemName("");
    setItemLink("");
    setItemNote("");
    setAddItemErrors([]);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    alert("TODO: submit data to backend with items");
  };

  const onCancel = () => {
    alert("TODO: cancel and clear fields");
  };

  return (
    <div className="h-full pt-20 flex flex-col gap-8 items-center align-top w-full max-w-3xl">
      <h1 className="font-mono font-bold text-3xl">Create a New List!</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between w-full h-full pb-4"
      >
        <div className="flex flex-col gap-2">
          {/* Name Input */}
          <Input
            placeholder="List Name"
            isError={!!errors.name}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="A list must have a name" />}

          {/* Note Input */}
          <Input
            placeholder="List Description?"
            {...register("description", { required: false })}
          />

          <Spacer />

          {/* Items Section */}
          <p className="font-mono font-bold">Items:</p>
          <div className="flex flex-col gap-2 border rounded-lg border-slate-950 p-4">
            {items.length > 0 ? (
              <List items={items} isOwner={false} />
            ) : (
              <p className="font-mono text-sm self-center italic">
                No items added. Click the button below to get started!
              </p>
            )}
            {/* Add Item Section */}
            {isAddingItem ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4">
                  {/* Item Name Input */}
                  <span className="w-full">
                    <Input
                      placeholder="Item Name"
                      isError={addItemErrors.includes("name")}
                    />
                    {addItemErrors.includes("name") && (
                      <InputError message="An item must have a name" />
                    )}
                  </span>

                  {/* Item Link Input */}
                  <span className="w-full">
                    <Input
                      placeholder="Item Link"
                      isError={addItemErrors.includes("link")}
                      type="url"
                    />
                    {addItemErrors.includes("link") && (
                      <InputError message="An item must have a link" />
                    )}
                  </span>
                </div>
                {/* Item Note Input */}
                <Input placeholder="Item Note?" />

                {/* New Item Buttons */}
                <div className="flex flex-row gap-4 w-full">
                  <Button onClick={addItem}>
                    <p className="font-mono">Add</p>
                  </Button>
                  <Button onClick={cancelAddItem} btnType="secondary">
                    <p className="font-mono">Cancel</p>
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAddingItem(true)} btnType="secondary">
                <p className="font-mono">Add New Item</p>
              </Button>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-4 w-full mt-auto">
          <Button onClick={() => handleSubmit(onSubmit)}>
            <p className="font-mono">Done</p>
          </Button>
          <Button onClick={onCancel} btnType="secondary">
            <p className="font-mono">Cancel</p>
          </Button>
        </div>
      </form>
    </div>
  );
}
