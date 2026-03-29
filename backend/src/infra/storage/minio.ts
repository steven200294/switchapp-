import { Client } from 'minio';
import { env } from '../../config/env.js';

const minioClient = new Client({
  endPoint: env.minio.endpoint,
  port: env.minio.port,
  useSSL: env.minio.useSsl,
  accessKey: env.minio.accessKey,
  secretKey: env.minio.secretKey,
});

export async function ensureBucket(bucket: string): Promise<void> {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    await minioClient.makeBucket(bucket);
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      }],
    });
    await minioClient.setBucketPolicy(bucket, policy);
  }
}

export async function uploadFromUrl(
  bucket: string,
  objectName: string,
  url: string,
): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  await minioClient.putObject(bucket, objectName, buffer, buffer.length, { 'Content-Type': contentType });
}

export function getPublicUrl(bucket: string, objectName: string): string {
  return `${env.minio.publicUrl}/${bucket}/${objectName}`;
}

export default minioClient;
