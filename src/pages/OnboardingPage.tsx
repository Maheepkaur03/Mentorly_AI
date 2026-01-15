import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Gauge, Palette, Calendar, BookOpen, 
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLearningStore } from '@/store/learningStore';
import { ProgressIndicator } from '@/components/learning/ProgressIndicator';
import { Subject, OnboardingData } from '@/types/learning';
import { subjects, subjectNames, subjectIcons } from '@/data/quizQuestions';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = ['Goals', 'Pace', 'Style', 'Semester', 'Subjects'];

type Pace = 'slow' | 'moderate' | 'fast';
type ContentStyle = 'video' | 'reading' | 'practice' | 'interactive';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, setOnboardingData } = useLearningStore();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form state
  const [learningGoal, setLearningGoal] = useState('');
  const [pace, setPace] = useState<Pace>('moderate');
  const [contentStyle, setContentStyle] = useState<ContentStyle>('video');
  const [semester, setSemester] = useState<number>(5);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const handleNext = () => {
    if (currentStep === 0 && !learningGoal) {
      toast({
        title: "Please select a learning goal",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 4 && selectedSubjects.length === 0) {
      toast({
        title: "Please select at least one subject",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit onboarding
      const data: OnboardingData = {
        learningGoal,
        pace,
        contentStyle,
        semester,
        subjects: selectedSubjects,
      };
      setOnboardingData(data);
      toast({
        title: "Profile saved! 🎉",
        description: "Now let's assess your current knowledge.",
      });
      navigate('/quiz');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const goalOptions = [
    { id: 'placement', label: 'Placement Preparation', icon: '🎯', desc: 'Get job-ready' },
    { id: 'exams', label: 'Semester Exams', icon: '📝', desc: 'Ace your exams' },
    { id: 'competitive', label: 'Competitive Exams', icon: '🏆', desc: 'GATE, GRE, etc.' },
    { id: 'knowledge', label: 'Self Improvement', icon: '🧠', desc: 'Learn for curiosity' },
  ];

  const paceOptions: { value: Pace; label: string; desc: string; icon: string }[] = [
    { value: 'slow', label: 'Relaxed', desc: '1-2 hours/week', icon: '🐢' },
    { value: 'moderate', label: 'Balanced', desc: '3-5 hours/week', icon: '⚡' },
    { value: 'fast', label: 'Intensive', desc: '10+ hours/week', icon: '🚀' },
  ];

  const styleOptions: { value: ContentStyle; label: string; icon: string }[] = [
    { value: 'video', label: 'Video Lectures', icon: '🎥' },
    { value: 'reading', label: 'Reading Material', icon: '📖' },
    { value: 'practice', label: 'Practice Problems', icon: '✍️' },
    { value: 'interactive', label: 'Interactive Labs', icon: '🔬' },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display mb-2">
            Hey {user?.username || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Let's personalize your learning experience
          </p>
        </motion.div>

        {/* Progress */}
        <ProgressIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 0 && <Target className="w-5 h-5 text-primary" />}
                  {currentStep === 1 && <Gauge className="w-5 h-5 text-primary" />}
                  {currentStep === 2 && <Palette className="w-5 h-5 text-primary" />}
                  {currentStep === 3 && <Calendar className="w-5 h-5 text-primary" />}
                  {currentStep === 4 && <BookOpen className="w-5 h-5 text-primary" />}
                  {steps[currentStep]}
                </CardTitle>
                <CardDescription>
                  {currentStep === 0 && "What's your primary learning objective?"}
                  {currentStep === 1 && "How much time can you dedicate to learning?"}
                  {currentStep === 2 && "How do you prefer to learn?"}
                  {currentStep === 3 && "Which semester are you in?"}
                  {currentStep === 4 && "Select the subjects you want to focus on"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Step 0: Learning Goal */}
                {currentStep === 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {goalOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLearningGoal(option.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all duration-200",
                          learningGoal === option.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <p className="font-semibold">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                          </div>
                          {learningGoal === option.id && (
                            <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Step 1: Pace */}
                {currentStep === 1 && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {paceOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPace(option.value)}
                        className={cn(
                          "flex-1 p-6 rounded-xl border-2 text-center transition-all duration-200",
                          pace === option.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-4xl block mb-2">{option.icon}</span>
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Step 2: Content Style */}
                {currentStep === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {styleOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setContentStyle(option.value)}
                        className={cn(
                          "p-5 rounded-xl border-2 text-center transition-all duration-200",
                          contentStyle === option.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-3xl block mb-2">{option.icon}</span>
                        <p className="font-semibold">{option.label}</p>
                        {contentStyle === option.value && (
                          <CheckCircle2 className="w-5 h-5 text-primary mx-auto mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Step 3: Semester */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSemester(Math.max(1, semester - 1))}
                        disabled={semester <= 1}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div className="w-32 h-32 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                        <span className="text-5xl font-bold text-primary-foreground">{semester}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSemester(Math.min(8, semester + 1))}
                        disabled={semester >= 8}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-center text-muted-foreground">
                      Semester {semester} of 8
                    </p>
                  </div>
                )}

                {/* Step 4: Subjects */}
                {currentStep === 4 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <motion.button
                        key={subject}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSubject(subject)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200",
                          selectedSubjects.includes(subject)
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{subjectIcons[subject]}</span>
                          <div className="text-left">
                            <p className="font-semibold">{subject}</p>
                            <p className="text-xs text-muted-foreground">{subjectNames[subject]}</p>
                          </div>
                          {selectedSubjects.includes(subject) && (
                            <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="hero" onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                Start Quiz
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
