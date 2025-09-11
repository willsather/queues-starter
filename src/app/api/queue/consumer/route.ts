import { receive } from "@vercel/queue";
import { NextResponse } from "next/server";

import { type IncomingMessage, messages } from "@/lib/messages";
import { wait } from "@/lib/wait";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    await receive(
      "topic",
      "demo-consumer",
      async (message: IncomingMessage) => {
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

        revalidatePath("/");

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

        revalidatePath("/");

        console.log(
          `[${id}] Queue invocation processed ${waitTime}ms, ended at ${new Date().toISOString()}: ${message.content}`,
        );
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process queue" },
      { status: 500 },
    );
  }
}
