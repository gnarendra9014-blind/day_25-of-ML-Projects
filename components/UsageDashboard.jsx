"use client";

export default function UsageDashboard({ usage }) {
  const MAX_TOKENS = 100000; // Starter plan
  const used = usage?.totalTokens || 0;
  const pct = Math.min((used / MAX_TOKENS) * 100, 100);

  const stats = [
    { label: "Tokens Used", value: used.toLocaleString(), sub: `/ ${MAX_TOKENS.toLocaleString()} limit`, icon: "⚡", color: "#a78bfa" },
    { label: "API Requests", value: usage?.requests || 0, sub: "this session", icon: "📡", color: "#22d3ee" },
    { label: "Last Input", value: usage?.lastUsage?.inputTokens || 0, sub: "tokens", icon: "↑", color: "#f472b6" },
    { label: "Last Output", value: usage?.lastUsage?.outputTokens || 0, sub: "tokens", icon: "↓", color: "#34d399" },
  ];

  const barColor = pct < 60 ? "#34d399" : pct < 85 ? "#f59e0b" : "#ef4444";

  return (
    <div className="usage-dashboard">
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Usage Dashboard
        </h3>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Token meter */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Token Usage</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>{pct.toFixed(1)}%</span>
          </div>
          <div className="token-bar">
            <div
              className="token-bar-fill"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}aa)` }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{used.toLocaleString()} used</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{(MAX_TOKENS - used).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "12px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", align: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px" }}>{s.icon}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: s.color }}>{s.value.toLocaleString?.() ?? s.value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Plan badge */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.05))",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px" }}>Current Plan</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)" }}>🆓 Free Tier</div>
            </div>
            <span className="badge badge-purple">Upgrade →</span>
          </div>
        </div>

        {/* Model capability chart */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Model Speeds
          </div>
          {[
            { name: "Llama 3.3 70B", speed: 85, color: "#a78bfa" },
            { name: "Llama 3.1 8B", speed: 98, color: "#22d3ee" },
            { name: "Mixtral 8x7B", speed: 72, color: "#f472b6" },
            { name: "Gemma 2 9B", speed: 88, color: "#34d399" },
          ].map((m) => (
            <div key={m.name} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.name}</span>
                <span style={{ fontSize: "11px", color: m.color }}>{m.speed}%</span>
              </div>
              <div className="token-bar">
                <div style={{ height: "100%", width: `${m.speed}%`, background: m.color, borderRadius: "3px", transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
