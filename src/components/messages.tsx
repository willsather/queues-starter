"use client";

import { useCallback, useEffect, useState } from "react";

import { getMessages } from "@/lib/actions";
import type { Message } from "@/lib/messages";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchInvocations = useCallback(async () => {
    try {
      const newMessages = await getMessages();
      setMessages(newMessages ?? []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    void fetchInvocations();
    const interval = setInterval(fetchInvocations, 1000);
    return () => clearInterval(interval);
  }, [fetchInvocations]);

  if (messages.length <= 0) {
    return (
      <p className="text-gray-500">
        No invocations yet. Send a message to get started!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div key={message.id} className="rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex items-start justify-between">
            <span className="font-mono text-gray-600 text-sm">
              ID: {message.id}
            </span>
            <span
              className={`rounded-full px-3 py-1 font-medium text-sm ${
                message.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {message.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Started:</span>
              <div>{new Date(message.startTime).toLocaleTimeString()}</div>
            </div>

            {message.status === "completed" && (
              <>
                <div>
                  <span className="text-gray-500">Completed:</span>
                  <div>
                    {message.endTime
                      ? new Date(message.endTime).toLocaleTimeString()
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Wait Time:</span>
                  <div className="font-semibold text-blue-600">
                    {message.waitTime}ms
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Total Duration:</span>
                  <div>
                    {message.endTime
                      ? message.endTime - message.startTime
                      : "N/A"}
                    ms
                  </div>
                </div>
              </>
            )}

            {message.status === "processing" && (
              <div>
                <span className="text-gray-500">Processing for:</span>
                <div className="animate-pulse">
                  {Date.now() - message.startTime}ms
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
