import { motion } from 'framer-motion';
import { BookOpen, Brain, Sparkles } from 'lucide-react';

export const LearningIllustration = () => (
  <motion.div
    className="relative w-full h-64 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Central brain icon */}
    <motion.div
      className="absolute z-10 w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Brain className="w-12 h-12 text-primary-foreground" />
    </motion.div>

    {/* Orbiting elements */}
    <motion.div
      className="absolute w-16 h-16 rounded-xl bg-gradient-to-br from-subject-os to-subject-os/70 flex items-center justify-center shadow-lg"
      animate={{ 
        x: [60, 80, 60, 40, 60],
        y: [-60, 0, 60, 0, -60],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <BookOpen className="w-8 h-8 text-primary-foreground" />
    </motion.div>

    <motion.div
      className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-subject-dbms to-subject-dbms/70 flex items-center justify-center shadow-lg"
      animate={{ 
        x: [-70, -40, -70, -100, -70],
        y: [40, 80, 40, 0, 40],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-2xl">🗄️</span>
    </motion.div>

    <motion.div
      className="absolute w-12 h-12 rounded-lg bg-gradient-to-br from-subject-ai to-subject-ai/70 flex items-center justify-center shadow-lg"
      animate={{ 
        x: [0, 40, 0, -40, 0],
        y: [80, 60, 80, 60, 80],
      }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-xl">🤖</span>
    </motion.div>

    {/* Sparkles */}
    <motion.div
      className="absolute top-4 right-20"
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Sparkles className="w-6 h-6 text-warning" />
    </motion.div>

    <motion.div
      className="absolute bottom-8 left-16"
      animate={{ opacity: [1, 0.4, 1], scale: [1.2, 0.8, 1.2] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <Sparkles className="w-5 h-5 text-accent" />
    </motion.div>
  </motion.div>
);

export const QuizIllustration = () => (
  <motion.div
    className="relative w-full h-48 flex items-center justify-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="relative w-32 h-40 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
      whileHover={{ scale: 1.05, rotateY: 5 }}
    >
      {/* Checkbox lines */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary bg-primary/20" />
          <div className="h-2 bg-muted rounded flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-success bg-success flex items-center justify-center">
            <span className="text-xs text-success-foreground">✓</span>
          </div>
          <div className="h-2 bg-success/30 rounded flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30" />
          <div className="h-2 bg-muted rounded flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-muted-foreground/30" />
          <div className="h-2 bg-muted rounded flex-1" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted">
        <motion.div 
          className="h-full bg-gradient-primary"
          initial={{ width: "0%" }}
          animate={{ width: "60%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>

    {/* Floating score */}
    <motion.div
      className="absolute -right-4 top-4 w-16 h-16 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-success-foreground font-bold text-lg">A+</span>
    </motion.div>
  </motion.div>
);

export const DashboardIllustration = () => (
  <motion.div
    className="w-full h-40 flex items-center justify-center gap-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {/* Bar chart representation */}
    <div className="flex items-end gap-2 h-24">
      {[60, 80, 45, 90, 70].map((height, i) => (
        <motion.div
          key={i}
          className="w-8 rounded-t-lg"
          style={{
            background: `linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)`,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        />
      ))}
    </div>

    {/* Circular progress */}
    <motion.div
      className="relative w-20 h-20"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={251.2}
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 75.36 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-foreground">70%</span>
      </div>
    </motion.div>
  </motion.div>
);
