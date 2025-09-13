import Messages from "@/components/messages";
import { SendMessage } from "@/components/send-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/lib/actions";
import type { Message } from "@/lib/messages";
import { ArrowRight, CheckCircle, Clock, Loader2, Send } from "lucide-react";

export default async function HomePage() {
  const messages = await getMessages();

  const stats = {
    total: messages.length,
    processed: messages.filter((m) => m.status === "completed").length,
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
            <div className="font-bold text-2xl">{stats.total}</div>
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

        <SendMessage />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Queue & Consumer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Messages />
        </CardContent>
      </Card>
    </div>
  );
}
