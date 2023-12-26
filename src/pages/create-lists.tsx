import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Input,
  Button,
  InputError,
  Spacer,
  List,
  secondaryBtnClass,
} from "@/components";
import { ListItem, Pages } from "@/types";
import Link from "next/link";

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
        className="flex flex-col gap-4 w-full h-full pb-4"
      >
        {/* Name Input */}
        <span>
          <Input
            placeholder="List Name"
            isError={!!errors.name}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="A list must have a name" />}
        </span>

        {/* Note Input */}
        <Input
          placeholder="List Description?"
          {...register("description", { required: false })}
        />
        {/* Buttons */}
        <div className="flex flex-row gap-4 w-full">
          <Button onClick={() => handleSubmit(onSubmit)}>
            <p className="font-mono">Done</p>
          </Button>
          <Link href={Pages.Home} className={secondaryBtnClass}>
            <p className="font-mono">Cancel</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
