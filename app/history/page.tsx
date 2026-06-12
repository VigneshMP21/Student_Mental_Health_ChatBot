"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { Conversation } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import { MessageCircle, Trash2, Search, ArrowRight } from "lucide-react";

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

        {loading ? (
          <PageLoader />
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((conv) => (
              <div key={conv.id} className="card group flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 truncate">{conv.title}</h3>
                  <p className="text-xs text-slate-400">
                    {formatDate(conv.updated_at)} at {formatTime(conv.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/chat?conversation=${conv.id}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => handleDelete(conv.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
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
