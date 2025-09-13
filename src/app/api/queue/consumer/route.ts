import { receive } from "@vercel/queue";
import { type NextRequest, NextResponse } from "next/server";

import type { IncomingMessage, Message } from "@/lib/messages";
import { wait } from "@/lib/wait";

const messages = new Map<string, Message>();

export async function GET(_request: NextRequest) {
  return NextResponse.json(Array.from(messages.values()));
}

export async function POST() {
  try {
    await receive("topic", "consumer", async (message: IncomingMessage) => {
      const id = crypto.randomUUID();

      console.log(
        `[${id}] Queue invocation started at ${new Date().toISOString()}: ${message.content}`,
      );

      messages.set(id, {
        id,
        content: message.content,
        timestamp: message.timestamp,
        status: "processing",
        startTime: Date.now(),
      });

      const waitTime = await wait();

      const endTime = Date.now();

      const currentMessage = messages.get(id);

      if (!currentMessage) {
        console.warn(`[${id}] Message not found`);
        return;
      }

      messages.set(id, {
        ...currentMessage,
        status: "completed",
        endTime,
        waitTime,
      });

      console.log(
        `[${id}] Queue invocation processed ${waitTime}ms, ended at ${new Date().toISOString()}: ${message.content}`,
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process queue" },
      { status: 500 },
    );
  }
}
