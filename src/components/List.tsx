import React, { useState } from "react";
import { ListItem, Button, Input, AddItem } from ".";
import { ListItem as ListItemType } from "../types";

interface ListProps {
  items: ListItemType[];
  isOwner: boolean;
}

export function List({ items, isOwner }: ListProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addItem = (data: { name: string; link: string; note?: string }) => {
    alert(
      `TODO: add validation and add item to DB: ${data.name} ${data.link} ${data.note}`
    );
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <ListItem key={item.id} item={item} isOwner={isOwner} />
      ))}
      {isOwner && (
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
      )}
    </div>
  );
}
