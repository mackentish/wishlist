import React from "react";
import { Check } from ".";

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export function Checkbox({ checked, onClick }: CheckboxProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
        e.stopPropagation();
      }}
      className={`p-1 border border-slate-950 rounded-full ${
        checked ? "bg-blue-500" : "bg-gray-100"
      }`}
      role="checkbox"
      aria-checked={checked}
    >
      <Check stroke={checked ? "slate-50" : "bg-gray-100"} />
    </button>
  );
}
