import React from "react";
import { ListItem } from "./ListItem";
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
    </div>
  );
}
