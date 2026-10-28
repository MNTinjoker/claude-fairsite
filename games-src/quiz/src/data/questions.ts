export type Option = {
  id: string;
  text: string;
  textEn?: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  topic: string;
  topicEn?: string;
  text: string;
  textEn?: string;
  options: Option[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  explanationEn?: string;
};

import { easyQuestions } from './questions_easy';
import { mediumQuestions } from './questions_medium';
import { hardQuestions } from './questions_hard';

export const questionsBank: Question[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions
];
