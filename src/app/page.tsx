/** @format */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, TrendingUp, Clock, ChevronDown, Book } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  // Selection state
  const [selectedBook, setSelectedBook] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(1);

  // Available options (10 units per book)
  const books = [1, 2, 3, 4];
  const units = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Mock data for initial UI
  const progress = {
    dailyGoal: 10,
    learnedToday: 3,
    streak: 5,
    totalMastered: 142,
  };

  return (
    <div className='space-y-8 pb-8'>
      {/* Header Section */}
      <header className='pt-4 space-y-2'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50'>
              Good Morning,
            </h1>
            <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
              Ready to learn some English?
            </p>
          </div>
          <div className='flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-sm font-bold'>
            <span className='text-lg'>🔥</span>
            <span>{progress.streak}</span>
          </div>
        </motion.div>
      </header>

      {/* Main Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}>
        <div className='bg-blue-600 dark:bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group cursor-pointer hover:bg-blue-700 transition-colors'>
          {/* Background Pattern */}
          <div className='absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all' />

          <div className='relative z-10 space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold'>Daily Session</h2>
              <p className='text-blue-100 text-sm opacity-90'>
                {progress.dailyGoal - progress.learnedToday} more words to reach
                your goal
              </p>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex -space-x-2'>
                <div className='w-2 h-2 rounded-full bg-white/50' />
                <div className='w-2 h-2 rounded-full bg-white/50' />
                <div className='w-2 h-2 rounded-full bg-white/50' />
              </div>
              <Link href={`/learn?book=${selectedBook}&unit=${selectedUnit}`}>
                <button className='bg-white text-blue-600 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center space-x-2'>
                  <Play size={16} fill='currentColor' />
                  <span>Start Learning</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Progress Bar Background */}
          <div className='absolute bottom-0 left-0 h-1.5 bg-black/20 w-full'>
            <div
              className='h-full bg-white/50'
              style={{
                width: `${(progress.learnedToday / progress.dailyGoal) * 100}%`,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Book & Unit Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm'>
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
            <Book size={20} />
          </div>
          <div>
            <h3 className='font-bold text-neutral-900 dark:text-neutral-100'>
              Select Content
            </h3>
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>
              Choose a book and unit to study
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {/* Book Selector */}
          <div className='relative'>
            <label className='text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block'>
              Book
            </label>
            <div className='relative'>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(Number(e.target.value))}
                aria-label='Select book number'
                className='w-full appearance-none bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 pr-10 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'>
                {books.map((book) => (
                  <option key={book} value={book}>
                    Book {book}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none' />
            </div>
          </div>

          {/* Unit Selector */}
          <div className='relative'>
            <label className='text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block'>
              Unit
            </label>
            <div className='relative'>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                aria-label='Select unit number'
                className='w-full appearance-none bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 pr-10 text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    Unit {unit}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none' />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 gap-4'>
        <StatsCard
          icon={TrendingUp}
          label='Mastered'
          value={progress.totalMastered}
          color='text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
          delay={0.2}
        />
        <StatsCard
          icon={Clock}
          label='Time Spent'
          value='12m'
          color='text-purple-500 bg-purple-50 dark:bg-purple-900/20'
          delay={0.3}
        />
      </div>

      {/* Recent Activity / Next Up */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='space-y-4'>
        <div className='flex justify-between items-end px-1'>
          <h3 className='font-bold text-lg text-neutral-900 dark:text-neutral-100'>
            Recommended
          </h3>
          <Link
            href='/review'
            className='text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline'>
            View all
          </Link>
        </div>

        <div className='space-y-3'>
          {[1, 2, 3].map((unitNum) => (
            <Link
              key={unitNum}
              href={`/learn?book=1&unit=${unitNum}`}
              className='bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg font-serif font-bold text-neutral-700 dark:text-neutral-300'>
                  {["A", "B", "C"][unitNum - 1]}
                </div>
                <div>
                  <h4 className='font-bold text-neutral-900 dark:text-neutral-100'>
                    Unit {unitNum}: Daily Life
                  </h4>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                    20 words • Beginner
                  </p>
                </div>
              </div>
              <div className='h-8 w-8 rounded-full border-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors'>
                <Play size={14} fill='currentColor' className='ml-0.5' />
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  delay: number;
}

function StatsCard({ icon: Icon, label, value, color, delay }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className='bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-32'>
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
          color
        )}>
        <Icon size={20} />
      </div>
      <div>
        <div className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>
          {value}
        </div>
        <div className='text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'>
          {label}
        </div>
      </div>
    </motion.div>
  );
}
