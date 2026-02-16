import { beforeEach, describe, expect, it } from "vitest";

import * as subscriptionService from "@/services/domain/subscription";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestSubscription } from "@/tests/_helpers/fixtures/subscription";

describe("subscriptionService", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("findActiveByUserId", () => {
    it("returns subscription when    active subscription exists", async () => {
      await createTestSubscription({ userId: "user-1", status: "active" });

      const result = await subscriptionService.findActiveByUserId({
        userId: "user-1",
      });

      expect(result).not.toBeNull();
      expect(result?.userId).toBe("user-1");
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
      userId: "user-1",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      status: "active",
      periodEnterDate: new Date("2026-01-01"),
      periodLeaveDate: new Date("2026-02-01"),
      accessLeaveDate: null,
    });

    expect(result).toMatchObject({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      status: "active",
    });
  });
});
