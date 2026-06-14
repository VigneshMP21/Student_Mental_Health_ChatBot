"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import {
  MessageCircle, Smile, BookOpen, Flame, Activity,
  TrendingUp, ArrowRight, Sparkles, ChevronRight
} from "lucide-react";
import { formatDate, formatTime } from "@/utils/helpers";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from "recharts";
import { MOOD_OPTIONS } from "@/types";
import Link from "next/link";

interface DashboardData {
  stats: { totalChats: number; moodScore: number; journalCount: number; wellnessStreak: number };
  weekMoods: { mood: string; created_at: string }[];
  recentActivity: { id: string; message: string; created_at: string }[];
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = Math.max(1, Math.floor(value / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, duration / 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="counter-number tabular-nums">
      {display}{suffix}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const mood = payload[0].payload.mood;
  return (
    <div className="glass-dark rounded-xl px-4 py-3 shadow-xl border border-white/40">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900 mt-0.5">
        {mood} <span className="text-sm font-normal text-slate-500">Score: {payload[0].value}</span>
      </p>
    </div>
  );
}

function MoodSparkline({ weekMoods }: { weekMoods: { mood: string; created_at: string }[] }) {
  const chartData = weekMoods.map((m, i) => {
    const option = MOOD_OPTIONS.find((o) => o.value === m.mood);
    return { index: i, score: option?.score || 3 };
  });

  if (chartData.length < 2) return null;

  return (
    <div className="h-16 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  const stats = data?.stats || { totalChats: 0, moodScore: 0, journalCount: 0, wellnessStreak: 0 };

  const moodChartData = (data?.weekMoods || []).map((m) => {
    const option = MOOD_OPTIONS.find((o) => o.value === m.mood);
    return {
      date: formatDate(m.created_at).split(",")[0],
      score: option?.score || 3,
      mood: option?.emoji || "😐",
      label: option?.label || "Neutral",
    };
  });

  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";

  const welcomeQuotes = [
    "Take a moment to check in with yourself.",
    "Every step forward is progress.",
    "Your mind matters — nurture it.",
    "Small wins lead to big changes.",
  ];
  const quote = welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];

  const statCards = [
    {
      label: "Total Chats", value: stats.totalChats, icon: MessageCircle,
      gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20",
      bg: "bg-blue-50", text: "text-blue-600", chart: true,
    },
    {
      label: "Mood Score", value: stats.moodScore, suffix: "%", icon: Smile,
      gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/20",
      bg: "bg-purple-50", text: "text-purple-600",
    },
    {
      label: "Journal Entries", value: stats.journalCount, icon: BookOpen,
      gradient: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-500/20",
      bg: "bg-indigo-50", text: "text-indigo-600",
    },
    {
      label: "Wellness Streak", value: stats.wellnessStreak, suffix: "d", icon: Flame,
      gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20",
      bg: "bg-orange-50", text: "text-orange-600",
    },
  ];

  const quickActions = [
    { href: "/chat", icon: MessageCircle, label: "Start Chatting", desc: "Talk to your AI companion", color: "from-blue-500 to-cyan-500" },
    { href: "/mood", icon: Smile, label: "Log Mood", desc: "Track how you're feeling", color: "from-purple-500 to-pink-500" },
    { href: "/journal", icon: BookOpen, label: "Write Journal", desc: "Reflect on your day", color: "from-indigo-500 to-violet-500" },
    { href: "/wellness", icon: Sparkles, label: "Wellness Tips", desc: "Personalized guidance", color: "from-emerald-500 to-teal-500" },
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayScores = weekDays.map((day, i) => {
    const dayMoods = (data?.weekMoods || []).filter((m) => {
      const d = new Date(m.created_at);
      return d.getDay() === i;
    });
    const avg = dayMoods.length
      ? Math.round(dayMoods.reduce((s, m) => s + (MOOD_OPTIONS.find((o) => o.value === m.mood)?.score || 3), 0) / dayMoods.length)
      : 0;
    return { day, score: avg, count: dayMoods.length };
  });

  const todayActivity = (data?.recentActivity || []).filter((a) => {
    const d = new Date(a.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <AppLayout>
      <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8 w-full">
        {/* Decorative background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="glass-orb absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-30 animate-float-slow" />
          <div className="glass-orb absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-20 animate-float-delayed" />
          <div className="particle top-1/4 right-1/4 h-3 w-3 bg-primary-400 animate-float" />
          <div className="particle top-1/3 left-1/5 h-2 w-2 bg-accent-400 animate-float-delayed" />
          <div className="particle bottom-1/3 right-1/3 h-2.5 w-2.5 bg-cyan-400 animate-float-slow" />
        </div>

        {/* Welcome header */}
        <div className="relative animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                  {greeting}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="gradient-text">Your Wellness Dashboard</span>
              </h1>
              <p className="text-slate-500 mt-1 max-w-lg">{quote}</p>
            </div>
            <Link
              href="/wellness"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Get Wellness Tip
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className={`group card overflow-hidden relative animate-slide-up`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className={`w-full h-full rounded-full bg-gradient-to-br ${card.gradient} blur-3xl transform translate-x-1/2 -translate-y-1/2`} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <TrendingUp className={`h-4 w-4 ${card.value > 0 ? "text-green-400" : "text-slate-300"}`} />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter value={card.value} suffix={card.suffix || ""} />
                </p>
                <p className="text-sm text-slate-500 mt-1 font-medium">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Weekly mood chart */}
          <div className="card lg:col-span-2 min-w-0 overflow-hidden animate-slide-up" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-slate-900">Weekly Mood Trends</h2>
              </div>
              {moodChartData.length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  {moodChartData.length} entries
                </span>
              )}
            </div>
            <div className="w-full h-[260px]">
              {moodChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.06)" }} />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={48}>
                      {moodChartData.map((entry, idx) => {
                        const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#14b8a6"];
                        return <Cell key={idx} fill={colors[idx % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Smile className="h-10 w-10 mb-3 text-slate-300" aria-hidden="true" />
                  <p className="text-sm font-medium">No mood data this week</p>
                  <Link href="/mood" className="text-sm text-primary-600 mt-2 hover:underline inline-flex items-center gap-1">
                    Log your mood <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Weekly heatmap */}
          <div className="card min-w-0 overflow-hidden animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900">Week Overview</h2>
            </div>
            <div className="space-y-2.5">
              {dayScores.map((d, i) => (
                <div key={d.day} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${300 + i * 60}ms` }}>
                  <span className="text-xs font-semibold text-slate-500 w-8">{d.day}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        d.score >= 4 ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : d.score >= 3 ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                        : d.score > 0 ? "bg-gradient-to-r from-red-400 to-rose-500"
                        : "bg-slate-200"
                      }`}
                      style={{ width: `${d.score * 20}%`, animationDelay: `${400 + i * 80}ms` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-6 text-right">
                    {d.count || ""}
                  </span>
                </div>
              ))}
            </div>
            {moodChartData.length >= 2 && <MoodSparkline weekMoods={data?.weekMoods || []} />}
          </div>
        </div>

        {/* Recent Activity + Quick Actions */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="card lg:col-span-2 min-w-0 overflow-hidden animate-slide-up" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              {(data?.recentActivity || []).length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  Latest {(data?.recentActivity || []).length}
                </span>
              )}
            </div>
            <div className="relative">
              {/* Timeline line */}
              {(data?.recentActivity || []).length > 0 && (
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-200 via-accent-200 to-transparent" />
              )}
              <div className="space-y-3">
                {(data?.recentActivity || []).length > 0 ? (
                  data!.recentActivity.map((activity, idx) => {
                    const isToday = todayActivity.some((a) => a.id === activity.id);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 p-4 transition-all duration-200 hover:shadow-md animate-fade-in"
                        style={{ animationDelay: `${400 + idx * 100}ms` }}
                      >
                        <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          isToday
                            ? "bg-gradient-to-br from-primary-400 to-accent-400 text-white pulse-ring"
                            : "bg-gradient-to-br from-primary-100 to-accent-100 text-primary-500"
                        }`}>
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-700 break-words whitespace-normal leading-relaxed">
                            {activity.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1.5 font-medium">
                            {formatDate(activity.created_at)} at {formatTime(activity.created_at)}
                            {isToday && <span className="ml-2 text-primary-500 font-semibold">Today</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10">
                    <Activity className="h-10 w-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-sm text-slate-400">No recent activity</p>
                    <Link href="/chat" className="text-sm text-primary-600 mt-2 inline-flex items-center gap-1 hover:underline">
                      Start a conversation <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <h2 className="text-lg font-semibold text-slate-900 px-1">Quick Actions</h2>
            {quickActions.map((action, i) => (
              <Link
                key={action.label}
                href={action.href}
                className="group card flex items-center gap-4 hover:-translate-y-0.5"
                style={{ animationDelay: `${450 + i * 80}ms`, animationFillMode: "both" }}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
