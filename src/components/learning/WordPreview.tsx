/** @format */

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Volume2, ArrowRight, BookOpen } from "lucide-react";
import { LearningCard } from "@/lib/learning/types";

interface WordPreviewProps {
  card: LearningCard;
  onNext: () => void;
}

export const WordPreview: React.FC<WordPreviewProps> = ({ card, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='max-w-md w-full mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800'>
      {/* Visual Context (Image Placeholder) */}
      <div className='h-48 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center relative'>
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.word}
            fill
            className='object-cover'
          />
        ) : (
          <BookOpen className='w-16 h-16 text-blue-200 dark:text-blue-800' />
        )}
        <div className='absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider'>
          New Word
        </div>
      </div>

      <div className='p-8 space-y-6'>
        {/* Header: Word & Phonetic */}
        <div className='text-center space-y-2'>
          <h2 className='text-4xl font-extrabold text-neutral-900 dark:text-white'>
            {card.word}
          </h2>
          <div className='flex items-center justify-center space-x-2 text-neutral-500'>
            <span className='font-mono text-lg'>{card.phonetic}</span>
            <button
              aria-label='Play pronunciation'
              className='p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors'>
              <Volume2 size={20} />
            </button>
          </div>
          {card.part_of_speech && (
            <span className='inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm rounded-lg font-medium'>
              {card.part_of_speech}
            </span>
          )}
        </div>

        {/* Core Content: Definition & Example */}
        <div className='space-y-4'>
          {/* Primary Definition */}
          <div className='space-y-1'>
            <h3 className='text-sm font-semibold text-neutral-400 uppercase tracking-wide'>
              Definition
            </h3>
            <p className='text-lg text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed'>
              {card.definition}
            </p>
          </div>

          {/* Arabic Primary */}
          {card.arabic_translation && (
            <div className='space-y-1 text-right' dir='rtl'>
              <h3 className='text-sm font-semibold text-neutral-400 uppercase tracking-wide text-left'>
                Arabic
              </h3>
              <p className='text-2xl text-emerald-600 dark:text-emerald-400 font-bold'>
                {card.arabic_translation}
              </p>
              {card.arabic_definition && (
                <p className='text-neutral-600 dark:text-neutral-400'>
                  {card.arabic_definition}
                </p>
              )}
            </div>
          )}

          {/* Extra Meanings */}
          {card.extra_meanings && card.extra_meanings.length > 0 && (
            <div className='space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800'>
              <h3 className='text-sm font-semibold text-neutral-400 uppercase tracking-wide'>
                Also Means
              </h3>
              <div className='grid gap-2'>
                {card.extra_meanings.map((extra, idx) => (
                  <div
                    key={idx}
                    className='bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg text-sm text-right'
                    dir='rtl'>
                    <span className='font-bold text-neutral-800 dark:text-neutral-200'>
                      {extra.meaning}
                    </span>
                    {extra.example && (
                      <p className='text-neutral-500 dark:text-neutral-500 text-xs mt-1'>
                        &quot;{extra.example}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.example_sentence && (
            <div className='space-y-1 pt-2'>
              <h3 className='text-sm font-semibold text-neutral-400 uppercase tracking-wide'>
                Example
              </h3>
              <p className='text-neutral-600 dark:text-neutral-400 italic'>
                &quot;{card.example_sentence}&quot;
              </p>
              {card.arabic_example && (
                <p
                  className='text-neutral-500 dark:text-neutral-500 italic text-right text-sm'
                  dir='rtl'>
                  {card.arabic_example}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onNext}
          className='w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2'>
          <span>I&apos;m Ready to Quiz</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};
