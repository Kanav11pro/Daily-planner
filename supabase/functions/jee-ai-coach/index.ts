// … keep your imports and corsHeaders as before …

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tasks, analysisType, timeframe } = await req.json();

    const systemPrompt = `You are a specialized JEE 2027 AI coach…`;  // your same prompt
    const userPrompt   = `Analyze this JEE student's ${timeframe} performance data…`;  // your same userPrompt

    // 1. Build the Gemini URL with your API key
    const endpoint = new URL(
      'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage'
    );
    endpoint.searchParams.set('key', geminiApiKey!);

    // 2. Gemin i payload is slightly different from OpenAI’s
    const geminiBody = {
      prompt: {
        messages: [
          { author: 'system', content: systemPrompt },
          { author: 'user',   content: userPrompt },
        ],
      },
      temperature: 0.7,
      candidateCount: 1,
      // you can tune maxOutputTokens if you want
    };

    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const { candidates } = await response.json();
    if (!candidates || candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const analysis = candidates[0].content;

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
