import { useFriends, useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { ShareUser } from '@/types';
import { validateEmail } from '@/utils';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Checkbox, CircleX, Person, Typography } from '..';
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
    const { shareList } = useLists();

    const [filter, setFilter] = useState('');
    const [selectedUsers, setSelectedUsers] =
        useState<ShareUser[]>(sharedUsers);
    const [unsharedUsers, setUnsharedUsers] = useState<ShareUser[]>([]);
    const [isSharing, setIsSharing] = useState(false);
    const [friendEmail, setFriendEmail] = useState<string>('');

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

    const updateSharedUsers = () => {
        setIsSharing(true);
        shareList.mutate(
            {
                listId: listId,
                sharedUserEmails: selectedUsers.map((user) => user.email),
                unsharedUserEmails: unsharedUsers.map((user) => user.email),
            },
            {
                onSuccess: () => {
                    setIsSharing(false);
                    toast('List share settings updated successfully');
                    close();
                },
                onError: () => {
                    setIsSharing(false);
                    toast.error('Error sharing list, try again later.');
                },
            }
        );
    };

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
                classOverride="text-sm text-error dark:text-error"
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
                    placeholder="Search friends by name..."
                    className="p-4 border border-black dark:border-white rounded-xl bg-transparent"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                <div className="flex flex-col gap-4 w-full h-96 overflow-auto">
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
                    {filteredUsers.length === 0 && (
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
                        {selectedUsers.map((user, index) => (
                            <div
                                key={user.name + index}
                                className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black dark:border-white"
                            >
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
                                <button
                                    onClick={() => unshareWithUser(user.email)}
                                >
                                    <CircleX />
                                </button>
                            </div>
                        ))}
                        {selectedUsers.length === 0 && (
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
                    <Button
                        onClick={updateSharedUsers}
                        disabled={
                            isSharing ||
                            (selectedUsers.length === 0 &&
                                unsharedUsers.length === 0)
                        }
                    >
                        {isSharing ? 'Updating...' : 'Update'}
                    </Button>
                    <Button btnType="secondary" onClick={close}>
                        Cancel
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={close}>
            <Typography type="h3">Share List</Typography>
            {friendsLoading && renderLoading()}
            {friendsError && renderError()}
            {!friendsLoading && !friendsError && renderContent()}
        </BaseModal>
    );
}

interface UserRowProps {
    user: ShareUser;
    isChecked: boolean;
    toggleUser: (user: ShareUser) => void;
}

function UserRow({ user, isChecked, toggleUser }: UserRowProps) {
    return (
        <button
            onClick={() => {
                toggleUser(user);
            }}
            className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black dark:border-white"
        >
            <div className="flex flex-row gap-4 items-center">
                <Checkbox checked={isChecked} />
                <div className="flex flex-col items-start">
                    <Typography type="p" classOverride="text-sm">
                        {user.name}
                    </Typography>
                    <Typography type="p" classOverride="text-xs">
                        {user.email}
                    </Typography>
                </div>
            </div>

            <Person />
        </button>
    );
}
