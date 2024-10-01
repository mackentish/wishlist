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
            className={`p-1 border border-black-900 dark:border-gray-300 rounded-full ${
                checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
            }`}
            role="checkbox"
            aria-checked={checked}
        >
            <Check
                style={
                    checked
                        ? 'stroke-white-100'
                        : 'stroke-gray-300 dark:stroke-gray-700'
                }
            />
        </button>
    );
}
