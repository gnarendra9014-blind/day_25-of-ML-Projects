"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", badge: "Fast", color: "badge-purple" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", badge: "Instant", color: "badge-cyan" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", badge: "32K ctx", color: "badge-pink" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", badge: "Google", color: "badge-green" },
];

const SYSTEM_PROMPTS = [
  { id: "default", label: "General Assistant", prompt: "" },
  { id: "coder", label: "Code Expert", prompt: "You are an expert software engineer. Write clean, well-commented code. Always explain your approach before coding." },
  { id: "analyst", label: "Data Analyst", prompt: "You are a data analyst. Provide structured analysis with bullet points, metrics, and actionable insights." },
  { id: "writer", label: "Creative Writer", prompt: "You are a creative writing assistant. Be imaginative, vivid, and engaging. Use rich descriptive language." },
  { id: "tutor", label: "AI Tutor", prompt: "You are a patient, thorough tutor. Break concepts into simple steps. Use examples and analogies." },
];

function MarkdownRenderer({ content }) {
  const rendered = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><div class="code-header"><span class="code-lang">${lang || "code"}</span></div><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3 class='md-h3'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='md-h2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='md-h1'>$1</h1>")
    .replace(/^- (.+)$/gm, "<li class='md-li'>$1</li>")
    .replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='md-ul'>$1</ul>")
    .replace(/\n\n/g, "</p><p class='md-p'>")
    .replace(/^(?!<[hupocl])(.+)$/gm, "<p class='md-p'>$1</p>");

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

export default function ChatEngine({ usage, setUsage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(SYSTEM_PROMPTS[0]);
  const [temperature, setTemperature] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input.trim(), id: Date.now() };
    const currentInput = input.trim();
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    const assistantId = Date.now() + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId, streaming: true }]);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel.id,
          systemPrompt: selectedPrompt.prompt,
          temperature,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                );
              }
              if (data.done && data.usage) {
                setUsage((prev) => ({
                  totalTokens: (prev?.totalTokens || 0) + data.usage.totalTokens,
                  requests: (prev?.requests || 0) + 1,
                  lastUsage: data.usage,
                }));
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, streaming: false, usage: data.usage } : m))
                );
              }
            } catch (_) {}
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "⚠️ Error: " + err.message, streaming: false, error: true }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [input, messages, isStreaming, selectedModel, selectedPrompt, temperature, setUsage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setMessages((prev) => prev.map((m) => ({ ...m, streaming: false })));
  };

  const clearChat = () => {
    setMessages([]);
    setUsage(null);
  };

  return (
    <div className="chat-container">
      {/* Top Bar */}
      <div className="chat-topbar">
        <div className="model-selector">
          {MODELS.map((m) => (
            <button
              key={m.id}
              className={`model-btn ${selectedModel.id === m.id ? "active" : ""}`}
              onClick={() => setSelectedModel(m)}
              title={m.name}
            >
              <span className={`badge ${m.color}`} style={{ fontSize: "11px", padding: "2px 8px" }}>
                {m.badge}
              </span>
              <span className="model-name">{m.name}</span>
            </button>
          ))}
        </div>
        <div className="chat-actions">
          <button className="btn-ghost" onClick={() => setShowSettings(!showSettings)} title="Settings">
            ⚙️
          </button>
          <button className="btn-ghost" onClick={clearChat} title="Clear chat">
            🗑️
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel glass-card" style={{ margin: "0 16px 12px", padding: "16px" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                System Persona
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SYSTEM_PROMPTS.map((p) => (
                  <button
                    key={p.id}
                    className={`btn-ghost ${selectedPrompt.id === p.id ? "active-ghost" : ""}`}
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      border: selectedPrompt.id === p.id ? "1px solid var(--accent-violet)" : "1px solid var(--border)",
                      borderRadius: "8px",
                      color: selectedPrompt.id === p.id ? "var(--text-secondary)" : "var(--text-muted)",
                    }}
                    onClick={() => setSelectedPrompt(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ minWidth: "200px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Temperature: <strong style={{ color: "var(--text-secondary)" }}>{temperature}</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-violet)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
                <span>Precise</span><span>Creative</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon float">🧠</div>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Ready to assist</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "360px", textAlign: "center" }}>
              Ask anything — code, analysis, writing, or complex reasoning. Powered by{" "}
              <span style={{ color: "var(--text-secondary)" }}>{selectedModel.name}</span>.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              {["Explain quantum computing", "Write a Python web scraper", "Analyze market trends", "Debug my code"].map((s) => (
                <button
                  key={s}
                  className="btn-ghost"
                  style={{ fontSize: "13px", border: "1px solid var(--border)", borderRadius: "20px", padding: "8px 16px" }}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className={msg.role === "user" ? "message-user" : "message-ai"}>
              {msg.role === "user" ? (
                <p style={{ fontSize: "15px", whiteSpace: "pre-wrap" }}>{msg.content}</p>
              ) : (
                <>
                  <MarkdownRenderer content={msg.content || "▋"} />
                  {msg.streaming && <span className="cursor-blink" />}
                  {msg.usage && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: "12px" }}>
                      <span className="badge badge-purple">↑ {msg.usage.inputTokens}tk</span>
                      <span className="badge badge-cyan">↓ {msg.usage.outputTokens}tk</span>
                      <span className="badge badge-green">∑ {msg.usage.totalTokens}tk</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="input-field"
            placeholder={`Message ${selectedModel.name}... (Shift+Enter for newline)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ resize: "none", minHeight: "52px", maxHeight: "200px", paddingRight: "56px", borderRadius: "16px" }}
          />
          <button
            className="send-btn"
            onClick={isStreaming ? stopStreaming : sendMessage}
            disabled={!input.trim() && !isStreaming}
            id={isStreaming ? "stop-btn" : "send-btn"}
          >
            {isStreaming ? "⏹" : "↑"}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
          NeuralSaaS may produce inaccurate information. Verify important facts.
        </p>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary);
        }
        .chat-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 8px;
        }
        .model-selector {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .model-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-muted);
          font-size: 13px;
          font-family: 'Inter', sans-serif;
        }
        .model-btn.active {
          border-color: var(--accent-violet);
          background: rgba(139,92,246,0.1);
          color: var(--text-secondary);
        }
        .model-btn:hover { border-color: var(--accent-violet); color: var(--text-primary); }
        .model-name { display: none; }
        @media (min-width: 640px) { .model-name { display: inline; } }
        .chat-actions { display: flex; gap: 4px; }
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .empty-icon { font-size: 56px; margin-bottom: 20px; }
        .message-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .message-wrapper.user { flex-direction: row-reverse; }
        .message-avatar { font-size: 20px; flex-shrink: 0; margin-top: 4px; }
        .input-area { padding: 16px; border-top: 1px solid var(--border); }
        .input-wrapper { position: relative; }
        .send-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 20px rgba(124,58,237,0.4); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        :global(.markdown-body) { font-size: 15px; line-height: 1.7; color: var(--text-primary); }
        :global(.md-p) { margin: 6px 0; }
        :global(.md-h1) { font-size: 22px; font-weight: 700; margin: 12px 0 8px; color: var(--text-primary); }
        :global(.md-h2) { font-size: 18px; font-weight: 600; margin: 10px 0 6px; color: var(--text-primary); }
        :global(.md-h3) { font-size: 16px; font-weight: 600; margin: 8px 0 4px; color: var(--text-secondary); }
        :global(.md-ul) { margin: 8px 0 8px 20px; }
        :global(.md-li) { margin: 4px 0; list-style: disc; }
        :global(.code-block) {
          background: rgba(0,0,0,0.4);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }
        :global(.code-header) {
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid var(--border);
        }
        :global(.code-lang) { font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
        :global(.code-block code) {
          display: block;
          padding: 12px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #e2e8f0;
          overflow-x: auto;
          white-space: pre;
          line-height: 1.6;
        }
        :global(.inline-code) {
          background: rgba(124,58,237,0.2);
          color: #a78bfa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
