import { ShareGroup } from '@/types';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';
import { Friends } from './icons';

interface ShareGroupRowProps {
    group: ShareGroup;
    isChecked: boolean;
    toggleGroup: (group: ShareGroup) => void;
}

export function ShareGroupRow({
    group,
    isChecked,
    toggleGroup,
}: ShareGroupRowProps) {
    return (
        <button
            onClick={() => {
                toggleGroup(group);
            }}
            className="flex flex-row justify-between items-center w-full p-4 border rounded-xl border-black dark:border-white"
        >
            <div className="flex flex-row gap-4 items-center">
                <Checkbox checked={isChecked} />
                <div className="flex flex-col items-start">
                    <Typography type="p" classOverride="text-sm">
                        {group.name}
                    </Typography>
                    <Typography type="p" classOverride="text-xs">
                        {group.description}
                    </Typography>
                </div>
            </div>

            <Friends />
        </button>
    );
}
