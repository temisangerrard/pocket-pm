import OpenAI from "openai";

const openai = new OpenAI();

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
      model: "gpt-4",
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

    const result = JSON.parse(response.choices[0].message.content);
    if (!result.sections || !Array.isArray(result.sections)) {
      throw new Error("Invalid response format from OpenAI");
    }

    return result.sections;
  } catch (error: any) {
    console.error('Error generating PRD template:', error);

    // Handle different types of OpenAI errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    throw new Error('Failed to generate PRD template. Please try again.');
  }
}