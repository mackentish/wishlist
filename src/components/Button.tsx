import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    btnType?: 'primary' | 'secondary' | 'danger';
    styles?: string;
    disabled?: boolean;
}

const sharedStyles =
    'flex flex-row gap-2 justify-center font-bold py-2 px-4 rounded w-full font-mono transition-colors duration-200';
export const primaryBtnClass = `text-white bg-primary hover:bg-primaryHover disabled:bg-lightGrey ${sharedStyles}`;
export const secondaryBtnClass = `text-primary border border-primary/40 hover:border-primaryHover hover:text-primaryHover disabled:text-lightGrey disabled:border-lightGrey ${sharedStyles}`;
export const dangerBtnClass = `text-error border border-error/40 hover:text-errorHover hover:border-errorHover/40 disabled:border-lightGrey disabled:text-lightGrey ${sharedStyles}`;

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
