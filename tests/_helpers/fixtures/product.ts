import db from "@/lib/db";

export async function createTestProduct(
  context: { teamId?: string; userId?: string; id?: string } = {},
  data: { name?: string; body?: string; spec?: string } = {},
) {
  const product = await db.product.create({
    data: {
      id: context.id ?? crypto.randomUUID(),
      teamId: context.teamId ?? crypto.randomUUID(),
      userId: context.userId ?? crypto.randomUUID(),
      name: data.name ?? `Test Product`,
      body: data.body ?? `Test Body`,
      spec: data.spec ?? `Test Spec`,
    },
  });

  return product;
}
