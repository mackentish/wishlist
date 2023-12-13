import React from "react";

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export function Checkbox({ checked, onClick }: CheckboxProps) {
  return (
    <button onClick={onClick} className="flex items-center">
      <input
        checked={checked}
        readOnly
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
      />
    </button>
  );
}
