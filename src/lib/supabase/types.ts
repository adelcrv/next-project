/** @format */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      words: {
        Row: {
          id: string;
          word: string;
          phonetic: string | null;
          part_of_speech: string | null;
          definition: string;
          example_sentence: string | null;
          book_number: number | null;
          unit_number: number | null;

          // Arabic & Media
          arabic_translation: string | null;
          arabic_definition: string | null;
          arabic_example: string | null;
          extra_meanings: { meaning: string; example?: string }[] | null;
          image_url: string | null;
          video_url: string | null;
          audio_url: string | null;

          // Game Data
          synonyms: string[] | null;
          antonyms: string[] | null;
          topic_tags: string[] | null;
          difficulty_level: number;

          created_at: string;
        };
        Insert: {
          id?: string;
          word: string;
          phonetic?: string | null;
          part_of_speech?: string | null;
          definition: string;
          example_sentence?: string | null;
          book_number?: number | null;
          unit_number?: number | null;

          arabic_translation?: string | null;
          arabic_definition?: string | null;
          arabic_example?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          audio_url?: string | null;

          synonyms?: string[] | null;
          antonyms?: string[] | null;
          topic_tags?: string[] | null;
          difficulty_level?: number;

          created_at?: string;
        };
        Update: {
          id?: string;
          word?: string;
          phonetic?: string | null;
          part_of_speech?: string | null;
          definition?: string;
          example_sentence?: string | null;
          book_number?: number | null;
          unit_number?: number | null;

          arabic_translation?: string | null;
          arabic_definition?: string | null;
          arabic_example?: string | null;

          image_url?: string | null;
          video_url?: string | null;
          audio_url?: string | null;

          synonyms?: string[] | null;
          antonyms?: string[] | null;
          topic_tags?: string[] | null;
          difficulty_level?: number;

          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          familiarity_level: number;
          ease_factor: number;
          interval_days: number;
          next_review_at: string | null;
          review_count: number;
          correct_count: number;
          incorrect_count: number;
          last_reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          familiarity_level?: number;
          ease_factor?: number;
          interval_days?: number;
          next_review_at?: string | null;
          review_count?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word_id?: string;
          familiarity_level?: number;
          ease_factor?: number;
          interval_days?: number;
          next_review_at?: string | null;
          review_count?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_reviewed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
