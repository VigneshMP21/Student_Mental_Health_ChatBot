"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { ChatMessages } from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthContext";
import type { ChatUIMessage } from "@/types";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams.get("conversation");
  const { profile } = useAuth();

  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(conversationIdParam);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(!conversationIdParam);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const uiMessages: ChatUIMessage[] = [];
      for (const msg of data.messages) {
        uiMessages.push({
          id: `${msg.id}-user`,
          role: "user",
          content: msg.message,
          timestamp: new Date(msg.created_at),
        });
        uiMessages.push({
          id: `${msg.id}-ai`,
          role: "assistant",
          content: msg.ai_response,
          timestamp: new Date(msg.created_at),
        });
      }
      setMessages(uiMessages);
      setConversationId(id);
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (conversationIdParam) {
      loadConversation(conversationIdParam);
    }
  }, [conversationIdParam, loadConversation]);

  const sendMessage = async (content: string, regenerate = false) => {
    if (isLoading) return;

    let userMessage = content;
    let history = messages.map((m) => ({ role: m.role, content: m.content }));

    if (regenerate) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
      if (!lastUserMsg) return;
      userMessage = lastUserMsg.content;
      setMessages((prev) => prev.slice(0, -1));
      history = history.slice(0, -2);
    } else {
      const newMsg: ChatUIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMsg]);
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history,
          conversationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMsg: ChatUIMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatUIMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setConversationId(null);
  };

  if (!loaded) {
    return (
      <AppLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-2 sm:px-0 min-h-0">
        <div className="mb-4 shrink-0 mt-2 sm:mt-0">
          <h1 className="text-2xl font-bold text-slate-900">Wellness Chat</h1>
          <p className="text-sm text-slate-500">Your AI companion for emotional support</p>
        </div>

        <div className="flex flex-1 flex-col glass rounded-2xl overflow-hidden min-h-0 shadow-lg">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            userAvatar={profile?.avatar}
            onRegenerate={() => sendMessage("", true)}
          />
          <ChatInput
            onSend={sendMessage}
            onClear={handleClear}
            disabled={isLoading}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </AppLayout>
  );
}
