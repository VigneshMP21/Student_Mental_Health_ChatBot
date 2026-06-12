import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMoodScore } from "@/utils/helpers";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [chatsResult, moodsResult, journalsResult, streakResult, recentChats] =
      await Promise.all([
        supabase
          .from("chat_history")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase.from("mood_logs").select("mood").eq("user_id", user.id),
        supabase
          .from("journal_entries")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase.from("wellness_streaks").select("*").eq("user_id", user.id).single(),
        supabase
          .from("chat_history")
          .select("*, conversations(title)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: weekMoods } = await supabase
      .from("mood_logs")
      .select("mood, created_at")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: true });

    const moodScore = getMoodScore(moodsResult.data || []);

    return NextResponse.json({
      stats: {
        totalChats: chatsResult.count || 0,
        moodScore,
        journalCount: journalsResult.count || 0,
        wellnessStreak: streakResult.data?.current_streak || 0,
      },
      weekMoods: weekMoods || [],
      recentActivity: recentChats.data || [],
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
