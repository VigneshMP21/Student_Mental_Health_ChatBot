import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/utils/security";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations API error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
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
    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });
    }

    const sanitizedTitle = sanitizeInput(String(title ?? "")).slice(0, 100);
    if (!sanitizedTitle) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .update({ title: sanitizedTitle })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Rename conversation error:", error);
    return NextResponse.json({ error: "Failed to rename conversation" }, { status: 500 });
  }
}
