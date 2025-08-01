import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create, getNumericDate, Header, Payload } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GOOGLE_OAUTH2_TOKEN_URL = "https://oauth2.googleapis.com/token";
const VERTEX_AI_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/chat-bison-001:generateMessage";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse request
  let reqData;
  try {
    reqData = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400, headers: corsHeaders });
  }

  const { tasks, analysisType, timeframe } = reqData;
  if (!tasks || !analysisType || !timeframe) {
    return new Response(JSON.stringify({ error: "Missing fields." }), { status: 400, headers: corsHeaders });
  }

  // Load and parse service account key from environment (stored as JSON string)
  const saKeyString = Deno.env.get("GOOGLE_SA_KEY");
  if (!saKeyString) {
    return new Response(JSON.stringify({ error: "Missing service account key." }), { status: 500, headers: corsHeaders });
  }

  const saKey = JSON.parse(saKeyString);

  // Prepare JWT claim for Google OAuth2 token
  const iat = getNumericDate(0);
  const exp = getNumericDate(3600); // valid for 1 hour

  const payload: Payload = {
    iss: saKey.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: GOOGLE_OAUTH2_TOKEN_URL,
    exp,
    iat,
  };

  const header: Header = {
    alg: "RS256",
    typ: "JWT",
  };

  // Sign JWT with your service account private key
  let jwt;
  try {
    jwt = await create(header, payload, await crypto.subtle.importKey(
      "pkcs8",
      base64ToArrayBuffer(saKey.private_key.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\n/g, "")),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    ));
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to sign JWT: " + e.message }), { status: 500, headers: corsHeaders });
  }

  // Exchange JWT for Access Token
  let tokenResponse;
  try {
    tokenResponse = await fetch(GOOGLE_OAUTH2_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to get access token: " + e.message }), { status: 500, headers: corsHeaders });
  }

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    return new Response(JSON.stringify({ error: "Token exchange failed", details: errText }), { status: 500, headers: corsHeaders });
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Construct prompt as before:
  const prompt = `Analyze this JEE student's ${timeframe} performance data:\n${JSON.stringify(tasks)}\nAnalysis Type: ${analysisType}\nPlease provide performance analysis, recommendations, motivation, and action items in structured JSON.`;

  // Call Vertex AI
  const vertexBody = {
    instances: [{ content: prompt }],
    parameters: { temperature: 0.7, maxOutputTokens: 2000 },
  };

  const vertexResponse = await fetch(VERTEX_AI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vertexBody),
  });

  if (!vertexResponse.ok) {
    const errText = await vertexResponse.text();
    return new Response(JSON.stringify({ error: "Vertex AI error", details: errText }), { status: 500, headers: corsHeaders });
  }

  const vertexData = await vertexResponse.json();
  const aiContent = vertexData?.predictions?.[0]?.candidates?.[0]?.content || "No response";

  return new Response(JSON.stringify({ analysis: aiContent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i=0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
