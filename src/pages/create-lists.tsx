import React from "react";
import { useHello } from "@/hooks";

export default function CreateLists() {
  const { data: test } = useHello();

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="flex flex-col gap-8 items-center w-full max-w-3xl">
        <p className="font-mono font-bold text-3xl">Create Lists</p>
      </div>
    </div>
  );
}
