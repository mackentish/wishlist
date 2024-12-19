import { useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    AnimateChangeInHeight,
    Button,
    CircleX,
    ListItem,
    Share,
    Typography,
} from '.';
import { List as ListType } from '../types';
import { ItemForm } from './modals/ItemForm';

interface ListProps {
    list: ListType;
    isOwner: boolean;
    /** Function to open the share modal. Only used for List owners */
    shareList?: () => void;
}

export function List({ list, isOwner, shareList = () => {} }: ListProps) {
    const [isOpen, setIsOpen] = useState(false);
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

    // Motion Variants:
    const containerVariants: Variants = {
        visible: {
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.18,
                when: 'beforeChildren',
            },
        },
        hidden: {
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.18,
                when: 'afterChildren',
            },
        },
    };
    const itemVariants: Variants = {
        visible: {
            opacity: 1,
            y: 0,
        },
        hidden: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    // Functions:
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

    const removeSharedList = () => {
        if (
            confirm(
                "Are you sure you want to remove this shared list? Once you do, you won't have access to it unless the owner re-shares it with you."
            )
        ) {
            setIsRemoving(true);
            deleteSharedList.mutate(list.id, {
                onSuccess: () => {
                    toast('Shared list removed');
                    setIsRemoving(false);
                },
                onError: () => {
                    toast.error(
                        'Something went wrong removing your shared list'
                    );
                    setIsRemoving(false);
                },
            });
        }
    };

    // Refactored components for readability:
    const DefaultList = () => {
        return (
            <div
                className="flex flex-row justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col items-start w-full">
                    <div className="flex flex-col-reverse w-full md:flex-row md:gap-2 md:items-baseline">
                        {loading === 'update' ? (
                            <div className="animate-pulse h-4 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2 mb-2" />
                        ) : (
                            <Typography type="p" classOverride="font-bold">
                                {list.name}
                            </Typography>
                        )}
                        {!isOwner && list.user && (
                            <Typography type="p" classOverride="text-xs">
                                {`(${list.user.name})`}
                            </Typography>
                        )}
                    </div>
                    {loading === 'update' ? (
                        <div className="animate-pulse h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2" />
                    ) : (
                        <Typography type="p" classOverride="text-sm">
                            {list.description}
                        </Typography>
                    )}
                    {list.items.length === 0 && !isOwner && (
                        <Typography
                            type="p"
                            classOverride="mt-4 self-center text-sm italic"
                        >
                            {
                                "This list doesn't have any items yet! You'll see them here when they are added."
                            }
                        </Typography>
                    )}
                </div>
                {isOwner ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            shareList();
                        }}
                        disabled={isModalOpen}
                    >
                        <Share disabled={isModalOpen} />
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            removeSharedList();
                        }}
                        disabled={isRemoving}
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
                {isEditing && (
                    <Button
                        btnType="secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Done
                    </Button>
                )}
                {!isEditing && (
                    <div className="flex flex-col gap-4 w-full">
                        {list.items.length === 0 && (
                            <Typography
                                type="p"
                                classOverride="text-sm italic self-center"
                            >
                                {
                                    'No items yet! Click the "Add Item" button below to get started!'
                                }
                            </Typography>
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

                <ItemForm
                    isOpen={isAdding}
                    close={() => setIsAdding(false)}
                    listId={list.id}
                />
            </>
        );
    };

    return (
        <AnimateChangeInHeight>
            <motion.div
                className="flex flex-col gap-5 w-full p-6 rounded-xl bg-gray-100 dark:bg-gray-900"
                initial="hidden"
                animate={isOpen ? 'visible' : 'hidden'}
                variants={containerVariants}
            >
                {isEditing ? (
                    <div className="flex flex-col gap-4 py-2">
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
                                onChange={(e) =>
                                    setListDescription(e.target.value)
                                }
                                placeholder="List Description?"
                            />
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <Button onClick={onSaveChanges}>
                                Save Changes
                            </Button>
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
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {list.items.map((item) => (
                                <MotionWrapper
                                    key={item.id.toString()}
                                    variants={itemVariants}
                                >
                                    <ListItem
                                        item={item}
                                        isOwner={isOwner}
                                        isListEditing={isEditing}
                                    />
                                </MotionWrapper>
                            ))}
                            {loading === 'add' && (
                                <MotionWrapper
                                    key="loading-add-item"
                                    variants={itemVariants}
                                >
                                    <div className="animate-pulse h-14 bg-gray-300 dark:bg-gray-700 rounded-xl w-full" />
                                </MotionWrapper>
                            )}
                            {isOwner && (
                                <MotionWrapper
                                    key="owner-buttons"
                                    variants={itemVariants}
                                >
                                    <OwnerList />
                                </MotionWrapper>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimateChangeInHeight>
    );
}

function MotionWrapper({
    variants,
    children,
}: {
    variants: Variants;
    children: React.ReactNode;
}) {
    return (
        <motion.div className="child" variants={variants}>
            {children}
        </motion.div>
    );
}
