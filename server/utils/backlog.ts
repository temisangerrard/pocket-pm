import OpenAI from "openai";
import { type InsertFeature } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBacklogItems(
  description: string
): Promise<InsertFeature[]> {
  const prompt = `Based on the following product description, generate a list of specific, actionable backlog items. Each item should include a title, description, and initial RICE scoring parameters (reach, impact, confidence, effort on a scale of 1-10).

Product Description:
${description}

Generate features that cover both core functionality and important supporting features. Format your response as a JSON object with an array of features, where each feature has:
- title: Short, clear feature name
- description: Detailed feature description
- reach: Estimated number of users affected (1-10)
- impact: Potential impact on users (1-10)
- confidence: Confidence in estimates (1-10)
- effort: Development effort required (1-10)

Example format:
{
  "features": [
    {
      "title": "User Authentication",
      "description": "Implement secure login and registration system with email verification",
      "reach": 9,
      "impact": 8,
      "confidence": 9,
      "effort": 6
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a product management expert that creates detailed, actionable backlog items. Always respond with valid JSON that matches the specified format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    // Log the raw response for debugging
    console.log("OpenAI API Response:", response.choices[0].message.content);

    const result = JSON.parse(response.choices[0].message.content);
    if (!result.features || !Array.isArray(result.features)) {
      throw new Error("Invalid response format from OpenAI");
    }

    return result.features;
  } catch (error: any) {
    console.error("Error generating backlog items:", error);

    // Return a sample backlog item for testing/fallback
    return [
      {
        title: "Basic Feature",
        description: "A basic feature implementation (AI generation failed)",
        reach: 5,
        impact: 5,
        confidence: 5,
        effort: 5,
      },
    ];
  }
}
