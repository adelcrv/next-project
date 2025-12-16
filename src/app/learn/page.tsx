/** @format */

"use client";

// Force dynamic rendering to avoid prerender issues with Supabase
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLearningSession } from "@/hooks/useLearningSession";
import { LearningContainer } from "@/components/learning/LearningContainer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";

function LearnPageContent() {
  const searchParams = useSearchParams();
  const book = Number(searchParams.get("book")) || 1;
  const unit = Number(searchParams.get("unit")) || 1;

  const {
    currentCard,
    currentIndex,
    totalCards,
    loading,
    sessionComplete,
    submitGrade,
    stats,
    reload,
  } = useLearningSession({ book, unit });

  const progress = totalCards > 0 ? (currentIndex / totalCards) * 100 : 0;

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-[80vh] space-y-4'>
        <Loader2 className='w-12 h-12 text-blue-500 animate-spin' />
        <p className='text-neutral-500'>
          Preparing your personalized session...
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full max-h-[80vh] justify-between py-6'>
      {/* Header */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center px-2'>
          <span className='text-sm font-medium text-neutral-500'>
            Session Progress
          </span>
          <span className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
            {Math.min(currentIndex + 1, totalCards)} / {totalCards}
          </span>
        </div>
        <div className='h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden'>
          <motion.div
            className='h-full bg-blue-600 rounded-full'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center my-8'>
        <AnimatePresence mode='wait'>
          {!sessionComplete && currentCard ? (
            <div
              key={currentCard.id + currentCard.exerciseType}
              className='w-full'>
              {/* Key includes exerciseType so Switching from Preview to Quiz for same ID triggers animation */}
              <LearningContainer card={currentCard} onSubmit={submitGrade} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center space-y-8 max-w-md mx-auto'>
              <div className='space-y-4'>
                <div className='w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-full flex items-center justify-center mx-auto animate-bounce'>
                  <Trophy size={48} strokeWidth={2} />
                </div>
                <div>
                  <h2 className='text-3xl font-bold text-neutral-900 dark:text-neutral-50'>
                    Great Job!
                  </h2>
                  <p className='text-neutral-500 dark:text-neutral-400'>
                    You&apos;ve completed your session.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800'>
                  <p className='text-sm text-green-600 dark:text-green-400 font-medium'>
                    Accuracy
                  </p>
                  <p className='text-2xl font-bold text-green-700 dark:text-green-300'>
                    {stats.correct + stats.incorrect > 0
                      ? Math.round(
                          (stats.correct / (stats.correct + stats.incorrect)) *
                            100
                        )
                      : 100}
                    %
                  </p>
                </div>
                <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800'>
                  <p className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                    Learned
                  </p>
                  <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                    {stats.learned} Words
                  </p>
                </div>
              </div>

              <div className='flex flex-col space-y-3'>
                <button
                  onClick={reload}
                  className='w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2'>
                  <RefreshCw size={20} />
                  <span>Start Next Session</span>
                </button>

                <Link href='/' className='w-full'>
                  <button className='w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 px-8 py-3 rounded-xl font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center space-x-2'>
                    <span>Back to Home</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center h-[80vh] space-y-4'>
          <Loader2 className='w-12 h-12 text-blue-500 animate-spin' />
          <p className='text-neutral-500'>Loading...</p>
        </div>
      }>
      <LearnPageContent />
    </Suspense>
  );
}
