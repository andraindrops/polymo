import db from "@/lib/db";

export async function createTestExample(
  context: { teamId?: string; userId?: string; id?: string } = {},
  data: { name?: string } = {},
) {
  const example = await db.example.create({
    data: {
      id: context.id ?? crypto.randomUUID(),
      teamId: context.teamId ?? crypto.randomUUID(),
      userId: context.userId ?? crypto.randomUUID(),
      name: data.name ?? `Test Example`,
    },
  });

  return example;
}
