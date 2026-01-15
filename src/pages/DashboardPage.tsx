import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Award, BookOpen,
  ArrowRight, LogOut, Sparkles, BarChart3, Clock, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLearningStore, getLearnerProfile } from '@/store/learningStore';
import { SubjectChip, SubjectBadge } from '@/components/learning/SubjectChip';
import { ScoreCircle } from '@/components/learning/ProgressIndicator';
import { ChatbotWidget } from '@/components/chat/ChatbotWidget';
import { subjectNames } from '@/data/quizQuestions';
import { cn } from '@/lib/utils';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, user, levelConfidence, backendAnalysis } = useLearningStore();
  const profile = getLearnerProfile();

  if (!profile) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const levelColors = {
    Beginner: 'from-blue-500 to-cyan-500',
    Intermediate: 'from-amber-500 to-orange-500',
    Advanced: 'from-emerald-500 to-green-500',
  };

  const levelEmojis = {
    Beginner: '🌱',
    Intermediate: '🌿',
    Advanced: '🌳',
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-display text-lg gradient-text">LearnSmart AI</span>
          </div>
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 border-4 border-primary/30 shadow-lg shadow-primary/10">
              <AvatarImage src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.username}&backgroundColor=6366f1`} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display">
                {getGreeting()}, {profile.username}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's your personalized learning dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Learner Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" className="h-full">
              <CardHeader className="pb-2">
                <CardDescription>Your Level</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Learner Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r",
                  levelColors[profile.level]
                )}>
                  <span className="text-xl">{levelEmojis[profile.level]}</span>
                  <span>{profile.level}</span>
                </div>
                {levelConfidence && (
                  <p className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Confidence: {Math.round(levelConfidence * 100)}%
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on ML analysis of your quiz performance
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="gradient" className="h-full">
              <CardHeader className="pb-2">
                <CardDescription>Overall Performance</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Quiz Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ScoreCircle score={profile.overallScore} size="lg" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" className="h-full">
              <CardHeader className="pb-2">
                <CardDescription>Quick Actions</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => navigate('/recommendations')}
                >
                  View Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/quiz')}
                >
                  Retake Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subject Analysis with Colored Chips */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weak Subjects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <TrendingDown className="w-5 h-5" />
                  Areas to Improve
                </CardTitle>
                <CardDescription>
                  Focus on these subjects to level up
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.weakSubjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.weakSubjects.map(subject => (
                      <div
                        key={subject}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md"
                      >
                        <span className="text-xs">⚠️</span>
                        <span>{subject}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <span className="text-4xl mb-2 block">🎉</span>
                    <p className="text-muted-foreground">
                      Amazing! You're strong in all subjects!
                    </p>
                  </div>
                )}
                <div className="space-y-3 mt-4">
                  {profile.quizResults
                    .filter(r => r.isWeak)
                    .map(result => (
                      <SubjectBadge
                        key={result.subject}
                        subject={result.subject}
                        score={result.percentage}
                      />
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strong Subjects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <TrendingUp className="w-5 h-5" />
                  Your Strengths
                </CardTitle>
                <CardDescription>
                  Keep up the great work in these areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.strongSubjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.strongSubjects.map(subject => (
                      <div
                        key={subject}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                      >
                        <span className="text-xs">✅</span>
                        <span>{subject}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <span className="text-4xl mb-2 block">💪</span>
                    <p className="text-muted-foreground">
                      Keep practicing to build your strengths!
                    </p>
                  </div>
                )}
                <div className="space-y-3 mt-4">
                  {profile.quizResults
                    .filter(r => !r.isWeak)
                    .map(result => (
                      <SubjectBadge
                        key={result.subject}
                        subject={result.subject}
                        score={result.percentage}
                      />
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quiz Score Breakdown</CardTitle>
              <CardDescription>
                Detailed performance in each subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {profile.quizResults.map(result => (
                  <div
                    key={result.subject}
                    className={cn(
                      "p-4 rounded-xl border text-center transition-all hover:shadow-md",
                      result.isWeak
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-success/30 bg-success/5"
                    )}
                  >
                    <div className="mb-2">
                      <ScoreCircle score={result.percentage} size="sm" />
                    </div>
                    <p className="font-semibold">{result.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.score}/{result.total} correct
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Backend Analysis Details (if available) */}
        {backendAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Analysis Complete
                </CardTitle>
                <CardDescription>
                  Processed at {new Date(backendAnalysis.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Average Score: <strong>{backendAnalysis.averageScore}%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>Model Confidence: <strong>{Math.round(backendAnalysis.levelConfidence * 100)}%</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>Recommendations: <strong>{backendAnalysis.recommendations.length}</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default DashboardPage;
