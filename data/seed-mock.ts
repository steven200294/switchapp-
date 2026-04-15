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
  sarah: "f7777777-7777-4777-8777-777777777777",
  lucas: "f8888888-8888-4888-8888-888888888888",
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
  await prisma.geocodingCache.deleteMany();
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
  const m4 = new Date(now); m4.setMonth(m4.getMonth() + 4);

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
      authRow(U.sarah, "mock.sarah@example.com",    MOCK_PW_HASH,  "Sarah Leroy",       now),
      authRow(U.lucas, "mock.lucas@example.com",    MOCK_PW_HASH,  "Lucas Garnier",     now),
    ],
  });

  // ── Profiles ──
  await prisma.userProfile.createMany({
    data: [
      {
        user_id: U.admin, email: "abderrazaq@mail.com", full_name: "Abderrazaq Makran",
        first_name: "Abderrazaq", last_name: "Makran",
        city: "Paris", profession: "Développeur full-stack", bio: "Co-fondateur SwitchAppart. Passionné de tech et d'immobilier.",
        phone_number: "0612345678", phone_country_code: "+33",
        budget_min: 900, budget_max: 2000, surface_min: 40,
        preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi", "parking", "elevator"],
        preferred_district: "10e", country: "France", verified: true,
        date_of_birth: new Date("1996-05-15"),
      },
      {
        user_id: U.alice, email: "mock.alice@example.com", full_name: "Alice Martin",
        first_name: "Alice", last_name: "Martin",
        city: "Paris", profession: "Designer UX", bio: "Parisienne passionnée de déco scandinave et de cafés.",
        phone_number: "0698765432", phone_country_code: "+33",
        budget_min: 800, budget_max: 1400, surface_min: 35,
        preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "washing_machine"],
        preferred_district: "11e", country: "France",
        date_of_birth: new Date("1994-03-22"),
      },
      {
        user_id: U.bob, email: "mock.bob@example.com", full_name: "Bob Durand",
        first_name: "Bob", last_name: "Durand",
        city: "Lyon", profession: "Photographe freelance", bio: "Nomade digital, je voyage entre Lyon et Lisbonne. Cherche échanges courts.",
        phone_number: "0634567890", phone_country_code: "+33",
        budget_min: 600, budget_max: 1000, surface_min: 28,
        preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi"],
        country: "France",
        date_of_birth: new Date("1991-08-10"),
      },
      {
        user_id: U.clara, email: "mock.clara@example.com", full_name: "Clara Dubois",
        first_name: "Clara", last_name: "Dubois",
        city: "Bordeaux", profession: "Enseignante en lettres", bio: "Amoureuse de littérature et de bons vins. Maison avec jardin obligatoire !",
        phone_number: "0645678901", phone_country_code: "+33",
        budget_min: 500, budget_max: 900, surface_min: 30,
        preferred_property_types: ["apartment", "house"], preferred_amenities: ["wifi", "garden", "parking"],
        preferred_district: "Chartrons", country: "France",
        date_of_birth: new Date("1988-12-05"),
      },
      {
        user_id: U.david, email: "mock.david@example.com", full_name: "David Moreau",
        first_name: "David", last_name: "Moreau",
        city: "Marseille", profession: "Chef cuisinier", bio: "Vue mer ou rien. Je cuisine pour mes voisins !",
        phone_number: "0656789012", phone_country_code: "+33",
        budget_min: 700, budget_max: 1200, surface_min: 40,
        preferred_property_types: ["apartment"], preferred_amenities: ["wifi", "balcony", "sea_view"],
        preferred_district: "Vieux-Port", country: "France",
        date_of_birth: new Date("1985-06-18"),
      },
      {
        user_id: U.emma, email: "mock.emma@example.com", full_name: "Emma Bernard",
        first_name: "Emma", last_name: "Bernard",
        city: "Toulouse", profession: "Ingénieure aéronautique", bio: "Sportive, randonneuse. J'ai besoin d'espace et d'un jardin pour mon chien.",
        phone_number: "0667890123", phone_country_code: "+33",
        budget_min: 600, budget_max: 1100, surface_min: 45,
        preferred_property_types: ["house", "apartment"], preferred_amenities: ["wifi", "garden", "gym"],
        country: "France",
        date_of_birth: new Date("1993-09-30"),
      },
      {
        user_id: U.frank, email: "mock.frank@example.com", full_name: "Frank Petit",
        first_name: "Frank", last_name: "Petit",
        city: "Nice", profession: "Consultant IT", bio: "Full remote depuis la Côte d'Azur. Besoin de calme et de bonne connexion.",
        phone_number: "0678901234", phone_country_code: "+33",
        budget_min: 800, budget_max: 1500, surface_min: 35,
        preferred_property_types: ["apartment", "studio"], preferred_amenities: ["wifi", "air_conditioning"],
        preferred_district: "Promenade", country: "France",
        date_of_birth: new Date("1990-01-25"),
      },
      {
        user_id: U.sarah, email: "mock.sarah@example.com", full_name: "Sarah Leroy",
        first_name: "Sarah", last_name: "Leroy",
        city: "Nantes", profession: "Architecte d'intérieur", bio: "J'adore transformer les espaces. Mon appart est mon showroom !",
        phone_number: "0689012345", phone_country_code: "+33",
        budget_min: 700, budget_max: 1300, surface_min: 40,
        preferred_property_types: ["apartment", "loft"], preferred_amenities: ["wifi", "balcony", "parking"],
        country: "France",
        date_of_birth: new Date("1992-07-14"),
      },
      {
        user_id: U.lucas, email: "mock.lucas@example.com", full_name: "Lucas Garnier",
        first_name: "Lucas", last_name: "Garnier",
        city: "Strasbourg", profession: "Étudiant en médecine", bio: "En stage à l'hôpital, je cherche un échange temporaire dans une grande ville.",
        phone_number: "0690123456", phone_country_code: "+33",
        budget_min: 400, budget_max: 700, surface_min: 20,
        preferred_property_types: ["studio", "apartment"], preferred_amenities: ["wifi", "washing_machine"],
        country: "France",
        date_of_birth: new Date("1999-11-03"),
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
      { user_id: U.sarah, balance: 9 },
      { user_id: U.lucas, balance: 2 },
    ],
  });

  // ── Properties ──
  const pAdmin = await prisma.property.create({
    data: {
      owner_id: U.admin, title: "Loft moderne – Paris 10e",
      description: "Grand loft rénové avec verrière industrielle. Parfait pour le coworking et la vie quotidienne. Lumineux toute la journée, cuisine ouverte équipée, parquet massif.",
      address: "42 rue du Faubourg Saint-Denis", city: "Paris", district: "10e", postal_code: "75010", country: "France",
      latitude: 48.8763, longitude: 2.3614,
      monthly_rent: 1600, deposit: 3200, surface_area: 65, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "loft", furnished: true, pets_allowed: true, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "parking", "elevator", "washing_machine", "air_conditioning"],
      photo_paths: ["mock/paris-loft.jpg"], cover_path: "mock/paris-loft.jpg",
      available_from: now, available_until: m3,
    },
  });

  const pAlice = await prisma.property.create({
    data: {
      owner_id: U.alice, title: "Studio lumineux – Bastille",
      description: "Studio refait à neuf dans le quartier de Bastille. Calme sur cour, proche métro, idéal pour un switch court. Machine à laver, micro-ondes, plaque induction.",
      address: "15 rue de la Roquette", city: "Paris", district: "11e", postal_code: "75011", country: "France",
      latitude: 48.8588, longitude: 2.3811,
      monthly_rent: 1100, deposit: 2200, surface_area: 32, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "washing_machine"],
      photo_paths: ["mock/paris-a.jpg"], cover_path: "mock/paris-a.jpg",
      available_from: now, available_until: m1,
    },
  });

  const pBob = await prisma.property.create({
    data: {
      owner_id: U.bob, title: "T2 charme – Presqu'île Lyon",
      description: "Bel appartement avec vue dégagée sur les toits lyonnais. Fibre optique, quartier vivant à deux pas des Terreaux. Parquet ancien, moulures.",
      address: "8 rue de la République", city: "Lyon", district: "Presqu'île", postal_code: "69002", country: "France",
      latitude: 45.7640, longitude: 4.8357,
      monthly_rent: 850, deposit: 850, surface_area: 45, rooms: 3, bedrooms: 1, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "elevator"],
      photo_paths: ["mock/lyon-b.jpg"], cover_path: "mock/lyon-b.jpg",
      available_from: now, available_until: m1,
    },
  });

  const pClara = await prisma.property.create({
    data: {
      owner_id: U.clara, title: "Maison jardin – Chartrons Bordeaux",
      description: "Maison de ville authentique avec petit jardin arboré. Quartier prisé des Chartrons, à 10 min à vélo du centre. Idéale pour une famille ou un couple.",
      address: "23 rue Notre-Dame", city: "Bordeaux", district: "Chartrons", postal_code: "33300", country: "France",
      latitude: 44.8554, longitude: -0.5698,
      monthly_rent: 780, deposit: 1560, surface_area: 55, rooms: 4, bedrooms: 2, bathrooms: 1,
      property_type: "house", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "garden", "parking"],
      photo_paths: ["mock/bordeaux-c.jpg"], cover_path: "mock/bordeaux-c.jpg",
      available_from: now, available_until: m2,
    },
  });

  const pDavid = await prisma.property.create({
    data: {
      owner_id: U.david, title: "T3 terrasse vue mer – Vieux-Port",
      description: "Superbe T3 avec terrasse plein sud et vue imprenable sur le Vieux-Port. Rénové en 2024, cuisine équipée, 2 vraies chambres. À 5 min à pied du port.",
      address: "3 quai de Rive Neuve", city: "Marseille", district: "Vieux-Port", postal_code: "13001", country: "France",
      latitude: 43.2965, longitude: 5.3698,
      monthly_rent: 1050, deposit: 2100, surface_area: 52, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "apartment", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "balcony", "sea_view"],
      photo_paths: ["mock/marseille-d.jpg"], cover_path: "mock/marseille-d.jpg",
      available_from: now, available_until: m2,
    },
  });

  const pEmma = await prisma.property.create({
    data: {
      owner_id: U.emma, title: "Villa piscine – Saint-Cyprien Toulouse",
      description: "Grande maison avec piscine chauffée et jardin clos. 3 chambres, 2 salles de bain, garage. Quartier calme mais proche du centre de Toulouse.",
      address: "12 allée des Demoiselles", city: "Toulouse", district: "Saint-Cyprien", postal_code: "31300", country: "France",
      latitude: 43.5976, longitude: 1.4282,
      monthly_rent: 950, deposit: 1900, surface_area: 90, rooms: 5, bedrooms: 3, bathrooms: 2,
      property_type: "house", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "garden", "pool", "parking"],
      photo_paths: ["mock/toulouse-e.jpg"], cover_path: "mock/toulouse-e.jpg",
      available_from: now, available_until: m3,
    },
  });

  const pFrank = await prisma.property.create({
    data: {
      owner_id: U.frank, title: "Studio climatisé – Promenade Nice",
      description: "Studio rénové à 200m de la plage, climatisé, coin bureau ergonomique. Parfait pour le télétravail avec vue partielle sur la mer.",
      address: "87 Promenade des Anglais", city: "Nice", district: "Promenade des Anglais", postal_code: "06000", country: "France",
      latitude: 43.6947, longitude: 7.2654,
      monthly_rent: 1200, deposit: 2400, surface_area: 38, rooms: 2, bedrooms: 1, bathrooms: 1,
      property_type: "studio", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "air_conditioning", "sea_view"],
      photo_paths: ["mock/nice-f.jpg"], cover_path: "mock/nice-f.jpg",
      available_from: now, available_until: m2,
    },
  });

  const pSarah = await prisma.property.create({
    data: {
      owner_id: U.sarah, title: "Loft atelier – Île de Nantes",
      description: "Ancien atelier d'artiste transformé en loft ouvert. Hauteur sous plafond 4m, briques apparentes, grande baie vitrée. Un lieu unique.",
      address: "5 boulevard de la Prairie", city: "Nantes", district: "Île de Nantes", postal_code: "44200", country: "France",
      latitude: 47.2066, longitude: -1.5550,
      monthly_rent: 1100, deposit: 2200, surface_area: 70, rooms: 3, bedrooms: 2, bathrooms: 1,
      property_type: "loft", furnished: true, pets_allowed: true, utilities_included: false,
      published: true, status: "published",
      amenities: ["wifi", "balcony", "parking", "washing_machine"],
      photo_paths: ["mock/nantes-s.jpg"], cover_path: "mock/nantes-s.jpg",
      available_from: now, available_until: m4,
    },
  });

  const pLucas = await prisma.property.create({
    data: {
      owner_id: U.lucas, title: "Studio étudiant – Petite France Strasbourg",
      description: "Petit studio fonctionnel en plein cœur de la Petite France. Calme, lumineux, à 5 min du tram. Idéal pour un étudiant ou un jeune pro.",
      address: "18 rue du Bain-aux-Plantes", city: "Strasbourg", district: "Petite France", postal_code: "67000", country: "France",
      latitude: 48.5805, longitude: 7.7395,
      monthly_rent: 520, deposit: 520, surface_area: 22, rooms: 1, bedrooms: 1, bathrooms: 1,
      property_type: "studio", furnished: true, pets_allowed: false, utilities_included: true,
      published: true, status: "published",
      amenities: ["wifi", "washing_machine"],
      photo_paths: ["mock/strasbourg-l.jpg"], cover_path: "mock/strasbourg-l.jpg",
      available_from: now, available_until: m2,
    },
  });

  // ── Matches (4 pairs) ──
  const matchAB = await prisma.match.create({
    data: { user_a: U.alice, user_b: U.bob, property_a: pAlice.id, property_b: pBob.id },
  });
  const matchCD = await prisma.match.create({
    data: { user_a: U.clara, user_b: U.david, property_a: pClara.id, property_b: pDavid.id },
  });
  const matchEF = await prisma.match.create({
    data: { user_a: U.emma, user_b: U.frank, property_a: pEmma.id, property_b: pFrank.id },
  });
  const matchSL = await prisma.match.create({
    data: { user_a: U.sarah, user_b: U.lucas, property_a: pSarah.id, property_b: pLucas.id },
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
  const convSL = await prisma.conversation.create({
    data: { match_id: matchSL.id, last_message_at: now, last_message_text: "Le tram est juste en bas ?" },
  });

  await prisma.conversationParticipant.createMany({
    data: [
      { conversation_id: convAB.id, user_id: U.alice }, { conversation_id: convAB.id, user_id: U.bob },
      { conversation_id: convCD.id, user_id: U.clara }, { conversation_id: convCD.id, user_id: U.david },
      { conversation_id: convEF.id, user_id: U.emma },  { conversation_id: convEF.id, user_id: U.frank },
      { conversation_id: convSL.id, user_id: U.sarah }, { conversation_id: convSL.id, user_id: U.lucas },
    ],
  });

  // ── Messages ──
  await prisma.message.createMany({
    data: [
      { conversation_id: convAB.id, sender_id: U.alice, content: "Salut Bob ! Ton T2 à Lyon a l'air super pour un switch. Tu serais dispo en juin ?" },
      { conversation_id: convAB.id, sender_id: U.bob,   content: "Merci Alice ! Ton studio Bastille me plairait bien aussi. Juin c'est parfait pour moi." },
      { conversation_id: convAB.id, sender_id: U.alice, content: "Génial ! On synchronise les dates sur l'app alors ?" },
      { conversation_id: convAB.id, sender_id: U.bob,   content: "Parfait, on valide le créneau ?" },

      { conversation_id: convCD.id, sender_id: U.clara, content: "Bonjour David ! Ta terrasse vue mer me fait rêver, j'en peux plus de rester à Bordeaux cet été." },
      { conversation_id: convCD.id, sender_id: U.david, content: "Haha je comprends ! Et ta maison avec jardin c'est exactement ce qu'il me faut pour décompresser." },
      { conversation_id: convCD.id, sender_id: U.clara, content: "On échange début juillet ? Je peux rester 3 semaines." },
      { conversation_id: convCD.id, sender_id: U.david, content: "Super, je t'envoie les clés par recommandé !" },

      { conversation_id: convEF.id, sender_id: U.frank, content: "Salut Emma ! Ta villa a l'air incroyable, la piscine c'est le rêve." },
      { conversation_id: convEF.id, sender_id: U.emma,  content: "Merci Frank ! Ton studio à Nice est parfait pour les vacances, j'ai besoin de la mer." },
      { conversation_id: convEF.id, sender_id: U.frank, content: "La piscine est chauffée ?" },

      { conversation_id: convSL.id, sender_id: U.sarah, content: "Salut Lucas ! Ton studio à Strasbourg m'intéresse pour un mois pendant un chantier." },
      { conversation_id: convSL.id, sender_id: U.lucas, content: "Cool ! Ton loft à Nantes a l'air dingue, ça me changerait de mon 22m² !" },
      { conversation_id: convSL.id, sender_id: U.sarah, content: "Haha oui, un peu plus d'espace ça fait du bien. Le quartier est sympa ?" },
      { conversation_id: convSL.id, sender_id: U.lucas, content: "Le tram est juste en bas ?" },
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
      { user_id: U.sarah, property_id: pLucas.id, action: "like" },
      { user_id: U.lucas, property_id: pSarah.id, action: "like" },
      { user_id: U.admin, property_id: pAlice.id, action: "like" },
      { user_id: U.admin, property_id: pBob.id,   action: "like" },
      { user_id: U.admin, property_id: pClara.id, action: "like" },
      { user_id: U.admin, property_id: pSarah.id, action: "like" },
      { user_id: U.alice, property_id: pDavid.id, action: "like" },
      { user_id: U.alice, property_id: pSarah.id, action: "like" },
      { user_id: U.bob,   property_id: pEmma.id,  action: "like" },
      { user_id: U.bob,   property_id: pLucas.id, action: "dislike" },
      { user_id: U.david, property_id: pAdmin.id, action: "like" },
      { user_id: U.emma,  property_id: pClara.id, action: "like" },
      { user_id: U.frank, property_id: pAdmin.id, action: "like" },
    ],
  });

  // ── Favorites ──
  await prisma.favorite.createMany({
    data: [
      { user_id: U.admin, property_id: pClara.id },
      { user_id: U.admin, property_id: pEmma.id },
      { user_id: U.admin, property_id: pSarah.id },
      { user_id: U.alice, property_id: pDavid.id },
      { user_id: U.alice, property_id: pSarah.id },
      { user_id: U.bob,   property_id: pClara.id },
      { user_id: U.bob,   property_id: pAdmin.id },
      { user_id: U.clara, property_id: pFrank.id },
      { user_id: U.david, property_id: pAdmin.id },
      { user_id: U.emma,  property_id: pAlice.id },
      { user_id: U.sarah, property_id: pBob.id },
      { user_id: U.lucas, property_id: pEmma.id },
    ],
  });

  console.log("Mock seed complete.");
  console.log("  Admin:  abderrazaq@mail.com / admin123");
  console.log("  Users:");
  console.log("    mock.alice@example.com / mock12345 (Alice Martin, Paris)");
  console.log("    mock.bob@example.com / mock12345 (Bob Durand, Lyon)");
  console.log("    mock.clara@example.com / mock12345 (Clara Dubois, Bordeaux)");
  console.log("    mock.david@example.com / mock12345 (David Moreau, Marseille)");
  console.log("    mock.emma@example.com / mock12345 (Emma Bernard, Toulouse)");
  console.log("    mock.frank@example.com / mock12345 (Frank Petit, Nice)");
  console.log("    mock.sarah@example.com / mock12345 (Sarah Leroy, Nantes)");
  console.log("    mock.lucas@example.com / mock12345 (Lucas Garnier, Strasbourg)");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
