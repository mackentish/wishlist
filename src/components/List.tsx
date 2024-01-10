import React, { useState } from "react";
import { ListItem, Button, ItemForm, Share, Spacer } from ".";
import { List as ListType } from "../types";
import { useLists } from "@/hooks";
import { inputStyles } from "@/styles/globalTailwind";

interface ListProps {
  list: ListType;
  isOwner: boolean;
}

export function List({ list, isOwner }: ListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [listDescription, setListDescription] = useState(
    list.description || ""
  );
  const [itemFormError, setItemFormError] = useState<string | undefined>(
    undefined
  );
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const { addListItem, deleteList, updateList } = useLists();

  // Functions:
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
          setItemFormError("Something went wrong creating your new list item!");
        },
      }
    );
  };

  const onSaveChanges = () => {
    updateList.mutate(
      {
        ...list,
        id: list.id,
        name: listName,
        description: listDescription,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
    setIsEditing(false);
  };

  const onDelete = () => {
    if (confirm("Are you sure you want to delete this list?")) {
      deleteList.mutate(list.id, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
          setItemFormError("Something went wrong deleting your list!");
        },
      });
    }
  };

  const generateLink = async () => {
    setIsLinkLoading(true);
    const res = await fetch(`/api/shareLink/${list.id}`);
    if (res.ok) {
      const { link } = await res.json();
      await navigator.clipboard.writeText(link);
      alert(
        `Link copied to clipboard. Send this link with your friends to share your '${list.name}' list!`
      );
    } else {
      alert("Something went wrong generating your share link!");
    }
    setIsLinkLoading(false);
  };

  // Refactored components for readability:
  const DefaultList = () => {
    return (
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col items-start">
          <p className="font-mono font-bold text-md text-black dark:text-white">
            {list.name}
          </p>
          <p className="font-mono text-xs text-black dark:text-white">
            {list.description}
          </p>
        </div>
        {isOwner && (
          <button onClick={generateLink} disabled={isLinkLoading}>
            <Share disabled={isLinkLoading} />
          </button>
        )}
      </div>
    );
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
              errorMessage={itemFormError}
            />
          </div>
        )}
        {isEditing && (
          <Button btnType="secondary" onClick={() => setIsEditing(false)}>
            Done
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
              <Button onClick={() => setIsAdding(true)}>Add Item</Button>
              <Button onClick={() => setIsEditing(true)} btnType="secondary">
                Edit List
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 border rounded-md border-black dark:border-white">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-2 w-full">
            <input
              className={`${inputStyles.editing} col-span-2`}
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List Name"
            />
            <input
              className={`${inputStyles.editing} col-span-3`}
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              placeholder="List Description?"
            />
          </div>
          <div className="flex flex-row gap-4 w-full">
            <Button onClick={onSaveChanges}>Save Changes</Button>
            <Button btnType="danger" onClick={onDelete}>
              Delete List
            </Button>
          </div>
        </div>
      ) : (
        <DefaultList />
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
