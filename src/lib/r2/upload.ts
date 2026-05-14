import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// NOTE: presignR2Upload() returns a signed PUT URL that the browser uses to
// upload directly to the Cloudflare R2 S3 API endpoint. The browser request is
// cross-origin (site domain → {account}.r2.cloudflarestorage.com), so the R2
// bucket MUST have a CORS policy permitting PUT from the site's origins.
// The exact policy lives in the PR description (section "Deploy Checklist —
// Configure Cloudflare R2 CORS") and must be applied via the Cloudflare
// dashboard or `wrangler r2 bucket cors put` before deploy.

function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );
  return `${process.env.NEXT_PUBLIC_R2_BASE}/${params.key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const r2 = getR2Client();
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );
}

export async function presignR2Upload(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  const r2 = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(r2, command, { expiresIn: params.expiresIn ?? 300 });
}

export function r2PublicUrl(key: string): string {
  return `${process.env.NEXT_PUBLIC_R2_BASE}/${key}`;
}

export async function downloadFromR2(key: string): Promise<Buffer> {
  const r2 = getR2Client();
  const res = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );
  if (!res.Body) throw new Error(`R2 object not found: ${key}`);
  const chunks: Uint8Array[] = [];
  for await (const chunk of res.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
