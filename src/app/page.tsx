import Messages from "@/components/messages";
import { SendMessage } from "@/components/send-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Send } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl text-foreground">Queues Starter</h1>
        <p className="text-muted-foreground">
          Send messages and watch them flow through the queue
        </p>
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
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Messages />
        </CardContent>
      </Card>
    </div>
  );
}
