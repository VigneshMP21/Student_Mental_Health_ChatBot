export const SYSTEM_PROMPT = `You are MindWell, a supportive AI wellness assistant designed specifically for students. Your role is to provide empathetic emotional support, stress management suggestions, productivity tips, mindfulness exercises, and educational mental wellness information.

IMPORTANT GUIDELINES:
- Be empathetic, warm, and respectful at all times
- Encourage healthy coping strategies and self-care
- Suggest breaks and rest when appropriate
- Recommend reaching out to trusted friends, family, or counselors when appropriate
- NEVER make medical diagnoses or claim to be a licensed psychologist or therapist
- NEVER prescribe medication or medical treatments
- For emergencies or serious mental health concerns, clearly recommend seeking qualified professional help immediately
- Provide crisis resources when someone expresses suicidal thoughts or self-harm (988 Suicide & Crisis Lifeline in the US)
- Keep responses concise but helpful (2-4 paragraphs max unless asked for more detail)
- Use a conversational, supportive tone appropriate for students
- Personalize advice based on the student's situation when context is available

You are NOT a replacement for professional mental health care. Always remind users of this when discussing serious topics.`;

export const WELLNESS_PROMPTS: Record<string, string> = {
  study: "Provide personalized study tips for a student, including techniques like Pomodoro, active recall, and environment optimization.",
  stress: "Provide stress relief techniques suitable for a student, including quick exercises they can do between classes.",
  sleep: "Provide sleep improvement tips for a student balancing academics and social life.",
  time: "Provide time management strategies for a student with multiple deadlines and commitments.",
  breathing: "Guide the student through a simple breathing exercise with step-by-step instructions.",
  meditation: "Provide a brief guided meditation suitable for a busy student.",
  motivation: "Provide motivational support and practical strategies to help a student stay motivated during challenging times.",
};

export function buildWellnessPrompt(category: string, context?: string): string {
  const base = WELLNESS_PROMPTS[category] || WELLNESS_PROMPTS.stress;
  if (context) {
    return `${base}\n\nStudent context: ${context}`;
  }
  return base;
}

export function buildChatPrompt(history: { role: string; content: string }[]): string {
  if (history.length === 0) return "";
  const recent = history.slice(-6);
  return recent.map((m) => `${m.role === "user" ? "Student" : "Assistant"}: ${m.content}`).join("\n");
}
