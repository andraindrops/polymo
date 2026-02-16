import db from "@/lib/db";

export async function cleanupDatabase() {
  await db.example.deleteMany({});
  await db.product.deleteMany({});
  await db.subscription.deleteMany({});
  await db.productStudioPrompt.deleteMany({});
}
