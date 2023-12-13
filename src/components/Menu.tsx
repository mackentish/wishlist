import React from "react";
import Link from "next/link";
import { Sparkle, Plus, People } from ".";

export function Menu() {
  const btnClass =
    "flex gap-2 bg-sky-600 hover:bg-sky-700 text-slate-50 font-bold py-2 px-4 rounded";

  return (
    <ul className="flex flex-col gap-4 p-4 h-screen min-w-fit bg-gray-600">
      <li>
        <Link href="/MyLists" className={btnClass}>
          My Lists <Sparkle />
        </Link>
      </li>

      <li>
        <Link href="CreateLists" className={btnClass}>
          Create List <Plus />
        </Link>
      </li>

      <li>
        <Link href="SharedLists" className={btnClass}>
          Shared Lists <People />
        </Link>
      </li>
    </ul>
  );
}
