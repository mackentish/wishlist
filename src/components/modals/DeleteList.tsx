import { useLists } from '@/hooks';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { BaseModal } from './BaseModal';

interface DeleteListProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
    boughtItems: number;
}

export function DeleteList({
    isOpen,
    close,
    listId,
    boughtItems,
}: DeleteListProps) {
    const { deleteList } = useLists();
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = () => {
        setIsDeleting(true);
        deleteList.mutate(listId, {
            onSuccess: () => {
                setIsDeleting(false);
                close();
                toast.success('List deleted!');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Something went wrong deleting your list!');
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
                <Typography type="h3">Delete List?</Typography>

                <Typography type="p">
                    There {boughtItems === 1 ? 'is' : 'are'}{' '}
                    <span className="font-bold">
                        {boughtItems} item{boughtItems === 1 ? '' : 's'}
                    </span>{' '}
                    on this list that {boughtItems === 1 ? 'has' : 'have'}{' '}
                    already been purchased by your friends.
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
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete List'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}
