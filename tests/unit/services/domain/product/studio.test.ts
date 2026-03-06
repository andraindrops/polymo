import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  readFileMock,
  objectKeyMock,
  putObjectMock,
  getObjectMock,
  deleteObjectMock,
  convertToModelMessagesMock,
  stepCountIsMock,
  streamTextMock,
  toolMock,
  recordTokenUsageMock,
} = vi.hoisted(() => ({
  readFileMock: vi.fn(),
  objectKeyMock: vi.fn((...segments: string[]) => segments.join("/")),
  putObjectMock: vi.fn(),
  getObjectMock: vi.fn(),
  deleteObjectMock: vi.fn(),
  convertToModelMessagesMock: vi.fn(async (messages) => messages),
  stepCountIsMock: vi.fn((count: number) => `step-count-${count}`),
  streamTextMock: vi.fn(),
  toolMock: vi.fn((config) => config),
  recordTokenUsageMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readFile: readFileMock,
}));

vi.mock("@/lib/objectStorage", () => ({
  objectKey: objectKeyMock,
  putObject: putObjectMock,
  getObject: getObjectMock,
  deleteObject: deleteObjectMock,
}));

vi.mock("ai", () => ({
  convertToModelMessages: convertToModelMessagesMock,
  stepCountIs: stepCountIsMock,
  streamText: streamTextMock,
  tool: toolMock,
}));

vi.mock("@/services/domain/productStudioPrompt", () => ({
  recordTokenUsage: recordTokenUsageMock,
}));

import * as productStudioService from "@/services/domain/product/studio";

describe("productStudioService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    objectKeyMock.mockImplementation((...segments: string[]) =>
      segments.join("/"),
    );
    convertToModelMessagesMock.mockImplementation(async (messages) => messages);
    stepCountIsMock.mockImplementation(
      (count: number) => `step-count-${count}`,
    );
    toolMock.mockImplementation((config) => config);
    streamTextMock.mockReturnValue({ stream: "result" });
  });

  describe("createFile", () => {
    it("returns error for invalid relative path", async () => {
      const result = await productStudioService.createFile({
        productId: "product-1",
        filePath: "../secret.txt",
        newText: "hello",
      });

      expect(result).toEqual({
        success: false,
        message: "Invalid file path",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("writes file with normalized object key", async () => {
      const result = await productStudioService.createFile({
        productId: "product-1",
        filePath: "nested/../index.html",
        newText: "<html />",
      });

      expect(objectKeyMock).toHaveBeenCalledWith(
        "products",
        "product-1",
        "index.html",
      );
      expect(putObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
        body: "<html />",
      });
      expect(result).toEqual({
        success: true,
        message: "Created nested/../index.html",
      });
    });
  });

  describe("setFile", () => {
    it("returns error for absolute path", async () => {
      const result = await productStudioService.setFile({
        productId: "product-1",
        filePath: "/tmp/index.html",
        content: "<html />",
      });

      expect(result).toEqual({
        success: false,
        message: "Invalid file path",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("rewrites file with normalized object key", async () => {
      const result = await productStudioService.setFile({
        productId: "product-1",
        filePath: "app/../index.html",
        content: "<html>updated</html>",
      });

      expect(objectKeyMock).toHaveBeenCalledWith(
        "products",
        "product-1",
        "index.html",
      );
      expect(putObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
        body: "<html>updated</html>",
      });
      expect(result).toEqual({
        success: true,
        message: "Rewrote app/../index.html",
      });
    });
  });

  describe("deleteFile", () => {
    it("returns error for invalid relative path", async () => {
      const result = await productStudioService.deleteFile({
        productId: "product-1",
        filePath: "../index.html",
      });

      expect(result).toEqual({
        success: false,
        message: "Invalid file path",
      });
      expect(deleteObjectMock).not.toHaveBeenCalled();
    });

    it("deletes file with normalized object key", async () => {
      const result = await productStudioService.deleteFile({
        productId: "product-1",
        filePath: "nested/../index.html",
      });

      expect(objectKeyMock).toHaveBeenCalledWith(
        "products",
        "product-1",
        "index.html",
      );
      expect(deleteObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
      });
      expect(result).toEqual({
        success: true,
        message: "Deleted nested/../index.html",
      });
    });
  });

  describe("updateFile", () => {
    it("returns file not found when getObject throws", async () => {
      getObjectMock.mockRejectedValueOnce(new Error("missing"));

      const result = await productStudioService.updateFile({
        productId: "product-1",
        filePath: "index.html",
        replacements: [{ oldText: "before", newText: "after" }],
      });

      expect(result).toEqual({
        success: false,
        message: "File not found: index.html",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("returns file not found when getObject returns empty value", async () => {
      getObjectMock.mockResolvedValueOnce(undefined);

      const result = await productStudioService.updateFile({
        productId: "product-1",
        filePath: "index.html",
        replacements: [{ oldText: "before", newText: "after" }],
      });

      expect(result).toEqual({
        success: false,
        message: "File not found: index.html",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("returns error when oldText is not found", async () => {
      getObjectMock.mockResolvedValueOnce("<html>before</html>");

      const result = await productStudioService.updateFile({
        productId: "product-1",
        filePath: "index.html",
        replacements: [{ oldText: "missing", newText: "after" }],
      });

      expect(result).toEqual({
        success: false,
        message: "Replacement 1/1 failed: oldText not found in index.html",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });

    it("applies multiple replacements in order", async () => {
      getObjectMock.mockResolvedValueOnce("<body>Hello world</body>");

      const result = await productStudioService.updateFile({
        productId: "product-1",
        filePath: "index.html",
        replacements: [
          { oldText: "Hello", newText: "Hi" },
          { oldText: "world", newText: "Polymo" },
        ],
      });

      expect(putObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
        body: "<body>Hi Polymo</body>",
      });
      expect(result).toEqual({
        success: true,
        message: "Applied 2 replacement(s) to index.html",
      });
    });

    it("does not write when later replacement fails", async () => {
      getObjectMock.mockResolvedValueOnce("<body>Hello world</body>");

      const result = await productStudioService.updateFile({
        productId: "product-1",
        filePath: "index.html",
        replacements: [
          { oldText: "Hello", newText: "Hi" },
          { oldText: "missing", newText: "Polymo" },
        ],
      });

      expect(result).toEqual({
        success: false,
        message: "Replacement 2/2 failed: oldText not found in index.html",
      });
      expect(putObjectMock).not.toHaveBeenCalled();
    });
  });

  describe("createProductFiles", () => {
    it("reads boilerplate and stores it as products/{id}/index.html", async () => {
      const boilerplate = Buffer.from("<html>boilerplate</html>");

      readFileMock.mockResolvedValueOnce(boilerplate);

      await productStudioService.createProductFiles({ id: "product-1" });

      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(objectKeyMock).toHaveBeenCalledWith(
        "products",
        "product-1",
        "index.html",
      );
      expect(putObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
        body: boilerplate,
      });
    });
  });

  describe("removeProductFiles", () => {
    it("deletes products/{id}/index.html", async () => {
      await productStudioService.removeProductFiles({ id: "product-1" });

      expect(objectKeyMock).toHaveBeenCalledWith(
        "products",
        "product-1",
        "index.html",
      );
      expect(deleteObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
      });
    });
  });

  describe("buildSystemPrompt", () => {
    it("includes current code and rewrite instructions", async () => {
      getObjectMock.mockResolvedValueOnce("<html>current</html>");

      const result = await productStudioService.buildSystemPrompt({
        productId: "product-1",
      });

      expect(result).toContain("<html>current</html>");
      expect(result).toContain(
        "Always rewrite index.html with a single setFile call.",
      );
      expect(result).toContain("reply exactly with Done 🎉");
    });
  });

  describe("buildTools", () => {
    it("executes setFile with productId from closure", async () => {
      const tools = productStudioService.buildTools({ productId: "product-1" });
      const executeSetFile = tools.setFile.execute as (
        input: {
          filePath: string;
          content: string;
        },
        options?: unknown,
      ) => Promise<{
        success: boolean;
        message: string;
      }>;

      const result = await executeSetFile(
        {
          filePath: "index.html",
          content: "<html>next</html>",
        },
        undefined,
      );

      expect(putObjectMock).toHaveBeenCalledWith({
        key: "products/product-1/index.html",
        body: "<html>next</html>",
      });
      expect(result).toEqual({
        success: true,
        message: "Rewrote index.html",
      });
    });
  });

  describe("chat", () => {
    it("passes system prompt, tools, and stopWhen to streamText", async () => {
      getObjectMock.mockResolvedValueOnce("<html>current</html>");
      streamTextMock.mockReturnValueOnce({ stream: "chat-result" });

      const messages = [{ role: "user", content: "make a counter" }];

      const result = await productStudioService.chat({
        productId: "product-1",
        teamId: "team-1",
        userId: "user-1",
        messages: messages as never,
      });

      expect(convertToModelMessagesMock).toHaveBeenCalledWith(messages);
      expect(stepCountIsMock).toHaveBeenCalledWith(5);
      expect(streamTextMock).toHaveBeenCalledTimes(1);

      const streamTextArgs = streamTextMock.mock.calls[0]?.[0];

      expect(streamTextArgs?.model).toBe("anthropic/claude-sonnet-4-20250514");
      expect(streamTextArgs?.stopWhen).toBe("step-count-5");
      expect(streamTextArgs?.tools).toHaveProperty("setFile");
      expect(streamTextArgs?.messages[0]).toMatchObject({
        role: "system",
      });
      expect(streamTextArgs?.messages[0]?.content).toContain(
        "<html>current</html>",
      );
      expect(result).toEqual({ stream: "chat-result" });
    });

    it("records token usage with 0 fallback on finish", async () => {
      getObjectMock.mockResolvedValueOnce("<html>current</html>");

      await productStudioService.chat({
        productId: "product-1",
        teamId: "team-1",
        userId: "user-1",
        messages: [] as never,
      });

      const streamTextArgs = streamTextMock.mock.calls[0]?.[0];

      await streamTextArgs?.onFinish({ usage: {} });

      expect(recordTokenUsageMock).toHaveBeenCalledWith({
        userId: "user-1",
        totalTokens: 0,
      });
    });
  });
});
