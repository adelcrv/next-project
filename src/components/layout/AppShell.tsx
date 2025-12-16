/** @format */

"use client";

import { BottomNav } from "@/components/ui/BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className='min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50'>
      <main className='flex-1 pb-20 container max-w-md mx-auto px-4 pt-4'>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
