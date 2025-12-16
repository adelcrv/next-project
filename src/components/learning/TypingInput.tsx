/** @format */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LearningCard } from "@/lib/learning/types";
import { CheckCircle, XCircle } from "lucide-react";

interface TypingInputProps {
  card: LearningCard;
  onResult: (result: "known" | "learning") => void;
}

export const TypingInput: React.FC<TypingInputProps> = ({ card, onResult }) => {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(
    "idle"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const checkAnswer = () => {
    const cleanInput = input.trim().toLowerCase();
    const cleanTarget = card.word.trim().toLowerCase();

    // Simple strict match for now, can add Levenshtein later
    if (cleanInput === cleanTarget) {
      setStatus("correct");
      setTimeout(() => onResult("known"), 1500);
    } else {
      setStatus("incorrect");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && status !== "correct") {
      checkAnswer();
    }
  };

  const giveUp = () => {
    setStatus("incorrect");
    // Show correct answer then move on as 'learning' (fail)
    setTimeout(() => onResult("learning"), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='max-w-md w-full mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-8 space-y-8'>
      <div className='text-center space-y-4'>
        <h3 className='text-sm font-bold text-blue-500 uppercase tracking-widest'>
          Type the word for:
        </h3>
        <p className='text-xl font-medium text-neutral-700 dark:text-neutral-300'>
          &quot;{card.definition}&quot;
        </p>
      </div>

      <div className='space-y-4'>
        <div className='relative'>
          <input
            ref={inputRef}
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "correct"}
            placeholder='Type your answer...'
            className={`w-full p-4 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${
              status === "idle"
                ? "border-neutral-200 focus:border-blue-500 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700"
                : status === "correct"
                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          />
          {status === "correct" && (
            <CheckCircle className='absolute right-4 top-1/2 -translate-y-1/2 text-green-500' />
          )}
          {status === "incorrect" && (
            <XCircle className='absolute right-4 top-1/2 -translate-y-1/2 text-red-500' />
          )}
        </div>

        {status === "incorrect" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className='text-center text-red-500 font-medium'>
            Incorrect. Try again or give up.
          </motion.div>
        )}

        {status === "incorrect" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <span className='text-sm text-neutral-500 block mb-1'>Answer:</span>
            <span className='text-xl font-bold text-neutral-900 dark:text-white'>
              {card.word}
            </span>
          </motion.div>
        )}
      </div>

      <div className='flex space-x-3'>
        <button
          onClick={giveUp}
          disabled={status === "correct"}
          className='flex-1 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-xl font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'>
          Don&apos;t Know
        </button>
        <button
          onClick={checkAnswer}
          disabled={status === "correct" || !input}
          className='flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20'>
          Check
        </button>
      </div>
    </motion.div>
  );
};
