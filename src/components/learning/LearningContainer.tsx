/** @format */

import React from "react";
import { LearningCard } from "@/lib/learning/types";
import { ReviewGrade } from "@/lib/learning/types";
import { WordPreview } from "./WordPreview";
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz";
import { FlashCard } from "@/components/vocabulary/FlashCard";
import { TypingInput } from "./TypingInput";

interface LearningContainerProps {
  card: LearningCard;
  onSubmit: (grade: ReviewGrade) => void;
}

export const LearningContainer: React.FC<LearningContainerProps> = ({
  card,
  onSubmit,
}) => {
  // 1. Preview Mode (Passive Reading)
  if (card.exerciseType === "preview") {
    // Grade doesn't matter for preview, just advance
    return <WordPreview card={card} onNext={() => onSubmit(0)} />;
  }

  // 2. Recognition Mode (Multiple Choice)
  if (card.exerciseType === "recognition") {
    return (
      <MultipleChoiceQuiz
        card={card}
        onResult={(result: "known" | "learning") => {
          // 'known' -> Grade 3 (Perfect), 'learning' -> Grade 0 (Incorrect)
          onSubmit(result === "known" ? 3 : 0);
        }}
      />
    );
  }

  // 3. Production Mode (Typing)
  if (card.exerciseType === "production") {
    return (
      <TypingInput
        card={card}
        onResult={(result: "known" | "learning") => {
          // Production is hard.
          // known -> Grade 3 (for now)
          onSubmit(result === "known" ? 3 : 0);
        }}
      />
    );
  }

  // 4. Recall Mode (Standard Flashcard)
  // Default fallthrough
  return (
    <FlashCard
      data={{
        ...card,
        phonetic: card.phonetic || "",
        part_of_speech: card.part_of_speech || "",
        example: card.example_sentence || "",
        definition: card.definition || "",
        audio_url: card.audio_url || undefined,
      }}
      onResult={(result: "known" | "learning") => {
        // FlashCard component returns 'known' (right swipe) or 'learning' (left swipe)
        onSubmit(result === "known" ? 3 : 0);
      }}
    />
  );
};
