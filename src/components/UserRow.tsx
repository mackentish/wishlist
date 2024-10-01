import { ShareUser } from '@/types';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';
import { Person } from './icons';

interface UserRowProps {
    user: ShareUser;
    isChecked: boolean;
    toggleUser: (user: ShareUser) => void;
}

export function UserRow({ user, isChecked, toggleUser }: UserRowProps) {
    return (
        <button
            onClick={() => {
                toggleUser(user);
            }}
            className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black-900 dark:border-white-100"
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
