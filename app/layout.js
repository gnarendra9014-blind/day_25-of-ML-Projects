import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NeuralSaaS — AI-Powered Platform",
  description: "Full-stack AI SaaS capstone — chat with multiple AI models, manage usage, and subscribe with Stripe.",
  keywords: "AI, SaaS, LangChain, Next.js, Stripe, Groq, chatbot",
  openGraph: {
    title: "NeuralSaaS — AI-Powered Platform",
    description: "Full-stack AI SaaS capstone built with Next.js, LangChain & Stripe",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
