/**
 * Seeds the mock database (DATABASE_URL_MOCK). Run after: prisma migrate deploy with DATABASE_URL pointing at switchapp_mock.
 * Usage: DATABASE_URL_MOCK=postgresql://.../switchapp_mock npx tsx ../data/seed-mock.ts
 */
import { PrismaClient } from "@prisma/client";

const MOCK_PW_HASH = "$2a$10$cRMO21Q5wlu4rN1BOepdxOw3aBJrbACfPDLffpS30kXshoTkXVfuW"; // mock12345
const ADMIN_PW_HASH = "$2a$10$r9hHS6wvS.ZIhnfXDSjdHuiySWQqqhxlS2G6D5Hswmn7/xzAH0yZi"; // admin123

const U = {
  admin: "a0000000-0000-4000-8000-000000000000",
  alice: "f1111111-1111-4111-8111-111111111111",
  bob:   "f2222222-2222-4222-8222-222222222222",
  clara: "f3333333-3333-4333-8333-333333333333",
  david: "f4444444-4444-4444-8444-444444444444",
  emma:  "f5555555-5555-4555-8555-555555555555",
  frank: "f6666666-6666-4666-8666-666666666666",
} as const;

function assertMockUrl(url: string): void {
  if (!url.includes("switchapp_mock")) {
    throw new Error("Refusing to seed: DATABASE_URL_MOCK must point at database switchapp_mock");
  }
}

async function clear(prisma: PrismaClient): Promise<void> {
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.property.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.userSwitchPass.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.authUser.deleteMany();
}

function authRow(id: string, email: string, pw: string, name: string, now: Date) {
  return {
    id, email, encrypted_password: pw,
    aud: "authenticated", role: "authenticated",
    email_confirmed_at: now, created_at: now, updated_at: now,
    raw_app_meta_data: {}, raw_user_meta_data: { full_name: name },
    is_sso_user: false, is_anonymous: false,
  };
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL_MOCK;
  if (!url) throw new Error("DATABASE_URL_MOCK is required");
  assertMockUrl(url);

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  await clear(prisma);

  const now = new Date();
  const m1 = new Date(now); m1.setMonth(m1.getMonth() + 1);
  const m2 = new Date(now); m2.setMonth(m2.getMonth() + 2);
  const m3 = new Date(now); m3.setMonth(m3.getMonth() + 3);

  // ── Auth users ──
  await prisma.authUser.createMany({
    data: [
      authRow(U.admin, "abderrazaq@mail.com",      ADMIN_PW_HASH, "Abderrazaq Makran", now),
      authRow(U.alice, "mock.alice@example.com",    MOCK_PW_HASH,  "Alice Martin",      now),
      authRow(U.bob,   "mock.bob@example.com",      MOCK_PW_HASH,  "Bob Durand",        now),
      authRow(U.clara, "mock.clara@example.com",    MOCK_PW_HASH,  "Clara Dubois",      now),
      authRow(U.david, "mock.david@example.com",    MOCK_PW_HASH,  "David Moreau",      now),
      authRow(U.emma,  "mock.emma@example.com",     MOCK_PW_HASH,  "Emma Bernard",      now),
      authRow(U.frank, "mock.frank@example.com",    MOCK_PW_HASH,  "Frank Petit",       now),
    ],
  });

  // ── Profiles ──
  await prisma.userProfile.createMany({
    data: [
      {
        user_id: U.admin, email: "abderrazaq@mail.com", full_name: "Abderrazaq Makran",
        city: "Paris", profession: "Developer", bio: "Admin & co-fondateur SwitchAppart",
        budget_min: 900, budget_max: 2000, surface_min: 40,
        preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi", "parking", "elevator"],
        preferred_district: "10e", country: "France", verified: true,
      },
      {
        user_id: U.alice, email: "mock.alice@example.com", full_name: "Alice Martin",
        city: "Paris", profession: "Designer UX", bio: "Parisienne, fan de déco scandinave",
        budget_min: 800, budget_max: 1400, surface_min: 35,
        preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "washing_machine"],
        preferred_district: "11e", country: "France",
      },
      {
        user_id: U.bob, email: "mock.bob@example.com", full_name: "Bob Durand",
        city: "Lyon", profession: "Photographe", bio: "Nomade digital, cherche échange court",
        budget_min: 600, budget_max: 1000, surface_min: 28,
        preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi"],
        country: "France",
      },
      {
        user_id: U.clara, email: "mock.clara@example.com", full_name: "Clara Dubois",
        city: "Bordeaux", profession: "Enseignante", bio: "Passionnée de vin et d'architecture",
        budget_min: 500, budget_max: 900, surface_min: 30,
        preferred_property_types: ["apartment", "house"], preferred_amenities: ["wifi", "garden", "parking"],
        preferred_district: "Chartrons", country: "France",
      },
      {
        user_id: U.david, email: "mock.david@example.com", full_name: "David Moreau",
        city: "Marseille", profession: "Chef cuisinier", bio: "Vue mer obligatoire !",
        budget_min: 700, budget_max: 1200, surface_min: 40,
        preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "balcony", "sea_view"],
        preferred_district: "Vieux-Port", country: "France",
      },
      {
        user_id: U.emma, email: "mock.emma@example.com", full_name: "Emma Bernard",
        city: "Toulouse", profession: "Ingénieure aéro", bio: "Sportive, aime les grands espaces",
        budget_min: 600, budget_max: 1100, surface_min: 45,
        preferred_property_types: ["house", "apartment"], preferred_amenities: ["wifi", "garden", "gym"],
        country: "France",
      },
      {
        user_id: U.frank, email: "mock.frank@example.com", full_name: "Frank Petit",
        city: "Nice", profession: "Consultant IT", bio: "Télétravail depuis la Côte d'Azur",
        budget_min: 800, budget_max: 1500, surface_min: 35,
        preferred_property_types: ["apartment", "studio"], preferred_amenities: ["wifi", "air_conditioning"],
        preferred_district: "Promenade", country: "France",
      },
    ],
  });

  // ── Admin ──
  await prisma.adminUser.create({ data: { user_id: U.admin } });

  // ── Switch passes ──
  await prisma.userSwitchPass.createMany({
    data: [
      { user_id: U.admin, balance: 50 },
      { user_id: U.alice, balance: 10 },
      { user_id: U.bob,   balance: 5 },
      { user_id: U.clara, balance: 8 },
      { user_id: U.david, balance: 3 },
      { user_id: U.emma,  balance: 12 },
      { user_id: U.frank, balance: 7 },
    ],
  });

  // ── Properties ──
  const pAdmin = await prisma.property.create({
    data: {
      owner_id: U.admin, title: "Loft moderne – Paris 10e",
      description: "Grand loft rénové, verrière, idéal coworking et vie quotidienne.",
      city: "Paris", district: "10e", postal_code: "75010",
      monthly_rent: 1600, surface_area: 65, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "loft", furnished: true, pets_allowed: true,
      published: true, status: "published",
      amenities: ["wifi", "parking", "elevator", "washing_machine"],
      photo_paths: ["mock/paris-loft.jpg"], cover_path: "mock/paris-loft.jpg",
      available_from: now, available_until: m3,
    },
  });

  const pAlice = await prisma.property.create({
    data: {
      owner_id: U.alice, title: "Studio lumineux – Paris 11e",
      description: "Calme, proche métro, idéal pour un switch court.",
      city: "Paris", district: "11e", postal_code: "75011",
      monthly_rent: 1100, surface_area: 32, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false,
      published: true, status: "published",
      amenities: ["wifi", "washing_machine"],
      photo_paths: ["mock/paris-a.jpg"], cover_path: "mock/paris-a.jpg",
      available_from: now, available_until: m1,
    },
  });

  const pBob = await prisma.property.create({
    data: {
      owner_id: U.bob, title: "T2 centre Lyon",
      description: "Vue dégagée, fibre, quartier vivant.",
      city: "Lyon", district: "Presqu'île",
      monthly_rent: 850, surface_area: 45, rooms: 3, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: true,
      published: true, status: "published",
      amenities: ["wifi", "elevator"],
      photo_paths: ["mock/lyon-b.jpg"], cover_path: "mock/lyon-b.jpg",
      available_from: now, available_until: m1,
    },
  });

  const pClara = await prisma.property.create({
    data: {
      owner_id: U.clara, title: "Maison Chartrons – Bordeaux",
      description: "Maison de ville avec jardin, quartier prisé des Chartrons.",
      city: "Bordeaux", district: "Chartrons", postal_code: "33300",
      monthly_rent: 780, surface_area: 55, rooms: 4, bedrooms: 2, bathrooms: 1,
      property_type: "house", furnished: true, pets_allowed: true,
      published: true, status: "published",
      amenities: ["wifi", "garden", "parking"],
      photo_paths: ["mock/bordeaux-c.jpg"], cover_path: "mock/bordeaux-c.jpg",
      available_from: now, available_until: m2,
    },
  });

  const pDavid = await prisma.property.create({
    data: {
      owner_id: U.david, title: "T3 vue mer – Marseille",
      description: "Terrasse plein sud, Vieux-Port à 5 min.",
      city: "Marseille", district: "Vieux-Port", postal_code: "13001",
      monthly_rent: 1050, surface_area: 52, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false,
      published: true, status: "published",
      amenities: ["wifi", "balcony", "sea_view"],
      photo_paths: ["mock/marseille-d.jpg"], cover_path: "mock/marseille-d.jpg",
      available_from: now, available_until: m2,
    },
  });

  const pEmma = await prisma.property.create({
    data: {
      owner_id: U.emma, title: "Villa avec piscine – Toulouse",
      description: "Maison spacieuse, piscine, proche centre.",
      city: "Toulouse", district: "Saint-Cyprien", postal_code: "31300",
      monthly_rent: 950, surface_area: 90, rooms: 5, bedrooms: 3, bathrooms: 2,
      property_type: "house", furnished: true, pets_allowed: true,
      published: true, status: "published",
      amenities: ["wifi", "garden", "pool", "parking"],
      photo_paths: ["mock/toulouse-e.jpg"], cover_path: "mock/toulouse-e.jpg",
      available_from: now, available_until: m3,
    },
  });

  const pFrank = await prisma.property.create({
    data: {
      owner_id: U.frank, title: "Studio Promenade – Nice",
      description: "À 200m de la plage, climatisé, parfait pour télétravail.",
      city: "Nice", district: "Promenade des Anglais", postal_code: "06000",
      monthly_rent: 1200, surface_area: 38, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false,
      published: true, status: "published",
      amenities: ["wifi", "air_conditioning", "sea_view"],
      photo_paths: ["mock/nice-f.jpg"], cover_path: "mock/nice-f.jpg",
      available_from: now, available_until: m2,
    },
  });

  // ── Matches (3 pairs) ──
  const matchAB = await prisma.match.create({
    data: { user_a: U.alice, user_b: U.bob, property_a: pAlice.id, property_b: pBob.id },
  });
  const matchCD = await prisma.match.create({
    data: { user_a: U.clara, user_b: U.david, property_a: pClara.id, property_b: pDavid.id },
  });
  const matchEF = await prisma.match.create({
    data: { user_a: U.emma, user_b: U.frank, property_a: pEmma.id, property_b: pFrank.id },
  });

  // ── Conversations ──
  const convAB = await prisma.conversation.create({
    data: { match_id: matchAB.id, last_message_at: now, last_message_text: "Parfait, on valide le créneau ?" },
  });
  const convCD = await prisma.conversation.create({
    data: { match_id: matchCD.id, last_message_at: now, last_message_text: "Super, je t'envoie les clés par recommandé !" },
  });
  const convEF = await prisma.conversation.create({
    data: { match_id: matchEF.id, last_message_at: now, last_message_text: "La piscine est chauffée ?" },
  });

  await prisma.conversationParticipant.createMany({
    data: [
      { conversation_id: convAB.id, user_id: U.alice }, { conversation_id: convAB.id, user_id: U.bob },
      { conversation_id: convCD.id, user_id: U.clara }, { conversation_id: convCD.id, user_id: U.david },
      { conversation_id: convEF.id, user_id: U.emma },  { conversation_id: convEF.id, user_id: U.frank },
    ],
  });

  // ── Messages ──
  await prisma.message.createMany({
    data: [
      { conversation_id: convAB.id, sender_id: U.alice, content: "Salut Bob, ton T2 a l'air top pour un switch." },
      { conversation_id: convAB.id, sender_id: U.bob,   content: "Merci Alice ! Ton studio aussi. Dispos en juin ?" },
      { conversation_id: convAB.id, sender_id: U.alice, content: "Oui, juin fonctionne. On synchronise les dates sur l'app ?" },
      { conversation_id: convAB.id, sender_id: U.bob,   content: "Parfait, on valide le créneau ?" },

      { conversation_id: convCD.id, sender_id: U.clara, content: "Bonjour David, ta vue mer me fait rêver !" },
      { conversation_id: convCD.id, sender_id: U.david, content: "Et ta maison avec jardin c'est exactement ce qu'il me faut." },
      { conversation_id: convCD.id, sender_id: U.clara, content: "On échange début juillet ?" },
      { conversation_id: convCD.id, sender_id: U.david, content: "Super, je t'envoie les clés par recommandé !" },

      { conversation_id: convEF.id, sender_id: U.frank, content: "Salut Emma, ta villa a l'air incroyable." },
      { conversation_id: convEF.id, sender_id: U.emma,  content: "Merci Frank ! Ton studio à Nice est parfait pour les vacances." },
      { conversation_id: convEF.id, sender_id: U.frank, content: "La piscine est chauffée ?" },
    ],
  });

  // ── Swipes ──
  await prisma.swipe.createMany({
    data: [
      { user_id: U.alice, property_id: pBob.id,   action: "like" },
      { user_id: U.bob,   property_id: pAlice.id, action: "like" },
      { user_id: U.clara, property_id: pDavid.id, action: "like" },
      { user_id: U.david, property_id: pClara.id, action: "like" },
      { user_id: U.emma,  property_id: pFrank.id, action: "like" },
      { user_id: U.frank, property_id: pEmma.id,  action: "like" },
      { user_id: U.admin, property_id: pAlice.id, action: "like" },
      { user_id: U.admin, property_id: pBob.id,   action: "like" },
      { user_id: U.admin, property_id: pClara.id, action: "like" },
      { user_id: U.alice, property_id: pDavid.id, action: "dislike" },
      { user_id: U.bob,   property_id: pEmma.id,  action: "like" },
    ],
  });

  // ── Favorites ──
  await prisma.favorite.createMany({
    data: [
      { user_id: U.admin, property_id: pClara.id },
      { user_id: U.admin, property_id: pEmma.id },
      { user_id: U.alice, property_id: pDavid.id },
      { user_id: U.bob,   property_id: pClara.id },
      { user_id: U.clara, property_id: pFrank.id },
    ],
  });

  console.log("Mock seed complete.");
  console.log("  Admin:  abderrazaq@mail.com / admin123");
  console.log("  Users:  mock.alice@example.com / mock12345");
  console.log("          mock.bob@example.com / mock12345");
  console.log("          mock.clara@example.com / mock12345");
  console.log("          mock.david@example.com / mock12345");
  console.log("          mock.emma@example.com / mock12345");
  console.log("          mock.frank@example.com / mock12345");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
