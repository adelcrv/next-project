/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Learn", icon: BookOpen, href: "/learn" },
  { label: "Review", icon: Layers, href: "/review" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 pb-safe'>
      <div className='flex items-center justify-around h-16'>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}>
              {isActive && (
                <motion.div
                  layoutId='nav-pill'
                  className='absolute -top-px w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-b-full'
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className='text-[10px] font-medium'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
