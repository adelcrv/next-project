/** @format */

export type WordState = "New" | "Learning" | "Reviewing" | "Mastered";

export interface WordProgress {
  id: string; // user_progress id
  word_id: string;
  user_id: string;

  // SM-2 State
  familiarity_level: number; // 0=New, 1-5=Learning, 6=Mastered
  ease_factor: number;
  interval_days: number;

  // Stats
  next_review_at: string; // ISO date
  last_reviewed_at: string | null;
  review_count: number;
  correct_count: number;
  incorrect_count: number;

  created_at: string;
}

export type ReviewGrade = 0 | 1 | 2 | 3;
// 0: Incorrect (reset)
// 1: Correct with hint (hard)
// 2: Correct with hesitation (medium/good)
// 3: Perfect (easy)

export interface ReviewResult {
  grade: ReviewGrade;
  reviewTime: string; // ISO timestamp of when review happened
}

export interface SM2UpdateResult {
  next_review_at: string;
  interval_days: number;
  ease_factor: number;
  familiarity_level: number;
}

export interface Word {
  id: string;
  word: string;
  definition: string;
  example_sentence: string | null;
  phonetic: string | null;
  arabic_translation: string | null;
  arabic_definition: string | null;
  arabic_example: string | null;
  image_url: string | null;
  audio_url: string | null;
  book_number?: number;
  unit_number?: number;
  part_of_speech?: string;
  synonyms?: string[] | null;
  antonyms?: string[] | null;
  topic_tags?: string[] | null;
  difficulty_level?: number;
  extra_meanings?: { meaning: string; example?: string }[];
  created_at?: string;
}

export type ExerciseType = "preview" | "recognition" | "recall" | "production";
export type SessionType = "learn" | "review" | "smart";

export interface LearningCard extends Word {
  progress?: WordProgress;
  isNew: boolean;
  exerciseType: ExerciseType;
}

// UI-specific type used in FlashCards (legacy, consider unifying with Word)
export interface WordData {
  id: string;
  word: string;
  phonetic: string;
  part_of_speech: string;
  definition: string;
  example: string;
  audio_url?: string;
  arabic_translation?: string | null;
  extra_meanings?: { meaning: string; example?: string }[];
}
