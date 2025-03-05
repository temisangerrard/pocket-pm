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
- order: Numerical order starting from 0

Example format:
{
  "sections": [
    {
      "title": "Executive Summary",
      "content": "Brief overview of the product...",
      "order": 0
    }
  ]
}`;

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

    // Handle different types of OpenAI API errors
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please try again later.');
    } else if (error.status === 429) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    throw new Error('Failed to generate PRD template. Please try again.');
  }
}