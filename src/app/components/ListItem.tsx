"use client";

import React from "react";
import { ListItem as ListItemType } from "../types";
import { OpenTab, Bars } from "./icons";
import { Checkbox } from ".";

interface ListItemProps {
  item: ListItemType;
  isOwner: boolean;
}

export function ListItem({ item, isOwner }: ListItemProps) {
  const handleClick = () => {
    const confirmed = confirm(
      `Are you sure you want to mark "${item.name}" as ${
        item.isBought ? "not bought" : "bought"
      }?`
    );
    if (confirmed) {
      console.log("TODO: update item's isBought property");
    }
  };

  return (
    <a
      href={item.url}
      target="_blank"
      className="flex flex-row items-center justify-between p-2 border-2 border-gray-100 rounded-md"
    >
      <div className="flex flex-row items-center gap-2">
        {isOwner ? (
          <Bars />
        ) : (
          <Checkbox checked={item.isBought} onClick={handleClick} />
        )}
        <div className="flex flex-col">
          <p>{item.name}</p>
          {item.note && <p className="text-sm text-gray-500">{item.note}</p>}
        </div>
      </div>
      <OpenTab />
    </a>
  );
}
