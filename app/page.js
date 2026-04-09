"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatEngine from "@/components/ChatEngine";
import PricingSection from "@/components/PricingSection";
import UsageDashboard from "@/components/UsageDashboard";
import DocsPage from "@/components/DocsPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const [usage, setUsage] = useState(null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Ambient glow orbs */}
      <div
        className="glow-orb"
        style={{ width: "600px", height: "600px", background: "rgba(124,58,237,0.12)", top: "-200px", left: "-200px" }}
      />
      <div
        className="glow-orb"
        style={{ width: "500px", height: "500px", background: "rgba(236,72,153,0.08)", top: "50%", right: "-150px" }}
      />
      <div
        className="glow-orb"
        style={{ width: "400px", height: "400px", background: "rgba(6,182,212,0.06)", bottom: "0", left: "30%" }}
      />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {activeTab === "chat" && (
          <div className="chat-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <UsageDashboard usage={usage} />
            </aside>

            {/* Main chat */}
            <div className="chat-main">
              <ChatEngine usage={usage} setUsage={setUsage} />
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "40px", paddingBottom: "60px" }}>
            <PricingSection />
          </div>
        )}

        {activeTab === "docs" && (
          <div style={{ minHeight: "calc(100vh - 64px)" }}>
            <DocsPage />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "13px",
          background: "rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span>🧠 <strong style={{ color: "var(--text-secondary)" }}>NeuralSaaS</strong> — Day 25 of 25 Days of ML</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Built with Next.js + LangChain + Groq + Stripe</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>🔒 Powered by Groq Ultra-Fast Inference</span>
        </div>
      </footer>

      <style jsx>{`
        .chat-layout {
          display: flex;
          height: calc(100vh - 64px);
        }
        .sidebar {
          width: 280px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          overflow-y: auto;
          background: rgba(0,0,0,0.2);
        }
        .chat-main {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 900px) {
          .chat-layout { flex-direction: column; height: auto; min-height: calc(100vh - 64px); }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
          .chat-main { flex: 1; min-height: 600px; }
        }
        @media (max-width: 640px) {
          .sidebar { display: none; }
          .chat-main { min-height: calc(100vh - 64px); }
        }
      `}</style>
    </div>
  );
}
