import React, { useState } from "react";
import { ListItem, Button, AddItem, ChevronDown, ChevronUp } from ".";
import { List as ListType } from "../types";
import { useLists } from "@/hooks";

interface ListProps {
  list: ListType;
  isOwner: boolean;
}

export function List({ list, isOwner }: ListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(true);
  const { addListItem, deleteList } = useLists();

  const addItem = async (data: {
    name: string;
    link: string;
    note?: string;
  }) => {
    await addListItem.mutate(
      {
        listId: list.id,
        name: data.name,
        link: data.link,
        note: data.note,
        isBought: false,
      },
      {
        onSuccess: () => {
          setIsAdding(false);
        },
        onError: () => {
          setError("Something went wrong creating your new list item!");
        },
      }
    );
  };

  const onDelete = async () => {
    if (confirm("Are you sure you want to delete this list?")) {
      await deleteList.mutateAsync(list.id, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
          setError("Something went wrong deleting your list!");
        },
      });
    }
  };

  const OwnerList = () => {
    return (
      <>
        {isAdding && (
          <span>
            <AddItem
              onDone={addItem}
              onCancel={() => setIsAdding(false)}
              errorMessage={error}
            />
          </span>
        )}
        {isEditing && (
          <Button btnType="secondary" onClick={() => setIsEditing(false)}>
            <p className="font-mono">Done</p>
          </Button>
        )}
        {!isAdding && !isEditing && (
          <div className="flex flex-col gap-2 w-full">
            {list.items.length === 0 && (
              <p className="font-mono text-sm italic self-center">
                No items yet! Click the button below to get started!
              </p>
            )}
            <div className="flex flex-row gap-4 w-full">
              <Button onClick={() => setIsAdding(true)}>
                <p className="font-mono">Add Item</p>
              </Button>
              <Button onClick={() => setIsEditing(true)} btnType="secondary">
                <p className="font-mono">Edit List</p>
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 border rounded-md border-slate-950">
      <button
        onClick={() => {
          if (!isEditing) setIsOpen(!isOpen);
        }}
        className="flex flex-row justify-between items-center"
      >
        <div className="flex flex-col items-start">
          <p className="font-mono font-bold text-md">{list.name}</p>
          <p className="font-mono text-xs">{list.description}</p>
        </div>
        {isEditing ? (
          <button onClick={onDelete}>
            <p className="font-mono font-bold text-blue-500 hover:text-blue-600">
              Delete List
            </p>
          </button>
        ) : isOpen ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </button>
      {isOpen && (
        <>
          {list.items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              isOwner={isOwner}
              isListEditing={isEditing}
            />
          ))}
          {isOwner && <OwnerList />}
        </>
      )}
    </div>
  );
}
