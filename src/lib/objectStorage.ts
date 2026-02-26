import { del, get, put } from "@vercel/blob";

export function objectKey(...segments: string[]): string {
  return segments.join("/");
}

export async function putObject({
  key,
  body,
}: {
  key: string;
  body: string | Buffer;
}) {
  return await put(key, body, {
    access: "private",
    allowOverwrite: true,
    contentType: "text/html; charset=utf-8",
  });
}

export async function getObject({ key }: { key: string }) {
  const result = await get(key, { access: "private" });

  if (result?.statusCode !== 200) return undefined;

  const reader = result.stream.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return new TextDecoder("utf-8").decode(
    Buffer.concat(chunks.map((c) => Buffer.from(c))),
  );
}

export async function deleteObject({ key }: { key: string }) {
  await del(key);
}
