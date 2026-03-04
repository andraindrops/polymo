import { beforeEach, describe, expect, it } from "vitest";

import * as subscriptionService from "@/services/domain/subscription";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestSubscription } from "@/tests/_helpers/fixtures/subscription";

const userId = process.env.E2E_TEST_USER_ID;

if (userId == null) {
  throw new Error("E2E_TEST_USER_ID must be set in environment variables");
}

describe("subscriptionService", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("findActiveByUserId", () => {
    it("returns subscription when    active subscription exists", async () => {
      await createTestSubscription({ userId, status: "active" });

      const result = await subscriptionService.findActiveByUserId({
        userId,
      });

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(userId);
    });

    it("returns null         when no active subscription exists", async () => {
      const result = await subscriptionService.findActiveByUserId({
        userId: "user-2",
      });

      expect(result).toBeNull();
    });
  });

  it("creates a subscription", async () => {
    const result = await subscriptionService.upsert({
      userId,
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      status: "active",
      periodEnterDate: new Date("2026-01-01"),
      periodLeaveDate: new Date("2026-02-01"),
      accessLeaveDate: null,
    });

    expect(result).toMatchObject({
      userId,
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      status: "active",
    });
  });
});
