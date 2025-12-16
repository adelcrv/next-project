/** @format */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client"; // Use singleton
import { calculateSM2 } from "@/lib/learning/sm2";
import {
  WordProgress,
  ReviewGrade,
  Word,
  LearningCard,
  SessionType,
  ExerciseType,
} from "@/lib/learning/types";
import { Database } from "@/lib/supabase/types";
type UserProgressInsert =
  Database["public"]["Tables"]["user_progress"]["Insert"];

interface SessionOptions {
  type?: SessionType;
  book?: number;
  unit?: number;
}

export function useLearningSession(options: SessionOptions = {}) {
  const { type = "smart", book = 1, unit = 1 } = options;

  const [queue, setQueue] = useState<LearningCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, learned: 0 });

  const loadSession = useCallback(async () => {
    setLoading(true);
    setSessionComplete(false);
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0, learned: 0 });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // --- GUEST MODE ---
      if (!user) {
        console.log(`Guest mode: Loading words for Book ${book}, Unit ${unit}`);
        const { data: newWords } = await supabase
          .from("words")
          .select("*")
          .eq("book_number", book)
          .eq("unit_number", unit)
          .order("id", { ascending: true });

        if (newWords) {
          const newCards: LearningCard[] = [];
          newWords.forEach((w) => {
            // Core Pedagogy: New Word -> Preview then Quiz
            newCards.push({
              ...(w as Word),
              isNew: true,
              exerciseType: "preview",
            });
            newCards.push({
              ...(w as Word),
              isNew: true,
              exerciseType: "recognition",
            });
          });
          setQueue(newCards);
          setSessionComplete(newCards.length === 0);
        }
        return;
      }
      // -------------------------------

      const newQueue: LearningCard[] = [];

      // 1. Fetch Due Reviews
      if (type === "review" || type === "smart") {
        type UserProgressWithWord = WordProgress & { words: Word | null };

        const { data: reviews } = await supabase
          .from("user_progress")
          .select("*, words(*)")
          .eq("user_id", user.id)
          .lte("next_review_at", new Date().toISOString())
          .limit(20)
          .returns<UserProgressWithWord[]>();

        if (reviews) {
          reviews.forEach((r) => {
            if (!r.words) return;
            const wordData = r.words;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { words, ...progress } = r;

            // Logic: High familiarity -> Production (Type it), Med -> Recall (Flashcard), Low -> Recognition (Quiz)
            let exerciseType: ExerciseType = "recognition";
            if (progress.familiarity_level >= 5) {
              exerciseType = "production";
            } else if (progress.familiarity_level >= 2) {
              exerciseType = "recall";
            }

            newQueue.push({
              ...wordData,
              progress: progress as WordProgress,
              isNew: false,
              exerciseType,
            });
          });
        }
      }

      // 2. Fetch New Words if needed
      if (
        (type === "learn" || (type === "smart" && newQueue.length < 5)) &&
        newQueue.length < 20
      ) {
        // Fetch words for the specified book and unit
        const query = supabase
          .from("words")
          .select("*")
          .eq("book_number", book)
          .eq("unit_number", unit)
          .order("id", { ascending: true });

        const { data: newWords } = await query;

        if (newWords) {
          newWords.forEach((w) => {
            // Core Pedagogy: New Word -> Preview then Quiz
            newQueue.push({
              ...(w as Word),
              isNew: true,
              exerciseType: "preview",
            });
            newQueue.push({
              ...(w as Word),
              isNew: true,
              exerciseType: "recognition",
            });
          });
        }
      }

      setQueue(newQueue);
      setSessionComplete(newQueue.length === 0);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  }, [type, book, unit]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const submitGrade = async (grade: ReviewGrade) => {
    const currentCard = queue[currentIndex];
    if (!currentCard) return;

    // --- PREVIEW HANDLING ---
    // If it's a preview, just advance.
    if (currentCard.exerciseType === "preview") {
      if (currentIndex < queue.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionComplete(true);
      }
      return;
    }
    // ------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + (grade > 0 ? 1 : 0),
        incorrect: prev.incorrect + (grade === 0 ? 1 : 0),
        learned: prev.learned + (currentCard.isNew && grade > 0 ? 1 : 0),
      }));
      if (currentIndex < queue.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionComplete(true);
      }
      return;
    }

    const currentProgress: Partial<WordProgress> = currentCard.progress || {
      ease_factor: 2.5,
      interval_days: 0,
      familiarity_level: 0,
      review_count: 0,
    };

    const update = calculateSM2(currentProgress, grade);

    const progressData: UserProgressInsert = {
      user_id: user.id,
      word_id: currentCard.id,
      ...update,
      last_reviewed_at: new Date().toISOString(),
      review_count: (currentProgress.review_count || 0) + 1,
      correct_count: (currentProgress.correct_count || 0) + (grade > 0 ? 1 : 0),
      incorrect_count:
        (currentProgress.incorrect_count || 0) + (grade === 0 ? 1 : 0),
    };

    const { error } = await supabase
      .from("user_progress")
      // @ts-expect-error - Supabase generic type inference issue with upsert
      .upsert(progressData, {
        onConflict: "user_id,word_id",
      });

    if (error) {
      console.error("Failed to save progress:", error);
    }

    setStats((prev) => ({
      ...prev,
      correct: prev.correct + (grade > 0 ? 1 : 0),
      incorrect: prev.incorrect + (grade === 0 ? 1 : 0),
      learned: prev.learned + (currentCard.isNew && grade > 0 ? 1 : 0),
    }));

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionComplete(true);
    }
  };

  return {
    currentCard: queue[currentIndex],
    totalCards: queue.length,
    currentIndex,
    loading,
    sessionComplete,
    stats,
    submitGrade,
    reload: loadSession,
  };
}
