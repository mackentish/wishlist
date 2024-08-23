import React from 'react';

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    disabled?: boolean;
    error?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
    type,
    placeholder,
    value,
    disabled = false,
    error = false,
    onChange,
}: InputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={[
                'w-full px-4 py-5 border rounded-xl bg-gray100 dark:bg-gray900 focus:outline-none disabled:cursor-not-allowed',
                error ? 'border-error' : 'border-primary',
            ].join(' ')}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
}
