"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { Conversation } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import {
  MessageCircle, Trash2, Search, ArrowRight, Pencil, Check, X,
  CalendarDays, Clock, MessagesSquare, Sparkles
} from "lucide-react";

function groupByDate(conversations: Conversation[]): Map<string, Conversation[]> {
  const groups = new Map<string, Conversation[]>();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  conversations.forEach((conv) => {
    const date = new Date(conv.updated_at);
    let key: string;
    if (date.toDateString() === today) key = "Today";
    else if (date.toDateString() === yesterday) key = "Yesterday";
    else key = formatDate(conv.updated_at);
    const existing = groups.get(key) || [];
    existing.push(conv);
    groups.set(key, existing);
  });
  return groups;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchConversations = async () => {
    setLoading(true);
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data.conversations || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    await fetch("/api/conversations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchConversations();
  };

  const startRename = (conversation: Conversation) => {
    setError("");
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle("");
    setError("");
  };

  const handleRename = async (id: string) => {
    const nextTitle = editTitle.trim();
    if (!nextTitle) {
      setError("Conversation title cannot be empty.");
      return;
    }

    setRenamingId(id);
    setError("");

    try {
      const res = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: nextTitle }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to rename conversation");
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === id ? data.conversation : conversation
        )
      );
      cancelRename();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename conversation.");
    } finally {
      setRenamingId(null);
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const totalConversations = conversations.length;

  return (
    <AppLayout>
      <div className="relative max-w-4xl mx-auto space-y-6 w-full">
        {/* Decorative */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="glass-orb absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-20 animate-float-slow" />
          <div className="glass-orb absolute -bottom-40 -right-40 h-80 w-80 rounded-full opacity-15 animate-float-delayed" />
        </div>

        {/* Header */}
        <div className="relative animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <MessagesSquare className="h-5 w-5 text-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">Conversations</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="gradient-text">Chat History</span>
              </h1>
              <p className="text-slate-500 mt-1">View and continue your previous conversations</p>
            </div>
            {totalConversations > 0 && (
              <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-primary-500" />
                <span className="font-semibold text-slate-700">{totalConversations}</span>
                <span className="text-slate-400">total</span>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-in" style={{ animationDelay: "80ms" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border-slate-200/80 focus:border-primary-300 focus:ring-2 focus:ring-primary-100/50"
            placeholder="Search conversations by title..."
            aria-label="Search conversations"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 animate-slide-up-sm" role="alert">
            {error}
          </div>
        )}

        {/* Conversation list */}
        {loading ? (
          <PageLoader />
        ) : filtered.length > 0 ? (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([dateLabel, convs], groupIdx) => (
              <div key={dateLabel} className="animate-slide-up" style={{ animationDelay: `${150 + groupIdx * 100}ms`, animationFillMode: "both" }}>
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{dateLabel}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary-200/50 to-transparent" />
                  <span className="text-xs text-slate-400 font-medium">{convs.length} chat{convs.length > 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-2">
                  {convs.map((conv, idx) => (
                    <div
                      key={conv.id}
                      className="group card flex flex-col gap-4 sm:flex-row sm:items-center w-full min-w-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
                      style={{ animationDelay: `${250 + (groupIdx * convs.length + idx) * 50}ms` }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white transition-all duration-300">
                        <MessageCircle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 w-full sm:w-auto self-stretch sm:self-auto overflow-hidden">
                        {editingId === conv.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleRename(conv.id);
                            }}
                            className="flex w-full max-w-lg items-center gap-2"
                          >
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="input-field h-10 py-2 rounded-xl px-3"
                              maxLength={100}
                              aria-label="Conversation title"
                              autoFocus
                            />
                            <button
                              type="submit"
                              disabled={renamingId === conv.id}
                              className="rounded-xl p-2 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                              aria-label="Save conversation title"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelRename}
                              disabled={renamingId === conv.id}
                              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                              aria-label="Cancel rename"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </form>
                        ) : (
                          <div>
                            <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                              {conv.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {formatDate(conv.updated_at)} at {formatTime(conv.updated_at)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
                        <Link
                          href={`/chat?conversation=${conv.id}`}
                          className="group inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-all"
                        >
                          Continue
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        {editingId !== conv.id && (
                          <>
                            <button
                              onClick={() => startRename(conv)}
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary-50 hover:text-primary-600 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label="Rename conversation"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(conv.id)}
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label="Delete conversation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 animate-scale-in">
            <div className="flex justify-center mb-5">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-primary-400" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {search ? "No conversations match your search" : "No conversations yet"}
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              {search
                ? "Try a different search term or clear the filter."
                : "Start your first conversation with MindWell — your AI companion is ready to listen."
              }
            </p>
            <Link href="/chat" className="btn-primary inline-flex group">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start a Conversation
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
