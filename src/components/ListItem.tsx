'use client';

import { useLists, useUser } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    Checkbox,
    ItemForm,
    OpenTab,
    Pencil,
    PriceTag,
    Trash,
    Typography,
} from '.';
import { GetUserResponse, ListItem as ListItemType } from '../types';

interface ListItemProps {
    item: ListItemType;
    isOwner: boolean;
}

export function ListItem({ item, isOwner }: ListItemProps) {
    const { data: user } = useUser();

    // This should never happen but it validates that we have a user to use below
    if (!user) return null;

    if (isOwner) {
        return <OwnerListItem item={item} />;
    } else {
        return <SharedListItem item={item} user={user} />;
    }
}

// TODO: move styles to constants to reuse between OwnerListItem and SharedListItem
const styles = {
    wrapper:
        'flex flex-row items-center justify-between p-4 pl-4 bg-gray-300 dark:bg-gray-700 rounded-xl',
    item: 'flex flex-row items-center gap-4',
    itemContent: 'flex flex-col',
    itemPrice: 'flex flex-row gap-1 items-center',
    itemNote: 'text-xs',
};

interface OwnerListItemProps {
    item: ListItemType;
}

function OwnerListItem({ item }: OwnerListItemProps) {
    const { deleteListItem } = useLists();

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteItem = () => {
        // TODO: make this a modal
        const confirmed = confirm(
            `Are you sure you want to delete "${item.name}"?`
        );
        if (confirmed) {
            setIsDeleting(true);
            deleteListItem.mutate(item.id, {
                onSuccess: () => {
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                    toast.error(
                        'Something went wrong deleting the item. Refresh and try again.'
                    );
                },
            });
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.item}>
                    <div className={styles.itemContent}>
                        <Typography
                            type="p"
                            classOverride="text-sm font-semibold"
                        >
                            {item.name}
                        </Typography>

                        {item.price && (
                            <div className={styles.itemPrice}>
                                <PriceTag />
                                <Typography type="p" classOverride="text-xs">
                                    ${item.price.toString()}
                                </Typography>
                            </div>
                        )}

                        {item.note && (
                            <Typography
                                type="p"
                                classOverride={styles.itemNote}
                            >
                                {item.note}
                            </Typography>
                        )}
                    </div>
                </div>

                <div className="flex flex-row gap-4 items-center h-full">
                    <button onClick={deleteItem}>
                        <Trash
                            className={
                                isDeleting
                                    ? 'animate-pulse stroke-gray-700 dark:stroke-gray-300'
                                    : ''
                            }
                        />
                    </button>

                    {item.link ? (
                        <a
                            href={item.link}
                            target="_blank"
                            className="text-decoration-none"
                        >
                            <OpenTab />
                        </a>
                    ) : (
                        <OpenTab disabled />
                    )}

                    <button onClick={() => setIsEditing(true)}>
                        <Pencil />
                    </button>
                </div>
            </div>

            <ItemForm
                isOpen={isEditing}
                close={() => setIsEditing(false)}
                listId={item.listId}
                item={item}
            />
        </>
    );
}

interface SharedListItemProps {
    item: ListItemType;
    user: GetUserResponse;
}

function SharedListItem({ item, user }: SharedListItemProps) {
    const [isBuying, setIsBuying] = useState(false);
    const { toggleItemBought } = useLists();

    const markAsBought = () => {
        if (!!item.boughtBy && item.boughtBy.email !== user.email) {
            toast.error(`This item is already bought by ${item.boughtBy.name}`);
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to mark "${item.name}" as ${
                !!item.boughtBy ? 'available for purchase' : 'purchased'
            }?`
        );
        if (confirmed) {
            setIsBuying(true);
            toggleItemBought.mutate(
                {
                    itemId: item.id,
                    boughtByEmail: !!item.boughtBy ? null : user.email,
                },
                {
                    onSuccess: () => {
                        setIsBuying(false);
                    },
                    onError: () => {
                        setIsBuying(false);
                        toast.error(
                            'Something went wrong buying the item. Refresh and try again.'
                        );
                    },
                }
            );
        }
    };

    return (
        <ItemWrapper link={item.link}>
            <div className={styles.item}>
                <Checkbox
                    checked={item.boughtBy ? true : false}
                    onClick={markAsBought}
                />
                <div className={`flex flex-col ${isBuying && 'animate-pulse'}`}>
                    <div className="flex flex-row gap-4 items-center h-full">
                        <Typography
                            type="p"
                            classOverride={`text-sm font-semibold ${item.boughtBy ? 'line-through' : ''}`}
                        >
                            {item.name}
                        </Typography>
                        {item.boughtBy && (
                            <Typography type="p" classOverride="text-xs">
                                (Bought by {item.boughtBy.name})
                            </Typography>
                        )}
                    </div>

                    {item.price && (
                        <div className={styles.itemPrice}>
                            <PriceTag />
                            <Typography type="p" classOverride="text-xs">
                                ${item.price.toString()}
                            </Typography>
                        </div>
                    )}

                    {item.note && (
                        <Typography type="p" classOverride={styles.itemNote}>
                            {item.note}
                        </Typography>
                    )}
                </div>
            </div>
            <OpenTab disabled={!item.link} />
        </ItemWrapper>
    );
}

function ItemWrapper({
    link,
    children,
}: {
    link: string | null;
    children: React.ReactNode;
}) {
    if (!!link) {
        return (
            <a href={link} target="_blank" className={styles.wrapper}>
                {children}
            </a>
        );
    } else {
        return <div className={styles.wrapper}>{children}</div>;
    }
}
