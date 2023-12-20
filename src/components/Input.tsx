import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

export function Input({ isError = false, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`font-mono border ${
        isError ? "border-red-500" : "border-slate-950"
      } text-slate-950 rounded p-2 w-full ${props.className}`}
    />
  );
}
