import React from "react";
import { OpenTab } from "./icons/OpenTab";
import { Checkbox } from ".";

interface ListItemProps {
  name: string;
  url: string;
  note?: string;
  isBought: boolean;
}

export function ListItem({ name, url, note, isBought }: ListItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      className="flex flex-col p-2 border-2 border-gray-100 rounded-md"
    >
      <div className="flex flex-row items-center justify-between">
        <Checkbox checked={isBought} />
        <p>{name}</p>
        <OpenTab />
      </div>
      {note && <p className="text-sm text-gray-500">{note}</p>}
    </a>
  );
}
