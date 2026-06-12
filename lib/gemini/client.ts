import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, buildChatPrompt, buildWellnessPrompt } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface GenerateOptions {
  message: string;
  history?: { role: string; content: string }[];
  wellnessCategory?: string;
  context?: string;
}

export async function generateResponse(options: GenerateOptions): Promise<string> {
  const { message, history = [], wellnessCategory, context } = options;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  let fullPrompt = message;

  if (wellnessCategory) {
    fullPrompt = buildWellnessPrompt(wellnessCategory, context);
  }

  const historyContext = buildChatPrompt(history);
  if (historyContext) {
    fullPrompt = `Previous conversation:\n${historyContext}\n\nStudent: ${message}`;
  }

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text;
}

export async function generateWithTimeout(
  options: GenerateOptions,
  timeoutMs = 30000
): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
  });

  return Promise.race([generateResponse(options), timeoutPromise]);
}
