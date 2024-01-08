import React from "react";

interface CheckProps {
  stroke?: string;
}

export function Check({ stroke = "slate-50" }: CheckProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={`w-4 h-4 stroke-${stroke} stroke-[4px]`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}
