"use client";
import { useState } from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "pricing", label: "Pricing", icon: "💎" },
    { id: "docs", label: "Docs", icon: "📖" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <div className="nav-logo" onClick={() => setActiveTab("chat")} style={{ cursor: "pointer" }}>
          <div className="logo-icon pulse-glow">🧠</div>
          <div>
            <span className="logo-text gradient-text">NeuralSaaS</span>
            <span className="badge badge-purple" style={{ marginLeft: "8px", fontSize: "10px" }}>
              Day 25
            </span>
          </div>
        </div>

        {/* Desktop tabs */}
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              id={`nav-${tab.id}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="nav-cta">
          <button className="btn-ghost" style={{ fontSize: "14px" }}>Sign In</button>
          <button className="btn-primary" style={{ fontSize: "14px", padding: "8px 20px" }} onClick={() => setActiveTab("pricing")}>
            <span>Get Started</span>
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setMobileOpen(false); }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(2, 0, 8, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon { font-size: 28px; }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .nav-tabs {
          display: flex;
          gap: 4px;
        }
        .nav-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .nav-tab:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
        .nav-tab.active {
          color: var(--text-secondary);
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
        }
        .nav-cta { display: flex; align-items: center; gap: 8px; }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 12px 24px;
          border-top: 1px solid var(--border);
          gap: 4px;
        }
        .mobile-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .mobile-tab.active { color: var(--text-secondary); background: rgba(124,58,237,0.15); }
        @media (max-width: 768px) {
          .nav-tabs { display: none; }
          .mobile-menu-btn { display: block; }
          .mobile-menu { display: flex; }
          .btn-ghost { display: none; }
        }
      `}</style>
    </nav>
  );
}
