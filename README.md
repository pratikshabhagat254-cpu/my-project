# 🍏 Smart Food Intake & Health Monitoring System

A complete production-ready application to accurately track food intake, perform multi-modal entries (text & voice), compute nutritional value seamlessly, and offer specialized health recommendations—with special intelligence geared towards diabetic management and helping users to stay motivated in healthy living.

---

## 🎨 Tech Stack 
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend API**: Node.js (Express)
- **Database**: MongoDB
- **Machine Learning (Nutrition/CV)**: Python (FastAPI, OpenCV)

---

## 📂 Project Structure

```text
smart_food_monitor/
├── frontend/                     # React App
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Complex route views (Dashboard, Intake, Profile)
│   │   ├── services/             # API calls and HTTP logic
│   │   ├── context/              # Global state management
│   │   └── App.jsx               # Entry component
│   └── package.json
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── models/               # MongoDB user & food schemas
│   │   ├── routes/               # API endpoints
│   │   └── index.js              # Entry file
│   └── package.json
│
└── ml-service/                   # Python FastAPI Machine Learning backend
    ├── api/                      # Routing layer for ML predictions
    ├── models/                   # Image processing & NLP models
    ├── main.py                   # FastAPI application
    └── requirements.txt
```

---

## 🚀 Step-by-Step Setup Guide

### prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB instance running locally or Atlas URI.

### 1️⃣ Machine Learning Service Setup
The ML microservice processes image recognition (for meals) and advanced NLP text translation/parsing.
```bash
cd ml-service
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2️⃣ Backend Service Setup
The robust Node.js backend handles state, profiles, and orchestrates calls between the frontend and the ML service.
```bash
cd backend
npm install
# Ensure you configure your .env file
npm run dev # Starts server on 5000
```

### 3️⃣ Frontend Setup
The modern React UI powered by Vite and styled with Tailwind CSS.
```bash
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev # Starts client on 5173
```

---

## 🧭 Sub-Systems Implemented

1. **User Profile System**: Fully responsive demographic layout to tailor macros intelligently.
2. **Multi-Mode Food Input**: Type in foods naturally or hit the microphone button for seamless voice-to-text NLP mapping.
3. **Diabetic Intelligence**: Advanced tracking to flag high-glycemic or sugar-heavy items.
4. **Smart Alerts**: Context-based warnings and positive suggestions (e.g., "15m walk recommended").
