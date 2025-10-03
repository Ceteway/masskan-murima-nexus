import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LeadGenerationRequest {
  location: string;
  industry: string;
  batchSize: number;
  existingLeads?: Array<{ business_name: string; phone_contact: string }>;
}

interface Lead {
  business_name: string;
  phone_contact: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { location, industry, batchSize, existingLeads = [] }: LeadGenerationRequest = await req.json();

    // Validate input
    if (!location || !industry || !batchSize) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: location, industry, batchSize" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a prompt for DeepSeek to generate leads
    const prompt = `Generate a list of exactly ${batchSize} real business leads in ${location} for the ${industry} industry. 

For each business, provide:
- Business Name
- Phone Contact (valid US format)

Return ONLY a valid JSON array with this exact structure:
[
  {"business_name": "Example Business", "phone_contact": "+1-555-123-4567"},
  {"business_name": "Another Business", "phone_contact": "+1-555-234-5678"}
]

IMPORTANT:
- Return ONLY the JSON array, no other text
- Use real, publicly available business information
- Ensure phone numbers are in valid US format
- Do not include any businesses from this exclusion list: ${existingLeads.map(l => l.business_name).join(", ")}`;

    // Call OpenRouter API with DeepSeek
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY") || ""}`,
        "HTTP-Referer": "https://mariam-leads.app",
        "X-Title": "Mariam Lead Generation",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate leads from API", details: errorText }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiResponse = await openRouterResponse.json();
    const content = apiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content received from API" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the JSON response
    let leads: Lead[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        leads = JSON.parse(jsonMatch[0]);
      } else {
        leads = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse leads:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse leads from API response", rawContent: content }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validate and clean the leads
    const validatedLeads = leads
      .filter((lead: Lead) => lead.business_name && lead.phone_contact)
      .map((lead: Lead) => ({
        business_name: lead.business_name.trim(),
        phone_contact: lead.phone_contact.trim(),
      }));

    return new Response(
      JSON.stringify({ leads: validatedLeads }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in generate-leads function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});