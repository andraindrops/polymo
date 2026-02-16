import { beforeEach, describe, expect, it } from "vitest";

import * as examplePolicy from "@/policies/domain/example";

import { AccessDeniedError } from "@/services/shared/scope";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestExample } from "@/tests/_helpers/fixtures";

describe("examplePolicy", () => {
  const team1Id = "team1-id";
  const team2Id = "team2-id";

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("assertAccessible", () => {
    it("allows access when example belongs to the team", async () => {
      const example = await createTestExample({ teamId: team1Id });
      const scope = { teamId: team1Id };

      await expect(
        examplePolicy.assertAccessible({ scope, id: example.id }),
      ).resolves.toBeUndefined();
    });

    it("throws error when example does not exist", async () => {
      const scope = { teamId: team1Id };

      await expect(
        examplePolicy.assertAccessible({ scope, id: "non-existent-id" }),
      ).rejects.toThrow(AccessDeniedError);
    });

    it("throws error when example belongs to different team", async () => {
      const example = await createTestExample({ teamId: team2Id });
      const scope = { teamId: team1Id };

      await expect(
        examplePolicy.assertAccessible({ scope, id: example.id }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });
});
