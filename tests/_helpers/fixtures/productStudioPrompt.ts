import db from "@/lib/db";

export async function createTestProductStudioPrompt(
  context: { userId?: string; totalTokenAmount?: number } = {},
) {
  const prompt = await db.productStudioPrompt.create({
    data: {
      userId: context.userId ?? crypto.randomUUID(),
      totalTokenAmount: context.totalTokenAmount ?? 0,
    },
  });

  return prompt;
}
