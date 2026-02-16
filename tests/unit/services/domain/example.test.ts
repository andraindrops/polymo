import { beforeEach, describe, expect, it } from "vitest";

import { AccessDeniedError } from "@/services/shared/scope";

import * as exampleService from "@/services/domain/example";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestExample } from "@/tests/_helpers/fixtures";

describe("exampleService", () => {
  const team1Id = "team1-id";
  const team1User1Id = "team1-user1-id";
  const team2Id = "team2-id";

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("findMany", () => {
    it("returns examples for the specified team", async () => {
      await createTestExample(
        { teamId: team1Id },
        { name: "Team 1 - Test Example 1" },
      );
      await createTestExample(
        { teamId: team1Id },
        { name: "Team 1 - Test Example 2" },
      );
      await createTestExample(
        { teamId: team2Id },
        { name: "Team 2 - Test Example 1" },
      );

      const result = await exampleService.findMany({ teamId: team1Id });

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.name)).toContain("Team 1 - Test Example 1");
      expect(result.map((e) => e.name)).toContain("Team 1 - Test Example 2");
    });

    it("returns empty array when no examples exist", async () => {
      const result = await exampleService.findMany({ teamId: team1Id });

      expect(result).toEqual([]);
    });

    it("returns examples sorted by createdAt descending", async () => {
      const example1 = await createTestExample(
        { teamId: team1Id },
        { name: "Team 1 - Test Example 1" },
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
      const example2 = await createTestExample(
        { teamId: team1Id },
        { name: "Team 1 - Test Example 2" },
      );

      const result = await exampleService.findMany({ teamId: team1Id });

      expect(result[0].id).toBe(example2.id);
      expect(result[1].id).toBe(example1.id);
    });
  });

  describe("findById", () => {
    it("returns the example when it exists", async () => {
      const example = await createTestExample(
        { teamId: team1Id },
        { name: "Test Example" },
      );

      const result = await exampleService.findById({
        id: example.id,
        teamId: team1Id,
      });

      expect(result).toMatchObject({
        id: example.id,
        name: "Test Example",
      });
    });

    it("throws error when example does not exist", async () => {
      await expect(
        exampleService.findById({ id: "non-existent-id", teamId: team1Id }),
      ).rejects.toThrow();
    });

    it("throws error when example belongs to different team", async () => {
      const example = await createTestExample(
        { teamId: team2Id },
        { name: "Test Example" },
      );

      await expect(
        exampleService.findById({ id: example.id, teamId: team1Id }),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("creates a new example", async () => {
      const result = await exampleService.create({
        teamId: team1Id,
        userId: team1User1Id,
        data: { name: "Test Example" },
      });

      expect(result).toMatchObject({
        id: expect.any(String),
        name: "Test Example",
      });
    });

    it("creates example with correct team association", async () => {
      const result = await exampleService.create({
        teamId: team1Id,
        userId: team1User1Id,
        data: { name: "Test Example" },
      });

      const found = await exampleService.findById({
        id: result.id,
        teamId: team1Id,
      });

      expect(found.id).toBe(result.id);
    });
  });

  describe("update", () => {
    it("updates an existing example", async () => {
      const example = await createTestExample(
        { teamId: team1Id },
        { name: "Test Example" },
      );

      const result = await exampleService.update({
        id: example.id,
        teamId: team1Id,
        data: { name: "Updated Test Example" },
      });

      expect(result.name).toBe("Updated Test Example");
    });

    it("throws error when example belongs to different team", async () => {
      const example = await createTestExample(
        { teamId: team2Id },
        { name: "Test Example" },
      );

      await expect(
        exampleService.update({
          id: example.id,
          teamId: team1Id,
          data: { name: "Updated Test Example" },
        }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });

  describe("remove", () => {
    it("removes an existing example", async () => {
      const example = await createTestExample(
        { teamId: team1Id },
        { name: "Test Example" },
      );

      await exampleService.remove({ id: example.id, teamId: team1Id });

      await expect(
        exampleService.findById({ id: example.id, teamId: team1Id }),
      ).rejects.toThrow();
    });

    it("throws error when example belongs to different team", async () => {
      const example = await createTestExample(
        { teamId: team2Id },
        { name: "Test Example" },
      );

      await expect(
        exampleService.remove({ id: example.id, teamId: team1Id }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });
});
