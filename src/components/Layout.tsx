import React from "react";
import { Menu } from ".";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row min-h-screen min-w-screen">
          <Menu />
          <div className="flex flex-row justify-center items-center w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
