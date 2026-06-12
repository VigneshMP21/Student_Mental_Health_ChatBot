import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/utils/security";
import { z } from "zod";

const moodSchema = z.object({
  mood: z.enum(["happy", "neutral", "sad", "anxious", "angry", "tired"]),
  note: z.string().max(1000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";

    let query = supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte("created_at", weekAgo.toISOString());
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte("created_at", monthAgo.toISOString());
    }

    const { data: moods, error } = await query;

    if (error) throw error;

    return NextResponse.json({ moods });
  } catch (error) {
    console.error("Mood GET error:", error);
    return NextResponse.json({ error: "Failed to fetch moods" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = moodSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid mood data" }, { status: 400 });
    }

    const { mood, note } = parsed.data;

    const { data, error } = await supabase
      .from("mood_logs")
      .insert({
        user_id: user.id,
        mood,
        note: note ? sanitizeInput(note) : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ mood: data });
  } catch (error) {
    console.error("Mood POST error:", error);
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    const { error } = await supabase
      .from("mood_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mood DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete mood" }, { status: 500 });
  }
}
