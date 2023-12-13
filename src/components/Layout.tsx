import React from "react";
import { Menu } from ".";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Menu />
        <div className="flex flex-row justify-center items-center w-full">
          {children}{" "}
        </div>
      </body>
    </html>
  );
}
