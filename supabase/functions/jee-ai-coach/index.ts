import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// 1️⃣ At startup, log the key so we know it’s loaded
console.log("🔑 GEMINI_API_KEY is:", Deno.env.get("GEMINI_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age":       "86400",
};

serve(async (req) => {
  // 2️⃣ Preflight CORS handshake
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 3️⃣ Parse incoming JSON
    const { tasks, analysisType, timeframe } = await req.json();

    // 4️⃣ Build prompts
    const systemPrompt = `
You are a specialized JEE 2027 AI coach with deep expertise in Physics, Chemistry, and Mathematics.
Analyze the student's study data and provide personalized insights, recommendations, and motivation.

Focus on:
- JEE Main & Advanced exam patterns
- Chapter-wise importance and difficulty
- Strategic study planning for JEE 2027
- Subject-wise weaknesses and strengths
- Time management for competitive exams
- Motivation and mental preparation

Provide actionable, specific advice tailored to JEE preparation.
`.trim();

    const userPrompt = `
Analyze this JEE student's ${timeframe} performance data:

Tasks Data: ${JSON.stringify(tasks)}
Analysis Type: ${analysisType}

Please provide:
1. Performance analysis for Physics, Chemistry, and Mathematics
2. Chapter-wise recommendations
3. Strategic improvements for JEE 2027
4. Motivational insights
5. Specific action items for next week/month

Format as structured JSON with sections: performance, recommendations, motivation, actionItems
`.trim();

    // 5️⃣ Build the correct Gemini request
    const endpoint = new URL(
      "https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage"
    );
    endpoint.searchParams.set("key", Deno.env.get("GEMINI_API_KEY") ?? "");

    const geminiBody = {
      prompt: {
        chat: {
          messages: [
            { author: "system", content: systemPrompt },
            { author: "user",   content: userPrompt   },
          ],
        },
      },
      temperature:     0.7,
      candidateCount:  1,
      maxOutputTokens: 2000,
    };

    console.log("▶️ Sending to Gemini:", JSON.stringify(geminiBody).slice(0, 200));
    const response = await fetch(endpoint.toString(), {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(geminiBody),
    });

    const raw = await response.text();
    console.log("🔁 Gemini status:", response.status, "body:", raw);

    if (!response.ok) {
      throw new Error(raw);
    }

    const { candidates } = JSON.parse(raw);
    const analysis = candidates?.[0]?.content ?? "";

    // 6️⃣ Return the structured AI analysis
    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Function error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
