import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, buildChatPrompt, buildWellnessPrompt } from "./prompts";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export interface GenerateOptions {
  message: string;
  history?: { role: string; content: string }[];
  wellnessCategory?: string;
  context?: string;
}

function getGeminiModelName() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  return new GoogleGenerativeAI(apiKey);
}

export async function generateResponse(options: GenerateOptions): Promise<string> {
  const { message, history = [], wellnessCategory, context } = options;

  const model = getGeminiClient().getGenerativeModel({
    model: getGeminiModelName(),
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
