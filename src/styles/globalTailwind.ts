const input =
    'border dark:bg-gray-700 text-black-900 dark:text-white-100 focus:outline-none rounded-xl p-4 w-full';
export const inputStyles = {
    default: `${input} border-gray-300 dark:border-primary-500/40`,
    editing: `${input} border-2 border-dashed border-gray-700 dark:border-gray-300 focus:border-primary-500`,
    error: `${input} border-error-500 dark:border-opacity-40`,
};
