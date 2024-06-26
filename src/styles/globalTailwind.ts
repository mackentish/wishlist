const input =
    'border dark:bg-darkGrey text-black dark:text-white dark:placeholder:text-lightGrey rounded p-2 w-full';
export const inputStyles = {
    default: `${input} border-lightGrey dark:border-primary/40`,
    editing: `${input} border-dashed border-lightGrey dark:border-primary/40`,
    error: `${input} border-error dark:border-opacity-40`,
};
