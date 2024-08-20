import React from 'react';

interface InputErrorProps {
    message: string;
}

export function InputError({ message }: InputErrorProps) {
    return <p className="text-error text-xs">{message}</p>;
}
