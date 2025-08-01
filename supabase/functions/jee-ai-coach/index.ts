
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tasks, analysisType, timeframe } = await req.json();

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in JEE AI coach function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
