"use client";

import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { JournalEntry } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import {
  Plus, Search, Edit2, Trash2, X, BookOpen,
  Clock, CalendarDays, Sparkles, AlignLeft
} from "lucide-react";

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function readingTime(text: string): string {
  const wc = wordCount(text);
  const min = Math.max(1, Math.ceil(wc / 200));
  return `${min} min read`;
}

function groupByDate(entries: JournalEntry[]): Map<string, JournalEntry[]> {
  const groups = new Map<string, JournalEntry[]>();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    let key: string;
    if (date.toDateString() === today) key = "Today";
    else if (date.toDateString() === yesterday) key = "Yesterday";
    else key = formatDate(entry.created_at);
    const existing = groups.get(key) || [];
    existing.push(entry);
    groups.set(key, existing);
  });
  return groups;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEntries = async (q?: string) => {
    setLoading(true);
    const url = q ? `/api/journal?search=${encodeURIComponent(q)}` : "/api/journal";
    const res = await fetch(url);
    const data = await res.json();
    setEntries(data.entries || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntries(search);
  };

  const openEditor = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setEditingEntry(null);
      setTitle("");
      setContent("");
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingEntry(null);
    setTitle("");
    setContent("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);
    const method = editingEntry ? "PUT" : "POST";
    const body = editingEntry
      ? { id: editingEntry.id, title, content }
      : { title, content };

    const res = await fetch("/api/journal", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      closeEditor();
      fetchEntries(search);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this journal entry?")) return;
    await fetch("/api/journal", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEntries(search);
  };

  const grouped = useMemo(() => groupByDate(entries), [entries]);
  const totalWords = useMemo(() => entries.reduce((s, e) => s + wordCount(e.content), 0), [entries]);

  return (
    <AppLayout>
      <div className="relative w-full space-y-6">
        {/* Decorative */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="glass-orb absolute -top-32 -right-32 h-72 w-72 rounded-full opacity-20 animate-float-slow" />
          <div className="glass-orb absolute -bottom-48 -left-32 h-80 w-80 rounded-full opacity-15 animate-float-delayed" />
        </div>

        {/* Header */}
        <div className="relative animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Reflections</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="gradient-text">Daily Journal</span>
              </h1>
              <p className="text-slate-500 mt-1">Reflect, process, and grow — one entry at a time</p>
            </div>
            <Button onClick={() => openEditor()} className="group">
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        {entries.length > 0 && (
          <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
            <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span className="font-medium text-slate-700">{entries.length}</span>
              <span className="text-slate-400">entries</span>
            </div>
            <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
              <AlignLeft className="h-4 w-4 text-indigo-500" />
              <span className="font-medium text-slate-700">{totalWords.toLocaleString()}</span>
              <span className="text-slate-400">words</span>
            </div>
            <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-indigo-500" />
              <span className="font-medium text-slate-700">{grouped.size}</span>
              <span className="text-slate-400">days</span>
            </div>
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="relative animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border-slate-200/80 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/50"
            placeholder="Search entries by title or content..."
            aria-label="Search journal entries"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); fetchEntries(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Editor overlay */}
        {showEditor && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeEditor} />
            <form
              onSubmit={handleSave}
              className="relative w-full max-w-2xl card space-y-5 animate-scale-in shadow-2xl border border-white/50 max-h-[85vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md -m-4 sm:-m-6 p-4 sm:p-6 border-b border-slate-100 rounded-t-[2rem] z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingEntry ? "Edit Entry" : "New Entry"}
                  </h2>
                </div>
                <button type="button" onClick={closeEditor} className="rounded-xl p-2 hover:bg-slate-100 transition-colors" aria-label="Close editor">
                  <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-lg font-semibold border-0 border-b-2 border-slate-100 rounded-none px-0 pb-3 focus:ring-0 focus:border-indigo-300 bg-transparent"
                  placeholder="Entry title..."
                  aria-label="Entry title"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field resize-none min-h-[280px] border-0 bg-slate-50/50 rounded-2xl p-5 focus:bg-white focus:ring-2 focus:ring-indigo-100 leading-relaxed"
                  placeholder="Write your thoughts, feelings, and reflections..."
                  required
                  aria-label="Journal content"
                />
                {content && (
                  <div className="flex items-center gap-3 text-xs text-slate-400 ml-1">
                    <span className="flex items-center gap-1">
                      <AlignLeft className="h-3 w-3" />
                      {wordCount(content)} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime(content)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-slate-100 pt-4">
                <Button type="submit" loading={saving}>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {editingEntry ? "Save Changes" : "Publish Entry"}
                </Button>
                <Button type="button" variant="secondary" onClick={closeEditor}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <PageLoader />
        ) : entries.length > 0 ? (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([dateLabel, dateEntries], groupIdx) => (
              <div key={dateLabel} className="animate-slide-up" style={{ animationDelay: `${200 + groupIdx * 100}ms`, animationFillMode: "both" }}>
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{dateLabel}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-200/50 to-transparent" />
                  <span className="text-xs text-slate-400 font-medium">{dateEntries.length} entry{dateEntries.length > 1 ? "s" : ""}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {dateEntries.map((entry, idx) => {
                    const wc = wordCount(entry.content);
                    const rt = readingTime(entry.content);
                    return (
                      <article
                        key={entry.id}
                        className="group card relative overflow-hidden hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${300 + (groupIdx * dateEntries.length + idx) * 60}ms` }}
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.03]">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {entry.title || "Untitled"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <p className="text-xs text-slate-400">
                                  {formatDate(entry.created_at)}
                                </p>
                                <span className="text-slate-200">·</span>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {rt}
                                </p>
                                <span className="text-slate-200">·</span>
                                <p className="text-xs text-slate-400">{wc} words</p>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => openEditor(entry)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Edit entry"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Delete entry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {entry.content && (
                            <div className="mt-3">
                              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                {entry.content}
                              </p>
                            </div>
                          )}
                          {entry.updated_at !== entry.created_at && (
                            <p className="text-xs text-slate-400 mt-2 italic">edited</p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 animate-scale-in">
            <div className="flex justify-center mb-5">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-indigo-400" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No journal entries yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Start your journaling journey — every great reflection begins with a single word.
            </p>
            <Button onClick={() => openEditor()}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Write Your First Entry
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
