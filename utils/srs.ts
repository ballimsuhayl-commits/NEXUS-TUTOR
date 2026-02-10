import { Flashcard } from '../types';

export const INITIAL_FLASHCARD_STATE = {
  interval: 0,
  repetition: 0,
  efactor: 2.5,
};

/**
 * Calculates the next review parameters based on the SM-2 algorithm.
 * @param card The current flashcard data
 * @param grade The performance rating (0-5). For MCQs: 5 = Correct, 1 = Incorrect.
 */
export const calculateSRS = (card: Flashcard, grade: number): Flashcard => {
  let { interval, repetition, efactor } = card;

  if (grade >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  efactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (efactor < 1.3) efactor = 1.3;

  // Calculate new due date (current time + interval in days)
  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval,
    repetition,
    efactor,
    dueDate
  };
};

export const getDueCards = (cards: Flashcard[]): Flashcard[] => {
  const now = Date.now();
  return cards.filter(card => card.dueDate <= now);
};
