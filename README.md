# 🧠 Day 25 — Full-Stack AI SaaS Capstone

> **The grand finale of 25 Days of ML.**  
> A production-ready AI SaaS platform built from scratch with Next.js, LangChain, Groq, and Stripe.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF6B35?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 🚀 What Is This?

**NeuralSaaS** is a full-stack AI-powered Software-as-a-Service application that integrates:

- 🤖 **Multi-model AI chat** with real-time token streaming
- 🦜 **LangChain orchestration** for prompt management and memory
- ⚡ **Groq ultra-fast inference** — sub-second response times
- 💳 **Stripe billing** with 3 subscription tiers
- 📊 **Live usage dashboard** with token metering
- 📖 **Built-in API docs** page

This is the capstone project combining everything learned across the 25 Days of ML challenge.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔁 **Streaming Responses** | Real-time token-by-token output via Server-Sent Events (SSE) |
| 🤖 **4 AI Models** | Switch between Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B |
| 🎭 **System Personas** | General, Code Expert, Data Analyst, Creative Writer, AI Tutor |
| 🌡️ **Temperature Control** | Adjust creativity from 0.0 (precise) to 1.0 (creative) |
| 📊 **Token Dashboard** | Live usage meter, per-request stats, plan limits |
| 💳 **Stripe Checkout** | Starter / Pro / Enterprise plans with monthly/annual billing |
| 📖 **API Docs** | Built-in documentation with endpoint reference |
| 🎨 **Premium Dark UI** | Glassmorphism design, gradient animations, fully responsive |

---

## 🏗️ Tech Stack

```
Frontend:  Next.js 16 (App Router) + Custom CSS (Glassmorphism)
AI:        LangChain + @langchain/groq — Groq Cloud inference
Models:    Llama 3.3 70B · Llama 3.1 8B · Mixtral 8x7B · Gemma 2 9B
Streaming: Server-Sent Events (SSE) via Next.js Route Handlers
Payments:  Stripe Checkout Sessions (Subscription mode)
Fonts:     Inter + JetBrains Mono (Google Fonts)
```

---

## 📁 Project Structure

```
day25-ai-saas-capstone/
├── app/
│   ├── api/
│   │   ├── chat/route.js        # Streaming AI endpoint (SSE)
│   │   └── stripe/route.js      # Stripe Checkout + Plans API
│   ├── globals.css              # Design system (CSS variables, animations)
│   ├── layout.js                # Root layout + metadata + fonts
│   └── page.js                  # Main SPA page (tab router)
├── components/
│   ├── ChatEngine.jsx           # Full chat UI + streaming + markdown
│   ├── Navbar.jsx               # Sticky nav with mobile support
│   ├── PricingSection.jsx       # Pricing cards + Stripe integration
│   ├── UsageDashboard.jsx       # Token meter + usage stats
│   └── DocsPage.jsx             # API reference documentation
├── .env.local                   # Environment variables (not committed)
├── .env.local.example           # Template for env vars
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/gnarendra9014-blind/day_25-of-ML-Projects.git
cd day_25-of-ML-Projects
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required — get free key at console.groq.com
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional — add for real Stripe payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 💡 **Stripe is optional.** Without Stripe keys, the app runs in demo mode — checkout shows a mock confirmation instead of redirecting to Stripe.

### 4. Run the development server

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 🔌 API Reference

### `POST /api/chat`

Streams an AI response using LangChain + Groq via Server-Sent Events.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Explain quantum computing" }
  ],
  "model": "llama-3.3-70b-versatile",
  "systemPrompt": "You are a helpful assistant.",
  "temperature": 0.7
}
```

**Response:** `Content-Type: text/event-stream`
```
data: {"text": "Quantum computing", "done": false}
data: {"text": " uses qubits...", "done": false}
data: {"done": true, "usage": {"inputTokens": 12, "outputTokens": 85, "totalTokens": 97}}
```

---

### `POST /api/stripe`

Creates a Stripe Checkout session for subscription.

```json
{ "plan": "pro" }
→ { "url": "https://checkout.stripe.com/..." }
```

### `GET /api/stripe`

Returns all available plans.

```json
{
  "plans": {
    "starter": { "name": "Starter", "price": 9, "tokens": 100000 },
    "pro": { "name": "Pro", "price": 29, "tokens": 500000 },
    "enterprise": { "name": "Enterprise", "price": 99, "tokens": 2000000 }
  }
}
```

---

## 🤖 Available Models

| Model ID | Provider | Context | Best For |
|---|---|---|---|
| `llama-3.3-70b-versatile` | Meta | 128K | Complex reasoning, analysis |
| `llama-3.1-8b-instant` | Meta | 128K | Quick tasks, prototyping |
| `mixtral-8x7b-32768` | Mistral | 32K | Long documents, diverse tasks |
| `gemma2-9b-it` | Google | 8K | Instruction following, chat |

---

## 💎 Pricing Plans

| Plan | Price | Tokens/mo | Highlights |
|---|---|---|---|
| **Starter** | $9/mo | 100K | 3 models, API access, email support |
| **Pro** | $29/mo | 500K | All models, priority queue, analytics |
| **Enterprise** | $99/mo | 2M | Custom models, SLA, white-label |

> 20% discount available on annual billing.

---

## 🎯 25 Days of ML — Capstone Summary

This project is the **Day 25 finale** of the 25 Days of ML challenge, integrating skills from across all days:

- **Days 1–7**: Prompting, RAG, token analysis, YouTube Q&A
- **Days 8–14**: Memory chatbots, resume screening, legal AI, stock agents
- **Days 15–20**: Self-healing pipelines, email triage, bug fixer, vision AI, voice assistants
- **Days 21–24**: Background swapper, emotion bots, LLM observability, REST APIs
- **Day 25** 🏆: Everything comes together — a production-grade AI SaaS

---

## 📸 Screenshots

| Chat Interface | Pricing Page |
|---|---|
| Multi-model streaming chat with real-time token stats | 3-tier Stripe pricing with monthly/annual toggle |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ · **Day 25 of 25 Days of ML**  
Next.js + LangChain + Groq + Stripe

</div>
