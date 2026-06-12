export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getMoodScore(moods: { mood: string }[]): number {
  const scores: Record<string, number> = {
    happy: 5,
    neutral: 3,
    sad: 2,
    anxious: 2,
    angry: 1,
    tired: 2,
  };
  if (moods.length === 0) return 0;
  const total = moods.reduce((sum, m) => sum + (scores[m.mood] || 3), 0);
  return Math.round((total / moods.length) * 20);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
