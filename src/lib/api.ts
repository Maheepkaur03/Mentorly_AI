/**
 * API Service for communicating with the FastAPI backend
 * Handles all API calls with proper error handling and type safety
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Types for API requests/responses
export interface QuizAnswers {
    OS: number[];
    DBMS: number[];
    CN: number[];
    AI: number[];
    ML: number[];
}

export interface QuizSubmission {
    studentId: string;
    answers: QuizAnswers;
    timestamp?: string;
}

export interface SubjectScores {
    OS: number;
    DBMS: number;
    CN: number;
    AI: number;
    ML: number;
}

export interface Recommendation {
    subject: string;
    topic: string;
    format: 'Video' | 'Reading' | 'Practice' | 'Interactive';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    priority: 'High' | 'Medium' | 'Low';
    estimatedTime: string;
    description: string;
}

export interface AnalysisResponse {
    studentId: string;
    scores: SubjectScores;
    averageScore: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    levelConfidence: number;
    levelProbabilities: {
        Beginner: number;
        Intermediate: number;
        Advanced: number;
    };
    weakSubjects: string[];
    strongSubjects: string[];
    recommendations: Recommendation[];
    timestamp: string;
}

export interface HealthResponse {
    status: string;
    models_loaded: boolean;
    classifier_type?: string;
    encoders_loaded?: boolean;
    timestamp: string;
}

// Error class for API errors
export class APIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Helper function to handle fetch with timeout and error handling
async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 30000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new APIError('Request timeout - backend may be starting up', 0);
        }
        throw error;
    }
}

// API Methods
export const api = {
    /**
     * Check if the backend is healthy and running
     */
    async checkHealth(): Promise<HealthResponse> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, 5000);

            if (!response.ok) {
                throw new APIError('Backend health check failed', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw new APIError('Cannot connect to backend - ensure it is running on port 8000');
        }
    },

    /**
     * Submit quiz and get complete analysis including scores, level, and recommendations
     * This is the main endpoint for frontend integration
     */
    async submitQuizForAnalysis(submission: QuizSubmission): Promise<AnalysisResponse> {
        try {
            console.log('📤 Sending analysis request:', submission);

            const response = await fetchWithTimeout(`${API_BASE_URL}/api/complete-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...submission,
                    timestamp: submission.timestamp || new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API Error:', errorData);
                throw new APIError(
                    errorData.detail || 'Analysis failed',
                    response.status,
                    errorData
                );
            }

            const data = await response.json();
            console.log('📥 Analysis response:', data);
            return data;
        } catch (error) {
            console.error('❌ API Error:', error);
            if (error instanceof APIError) throw error;
            throw new APIError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        }
    },

    /**
     * Score a quiz submission without full analysis
     */
    async scoreQuiz(submission: QuizSubmission): Promise<SubjectScores> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/api/score-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(
                    errorData.detail || 'Scoring failed',
                    response.status,
                    errorData
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw new APIError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        }
    },
};

export default api;
