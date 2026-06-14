"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { MOOD_OPTIONS, type MoodLog, type MoodType } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import {
  Trash2, BarChart3, TrendingUp, CalendarDays,
  Sparkles, Activity, Smile
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";

const MOOD_COLORS: Record<string, string> = {
  happy: "#22c55e",
  neutral: "#94a3b8",
  sad: "#3b82f6",
  anxious: "#f59e0b",
  angry: "#ef4444",
  tired: "#8b5cf6",
};

const MOOD_GRADIENTS: Record<string, string> = {
  happy: "from-emerald-400 to-green-500",
  neutral: "from-slate-300 to-slate-400",
  sad: "from-blue-400 to-blue-500",
  anxious: "from-amber-400 to-yellow-500",
  angry: "from-red-400 to-rose-500",
  tired: "from-purple-400 to-violet-500",
};

const MOOD_BG: Record<string, string> = {
  happy: "bg-emerald-50 hover:bg-emerald-100",
  neutral: "bg-slate-50 hover:bg-slate-100",
  sad: "bg-blue-50 hover:bg-blue-100",
  anxious: "bg-amber-50 hover:bg-amber-100",
  angry: "bg-red-50 hover:bg-red-100",
  tired: "bg-purple-50 hover:bg-purple-100",
};

const MOOD_SELECTED_BG: Record<string, string> = {
  happy: "bg-gradient-to-br from-emerald-400 to-green-500 ring-2 ring-emerald-300",
  neutral: "bg-gradient-to-br from-slate-300 to-slate-400 ring-2 ring-slate-300",
  sad: "bg-gradient-to-br from-blue-400 to-blue-500 ring-2 ring-blue-300",
  anxious: "bg-gradient-to-br from-amber-400 to-yellow-500 ring-2 ring-amber-300",
  angry: "bg-gradient-to-br from-red-400 to-rose-500 ring-2 ring-red-300",
  tired: "bg-gradient-to-br from-purple-400 to-violet-500 ring-2 ring-purple-300",
};

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="#475569" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-xs font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomTooltipMood({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-dark rounded-xl px-4 py-3 shadow-xl border border-white/40">
      <p className="font-semibold text-slate-900">{data.name}</p>
      <p className="text-sm text-slate-500">{data.value} entries</p>
    </div>
  );
}

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
    emoji: opt.emoji,
  })).filter((d) => d.value > 0);

  const totalMoods = moods.length;
  const avgScore = moods.length
    ? Math.round(moods.reduce((s, m) => s + (MOOD_OPTIONS.find((o) => o.value === m.mood)?.score || 3), 0) / moods.length * 20)
    : 0;

  const bestMood = moodCounts.length
    ? moodCounts.reduce((a, b) => a.value > b.value ? a : b)
    : null;

  return (
    <AppLayout>
      <div className="relative w-full space-y-8">
        {/* Decorative */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="glass-orb absolute -top-20 -left-20 h-60 w-60 rounded-full opacity-20 animate-float-slow" />
          <div className="glass-orb absolute -bottom-40 -right-40 h-80 w-80 rounded-full opacity-15 animate-float-delayed" />
        </div>

        {/* Header */}
        <div className="relative animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <Smile className="h-5 w-5 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">Emotional Wellness</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="gradient-text">Mood Tracker</span>
          </h1>
          <p className="text-slate-500 mt-1">Log and track your emotional wellness journey</p>
        </div>

        {/* Mood input form */}
        <form onSubmit={handleSubmit} className="card space-y-6 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-bold text-slate-900">How are you feeling today?</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3" role="radiogroup" aria-label="Select your mood">
              {MOOD_OPTIONS.map((opt, i) => {
                const isSelected = selectedMood === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedMood(opt.value)}
                    className={`group relative flex flex-col items-center gap-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 animate-bounce-in-sm ${
                      isSelected
                        ? `${MOOD_SELECTED_BG[opt.value]} text-white shadow-xl scale-105`
                        : `${MOOD_BG[opt.value]} hover:shadow-md`
                    }`}
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                  >
                    <span className={`text-4xl sm:text-5xl transition-transform duration-300 ${
                      isSelected ? "scale-110 emoji-float" : "group-hover:scale-110"
                    }`} role="img" aria-label={opt.label}>
                      {opt.emoji}
                    </span>
                    <span className={`text-xs font-semibold ${
                      isSelected ? "text-white/90" : "text-slate-600"
                    }`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <label htmlFor="mood-note" className="block text-sm font-medium text-slate-700 mb-1.5">
                What&apos;s contributing to how you feel?
              </label>
              <textarea
                id="mood-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field resize-none transition-all duration-200 focus:ring-2 focus:ring-purple-100"
                rows={2}
                placeholder="e.g., Had a great day at work, feeling accomplished..."
              />
            </div>

            <div className="mt-5">
              <Button type="submit" loading={saving} disabled={!selectedMood} className="w-full sm:w-auto">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {selectedMood
                  ? `Log ${MOOD_OPTIONS.find((o) => o.value === selectedMood)?.label || ""} Mood`
                  : "Select a mood above"}
              </Button>
            </div>
          </div>
        </form>

        {/* Stats summary */}
        {totalMoods > 0 && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            <div className="card text-center py-4">
              <CalendarDays className="h-5 w-5 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-slate-900">{totalMoods}</p>
              <p className="text-xs text-slate-500">Total Entries</p>
            </div>
            <div className="card text-center py-4">
              <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-slate-900">{avgScore}%</p>
              <p className="text-xs text-slate-500">Avg Mood Score</p>
            </div>
            <div className="card text-center py-4">
              <Activity className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-slate-900">{bestMood?.value || 0}</p>
              <p className="text-xs text-slate-500">Most Frequent</p>
            </div>
            <div className="card text-center py-4">
              <span className="text-2xl block mb-1">{bestMood?.emoji || "😊"}</span>
              <p className="text-xs font-medium text-slate-900">{bestMood?.name || "Happy"}</p>
              <p className="text-xs text-slate-500">Top Mood</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <BarChart3 className="h-5 w-5 text-primary-600 shrink-0" aria-hidden="true" />
          <div className="flex gap-1.5 bg-slate-100/80 rounded-xl p-1" role="tablist" aria-label="Time period">
            {(["week", "month", "all"] as const).map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  period === p
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p === "week" ? "Weekly" : p === "month" ? "Monthly" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Charts and history */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mood Distribution */}
          <div className="card animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900">Mood Distribution</h2>
            </div>
            {moodCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                    label={<CustomPieLabel />}
                  >
                    {moodCounts.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltipMood />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Smile className="h-12 w-12 text-slate-300 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium">No mood data for this period</p>
                <p className="text-xs text-slate-400 mt-1">Start logging to see your distribution</p>
              </div>
            )}
          </div>

          {/* Mood History */}
          <div className="card animate-slide-up" style={{ animationDelay: "280ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-slate-900">Mood History</h2>
              </div>
              {moods.length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  {moods.length} entries
                </span>
              )}
            </div>
            {loading ? (
              <PageLoader />
            ) : moods.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                {moods.map((m, idx) => {
                  const opt = MOOD_OPTIONS.find((o) => o.value === m.mood);
                  return (
                    <div
                      key={m.id}
                      className="group flex items-start gap-3 rounded-2xl p-3.5 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm animate-fade-in"
                      style={{ animationDelay: `${300 + idx * 40}ms` }}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${MOOD_GRADIENTS[m.mood]} text-white shadow-sm`}>
                        <span className="text-lg" role="img" aria-label={opt?.label}>{opt?.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{opt?.label}</p>
                          <span className={`h-2 w-2 rounded-full ${MOOD_COLORS[m.mood]}`} />
                        </div>
                        {m.note && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{m.note}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {formatDate(m.created_at)} at {formatTime(m.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="shrink-0 rounded-xl p-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                        aria-label="Delete mood entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Smile className="h-12 w-12 text-slate-300 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium">No moods logged yet</p>
                <p className="text-xs text-slate-400 mt-1">Your mood history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
