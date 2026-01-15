"""
AI Personalized Learning Platform - FastAPI Backend
Complete backend with ML model integration for learner classification and recommendations
Uses actual ML models (not fallback) for inference.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Optional, Literal, Any
import joblib
import numpy as np
from pathlib import Path
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Personalized Learning API",
    description="Backend API for personalized learning recommendations with ML models",
    version="2.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ============================================================================
# PHASE 1: MODEL LOADING
# ============================================================================

class MLModelManager:
    """
    Manages ML model loading and inference.
    Implements safe loading with validation and fallback only if files are missing.
    """
    
    # Feature schema expected by the model (8 features)
    FEATURE_SCHEMA = [
        'AcademicScore',
        'CourseParticipation', 
        'AttendanceRate',
        'PhysicalActivity',
        'EmotionEngagement',
        'LearningStyle',      # Encoded
        'DeviceUsage',        # Encoded
        'FeedbackScore'
    ]
    
    # Expected categorical fields to encode
    CATEGORICAL_FIELDS = ['LearningStyle', 'DeviceUsage']
    
    # Level mapping from model output to string
    LEVEL_MAPPING = {
        0: "Beginner",
        1: "Intermediate", 
        2: "Advanced",
        "0": "Beginner",
        "1": "Intermediate",
        "2": "Advanced"
    }
    
    # Defaults for fallback encoding
    DEFAULTS = {
        'LearningStyle': 'Visual',
        'DeviceUsage': '10'  # Middle value
    }
    
    def __init__(self):
        self.classifier = None
        self.label_encoders = None
        self.models_loaded = False
        self.using_fallback = False
        self._load_models()
    
    def _load_models(self):
        """
        Safe loading of both .pkl files using joblib.
        Only uses fallback if files are missing.
        """
        model_dir = Path(__file__).parent
        clf_path = model_dir / "learner_classifier.pkl"
        enc_path = model_dir / "label_encoders.pkl"
        
        logger.info("="*60)
        logger.info("LOADING ML MODELS")
        logger.info("="*60)
        
        # Check file existence
        if not clf_path.exists():
            logger.error(f"❌ Classifier not found: {clf_path}")
            self.using_fallback = True
            return
            
        if not enc_path.exists():
            logger.error(f"❌ Encoders not found: {enc_path}")
            self.using_fallback = True
            return
        
        try:
            # Load classifier
            logger.info(f"Loading classifier from: {clf_path}")
            self.classifier = joblib.load(clf_path)
            logger.info(f"✓ Classifier loaded: {type(self.classifier).__name__}")
            
            if hasattr(self.classifier, 'n_features_in_'):
                logger.info(f"  Expected features: {self.classifier.n_features_in_}")
            if hasattr(self.classifier, 'classes_'):
                logger.info(f"  Classes: {list(self.classifier.classes_)}")
            
            # Load label encoders
            logger.info(f"Loading encoders from: {enc_path}")
            self.label_encoders = joblib.load(enc_path)
            logger.info(f"✓ Encoders loaded: {list(self.label_encoders.keys())}")
            
            # Validate encoders
            self._validate_encoders()
            
            self.models_loaded = True
            self.using_fallback = False
            logger.info("✓ ML MODELS READY - Using actual inference")
            
        except Exception as e:
            logger.error(f"❌ Model loading failed: {e}")
            self.using_fallback = True
            self.models_loaded = False
    
    def _validate_encoders(self):
        """Validate that encoders match expected categorical fields."""
        for field in self.CATEGORICAL_FIELDS:
            if field in self.label_encoders:
                encoder = self.label_encoders[field]
                if hasattr(encoder, 'classes_'):
                    logger.info(f"  {field} classes: {list(encoder.classes_)[:5]}...")
                else:
                    logger.warning(f"  {field} encoder has no classes_ attribute")
            else:
                logger.warning(f"  Missing encoder for: {field}")
    
    # ============================================================================
    # PHASE 2: FEATURE PIPELINE
    # ============================================================================
    
    def build_feature_vector(
        self,
        academic_score: float,
        course_participation: float,
        attendance_rate: float,
        physical_activity: float,
        emotion_engagement: float,
        learning_style: str,
        device_usage: Any,
        feedback_score: float
    ) -> np.ndarray:
        """
        Build the feature vector in the exact order expected by the model.
        
        Returns: numpy array of shape (1, 8)
        """
        # Encode categorical features
        learning_style_encoded = self.apply_label_encoder(
            'LearningStyle', 
            learning_style,
            default='Visual'
        )
        
        device_usage_encoded = self.apply_label_encoder(
            'DeviceUsage',
            str(device_usage),  # Convert to string as encoder expects strings
            default='10'
        )
        
        # Build feature vector in correct order
        features = np.array([[
            float(academic_score),
            float(course_participation),
            float(attendance_rate),
            float(physical_activity),
            float(emotion_engagement),
            float(learning_style_encoded),
            float(device_usage_encoded),
            float(feedback_score)
        ]])
        
        logger.debug(f"Feature vector: {features}")
        return features
    
    def apply_label_encoder(self, field: str, value: Any, default: str = None) -> int:
        """
        Apply label encoding for a categorical field.
        Uses fallback_encode_if_unseen for unknown values.
        """
        if not self.label_encoders or field not in self.label_encoders:
            logger.warning(f"No encoder for {field}, returning 0")
            return 0
        
        encoder = self.label_encoders[field]
        value_str = str(value)
        
        return self.fallback_encode_if_unseen(encoder, field, value_str, default)
    
    def fallback_encode_if_unseen(
        self, 
        encoder, 
        field: str, 
        value: str, 
        default: str = None
    ) -> int:
        """
        Handle unseen categories safely.
        If value not in encoder.classes_ → encode to default.
        
        Defaults:
        - LearningStyle = "Visual"
        - DeviceUsage = "10"
        """
        if not hasattr(encoder, 'classes_'):
            return 0
        
        classes = list(encoder.classes_)
        
        # Check if value exists in encoder
        if value in classes:
            return int(encoder.transform([value])[0])
        
        # Value not found - use default
        logger.warning(f"Unseen value '{value}' for {field}")
        
        # Determine fallback
        fallback = default or self.DEFAULTS.get(field)
        
        if fallback and fallback in classes:
            logger.info(f"  Using fallback: {fallback}")
            return int(encoder.transform([fallback])[0])
        
        # Last resort - use first class
        if classes:
            logger.info(f"  Using first class: {classes[0]}")
            return int(encoder.transform([classes[0]])[0])
        
        return 0
    
    def derive_features_from_quiz(
        self, 
        scores: Dict[str, float],
        answers: 'QuizAnswers'
    ) -> Dict[str, Any]:
        """
        Infer ML features from quiz scores and onboarding.
        Used when not all features are provided directly.
        """
        # Calculate average score
        avg_score = float(np.mean(list(scores.values())))
        
        # Calculate participation from answer patterns
        total_questions = sum([len(getattr(answers, s)) for s in scores.keys()])
        total_correct = sum([sum(getattr(answers, s)) for s in scores.keys()])
        participation = min(100.0, (total_correct / max(total_questions, 1)) * 100)
        
        # Estimate engagement from score variance
        score_std = float(np.std(list(scores.values())))
        engagement = max(50.0, min(100.0, 80.0 - (score_std * 0.5)))
        
        # Infer learning style from best subject
        best_subject = max(scores, key=scores.get)
        learning_style_map = {
            "AI": "Visual",
            "ML": "Visual", 
            "CN": "Kinesthetic",
            "OS": "Kinesthetic",
            "DBMS": "Auditory"
        }
        learning_style = learning_style_map.get(best_subject, "Visual")
        
        # Device usage (hours per day estimate)
        device_usage = int(min(20, max(5, engagement / 5)))
        
        return {
            'AcademicScore': avg_score,
            'CourseParticipation': participation,
            'AttendanceRate': 75.0 + (avg_score * 0.2),
            'PhysicalActivity': 60.0,
            'EmotionEngagement': engagement,
            'LearningStyle': learning_style,
            'DeviceUsage': device_usage,
            'FeedbackScore': avg_score * 0.85
        }
    
    # ============================================================================
    # PHASE 3: INFERENCE AND OUTPUT
    # ============================================================================
    
    def predict_level(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict learner level using the ML classifier.
        Converts 0/1/2 output to string labels.
        """
        if self.using_fallback or not self.models_loaded:
            logger.warning("⚠ Using FALLBACK prediction (models not loaded)")
            return self._fallback_predict(features)
        
        try:
            # Build feature vector
            feature_vector = self.build_feature_vector(
                academic_score=features.get('AcademicScore', 50.0),
                course_participation=features.get('CourseParticipation', 50.0),
                attendance_rate=features.get('AttendanceRate', 75.0),
                physical_activity=features.get('PhysicalActivity', 60.0),
                emotion_engagement=features.get('EmotionEngagement', 70.0),
                learning_style=features.get('LearningStyle', 'Visual'),
                device_usage=features.get('DeviceUsage', 10),
                feedback_score=features.get('FeedbackScore', 50.0)
            )
            
            # Make prediction
            prediction_raw = self.classifier.predict(feature_vector)[0]
            
            # Get probabilities if available
            if hasattr(self.classifier, 'predict_proba'):
                proba = self.classifier.predict_proba(feature_vector)[0]
                probabilities = {
                    "Beginner": float(proba[0]) if len(proba) > 0 else 0.33,
                    "Intermediate": float(proba[1]) if len(proba) > 1 else 0.33,
                    "Advanced": float(proba[2]) if len(proba) > 2 else 0.34
                }
                # Get the class index for confidence
                pred_idx = int(prediction_raw) if isinstance(prediction_raw, (int, np.integer)) else list(self.classifier.classes_).index(prediction_raw)
                confidence = float(proba[pred_idx])
            else:
                probabilities = {"Beginner": 0.33, "Intermediate": 0.33, "Advanced": 0.34}
                confidence = 0.8
            
            # Convert to string label
            level = self.LEVEL_MAPPING.get(prediction_raw, "Intermediate")
            
            logger.info(f"🧠 ML PREDICTION: {level} (confidence: {confidence:.2%})")
            logger.info(f"   Raw output: {prediction_raw}")
            logger.info(f"   Probabilities: {probabilities}")
            
            return {
                "level": level,
                "level_code": pred_idx if 'pred_idx' in dir() else list(self.LEVEL_MAPPING.values()).index(level),
                "confidence": confidence,
                "levelConfidence": confidence,
                "probabilities": probabilities,
                "using_ml": True
            }
            
        except Exception as e:
            logger.error(f"❌ ML inference failed: {e}")
            logger.info("Falling back to rule-based prediction")
            return self._fallback_predict(features)
    
    def _fallback_predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Rule-based fallback prediction."""
        academic_score = features.get('AcademicScore', 50.0)
        
        if academic_score >= 75:
            level = "Advanced"
            probs = {"Beginner": 0.1, "Intermediate": 0.25, "Advanced": 0.65}
            confidence = 0.65
        elif academic_score >= 50:
            level = "Intermediate"
            probs = {"Beginner": 0.2, "Intermediate": 0.6, "Advanced": 0.2}
            confidence = 0.6
        else:
            level = "Beginner"
            probs = {"Beginner": 0.7, "Intermediate": 0.2, "Advanced": 0.1}
            confidence = 0.7
        
        logger.warning(f"⚠ FALLBACK PREDICTION: {level}")
        
        return {
            "level": level,
            "level_code": list(self.LEVEL_MAPPING.values()).index(level),
            "confidence": confidence,
            "levelConfidence": confidence,
            "probabilities": probs,
            "using_ml": False
        }

# Initialize model manager
model_manager = MLModelManager()

# ============================================================================
# PYDANTIC SCHEMAS (PHASE 4: REACT INTEGRATION)
# ============================================================================

class QuizAnswers(BaseModel):
    """Quiz answers for all subjects - matches React payload format"""
    OS: List[int] = Field(..., description="Operating Systems answers (0 or 1)")
    DBMS: List[int] = Field(..., description="Database Management Systems answers")
    CN: List[int] = Field(..., description="Computer Networks answers")
    AI: List[int] = Field(..., description="Artificial Intelligence answers")
    ML: List[int] = Field(..., description="Machine Learning answers")
    
    @field_validator('OS', 'DBMS', 'CN', 'AI', 'ML')
    @classmethod
    def validate_answers(cls, v):
        if not all(answer in [0, 1] for answer in v):
            raise ValueError("Answers must be 0 or 1")
        return v

class QuizSubmission(BaseModel):
    """
    Complete quiz submission from React frontend.
    
    Expected payload:
    {
        "studentId": "abc",
        "answers": {
            "OS": [0, 1, 1, 0, 1],
            "DBMS": [1, 1, 0, 1, 0],
            ...
        }
    }
    """
    studentId: str = Field(..., min_length=1)
    answers: QuizAnswers
    timestamp: Optional[str] = None

class SubjectScores(BaseModel):
    """Subject-wise performance scores"""
    OS: float
    DBMS: float
    CN: float
    AI: float
    ML: float

class Recommendation(BaseModel):
    """Single learning recommendation"""
    subject: str
    topic: str
    format: Literal["Video", "Reading", "Practice", "Interactive"]
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    priority: Literal["High", "Medium", "Low"]
    estimatedTime: str
    description: str

class CompleteResponse(BaseModel):
    """
    Complete response for React frontend.
    
    Response format:
    {
        "scores": {...},
        "level": "Beginner | Intermediate | Advanced",
        "weakSubjects": [],
        "strongSubjects": [],
        "recommendations": []
    }
    """
    studentId: str
    scores: SubjectScores
    averageScore: float
    level: str
    levelConfidence: float
    levelProbabilities: Dict[str, float]
    weakSubjects: List[str]
    strongSubjects: List[str]
    recommendations: List[Recommendation]
    timestamp: str
    using_ml: bool = True

# ============================================================================
# RECOMMENDATION ENGINE
# ============================================================================

class RecommendationEngine:
    """Generate personalized learning recommendations"""
    
    SUBJECT_TOPICS = {
        "OS": {
            "Beginner": [
                {"topic": "Introduction to OS Concepts", "format": "Video", "time": "15 min"},
                {"topic": "Process Management Basics", "format": "Reading", "time": "20 min"},
                {"topic": "Memory Management Fundamentals", "format": "Interactive", "time": "25 min"},
            ],
            "Intermediate": [
                {"topic": "CPU Scheduling Algorithms", "format": "Video", "time": "30 min"},
                {"topic": "Deadlock Detection & Prevention", "format": "Practice", "time": "45 min"},
                {"topic": "Virtual Memory Management", "format": "Reading", "time": "35 min"},
            ],
            "Advanced": [
                {"topic": "Advanced Synchronization", "format": "Practice", "time": "60 min"},
                {"topic": "File System Optimization", "format": "Reading", "time": "40 min"},
                {"topic": "Real-Time Operating Systems", "format": "Video", "time": "45 min"},
            ]
        },
        "DBMS": {
            "Beginner": [
                {"topic": "Database Fundamentals", "format": "Video", "time": "20 min"},
                {"topic": "SQL Basics & Queries", "format": "Interactive", "time": "30 min"},
                {"topic": "ER Modeling Concepts", "format": "Reading", "time": "25 min"},
            ],
            "Intermediate": [
                {"topic": "Normalization Techniques", "format": "Practice", "time": "40 min"},
                {"topic": "Transaction Management", "format": "Video", "time": "35 min"},
                {"topic": "Indexing & Query Optimization", "format": "Reading", "time": "45 min"},
            ],
            "Advanced": [
                {"topic": "Concurrency Control Mechanisms", "format": "Practice", "time": "60 min"},
                {"topic": "Distributed Database Systems", "format": "Reading", "time": "50 min"},
                {"topic": "NoSQL Database Architectures", "format": "Video", "time": "45 min"},
            ]
        },
        "CN": {
            "Beginner": [
                {"topic": "Network Fundamentals & OSI Model", "format": "Video", "time": "25 min"},
                {"topic": "IP Addressing Basics", "format": "Interactive", "time": "30 min"},
                {"topic": "Network Topologies", "format": "Reading", "time": "20 min"},
            ],
            "Intermediate": [
                {"topic": "Routing Protocols (RIP, OSPF)", "format": "Video", "time": "40 min"},
                {"topic": "TCP/UDP Protocol Analysis", "format": "Practice", "time": "45 min"},
                {"topic": "Network Security Basics", "format": "Reading", "time": "35 min"},
            ],
            "Advanced": [
                {"topic": "Advanced Routing & BGP", "format": "Practice", "time": "60 min"},
                {"topic": "Network Performance Optimization", "format": "Reading", "time": "50 min"},
                {"topic": "Software Defined Networking", "format": "Video", "time": "45 min"},
            ]
        },
        "AI": {
            "Beginner": [
                {"topic": "Introduction to AI & Agents", "format": "Video", "time": "20 min"},
                {"topic": "Search Algorithms (BFS, DFS)", "format": "Interactive", "time": "35 min"},
                {"topic": "Problem Solving Basics", "format": "Reading", "time": "25 min"},
            ],
            "Intermediate": [
                {"topic": "Heuristic Search (A*, Hill Climbing)", "format": "Practice", "time": "45 min"},
                {"topic": "Knowledge Representation", "format": "Video", "time": "40 min"},
                {"topic": "Logic & Reasoning Systems", "format": "Reading", "time": "35 min"},
            ],
            "Advanced": [
                {"topic": "Advanced Planning Algorithms", "format": "Practice", "time": "60 min"},
                {"topic": "Natural Language Processing", "format": "Video", "time": "50 min"},
                {"topic": "Computer Vision Fundamentals", "format": "Reading", "time": "55 min"},
            ]
        },
        "ML": {
            "Beginner": [
                {"topic": "Introduction to Machine Learning", "format": "Video", "time": "20 min"},
                {"topic": "Linear Regression Basics", "format": "Interactive", "time": "30 min"},
                {"topic": "Data Preprocessing", "format": "Practice", "time": "35 min"},
            ],
            "Intermediate": [
                {"topic": "Classification Algorithms", "format": "Practice", "time": "45 min"},
                {"topic": "Decision Trees & Random Forests", "format": "Video", "time": "40 min"},
                {"topic": "Model Evaluation Metrics", "format": "Reading", "time": "30 min"},
            ],
            "Advanced": [
                {"topic": "Neural Networks & Deep Learning", "format": "Practice", "time": "60 min"},
                {"topic": "Ensemble Methods & Boosting", "format": "Video", "time": "50 min"},
                {"topic": "Advanced Feature Engineering", "format": "Reading", "time": "45 min"},
            ]
        }
    }
    
    DESCRIPTIONS = {
        "OS": "Master operating system concepts essential for system programming and architecture",
        "DBMS": "Learn database design, SQL, and data management techniques",
        "CN": "Understand network protocols, architecture, and communication systems",
        "AI": "Explore artificial intelligence algorithms and problem-solving techniques",
        "ML": "Develop machine learning models and predictive analytics skills"
    }
    
    def generate_recommendations(
        self,
        scores: Dict[str, float],
        level: str,
        weak_subjects: List[str],
        strong_subjects: List[str]
    ) -> List[Recommendation]:
        """Generate personalized recommendations based on performance"""
        
        recommendations = []
        
        # Priority 1: Focus on weak subjects
        for subject in weak_subjects:
            topics = self.SUBJECT_TOPICS.get(subject, {}).get(level, [])
            for i, topic_data in enumerate(topics[:2]):
                recommendations.append(Recommendation(
                    subject=subject,
                    topic=topic_data["topic"],
                    format=topic_data["format"],
                    difficulty=level,
                    priority="High" if i == 0 else "Medium",
                    estimatedTime=topic_data["time"],
                    description=f"{self.DESCRIPTIONS[subject]} - Focus area for improvement"
                ))
        
        # Priority 2: Strong subjects reinforcement
        for subject in strong_subjects[:2]:
            topics = self.SUBJECT_TOPICS.get(subject, {}).get(level, [])
            if topics:
                topic_data = topics[0]
                recommendations.append(Recommendation(
                    subject=subject,
                    topic=topic_data["topic"],
                    format=topic_data["format"],
                    difficulty=level,
                    priority="Low",
                    estimatedTime=topic_data["time"],
                    description=f"{self.DESCRIPTIONS[subject]} - Continue building on your strength"
                ))
        
        return recommendations[:8]

recommendation_engine = RecommendationEngine()

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def calculate_subject_score(answers: List[int]) -> float:
    """Calculate percentage score for a subject"""
    if not answers:
        return 0.0
    correct = sum(answers)
    total = len(answers)
    return round((correct / total) * 100, 2)

def classify_subjects(scores: Dict[str, float], threshold: float = 60.0) -> tuple:
    """Classify subjects as weak or strong based on threshold"""
    weak = [subject for subject, score in scores.items() if score < threshold]
    strong = [subject for subject, score in scores.items() if score >= threshold]
    weak.sort(key=lambda x: scores[x])
    strong.sort(key=lambda x: scores[x], reverse=True)
    return weak, strong

# ============================================================================
# API ROUTES
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "AI Personalized Learning API",
        "version": "2.0.0",
        "ml_status": "active" if model_manager.models_loaded else "fallback",
        "models_loaded": model_manager.models_loaded,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models_loaded": model_manager.models_loaded,
        "using_fallback": model_manager.using_fallback,
        "classifier_type": type(model_manager.classifier).__name__ if model_manager.classifier else "None",
        "encoder_fields": list(model_manager.label_encoders.keys()) if model_manager.label_encoders else [],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/complete-analysis", response_model=CompleteResponse)
async def complete_analysis(submission: QuizSubmission):
    """
    Complete end-to-end analysis pipeline using ML models.
    
    React sends:
    {
        "studentId": "abc",
        "answers": { "OS": [0,1], "DBMS": [1,1], ... }
    }
    
    Backend returns:
    {
        "scores": {...},
        "level": "Beginner | Intermediate | Advanced",
        "weakSubjects": [],
        "strongSubjects": [],
        "recommendations": []
    }
    """
    try:
        logger.info("="*60)
        logger.info(f"📊 ANALYSIS REQUEST: {submission.studentId}")
        logger.info("="*60)
        
        # Step 1: Score the quiz
        scores_dict = {
            "OS": calculate_subject_score(submission.answers.OS),
            "DBMS": calculate_subject_score(submission.answers.DBMS),
            "CN": calculate_subject_score(submission.answers.CN),
            "AI": calculate_subject_score(submission.answers.AI),
            "ML": calculate_subject_score(submission.answers.ML)
        }
        logger.info(f"Scores: {scores_dict}")
        
        # Step 2: Derive features from quiz
        features = model_manager.derive_features_from_quiz(scores_dict, submission.answers)
        logger.info(f"Derived features: {features}")
        
        # Step 3: ML PREDICTION (not fallback!)
        prediction = model_manager.predict_level(features)
        logger.info(f"Prediction: {prediction}")
        
        # Step 4: Classify subjects
        weak_subjects, strong_subjects = classify_subjects(scores_dict)
        
        # Step 5: Generate recommendations
        recommendations = recommendation_engine.generate_recommendations(
            scores_dict,
            prediction["level"],
            weak_subjects,
            strong_subjects
        )
        
        # Step 6: Calculate average score
        avg_score = round(float(np.mean(list(scores_dict.values()))), 2)
        
        response = CompleteResponse(
            studentId=submission.studentId,
            scores=SubjectScores(**scores_dict),
            averageScore=avg_score,
            level=prediction["level"],
            levelConfidence=prediction["levelConfidence"],
            levelProbabilities=prediction["probabilities"],
            weakSubjects=weak_subjects,
            strongSubjects=strong_subjects,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat(),
            using_ml=prediction.get("using_ml", True)
        )
        
        logger.info(f"✓ Analysis complete: {prediction['level']} ({'ML' if prediction.get('using_ml') else 'Fallback'})")
        return response
        
    except Exception as e:
        logger.error(f"❌ Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 AI Personalized Learning API v2.0")
    print("="*60)
    print(f"📍 Server: http://127.0.0.1:8000")
    print(f"📚 Docs: http://127.0.0.1:8000/docs")
    print(f"🧠 ML Models: {'LOADED' if model_manager.models_loaded else 'FALLBACK'}")
    print("="*60 + "\n")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)