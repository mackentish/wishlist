const input =
    'border dark:bg-gray700 text-black dark:text-white focus:outline-none rounded-xl p-4 w-full';
export const inputStyles = {
    default: `${input} border-gray300 dark:border-primary/40`,
    editing: `${input} border-2 border-dashed border-gray700 dark:border-gray300 focus:border-primary`,
    error: `${input} border-error dark:border-opacity-40`,
};
