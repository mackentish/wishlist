import React from "react";

interface InputErrorProps {
  message: string;
}

export function InputError({ message }: InputErrorProps) {
  return <span className="text-red-500 text-xs font-mono">{message}</span>;
}
