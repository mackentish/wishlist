import { useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    AnimateChangeInHeight,
    Button,
    CircleX,
    ClearCart,
    ListItem,
    Pencil,
    Plus,
    PurchaseItem,
    Share,
    Trash,
    Typography,
} from '.';
import { ListItem as ListItemType, List as ListType } from '../types';

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

interface ListProps {
    list: ListType;
    isOwner: boolean;
    /** Function to open the share modal. Only used for List owners */
    shareList?: () => void;
    /** Function to open the add item modal. Only used for List owners */
    addItem?: () => void;
    /** Function to open the delete list modal. Only used for List owners */
    deleteList?: () => void;
    /** Function to open the remove purchased items modal. Only used for List owners */
    removePurchased?: () => void;
    /** Function to open the remove shared list modal. Only used for shared Lists */
    removeList?: () => void;
}

export function List({
    list,
    isOwner,
    shareList = () => {},
    addItem = () => {},
    deleteList = () => {},
    removePurchased = () => {},
    removeList = () => {},
}: ListProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AnimateChangeInHeight>
            <motion.div
                className="flex flex-col gap-5 w-full p-6 rounded-xl bg-gray-100 dark:bg-gray-900"
                initial="hidden"
                animate={isOpen ? 'visible' : 'hidden'}
                variants={containerVariants}
            >
                {isOwner ? (
                    <OwnerList
                        list={list}
                        shareList={shareList}
                        addItem={addItem}
                        deleteList={deleteList}
                        removePurchased={removePurchased}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                ) : (
                    <SharedList
                        list={list}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        removeList={removeList}
                    />
                )}
            </motion.div>
        </AnimateChangeInHeight>
    );
}

interface OwnerListProps {
    list: ListType;
    /** Function to open the share modal from the parent so the list doesn't have to be opened */
    shareList: () => void;
    /** Function to open the add item modal from the parent so the list doesn't have to be opened */
    addItem: () => void;
    /** Function to open the delete modal from the parent so the list doesn't have to be opened */
    deleteList: () => void;
    /** Function to open the remove purchased modal from the parent so the list doesn't have to be opened */
    removePurchased: () => void;
    /** Determines if the list is expanded or not */
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function OwnerList({
    list,
    shareList,
    addItem,
    deleteList,
    removePurchased,
    isOpen,
    setIsOpen,
}: OwnerListProps) {
    const { updateList } = useLists();
    const [isEditing, setIsEditing] = useState(false); // Determines if the owner is currently editing the list
    const [listName, setListName] = useState(list.name);
    const [listDescription, setListDescription] = useState(
        list.description || ''
    );
    const [isSaving, setIsSaving] = useState(false); // Determines the loading state for updating the list info

    // Functions:
    const onSaveChanges = () => {
        setIsSaving(true);
        updateList.mutate(
            {
                ...list,
                id: list.id,
                name: listName,
                description: listDescription,
            },
            {
                onSuccess: () => {
                    setIsSaving(false);
                    setIsEditing(false);
                    toast.success('List updated!');
                },
                onError: () => {
                    setIsSaving(false);
                    setIsEditing(false);
                    toast.error('Something went wrong updating your list!');
                },
            }
        );
    };

    return (
        <>
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
                            onChange={(e) => setListDescription(e.target.value)}
                            placeholder="List Description?"
                        />
                    </div>
                    <div className="flex flex-row gap-4 w-full">
                        <Button onClick={onSaveChanges} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>

                        <Button
                            btnType="secondary"
                            onClick={() => setIsEditing(false)}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className="flex flex-row justify-between items-center cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-col items-start w-full">
                        {isSaving ? (
                            <>
                                <div className="animate-pulse h-4 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2 mb-2" />
                                <div className="animate-pulse h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2" />
                            </>
                        ) : (
                            <>
                                <Typography type="p" classOverride="font-bold">
                                    {list.name}
                                </Typography>
                                <Typography type="p" classOverride="text-sm">
                                    {list.description}
                                </Typography>
                            </>
                        )}
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteList();
                            }}
                        >
                            <Trash />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removePurchased();
                            }}
                        >
                            <ClearCart />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                shareList();
                            }}
                        >
                            <Share />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(true);
                                setIsEditing(true);
                            }}
                        >
                            <Pencil />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addItem();
                            }}
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <>
                        {list.items.map((item) => (
                            <MotionWrapper
                                key={item.id.toString()}
                                variants={itemVariants}
                            >
                                <ListItem item={item} isOwner={true} />
                            </MotionWrapper>
                        ))}

                        {list.items.length === 0 && (
                            <MotionWrapper
                                key="owner-buttons"
                                variants={itemVariants}
                            >
                                <Typography
                                    type="p"
                                    classOverride="text-sm italic self-center"
                                >
                                    {
                                        'No items yet! Click the "Add Item" button below to get started!'
                                    }
                                </Typography>
                            </MotionWrapper>
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

interface PurchaseItemModalProps {
    isOpen: boolean;
    item?: ListItemType;
}
interface SharedListProps {
    list: ListType;
    /** Function to open the remove shared list modal from the parent so the list doesn't have to be opened */
    removeList: () => void;
    /** Determines if the list is expanded or not */
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function SharedList({ list, removeList, isOpen, setIsOpen }: SharedListProps) {
    const [purchaseItemModal, setPurchaseItemModal] =
        useState<PurchaseItemModalProps>({
            isOpen: false,
            item: undefined,
        });

    return (
        <>
            <div
                className="flex flex-row justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-col items-start w-full">
                    <div className="flex flex-col-reverse w-full md:flex-row md:gap-2 md:items-baseline">
                        <Typography type="p" classOverride="font-bold">
                            {list.name}
                        </Typography>

                        {list.user && (
                            <Typography type="p" classOverride="text-xs">
                                {`(${list.user.name})`}
                            </Typography>
                        )}
                    </div>

                    <Typography type="p" classOverride="text-sm">
                        {list.description}
                    </Typography>

                    {list.items.length === 0 && (
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

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeList();
                    }}
                >
                    <CircleX />
                </button>
            </div>

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
                                    isOwner={false}
                                    purchaseItem={() => {
                                        setPurchaseItemModal({
                                            isOpen: true,
                                            item: item,
                                        });
                                    }}
                                />
                            </MotionWrapper>
                        ))}

                        <PurchaseItem
                            isOpen={purchaseItemModal.isOpen}
                            close={() =>
                                setPurchaseItemModal({
                                    isOpen: false,
                                    item: undefined,
                                })
                            }
                            item={purchaseItemModal.item!}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
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
