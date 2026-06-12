export type MoodType = "happy" | "neutral" | "sad" | "anxious" | "angry" | "tired";

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  conversation_id: string;
  message: string;
  ai_response: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood: MoodType;
  note: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WellnessStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface DashboardStats {
  totalChats: number;
  moodScore: number;
  journalCount: number;
  wellnessStreak: number;
}

export interface ChatUIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string; score: number }[] = [
  { value: "happy", emoji: "😊", label: "Happy", score: 5 },
  { value: "neutral", emoji: "😐", label: "Neutral", score: 3 },
  { value: "sad", emoji: "😔", label: "Sad", score: 2 },
  { value: "anxious", emoji: "😰", label: "Anxious", score: 2 },
  { value: "angry", emoji: "😡", label: "Angry", score: 1 },
  { value: "tired", emoji: "😴", label: "Tired", score: 2 },
];

export const WELLNESS_CATEGORIES = [
  { id: "study", label: "Study Tips", icon: "BookOpen" },
  { id: "stress", label: "Stress Relief", icon: "Heart" },
  { id: "sleep", label: "Sleep Improvement", icon: "Moon" },
  { id: "time", label: "Time Management", icon: "Clock" },
  { id: "breathing", label: "Breathing Exercise", icon: "Wind" },
  { id: "meditation", label: "Meditation", icon: "Sparkles" },
  { id: "motivation", label: "Motivation", icon: "Zap" },
] as const;
