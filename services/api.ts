export async function fetchDashboardStats() {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export async function fetchMoodLogs(period: string = "week") {
  const res = await fetch(`/api/mood?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch mood logs");
  return res.json();
}

export async function fetchJournalEntries(search?: string) {
  const url = search ? `/api/journal?search=${encodeURIComponent(search)}` : "/api/journal";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch journal entries");
  return res.json();
}

export async function fetchConversations() {
  const res = await fetch("/api/conversations");
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}
