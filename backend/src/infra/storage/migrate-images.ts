/**
 * One-time migration: download property photos from Supabase storage → upload to MinIO
 * Run inside the api container: npx tsx src/infra/storage/migrate-images.ts
 */
import prisma from '../prisma/client.js';
import { ensureBucket, uploadFromUrl } from './minio.js';

const SUPABASE_BASE = 'https://aakdzvvwhvmbpjpmbpep.supabase.co/storage/v1/object/public/make-515d6ac6-property-photos';
const BUCKET = process.env.MINIO_BUCKET_PROPERTIES ?? 'properties';

function toFullUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SUPABASE_BASE}/${path}`;
}

function toObjectName(path: string): string {
  // Strip the Supabase base URL to get the relative path
  const relative = path.startsWith('http')
    ? path.replace(`${SUPABASE_BASE}/`, '')
    : path;
  return relative;
}

async function migrate(): Promise<void> {
  await ensureBucket(BUCKET);

  const properties = await prisma.property.findMany({
    select: { id: true, photos: true, cover_image: true, cover_path: true },
  });

  console.log(`Migrating ${properties.length} properties...`);

  for (const prop of properties) {
    const allPaths = [...(prop.photos ?? [])];
    if (prop.cover_path && !allPaths.includes(prop.cover_path)) allPaths.push(prop.cover_path);

    const newPhotos: string[] = [];

    for (const path of allPaths) {
      if (!path) continue;
      const objectName = toObjectName(path);
      const fullUrl = toFullUrl(path);

      try {
        await uploadFromUrl(BUCKET, objectName, fullUrl);
        newPhotos.push(objectName);
        process.stdout.write('.');
      } catch (err) {
        console.warn(`\nSkipped ${path}: ${(err as Error).message}`);
      }
    }

    const newCoverPath = newPhotos[0] ?? null;
    await prisma.property.update({
      where: { id: prop.id },
      data: {
        photos: newPhotos,
        cover_path: newCoverPath,
        cover_image: newCoverPath
          ? `http://minio:9000/${BUCKET}/${newCoverPath}`
          : prop.cover_image,
      },
    });
  }

  console.log('\nDone.');
  await prisma.$disconnect();
}

migrate().catch((err) => { console.error(err); process.exit(1); });
