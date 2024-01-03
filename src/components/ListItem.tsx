"use client";

import React from "react";
import { ListItem as ListItemType } from "../types";
import { Checkbox, OpenTab, Pencil, Trash } from ".";
import { useLists } from "@/hooks";

interface ListItemProps {
  item: ListItemType;
  isOwner: boolean;
  isListEditing: boolean;
}

export function ListItem({ item, isOwner, isListEditing }: ListItemProps) {
  const { deleteListItem } = useLists();

  const markAsBought = () => {
    const confirmed = confirm(
      `Are you sure you want to mark "${item.name}" as ${
        item.isBought ? "not bought" : "bought"
      }?`
    );
    if (confirmed) {
      console.log("TODO: update item's isBought property");
    }
  };

  const beginEditing = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    alert("TODO: edit item");
    e.preventDefault();
  };

  const deleteItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (confirmed) {
      deleteListItem.mutate(item.id);
    }
    e.preventDefault();
  };

  return (
    <a
      href={item.link}
      target="_blank"
      className="flex flex-row items-center justify-between p-2 border border-gray-950 rounded"
    >
      <div className="flex flex-row items-center gap-2">
        {!isOwner && (
          <Checkbox checked={item.isBought} onClick={markAsBought} />
        )}
        <div className="flex flex-col">
          <p className="font-mono">{item.name}</p>
          {item.note && (
            <p className="text-sm text-gray-500 font-mono">{item.note}</p>
          )}
        </div>
      </div>
      {isListEditing ? (
        <div className="flex flex-row gap-4">
          <button onClick={beginEditing}>
            <Pencil />
          </button>

          <button onClick={deleteItem}>
            <Trash />
          </button>
        </div>
      ) : (
        <OpenTab />
      )}
    </a>
  );
}
