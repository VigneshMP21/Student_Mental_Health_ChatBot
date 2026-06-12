"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import { TypingIndicator } from "@/components/ui/LoadingSpinner";
import type { ChatUIMessage } from "@/types";
import { cn } from "@/utils/helpers";

interface ChatMessageProps {
  message: ChatUIMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export default function ChatMessageBubble({ message, onRegenerate, isLast }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("flex gap-3 animate-fade-in", isUser ? "justify-end" : "justify-start")}
      role="article"
      aria-label={isUser ? "Your message" : "AI response"}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
          AI
        </div>
      )}

      <div className={cn("group max-w-[80%] sm:max-w-[70%]", isUser ? "order-first" : "")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-br-md"
              : "bg-white border border-slate-100 shadow-sm text-slate-700 rounded-bl-md"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Copy response"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Regenerate response"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-600">
          You
        </div>
      )}
    </div>
  );
}

interface ChatMessagesProps {
  messages: ChatUIMessage[];
  isLoading: boolean;
  onRegenerate?: () => void;
}

export function ChatMessages({ messages, isLoading, onRegenerate }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-6" role="log" aria-live="polite" aria-label="Chat messages">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
            <span className="text-2xl" role="img" aria-label="wave">👋</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Hi there! I&apos;m MindWell</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            I&apos;m here to support you. Share what&apos;s on your mind — whether it&apos;s stress,
            study challenges, or just needing someone to listen.
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          isLast={i === messages.length - 1 && msg.role === "assistant"}
          onRegenerate={onRegenerate}
        />
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
            AI
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm rounded-bl-md">
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
