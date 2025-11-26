import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// process.env.API_KEY is guaranteed to be available in this environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdCopy = async (productName: string, targetAudience: string, tone: string): Promise<string> => {
  try {
    const prompt = `Write a compelling, short advertisement description (max 2 sentences) for a product named "${productName}". 
    Target Audience: ${targetAudience}. 
    Tone: ${tone}. 
    Focus on benefits and call to action. Return ONLY the raw text of the ad copy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Error generating ad copy:", error);
    throw new Error("Failed to generate ad copy via Gemini.");
  }
};

export const generateAdImage = async (imagePrompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for generation as per guidelines for general image tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: imagePrompt,
          },
        ],
      },
    });

    // Iterate to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image data received from model.");
  } catch (error) {
    console.error("Error generating ad image:", error);
    throw new Error("Failed to generate image via Gemini.");
  }
};