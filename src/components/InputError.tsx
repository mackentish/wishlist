import React from 'react';

interface InputErrorProps {
    message: string;
}

export function InputError({ message }: InputErrorProps) {
    return <p className="text-error-500 text-xs">{message}</p>;
}
