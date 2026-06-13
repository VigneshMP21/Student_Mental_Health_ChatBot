"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import type { JournalEntry } from "@/types";
import { formatDate, formatTime } from "@/utils/helpers";
import { Plus, Search, Edit2, Trash2, X, BookOpen } from "lucide-react";

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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Daily Journal</h1>
            <p className="text-sm text-slate-500">Reflect, process, and grow</p>
          </div>
          <Button onClick={() => openEditor()}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Entry
          </Button>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search entries..."
            aria-label="Search journal entries"
          />
        </form>

        {showEditor && (
          <form onSubmit={handleSave} className="card space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingEntry ? "Edit Entry" : "New Entry"}
              </h2>
              <button type="button" onClick={closeEditor} aria-label="Close editor">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Entry title"
              aria-label="Entry title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none min-h-[200px]"
              placeholder="Write your thoughts..."
              required
              aria-label="Journal content"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" loading={saving}>Save Entry</Button>
              <Button type="button" variant="secondary" onClick={closeEditor}>Cancel</Button>
            </div>
          </form>
        )}

        {loading ? (
          <PageLoader />
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article key={entry.id} className="card group">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(entry.created_at)} at {formatTime(entry.created_at)}
                      {entry.updated_at !== entry.created_at && " (edited)"}
                    </p>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-3 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditor(entry)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                      aria-label="Edit entry"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-500">No journal entries yet</p>
            <Button onClick={() => openEditor()} className="mt-4">
              Write Your First Entry
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
