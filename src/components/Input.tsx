import React, { InputHTMLAttributes } from "react";

export function Input({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border border-slate-950 text-slate-950 rounded p-2 w-full ${props.className}`}
    />
  );
}
