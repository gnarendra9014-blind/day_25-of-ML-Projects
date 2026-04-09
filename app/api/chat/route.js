import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { messages, model = "llama-3.3-70b-versatile", systemPrompt, temperature = 0.7 } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model,
      temperature,
      maxTokens: 2048,
    });

    const langchainMessages = [];

    if (systemPrompt) {
      langchainMessages.push(new SystemMessage(systemPrompt));
    } else {
      langchainMessages.push(
        new SystemMessage(
          "You are NeuralAI, an advanced AI assistant built on a full-stack SaaS platform. " +
          "You are helpful, concise, and knowledgeable. Format responses clearly using markdown when appropriate."
        )
      );
    }

    for (const msg of messages) {
      if (msg.role === "user") {
        langchainMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant") {
        langchainMessages.push(new AIMessage(msg.content));
      }
    }

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResult = await llm.stream(langchainMessages);
          let fullContent = "";

          for await (const chunk of streamResult) {
            const text = chunk.content;
            if (text) {
              fullContent += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, done: false })}\n\n`));
            }
          }

          // Count tokens (approximate)
          const inputTokens = langchainMessages.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4;
          const outputTokens = fullContent.length / 4;

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                usage: {
                  inputTokens: Math.round(inputTokens),
                  outputTokens: Math.round(outputTokens),
                  totalTokens: Math.round(inputTokens + outputTokens),
                },
              })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
