"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ChatMessages } from "@/components/chat/ChatMessage";
import Button from "@/components/ui/Button";
import { WELLNESS_CATEGORIES } from "@/types";
import type { ChatUIMessage } from "@/types";
import {
  BookOpen,
  Heart,
  Moon,
  Clock,
  Wind,
  Sparkles,
  Zap,
  ArrowLeft,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Heart,
  Moon,
  Clock,
  Wind,
  Sparkles,
  Zap,
};

export default function WellnessPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState("");
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);

  const generateSuggestion = async () => {
    if (!selectedCategory || isLoading) return;

    setIsLoading(true);
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
  };

  if (selectedCategory) {
    const category = WELLNESS_CATEGORIES.find((c) => c.id === selectedCategory)!;
    const Icon = iconMap[category.icon];

    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to categories
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{category.label}</h1>
              <p className="text-sm text-slate-500">Personalized wellness suggestions</p>
            </div>
          </div>

          {messages.length === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                generateSuggestion();
              }}
              className="card space-y-4"
            >
              <label htmlFor="wellness-context" className="block text-sm font-medium text-slate-700">
                Tell us about your situation (optional)
              </label>
              <textarea
                id="wellness-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="e.g., I have finals next week and can't sleep..."
              />
              <Button type="submit" loading={isLoading}>
                Generate Suggestions
              </Button>
            </form>
          )}

          {messages.length > 0 && (
            <div className="glass flex min-h-[380px] max-h-[760px] flex-col overflow-hidden lg:h-[68vh] lg:min-h-[520px]">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <div className="border-t border-slate-200/50 p-4">
                {showRegenerateInput ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      generateSuggestion();
                    }}
                    className="space-y-3"
                  >
                    <label htmlFor="wellness-regenerate-context" className="block text-sm font-medium text-slate-700">
                      Additional context
                    </label>
                    <textarea
                      id="wellness-regenerate-context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="input-field min-h-24 resize-none"
                      rows={3}
                      placeholder="Add details for the next suggestion..."
                      autoFocus
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
                  <Button
                    type="button"
                    onClick={() => setShowRegenerateInput(true)}
                    loading={isLoading}
                    variant="secondary"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Regenerate Suggestions
                  </Button>
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
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wellness Suggestions</h1>
          <p className="text-sm text-slate-500">AI-powered personalized wellness guidance</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WELLNESS_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="card text-left hover:-translate-y-1 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 mb-4 group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white transition-all duration-300">
                  {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                </div>
                <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                <p className="text-xs text-slate-500 mt-1">Get personalized tips</p>
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
