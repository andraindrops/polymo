import { beforeEach, describe, expect, it } from "vitest";

import { AccessDeniedError } from "@/services/shared/scope";

import * as productService from "@/services/domain/product";

import { cleanupDatabase } from "@/tests/_helpers/cleanup";
import { createTestProduct } from "@/tests/_helpers/fixtures/product";

describe.skip("productService", () => {
  const team1Id = "team1-id";
  const team1User1Id = "team1-user1-id";
  const team2Id = "team2-id";

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("findMany", () => {
    it("returns products for the specified team", async () => {
      await createTestProduct(
        { teamId: team1Id },
        { name: "Team 1 - Test Product 1" },
      );
      await createTestProduct(
        { teamId: team1Id },
        { name: "Team 1 - Test Product 2" },
      );
      await createTestProduct(
        { teamId: team2Id },
        { name: "Team 2 - Test Product 1" },
      );

      const result = await productService.findMany({ teamId: team1Id });

      expect(result).toHaveLength(2);
      expect(result.map((e) => e.name)).toContain("Team 1 - Test Product 1");
      expect(result.map((e) => e.name)).toContain("Team 1 - Test Product 2");
    });

    it("returns empty array when no products exist", async () => {
      const result = await productService.findMany({ teamId: team1Id });

      expect(result).toEqual([]);
    });

    it("returns products sorted by createdAt descending", async () => {
      const product1 = await createTestProduct(
        { teamId: team1Id },
        { name: "Team 1 - Test Product 1" },
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
      const product2 = await createTestProduct(
        { teamId: team1Id },
        { name: "Team 1 - Test Product 2" },
      );

      const result = await productService.findMany({ teamId: team1Id });

      expect(result[0].id).toBe(product2.id);
      expect(result[1].id).toBe(product1.id);
    });
  });

  describe("findById", () => {
    it("returns the product when it exists", async () => {
      const product = await createTestProduct(
        { teamId: team1Id },
        { name: "Test Product" },
      );

      const result = await productService.findById({
        id: product.id,
        teamId: team1Id,
      });

      expect(result).toMatchObject({
        id: product.id,
        name: "Test Product",
      });
    });

    it("throws error when product does not exist", async () => {
      await expect(
        productService.findById({ id: "non-existent-id", teamId: team1Id }),
      ).rejects.toThrow();
    });

    it("throws error when product belongs to different team", async () => {
      const product = await createTestProduct(
        { teamId: team2Id },
        { name: "Test Product" },
      );

      await expect(
        productService.findById({ id: product.id, teamId: team1Id }),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("creates a new product", async () => {
      const result = await productService.create({
        teamId: team1Id,
        userId: team1User1Id,
        data: { name: "Test Product", body: "Test Body", spec: "Test Spec" },
      });

      expect(result).toMatchObject({
        id: expect.any(String),
        name: "Test Product",
      });
    });

    it("creates product with correct team association", async () => {
      const result = await productService.create({
        teamId: team1Id,
        userId: team1User1Id,
        data: { name: "Test Product", body: "Test Body", spec: "Test Spec" },
      });

      const found = await productService.findById({
        id: result.id,
        teamId: team1Id,
      });

      expect(found.id).toBe(result.id);
    });
  });

  describe("update", () => {
    it("updates an existing product", async () => {
      const product = await createTestProduct(
        { teamId: team1Id },
        { name: "Test Product" },
      );

      const result = await productService.update({
        id: product.id,
        teamId: team1Id,
        data: {
          name: "Updated Test Product",
          body: "Updated Test Body",
          spec: "Updated Test Spec",
        },
      });

      expect(result.name).toBe("Updated Test Product");
      expect(result.body).toBe("Updated Test Body");
      expect(result.spec).toBe("Updated Test Spec");
    });

    it("throws error when product belongs to different team", async () => {
      const product = await createTestProduct(
        { teamId: team2Id },
        { name: "Test Product" },
      );

      await expect(
        productService.update({
          id: product.id,
          teamId: team1Id,
          data: {
            name: "Updated Test Product",
            body: "Updated Test Body",
            spec: "Updated Test Spec",
          },
        }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });

  describe("remove", () => {
    it("removes an existing product", async () => {
      const product = await createTestProduct(
        { teamId: team1Id },
        { name: "Test Product" },
      );

      await productService.remove({ id: product.id, teamId: team1Id });

      await expect(
        productService.findById({ id: product.id, teamId: team1Id }),
      ).rejects.toThrow();
    });

    it("throws error when product belongs to different team", async () => {
      const product = await createTestProduct(
        { teamId: team2Id },
        { name: "Test Product" },
      );

      await expect(
        productService.remove({ id: product.id, teamId: team1Id }),
      ).rejects.toThrow(AccessDeniedError);
    });
  });

  // describe("parseCode", () => {
  //   it("parses a single create patch", () => {
  //     const code = JSON.stringify({
  //       patches: [
  //         {
  //           action: "create",
  //           path: "src/example1.ts",
  //           body: 'console.log("hello 1");',
  //         },
  //       ],
  //     });

  //     const result = productService.parseCode({ code });

  //     expect(result).toEqual([
  //       {
  //         action: "create",
  //         path: "src/example1.ts",
  //         body: 'console.log("hello 1");',
  //       },
  //     ]);
  //   });

  //   it("parses multiple patches", () => {
  //     const code = JSON.stringify({
  //       patches: [
  //         {
  //           action: "create",
  //           path: "src/example1.ts",
  //           body: 'console.log("hello 1");',
  //         },
  //         {
  //           action: "update",
  //           path: "src/example2.ts",
  //           body: 'console.log("hello 2");',
  //         },
  //       ],
  //     });

  //     const result = productService.parseCode({ code });

  //     expect(result).toHaveLength(2);

  //     expect(result[0]).toEqual({
  //       action: "create",
  //       path: "src/example1.ts",
  //       body: 'console.log("hello 1");',
  //     });
  //     expect(result[1]).toEqual({
  //       action: "update",
  //       path: "src/example2.ts",
  //       body: 'console.log("hello 2");',
  //     });
  //   });

  //   it("parses delete patch without body", () => {
  //     const code = JSON.stringify({
  //       patches: [
  //         {
  //           action: "delete",
  //           path: "src/example1.ts",
  //         },
  //       ],
  //     });

  //     const result = productService.parseCode({ code });

  //     expect(result).toEqual([
  //       {
  //         action: "delete",
  //         path: "src/example1.ts",
  //       },
  //     ]);
  //   });

  //   it("parses mixed create, update, and delete patches", () => {
  //     const code = JSON.stringify({
  //       patches: [
  //         {
  //           action: "create",
  //           path: "src/create-file.ts",
  //           body: "export const newFile = true;",
  //         },
  //         {
  //           action: "update",
  //           path: "src/update-file.ts",
  //           body: "export const updated = true;",
  //         },
  //         {
  //           action: "delete",
  //           path: "src/delete-file.ts",
  //         },
  //       ],
  //     });

  //     const result = productService.parseCode({ code });

  //     expect(result).toHaveLength(3);
  //     expect(result[0]).toEqual({
  //       action: "create",
  //       path: "src/create-file.ts",
  //       body: "export const newFile = true;",
  //     });
  //     expect(result[1]).toEqual({
  //       action: "update",
  //       path: "src/update-file.ts",
  //       body: "export const updated = true;",
  //     });
  //     expect(result[2]).toEqual({
  //       action: "delete",
  //       path: "src/delete-file.ts",
  //     });
  //   });

  //   it("preserves multiline code content", () => {
  //     const body = outdent`
  //       function hello() {
  //         return "hello, world!";
  //       }

  //       export default hello;
  //     `;

  //     const code = JSON.stringify({
  //       patches: [
  //         {
  //           action: "create",
  //           path: "src/example1.ts",
  //           body,
  //         },
  //       ],
  //     });

  //     const result = productService.parseCode({ code });

  //     expect(result[0]?.body).toBe(body);
  //   });
  // });
});
