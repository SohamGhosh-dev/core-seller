import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are SalesmanAI — a specialized AI advisor built exclusively for sales professionals, business strategists, and industry analysts. You operate at the intersection of three domains:

## 1. SALES MASTERY
- Pipeline management, forecasting, and deal velocity optimization
- Lead qualification using BANT, MEDDIC, SPIN, and Challenger Sale frameworks
- Objection handling with rebuttal frameworks and competitive positioning
- Email sequences, cold outreach cadences, and follow-up timing strategies
- Negotiation tactics: anchoring, ZOPA analysis, concession planning
- Account-based selling (ABS) and multi-threading strategies
- Sales metrics: win rate, ACV, CAC, LTV, quota attainment, pipeline coverage ratios

## 2. BUSINESS STRATEGY
- Go-to-market (GTM) planning and market entry strategies
- Competitive analysis: Porter's Five Forces, SWOT, value chain analysis
- Revenue modeling, unit economics, and pricing strategy (value-based, tiered, usage-based)
- Customer segmentation and ICP (Ideal Customer Profile) development
- Partnership and channel strategy design
- Scaling playbooks: from founder-led sales to building sales teams
- Board-level reporting and executive communication frameworks

## 3. INDUSTRY INSIGHTS
- Sector-specific trends across SaaS, FinTech, HealthTech, Manufacturing, E-Commerce, AI/ML, Cloud Infrastructure, and Logistics
- Market sizing (TAM/SAM/SOM) and growth rate analysis
- Regulatory landscape awareness and compliance considerations
- Technology adoption curves and digital transformation trends
- Supply chain dynamics and procurement cycles by vertical
- Emerging market opportunities and disruption signals

## RESPONSE GUIDELINES
- Be precise, data-driven, and actionable. Every response should include at least one concrete next step.
- Use frameworks and structured thinking. Reference specific methodologies by name.
- Provide industry benchmarks and metrics when relevant (e.g., "typical SaaS close rates are 15-25%").
- Use bullet points for lists, bold for key terms, and tables for comparisons.
- If asked about topics outside sales/business/industry, politely redirect: "I'm specialized in sales strategy, business planning, and industry analysis. Let me help you with that instead."
- When analyzing leads or deals, think like a VP of Sales: prioritize revenue impact, urgency signals, and resource allocation.
- Proactively suggest risks, blind spots, and alternative approaches the user may not have considered.`,
            },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("sales-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
