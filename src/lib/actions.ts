"use server";

import { messages } from "@/lib/messages";

export async function getMessages() {
  return Array.from(messages.values());
}
