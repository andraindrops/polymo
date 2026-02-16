import db from "@/lib/db";

const ACTIVE_STATUSES = ["active", "trialing"];

export async function findActiveByUserId({ userId }: { userId: string }) {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (subscription == null) {
    return null;
  }

  if (!ACTIVE_STATUSES.includes(subscription.status)) {
    return null;
  }

  return subscription;
}

export async function findByUserId({ userId }: { userId: string }) {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  return subscription;
}

export async function upsert({
  userId,
  stripeCustomerId,
  stripeSubscriptionId,
  status,
  periodEnterDate,
  periodLeaveDate,
  accessLeaveDate,
}: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  periodEnterDate: Date;
  periodLeaveDate: Date | null;
  accessLeaveDate: Date | null;
}) {
  const subscription = await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status,
      periodEnterDate,
      periodLeaveDate,
      accessLeaveDate,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status,
      periodEnterDate,
      periodLeaveDate,
      accessLeaveDate,
    },
  });

  return subscription;
}

export async function updateByStripeSubscriptionId({
  stripeSubscriptionId,
  status,
  periodEnterDate,
  periodLeaveDate,
  accessLeaveDate,
}: {
  stripeSubscriptionId: string;
  status: string;
  periodEnterDate: Date;
  periodLeaveDate: Date | null;
  accessLeaveDate: Date | null;
}) {
  const subscription = await db.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  if (subscription == null) {
    return;
  }

  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      periodEnterDate,
      periodLeaveDate,
      accessLeaveDate,
    },
  });
}
