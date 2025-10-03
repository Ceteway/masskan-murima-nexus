const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { location, industry, batchSize, existingLeads = [] } = JSON.parse(event.body);

    // Validate input
    if (!location || !industry || !batchSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: location, industry, batchSize' }),
      };
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
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mariam-leads.netlify.app",
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to generate leads from API", details: errorText }),
      };
    }

    const apiResponse = await openRouterResponse.json();
    const content = apiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "No content received from API" }),
      };
    }

    // Parse the JSON response
    let leads;
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to parse leads from API response", rawContent: content }),
      };
    }

    // Validate and clean the leads
    const validatedLeads = leads
      .filter((lead) => lead.business_name && lead.phone_contact)
      .map((lead) => ({
        business_name: lead.business_name.trim(),
        phone_contact: lead.phone_contact.trim(),
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ leads: validatedLeads }),
    };
  } catch (error) {
    console.error("Error in generate-leads function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message }),
    };
  }
};
