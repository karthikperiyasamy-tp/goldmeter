// Google Gemini AI integration for generating daily recaps

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use gemini-1.5-flash-latest for better availability
const GEMINI_MODEL = 'gemini-1.5-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  }

  console.log(`🤖 Calling Gemini API (model: ${GEMINI_MODEL})...`);

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error response:', errorText);
    
    // Parse error for better messaging
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.message) {
        throw new Error(`Gemini API error: ${errorJson.error.message}`);
      }
    } catch {
      // If parsing fails, use status code
    }
    
    if (response.status === 404) {
      throw new Error('Gemini API error: Model not found. Please check your API key is valid.');
    } else if (response.status === 401 || response.status === 403) {
      throw new Error('Gemini API error: Invalid or expired API key.');
    }
    
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No content generated from Gemini');
  }

  console.log('✅ Gemini API response received successfully');
  return text;
}

// Generate daily recap from news headlines
export async function generateDailyRecap(
  headlines: Array<{ title: string; source: string; summary: string }>,
  date: string
): Promise<{ title: string; content: string; highlights: string[]; summary: string }> {
  const headlinesList = headlines
    .map((h, i) => `${i + 1}. "${h.title}" (${h.source})\n   ${h.summary}`)
    .join('\n\n');

  const prompt = `You are a financial journalist writing a daily gold market recap for Indian investors and jewelry shoppers.

Based on these ${headlines.length} gold-related news headlines from ${date}:

${headlinesList}

Write a comprehensive daily recap article with the following structure:

1. **TITLE**: Create an engaging SEO-friendly title like "Gold Market Recap: [Key Event] on ${date}" or "Gold Prices [Direction]: What Happened on ${date}"

2. **SUMMARY**: Write a 2-sentence summary for preview cards (max 150 characters)

3. **HIGHLIGHTS**: List exactly 5 key bullet points (each 10-15 words)

4. **CONTENT**: Write a 400-500 word article covering:
   - Opening paragraph summarizing the day's main gold market movements
   - Key price movements and market trends
   - Important news that affected gold prices
   - Expert opinions or market analysis mentioned
   - Closing paragraph with outlook/what to watch

Important guidelines:
- Write for Indian audience (use ₹, mention MCX, Indian cities)
- Keep it informative but accessible to general readers
- Focus on actionable insights for investors and jewelry buyers
- Use simple English, avoid jargon
- DO NOT make up prices or statistics not mentioned in headlines

Format your response EXACTLY like this:
---TITLE---
[Your title here]
---SUMMARY---
[Your 2-sentence summary here]
---HIGHLIGHTS---
• [Highlight 1]
• [Highlight 2]
• [Highlight 3]
• [Highlight 4]
• [Highlight 5]
---CONTENT---
[Your full article content here]`;

  const response = await generateWithGemini(prompt);

  // Parse the response
  const titleMatch = response.match(/---TITLE---\s*([\s\S]*?)\s*---SUMMARY---/);
  const summaryMatch = response.match(/---SUMMARY---\s*([\s\S]*?)\s*---HIGHLIGHTS---/);
  const highlightsMatch = response.match(/---HIGHLIGHTS---\s*([\s\S]*?)\s*---CONTENT---/);
  const contentMatch = response.match(/---CONTENT---\s*([\s\S]*?)$/);

  const title = titleMatch?.[1]?.trim() || `Gold Market Recap: ${date}`;
  const summary = summaryMatch?.[1]?.trim() || 'Daily gold market summary and analysis.';
  const highlightsText = highlightsMatch?.[1]?.trim() || '';
  const content = contentMatch?.[1]?.trim() || response;

  // Parse highlights
  const highlights = highlightsText
    .split('\n')
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 5);

  return {
    title,
    summary,
    highlights: highlights.length > 0 ? highlights : ['Gold prices showed movement today', 'Market sentiment remained mixed', 'Investors watched global cues', 'MCX gold trading was active', 'Jewelry demand stayed steady'],
    content,
  };
}

