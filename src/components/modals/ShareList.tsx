import { useAllUsers, useLists } from '@/hooks';
import { ShareUser } from '@/types';
import React, { useState } from 'react';
import { Button, Checkbox } from '..';
import { BaseModal } from './BaseModal';

interface ShareListProps {
    isOpen: boolean;
    close: () => void;
    listId: number;
}

export function ShareList({ isOpen, close, listId }: ShareListProps) {
    const { data: users, isLoading, error } = useAllUsers();
    const { shareList } = useLists();
    const [filter, setFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<ShareUser[]>([]);
    const [isSharing, setIsSharing] = useState(false);

    const shareListWithUsers = () => {
        console.log('Share with:', selectedUsers);
        setIsSharing(true);
        shareList.mutate(
            {
                listId: listId,
                sharedUserEmails: selectedUsers.map((user) => user.email),
            },
            {
                onSuccess: () => {
                    setIsSharing(false);
                    alert('List shared successfully!');
                    close();
                },
                onError: () => {
                    setIsSharing(false);
                    alert('Error sharing list, try again later.');
                },
            }
        );
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
            <p className="font-mono text-sm text-black dark:text-white">
                Loading users... 🧐
            </p>
        );
    };

    const renderError = () => {
        return (
            <p className="font-mono text-sm text-black dark:text-white">
                Error loading users, try again later. 😞
            </p>
        );
    };

    const renderContent = () => {
        return (
            <div className="flex flex-col gap-4 w-full">
                <p className="font-mono text-sm text-black dark:text-white">
                    Share this list with others by searching for them below:
                </p>
                <input
                    type="text"
                    placeholder="Search users by name..."
                    className="font-mono p-2 border border-black dark:border-white rounded bg-transparent"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex flex-col gap-4 w-full pr-4 h-96 overflow-auto">
                    {filteredUsers.map((user, index) => (
                        <UserRow
                            key={user.name + index}
                            user={user}
                            toggleUser={() => {
                                if (selectedUsers.includes(user)) {
                                    setSelectedUsers(
                                        selectedUsers.filter((u) => u !== user)
                                    );
                                } else {
                                    setSelectedUsers([...selectedUsers, user]);
                                }
                            }}
                        />
                    ))}
                    {filteredUsers.length === 0 && (
                        <p className="font-mono text-sm self-center text-darkGrey dark:text-lightGrey">
                            No users found.
                        </p>
                    )}

                    {/* Selected Users */}
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <p className="font-mono text-md text-black dark:text-white">
                            Selected Users:
                        </p>
                        {selectedUsers.map((user, index) => (
                            <p
                                key={user.name + index}
                                className="font-mono text-sm text-black dark:text-white"
                            >
                                {user.name}
                            </p>
                        ))}
                        {selectedUsers.length === 0 && (
                            <p className="font-mono text-sm self-center text-darkGrey dark:text-lightGrey">
                                No users selected.
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <Button
                        onClick={shareListWithUsers}
                        disabled={isSharing || selectedUsers.length === 0}
                    >
                        {isSharing ? 'Sharing...' : 'Share List'}
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
            <h1 className="font-mono font-bold text-3xl text-black dark:text-white">
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
    toggleUser: (user: ShareUser) => void;
}

function UserRow({ user, toggleUser }: UserRowProps) {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <button
            onClick={() => {
                setIsChecked(!isChecked);
                toggleUser(user);
            }}
            className="flex flex-row gap-4 items-center w-full p-2 border rounded border-black dark:border-white"
        >
            <Checkbox checked={isChecked} />
            <div className="flex flex-col gap-1 items-start">
                <p className="font-mono text-sm text-black dark:text-white">
                    {user.name}
                </p>
                <p className="font-mono text-xs text-darkGrey dark:text-lightGrey">
                    {user.email}
                </p>
            </div>
        </button>
    );
}
