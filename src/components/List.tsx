import React, { useState } from "react";
import { ListItem, Button, ItemForm, Share, Spacer } from ".";
import { List as ListType } from "../types";
import { useLists } from "@/hooks";
import { inputStyles } from "@/styles/globalTailwind";
import { set } from "react-hook-form";

interface ListProps {
  list: ListType;
  isOwner: boolean;
}

export function List({ list, isOwner }: ListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { addListItem, deleteList, updateList } = useLists();

  const addItem = async (data: {
    name: string;
    link: string;
    note: string | null;
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

  const onSaveChanges = async () => {
    alert("TODO: update list name and description");
    setIsEditing(false);
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
          <div className="flex flex-col">
            <Spacer />
            <ItemForm
              onDone={addItem}
              onCancel={() => setIsAdding(false)}
              errorMessage={error}
            />
          </div>
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
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-2 w-full">
            <input
              className={`${inputStyles.editing} col-span-2`}
              defaultValue={list.name}
              placeholder="List Name"
            />
            <input
              className={`${inputStyles.editing} col-span-3`}
              defaultValue={list.description || ""}
              placeholder="List Description?"
            />
          </div>
          <div className="flex flex-row gap-4 w-full">
            <Button onClick={onSaveChanges}>
              <p className="font-mono">Save Changes</p>
            </Button>
            <Button btnType="danger" onClick={onDelete}>
              <p className="font-mono">Delete List</p>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <p className="font-mono font-bold text-md">{list.name}</p>
            <p className="font-mono text-xs">{list.description}</p>
          </div>
          <button onClick={() => alert("TODO: Share List")}>
            <Share />
          </button>
        </div>
      )}
      {list.items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          isOwner={isOwner}
          isListEditing={isEditing}
        />
      ))}
      {isOwner && <OwnerList />}
    </div>
  );
}
