import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
});

const PLANS = {
  starter: {
    name: "Starter",
    price: 9,
    priceId: "price_starter_placeholder",
    tokens: 100000,
    features: ["100K tokens/month", "3 AI models", "Chat history", "API access"],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: "price_pro_placeholder",
    tokens: 500000,
    features: ["500K tokens/month", "All AI models", "Priority support", "Advanced analytics", "Custom prompts"],
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    priceId: "price_enterprise_placeholder",
    tokens: 2000000,
    features: ["2M tokens/month", "Custom fine-tuning", "Dedicated support", "SLA guarantee", "White-label option"],
  },
};

export async function POST(req) {
  try {
    const { plan, successUrl, cancelUrl } = await req.json();

    const planData = PLANS[plan];
    if (!planData) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Demo mode — return mock URL if no real Stripe key
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?checkout=success&plan=${plan}`,
        demo: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: planData.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ plans: PLANS });
}
