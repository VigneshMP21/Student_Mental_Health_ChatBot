"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ChatMessages } from "@/components/chat/ChatMessage";
import Button from "@/components/ui/Button";
import { WELLNESS_CATEGORIES } from "@/types";
import type { ChatUIMessage } from "@/types";
import {
  BookOpen, Heart, Moon, Clock, Wind, Sparkles, Zap,
  ArrowLeft, RefreshCw, Send, X, ChevronRight
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Heart, Moon, Clock, Wind, Sparkles, Zap,
};

const categoryGradients: Record<string, string> = {
  study: "from-blue-400 to-cyan-500",
  stress: "from-rose-400 to-pink-500",
  sleep: "from-indigo-400 to-purple-500",
  time: "from-amber-400 to-orange-500",
  breathing: "from-teal-400 to-emerald-500",
  meditation: "from-violet-400 to-purple-500",
  motivation: "from-orange-400 to-red-500",
};

const categoryBGs: Record<string, string> = {
  study: "bg-gradient-to-br from-blue-50 to-cyan-50",
  stress: "bg-gradient-to-br from-rose-50 to-pink-50",
  sleep: "bg-gradient-to-br from-indigo-50 to-purple-50",
  time: "bg-gradient-to-br from-amber-50 to-orange-50",
  breathing: "bg-gradient-to-br from-teal-50 to-emerald-50",
  meditation: "bg-gradient-to-br from-violet-50 to-purple-50",
  motivation: "bg-gradient-to-br from-orange-50 to-red-50",
};

const categoryGlows: Record<string, string> = {
  study: "shadow-blue-500/15",
  stress: "shadow-pink-500/15",
  sleep: "shadow-purple-500/15",
  time: "shadow-orange-500/15",
  breathing: "shadow-emerald-500/15",
  meditation: "shadow-violet-500/15",
  motivation: "shadow-red-500/15",
};

function SkeletonLoader() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl shimmer-bg" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded-lg shimmer-bg" />
          <div className="h-3 w-1/4 rounded-lg shimmer-bg" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-8 w-8 rounded-lg shimmer-bg shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 rounded-lg shimmer-bg" />
            <div className="h-3 w-1/2 rounded-lg shimmer-bg" />
            <div className="h-3 w-2/3 rounded-lg shimmer-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WellnessPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState("");
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const generateSuggestion = async () => {
    if (!selectedCategory || isLoading) return;

    setIsLoading(true);
    setShowSkeleton(true);
    setShowRegenerateInput(false);
    const categoryLabel =
      WELLNESS_CATEGORIES.find((c) => c.id === selectedCategory)?.label.toLowerCase() ||
      "wellness";
    const trimmedContext = context.trim();
    const userMsg: ChatUIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedContext
        ? `I'd like ${categoryLabel} suggestions.\n\n${trimmedContext}`
        : `I'd like ${categoryLabel} suggestions.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          wellnessCategory: selectedCategory,
          context: trimmedContext || undefined,
          persist: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowSkeleton(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setShowSkeleton(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: err instanceof Error ? err.message : "Failed to generate suggestion",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setMessages([]);
    setContext("");
    setShowRegenerateInput(false);
    setShowSkeleton(false);
  };

  const handleRegenerate = () => {
    setShowRegenerateInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (selectedCategory) {
    const category = WELLNESS_CATEGORIES.find((c) => c.id === selectedCategory)!;
    const Icon = iconMap[category.icon];
    const grad = categoryGradients[category.id] || "from-primary-500 to-accent-500";
    const bg = categoryBGs[category.id] || "bg-white";

    return (
      <AppLayout>
        <div className="relative w-full space-y-6">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to categories
          </button>

          <div className={`flex items-center gap-4 rounded-3xl p-5 sm:p-6 ${bg} animate-slide-up`}>
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg`}>
              {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{category.label}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Personalized AI-powered wellness suggestions</p>
            </div>
          </div>

          {messages.length === 0 && !showSkeleton && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                generateSuggestion();
              }}
              className="card space-y-4 animate-scale-in"
            >
              <div className="flex items-center gap-2">
                <Sparkles className={`h-5 w-5 ${grad.includes("rose") ? "text-pink-500" : "text-primary-500"}`} />
                <h2 className="text-lg font-semibold text-slate-900">Tell us about your situation</h2>
              </div>
              <label htmlFor="wellness-context" className="block text-sm text-slate-600">
                The more context you share, the more personalized your suggestions will be.
              </label>
              <textarea
                id="wellness-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field resize-none min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary-100"
                rows={3}
                placeholder="e.g., I have finals next week and can't sleep..."
              />
              <Button type="submit" loading={isLoading} className="group">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Generate Suggestions
              </Button>
            </form>
          )}

          {(messages.length > 0 || showSkeleton) && (
            <div className="glass flex min-h-[380px] max-h-[760px] flex-col overflow-hidden lg:h-[68vh] lg:min-h-[520px] rounded-[2rem] animate-slide-up">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {showSkeleton && messages.length <= 1 ? (
                  <SkeletonLoader />
                ) : (
                  <ChatMessages messages={messages} isLoading={isLoading} />
                )}
              </div>
              <div className="border-t border-slate-200/50 p-4 bg-white/40 backdrop-blur-sm">
                {showRegenerateInput ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      generateSuggestion();
                    }}
                    className="space-y-3"
                  >
                    <label htmlFor="wellness-regenerate-context" className="block text-sm font-medium text-slate-700">
                      Additional context for better suggestions
                    </label>
                    <textarea
                      ref={inputRef}
                      id="wellness-regenerate-context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="input-field min-h-24 resize-none rounded-2xl"
                      rows={3}
                      placeholder="Add more details to refine your suggestions..."
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" loading={isLoading}>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isLoading}
                        onClick={() => setShowRegenerateInput(false)}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleRegenerate}
                      loading={isLoading}
                      variant="secondary"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      New Suggestions
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Change Category
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative max-w-4xl mx-auto space-y-8 w-full">
        {/* Decorative */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="glass-orb absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-25 animate-float-slow" />
          <div className="glass-orb absolute -bottom-32 -left-20 h-72 w-72 rounded-full opacity-20 animate-float-delayed" />
        </div>

        {/* Header */}
        <div className="relative animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">AI-Powered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="gradient-text">Wellness Suggestions</span>
          </h1>
          <p className="text-slate-500 mt-1">AI-powered personalized wellness guidance for your mind and body</p>
        </div>

        {/* Category grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {WELLNESS_CATEGORIES.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            const grad = categoryGradients[cat.id] || "from-primary-500 to-accent-500";
            const glow = categoryGlows[cat.id] || "shadow-primary-500/15";
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group card text-left relative overflow-hidden hover:-translate-y-1.5 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.06]">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${grad} blur-3xl transform translate-x-1/2 -translate-y-1/2`} />
                </div>
                <div className="relative z-10">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg ${glow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {Icon && <Icon className="h-7 w-7" aria-hidden="true" />}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{cat.label}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    Get personalized tips
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
