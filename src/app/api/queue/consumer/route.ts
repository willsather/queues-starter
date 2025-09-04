import { receive } from "@vercel/queue";
import { NextResponse } from "next/server";

interface QueueMessage {
  id: string;
  message: string;
  timestamp: number;
}

const invocationResults = new Map<string, {
  status: 'processing' | 'completed';
  startTime: number;
  endTime?: number;
  waitTime?: number;
}>();

export async function GET() {
  return NextResponse.json({
    invocations: Object.fromEntries(invocationResults),
  });
}

export async function POST() {
  try {
    await receive("topic", "demo-consumer", async (message: QueueMessage) => {
      const { id, message: content } = message;
      
      console.log(`[${new Date().toISOString()}] Queue invocation started for ID: ${id}`);
      console.log(`Message: ${content}`);
      
      invocationResults.set(id, {
        status: 'processing',
        startTime: Date.now(),
      });
      
      const waitTime = Math.floor(Math.random() * 3000) + 2000;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      const endTime = Date.now();
      invocationResults.set(id, {
        status: 'completed',
        startTime: invocationResults.get(id)?.startTime || Date.now(),
        endTime,
        waitTime,
      });
      
      console.log(`[${new Date().toISOString()}] Queue invocation completed for ID: ${id}, waited ${waitTime}ms`);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing queue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process queue" },
      { status: 500 }
    );
  }
}