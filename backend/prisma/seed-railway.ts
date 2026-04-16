/**
 * Seeds the Railway production database.
 * Usage: DATABASE_URL="postgresql://..." npx tsx data/seed-railway.ts
 */
import { PrismaClient } from "@prisma/client";

const ADMIN_PW_HASH = "$2a$10$r9hHS6wvS.ZIhnfXDSjdHuiySWQqqhxlS2G6D5Hswmn7/xzAH0yZi"; // admin123
const MOCK_PW_HASH = "$2a$10$cRMO21Q5wlu4rN1BOepdxOw3aBJrbACfPDLffpS30kXshoTkXVfuW"; // mock12345

const U = {
  admin: "a0000000-0000-4000-8000-000000000000",
  alice: "f1111111-1111-4111-8111-111111111111",
  bob:   "f2222222-2222-4222-8222-222222222222",
  clara: "f3333333-3333-4333-8333-333333333333",
  david: "f4444444-4444-4444-8444-444444444444",
  emma:  "f5555555-5555-4555-8555-555555555555",
  frank: "f6666666-6666-4666-8666-666666666666",
  sarah: "f7777777-7777-4777-8777-777777777777",
  lucas: "f8888888-8888-4888-8888-888888888888",
} as const;

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
  const url = process.argv[2] || process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Usage: npx tsx seed-railway.ts <DATABASE_URL>");

  console.log("Connecting to Railway database...");
  const prisma = new PrismaClient({ datasources: { db: { url } } });

  const now = new Date();
  const m1 = new Date(now); m1.setMonth(m1.getMonth() + 1);
  const m2 = new Date(now); m2.setMonth(m2.getMonth() + 2);
  const m3 = new Date(now); m3.setMonth(m3.getMonth() + 3);
  const m4 = new Date(now); m4.setMonth(m4.getMonth() + 4);

  // ── Auth users ──
  console.log("Creating auth users...");
  for (const data of [
    authRow(U.admin, "abderrazaq@mail.com",      ADMIN_PW_HASH, "Abderrazaq Makran", now),
    authRow(U.alice, "mock.alice@example.com",    MOCK_PW_HASH,  "Alice Martin",      now),
    authRow(U.bob,   "mock.bob@example.com",      MOCK_PW_HASH,  "Bob Durand",        now),
    authRow(U.clara, "mock.clara@example.com",    MOCK_PW_HASH,  "Clara Dubois",      now),
    authRow(U.david, "mock.david@example.com",    MOCK_PW_HASH,  "David Moreau",      now),
    authRow(U.emma,  "mock.emma@example.com",     MOCK_PW_HASH,  "Emma Bernard",      now),
    authRow(U.frank, "mock.frank@example.com",    MOCK_PW_HASH,  "Frank Petit",       now),
    authRow(U.sarah, "mock.sarah@example.com",    MOCK_PW_HASH,  "Sarah Leroy",       now),
    authRow(U.lucas, "mock.lucas@example.com",    MOCK_PW_HASH,  "Lucas Garnier",     now),
  ]) {
    await prisma.authUser.upsert({ where: { id: data.id }, update: {}, create: data });
  }

  // ── Profiles ──
  console.log("Creating user profiles...");
  const profiles = [
    {
      user_id: U.admin, email: "abderrazaq@mail.com", full_name: "Abderrazaq Makran",
      first_name: "Abderrazaq", last_name: "Makran",
      city: "Paris", profession: "Développeur full-stack", bio: "Co-fondateur SwitchAppart.",
      phone_number: "0612345678", phone_country_code: "+33",
      budget_min: 900, budget_max: 2000, surface_min: 40,
      preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi", "parking", "elevator"],
      preferred_district: "10e", country: "France", verified: true,
      date_of_birth: new Date("1996-05-15"),
    },
    {
      user_id: U.alice, email: "mock.alice@example.com", full_name: "Alice Martin",
      first_name: "Alice", last_name: "Martin",
      city: "Paris", profession: "Designer UX", bio: "Parisienne passionnée de déco scandinave.",
      phone_number: "0698765432", phone_country_code: "+33",
      budget_min: 800, budget_max: 1400, surface_min: 35,
      preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "washing_machine"],
      preferred_district: "11e", country: "France",
      date_of_birth: new Date("1994-03-22"),
    },
    {
      user_id: U.bob, email: "mock.bob@example.com", full_name: "Bob Durand",
      first_name: "Bob", last_name: "Durand",
      city: "Lyon", profession: "Photographe freelance", bio: "Nomade digital entre Lyon et Lisbonne.",
      phone_number: "0634567890", phone_country_code: "+33",
      budget_min: 600, budget_max: 1000, surface_min: 28,
      preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi"],
      country: "France", date_of_birth: new Date("1991-08-10"),
    },
    {
      user_id: U.clara, email: "mock.clara@example.com", full_name: "Clara Dubois",
      first_name: "Clara", last_name: "Dubois",
      city: "Bordeaux", profession: "Enseignante en lettres", bio: "Amoureuse de littérature et de bons vins.",
      phone_number: "0645678901", phone_country_code: "+33",
      budget_min: 500, budget_max: 900, surface_min: 30,
      preferred_property_types: ["apartment", "house"], preferred_amenities: ["wifi", "garden", "parking"],
      preferred_district: "Chartrons", country: "France", date_of_birth: new Date("1988-12-05"),
    },
    {
      user_id: U.david, email: "mock.david@example.com", full_name: "David Moreau",
      first_name: "David", last_name: "Moreau",
      city: "Marseille", profession: "Chef cuisinier", bio: "Vue mer ou rien !",
      phone_number: "0656789012", phone_country_code: "+33",
      budget_min: 700, budget_max: 1200, surface_min: 40,
      preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "balcony", "sea_view"],
      preferred_district: "Vieux-Port", country: "France", date_of_birth: new Date("1985-06-18"),
    },
    {
      user_id: U.emma, email: "mock.emma@example.com", full_name: "Emma Bernard",
      first_name: "Emma", last_name: "Bernard",
      city: "Toulouse", profession: "Ingénieure aéronautique", bio: "Sportive, randonneuse. Besoin d'espace.",
      phone_number: "0667890123", phone_country_code: "+33",
      budget_min: 600, budget_max: 1100, surface_min: 45,
      preferred_property_types: ["house", "apartment"], preferred_amenities: ["wifi", "garden", "gym"],
      country: "France", date_of_birth: new Date("1993-09-30"),
    },
    {
      user_id: U.frank, email: "mock.frank@example.com", full_name: "Frank Petit",
      first_name: "Frank", last_name: "Petit",
      city: "Nice", profession: "Consultant IT", bio: "Full remote depuis la Côte d'Azur.",
      phone_number: "0678901234", phone_country_code: "+33",
      budget_min: 800, budget_max: 1500, surface_min: 35,
      preferred_property_types: ["apartment", "studio"], preferred_amenities: ["wifi", "air_conditioning"],
      preferred_district: "Promenade", country: "France", date_of_birth: new Date("1990-01-25"),
    },
    {
      user_id: U.sarah, email: "mock.sarah@example.com", full_name: "Sarah Leroy",
      first_name: "Sarah", last_name: "Leroy",
      city: "Nantes", profession: "Architecte d'intérieur", bio: "Mon appart est mon showroom !",
      phone_number: "0689012345", phone_country_code: "+33",
      budget_min: 700, budget_max: 1300, surface_min: 40,
      preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi", "balcony", "parking"],
      country: "France", date_of_birth: new Date("1992-07-14"),
    },
    {
      user_id: U.lucas, email: "mock.lucas@example.com", full_name: "Lucas Garnier",
      first_name: "Lucas", last_name: "Garnier",
      city: "Strasbourg", profession: "Étudiant en médecine", bio: "En stage, je cherche un échange temporaire.",
      phone_number: "0690123456", phone_country_code: "+33",
      budget_min: 400, budget_max: 700, surface_min: 20,
      preferred_property_types: ["studio", "apartment"], preferred_amenities: ["wifi", "washing_machine"],
      country: "France", date_of_birth: new Date("1999-11-03"),
    },
  ];
  for (const p of profiles) {
    await prisma.userProfile.upsert({ where: { user_id: p.user_id }, update: {}, create: p });
  }

  // ── Admin ──
  console.log("Creating admin...");
  await prisma.adminUser.upsert({ where: { user_id: U.admin }, update: {}, create: { user_id: U.admin } });

  // ── Switch passes ──
  console.log("Creating switch passes...");
  for (const sp of [
    { user_id: U.admin, balance: 50 }, { user_id: U.alice, balance: 10 }, { user_id: U.bob, balance: 5 },
    { user_id: U.clara, balance: 8 }, { user_id: U.david, balance: 3 }, { user_id: U.emma, balance: 12 },
    { user_id: U.frank, balance: 7 }, { user_id: U.sarah, balance: 9 }, { user_id: U.lucas, balance: 2 },
  ]) {
    await prisma.userSwitchPass.upsert({ where: { user_id: sp.user_id }, update: {}, create: sp });
  }

  // ── Properties ──
  console.log("Creating properties...");
  const propData = [
    {
      owner_id: U.admin, title: "Loft moderne – Paris 10e",
      description: "Grand loft rénové avec verrière industrielle. Parfait pour le coworking.",
      address: "42 rue du Faubourg Saint-Denis", city: "Paris", district: "10e", postal_code: "75010", country: "France",
      latitude: 48.8763, longitude: 2.3614,
      monthly_rent: 1600, deposit: 3200, surface_area: 65, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "loft", furnished: true, pets_allowed: true, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "parking", "elevator", "washing_machine", "air_conditioning"],
      photo_paths: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      available_from: now, available_until: m3,
    },
    {
      owner_id: U.alice, title: "Studio lumineux – Bastille",
      description: "Studio refait à neuf dans le quartier de Bastille. Calme sur cour.",
      address: "15 rue de la Roquette", city: "Paris", district: "11e", postal_code: "75011", country: "France",
      latitude: 48.8588, longitude: 2.3811,
      monthly_rent: 1100, deposit: 2200, surface_area: 32, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "washing_machine"],
      photo_paths: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      available_from: now, available_until: m1,
    },
    {
      owner_id: U.bob, title: "T2 charme – Presqu'île Lyon",
      description: "Bel appartement avec vue dégagée sur les toits lyonnais.",
      address: "8 rue de la République", city: "Lyon", district: "Presqu'île", postal_code: "69002", country: "France",
      latitude: 45.7640, longitude: 4.8357,
      monthly_rent: 850, deposit: 850, surface_area: 45, rooms: 3, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "elevator"],
      photo_paths: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      available_from: now, available_until: m1,
    },
    {
      owner_id: U.clara, title: "Maison jardin – Chartrons Bordeaux",
      description: "Maison de ville authentique avec petit jardin arboré.",
      address: "23 rue Notre-Dame", city: "Bordeaux", district: "Chartrons", postal_code: "33300", country: "France",
      latitude: 44.8554, longitude: -0.5698,
      monthly_rent: 780, deposit: 1560, surface_area: 55, rooms: 4, bedrooms: 2, bathrooms: 1,
      property_type: "house", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "garden", "parking"],
      photo_paths: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      available_from: now, available_until: m2,
    },
    {
      owner_id: U.david, title: "T3 terrasse vue mer – Vieux-Port",
      description: "Superbe T3 avec terrasse plein sud et vue imprenable sur le Vieux-Port.",
      address: "3 quai de Rive Neuve", city: "Marseille", district: "Vieux-Port", postal_code: "13001", country: "France",
      latitude: 43.2965, longitude: 5.3698,
      monthly_rent: 1050, deposit: 2100, surface_area: 52, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "balcony", "sea_view"],
      photo_paths: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      available_from: now, available_until: m2,
    },
    {
      owner_id: U.emma, title: "Villa piscine – Saint-Cyprien Toulouse",
      description: "Grande maison avec piscine chauffée et jardin clos. 3 chambres.",
      address: "12 allée des Demoiselles", city: "Toulouse", district: "Saint-Cyprien", postal_code: "31300", country: "France",
      latitude: 43.5976, longitude: 1.4282,
      monthly_rent: 950, deposit: 1900, surface_area: 90, rooms: 5, bedrooms: 3, bathrooms: 2,
      property_type: "house", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "garden", "pool", "parking"],
      photo_paths: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      available_from: now, available_until: m3,
    },
    {
      owner_id: U.frank, title: "Studio climatisé – Promenade Nice",
      description: "Studio rénové à 200m de la plage, climatisé, coin bureau ergonomique.",
      address: "87 Promenade des Anglais", city: "Nice", district: "Promenade des Anglais", postal_code: "06000", country: "France",
      latitude: 43.6947, longitude: 7.2654,
      monthly_rent: 1200, deposit: 2400, surface_area: 38, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "studio", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "air_conditioning", "sea_view"],
      photo_paths: [
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        "https://images.unsplash.com/photo-1598928506311-c55ez633a2ab?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
      available_from: now, available_until: m2,
    },
    {
      owner_id: U.sarah, title: "Loft atelier – Île de Nantes",
      description: "Ancien atelier d'artiste transformé en loft ouvert. Hauteur sous plafond 4m.",
      address: "5 boulevard de la Prairie", city: "Nantes", district: "Île de Nantes", postal_code: "44200", country: "France",
      latitude: 47.2066, longitude: -1.5550,
      monthly_rent: 1100, deposit: 2200, surface_area: 70, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "loft", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "balcony", "parking", "washing_machine"],
      photo_paths: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
      available_from: now, available_until: m4,
    },
    {
      owner_id: U.lucas, title: "Studio étudiant – Petite France Strasbourg",
      description: "Petit studio fonctionnel en plein cœur de la Petite France.",
      address: "18 rue du Bain-aux-Plantes", city: "Strasbourg", district: "Petite France", postal_code: "67000", country: "France",
      latitude: 48.5805, longitude: 7.7395,
      monthly_rent: 520, deposit: 520, surface_area: 22, rooms: 1, bedrooms: 1, bathrooms: 1,
      property_type: "studio", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "washing_machine"],
      photo_paths: [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      ],
      cover_path: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80",
      available_from: now, available_until: m2,
    },
  ];

  const properties: Record<string, { id: string }> = {};
  for (const p of propData) {
    const existing = await prisma.property.findFirst({ where: { owner_id: p.owner_id, title: p.title } });
    if (existing) {
      properties[p.owner_id] = existing;
    } else {
      properties[p.owner_id] = await prisma.property.create({ data: p });
    }
  }

  // ── Favorites ──
  console.log("Creating favorites...");
  const favs = [
    { user_id: U.admin, property_id: properties[U.clara].id },
    { user_id: U.admin, property_id: properties[U.emma].id },
    { user_id: U.admin, property_id: properties[U.sarah].id },
    { user_id: U.alice, property_id: properties[U.david].id },
    { user_id: U.bob,   property_id: properties[U.clara].id },
    { user_id: U.clara, property_id: properties[U.frank].id },
    { user_id: U.david, property_id: properties[U.admin].id },
    { user_id: U.emma,  property_id: properties[U.alice].id },
    { user_id: U.sarah, property_id: properties[U.bob].id },
    { user_id: U.lucas, property_id: properties[U.emma].id },
  ];
  for (const f of favs) {
    const exists = await prisma.favorite.findFirst({ where: { user_id: f.user_id, property_id: f.property_id } });
    if (!exists) await prisma.favorite.create({ data: f });
  }

  console.log("\nSeed complete!");
  console.log("  Admin:  abderrazaq@mail.com / admin123");
  console.log("  Users:  mock.alice@example.com / mock12345 (+ 7 others)");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
