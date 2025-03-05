import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PrdSection {
  title: string;
  content: string;
  order: number;
}

export async function generatePrdTemplate(
  productDescription: string,
  industry?: string
): Promise<PrdSection[]> {
  const prompt = `Create a detailed PRD template for the following product description:
${productDescription}
${industry ? `Industry context: ${industry}` : ''}

Generate a structured PRD with sections. Include modern product management best practices.
Format the response as a JSON array of sections, each with title, content (with placeholder content), and order fields.
Keep the content concise but meaningful.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product management expert that creates detailed PRD templates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    // Log the raw response for debugging
    console.log('OpenAI API Response:', response.choices[0].message.content);

    const result = JSON.parse(response.choices[0].message.content);
    if (!result.sections || !Array.isArray(result.sections)) {
      throw new Error("Invalid response format from OpenAI");
    }

    return result.sections;
  } catch (error: any) {
    console.error('Error generating PRD template:', error);

    // Handle different types of OpenAI API errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    throw new Error('Failed to generate PRD template. Please try again.');
  }
}