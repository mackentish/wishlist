import React from "react";
import { ListItem, Button } from ".";
import { ListItem as ListItemType } from "../types";

interface ListProps {
  items: ListItemType[];
  isOwner: boolean;
}

export function List({ items, isOwner }: ListProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <ListItem key={item.id} item={item} isOwner={isOwner} />
      ))}
      {isOwner && (
        <div className="flex flex-row gap-8 w-full">
          <Button onClick={() => alert("TODO: add item")}>Add Item</Button>
          <Button btnType="secondary" onClick={() => alert("TODO: edit lists")}>
            Edit List
          </Button>
        </div>
      )}
    </div>
  );
}
