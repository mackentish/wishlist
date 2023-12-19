import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  btnType?: "primary" | "secondary";
}

const defaultClass =
  "flex flex-row gap-2 justify-center text-white font-bold py-2 px-4 rounded w-full";
export const primaryBtnClass = `bg-blue-500 hover:bg-blue-600 ${defaultClass}`;
export const secondaryBtnClass = `text-blue-500 border border-blue-500 hover:border-blue-600 hover:text-blue-600 ${defaultClass}`;

export function Button({
  children,
  onClick,
  btnType = "primary",
}: ButtonProps) {
  let selectedClassName = "";
  switch (btnType) {
    case "primary":
      selectedClassName = primaryBtnClass;
      break;
    case "secondary":
      selectedClassName = secondaryBtnClass;
      break;
    default:
      selectedClassName = primaryBtnClass;
      break;
  }

  return (
    <button onClick={onClick} className={selectedClassName}>
      {children}
    </button>
  );
}
