import React from 'react';
import { Check } from '.';

interface CheckboxProps {
    checked: boolean;
    onClick?: () => void;
}

export function Checkbox({ checked, onClick }: CheckboxProps) {
    return (
        <button
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                    e.stopPropagation();
                }
            }}
            className={`p-1 border border-black dark:border-lightGrey rounded-full ${
                checked ? 'bg-primary' : 'bg-lightGrey dark:bg-darkGrey'
            }`}
            role="checkbox"
            aria-checked={checked}
        >
            <Check
                style={
                    checked
                        ? 'stroke-white'
                        : 'stroke-lightGrey dark:stroke-darkGrey'
                }
            />
        </button>
    );
}
