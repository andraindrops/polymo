import db from "@/lib/db";

export async function createTestSubscription(
  context: {
    userId?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status?: string;
    periodEnterDate?: Date;
    periodLeaveDate?: Date | null;
    accessLeaveDate?: Date | null;
  } = {},
) {
  const subscription = await db.subscription.create({
    data: {
      userId: context.userId ?? crypto.randomUUID(),
      stripeCustomerId:
        context.stripeCustomerId ?? `cus_${crypto.randomUUID()}`,
      stripeSubscriptionId:
        context.stripeSubscriptionId ?? `sub_${crypto.randomUUID()}`,
      status: context.status ?? "active",
      periodEnterDate: context.periodEnterDate ?? new Date(),
      periodLeaveDate: context.periodLeaveDate ?? null,
      accessLeaveDate: context.accessLeaveDate ?? null,
    },
  });

  return subscription;
}
