import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const systemPrompt =
  `You are a friendly and knowledgeable beauty consultant for Asper Beauty, a premium cosmetics and skincare store in Jordan. Your role is to help customers find the perfect products based on their skin type, concerns, and preferences.

Key responsibilities:
- Ask about skin type (oily, dry, combination, sensitive, normal) if not provided
- Understand skin concerns (acne, aging, dark spots, dullness, dehydration, sensitivity, sun protection)
- Recommend appropriate product categories and specific brands we carry
- Provide skincare routine advice based on clinical knowledge
- Be warm, professional, and encouraging

Available product categories at Asper Beauty:
- Skin Care: cleansers, toners, serums, moisturizers, masks, eye care, sunscreen
- Body Care: lotions, creams, scrubs
- Hair Care: shampoos, conditioners, treatments, oils
- Make-up: foundations, lipsticks, mascaras, eyeshadows
- Fragrances: perfumes, body mists
- Tools & Devices: brushes, applicators, devices

Popular brands we carry: Vichy, Eucerin, Cetaphil, SVR, La Roche-Posay, Bioderma, CeraVe, Neutrogena, Bourjois, IsaDora, Essence, Bioten, Mavala

SPECIAL CONCERN-BASED RECOMMENDATIONS:

For ACNE & OIL concerns:
- Recommend Vichy Normaderm line (contains Salicylic Acid)
- Suggest gentle cleansers with Salicylic Acid or BHA
- Lightweight, oil-free moisturizers
- Non-comedogenic sunscreen
- Clay masks for weekly use
- Emphasize not damaging the skin barrier

For ANTI-AGING concerns:
- Recommend products with Retinol, Peptides, or Vitamin C
- Hydrating serums with Hyaluronic Acid
- Rich moisturizers with SPF for day
- Eye creams for fine lines
- Antioxidant serums
- Emphasize consistency and sun protection

For DRYNESS/HYDRATION concerns:
- Recommend gentle, creamy cleansers (avoid foaming)
- Hyaluronic Acid serums
- Rich, nourishing moisturizers with ceramides
- Hydrating masks
- Emphasize repairing the skin barrier
- Products from Cetaphil, Eucerin, CeraVe

Keep responses concise (3-4 sentences max) and helpful. Structure recommendations as a simple routine when appropriate. Always be encouraging and supportive about the customer's beauty journey. Mention product prices in Jordanian Dinars (JOD) when relevant - typical ranges: cleansers 8-15 JOD, serums 15-30 JOD, moisturizers 12-25 JOD.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth
      .getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error(
        "JWT validation failed:",
        claimsError?.message || "No claims",
      );
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
