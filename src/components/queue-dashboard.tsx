"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getMessages, sendMessage } from "@/lib/actions";
import type { Message } from "@/lib/messages";
import { ArrowRight, CheckCircle, Clock, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface QueueStats {
  totalMessages: number;
  processed: number;
}

export function QueueDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [stats, setStats] = useState<QueueStats>({
    totalMessages: 0,
    processed: 0,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await getMessages();

        setMessages(messages);
      } catch (error) {
        console.error("[v0] Error fetching messages:", error);
      }
    };

    void fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const totalMessages = messages.length;
    const processed = messages.filter((m) => m.status === "completed").length;

    setStats({ totalMessages, processed });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const result = await sendMessage(newMessage);
    console.log("[v0] Message sent to queue:", result);
    setNewMessage("");
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl text-foreground">Queues Starter</h1>
        <p className="text-muted-foreground">
          Send messages and watch them flow through the queue
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm">Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.processed}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your message payload..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send to Queue
            </Button>
            <Button variant="outline" onClick={clearMessages}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Queue & Consumer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No messages in queue. Send a message to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center gap-4 rounded-lg border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">
                      {message.content}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.endTime && message.startTime && (
                        <span className="ml-2">
                          • Processed in {message.endTime - message.startTime}ms
                        </span>
                      )}
                      {message.waitTime && (
                        <span className="ml-2">
                          • Wait time: {message.waitTime}ms
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-muted-foreground text-xs">
                    ID: {message.id.slice(-6)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
