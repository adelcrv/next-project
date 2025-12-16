/** @format */

"use client";

import { useState } from "react";
import { WordData } from "@/lib/learning/types";

const MOCK_WORDS: WordData[] = [
  {
    id: "1",
    word: "appreciate",
    phonetic: "/əˈpriːʃieɪt/",
    part_of_speech: "v.",
    definition: "To understand its good qualities.",
    example: "I can appreciate the lovely scenery.",
  },
  {
    id: "2",
    word: "available",
    phonetic: "/əˈveɪləbl/",
    part_of_speech: "adj.",
    definition: "If something is available, it means you can get it.",
    example: "There were many seats available in the room.",
  },
  {
    id: "3",
    word: "beat",
    phonetic: "/biːt/",
    part_of_speech: "v.",
    definition: "To do better than someone else.",
    example: "I managed to beat everyone in the race.",
  },
];

export function useVocabulary() {
  const [sessionWords] = useState<WordData[]>(MOCK_WORDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, "known" | "learning">>(
    {}
  );

  const currentWord = sessionWords[currentIndex];
  const isComplete = currentIndex >= sessionWords.length;

  const handleResult = (result: "known" | "learning") => {
    if (!currentWord) return;

    setResults((prev) => ({ ...prev, [currentWord.id]: result }));

    // Simple progression for now
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300); // Wait for animation
  };

  return {
    currentWord,
    currentIndex,
    totalWords: sessionWords.length,
    isComplete,
    handleResult,
    results,
  };
}
