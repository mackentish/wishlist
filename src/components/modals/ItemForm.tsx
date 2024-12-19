import { useLists } from '@/hooks';
import { ListItem as ListItemType } from '@/types';
import { Prisma } from '@prisma/client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, Typography } from '..';
import { BaseModal } from './BaseModal';

interface ItemFormProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
    item?: ListItemType;
}

export function ItemForm({
    isOpen,
    close,
    listId,
    item = undefined,
}: ItemFormProps) {
    const { updateListItem, addListItem } = useLists();

    const [name, setName] = useState<string>(item?.name || '');
    const [nameError, setNameError] = useState<boolean>(false);
    const [note, setNote] = useState<string | null>(item?.note || null);
    const [link, setLink] = useState<string | null>(item?.link || null);
    // the backend will handle parsing the price
    const [price, setPrice] = useState<string | null>(
        item?.price?.toString() || null
    );

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function saveItem() {
        if (!name) {
            setNameError(true);
            return;
        }

        setIsSubmitting(true);
        if (item) {
            updateListItem
                .mutateAsync({
                    id: item.id,
                    name,
                    note,
                    link,
                    price: price ? new Prisma.Decimal(price) : null,
                    boughtBy: item.boughtBy,
                    listId,
                })
                .then(() => {
                    setIsSubmitting(false);
                    close();
                    toast.success('Item updated!');
                })
                .catch(() => {
                    setIsSubmitting(false);
                    toast.error(
                        'Something went wrong adding the item. Refresh and try again.'
                    );
                });
        } else {
            addListItem
                .mutateAsync({
                    name,
                    note,
                    link,
                    price: price ? new Prisma.Decimal(price) : null,
                    listId,
                })
                .then(() => {
                    setIsSubmitting(false);
                    close();
                    toast.success('Item added!');
                })
                .catch(() => {
                    setIsSubmitting(false);
                    toast.error(
                        'Something went wrong adding the item. Refresh and try again.'
                    );
                });
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
            }}
        >
            <div className="flex flex-col gap-10 w-full items-center min-w-72">
                <Typography type="h3">{item ? 'Edit' : 'Add'} Item</Typography>

                <div className="flex flex-col gap-3 items-center w-full">
                    {/* Name Input */}
                    <div className="flex flex-col gap-1 w-full">
                        <label
                            htmlFor="item-name"
                            className="flex flex-row items-center gap-2"
                        >
                            <Typography type="p">Name</Typography>
                            <Typography type="p" classOverride="text-xs">
                                {'(Required)'}
                            </Typography>
                        </label>
                        <Input
                            type="text"
                            name="item-name"
                            placeholder="e.g. Crewneck sweater"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            disabled={isSubmitting}
                            error={nameError}
                        />
                    </div>

                    {/* Note Input */}
                    <div className="flex flex-col gap-1 w-full">
                        <label
                            htmlFor="item-note"
                            className="flex flex-row items-center gap-2"
                        >
                            <Typography type="p">Note</Typography>
                            <Typography type="p" classOverride="text-xs">
                                ({note?.length || 0}/200)
                            </Typography>
                        </label>
                        <Input
                            type="text"
                            name="item-note"
                            placeholder="e.g. Size large, color black"
                            value={note || ''}
                            onChange={(e) => {
                                setNote(e.target.value);
                            }}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Link Input */}
                    <div className="flex flex-col gap-1 w-full">
                        <label
                            htmlFor="item-link"
                            className="flex flex-row items-center gap-1"
                        >
                            <Typography type="p">Link</Typography>
                        </label>
                        <Input
                            type="text"
                            name="item-link"
                            placeholder="e.g. https://example.com"
                            value={link || ''}
                            onChange={(e) => {
                                setLink(e.target.value);
                            }}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Price Input */}
                    <div className="flex flex-col gap-1 w-full">
                        <label
                            htmlFor="item-price"
                            className="flex flex-row items-center gap-1"
                        >
                            <Typography type="p">Price</Typography>
                        </label>
                        <Input
                            type="number"
                            name="item-price"
                            placeholder="e.g. 123.45"
                            value={price || ''}
                            onChange={(e) => {
                                setPrice(e.target.value);
                            }}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-10 w-full">
                    <Button
                        btnType="primary"
                        onClick={saveItem}
                        disabled={isSubmitting}
                    >
                        {item
                            ? isSubmitting
                                ? 'Saving...'
                                : 'Save Changes'
                            : isSubmitting
                              ? 'Adding...'
                              : 'Add Item'}
                    </Button>

                    <Button
                        btnType="secondary"
                        onClick={close}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
