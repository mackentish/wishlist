import { useFriends, useShareGroups } from '@/hooks';
import { ShareUser } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, CircleX, Input, Typography, UserRow } from '..';
import { BaseModal } from './BaseModal';

interface AddShareGroupProps {
    isOpen: boolean;
    close: () => void;
    id?: number;
    prevName?: string;
    prevDescription: string | null;
    prevEmails?: string[];
}

export function AddShareGroup({
    isOpen,
    close,
    id,
    prevName = '',
    prevDescription = '',
    prevEmails = [],
}: AddShareGroupProps) {
    const {
        fetchFriends: {
            data: friends,
            isLoading: friendsLoading,
            error: friendsError,
        },
    } = useFriends();
    const { createShareGroup: createMutation, editShareGroup: editMutation } =
        useShareGroups();

    const [name, setName] = useState(prevName);
    const [description, setDescription] = useState(prevDescription ?? '');

    const [editingMembers, setEditingMembers] = useState(false);
    const [filter, setFilter] = useState('');
    const [members, setMembers] = useState<ShareUser[]>([]);

    const filteredUsers = useMemo(() => {
        if (!friends || !filter) {
            return [];
        }

        return friends.filter((friend) => {
            if (filter.length < 2) {
                return friend.name
                    .toLowerCase()
                    .startsWith(filter.toLowerCase());
            } else {
                return friend.name.toLowerCase().includes(filter.toLowerCase());
            }
        });
    }, [friends, filter]);

    const [isSaving, setIsSaving] = useState(false);

    // Update state variables (modal is rendered before they are set)
    useEffect(() => {
        if (prevName) {
            setName(prevName);
        }
        if (prevDescription) {
            setDescription(prevDescription);
        }
        // set initial members after fetching friends
        if (friends && prevEmails.length > 0) {
            setMembers(friends.filter((f) => prevEmails.includes(f.email)));
        }
    }, [prevName, prevDescription, friends, prevEmails]);

    const saveShareGroup = () => {
        setIsSaving(true);
        if (id) {
            // Edit share group
            editMutation.mutate(
                {
                    id,
                    name,
                    description,
                    memberEmails: members.map((m) => m.email),
                },
                {
                    onSuccess: () => {
                        setIsSaving(false);
                        setName('');
                        setDescription('');
                        setMembers([]);
                        close();
                        toast.success('Share group updated!');
                    },
                    onError: () => {
                        setIsSaving(false);
                        toast.error(
                            'Failed to update share group. Please try again.'
                        );
                    },
                }
            );
        } else {
            // Create share group
            createMutation.mutate(
                {
                    name,
                    description,
                    memberEmails: members.map((m) => m.email),
                },
                {
                    onSuccess: () => {
                        setIsSaving(false);
                        setName('');
                        setDescription('');
                        setMembers([]);
                        close();
                        toast.success('Share group created successfully!');
                    },
                    onError: () => {
                        setIsSaving(false);
                        toast.error(
                            'Failed to create share group. Please try again.'
                        );
                    },
                }
            );
        }
    };

    // Render functions: --------------------------------------------------
    const renderLoading = () => {
        return (
            <Typography type="p" classOverride="text-sm">
                Loading users...
            </Typography>
        );
    };

    const renderError = () => {
        return (
            <Typography
                type="p"
                classOverride="text-sm text-error-500 dark:text-error-500"
            >
                Error loading users, try again later.
            </Typography>
        );
    };

    function renderShareGroup() {
        return (
            <div className="flex flex-col gap-12 w-full items-center items-center min-w-72">
                <Typography type="h3">Share Group</Typography>

                <div className="flex flex-col gap-2 items-center w-full">
                    <Input
                        type="text"
                        placeholder="Enter name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSaving}
                    />

                    <Input
                        type="text"
                        placeholder="Enter description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Typography type="p" classOverride="text-lg self-center">
                        {`Sharing with ${members.length} friend${members.length !== 1 ? 's' : ''}`}
                    </Typography>

                    <Button onClick={() => setEditingMembers(true)}>
                        Edit Friends in Group
                    </Button>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Button
                        onClick={() => saveShareGroup()}
                        disabled={!name || members.length === 0 || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>

                    <Button btnType="secondary" onClick={close}>
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    function renderEditMembers() {
        return (
            <div className="flex flex-col gap-5 items-center items-center w-fit min-w-72">
                <Typography type="h3">Friends in Group</Typography>

                <div className="flex flex-col gap-2 w-full items-center">
                    <Typography type="p" classOverride="text-nowrap">
                        Edit which Friends are in your Share Group below:
                    </Typography>

                    <input
                        type="text"
                        placeholder="Search friends by name..."
                        className="w-full p-4 border border-black-900 dark:border-white-100 rounded-xl bg-transparent"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4 w-full h-96 overflow-auto">
                    {filteredUsers.map((user, index) => (
                        <UserRow
                            key={user.name + index}
                            user={user}
                            isChecked={members
                                .map((m) => m.email)
                                .includes(user.email)}
                            toggleUser={() => {
                                if (
                                    members
                                        .map((m) => m.email)
                                        .includes(user.email)
                                ) {
                                    setMembers((prev) =>
                                        prev.filter(
                                            (u) => u.email !== user.email
                                        )
                                    );
                                } else {
                                    setMembers((prev) => [...prev, user]);
                                }
                            }}
                        />
                    ))}
                    {filteredUsers.length === 0 && (
                        <Typography type="p" classOverride="self-center">
                            No match found.
                        </Typography>
                    )}

                    {/* Friends in Group */}
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <Typography type="p" classOverride="font-bold">
                            Friends in Group:
                        </Typography>
                        {members.map((member, index) => (
                            <div
                                key={member.name + index}
                                className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black-900 dark:border-white-100"
                            >
                                <div className="flex flex-row gap-0.5 items-baseline">
                                    <Typography
                                        type="p"
                                        classOverride="text-sm"
                                    >
                                        {member.name}
                                    </Typography>
                                    {member.email === member.name && (
                                        <Typography
                                            type="p"
                                            classOverride="text-xs"
                                        >
                                            {'(new)'}
                                        </Typography>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        setMembers((prev) =>
                                            prev.filter(
                                                (u) => u.email !== member.email
                                            )
                                        )
                                    }
                                >
                                    <CircleX />
                                </button>
                            </div>
                        ))}
                        {members.length === 0 && (
                            <Typography type="p" classOverride="self-center">
                                No Friends in Share Group
                            </Typography>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <Button onClick={() => setEditingMembers(false)}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    // --------------------------------------------------------------------

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                close();
                setName('');
                setDescription('');
                setMembers([]);
                setFilter('');
                setEditingMembers(false);
            }}
        >
            {friendsLoading && renderLoading()}
            {friendsError && renderError()}
            {!friendsLoading && !friendsError && (
                <>{editingMembers ? renderEditMembers() : renderShareGroup()}</>
            )}
        </BaseModal>
    );
}
