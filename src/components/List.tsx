import React, { useState } from "react";
import { ListItem, Button, AddItem } from ".";
import { List as ListType } from "../types";

interface ListProps {
  list: ListType;
  isOwner: boolean;
}

export function List({ list, isOwner }: ListProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addItem = (data: { name: string; link: string; note?: string }) => {
    alert(
      `TODO: add validation and add item to DB: ${data.name} ${data.link} ${data.note}`
    );
    setIsAdding(false);
  };

  const ListWithOutItemsButtons = () => {
    return (
      <>
        {isAdding ? (
          <AddItem onDone={addItem} onCancel={() => setIsAdding(false)} />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <p className="font-mono text-sm italic self-center">
              No items yet! Click the button below to get started!
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <p className="font-mono">Add Item</p>
            </Button>
          </div>
        )}
      </>
    );
  };

  const ListWithItemsButtons = () => {
    return (
      <>
        {isAdding ? (
          <AddItem onDone={addItem} onCancel={() => setIsAdding(false)} />
        ) : (
          <div className="flex flex-row gap-4 w-full">
            <Button onClick={() => setIsAdding(true)}>
              <p className="font-mono">Add Item</p>
            </Button>
            <Button
              onClick={() => alert("TODO: edit lists")}
              btnType="secondary"
            >
              <p className="font-mono">Edit List</p>
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 border rounded-md border-slate-950">
      <div className="flex flex-col">
        <p className="font-mono font-bold text-md">{list.name}</p>
        <p className="font-mono text-xs">{list.description}</p>
      </div>
      {list.items.map((item) => (
        <ListItem key={item.id} item={item} isOwner={isOwner} />
      ))}
      {isOwner && (
        <>
          {list.items.length > 0 ? (
            <ListWithItemsButtons />
          ) : (
            <ListWithOutItemsButtons />
          )}
        </>
      )}
    </div>
  );
}
