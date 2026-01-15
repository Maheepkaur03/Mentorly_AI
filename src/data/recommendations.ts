import { Recommendation, Subject } from '@/types/learning';

export const recommendationsData: Recommendation[] = [
  // OS Recommendations
  {
    id: 'rec-os-1',
    subject: 'OS',
    topic: 'Process Management',
    format: 'video',
    title: 'Understanding Process Scheduling Algorithms',
    description: 'Deep dive into FCFS, SJF, Round Robin, and Priority scheduling with visual examples.',
    duration: '45 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-os-2',
    subject: 'OS',
    topic: 'Memory Management',
    format: 'interactive',
    title: 'Virtual Memory Simulator',
    description: 'Interactive simulation of page replacement algorithms and memory allocation.',
    duration: '30 min',
    difficulty: 'advanced'
  },
  {
    id: 'rec-os-3',
    subject: 'OS',
    topic: 'Deadlock Prevention',
    format: 'reading',
    title: 'Deadlock Detection & Prevention Guide',
    description: 'Comprehensive guide covering Banker\'s algorithm and deadlock avoidance strategies.',
    duration: '25 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-os-4',
    subject: 'OS',
    topic: 'File Systems',
    format: 'practice',
    title: 'File System Implementation Exercises',
    description: 'Hands-on exercises for implementing file allocation methods.',
    duration: '60 min',
    difficulty: 'advanced'
  },

  // DBMS Recommendations
  {
    id: 'rec-dbms-1',
    subject: 'DBMS',
    topic: 'SQL Fundamentals',
    format: 'interactive',
    title: 'SQL Query Playground',
    description: 'Practice SQL queries with instant feedback on a live database.',
    duration: '40 min',
    difficulty: 'beginner'
  },
  {
    id: 'rec-dbms-2',
    subject: 'DBMS',
    topic: 'Normalization',
    format: 'video',
    title: 'Database Normalization Masterclass',
    description: 'Learn 1NF, 2NF, 3NF, and BCNF with real-world examples.',
    duration: '50 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-dbms-3',
    subject: 'DBMS',
    topic: 'Transaction Management',
    format: 'reading',
    title: 'ACID Properties Deep Dive',
    description: 'Understanding transaction isolation levels and concurrency control.',
    duration: '35 min',
    difficulty: 'advanced'
  },
  {
    id: 'rec-dbms-4',
    subject: 'DBMS',
    topic: 'Query Optimization',
    format: 'practice',
    title: 'Query Performance Tuning Lab',
    description: 'Optimize slow queries using indexes, explain plans, and query restructuring.',
    duration: '55 min',
    difficulty: 'advanced'
  },

  // CN Recommendations
  {
    id: 'rec-cn-1',
    subject: 'CN',
    topic: 'OSI Model',
    format: 'video',
    title: 'OSI Model Explained Simply',
    description: 'Understand all 7 layers with practical examples and analogies.',
    duration: '35 min',
    difficulty: 'beginner'
  },
  {
    id: 'rec-cn-2',
    subject: 'CN',
    topic: 'TCP/IP',
    format: 'interactive',
    title: 'Packet Analyzer Simulation',
    description: 'Analyze network packets and understand TCP/IP communication.',
    duration: '45 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-cn-3',
    subject: 'CN',
    topic: 'Routing Algorithms',
    format: 'practice',
    title: 'Routing Protocol Exercises',
    description: 'Implement and compare distance vector and link state routing.',
    duration: '50 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-cn-4',
    subject: 'CN',
    topic: 'Network Security',
    format: 'reading',
    title: 'Network Security Fundamentals',
    description: 'Learn about firewalls, encryption, and secure communication protocols.',
    duration: '40 min',
    difficulty: 'advanced'
  },

  // AI Recommendations
  {
    id: 'rec-ai-1',
    subject: 'AI',
    topic: 'Search Algorithms',
    format: 'interactive',
    title: 'AI Search Visualizer',
    description: 'Visualize BFS, DFS, A* and other search algorithms in action.',
    duration: '30 min',
    difficulty: 'beginner'
  },
  {
    id: 'rec-ai-2',
    subject: 'AI',
    topic: 'Knowledge Representation',
    format: 'video',
    title: 'Knowledge Graphs & Reasoning',
    description: 'Build and query knowledge graphs for AI applications.',
    duration: '55 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-ai-3',
    subject: 'AI',
    topic: 'Natural Language Processing',
    format: 'practice',
    title: 'NLP Mini Projects',
    description: 'Build sentiment analyzer, chatbot, and text summarizer.',
    duration: '90 min',
    difficulty: 'advanced'
  },
  {
    id: 'rec-ai-4',
    subject: 'AI',
    topic: 'Game Playing',
    format: 'reading',
    title: 'Minimax & Alpha-Beta Pruning',
    description: 'Master game-playing AI with practical implementations.',
    duration: '45 min',
    difficulty: 'intermediate'
  },

  // ML Recommendations
  {
    id: 'rec-ml-1',
    subject: 'ML',
    topic: 'Supervised Learning',
    format: 'video',
    title: 'Classification Algorithms Explained',
    description: 'Master Decision Trees, SVM, and Random Forests.',
    duration: '60 min',
    difficulty: 'beginner'
  },
  {
    id: 'rec-ml-2',
    subject: 'ML',
    topic: 'Neural Networks',
    format: 'interactive',
    title: 'Neural Network Playground',
    description: 'Build and train neural networks visually.',
    duration: '40 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-ml-3',
    subject: 'ML',
    topic: 'Model Evaluation',
    format: 'practice',
    title: 'Cross-Validation & Metrics Lab',
    description: 'Learn to evaluate models using proper validation techniques.',
    duration: '50 min',
    difficulty: 'intermediate'
  },
  {
    id: 'rec-ml-4',
    subject: 'ML',
    topic: 'Deep Learning',
    format: 'reading',
    title: 'Introduction to CNNs and RNNs',
    description: 'Understand convolutional and recurrent neural networks.',
    duration: '70 min',
    difficulty: 'advanced'
  }
];

export const getRecommendationsForSubject = (subject: Subject, format?: string): Recommendation[] => {
  return recommendationsData.filter(rec => {
    if (format && rec.format !== format) return false;
    return rec.subject === subject;
  });
};
