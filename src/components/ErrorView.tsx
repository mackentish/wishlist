import React from "react";

export function ErrorView() {
  return (
    <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
      <p className="font-mono text-xl text-black dark:text-white">
        Something went wrong. Please try again later 😞
      </p>
    </div>
  );
}
