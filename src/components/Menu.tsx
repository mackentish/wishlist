import React from "react";
import Link from "next/link";
import { Sparkle, Plus, People, primaryBtnClass } from ".";

export function Menu() {
  return (
    <ul className="flex flex-col gap-4 p-4 h-screen min-w-fit bg-blue-100">
      <li>
        <Link href="/my-lists" className={primaryBtnClass}>
          My Lists <Sparkle />
        </Link>
      </li>

      <li>
        <Link href="create-lists" className={primaryBtnClass}>
          Create List <Plus />
        </Link>
      </li>

      <li>
        <Link href="shared-lists" className={primaryBtnClass}>
          Shared Lists <People />
        </Link>
      </li>
    </ul>
  );
}
