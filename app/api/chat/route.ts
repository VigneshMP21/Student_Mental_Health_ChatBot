import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithTimeout } from "@/lib/gemini/client";
import { checkRateLimit, sanitizeInput } from "@/utils/security";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(10000),
  history: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  conversationId: z.string().uuid().nullable().optional(),
  wellnessCategory: z.string().optional(),
  context: z.string().optional(),
  persist: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before sending more messages." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { message, history, conversationId, wellnessCategory, context, persist } = parsed.data;
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    if (persist) {
      await ensureUserRecords(supabase, user);
    }

    const aiResponse = await generateWithTimeout({
      message: sanitizedMessage,
      history,
      wellnessCategory,
      context,
    });

    if (!persist) {
      return NextResponse.json({
        response: aiResponse,
        conversationId: null,
      });
    }

    let convId = conversationId;

    if (!convId) {
      const title = sanitizedMessage.slice(0, 50) + (sanitizedMessage.length > 50 ? "..." : "");
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();

      if (convError) throw convError;
      convId = conv.id;
    }

    const { error: saveError } = await supabase.from("chat_history").insert({
      user_id: user.id,
      conversation_id: convId,
      message: sanitizedMessage,
      ai_response: aiResponse,
    });

    if (saveError) throw saveError;

    await updateWellnessStreak(supabase, user.id);

    return NextResponse.json({
      response: aiResponse,
      conversationId: convId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error && error.message === "Request timed out"
        ? "The request timed out. Please try again."
        : "Failed to generate response. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function ensureUserRecords(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User
) {
  const email = user.email ?? "";
  const name =
    typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : email.split("@")[0] || "Student";
  const avatar =
    typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

  const { error: profileError } = await supabase.from("users").upsert(
    {
      id: user.id,
      name,
      email,
      avatar,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (profileError) throw profileError;

  const { error: streakError } = await supabase.from("wellness_streaks").upsert(
    {
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
    },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  if (streakError) throw streakError;
}

async function updateWellnessStreak(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { data: streak } = await supabase
    .from("wellness_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak) return;

  if (streak.last_activity_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    streak.last_activity_date === yesterdayStr ? streak.current_streak + 1 : 1;

  await supabase
    .from("wellness_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}
