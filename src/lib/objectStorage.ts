import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// biome-ignore format: alignment
const R2_ACCOUNT_ID       = process.env.R2_ACCOUNT_ID         ?? "";
// biome-ignore format: alignment
const R2_ACCESS_KEY_ID     = process.env.R2_ACCESS_KEY_ID     ?? "";
// biome-ignore format: alignment
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
// biome-ignore format: alignment
const R2_BUCKET_NAME       = process.env.R2_BUCKET_NAME       ?? "";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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
  const res = await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
    }),
  );

  return res;
}

export async function getObject({ key }: { key: string }) {
  const res = await client.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );

  return await res.Body?.transformToString("utf-8");
}

export async function deleteObject({ key }: { key: string }) {
  const res = await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );

  return res;
}
