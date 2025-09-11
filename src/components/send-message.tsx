"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

export function SendMessage() {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("/api/queue/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  return (
    <CardContent className="space-y-4">
      <Textarea
        placeholder="Enter your message payload..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex gap-2">
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          <Send className="mr-2 size-4" />
          Send to Queue
        </Button>
      </div>
    </CardContent>
  );
}
