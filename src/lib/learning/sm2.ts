/** @format */

import { ReviewGrade, SM2UpdateResult, WordProgress } from "./types";

// Configuration from design
const CONFIG = {
  MIN_INTERVAL_DAYS: 0.007, // ~10 minutes (10/1440 days)
  MAX_INTERVAL_DAYS: 180,
  INITIAL_EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,

  // Learning Phase Intervals (in days)
  LEARNING_INTERVALS: [
    0.007, // 10 mins
    0.042, // 1 hour
    0.33, // 8 hours
    1.0, // 1 day
  ],
};

/**
 * Calculates the next state for a word based on the SM-2 algorithm.
 *
 * @param currentProgress The current state of the word for the user
 * @param grade The grade of the review (0=Incorrect, 1=Hard, 2=Good, 3=Perfect)
 * @returns The new state properties (interval, ease, review date)
 */
export function calculateSM2(
  currentProgress: Partial<WordProgress>,
  grade: ReviewGrade
): SM2UpdateResult {
  const {
    ease_factor = CONFIG.INITIAL_EASE_FACTOR,
    interval_days = 0,
    familiarity_level = 0,
  } = currentProgress;

  // 1. Handle Incorrect items (Grade 0)
  if (grade === 0) {
    // Punishment: Reset to roughly 10 mins (Learning step 0)
    // Reduce ease factor
    const newEase = Math.max(CONFIG.MIN_EASE_FACTOR, ease_factor - 0.2);

    return {
      ease_factor: newEase,
      interval_days: CONFIG.MIN_INTERVAL_DAYS,
      familiarity_level: 0, // Reset to "Learning" / "New"ish
      next_review_at: getNextReviewDate(CONFIG.MIN_INTERVAL_DAYS),
    };
  }

  // 2. Handle Correct items (Grades 1, 2, 3)

  // Adjust Ease Factor
  // Formula: EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02)) isn't exactly used here based on design doc.
  // Design doc simplified:
  // Perfect (3): +0.1
  // Good (2): No change
  // Hard (1): -0.15 (Design said -0.1, but let's be slightly stricter or follow doc exact: -0.1)

  let easeDelta = 0;
  if (grade === 3) easeDelta = 0.1;
  else if (grade === 2) easeDelta = 0;
  else if (grade === 1) easeDelta = -0.1;

  let newEase = ease_factor + easeDelta;
  newEase = Math.max(CONFIG.MIN_EASE_FACTOR, newEase);

  // Calculate Interval
  let newInterval = interval_days;
  let newFamiliarity = familiarity_level;

  if (familiarity_level < CONFIG.LEARNING_INTERVALS.length) {
    // Still in Learning Phase
    // Promote to next learning step
    newFamiliarity = familiarity_level + 1;

    if (newFamiliarity < CONFIG.LEARNING_INTERVALS.length) {
      newInterval = CONFIG.LEARNING_INTERVALS[newFamiliarity];
    } else {
      // Graduate to Reviewing Phase
      // First review interval is usually 1 day or slightly more, determined by ease
      newInterval = 1 * newEase;
    }
  } else {
    // Reviewing Phase (Exponential Growth)
    // Interval[n] = Interval[n-1] * EF

    // Performance Multiplier from design:
    // Perfect: x2.5 (Override EF?) -> Design says "NewInterval = PreviousInterval * EaseFactor * PerformanceModifier"
    // Actually design says: "Interval Multiplier | Perfect: x2.5, Correct: x2.0, Hard: x1.5"
    // This seems to REPLACE the standard "Interval * EF" logic with fixed multipliers relative to previous interval?
    // OR, it modifies the EF used for multiplication.
    // Standard SM-2: I_n = I_{n-1} * EF.
    // Design doc table implies specific multipliers:

    let multiplier = newEase; // Default to EF

    // If we strictly follow the table "Interval Multiplier":
    if (grade === 3) multiplier = 2.5;
    else if (grade === 2) multiplier = 2.0;
    else if (grade === 1) multiplier = 1.5;

    newInterval = interval_days * multiplier;
  }

  // Cap interval
  newInterval = Math.min(newInterval, CONFIG.MAX_INTERVAL_DAYS);
  newInterval = Math.max(newInterval, CONFIG.MIN_INTERVAL_DAYS); // Sanity check

  return {
    ease_factor: newEase,
    interval_days: newInterval,
    familiarity_level: newFamiliarity,
    next_review_at: getNextReviewDate(newInterval),
  };
}

function getNextReviewDate(days: number): string {
  const date = new Date();
  // Add days (fractional days supported)
  // days * 24 * 60 * 60 * 1000
  const ms = days * 86400000;
  date.setTime(date.getTime() + ms);
  return date.toISOString();
}
