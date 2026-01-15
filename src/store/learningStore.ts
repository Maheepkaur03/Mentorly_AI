import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, OnboardingData, QuizResult, LearnerLevel, LearnerProfile, Subject, ChatMessage } from '@/types/learning';
import { api, AnalysisResponse, Recommendation as APIRecommendation } from '@/lib/api';

// Extended state to include backend data
interface LearningState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Onboarding
  onboardingData: OnboardingData | null;
  hasCompletedOnboarding: boolean;

  // Quiz
  quizAnswers: Record<string, number>;
  quizResults: QuizResult[] | null;
  hasCompletedQuiz: boolean;

  // Profile
  learnerLevel: LearnerLevel | null;
  levelConfidence: number | null;
  weakSubjects: Subject[];
  strongSubjects: Subject[];

  // Backend analysis data
  backendAnalysis: AnalysisResponse | null;
  backendRecommendations: APIRecommendation[];

  // Loading states
  isAnalyzing: boolean;
  analysisError: string | null;

  // Chat
  chatMessages: ChatMessage[];

  // Actions
  login: (username: string, email: string) => void;
  logout: () => void;
  setOnboardingData: (data: OnboardingData) => void;
  setQuizAnswer: (questionId: string, answer: number) => void;
  submitQuiz: (results: QuizResult[]) => void;
  submitQuizWithAnalysis: (answers: Record<string, number[]>) => Promise<AnalysisResponse | null>;
  setLearnerLevel: (level: LearnerLevel) => void;
  setAnalysisError: (error: string | null) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  onboardingData: null,
  hasCompletedOnboarding: false,
  quizAnswers: {},
  quizResults: null,
  hasCompletedQuiz: false,
  learnerLevel: null,
  levelConfidence: null,
  weakSubjects: [] as Subject[],
  strongSubjects: [] as Subject[],
  backendAnalysis: null,
  backendRecommendations: [] as APIRecommendation[],
  isAnalyzing: false,
  analysisError: null,
  chatMessages: [] as ChatMessage[],
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (username: string, email: string) => {
        set({
          user: { id: crypto.randomUUID(), username, email },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set(initialState);
      },

      setOnboardingData: (data: OnboardingData) => {
        set({
          onboardingData: data,
          hasCompletedOnboarding: true,
        });
      },

      setQuizAnswer: (questionId: string, answer: number) => {
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: answer },
        }));
      },

      submitQuiz: (results: QuizResult[]) => {
        const weakSubjects = results.filter(r => r.isWeak).map(r => r.subject);
        const strongSubjects = results.filter(r => !r.isWeak).map(r => r.subject);

        // Simple ML classification based on performance
        const avgScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
        let level: LearnerLevel;

        if (avgScore >= 80) {
          level = 'Advanced';
        } else if (avgScore >= 50) {
          level = 'Intermediate';
        } else {
          level = 'Beginner';
        }

        set({
          quizResults: results,
          hasCompletedQuiz: true,
          weakSubjects,
          strongSubjects,
          learnerLevel: level,
        });
      },

      /**
       * Submit quiz answers to backend for complete analysis
       * This integrates with POST /api/complete-analysis
       */
      submitQuizWithAnalysis: async (answers: Record<string, number[]>) => {
        const state = get();

        if (!state.user) {
          set({ analysisError: 'User not authenticated' });
          return null;
        }

        set({ isAnalyzing: true, analysisError: null });

        try {
          // Prepare the submission payload
          const submission = {
            studentId: state.user.id,
            answers: {
              OS: answers.OS || [],
              DBMS: answers.DBMS || [],
              CN: answers.CN || [],
              AI: answers.AI || [],
              ML: answers.ML || [],
            },
            timestamp: new Date().toISOString(),
          };

          console.log('🚀 Submitting quiz for analysis:', submission);

          // Call the backend API
          const analysis = await api.submitQuizForAnalysis(submission);

          console.log('✅ Received analysis:', analysis);

          // Convert backend scores to QuizResult format
          const subjects: Subject[] = ['OS', 'DBMS', 'CN', 'AI', 'ML'];
          const quizResults: QuizResult[] = subjects.map(subject => ({
            subject,
            score: Math.round((analysis.scores[subject] / 100) * (answers[subject]?.length || 5)),
            total: answers[subject]?.length || 5,
            percentage: analysis.scores[subject],
            isWeak: analysis.weakSubjects.includes(subject),
          }));

          // Update state with backend analysis
          set({
            quizResults,
            hasCompletedQuiz: true,
            learnerLevel: analysis.level as LearnerLevel,
            levelConfidence: analysis.levelConfidence,
            weakSubjects: analysis.weakSubjects as Subject[],
            strongSubjects: analysis.strongSubjects as Subject[],
            backendAnalysis: analysis,
            backendRecommendations: analysis.recommendations,
            isAnalyzing: false,
            analysisError: null,
          });

          return analysis;

        } catch (error) {
          console.error('❌ Analysis error:', error);

          // Fallback to local analysis if backend fails
          const subjects: Subject[] = ['OS', 'DBMS', 'CN', 'AI', 'ML'];
          const results: QuizResult[] = subjects.map(subject => {
            const subjectAnswers = answers[subject] || [];
            const correct = subjectAnswers.filter(a => a === 1).length;
            const total = subjectAnswers.length || 5;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
            return {
              subject,
              score: correct,
              total,
              percentage,
              isWeak: percentage < 60,
            };
          });

          const weakSubjects = results.filter(r => r.isWeak).map(r => r.subject);
          const strongSubjects = results.filter(r => !r.isWeak).map(r => r.subject);
          const avgScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;

          let level: LearnerLevel;
          if (avgScore >= 75) level = 'Advanced';
          else if (avgScore >= 50) level = 'Intermediate';
          else level = 'Beginner';

          set({
            quizResults: results,
            hasCompletedQuiz: true,
            learnerLevel: level,
            levelConfidence: 0.7,
            weakSubjects,
            strongSubjects,
            isAnalyzing: false,
            analysisError: error instanceof Error ? error.message : 'Backend unavailable - using local analysis',
          });

          return null;
        }
      },

      setLearnerLevel: (level: LearnerLevel) => {
        set({ learnerLevel: level });
      },

      setAnalysisError: (error: string | null) => {
        set({ analysisError: error });
      },

      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },

      clearChat: () => {
        set({ chatMessages: [] });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'learning-storage',
    }
  )
);

// Helper to get full learner profile
export const getLearnerProfile = (): LearnerProfile | null => {
  const state = useLearningStore.getState();

  if (!state.user || !state.onboardingData || !state.quizResults || !state.learnerLevel) {
    return null;
  }

  const overallScore = state.quizResults.reduce((sum, r) => sum + r.percentage, 0) / state.quizResults.length;

  return {
    username: state.user.username,
    level: state.learnerLevel,
    weakSubjects: state.weakSubjects,
    strongSubjects: state.strongSubjects,
    quizResults: state.quizResults,
    onboardingData: state.onboardingData,
    overallScore: Math.round(overallScore),
  };
};
