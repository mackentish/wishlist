import React, { useState } from "react";
import { ListItem, Button, Input } from ".";
import { ListItem as ListItemType } from "../types";

interface ListProps {
  items: ListItemType[];
  isOwner: boolean;
}

export function List({ items, isOwner }: ListProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <ListItem key={item.id} item={item} isOwner={isOwner} />
      ))}
      {isOwner && (
        <>
          {isEditing ? (
            <>
              <div className="flex flex-row gap-4">
                <Input placeholder="Name" />
                <Input placeholder="Note" />
              </div>
              <div className="flex flex-row gap-4 w-full">
                <Button
                  onClick={() => {
                    alert("TODO: add item");
                    setIsEditing(false);
                  }}
                >
                  Done
                </Button>
                <Button onClick={() => setIsEditing(false)} btnType="secondary">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-4 w-full">
              <Button onClick={() => setIsEditing(true)}>Add Item</Button>
              <Button
                onClick={() => alert("TODO: edit lists")}
                btnType="secondary"
              >
                Edit List
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
