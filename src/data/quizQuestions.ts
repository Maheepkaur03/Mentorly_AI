import { QuizQuestion, Subject } from '@/types/learning';

export const quizQuestions: QuizQuestion[] = [
  // Operating Systems (OS)
  {
    id: 'os-1',
    subject: 'OS',
    question: 'What is the main function of the kernel in an operating system?',
    options: [
      'Managing user interface',
      'Managing hardware resources and providing services to applications',
      'Running web browsers',
      'Creating documents'
    ],
    correctAnswer: 1
  },
  {
    id: 'os-2',
    subject: 'OS',
    question: 'Which scheduling algorithm can potentially cause starvation?',
    options: [
      'Round Robin',
      'First Come First Serve',
      'Shortest Job First (Priority-based)',
      'Multilevel Queue'
    ],
    correctAnswer: 2
  },
  {
    id: 'os-3',
    subject: 'OS',
    question: 'What is a deadlock in operating systems?',
    options: [
      'A process that runs forever',
      'A situation where processes are waiting for resources held by each other',
      'A crashed system',
      'A memory overflow error'
    ],
    correctAnswer: 1
  },

  // Database Management Systems (DBMS)
  {
    id: 'dbms-1',
    subject: 'DBMS',
    question: 'What does ACID stand for in database transactions?',
    options: [
      'Automatic, Consistent, Isolated, Durable',
      'Atomicity, Consistency, Isolation, Durability',
      'Available, Consistent, Independent, Distributed',
      'Asynchronous, Concurrent, Isolated, Dependent'
    ],
    correctAnswer: 1
  },
  {
    id: 'dbms-2',
    subject: 'DBMS',
    question: 'What is normalization in database design?',
    options: [
      'Making the database faster',
      'Process of organizing data to reduce redundancy',
      'Adding more tables',
      'Encrypting the database'
    ],
    correctAnswer: 1
  },
  {
    id: 'dbms-3',
    subject: 'DBMS',
    question: 'Which SQL command is used to remove a table from a database?',
    options: [
      'REMOVE TABLE',
      'DELETE TABLE',
      'DROP TABLE',
      'DESTROY TABLE'
    ],
    correctAnswer: 2
  },

  // Computer Networks (CN)
  {
    id: 'cn-1',
    subject: 'CN',
    question: 'Which layer of the OSI model is responsible for routing?',
    options: [
      'Data Link Layer',
      'Transport Layer',
      'Network Layer',
      'Application Layer'
    ],
    correctAnswer: 2
  },
  {
    id: 'cn-2',
    subject: 'CN',
    question: 'What is the primary purpose of TCP?',
    options: [
      'Fast unreliable data transfer',
      'Reliable ordered data delivery',
      'Broadcasting messages',
      'Encrypting data'
    ],
    correctAnswer: 1
  },
  {
    id: 'cn-3',
    subject: 'CN',
    question: 'What does DNS stand for?',
    options: [
      'Data Network Service',
      'Domain Name System',
      'Dynamic Network Storage',
      'Digital Network Security'
    ],
    correctAnswer: 1
  },

  // Artificial Intelligence (AI)
  {
    id: 'ai-1',
    subject: 'AI',
    question: 'What is a heuristic in AI search algorithms?',
    options: [
      'An exact solution method',
      'An estimated cost function to guide search',
      'A random number generator',
      'A database query'
    ],
    correctAnswer: 1
  },
  {
    id: 'ai-2',
    subject: 'AI',
    question: 'Which type of learning uses labeled training data?',
    options: [
      'Unsupervised Learning',
      'Reinforcement Learning',
      'Supervised Learning',
      'Transfer Learning'
    ],
    correctAnswer: 2
  },
  {
    id: 'ai-3',
    subject: 'AI',
    question: 'What is the Turing Test designed to evaluate?',
    options: [
      'Processing speed',
      'Memory capacity',
      'Machine intelligence/human-like behavior',
      'Network bandwidth'
    ],
    correctAnswer: 2
  },

  // Machine Learning (ML)
  {
    id: 'ml-1',
    subject: 'ML',
    question: 'What is overfitting in machine learning?',
    options: [
      'Model performs well on all data',
      'Model performs well on training data but poorly on new data',
      'Model is too simple',
      'Model has too few parameters'
    ],
    correctAnswer: 1
  },
  {
    id: 'ml-2',
    subject: 'ML',
    question: 'Which algorithm is commonly used for classification problems?',
    options: [
      'Linear Regression',
      'K-Means Clustering',
      'Decision Trees',
      'Principal Component Analysis'
    ],
    correctAnswer: 2
  },
  {
    id: 'ml-3',
    subject: 'ML',
    question: 'What is the purpose of cross-validation?',
    options: [
      'To increase model complexity',
      'To assess model generalization performance',
      'To train the model faster',
      'To reduce dataset size'
    ],
    correctAnswer: 1
  }
];

export const getQuestionsBySubject = (subject: Subject): QuizQuestion[] => {
  return quizQuestions.filter(q => q.subject === subject);
};

export const subjects: Subject[] = ['OS', 'DBMS', 'CN', 'AI', 'ML'];

export const subjectNames: Record<Subject, string> = {
  OS: 'Operating Systems',
  DBMS: 'Database Management',
  CN: 'Computer Networks',
  AI: 'Artificial Intelligence',
  ML: 'Machine Learning'
};

export const subjectIcons: Record<Subject, string> = {
  OS: '💻',
  DBMS: '🗄️',
  CN: '🌐',
  AI: '🤖',
  ML: '📊'
};
