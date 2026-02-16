import db from "@/lib/db";

export async function recordTokenUsage({
  userId,
  totalTokens,
}: {
  userId: string;
  totalTokens: number;
}) {
  await db.productStudioPrompt.upsert({
    where: { userId },
    create: { userId, totalTokenAmount: totalTokens },
    update: { totalTokenAmount: { increment: totalTokens } },
  });
}
