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
            className={`p-1 border border-black dark:border-gray300 rounded-full ${
                checked ? 'bg-primary' : 'bg-gray300 dark:bg-gray700'
            }`}
            role="checkbox"
            aria-checked={checked}
        >
            <Check
                style={
                    checked
                        ? 'stroke-white'
                        : 'stroke-gray300 dark:stroke-gray700'
                }
            />
        </button>
    );
}
