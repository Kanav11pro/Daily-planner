
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
    const { weeklyData, monthlyData, tasks } = await req.json();

    const prompt = `You are an AI JEE (Joint Entrance Examination) coach analyzing a student's preparation for JEE 2027. Provide personalized insights based on their study data.

WEEKLY DATA:
- Total tasks: ${weeklyData.total}
- Completed: ${weeklyData.completed}
- Completion rate: ${weeklyData.completionRate}%
- Study time: ${Math.floor(weeklyData.studyTime / 60)} hours ${weeklyData.studyTime % 60} minutes
- Subject breakdown: ${JSON.stringify(weeklyData.subjects)}

MONTHLY DATA:
- Total tasks: ${monthlyData.total}
- Completed: ${monthlyData.completed}
- Completion rate: ${monthlyData.completionRate}%
- Study time: ${Math.floor(monthlyData.studyTime / 60)} hours ${monthlyData.studyTime % 60} minutes

RECENT TASKS CONTEXT: ${tasks.slice(-10).map(t => `${t.subject}: ${t.title} (${t.completed ? 'Completed' : 'Pending'})`).join(', ')}

Please provide:
1. Overall JEE preparation assessment
2. Subject-wise strengths and weaknesses analysis
3. Specific recommendations for Physics, Chemistry, and Mathematics
4. Study schedule optimization tips
5. JEE-specific strategies (time management, question patterns, etc.)
6. Motivational insights

Keep response concise but comprehensive (max 800 words). Focus on actionable advice tailored for JEE exam pattern.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a specialized JEE preparation coach with deep knowledge of the exam pattern, syllabus, and effective study strategies. Provide personalized, data-driven advice.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const insights = data.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI coach insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
