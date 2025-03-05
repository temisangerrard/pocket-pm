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

// Fallback sample PRD template when API is unavailable
const getSamplePrdSections = (productDescription: string, industry?: string): PrdSection[] => {
  return [
    {
      title: "Executive Summary",
      content: `A high-level overview of ${productDescription}${industry ? ` for the ${industry} industry` : ''}.`,
      order: 0
    },
    {
      title: "Problem Statement",
      content: "Define the specific problems this product aims to solve and the target audience's pain points.",
      order: 1
    },
    {
      title: "Market Analysis",
      content: "Overview of the current market landscape, competitor analysis, and target market segments.",
      order: 2
    },
    {
      title: "Product Goals and Objectives",
      content: "Key objectives, success metrics, and timeline for product development and launch.",
      order: 3
    },
    {
      title: "Key Features and Functionality",
      content: "Detailed breakdown of core features, user flows, and technical requirements.",
      order: 4
    }
  ];
};

export async function generatePrdTemplate(
  productDescription: string,
  industry?: string
): Promise<PrdSection[]> {
  const prompt = `Create a detailed PRD template for the following product:

Product Description: ${productDescription}
${industry ? `Industry Context: ${industry}` : ''}

Generate a structured PRD with the following sections:
1. Executive Summary
2. Problem Statement
3. Market Analysis
4. Product Goals and Objectives
5. Key Features and Functionality
6. User Stories and Requirements
7. Technical Requirements
8. Success Metrics

For each section, provide meaningful placeholder content that product managers can customize.

Format your response as a JSON object with a 'sections' array, where each section has:
- title: The section name
- content: Detailed placeholder content
- order: Numerical order starting from 0`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a product management expert that creates structured, detailed PRD templates. Always respond with valid JSON that matches the specified format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
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

    // If API quota is exceeded or any other error, use the fallback template
    console.log('Using fallback PRD template generator');
    return getSamplePrdSections(productDescription, industry);
  }
}