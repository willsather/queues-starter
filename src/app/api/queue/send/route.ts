import { send } from "@vercel/queue";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    await send("topic", {
      content,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Message sent to queue",
    });
  } catch (error) {
    console.error("Error sending to queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message to queue" },
      { status: 500 },
    );
  }
}
