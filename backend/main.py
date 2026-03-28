from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import ask_question

app = FastAPI(title="NUST Admissions Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this after competition
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def root():
    return {"status": "NUST Chatbot running", "mode": "fully offline"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.message.strip():
        return ChatResponse(reply="Please ask a question.")
    reply = ask_question(request.message)
    return ChatResponse(reply=reply)

@app.get("/health")
def health():
    return {"status": "ok"}