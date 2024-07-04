import { useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
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
    const [isRemoving, setIsRemoving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<
        'add' | 'update' | 'delete' | undefined
    >(undefined);
    const { addListItem, deleteList, updateList, deleteSharedList } =
        useLists();

    // Functions:
    const addItem = (data: {
        name: string;
        link: string | null;
        note: string | null;
    }) => {
        setLoading('add');
        addListItem.mutate(
            {
                listId: list.id,
                name: data.name,
                link: data.link,
                note: data.note,
            },
            {
                onSuccess: () => {
                    setLoading(undefined);
                    setIsAdding(false);
                },
                onError: () => {
                    setLoading(undefined);
                    setItemFormError(
                        'Something went wrong creating your new list item!'
                    );
                },
            }
        );
    };

    const onSaveChanges = () => {
        setLoading('update');
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
                    setLoading(undefined);
                },
                onError: () => {
                    setLoading(undefined);
                    setIsEditing(false);
                    setItemFormError(
                        'Something went wrong updating your list!'
                    );
                },
            }
        );
    };

    const onDelete = () => {
        if (confirm('Are you sure you want to delete this list?')) {
            setLoading('delete');
            deleteList.mutate(list.id, {
                onSuccess: () => {
                    setLoading(undefined);
                    setIsEditing(false);
                },
                onError: () => {
                    setLoading(undefined);
                    setItemFormError(
                        'Something went wrong deleting your list!'
                    );
                },
            });
        }
    };

    const shareList = () => {
        setIsModalOpen(true);
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
                    toast('Shared list removed 🗑️');
                    setIsRemoving(false);
                },
                onError: () => {
                    toast.error(
                        '🚨 Something went wrong removing your shared list'
                    );
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
                    <div className="flex flex-col-reverse w-full md:flex-row md:gap-2 md:items-baseline">
                        {loading === 'update' ? (
                            <div className="animate-pulse h-4 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2 mb-2" />
                        ) : (
                            <p className="font-bold text-md text-black dark:text-white">
                                {list.name}
                            </p>
                        )}
                        {!isOwner && list.user && (
                            <p className="text-xs text-darkGrey dark:text-lightGrey">
                                {`(${list.user.name})`}
                            </p>
                        )}
                    </div>
                    {loading === 'update' ? (
                        <div className="animate-pulse h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2" />
                    ) : (
                        <p className="text-sm text-black dark:text-white">
                            {list.description}
                        </p>
                    )}
                    {list.items.length === 0 && !isOwner && (
                        <p className="mt-4 self-center text-sm italic text-darkGrey dark:text-lightGrey">
                            {
                                "This list doesn't have any items yet! You'll see them here when they are added."
                            }
                        </p>
                    )}
                </div>
                {isOwner ? (
                    <button
                        onClick={shareList}
                        disabled={isModalOpen}
                        className="self-start"
                    >
                        <Share disabled={isModalOpen} />
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
                            isLoading={loading === 'add'}
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
                            <p className="text-sm italic self-center text-darkGrey dark:text-lightGrey">
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
                    sharedUsers={list.sharedUsers}
                />
            </>
        );
    };

    return (
        <div className="flex flex-col gap-3 w-full p-4 border rounded-md border-black dark:border-white">
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
                        <Button
                            btnType="danger"
                            disabled={loading === 'delete'}
                            onClick={onDelete}
                        >
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
            {loading === 'add' && (
                <div className="animate-pulse h-10 bg-neutral-300 dark:bg-neutral-600 rounded w-full" />
            )}
            {isOwner && <OwnerList />}
        </div>
    );
}
