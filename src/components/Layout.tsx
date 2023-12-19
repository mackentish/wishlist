import React from "react";
import { Menu } from ".";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-row min-h-screen min-w-screen">
      <Menu />
      <div className="flex flex-row justify-center items-center w-full">
        {children}
      </div>
    </main>
  );
}
