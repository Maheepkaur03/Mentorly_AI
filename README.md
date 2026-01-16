<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-Learn" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</p>

# 🧠 Mentorly AI - Adaptive Learning Platform

**Mentorly AI** is an intelligent, personalized learning platform that uses **Machine Learning** to classify learners and provide tailored educational recommendations. The platform adapts to each student's strengths and weaknesses, delivering a customized learning experience powered by real ML inference.

---

## ✨ Features

### 🎯 **Intelligent Learner Assessment**
- Multi-subject diagnostic quiz covering **OS, DBMS, CN, AI, and ML**
- Real-time performance scoring and analysis
- ML-powered learner classification (**Beginner**, **Intermediate**, **Advanced**)

### 🤖 **Machine Learning Integration**
- Pre-trained **scikit-learn** classifier for accurate learner profiling
- Feature engineering pipeline with safe handling of unseen categorical data
- Label encoders for categorical feature transformation
- Confidence scores and probability distributions for predictions

### 📊 **Personalized Dashboard**
- Visual performance breakdown by subject
- Strength and weakness identification
- Progress tracking and analytics
- Interactive charts powered by **Recharts**

### 📚 **Smart Recommendations**
- AI-driven learning path recommendations
- Priority-based content suggestions (High/Medium/Low)
- Multiple learning formats (Video, Reading, Practice, Interactive)
- Estimated completion times for each resource

### 🔐 **User Experience**
- Seamless onboarding flow
- Protected routes with authentication
- Responsive design for all devices
- Beautiful UI with **Radix UI** components

---

## 🏗️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Radix UI | Component Library |
| Zustand | State Management |
| React Query | Server State |
| Framer Motion | Animations |
| Recharts | Data Visualization |

### **Backend**
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| Python 3.10+ | Backend Language |
| scikit-learn | ML Models |
| joblib | Model Serialization |
| Pydantic | Data Validation |
| NumPy | Numerical Computing |
| Uvicorn | ASGI Server |

---

## 📁 Project Structure

```
Mentorly_AI/
├── 📂 backend/
│   ├── main.py                    # FastAPI application with ML integration
│   ├── requirements.txt           # Python dependencies
│   └── 📂 models/
│       ├── learner_classifier.pkl # Pre-trained ML classifier
│       └── label_encoders.pkl     # Categorical feature encoders
│
├── 📂 src/
│   ├── App.tsx                    # Main React application
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   │
│   ├── 📂 pages/
│   │   ├── LoginPage.tsx          # Authentication page
│   │   ├── OnboardingPage.tsx     # User onboarding flow
│   │   ├── QuizPage.tsx           # Assessment quiz
│   │   ├── DashboardPage.tsx      # Performance dashboard
│   │   └── RecommendationsPage.tsx # Learning recommendations
│   │
│   ├── 📂 components/
│   │   ├── 📂 ui/                 # Radix UI components
│   │   ├── 📂 chat/               # Chat components
│   │   └── 📂 learning/           # Learning-specific components
│   │
│   ├── 📂 data/
│   │   ├── quizQuestions.ts       # Quiz question bank
│   │   ├── knowledgeBase.ts       # Subject knowledge base
│   │   └── recommendations.ts      # Recommendation templates
│   │
│   ├── 📂 store/
│   │   └── learningStore.ts       # Zustand state store
│   │
│   ├── 📂 hooks/                  # Custom React hooks
│   ├── 📂 lib/                    # Utility functions
│   └── 📂 types/                  # TypeScript types
│
├── 📂 public/                     # Static assets
├── package.json                   # Node dependencies
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
└── requirements.txt               # Root Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Mentorly_AI.git
cd Mentorly_AI
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Running the Application

#### Start the Backend Server

```bash
cd backend
python main.py
```

The API will be available at `http://127.0.0.1:8000`

- **API Docs**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

#### Start the Frontend Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check & service status |
| `/health` | GET | Detailed health check with ML status |
| `/api/complete-analysis` | POST | Complete quiz analysis with ML predictions |

## 🧪 Testing

### Run Frontend Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

---

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

### Environment Configuration

The frontend connects to the backend API at the following ports:
- Development: `http://localhost:8000`
- Alternative ports: `3000`, `8080`, `5173`
---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


