/** @format */

"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Volume2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { WordData } from "@/lib/learning/types";

interface FlashCardProps {
  data: WordData;
  onResult: (result: "known" | "learning") => void;
}

export function FlashCard({ data, onResult }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Swipe logic
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      onResult("known");
    } else if (info.offset.x < -100) {
      onResult("learning");
    }
  };

  return (
    <div className='relative w-full h-[400px] perspective-1000'>
      <motion.div
        drag='x'
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        className='w-full h-full cursor-grab active:cursor-grabbing'>
        <div
          className={cn(
            "w-full h-full relative preserve-3d transition-all duration-500",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={() => setIsFlipped(!isFlipped)}>
          {/* Front Side */}
          <div className='absolute inset-0 backface-hidden bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col items-center justify-center text-center space-y-6'>
            <span className='px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full text-xs font-medium uppercase tracking-wider'>
              {data.part_of_speech}
            </span>

            <div className='space-y-2'>
              <h2 className='text-4xl font-bold text-neutral-900 dark:text-neutral-50'>
                {data.word}
              </h2>
              <p className='text-neutral-400 font-mono text-lg'>
                {data.phonetic}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Play audio logic here
              }}
              title='Play pronunciation'
              aria-label='Play pronunciation'
              className='p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'>
              <Volume2 size={24} />
            </button>

            <p className='text-sm text-neutral-400 absolute bottom-8'>
              Tap to flip
            </p>
          </div>

          {/* Back Side */}
          <div className='absolute inset-0 backface-hidden rotate-y-180 bg-blue-50 dark:bg-neutral-800 rounded-3xl shadow-xl border-2 border-blue-100 dark:border-blue-900 p-6 flex flex-col overflow-y-auto text-center space-y-4 no-scrollbar'>
            {/* EN Definition */}
            <div className='space-y-1'>
              <h3 className='text-xs font-bold text-neutral-400 uppercase tracking-widest'>
                English
              </h3>
              <p className='text-base text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed'>
                {data.definition}
              </p>
            </div>

            {/* Arabic */}
            {data.arabic_translation && (
              <div
                className='space-y-1 w-full pt-2 border-t border-blue-100 dark:border-neutral-700'
                dir='rtl'>
                <h3 className='text-xs font-bold text-neutral-400 uppercase tracking-widest text-left'>
                  Arabic
                </h3>
                <p className='text-xl text-emerald-600 dark:text-emerald-400 font-bold'>
                  {data.arabic_translation}
                </p>
              </div>
            )}

            {/* Extra Meanings */}
            {data.extra_meanings && data.extra_meanings.length > 0 && (
              <div className='space-y-2 w-full pt-2 border-t border-blue-100 dark:border-neutral-700'>
                <h3 className='text-xs font-bold text-neutral-400 uppercase tracking-widest text-left'>
                  Also Means
                </h3>
                <div className='grid gap-2 text-right' dir='rtl'>
                  {data.extra_meanings.map((extra, idx) => (
                    <div
                      key={idx}
                      className='bg-white/50 dark:bg-black/20 p-2 rounded'>
                      <span className='font-bold text-sm text-neutral-700 dark:text-neutral-300'>
                        {extra.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example */}
            <div className='space-y-1 w-full pt-2 border-t border-blue-100 dark:border-neutral-700'>
              <h3 className='text-xs font-bold text-neutral-400 uppercase tracking-widest text-left'>
                Example
              </h3>
              <p className='text-sm text-neutral-600 dark:text-neutral-400 text-left italic bg-white/60 dark:bg-black/20 p-3 rounded-lg'>
                &quot;{data.example}&quot;
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Swipe Indicators (Visual only, behind card) */}
      <div className='absolute top-1/2 left-4 -translate-y-1/2 -z-10'>
        <div className='bg-red-100 text-red-500 p-4 rounded-full'>
          <X size={32} />
        </div>
      </div>
      <div className='absolute top-1/2 right-4 -translate-y-1/2 -z-10'>
        <div className='bg-green-100 text-green-500 p-4 rounded-full'>
          <Check size={32} />
        </div>
      </div>
    </div>
  );
}
