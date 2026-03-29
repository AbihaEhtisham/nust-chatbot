# NUST Admissions Chatbot 🎓

A fully offline AI-powered chatbot for NUST admissions queries, 
built with a RAG pipeline.

## Tech Stack
- 🦙 Llama 3.2 (local LLM via Ollama)
- 🗄️ ChromaDB (vector store)
- ⚡ FastAPI + LangChain (backend)
- ⚛️ React + Vite (frontend)

## How to Run

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python ingest.py
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev
