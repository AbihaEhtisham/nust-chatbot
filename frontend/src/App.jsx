import { useState, useRef, useEffect, useCallback } from "react"
import "./App.css"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

const SUGGESTED = [
  "What are the entry test requirements?",
  "Which programs does NUST offer?",
  "What is the merit criteria for admission?",
  "How do I apply to NUST?",
]

function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  )
}

function Message({ msg, index }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`message-row ${msg.role} ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.03}s` }}
    >
      {msg.role === "bot" && (
        <div className="avatar bot-avatar">
          <img src="/logo.png" alt="NUST" className="avatar-logo" />
        </div>
      )}
      <div className={`bubble ${msg.role}`}>
        {msg.text}
        {msg.role === "bot" && (
          <div className="bubble-timestamp">{msg.time}</div>
        )}
      </div>
      {msg.role === "user" && (
        <div className="avatar user-avatar">
          <span>You</span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Assalam-u-Alaikum! I'm the NUST Admissions Assistant — powered by AI, running fully offline. Ask me anything about admissions, programs, entry tests, or campus life.",
      time: now(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const send = useCallback(async (text) => {
    const question = (text || input).trim()
    if (!question || loading) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: question, time: now() }])
    setLoading(true)

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "bot", text: data.reply, time: now() }])
    } catch {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Could not reach the local server. Please ensure the FastAPI backend is running on port 8000.",
        time: now(),
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, loading])

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="app-shell">
      {/* Animated background */}
      <div className="bg-layer">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-grid" />
        <div className="watermark">
          <img src="/logo.png" alt="" className="wm-logo" />
        </div>
      </div>

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="NUST" className="sidebar-logo" />
          <div>
            <div className="sidebar-title">NUST</div>
            <div className="sidebar-sub">Admissions Assistant</div>
          </div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">About</div>
          <p className="sidebar-text">
            This AI assistant answers questions about NUST admissions, programs, and entry tests — running fully offline using Llama 3 and ChromaDB.
          </p>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Quick Links</div>
          <a className="sidebar-link" href="https://nust.edu.pk/faqs/" target="_blank" rel="noreferrer">📖 Official FAQ</a>
          <a className="sidebar-link" href="https://nust.edu.pk/admissions/" target="_blank" rel="noreferrer">🎓 Admissions Portal</a>
          <a className="sidebar-link" href="https://nust.edu.pk/programs/" target="_blank" rel="noreferrer">📚 Programs</a>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Tech Stack</div>
          <div className="sidebar-badge">🦙 Llama 3.2 (local)</div>
          <div className="sidebar-badge">🗄️ ChromaDB RAG</div>
          <div className="sidebar-badge">⚡ FastAPI backend</div>
          <div className="sidebar-badge">✅ 100% offline</div>
        </div>
        <div className="sidebar-footer">Defining Futures · NUST H-12 Islamabad</div>
      </aside>

      {/* Main chat panel */}
      <div className="chat-panel">

        {/* Header */}
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(s => !s)}>
            <span /><span /><span />
          </button>
          <div className="header-brand">
            <div className="header-logo-wrap">
              <img src="/logo.png" alt="NUST" className="header-logo" />
              <div className="logo-ring" />
            </div>
            <div>
              <div className="header-title">NUST Admissions Assistant</div>
              <div className="header-sub">
                <span className="status-dot" />
                Offline AI · Powered by Llama 3
              </div>
            </div>
          </div>
          <div className="header-badge">AI</div>
        </header>

        {/* Messages */}
        <main className="chat-body">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} index={i} />
          ))}

          {loading && (
            <div className="message-row bot visible">
              <div className="avatar bot-avatar">
                <img src="/logo.png" alt="NUST" className="avatar-logo" />
              </div>
              <div className="bubble bot loading-bubble">
                <TypingDots />
              </div>
            </div>
          )}

          {/* Suggested questions — shown only at start */}
          {messages.length === 1 && !loading && (
            <div className="suggestions-wrap">
              <div className="suggestions-label">Suggested questions</div>
              <div className="suggestions-grid">
                {SUGGESTED.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </main>

        {/* Input area */}
        <footer className="chat-footer">
          <div className="input-wrap">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about admissions, programs, entry tests…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />
            <button
              className={`send-btn ${loading ? "loading" : ""} ${input.trim() ? "active" : ""}`}
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              {loading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" className="spin-circle" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <div className="footer-note">Running locally · No data leaves your device</div>
        </footer>
      </div>
    </div>
  )
}