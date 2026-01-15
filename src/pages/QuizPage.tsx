import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLearningStore } from '@/store/learningStore';
import { QuizProgress } from '@/components/learning/ProgressIndicator';
import { quizQuestions, subjectNames, subjectIcons } from '@/data/quizQuestions';
import { Subject, QuizResult } from '@/types/learning';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const QuizPage = () => {
  const navigate = useNavigate();
  const {
    onboardingData,
    quizAnswers,
    setQuizAnswer,
    submitQuiz,
    submitQuizWithAnalysis,
    isAnalyzing,
    analysisError
  } = useLearningStore();

  const selectedSubjects = onboardingData?.subjects || ['OS', 'DBMS', 'CN', 'AI', 'ML'] as Subject[];

  // Filter questions based on selected subjects
  const filteredQuestions = useMemo(() => {
    return quizQuestions.filter(q => selectedSubjects.includes(q.subject));
  }, [selectedSubjects]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = filteredQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;

  // Group questions by subject for progress display
  const currentSubjectQuestions = filteredQuestions.filter(
    q => q.subject === currentQuestion?.subject
  );
  const subjectQuestionIndex = currentSubjectQuestions.findIndex(
    q => q.id === currentQuestion?.id
  );

  const handleSelectAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setQuizAnswer(currentQuestion.id, answerIndex);
    setShowFeedback(true);
  };

  /**
   * Prepare answers in the format required by the backend
   * Converts individual question answers to subject-based arrays of 0/1
   */
  const prepareAnswersForBackend = (): Record<string, number[]> => {
    const answersMap: Record<string, number[]> = {
      OS: [],
      DBMS: [],
      CN: [],
      AI: [],
      ML: [],
    };

    // Group questions by subject and check if answer is correct (1) or wrong (0)
    filteredQuestions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer ? 1 : 0;
      answersMap[question.subject].push(isCorrect);
    });

    return answersMap;
  };

  const handleNext = async () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed - submit to backend for analysis
      setIsSubmitting(true);

      try {
        // Prepare answers in backend format
        const answersForBackend = prepareAnswersForBackend();

        console.log('📊 Quiz completed, answers:', answersForBackend);

        // Try backend analysis first
        const analysisResult = await submitQuizWithAnalysis(answersForBackend);

        if (analysisResult) {
          toast({
            title: "Analysis Complete! 🎉",
            description: `You're classified as ${analysisResult.level} level with ${Math.round(analysisResult.levelConfidence * 100)}% confidence.`,
          });
        } else {
          // Fallback was used (backend unavailable)
          toast({
            title: "Quiz completed! 🎉",
            description: analysisError || "Let's see your personalized results.",
            variant: analysisError ? "destructive" : "default",
          });

          // Also do local submitQuiz as backup
          const results: QuizResult[] = selectedSubjects.map(subject => {
            const subjectQuestions = filteredQuestions.filter(q => q.subject === subject);
            const correctCount = subjectQuestions.filter(
              q => quizAnswers[q.id] === q.correctAnswer
            ).length;
            const percentage = Math.round((correctCount / subjectQuestions.length) * 100);

            return {
              subject,
              score: correctCount,
              total: subjectQuestions.length,
              percentage,
              isWeak: percentage < 60,
            };
          });
          submitQuiz(results);
        }

        navigate('/dashboard');

      } catch (error) {
        console.error('Quiz submission error:', error);

        // Fallback to local quiz submission
        const results: QuizResult[] = selectedSubjects.map(subject => {
          const subjectQuestions = filteredQuestions.filter(q => q.subject === subject);
          const correctCount = subjectQuestions.filter(
            q => quizAnswers[q.id] === q.correctAnswer
          ).length;
          const percentage = Math.round((correctCount / subjectQuestions.length) * 100);

          return {
            subject,
            score: correctCount,
            total: subjectQuestions.length,
            percentage,
            isWeak: percentage < 60,
          };
        });

        submitQuiz(results);
        toast({
          title: "Quiz completed! 🎉",
          description: "Let's see your personalized results.",
        });
        navigate('/dashboard');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold font-display mb-2">Diagnostic Quiz</h1>
          <p className="text-muted-foreground">
            Answer carefully to get accurate recommendations
          </p>
        </motion.div>

        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{currentIndex + 1} / {filteredQuestions.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Subject Progress */}
        <QuizProgress
          current={subjectQuestionIndex + 1}
          total={currentSubjectQuestions.length}
          subject={`${subjectIcons[currentQuestion.subject]} ${subjectNames[currentQuestion.subject]}`}
        />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{subjectIcons[currentQuestion.subject]}</span>
                  <span className="text-sm font-medium text-primary">
                    {currentQuestion.subject}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === currentQuestion.correctAnswer;

                    let optionStyle = "border-border hover:border-primary/50 hover:bg-primary/5";
                    if (showFeedback) {
                      if (isCorrectOption) {
                        optionStyle = "border-success bg-success/10";
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle = "border-destructive bg-destructive/10";
                      } else {
                        optionStyle = "border-border opacity-50";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-primary bg-primary/5";
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showFeedback ? { scale: 1.01 } : {}}
                        whileTap={!showFeedback ? { scale: 0.99 } : {}}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={showFeedback}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3",
                          optionStyle
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                          showFeedback && isCorrectOption
                            ? "bg-success text-success-foreground"
                            : showFeedback && isSelected && !isCorrectOption
                              ? "bg-destructive text-destructive-foreground"
                              : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showFeedback && isCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        )}
                        {showFeedback && isSelected && !isCorrectOption && (
                          <XCircle className="w-5 h-5 text-destructive shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "mt-6 p-4 rounded-xl",
                        isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            <span className="font-semibold text-success">Correct! 🎉</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-destructive" />
                            <span className="font-semibold text-destructive">Not quite right</span>
                          </>
                        )}
                      </div>
                      {!isCorrect && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          The correct answer is: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <Button
            variant="hero"
            size="lg"
            onClick={handleNext}
            disabled={!showFeedback || isSubmitting || isAnalyzing}
          >
            {isSubmitting || isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : currentIndex === filteredQuestions.length - 1 ? (
              <>
                View Results
                <Brain className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
