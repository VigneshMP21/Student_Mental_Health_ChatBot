"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { MOOD_OPTIONS, type MoodLog, type MoodType } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import { Trash2, BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const MOOD_COLORS: Record<string, string> = {
  happy: "#22c55e",
  neutral: "#94a3b8",
  sad: "#3b82f6",
  anxious: "#f59e0b",
  angry: "#ef4444",
  tired: "#8b5cf6",
};

export default function MoodPage() {
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMoods = async (p: string) => {
    setLoading(true);
    const res = await fetch(`/api/mood?period=${p}`);
    const data = await res.json();
    setMoods(data.moods || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMoods(period);
  }, [period]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setSaving(true);
    const res = await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: selectedMood, note: note || undefined }),
    });

    if (res.ok) {
      setSelectedMood(null);
      setNote("");
      fetchMoods(period);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/mood", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMoods(period);
  };

  const moodCounts = MOOD_OPTIONS.map((opt) => ({
    name: opt.label,
    value: moods.filter((m) => m.mood === opt.value).length,
    color: MOOD_COLORS[opt.value],
  })).filter((d) => d.value > 0);

  return (
    <AppLayout>
      <div className="w-full space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mood Tracker</h1>
          <p className="text-sm text-slate-500">Log and track your emotional wellness</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">How are you feeling today?</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3" role="radiogroup" aria-label="Select your mood">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selectedMood === opt.value}
                onClick={() => setSelectedMood(opt.value)}
                className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-200 ${
                  selectedMood === opt.value
                    ? "bg-gradient-to-br from-primary-100 to-accent-100 ring-2 ring-primary-400 scale-105"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <span className="text-3xl" role="img" aria-label={opt.label}>{opt.emoji}</span>
                <span className="text-xs font-medium text-slate-600">{opt.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="mood-note" className="block text-sm font-medium text-slate-700 mb-1.5">
              Optional note
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="What's contributing to how you feel?"
            />
          </div>

          <Button type="submit" loading={saving} disabled={!selectedMood}>
            Log Mood
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <div className="flex gap-2">
            {(["week", "month", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p === "week" ? "Weekly" : p === "month" ? "Monthly" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Mood Distribution</h2>
            {moodCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={moodCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {moodCounts.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">No mood data for this period</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Mood History</h2>
            {loading ? (
              <PageLoader />
            ) : moods.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                {moods.map((m) => {
                  const opt = MOOD_OPTIONS.find((o) => o.value === m.mood);
                  return (
                    <div key={m.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <span className="text-2xl" role="img" aria-label={opt?.label}>{opt?.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{opt?.label}</p>
                        {m.note && <p className="text-xs text-slate-500 mt-0.5">{m.note}</p>}
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(m.created_at)} at {formatTime(m.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Delete mood entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">No moods logged yet</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
