"use client";
import { useState } from "react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    period: "/mo",
    tokens: "100K",
    badge: null,
    features: [
      "100,000 tokens / month",
      "3 AI models (Llama, Mixtral, Gemma)",
      "Persistent chat history",
      "REST API access",
      "Email support",
    ],
    cta: "Start Free Trial",
    color: "var(--border)",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "/mo",
    tokens: "500K",
    badge: "Most Popular",
    features: [
      "500,000 tokens / month",
      "All 4 AI models",
      "Priority queue (2× faster)",
      "Advanced analytics dashboard",
      "Custom system prompts",
      "Priority support",
    ],
    cta: "Go Pro",
    color: "var(--accent-purple)",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "/mo",
    tokens: "2M",
    badge: "Best Value",
    features: [
      "2,000,000 tokens / month",
      "Custom fine-tuned models",
      "Dedicated infrastructure",
      "99.9% SLA guarantee",
      "White-label option",
      "24/7 dedicated support",
    ],
    cta: "Contact Sales",
    color: "var(--accent-pink)",
  },
];

export default function PricingSection({ onPlanSelect }) {
  const [loading, setLoading] = useState(null);
  const [billing, setBilling] = useState("monthly");

  const handleCheckout = async (plan) => {
    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (data.demo) {
        // Demo mode notification
        alert(`🎉 Demo Mode: "${plan.name}" plan selected!\n\nIn production, this would redirect to Stripe Checkout.\n\nAdd your real Stripe keys to .env.local to activate payments.`);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-section">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <span className="badge badge-purple" style={{ marginBottom: "16px" }}>💎 Pricing</span>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", marginBottom: "16px" }}>
          Simple, <span className="gradient-text">transparent</span> pricing
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "500px", margin: "0 auto 24px" }}>
          Start free, scale as you grow. No hidden fees — cancel anytime.
        </p>

        {/* Billing toggle */}
        <div style={{ display: "inline-flex", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "4px", gap: "4px" }}>
          {["monthly", "annual"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                background: billing === b ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "transparent",
                color: billing === b ? "white" : "var(--text-muted)",
                transition: "all 0.2s ease",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {b === "annual" ? "Annual (save 20%)" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => {
          const price = billing === "annual" ? Math.floor(plan.price * 0.8) : plan.price;
          return (
            <div key={plan.id} className={`pricing-card ${plan.featured ? "featured" : ""}`}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                  <span className={`badge ${plan.featured ? "badge-purple" : "badge-pink"}`}>{plan.badge}</span>
                </div>
              )}

              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "42px", fontWeight: "800", background: plan.featured ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "none", WebkitBackgroundClip: plan.featured ? "text" : "none", WebkitTextFillColor: plan.featured ? "transparent" : "inherit" }}>
                    ${price}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "15px" }}>{plan.period}</span>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <span className="badge badge-cyan" style={{ fontSize: "11px" }}>
                    {plan.tokens} tokens
                  </span>
                </div>
              </div>

              <ul style={{ listStyle: "none", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#34d399", fontSize: "16px", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={plan.featured ? "btn-primary" : "btn-secondary"}
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.id}
                style={{ width: "100%", position: "relative" }}
                id={`plan-${plan.id}`}
              >
                <span>{loading === plan.id ? "Redirecting..." : plan.cta}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "32px", color: "var(--text-muted)", fontSize: "13px" }}>
        🔒 Secured by Stripe · 30-day money-back guarantee · No credit card required for trial
      </div>

      <style jsx>{`
        .pricing-section { padding: 20px; }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
