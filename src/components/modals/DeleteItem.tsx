import { useLists } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { BaseModal } from './BaseModal';

interface DeleteItemProps {
    isOpen: boolean;
    close: () => void;
    itemId: number;
    itemName: string;
}

export function DeleteItem({
    isOpen,
    close,
    itemId,
    itemName,
}: DeleteItemProps) {
    const { deleteListItem } = useLists();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteItem = () => {
        setIsDeleting(true);
        deleteListItem.mutate(itemId, {
            onSuccess: () => {
                setIsDeleting(false);
                toast.success('Item deleted');
                close();
            },
            onError: () => {
                setIsDeleting(false);
                toast.error(
                    'Something went wrong deleting the item. Refresh and try again.'
                );
            },
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
            }}
        >
            <div className="flex flex-col gap-5">
                <Typography type="h3">Delete Item?</Typography>

                <Typography type="p">
                    {`Are you sure you want to delete "${itemName}"?`}
                </Typography>

                <Typography type="p" classOverride="font-bold">
                    This cannot be undone.
                </Typography>

                <div className="flex flex-row gap-3">
                    <Button
                        btnType="secondary"
                        onClick={close}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        btnType="danger"
                        onClick={deleteItem}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Item'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
