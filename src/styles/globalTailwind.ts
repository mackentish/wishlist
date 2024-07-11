const input =
    'border dark:bg-gray700 text-black dark:text-white dark:placeholder:text-gray300 rounded p-2 w-full';
export const inputStyles = {
    default: `${input} border-gray300 dark:border-primary/40`,
    editing: `${input} border-dashed border-gray300 dark:border-primary/40`,
    error: `${input} border-error dark:border-opacity-40`,
};
