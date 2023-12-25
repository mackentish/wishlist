import React from "react";
import Link from "next/link";
import { Sparkle, Plus, People, primaryBtnClass } from ".";
import { Pages } from "@/types";

export function Menu() {
  const currentPage = window.location.pathname;
  const selectedStyle = "bg-blue-600";

  return (
    <ul className="flex flex-col gap-4 p-4 h-screen min-w-fit bg-blue-100">
      <li>
        <Link
          href={Pages.Home}
          className={`${primaryBtnClass} ${
            currentPage === Pages.Home ? selectedStyle : ""
          }`}
        >
          <p className="font-mono">My Lists</p>
          <Sparkle />
        </Link>
      </li>

      <li>
        <Link
          href={Pages.CreateLists}
          className={`${primaryBtnClass} ${
            currentPage === Pages.CreateLists ? selectedStyle : ""
          }`}
        >
          <p className="font-mono">Create List</p>
          <Plus />
        </Link>
      </li>

      <li>
        <Link
          href={Pages.SharedLists}
          className={`${primaryBtnClass} ${
            currentPage === Pages.SharedLists ? selectedStyle : ""
          }`}
        >
          <p className="font-mono">Shared Lists</p>
          <People />
        </Link>
      </li>
    </ul>
  );
}
