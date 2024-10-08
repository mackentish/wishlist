import { useFriends, useLists, useShareGroups } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { ShareGroup, ShareUser } from '@/types';
import { validateEmail } from '@/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Button,
    CircleX,
    Friends,
    Person,
    ShareGroupRow,
    Typography,
    UserRow,
} from '..';
import { BaseModal } from './BaseModal';

interface ShareListProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
    sharedUsers: ShareUser[];
}

export function ShareList({
    isOpen,
    close,
    listId,
    sharedUsers,
}: ShareListProps) {
    const {
        fetchFriends: {
            data: friends,
            isLoading: friendsLoading,
            error: friendsError,
        },
    } = useFriends();
    const {
        fetchShareGroups: {
            data: shareGroups,
            isLoading: shareGroupsLoading,
            error: shareGroupsError,
        },
    } = useShareGroups();

    const { shareList } = useLists();

    const [filter, setFilter] = useState('');

    const [selectedUsers, setSelectedUsers] =
        useState<ShareUser[]>(sharedUsers);
    const [unsharedUsers, setUnsharedUsers] = useState<ShareUser[]>([]);

    const [selectedGroups, setSelectedGroups] = useState<ShareGroup[]>([]);
    const [unsharedGroups, setUnsharedGroups] = useState<ShareGroup[]>([]);

    const [isSharing, setIsSharing] = useState(false);
    const [friendEmail, setFriendEmail] = useState<string>('');

    const filteredUsers = useMemo(() => {
        if (!friends || !filter) {
            return [];
        }

        return friends.filter((friend) => {
            return friend.name.toLowerCase().includes(filter.toLowerCase());
        });
    }, [friends, filter]);

    const filteredGroups = useMemo(() => {
        if (!shareGroups || !filter) {
            return [];
        }

        return shareGroups.filter((group) => {
            if (filter.length < 2) {
                return group.name
                    .toLowerCase()
                    .startsWith(filter.toLowerCase());
            } else {
                return group.name.toLowerCase().includes(filter.toLowerCase());
            }
        });
    }, [shareGroups, filter]);

    // Update selected groups once shareGroups are loaded
    useEffect(() => {
        if (shareGroups && shareGroups.length > 0) {
            // set selectedGroups to groups where all members have the list shared with them
            const sharedEmails = sharedUsers.map((u) => u.email);
            setSelectedGroups(
                shareGroups.filter((group) =>
                    group.members.every((m) => sharedEmails.includes(m.email))
                )
            );
        }
    }, [shareGroups, sharedUsers]);

    // This is because this comes from a state update on the page/index.tsx file
    // so we need to update the selectedUsers when the state updates
    useEffect(() => {
        setSelectedUsers(sharedUsers);
    }, [sharedUsers]);

    function resetState() {
        setFilter('');
        setSelectedUsers(sharedUsers);
        setUnsharedUsers([]);
        setSelectedGroups([]);
        setUnsharedGroups([]);
        setIsSharing(false);
    }

    const updateSharedUsers = () => {
        setIsSharing(true);
        shareList.mutate(
            {
                listId: listId,
                sharedUserEmails: [
                    // combine individual users and members from groups
                    ...selectedUsers.map((user) => user.email),
                    ...selectedGroups
                        .map((group) => group.members.map((m) => m.email))
                        .flat(),
                ],
                unsharedUserEmails: [
                    // combine individual users and members from groups
                    ...unsharedUsers.map((user) => user.email),
                    ...unsharedGroups
                        .map((group) => group.members.map((m) => m.email))
                        .flat(),
                ],
            },
            {
                onSuccess: () => {
                    setIsSharing(false);
                    toast.success('List share settings updated successfully');
                    resetState();
                    close();
                },
                onError: () => {
                    setIsSharing(false);
                    toast.error('Error sharing list, try again later.');
                },
            }
        );
    };

    // SHARE USER LOGIC --------------------------------------------
    const unshareWithUser = (email: string) => {
        // Add user to unshare list if not already there
        if (!unsharedUsers.some((u) => u.email === email)) {
            setUnsharedUsers([
                ...unsharedUsers,
                selectedUsers.find((u) => u.email === email)!,
            ]);
        }
        // Remove user from shared list if there
        setSelectedUsers(selectedUsers.filter((u) => u.email !== email));
    };

    const shareWithUser = (email: string) => {
        // Check if user is already a member of a selected share group
        const userGroups = selectedGroups.filter((g) =>
            g.members.map((m) => m.email).includes(email)
        );
        if (userGroups.length > 0) {
            toast.info(
                `Already sharing with this user through group: '${userGroups[0].name}'`
            );
            return;
        }
        // Add user to shared list if not already there
        if (!selectedUsers.some((u) => u.email === email)) {
            setSelectedUsers([
                ...selectedUsers,
                friends!.find((f) => f.email === email)!,
            ]);
        }
        // Remove user from unshare list if there
        setUnsharedUsers(unsharedUsers.filter((u) => u.email !== email));
    };

    const addFriend = () => {
        // validate email
        if (!validateEmail(friendEmail)) {
            toast.error('Invalid email address.');
            return;
        }
        // check that the user email is not already selected
        if (selectedUsers.some((u) => u.email === friendEmail)) {
            toast.error('User already selected!');
        } else {
            setSelectedUsers([
                ...selectedUsers,
                { name: friendEmail, email: friendEmail },
            ]);
        }

        setFriendEmail('');
    };
    // END SHARE USER LOGIC ----------------------------------------

    // SHARE GROUP LOGIC -------------------------------------------
    const unshareWithGroup = (id: number) => {
        // Add group to unshare list if not already there
        if (!unsharedGroups.some((g) => g.id === id)) {
            setUnsharedGroups([
                ...unsharedGroups,
                selectedGroups.find((g) => g.id === id)!,
            ]);
        }

        // Remove group from shared list if there
        setSelectedGroups(selectedGroups.filter((g) => g.id !== id));
    };

    const shareWithGroup = (id: number) => {
        // Add group to shared list if not already there
        if (!selectedGroups.some((g) => g.id === id)) {
            setSelectedGroups([
                ...selectedGroups,
                shareGroups!.find((g) => g.id === id)!,
            ]);
        }

        // Remove group from unshare list if there
        setUnsharedGroups(unsharedGroups.filter((g) => g.id !== id));

        // Remove users from selected users if they are in the group
        const group = shareGroups!.find((g) => g.id === id);
        setSelectedUsers(
            selectedUsers.filter(
                (u) => !group?.members.map((m) => m.email).includes(u.email)
            )
        );
        toast.info(
            `Removed users from list that are in group: '${group?.name}'`
        );
    };
    // END SHARE GROUP LOGIC ---------------------------------------

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

    const renderContent = () => {
        return (
            <div className="flex flex-col gap-4 w-full">
                <Typography type="p" classOverride="text-sm self-center">
                    Share this list with Friends or Share Groups:
                </Typography>
                <input
                    type="text"
                    placeholder="Search friends/groups by name..."
                    className="p-4 border border-black-900 dark:border-white-100 rounded-xl bg-transparent"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                <div className="flex flex-col gap-4 w-full h-96 overflow-auto">
                    {filteredGroups.map((group, index) => (
                        <ShareGroupRow
                            key={group.name + index}
                            group={group}
                            isChecked={selectedGroups
                                .map((g) => g.id)
                                .includes(group.id)}
                            toggleGroup={() => {
                                if (
                                    selectedGroups
                                        .map((g) => g.id)
                                        .includes(group.id)
                                ) {
                                    unshareWithGroup(group.id);
                                } else {
                                    shareWithGroup(group.id);
                                }
                            }}
                        />
                    ))}
                    {filteredUsers.map((user, index) => (
                        <UserRow
                            key={user.name + index}
                            user={user}
                            isChecked={selectedUsers
                                .map((u) => u.email)
                                .includes(user.email)}
                            toggleUser={() => {
                                if (
                                    selectedUsers
                                        .map((u) => u.email)
                                        .includes(user.email)
                                ) {
                                    unshareWithUser(user.email);
                                } else {
                                    shareWithUser(user.email);
                                }
                            }}
                        />
                    ))}
                    {filteredUsers.length === 0 &&
                        filteredGroups.length === 0 && (
                            <div className="flex flex-col text-center gap-2 w-full">
                                <Typography type="p" classOverride="text-sm">
                                    No friends found. Add them by email:
                                </Typography>
                                <div className="grid grid-rows-1 grid-cols-12 gap-2">
                                    <input
                                        placeholder="Enter email..."
                                        className={`${inputStyles.default} col-span-9`}
                                        value={friendEmail}
                                        onChange={(e) =>
                                            setFriendEmail(e.target.value)
                                        }
                                    />
                                    <Button
                                        onClick={addFriend}
                                        styles="col-span-3 self-center h-full items-center"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        )}

                    {/* Shared With */}
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <Typography type="p" classOverride="font-bold">
                            Shared With:
                        </Typography>

                        {/* Groups */}
                        {selectedGroups.map((group, index) => (
                            <div
                                key={group.id + index}
                                className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black-900 dark:border-white-100"
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <Friends />

                                    <Typography
                                        type="p"
                                        classOverride="text-sm"
                                    >
                                        {group.name}
                                    </Typography>
                                </div>

                                <button
                                    onClick={() => unshareWithGroup(group.id)}
                                >
                                    <CircleX />
                                </button>
                            </div>
                        ))}

                        {/* Users */}
                        {selectedUsers.map((user, index) => (
                            <div
                                key={user.name + index}
                                className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black-900 dark:border-white-100"
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <Person />

                                    <div className="flex flex-row gap-0.5 items-baseline">
                                        <Typography
                                            type="p"
                                            classOverride="text-sm"
                                        >
                                            {user.name}
                                        </Typography>
                                        {user.email === user.name && (
                                            <Typography
                                                type="p"
                                                classOverride="text-xs"
                                            >
                                                {'(new)'}
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => unshareWithUser(user.email)}
                                >
                                    <CircleX />
                                </button>
                            </div>
                        ))}

                        {selectedUsers.length === 0 &&
                            selectedGroups.length === 0 && (
                                <Typography
                                    type="p"
                                    classOverride="text-sm self-center"
                                >
                                    Not shared with anyone.
                                </Typography>
                            )}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <Button onClick={updateSharedUsers} disabled={isSharing}>
                        {isSharing ? 'Updating...' : 'Update'}
                    </Button>
                    <Button
                        btnType="secondary"
                        onClick={() => {
                            resetState();
                            close();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onRequestClose={() => {
                resetState();
                close();
            }}
        >
            <Typography type="h3">Share List</Typography>
            {(friendsLoading || shareGroupsLoading) && renderLoading()}
            {(friendsError || shareGroupsError) && renderError()}
            {!friendsLoading &&
                !friendsError &&
                !shareGroupsLoading &&
                !shareGroupsError &&
                renderContent()}
        </BaseModal>
    );
}
