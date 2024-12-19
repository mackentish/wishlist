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
import { ListItem as ListItemType } from '../types';

const ItemWrapper = ({
    link,
    children,
}: {
    link: string | null;
    children: React.ReactNode;
}) => {
    const style =
        'flex flex-row items-center justify-between p-4 pl-4 bg-gray-300 dark:bg-gray-700 rounded-xl';
    if (!!link) {
        return (
            <a href={link} target="_blank" className={style}>
                {children}
            </a>
        );
    } else {
        return <div className={style}>{children}</div>;
    }
};

interface ListItemProps {
    item: ListItemType;
    isOwner: boolean;
    isListEditing: boolean;
}

export function ListItem({ item, isOwner, isListEditing }: ListItemProps) {
    const { data: user } = useUser();
    const [isBuying, setIsBuying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteListItem, toggleItemBought } = useLists();

    // This should never happen but it validates that we have a user to use below
    if (!user) return null;

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

    const beginEditing = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setIsEditing(true);
        e.preventDefault();
    };

    const deleteItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        e.preventDefault();
    };

    return (
        <>
            <ItemWrapper link={item.link}>
                <div className="flex flex-row items-center gap-4">
                    {!isOwner && (
                        <Checkbox
                            checked={item.boughtBy ? true : false}
                            onClick={markAsBought}
                        />
                    )}
                    <div
                        className={`flex flex-col ${isBuying && 'animate-pulse'}`}
                    >
                        <div className="flex flex-row gap-4 items-center h-full">
                            <Typography
                                type="p"
                                classOverride={`text-sm font-semibold ${!isOwner && item.boughtBy ? 'line-through' : ''}`}
                            >
                                {item.name}
                            </Typography>
                            {!isOwner && item.boughtBy && (
                                <Typography type="p" classOverride="text-xs">
                                    (Bought by {item.boughtBy.name})
                                </Typography>
                            )}
                        </div>

                        {item.price && (
                            <div className="flex flex-row gap-1 items-center">
                                <PriceTag />
                                <Typography type="p" classOverride="text-xs">
                                    ${item.price.toString()}
                                </Typography>
                            </div>
                        )}

                        {item.note && (
                            <Typography type="p" classOverride="text-xs">
                                {item.note}
                            </Typography>
                        )}
                    </div>
                </div>
                {isListEditing ? (
                    <div className="flex flex-row gap-4">
                        <button onClick={beginEditing}>
                            <Pencil />
                        </button>

                        <button onClick={deleteItem}>
                            <Trash
                                className={
                                    isDeleting
                                        ? 'animate-pulse stroke-gray-700 dark:stroke-gray-300'
                                        : ''
                                }
                            />
                        </button>
                    </div>
                ) : (
                    <OpenTab disabled={!item.link} />
                )}
            </ItemWrapper>

            <ItemForm
                isOpen={isEditing}
                close={() => setIsEditing(false)}
                listId={item.listId}
                item={item}
            />
        </>
    );
}
