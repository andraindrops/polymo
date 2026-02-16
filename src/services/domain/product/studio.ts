import { readFile as fsReadFile } from "node:fs/promises";
import path from "node:path";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import outdent from "outdent";
import { z } from "zod";

import type { FlyFile } from "@/lib/container";
import * as objectStorage from "@/lib/objectStorage";

import * as productStudioPromptService from "@/services/domain/productStudioPrompt";

const BOILERPLATE_INDEX_HTML = path.join(
  process.cwd(),
  "boilerplate/src/index.html",
);

const R2_PRODUCTS_PREFIX = "products";
const PRODUCT_FILE_NAME = "index.html";

export type FileOperationResult = { success: boolean; message: string };

export async function buildSystemPrompt({
  productId,
}: {
  productId: string;
}): Promise<string> {
  const currentCode = await getFile({ productId, filePath: PRODUCT_FILE_NAME });

  return outdent`
    You are a coding agent that edits a single-file HTML application (index.html).

    INPUTS:
      - The product file (index.html) already exists.

    GOAL:
      - Edit index.html to match the user prompt.

    RULES:
      - The entire application lives in a single index.html file.
      - Build code as simple, stable, runnable, and fully satisfies the user prompt.
      - IMPORTANT: Always batch all changes into a single updateFile call with multiple replacements. Never call updateFile more than once per file.

    STEPS:
      - read the CODE.
      - understand the gap between the CODE and the user prompt.
      - generate the code to fix the gap.

    CODES:
      index.html:
        ${currentCode}
  `;
}

export function buildTools({ productId }: { productId: string }) {
  const updateFileTool = tool({
    description:
      "Update a file by applying one or more replacements. All replacements are applied in order within a single read-write cycle.",
    inputSchema: z.object({
      filePath: z
        .string()
        .describe("Relative path to the file from product root"),
      replacements: z
        .array(
          z.object({
            oldText: z.string().describe("search text"),
            newText: z.string().describe("replacement text"),
          }),
        )
        .describe("Array of replacements to apply in order"),
    }),
    execute: async ({ filePath, replacements }) => {
      const start = Date.now();
      console.log(
        `updateFile START: ${filePath} (${replacements.length} replacements) at ${start}`,
      );
      const result = await updateFile({
        productId,
        filePath,
        replacements,
      });
      console.log(
        `updateFile END: ${filePath} at ${Date.now()} (${Date.now() - start}ms)`,
      );
      return result;
    },
  });

  // const createFileTool = tool({
  //   description: "Create a file.",
  //   inputSchema: z.object({
  //     filePath: z
  //       .string()
  //       .describe("Relative path to the file from product root"),
  //     newText: z.string().describe("text"),
  //   }),
  //   execute: async ({ filePath, newText }) => {
  //     const start = Date.now();
  //     console.log(`createFile START: ${filePath} at ${start}`);
  //     const result = await createFile({ productId, filePath, newText });
  //     console.log(
  //       `createFile END: ${filePath} at ${Date.now()} (${Date.now() - start}ms)`,
  //     );
  //     return result;
  //   },
  // });

  // const deleteFileTool = tool({
  //   description: "Delete a file.",
  //   inputSchema: z.object({
  //     filePath: z
  //       .string()
  //       .describe("Relative path to the file from product root"),
  //   }),
  //   execute: async ({ filePath }) => {
  //     const start = Date.now();
  //     console.log(`deleteFile START: ${filePath} at ${start}`);
  //     const result = await deleteFile({ productId, filePath });
  //     console.log(
  //       `deleteFile END: ${filePath} at ${Date.now()} (${Date.now() - start}ms)`,
  //     );
  //     return result;
  //   },
  // });

  return {
    updateFile: updateFileTool,
    // createFile: createFileTool,
    // deleteFile: deleteFileTool,
  };
}

export async function chat({
  productId,
  teamId: _teamId,
  userId,
  messages,
}: {
  productId: string;
  teamId: string;
  userId: string;
  messages: UIMessage[];
}) {
  const systemPrompt = await buildSystemPrompt({ productId });
  const tools = buildTools({ productId });

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    messages: [
      {
        role: "system",
        content: systemPrompt,
        providerOptions: {
          anthropic: {
            cacheControl: { type: "ephemeral" },
          },
        },
      },
      ...(await convertToModelMessages(messages)),
    ],
    tools,
    stopWhen: stepCountIs(100),
    onFinish: async ({ usage }) => {
      await productStudioPromptService.recordTokenUsage({
        userId,
        totalTokens: usage.totalTokens ?? 0,
      });
    },
  });

  return result;
}

export async function createProductFiles({
  id,
}: {
  id: string;
}): Promise<void> {
  const content = await fsReadFile(BOILERPLATE_INDEX_HTML);
  const key = objectStorage.objectKey(
    R2_PRODUCTS_PREFIX,
    id,
    PRODUCT_FILE_NAME,
  );
  await objectStorage.putObject({ key, body: content });
}

export async function removeProductFiles({
  id,
}: {
  id: string;
}): Promise<void> {
  const key = objectStorage.objectKey(
    R2_PRODUCTS_PREFIX,
    id,
    PRODUCT_FILE_NAME,
  );
  await objectStorage.deleteObject({ key });
}

export async function collectProductFiles(
  productId: string,
): Promise<FlyFile[]> {
  const key = objectStorage.objectKey(
    R2_PRODUCTS_PREFIX,
    productId,
    PRODUCT_FILE_NAME,
  );
  const content = await objectStorage.getObject({ key });

  if (!content) return [];

  return [
    {
      guest_path: `/app/${PRODUCT_FILE_NAME}`,
      raw_value: Buffer.from(content).toString("base64"),
    },
  ];
}

function validateFilePath({
  productId,
  filePath,
}: {
  productId: string;
  filePath: string;
}):
  | { valid: true; key: string }
  | { valid: false; error: FileOperationResult } {
  // Prevent path traversal
  const normalized = path.normalize(filePath);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
    return {
      valid: false,
      error: { success: false, message: "Invalid file path" },
    };
  }

  const key = objectStorage.objectKey(
    R2_PRODUCTS_PREFIX,
    productId,
    normalized,
  );
  return { valid: true, key };
}

export async function createFile({
  productId,
  filePath,
  newText,
}: {
  productId: string;
  filePath: string;
  newText: string;
}): Promise<FileOperationResult> {
  const validation = validateFilePath({ productId, filePath });
  if (!validation.valid) return validation.error;

  await objectStorage.putObject({ key: validation.key, body: newText });

  return { success: true, message: `Created ${filePath}` };
}

export async function updateFile({
  productId,
  filePath,
  replacements,
}: {
  productId: string;
  filePath: string;
  replacements: { oldText: string; newText: string }[];
}): Promise<FileOperationResult> {
  const validation = validateFilePath({ productId, filePath });
  if (!validation.valid) return validation.error;

  let content: string | undefined;
  try {
    content = await objectStorage.getObject({ key: validation.key });
  } catch {
    return { success: false, message: `File not found: ${filePath}` };
  }

  if (!content) {
    return { success: false, message: `File not found: ${filePath}` };
  }

  for (const [i, { oldText, newText }] of replacements.entries()) {
    if (!content.includes(oldText)) {
      return {
        success: false,
        message: `Replacement ${i + 1}/${replacements.length} failed: oldText not found in ${filePath}`,
      };
    }
    content = content.replace(oldText, newText);
  }

  await objectStorage.putObject({ key: validation.key, body: content });

  return {
    success: true,
    message: `Applied ${replacements.length} replacement(s) to ${filePath}`,
  };
}

export async function deleteFile({
  productId,
  filePath,
}: {
  productId: string;
  filePath: string;
}): Promise<FileOperationResult> {
  const validation = validateFilePath({ productId, filePath });
  if (!validation.valid) return validation.error;

  await objectStorage.deleteObject({ key: validation.key });

  return { success: true, message: `Deleted ${filePath}` };
}

export async function getFile({
  productId,
  filePath,
}: {
  productId: string;
  filePath: string;
}): Promise<string> {
  const key = objectStorage.objectKey(R2_PRODUCTS_PREFIX, productId, filePath);
  const content = await objectStorage.getObject({ key });
  if (!content) throw new Error(`File not found: ${filePath}`);
  return content;
}
