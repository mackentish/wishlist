import { useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import React, { useState } from 'react';
import {
    Button,
    CircleX,
    ItemForm,
    ListItem,
    Share,
    ShareList,
    Spacer,
} from '.';
import { List as ListType } from '../types';

interface ListProps {
    list: ListType;
    isOwner: boolean;
}

export function List({ list, isOwner }: ListProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [listName, setListName] = useState(list.name);
    const [listDescription, setListDescription] = useState(
        list.description || ''
    );
    const [itemFormError, setItemFormError] = useState<string | undefined>(
        undefined
    );
    const [isSharing, setIsSharing] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addListItem, deleteList, updateList, deleteSharedList } =
        useLists();

    // Functions:
    const addItem = async (data: {
        name: string;
        link: string | null;
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
                    setItemFormError(
                        'Something went wrong creating your new list item!'
                    );
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
        if (confirm('Are you sure you want to delete this list?')) {
            deleteList.mutate(list.id, {
                onSuccess: () => {
                    setIsEditing(false);
                },
                onError: () => {
                    setItemFormError(
                        'Something went wrong deleting your list!'
                    );
                },
            });
        }
    };

    const shareList = async () => {
        setIsSharing(true);
        setIsModalOpen(true);
        setIsSharing(false);
    };

    const removeSharedList = () => {
        if (
            confirm(
                "Are you sure you want to remove this shared list? Once you do, you won't have access to it unless the owner re-shares it with you."
            )
        ) {
            setIsRemoving(true);
            deleteSharedList.mutate(list.id, {
                onSuccess: () => {
                    alert('Shared list removed!');
                    setIsRemoving(false);
                },
                onError: () => {
                    alert('Something went wrong removing your shared list!');
                    setIsRemoving(false);
                },
            });
        }
    };

    // Refactored components for readability:
    const DefaultList = () => {
        return (
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col items-start w-full">
                    <div className="flex flex-col-reverse md:flex-row md:gap-2 md:items-baseline">
                        <p className="font-mono font-bold text-md text-black dark:text-white">
                            {list.name}
                        </p>
                        {!isOwner && (
                            <p className="font-mono text-xs text-darkGrey dark:text-lightGrey">
                                {`(${list.user.name})`}
                            </p>
                        )}
                    </div>
                    <p className="font-mono text-sm text-black dark:text-white">
                        {list.description}
                    </p>
                    {list.items.length === 0 && !isOwner && (
                        <p className="mt-4 self-center font-mono text-sm italic text-darkGrey dark:text-lightGrey">
                            {
                                "This list doesn't have any items yet! You'll see them here when they are added."
                            }
                        </p>
                    )}
                </div>
                {isOwner ? (
                    <button
                        onClick={shareList}
                        disabled={isSharing}
                        className="self-start"
                    >
                        <Share disabled={isSharing} />
                    </button>
                ) : (
                    <button
                        onClick={removeSharedList}
                        disabled={isRemoving}
                        className="self-start"
                    >
                        <CircleX disabled={isRemoving} />
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
                    <Button
                        btnType="secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Done
                    </Button>
                )}
                {!isAdding && !isEditing && (
                    <div className="flex flex-col gap-2 w-full">
                        {list.items.length === 0 && (
                            <p className="font-mono text-sm italic self-center text-darkGrey dark:text-lightGrey">
                                {
                                    'No items yet! Click the "Add Item" button below to get started!'
                                }
                            </p>
                        )}
                        <div className="flex flex-row gap-4 w-full">
                            <Button onClick={() => setIsAdding(true)}>
                                Add Item
                            </Button>
                            <Button
                                onClick={() => setIsEditing(true)}
                                btnType="secondary"
                            >
                                Edit List
                            </Button>
                        </div>
                    </div>
                )}
                <ShareList
                    isOpen={isModalOpen}
                    close={() => setIsModalOpen(false)}
                    listId={list.id}
                />
            </>
        );
    };

    return (
        <div className="flex flex-col gap-2 w-full p-4 border rounded-md border-black dark:border-white">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <input
                            className={inputStyles.editing}
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="List Name"
                        />
                        <input
                            className={inputStyles.editing}
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
