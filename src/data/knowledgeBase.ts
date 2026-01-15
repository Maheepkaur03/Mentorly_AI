export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  subject: string;
  keywords: string[];
}

export const knowledgeBase: KnowledgeEntry[] = [
  // Operating Systems
  {
    id: 'kb-os-1',
    question: 'What is an operating system?',
    answer: 'An operating system (OS) is system software that manages computer hardware and software resources and provides common services for computer programs. It acts as an intermediary between users and the computer hardware.',
    subject: 'OS',
    keywords: ['operating system', 'os', 'system software', 'hardware management']
  },
  {
    id: 'kb-os-2',
    question: 'What is process scheduling?',
    answer: 'Process scheduling is the activity of the process manager that handles the removal of the running process from the CPU and the selection of another process based on a particular strategy. Common algorithms include FCFS, SJF, Round Robin, and Priority Scheduling.',
    subject: 'OS',
    keywords: ['process', 'scheduling', 'cpu', 'fcfs', 'round robin', 'priority']
  },
  {
    id: 'kb-os-3',
    question: 'What is virtual memory?',
    answer: 'Virtual memory is a memory management technique that creates an illusion of a large, continuous memory space by using both hardware and software. It allows programs larger than physical memory to run by swapping pages between RAM and disk storage.',
    subject: 'OS',
    keywords: ['virtual memory', 'paging', 'swapping', 'memory management']
  },
  {
    id: 'kb-os-4',
    question: 'Explain deadlock and its conditions.',
    answer: 'A deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by the other. Four conditions must hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    subject: 'OS',
    keywords: ['deadlock', 'mutual exclusion', 'circular wait', 'resource']
  },

  // Database Management Systems
  {
    id: 'kb-dbms-1',
    question: 'What is a database?',
    answer: 'A database is an organized collection of structured information or data, typically stored electronically in a computer system. A database is usually controlled by a database management system (DBMS) which allows for efficient data storage, retrieval, and management.',
    subject: 'DBMS',
    keywords: ['database', 'data', 'storage', 'dbms']
  },
  {
    id: 'kb-dbms-2',
    question: 'What is normalization?',
    answer: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing a database into two or more tables and defining relationships between them. Common normal forms include 1NF, 2NF, 3NF, and BCNF.',
    subject: 'DBMS',
    keywords: ['normalization', 'normal form', '1nf', '2nf', '3nf', 'redundancy']
  },
  {
    id: 'kb-dbms-3',
    question: 'What is SQL?',
    answer: 'SQL (Structured Query Language) is a standardized programming language used to manage relational databases and perform various operations on data. Key commands include SELECT, INSERT, UPDATE, DELETE, CREATE, and DROP.',
    subject: 'DBMS',
    keywords: ['sql', 'query', 'select', 'insert', 'update', 'delete']
  },
  {
    id: 'kb-dbms-4',
    question: 'Explain ACID properties.',
    answer: 'ACID stands for Atomicity (transactions are all-or-nothing), Consistency (database remains in valid state), Isolation (concurrent transactions don\'t interfere), and Durability (committed changes are permanent). These properties ensure reliable database transactions.',
    subject: 'DBMS',
    keywords: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'transaction']
  },

  // Computer Networks
  {
    id: 'kb-cn-1',
    question: 'What is the OSI model?',
    answer: 'The OSI (Open Systems Interconnection) model is a conceptual framework with 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. It standardizes network communication functions to enable interoperability between different systems.',
    subject: 'CN',
    keywords: ['osi', 'layers', 'network model', 'physical', 'application']
  },
  {
    id: 'kb-cn-2',
    question: 'What is TCP/IP?',
    answer: 'TCP/IP (Transmission Control Protocol/Internet Protocol) is the fundamental communication protocol suite of the Internet. TCP ensures reliable, ordered delivery of data, while IP handles addressing and routing of packets across networks.',
    subject: 'CN',
    keywords: ['tcp', 'ip', 'protocol', 'internet', 'packet', 'routing']
  },
  {
    id: 'kb-cn-3',
    question: 'What is DNS?',
    answer: 'DNS (Domain Name System) is a hierarchical naming system that translates human-readable domain names (like www.example.com) into IP addresses that computers use to identify each other on the network. It\'s often called the phonebook of the Internet.',
    subject: 'CN',
    keywords: ['dns', 'domain', 'ip address', 'name resolution', 'internet']
  },
  {
    id: 'kb-cn-4',
    question: 'Difference between TCP and UDP?',
    answer: 'TCP is connection-oriented, reliable, and ensures ordered delivery with error checking. UDP is connectionless, faster but unreliable, with no guarantee of delivery order. TCP is used for web browsing and email; UDP is used for streaming and gaming.',
    subject: 'CN',
    keywords: ['tcp', 'udp', 'connection', 'reliable', 'streaming']
  },

  // Artificial Intelligence
  {
    id: 'kb-ai-1',
    question: 'What is artificial intelligence?',
    answer: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn. It encompasses problem-solving, learning, reasoning, perception, and language understanding. Applications include virtual assistants, autonomous vehicles, and recommendation systems.',
    subject: 'AI',
    keywords: ['artificial intelligence', 'ai', 'machine', 'learning', 'intelligent']
  },
  {
    id: 'kb-ai-2',
    question: 'What are search algorithms in AI?',
    answer: 'Search algorithms in AI are methods to find solutions by exploring possible states. Uninformed searches (BFS, DFS) explore blindly, while informed searches (A*, Greedy) use heuristics to guide the search toward the goal more efficiently.',
    subject: 'AI',
    keywords: ['search', 'algorithm', 'bfs', 'dfs', 'a star', 'heuristic']
  },
  {
    id: 'kb-ai-3',
    question: 'What is machine learning?',
    answer: 'Machine Learning is a subset of AI where systems learn from data to improve performance without explicit programming. Types include supervised learning (labeled data), unsupervised learning (pattern discovery), and reinforcement learning (reward-based learning).',
    subject: 'AI',
    keywords: ['machine learning', 'ml', 'supervised', 'unsupervised', 'reinforcement']
  },
  {
    id: 'kb-ai-4',
    question: 'What is natural language processing?',
    answer: 'NLP (Natural Language Processing) is an AI field focused on enabling computers to understand, interpret, and generate human language. Applications include chatbots, translation, sentiment analysis, and text summarization.',
    subject: 'AI',
    keywords: ['nlp', 'natural language', 'text', 'chatbot', 'translation']
  },

  // Machine Learning
  {
    id: 'kb-ml-1',
    question: 'What is supervised learning?',
    answer: 'Supervised learning is a type of ML where the model learns from labeled training data. The algorithm learns a mapping function from input to output. Examples include classification (predicting categories) and regression (predicting continuous values).',
    subject: 'ML',
    keywords: ['supervised', 'labeled', 'classification', 'regression', 'training']
  },
  {
    id: 'kb-ml-2',
    question: 'What is overfitting?',
    answer: 'Overfitting occurs when a model learns the training data too well, including noise and outliers, resulting in poor performance on new, unseen data. Solutions include cross-validation, regularization, pruning, and using more training data.',
    subject: 'ML',
    keywords: ['overfitting', 'generalization', 'regularization', 'validation', 'noise']
  },
  {
    id: 'kb-ml-3',
    question: 'What is a neural network?',
    answer: 'A neural network is a computational model inspired by biological neurons. It consists of layers of interconnected nodes that process information. Deep learning uses many layers to learn complex patterns in data for tasks like image recognition and language processing.',
    subject: 'ML',
    keywords: ['neural network', 'deep learning', 'layers', 'neurons', 'pattern']
  },
  {
    id: 'kb-ml-4',
    question: 'What is cross-validation?',
    answer: 'Cross-validation is a technique to assess model performance by dividing data into training and validation sets multiple times. K-fold CV splits data into k parts, training on k-1 and testing on 1, repeating k times for reliable performance estimates.',
    subject: 'ML',
    keywords: ['cross-validation', 'k-fold', 'validation', 'training', 'testing']
  },

  // General
  {
    id: 'kb-gen-1',
    question: 'How can I improve my learning?',
    answer: 'To improve learning: 1) Set clear goals, 2) Practice regularly with spaced repetition, 3) Work on hands-on projects, 4) Join study groups, 5) Teach concepts to others, 6) Take breaks to avoid burnout, 7) Focus on understanding over memorization.',
    subject: 'General',
    keywords: ['learning', 'study', 'improve', 'tips', 'practice']
  },
  {
    id: 'kb-gen-2',
    question: 'What are good resources for learning CS?',
    answer: 'Great CS resources include: Online platforms (Coursera, edX, MIT OCW), Documentation and tutorials, Practice sites (LeetCode, HackerRank), Books (CLRS for algorithms, Design Patterns by GoF), YouTube channels, and GitHub open-source projects.',
    subject: 'General',
    keywords: ['resources', 'learning', 'courses', 'books', 'practice']
  }
];

// Simple TF-IDF-like similarity for chatbot
export const findBestMatch = (query: string): KnowledgeEntry | null => {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let bestMatch: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    const allKeywords = [
      ...entry.keywords,
      ...entry.question.toLowerCase().split(/\s+/),
      entry.subject.toLowerCase()
    ];

    for (const queryWord of queryWords) {
      for (const keyword of allKeywords) {
        if (keyword.includes(queryWord) || queryWord.includes(keyword)) {
          score += 1;
        }
      }
    }

    // Boost exact keyword matches
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) {
        score += 3;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return highestScore > 1 ? bestMatch : null;
};
