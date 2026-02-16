import { beforeEach, describe, expect, it } from "vitest";

import * as productPolicy from "@/policies/domain/product";

import { AccessDeniedError } from "@/services/shared/scope";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestProduct } from "@/tests/_helpers/fixtures/product";

describe("productPolicy", () => {
  const team1Id = "team1-id";
  const team2Id = "team2-id";

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("assertAccessible", () => {
    it("allows access when product belongs to the team", async () => {
      const product = await createTestProduct({ teamId: team1Id });
      const scope = { teamId: team1Id };

      await expect(
        productPolicy.assertAccessible({ scope, id: product.id }),
      ).resolves.toBeUndefined();
    });

    it("throws error when product does not exist", async () => {
      const scope = { teamId: team1Id };

      await expect(
        productPolicy.assertAccessible({ scope, id: "non-existent-id" }),
      ).rejects.toThrow(AccessDeniedError);
    });

    it("throws error when product belongs to different team", async () => {
      const product = await createTestProduct({ teamId: team2Id });
      const scope = { teamId: team1Id };

      await expect(
        productPolicy.assertAccessible({ scope, id: product.id }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });
});
