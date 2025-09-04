import { send } from "@vercel/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    const invocationId = crypto.randomUUID();
    
    await send("topic", {
      id: invocationId,
      message,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      invocationId,
      message: "Message sent to queue",
    });
  } catch (error) {
    console.error("Error sending to queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message to queue" },
      { status: 500 }
    );
  }
}