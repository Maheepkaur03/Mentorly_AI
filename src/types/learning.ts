export interface User {
  id: string;
  username: string;
  email: string;
}

export interface OnboardingData {
  learningGoal: string;
  pace: 'slow' | 'moderate' | 'fast';
  contentStyle: 'video' | 'reading' | 'practice' | 'interactive';
  semester: number;
  subjects: Subject[];
}

export type Subject = 'OS' | 'DBMS' | 'CN' | 'AI' | 'ML';

export interface QuizQuestion {
  id: string;
  subject: Subject;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  subject: Subject;
  score: number;
  total: number;
  percentage: number;
  isWeak: boolean;
}

export type LearnerLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearnerProfile {
  username: string;
  level: LearnerLevel;
  weakSubjects: Subject[];
  strongSubjects: Subject[];
  quizResults: QuizResult[];
  onboardingData: OnboardingData;
  overallScore: number;
}

export interface Recommendation {
  id: string;
  subject: Subject;
  topic: string;
  format: 'video' | 'reading' | 'practice' | 'interactive';
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
