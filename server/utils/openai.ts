import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
      model: "gpt-4o",
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

    const result = JSON.parse(response.choices[0].message.content);
    return result.sections;
  } catch (error) {
    console.error('Error generating PRD template:', error);
    throw new Error('Failed to generate PRD template');
  }
}
