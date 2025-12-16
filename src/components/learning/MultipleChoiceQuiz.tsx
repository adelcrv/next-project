/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LearningCard } from "@/lib/learning/types";
import { supabase } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface MultipleChoiceQuizProps {
  card: LearningCard;
  onResult: (result: "known" | "learning") => void;
}

export const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  card,
  onResult,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistractors = async () => {
      setLoading(true);
      // Fetch 3 random words that are NOT this word
      // Note: 'random' in SQL is hard, so we just fetch a batch and pick randoms
      const { data } = await supabase
        .from("words")
        .select("definition")
        .neq("id", card.id)
        .limit(20); // fetch a pool

      if (data) {
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const distractors = shuffled.map((d: any) => d.definition);
        const allOptions = [...distractors, card.definition].sort(
          () => 0.5 - Math.random()
        );
        setOptions(allOptions);
      }
      setLoading(false);
    };

    fetchDistractors();
  }, [card.id, card.definition]);

  const handleSelect = (option: string) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option);
    const correct = option === card.definition;

    setTimeout(() => {
      onResult(correct ? "known" : "learning");
    }, 1500); // Wait 1.5s to show result
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='max-w-md w-full mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-8 space-y-8'>
      <div className='text-center space-y-4'>
        <h3 className='text-sm font-bold text-blue-500 uppercase tracking-widest'>
          Quit: What does this mean?
        </h3>
        <h2 className='text-4xl font-extrabold text-neutral-900 dark:text-white'>
          {card.word}
        </h2>
      </div>

      {loading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='animate-spin text-blue-500' size={32} />
        </div>
      ) : (
        <div className='space-y-3'>
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isTarget = option === card.definition;

            // Visual State Logic
            let btnClass =
              "border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
            let icon = null;

            if (selectedOption) {
              if (isTarget) {
                btnClass =
                  "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                icon = <CheckCircle size={20} />;
              } else if (isSelected) {
                btnClass =
                  "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                icon = <XCircle size={20} />;
              } else {
                btnClass = "opacity-50 border-neutral-200";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={!!selectedOption}
                className={`w-full p-4 text-left rounded-xl border-2 font-medium transition-all flex items-center justify-between ${btnClass}`}>
                <span className='line-clamp-2 text-sm'>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
