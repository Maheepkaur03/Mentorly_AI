import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Play, BookOpen, Code, Beaker,
  Clock, BarChart, Sparkles, ExternalLink, CheckCircle2, Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLearningStore, getLearnerProfile } from '@/store/learningStore';
import { getRecommendationsForSubject } from '@/data/recommendations';
import { subjectNames, subjectIcons } from '@/data/quizQuestions';
import { ChatbotWidget } from '@/components/chat/ChatbotWidget';
import { Recommendation, Subject } from '@/types/learning';
import { Recommendation as APIRecommendation } from '@/lib/api';
import { cn } from '@/lib/utils';

const formatIcons = {
  video: Play,
  reading: BookOpen,
  practice: Code,
  interactive: Beaker,
  Video: Play,
  Reading: BookOpen,
  Practice: Code,
  Interactive: Beaker,
};

const formatColors: Record<string, string> = {
  video: 'from-red-500 to-pink-500',
  reading: 'from-blue-500 to-indigo-500',
  practice: 'from-green-500 to-emerald-500',
  interactive: 'from-purple-500 to-violet-500',
  Video: 'from-red-500 to-pink-500',
  Reading: 'from-blue-500 to-indigo-500',
  Practice: 'from-green-500 to-emerald-500',
  Interactive: 'from-purple-500 to-violet-500',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Beginner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const priorityColors: Record<string, string> = {
  High: 'ring-2 ring-red-500/50',
  Medium: 'ring-2 ring-amber-500/50',
  Low: 'ring-1 ring-gray-300/50',
};

// Component for backend API recommendations
const APIRecommendationCard = ({ rec, index }: { rec: APIRecommendation; index: number }) => {
  const formatKey = rec.format as keyof typeof formatIcons;
  const Icon = formatIcons[formatKey] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="elevated" className={cn(
        "h-full hover:shadow-xl transition-all duration-300 group",
        priorityColors[rec.priority]
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br",
              formatColors[formatKey] || 'from-gray-500 to-gray-600'
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full capitalize",
                difficultyColors[rec.difficulty] || 'bg-gray-100 text-gray-700'
              )}>
                {rec.difficulty}
              </span>
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded",
                rec.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              )}>
                {rec.priority} Priority
              </span>
            </div>
          </div>
          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {rec.topic}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{subjectIcons[rec.subject as Subject] || '📚'}</span>
            <span>{rec.subject}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {rec.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{rec.estimatedTime}</span>
            </div>
            <Button variant="ghost" size="sm" className="group-hover:text-primary">
              Start Learning
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Local recommendation card
const RecommendationCard = ({ rec, index }: { rec: Recommendation; index: number }) => {
  const Icon = formatIcons[rec.format] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="elevated" className="h-full hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br",
              formatColors[rec.format]
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full capitalize",
              difficultyColors[rec.difficulty]
            )}>
              {rec.difficulty}
            </span>
          </div>
          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {rec.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{subjectIcons[rec.subject]}</span>
            <span>{rec.subject}</span>
            <span className="text-border">•</span>
            <span>{rec.topic}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {rec.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{rec.duration}</span>
            </div>
            <Button variant="ghost" size="sm" className="group-hover:text-primary">
              Start Learning
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Learning Path Timeline Component
const LearningPathTimeline = ({ recommendations }: { recommendations: APIRecommendation[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-12"
    >
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Learning Path
          </CardTitle>
          <CardDescription>
            Follow this recommended sequence for optimal learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            {recommendations.slice(0, 6).map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative pl-10 pb-6 last:pb-0"
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center",
                  rec.priority === 'High'
                    ? "bg-gradient-to-br from-red-500 to-pink-500 text-white"
                    : rec.priority === 'Medium'
                      ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                      : "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                )}>
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{rec.topic}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{subjectIcons[rec.subject as Subject] || '📚'}</span>
                        <span>{rec.subject}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{rec.estimatedTime}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full shrink-0",
                      formatColors[rec.format] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {rec.format}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const profile = getLearnerProfile();
  const { onboardingData, backendRecommendations } = useLearningStore();

  if (!profile) {
    navigate('/');
    return null;
  }

  // Check if we have backend recommendations
  const hasBackendRecs = backendRecommendations && backendRecommendations.length > 0;

  // Prioritize weak subjects
  const prioritizedSubjects: Subject[] = [
    ...profile.weakSubjects,
    ...profile.strongSubjects.filter(s => !profile.weakSubjects.includes(s)),
  ];

  // Get local recommendations with preference for user's content style (fallback)
  const localRecommendations = prioritizedSubjects.flatMap(subject => {
    const subjectRecs = getRecommendationsForSubject(subject);
    // Prioritize matching content style
    return subjectRecs.sort((a, b) => {
      if (a.format === onboardingData?.contentStyle) return -1;
      if (b.format === onboardingData?.contentStyle) return 1;
      return 0;
    });
  });

  // Group by priority for backend recommendations
  const highPriorityRecs = backendRecommendations?.filter(r => r.priority === 'High') || [];
  const mediumPriorityRecs = backendRecommendations?.filter(r => r.priority === 'Medium') || [];
  const lowPriorityRecs = backendRecommendations?.filter(r => r.priority === 'Low') || [];

  // Group by weak/strong for local recommendations
  const weakSubjectRecs = localRecommendations.filter(r => profile.weakSubjects.includes(r.subject));
  const strongSubjectRecs = localRecommendations.filter(r => profile.strongSubjects.includes(r.subject));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">Personalized for you</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Your Personalized <span className="gradient-text">Learning Path</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {hasBackendRecs
              ? "AI-generated recommendations based on your quiz performance and learning style."
              : "Based on your quiz results and preferences, we've curated these resources to help you improve."}
          </p>
        </motion.div>

        {/* Learning Style Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="subject" className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Your Preferred Learning Style</h3>
                  <p className="text-sm text-muted-foreground">
                    Content prioritized for: <strong className="capitalize">{onboardingData?.contentStyle || 'video'}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  {Object.entries({ video: Play, reading: BookOpen, practice: Code, interactive: Beaker }).map(([format, Icon]) => (
                    <div
                      key={format}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        format === onboardingData?.contentStyle
                          ? `bg-gradient-to-br ${formatColors[format]} text-white`
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Path Timeline (if we have backend recs) */}
        {hasBackendRecs && (
          <LearningPathTimeline recommendations={backendRecommendations} />
        )}

        {/* Backend Recommendations */}
        {hasBackendRecs ? (
          <>
            {/* High Priority */}
            {highPriorityRecs.length > 0 && (
              <section className="mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">🔥 High Priority</h2>
                    <p className="text-muted-foreground">Focus on these first to improve your weak areas</p>
                  </div>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highPriorityRecs.map((rec, i) => (
                    <APIRecommendationCard key={i} rec={rec} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Medium Priority */}
            {mediumPriorityRecs.length > 0 && (
              <section className="mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">⚡ Medium Priority</h2>
                    <p className="text-muted-foreground">Enhance your skills with these topics</p>
                  </div>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediumPriorityRecs.map((rec, i) => (
                    <APIRecommendationCard key={i} rec={rec} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Low Priority */}
            {lowPriorityRecs.length > 0 && (
              <section>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">✨ Continue Growing</h2>
                    <p className="text-muted-foreground">Build on your strengths</p>
                  </div>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lowPriorityRecs.map((rec, i) => (
                    <APIRecommendationCard key={i} rec={rec} index={i} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            {/* Fallback to local recommendations */}
            {/* Priority: Weak Subjects */}
            {weakSubjectRecs.length > 0 && (
              <section className="mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">Priority: Improve These</h2>
                    <p className="text-muted-foreground">Focus on strengthening your weak areas</p>
                  </div>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weakSubjectRecs.slice(0, 6).map((rec, i) => (
                    <RecommendationCard key={rec.id} rec={rec} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Strong Subjects */}
            {strongSubjectRecs.length > 0 && (
              <section>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">Level Up Your Strengths</h2>
                    <p className="text-muted-foreground">Advanced content for your strong areas</p>
                  </div>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strongSubjectRecs.slice(0, 6).map((rec, i) => (
                    <RecommendationCard key={rec.id} rec={rec} index={i} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default RecommendationsPage;
