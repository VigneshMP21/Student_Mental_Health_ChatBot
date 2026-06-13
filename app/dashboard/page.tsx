"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { MessageCircle, Smile, BookOpen, Flame, Activity } from "lucide-react";
import { formatDate, formatTime } from "@/utils/helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOOD_OPTIONS } from "@/types";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalChats: number;
    moodScore: number;
    journalCount: number;
    wellnessStreak: number;
  };
  weekMoods: { mood: string; created_at: string }[];
  recentActivity: {
    id: string;
    message: string;
    created_at: string;
  }[];
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
      date: formatDate(m.created_at),
      score: option?.score || 3,
      mood: option?.emoji || "😐",
    };
  });

  const statCards = [
    { label: "Total Chats", value: stats.totalChats, icon: MessageCircle, color: "from-blue-500 to-blue-600" },
    { label: "Mood Score", value: `${stats.moodScore}%`, icon: Smile, color: "from-purple-500 to-purple-600" },
    { label: "Journal Entries", value: stats.journalCount, icon: BookOpen, color: "from-indigo-500 to-indigo-600" },
    { label: "Wellness Streak", value: `${stats.wellnessStreak} days`, icon: Flame, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 px-4 py-4 sm:px-6 lg:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Your wellness overview at a glance</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="card group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Weekly Mood Trends</h2>
            {moodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={moodChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-slate-400">
                <Smile className="h-8 w-8 mb-2" aria-hidden="true" />
                <p className="text-sm">No mood data yet</p>
                <Link href="/mood" className="text-sm text-primary-600 mt-2 hover:underline">Log your mood</Link>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {(data?.recentActivity || []).length > 0 ? (
                data!.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex flex-col sm:flex-row items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <MessageCircle className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 truncate">{activity.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(activity.created_at)} at {formatTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Link href="/chat" className="card hover:-translate-y-1 text-center group">
            <MessageCircle className="h-8 w-8 text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="font-semibold text-slate-900">Start Chatting</p>
            <p className="text-xs text-slate-500 mt-1">Talk to your AI companion</p>
          </Link>
          <Link href="/mood" className="card hover:-translate-y-1 text-center group">
            <Smile className="h-8 w-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="font-semibold text-slate-900">Log Mood</p>
            <p className="text-xs text-slate-500 mt-1">Track how you&apos;re feeling</p>
          </Link>
          <Link href="/journal" className="card hover:-translate-y-1 text-center group">
            <BookOpen className="h-8 w-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <p className="font-semibold text-slate-900">Write Journal</p>
            <p className="text-xs text-slate-500 mt-1">Reflect on your day</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
