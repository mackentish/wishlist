import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  btnType?: "primary" | "secondary";
  styles?: string;
}

const sharedStyles =
  "flex flex-row gap-2 justify-center font-bold py-2 px-4 rounded w-full";
export const primaryBtnClass = `text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 ${sharedStyles}`;
export const secondaryBtnClass = `text-blue-500 border border-blue-500 hover:border-blue-600 hover:text-blue-600 disabled:text-gray-600 disabled:border-gray-600 ${sharedStyles}`;

export function Button({
  btnType = "primary",
  styles = "",
  ...props
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
    <button className={`${selectedClassName} ${styles}`} {...props}>
      {props.children}
    </button>
  );
}
