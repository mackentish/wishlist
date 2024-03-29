'use client';

import { useLists } from '@/hooks';
import React, { useState } from 'react';
import { Checkbox, ItemForm, OpenTab, Pencil, Trash } from '.';
import { ListItem as ListItemType } from '../types';

const ItemWrapper = ({
    link,
    children,
}: {
    link: string | null;
    children: React.ReactNode;
}) => {
    const style =
        'flex flex-row items-center justify-between p-2 pl-4 border border-darkGrey dark:border-lightGrey/40 rounded';
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
    const [isEditing, setIsEditing] = useState(false);
    const { deleteListItem, updateListItem, toggleItemBought } = useLists();

    const markAsBought = () => {
        const confirmed = confirm(
            `Are you sure you want to mark "${item.name}" as ${
                item.isBought ? 'available for purchase' : 'purchased'
            }?`
        );
        if (confirmed) {
            toggleItemBought.mutate({
                itemId: item.id,
                isBought: !item.isBought,
            });
        }
    };

    const beginEditing = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setIsEditing(true);
        e.preventDefault();
    };
    const submitEditing = async (data: {
        name: string;
        link: string | null;
        note: string | null;
    }) => {
        updateListItem.mutate(
            {
                id: item.id,
                name: data.name,
                link: data.link,
                note: data.note,
                isBought: item.isBought,
                listId: item.listId,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const deleteItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const confirmed = confirm(
            `Are you sure you want to delete "${item.name}"?`
        );
        if (confirmed) {
            deleteListItem.mutate(item.id);
        }
        e.preventDefault();
    };

    return (
        <>
            {isEditing ? (
                <div className="p-2 border border-dashed border-gray-950 rounded">
                    <ItemForm
                        onDone={submitEditing}
                        onCancel={() => setIsEditing(false)}
                        defaults={{
                            name: item.name,
                            link: item.link,
                            note: item.note,
                        }}
                        doneText="Update"
                    />
                </div>
            ) : (
                <ItemWrapper link={item.link}>
                    <div className="flex flex-row items-center gap-4">
                        {!isOwner && (
                            <Checkbox
                                checked={item.isBought}
                                onClick={markAsBought}
                            />
                        )}
                        <div className="flex flex-col">
                            <p className="font-mono text-sm text-black dark:text-white">
                                {item.name}
                            </p>
                            {item.note && (
                                <p className="text-xs text-darkGrey dark:text-lightGrey font-mono">
                                    {item.note}
                                </p>
                            )}
                        </div>
                    </div>
                    {isListEditing ? (
                        <div className="flex flex-row gap-4">
                            <button onClick={beginEditing}>
                                <Pencil />
                            </button>

                            <button onClick={deleteItem}>
                                <Trash />
                            </button>
                        </div>
                    ) : (
                        <OpenTab disabled={!item.link} />
                    )}
                </ItemWrapper>
            )}
        </>
    );
}
