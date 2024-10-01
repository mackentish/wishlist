import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    btnType?: 'primary' | 'secondary' | 'danger';
    styles?: string;
    disabled?: boolean;
}

const sharedStyles =
    'flex flex-row gap-2 justify-center font-bold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed w-full transition-colors duration-200';
export const primaryBtnClass = `text-white-100 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 ${sharedStyles}`;
export const secondaryBtnClass = `text-primary-500 border-2 border-primary-500 hover:border-primary-600 disabled:border-primary-500 hover:text-primary-600 disabled:text-primary-500 ${sharedStyles}`;
export const dangerBtnClass = `text-error-500 border-2 border-error-500/40 hover:text-error-600 disabled:text-error-500 hover:border-error-600/40 disabled:border-error-500/40 ${sharedStyles}`;

export function Button({
    btnType = 'primary',
    styles = '',
    ...props
}: ButtonProps) {
    let selectedClassName = '';
    switch (btnType) {
        case 'primary':
            selectedClassName = primaryBtnClass;
            break;
        case 'secondary':
            selectedClassName = secondaryBtnClass;
            break;
        case 'danger':
            selectedClassName = dangerBtnClass;
            break;
        default:
            selectedClassName = primaryBtnClass;
            break;
    }

    return (
        <button className={`${selectedClassName} ${styles}`} {...props}>
            {props.children}
        </button>
    );
}
