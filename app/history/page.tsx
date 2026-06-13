"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { Conversation } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import { MessageCircle, Trash2, Search, ArrowRight, Pencil, Check, X } from "lucide-react";

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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat History</h1>
          <p className="text-sm text-slate-500">View and continue previous conversations</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search conversations..."
            aria-label="Search conversations"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((conv) => (
              <div key={conv.id} className="card group flex flex-col gap-4 sm:flex-row sm:items-center overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 w-full self-stretch sm:self-auto">
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
                        className="input-field h-10 py-2"
                        maxLength={100}
                        aria-label="Conversation title"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={renamingId === conv.id}
                        className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Save conversation title"
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelRename}
                        disabled={renamingId === conv.id}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Cancel rename"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </form>
                  ) : (
                    <h3 className="font-medium text-slate-900 truncate">{conv.title}</h3>
                  )}
                  <p className="text-xs text-slate-400">
                    {formatDate(conv.updated_at)} at {formatTime(conv.updated_at)}
                  </p>
                </div>
                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <Link
                    href={`/chat?conversation=${conv.id}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                  {editingId !== conv.id && (
                    <button
                      onClick={() => startRename(conv)}
                      className="rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-primary-50 hover:text-primary-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Rename conversation"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(conv.id)}
                    className="rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-500">
              {search ? "No conversations match your search" : "No conversations yet"}
            </p>
            <Link href="/chat" className="btn-primary mt-4 inline-flex">
              Start a Conversation
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
