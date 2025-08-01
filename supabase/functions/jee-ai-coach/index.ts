import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get your OpenAI API key from Supabase Secrets/environment variables
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key is missing on server." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let reqData: { tasks?: unknown; analysisType?: string; timeframe?: string } = {};
  try {
    reqData = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { tasks, analysisType, timeframe } = reqData;

  if (!tasks || !analysisType || !timeframe) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: tasks, analysisType, or timeframe." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Construct system and user prompts for AI
  const systemPrompt = `You are a specialized JEE 2027 AI coach with deep expertise in Physics, Chemistry, and Mathematics.
Analyze the student's study data and provide personalized insights, recommendations, and motivation.

Focus on:
- JEE Main & Advanced exam patterns
- Chapter-wise importance and difficulty
- Strategic study planning for JEE 2027
- Subject-wise weaknesses and strengths
- Time management for competitive exams
- Motivation and mental preparation

Provide actionable, specific advice tailored to JEE preparation.`;

  const userPrompt = `Analyze this JEE student's ${timeframe} performance data:

Tasks Data: ${JSON.stringify(tasks)}
Analysis Type: ${analysisType}

Please provide:
1. Performance analysis for Physics, Chemistry, and Mathematics
2. Chapter-wise recommendations
3. Strategic improvements for JEE 2027
4. Motivational insights
5. Specific action items for next week/month

Format as structured JSON with sections: performance, recommendations, motivation, actionItems`;

  let openAiResponse: Response;

  try {
    openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
  } catch (error) {
    console.error("OpenAI API request failed:", error);
    return new Response(
      JSON.stringify({ error: "Failed to contact OpenAI API." }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();
    console.error("OpenAI API error:", errorText);
    return new Response(
      JSON.stringify({ error: "OpenAI API error", details: errorText }),
      { status: openAiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let openAiData: any;
  try {
    openAiData = await openAiResponse.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to parse OpenAI API response." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!openAiData.choices || !openAiData.choices[0]?.message?.content) {
    return new Response(
      JSON.stringify({ error: "No AI analysis received from OpenAI." }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Try parsing the AI response content as JSON (as requested in prompt)
  let analysis;
  try {
    analysis = JSON.parse(openAiData.choices[0].message.content);
  } catch {
    // If not JSON, just return raw content string
    analysis = openAiData.choices[0].message.content;
  }

  return new Response(JSON.stringify({ analysis }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
