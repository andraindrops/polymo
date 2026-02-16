import { generateText } from "ai";

import { buildSystemPrompt } from "@/services/domain/product/studio";

async function warmCache() {
  const systemPrompt = await buildSystemPrompt();

  const _result = await generateText({
    model: "anthropic/claude-sonnet-4-20250514",
    messages: [
      {
        role: "system",
        content: systemPrompt,
        providerOptions: {
          anthropic: {
            cacheControl: { type: "ephemeral" },
          },
        },
      },
      {
        role: "user",
        content: "ping",
      },
    ],
    maxOutputTokens: 10,
    onFinish: async ({ usage }) => {
      console.log(usage);
    },
  });

  console.log("Cached 🎉");
}

warmCache().catch(console.error);
