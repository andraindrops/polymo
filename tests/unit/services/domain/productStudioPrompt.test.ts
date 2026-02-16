import { beforeEach, describe, expect, it } from "vitest";

import db from "@/lib/db";

import { recordTokenUsage } from "@/services/domain/productStudioPrompt";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";

describe("productStudioPromptService", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("recordTokenUsage", () => {
    it("creates a new record for a new user", async () => {
      await recordTokenUsage({ userId: "user-1", totalTokens: 100 });

      const record = await db.productStudioPrompt.findUnique({
        where: { userId: "user-1" },
      });

      expect(record).toMatchObject({
        userId: "user-1",
        totalTokenAmount: 100,
      });
    });

    it("accumulates correctly across multiple calls", async () => {
      await recordTokenUsage({ userId: "user-1", totalTokens: 100 });
      await recordTokenUsage({ userId: "user-1", totalTokens: 200 });
      await recordTokenUsage({ userId: "user-1", totalTokens: 300 });

      const record = await db.productStudioPrompt.findUnique({
        where: { userId: "user-1" },
      });

      expect(record).toMatchObject({
        userId: "user-1",
        totalTokenAmount: 600,
      });
    });
  });
});
