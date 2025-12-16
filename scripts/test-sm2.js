/** @format */

// Mock types
const CONFIG = {
  MIN_INTERVAL_DAYS: 0.007,
  MAX_INTERVAL_DAYS: 180,
  INITIAL_EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,
  LEARNING_INTERVALS: [0.007, 0.042, 0.33, 1.0],
};

function calculateSM2(currentProgress, grade) {
  let {
    ease_factor = CONFIG.INITIAL_EASE_FACTOR,
    interval_days = 0,
    familiarity_level = 0,
  } = currentProgress;

  if (grade === 0) {
    const newEase = Math.max(CONFIG.MIN_EASE_FACTOR, ease_factor - 0.2);
    return {
      ease_factor: newEase,
      interval_days: CONFIG.MIN_INTERVAL_DAYS,
      familiarity_level: 0,
    };
  }

  let easeDelta = 0;
  if (grade === 3) easeDelta = 0.1;
  else if (grade === 2) easeDelta = 0;
  else if (grade === 1) easeDelta = -0.1;

  let newEase = ease_factor + easeDelta;
  newEase = Math.max(CONFIG.MIN_EASE_FACTOR, newEase);

  let newInterval = interval_days;
  let newFamiliarity = familiarity_level;

  if (familiarity_level < CONFIG.LEARNING_INTERVALS.length) {
    newFamiliarity = familiarity_level + 1;
    if (newFamiliarity < CONFIG.LEARNING_INTERVALS.length) {
      newInterval = CONFIG.LEARNING_INTERVALS[newFamiliarity];
    } else {
      newInterval = 1 * newEase;
    }
  } else {
    let multiplier = newEase;
    if (grade === 3) multiplier = 2.5;
    else if (grade === 2) multiplier = 2.0;
    else if (grade === 1) multiplier = 1.5;

    newInterval = interval_days * multiplier;
  }

  newInterval = Math.min(newInterval, CONFIG.MAX_INTERVAL_DAYS);
  newInterval = Math.max(newInterval, CONFIG.MIN_INTERVAL_DAYS);

  return {
    ease_factor: newEase,
    interval_days: newInterval,
    familiarity_level: newFamiliarity,
  };
}

// Tests
console.log("--- Testing SM-2 Logic ---");

// Test 1: New Word -> Correct (Grade 3)
let progress = {};
let result = calculateSM2(progress, 3);
console.log(
  "New -> Correct (3):",
  result.familiarity_level === 1 &&
    result.interval_days === CONFIG.LEARNING_INTERVALS[1]
    ? "PASS"
    : "FAIL",
  result
);

// Test 2: Learning Word (Level 1) -> Correct (3)
progress = {
  familiarity_level: 1,
  interval_days: CONFIG.LEARNING_INTERVALS[1],
  ease_factor: 2.5,
};
result = calculateSM2(progress, 3);
console.log(
  "Level 1 -> Correct (3):",
  result.familiarity_level === 2 &&
    result.interval_days === CONFIG.LEARNING_INTERVALS[2]
    ? "PASS"
    : "FAIL",
  result
);

// Test 3: Incorrect Reset
progress = { familiarity_level: 3, interval_days: 1.0, ease_factor: 2.5 };
result = calculateSM2(progress, 0);
console.log(
  "Incorrect Reset:",
  result.familiarity_level === 0 &&
    result.interval_days === CONFIG.MIN_INTERVAL_DAYS &&
    result.ease_factor === 2.3
    ? "PASS"
    : "FAIL",
  result
);

// Test 4: Graduation to Reviewing
progress = { familiarity_level: 3, interval_days: 1.0, ease_factor: 2.5 };
result = calculateSM2(progress, 3); // Level 3 is last learning step (index 3 is 1 day), wait.
// Length is 4. indices 0,1,2,3.
// Index 3 -> New Level 4.
// If level 4 is >= length 4, then Graduate.
// New Interval = 1 * Ease (2.6) = 2.6 days.
console.log(
  "Graduation:",
  result.familiarity_level === 4 && result.interval_days === 2.6
    ? "PASS"
    : "FAIL",
  result
);
