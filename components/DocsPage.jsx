"use client";

const endpoints = [
  {
    method: "POST",
    path: "/api/chat",
    desc: "Send a message and receive a streamed AI response via Server-Sent Events.",
    badge: "SSE Stream",
    badgeColor: "badge-cyan",
    body: `{
  "messages": [
    { "role": "user", "content": "Explain quantum computing" }
  ],
  "model": "llama-3.3-70b-versatile",
  "systemPrompt": "You are a helpful assistant.",
  "temperature": 0.7
}`,
    response: `data: {"text": "Quantum computing...", "done": false}
data: {"text": " uses qubits...", "done": false}
data: {"done": true, "usage": {"inputTokens": 12, "outputTokens": 85, "totalTokens": 97}}`,
  },
  {
    method: "POST",
    path: "/api/stripe",
    desc: "Create a Stripe Checkout session for plan subscription.",
    badge: "Stripe",
    badgeColor: "badge-purple",
    body: `{
  "plan": "pro",
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/pricing"
}`,
    response: `{
  "url": "https://checkout.stripe.com/pay/cs_..."
}`,
  },
  {
    method: "GET",
    path: "/api/stripe",
    desc: "Retrieve available pricing plans and their details.",
    badge: "Public",
    badgeColor: "badge-green",
    body: null,
    response: `{
  "plans": {
    "starter": { "name": "Starter", "price": 9, "tokens": 100000 },
    "pro": { "name": "Pro", "price": 29, "tokens": 500000 },
    "enterprise": { "name": "Enterprise", "price": 99, "tokens": 2000000 }
  }
}`,
  },
];

const models = [
  { id: "llama-3.3-70b-versatile", provider: "Meta", ctx: "128K", speed: "Fast", best: "Complex reasoning, analysis" },
  { id: "llama-3.1-8b-instant", provider: "Meta", ctx: "128K", speed: "Instant", best: "Quick tasks, prototyping" },
  { id: "mixtral-8x7b-32768", provider: "Mistral", ctx: "32K", speed: "Fast", best: "Long documents, diverse tasks" },
  { id: "gemma2-9b-it", provider: "Google", ctx: "8K", speed: "Fast", best: "Instruction following, chat" },
];

function MethodBadge({ method }) {
  const colors = { GET: "#34d399", POST: "#a78bfa", DELETE: "#ef4444", PUT: "#f59e0b" };
  return (
    <span style={{
      background: `${colors[method]}22`,
      color: colors[method],
      border: `1px solid ${colors[method]}44`,
      borderRadius: "6px",
      padding: "2px 10px",
      fontSize: "12px",
      fontWeight: "700",
      fontFamily: "JetBrains Mono, monospace",
      letterSpacing: "0.05em",
    }}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <span className="badge badge-cyan" style={{ marginBottom: "16px" }}>📖 Documentation</span>
        <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px" }}>
          NeuralSaaS <span className="gradient-text">API Reference</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.7" }}>
          Full-stack AI SaaS capstone — Day 25 of 25 Days of ML. Built with{" "}
          <strong style={{ color: "var(--text-secondary)" }}>Next.js 15</strong>,{" "}
          <strong style={{ color: "var(--text-secondary)" }}>LangChain</strong>,{" "}
          <strong style={{ color: "var(--text-secondary)" }}>Groq</strong>, and{" "}
          <strong style={{ color: "var(--text-secondary)" }}>Stripe</strong>.
        </p>
      </div>

      {/* Stack overview */}
      <div className="glass-card" style={{ padding: "28px", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>🏗️ Tech Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {[
            { name: "Next.js 15", role: "Full-stack framework", icon: "▲", color: "#a78bfa" },
            { name: "LangChain", role: "AI orchestration", icon: "🦜", color: "#22d3ee" },
            { name: "Groq API", role: "LLM inference", icon: "⚡", color: "#f472b6" },
            { name: "Stripe", role: "Payments & billing", icon: "💳", color: "#34d399" },
            { name: "SSE Streaming", role: "Real-time responses", icon: "📡", color: "#fb923c" },
            { name: "Tailwind CSS", role: "Utility styling", icon: "🎨", color: "#38bdf8" },
          ].map((t) => (
            <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{t.icon}</div>
              <div style={{ fontWeight: "600", fontSize: "14px", color: t.color, marginBottom: "2px" }}>{t.name}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoints */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px" }}>
          🔌 API Endpoints
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {endpoints.map((ep, i) => (
            <div key={i} className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <MethodBadge method={ep.method} />
                <code style={{ fontSize: "15px", color: "var(--text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                  {ep.path}
                </code>
                <span className={`badge ${ep.badgeColor}`} style={{ fontSize: "11px" }}>{ep.badge}</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>{ep.desc}</p>

              {ep.body && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Request Body
                  </div>
                  <pre style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace", overflowX: "auto", lineHeight: "1.6" }}>
                    {ep.body}
                  </pre>
                </div>
              )}

              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Response
                </div>
                <pre style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#34d399", fontFamily: "JetBrains Mono, monospace", overflowX: "auto", lineHeight: "1.6" }}>
                  {ep.response}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Models Table */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px" }}>
          🤖 Available Models
        </h2>
        <div className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid var(--border)" }}>
                {["Model ID", "Provider", "Context", "Speed", "Best For"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: i < models.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <code style={{ fontSize: "13px", color: "#a78bfa", fontFamily: "JetBrains Mono, monospace" }}>{m.id}</code>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "var(--text-secondary)" }}>{m.provider}</td>
                  <td style={{ padding: "14px 16px" }}><span className="badge badge-cyan" style={{ fontSize: "11px" }}>{m.ctx}</span></td>
                  <td style={{ padding: "14px 16px" }}><span className="badge badge-green" style={{ fontSize: "11px" }}>{m.speed}</span></td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{m.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick start */}
      <div className="glass-card" style={{ padding: "28px", background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.04))", border: "1px solid rgba(124,58,237,0.3)" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>🚀 Quick Start</h2>
        <pre style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace", overflowX: "auto", lineHeight: "1.7" }}>
{`# Clone & install
git clone <repo>
cd day25-ai-saas-capstone
npm install

# Configure
cp .env.local.example .env.local
# Add your GROQ_API_KEY and Stripe keys

# Run locally
npm run dev
# Open http://localhost:3000`}
        </pre>
      </div>
    </div>
  );
}
