import type { UIMessage } from "ai";

import * as authService from "@/services/shared/auth";

import { chat } from "@/services/domain/product/studio";
import * as subscriptionService from "@/services/domain/subscription";

export const maxDuration = 60;

export async function POST(req: Request) {
  const teamId = await authService.getTeamId();
  const userId = await authService.getUserId();

  const subscription = await subscriptionService.findActiveByUserId({ userId });

  if (!subscription) {
    return new Response(JSON.stringify({ error: "Subscription required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const productId = url.searchParams.get("productId") ?? "example";

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await chat({ productId, teamId, userId, messages });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
