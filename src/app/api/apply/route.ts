import type { UIMessage } from "ai";

import * as productPolicy from "@/policies/domain/product";

import * as authService from "@/services/shared/auth";

import { chat } from "@/services/domain/product/studio";

export const maxDuration = 60;

export async function POST(req: Request) {
  const teamId = await authService.getTeamId();
  const userId = await authService.getUserId();

  const url = new URL(req.url);
  const productId = url.searchParams.get("productId") ?? "example";

  await productPolicy.assertAccessible({ scope: { teamId }, id: productId });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await chat({ productId, teamId, userId, messages });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
