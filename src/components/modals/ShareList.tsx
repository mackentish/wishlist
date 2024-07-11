import { useAllUsers, useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { ShareUser } from '@/types';
import { validateEmail } from '@/utils';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Checkbox, CircleX } from '..';
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
    const { data: users, isLoading, error } = useAllUsers();
    const { shareList } = useLists();
    const [filter, setFilter] = useState('');
    const [selectedUsers, setSelectedUsers] =
        useState<ShareUser[]>(sharedUsers);
    const [unsharedUsers, setUnsharedUsers] = useState<ShareUser[]>([]);
    const [isSharing, setIsSharing] = useState(false);
    const [inviteEmail, setInviteEmail] = useState<string>('');

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
                    toast('List share settings updated successfully 🥳');
                    close();
                },
                onError: () => {
                    setIsSharing(false);
                    toast.error('🚨 Error sharing list, try again later.');
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
                users!.find((u) => u.email === email)!,
            ]);
        }
        // Remove user from unshare list if there
        setUnsharedUsers(unsharedUsers.filter((u) => u.email !== email));
    };

    const inviteUser = () => {
        // validate email
        if (!validateEmail(inviteEmail)) {
            toast.error('Invalid email address. 😕');
            return;
        }
        // check that the user email is not already selected
        if (selectedUsers.some((u) => u.email === inviteEmail)) {
            toast.error('User already selected!');
        } else {
            setSelectedUsers([
                ...selectedUsers,
                { name: inviteEmail, email: inviteEmail },
            ]);
        }

        setInviteEmail('');
    };

    const filteredUsers =
        users?.filter((user) => {
            if (!filter) return false;
            else if (filter.length < 2)
                return user.name.toLowerCase().startsWith(filter.toLowerCase());
            else return user.name.toLowerCase().includes(filter.toLowerCase());
        }) || [];

    const renderLoading = () => {
        return (
            <p className="text-sm text-black dark:text-white">
                Loading users... 🧐
            </p>
        );
    };

    const renderError = () => {
        return (
            <p className="text-sm text-black dark:text-white">
                Error loading users, try again later. 😞
            </p>
        );
    };

    const renderContent = () => {
        return (
            <div className="flex flex-col gap-4 w-full">
                <p className="text-sm text-black dark:text-white">
                    Share this list with others by searching for them below:
                </p>
                <input
                    type="text"
                    placeholder="Search users by name..."
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
                            <p className="text-sm text-black dark:text-white">
                                No users found. Invite someone by email:
                            </p>
                            <div className="grid grid-rows-1 grid-cols-12 gap-2">
                                <input
                                    placeholder="Invite by email"
                                    className={`${inputStyles.default} col-span-8`}
                                    value={inviteEmail}
                                    onChange={(e) =>
                                        setInviteEmail(e.target.value)
                                    }
                                />
                                <Button
                                    onClick={inviteUser}
                                    styles="col-span-4 self-center h-full items-center"
                                >
                                    Invite
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Share With */}
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <p className="text-md font-bold text-black dark:text-white">
                            Share With:
                        </p>
                        {selectedUsers.map((user, index) => (
                            <div
                                key={user.name + index}
                                className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black dark:border-white"
                            >
                                <div className="flex flex-row gap-0.5 items-baseline">
                                    <p className="text-sm text-black dark:text-white">
                                        {user.name}
                                    </p>
                                    {user.email === user.name && (
                                        <p className="text-xs text-black dark:text-white">
                                            {'(new)'}
                                        </p>
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
                            <p className="text-sm self-center text-black dark:text-white">
                                Not shared with any users.
                            </p>
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
            <h1 className="font-bold text-3xl text-black dark:text-white">
                Share List 🙏
            </h1>
            {isLoading && renderLoading()}
            {(error || !users) && renderError()}
            {!isLoading && !error && renderContent()}
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
            className="flex flex-row gap-4 items-center w-full p-4 border rounded-xl border-black dark:border-white"
        >
            <Checkbox checked={isChecked} />
            <div className="flex flex-col items-start">
                <p className="text-sm text-black dark:text-white">
                    {user.name}
                </p>
                <p className="text-xs text-black dark:text-white">
                    {user.email}
                </p>
            </div>
        </button>
    );
}
