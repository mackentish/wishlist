"use client";

import React from "react";
import { ListItem as ListItemType } from "../types";
import { Checkbox, OpenTab, Pencil, Trash } from ".";

interface ListItemProps {
  item: ListItemType;
  isOwner: boolean;
  isEditing: boolean;
}

export function ListItem({ item, isOwner, isEditing }: ListItemProps) {
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
      href={item.link}
      target="_blank"
      className="flex flex-row items-center justify-between p-2 border border-gray-950 rounded"
    >
      <div className="flex flex-row items-center gap-2">
        {!isOwner && <Checkbox checked={item.isBought} onClick={handleClick} />}
        <div className="flex flex-col">
          <p className="font-mono">{item.name}</p>
          {item.note && (
            <p className="text-sm text-gray-500 font-mono">{item.note}</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="flex flex-row gap-4">
          <button onClick={() => alert("TODO: edit item")}>
            <Pencil />
          </button>

          <button onClick={() => alert("TODO: delete item")}>
            <Trash />
          </button>
        </div>
      ) : (
        <OpenTab />
      )}
    </a>
  );
}
