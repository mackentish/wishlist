import {
    AddShareGroup,
    Button,
    FadeIn,
    Friends,
    Pencil,
    Trash,
    Typography,
} from '@/components';
import { useShareGroups } from '@/hooks';
import { ShareGroup as ShareGroupType, ShareUser } from '@/types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ShareGroups() {
    const {
        fetchShareGroups: {
            data: shareGroups,
            isLoading: groupsLoading,
            isError: groupsError,
        },
    } = useShareGroups();
    const [isOpen, setIsOpen] = useState(false);
    const [prevData, setPrevData] = useState<ShareGroupType | undefined>(
        undefined
    );

    function renderLoading() {
        return (
            <>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-gray300 dark:bg-gray700 rounded-xl h-16 w-full"
                    />
                ))}
            </>
        );
    }

    function onEdit(
        id: number,
        name: string,
        description: string | null,
        members: ShareUser[]
    ) {
        setPrevData({ id, name, description, members });
        setIsOpen(true);
    }

    return (
        <FadeIn className="flex flex-col gap-8 w-full justify-center items-center">
            <div className="flex flex-col w-full gap-4 p-5 rounded-xl bg-gray100 dark:bg-gray900">
                <Typography type="h5">Your Share Groups:</Typography>

                {/* Loading */}
                {groupsLoading && renderLoading()}

                {/* Error */}
                {groupsError && (
                    <Typography
                        type="p"
                        classOverride="self-center text-error dark:text-error"
                    >
                        Error loading share groups
                    </Typography>
                )}

                {/* No Groups */}
                {!groupsLoading &&
                    !groupsError &&
                    shareGroups?.length === 0 && (
                        <Typography type="p" classOverride="self-center italic">
                            {"You don't have any share groups yet."}
                        </Typography>
                    )}

                {/* Share Groups */}
                {!groupsLoading && !groupsError && !!shareGroups && (
                    <>
                        {shareGroups.map((group) => (
                            <ShareGroup
                                key={`share-group-${group.id}`}
                                id={group.id}
                                name={group.name}
                                description={group.description}
                                members={group.members}
                                onEdit={onEdit}
                            />
                        ))}
                    </>
                )}
            </div>

            <Button onClick={() => setIsOpen(true)}>Create Group</Button>

            <AddShareGroup
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                id={prevData?.id}
                prevName={prevData?.name}
                prevDescription={prevData?.description ?? null}
                prevEmails={prevData?.members.map((m) => m.email) ?? []}
            />
        </FadeIn>
    );
}

function ShareGroup({
    id,
    name,
    description,
    members,
    onEdit,
}: ShareGroupType & {
    onEdit: (
        id: number,
        name: string,
        description: string | null,
        members: ShareUser[]
    ) => void;
}) {
    const { deleteShareGroup: mutation } = useShareGroups();

    const deleteShareGroup = (id: number) => {
        mutation.mutate(id, {
            onSuccess: () => {
                toast.success('Share group deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete share group. Please try again.');
            },
        });
    };

    return (
        <div className="flex flex-row w-full justify-between p-4 rounded-xl bg-gray300 dark:bg-gray700">
            {/* Group Info */}
            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-4">
                    <Typography type="p" classOverride="font-bold">
                        {name}
                    </Typography>

                    <div className="flex flex-row gap-2">
                        <Typography type="p" classOverride="font-bold">
                            {members.length}
                        </Typography>
                        <Friends />
                    </div>
                </div>

                <Typography type="p">{description}</Typography>
            </div>

            {/* Controls */}
            <div className="flex flex-row gap-4 items-center">
                <button onClick={() => onEdit(id, name, description, members)}>
                    <Pencil />
                </button>

                <button onClick={() => deleteShareGroup(id)}>
                    <Trash />
                </button>
            </div>
        </div>
    );
}
