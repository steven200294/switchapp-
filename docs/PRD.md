# SwitchAppart — Product Requirements Document (PRD)

> **Version :** 2.0  
> **Date :** 28 mars 2026  
> **Auteur :** Équipe SwitchAppart  
> **Statut :** Draft

---

## Table des matières

1. [Vision & Problème](#1-vision--problème)
2. [Utilisateurs cibles](#2-utilisateurs-cibles)
3. [Principes UX](#3-principes-ux)
4. [Parcours utilisateur](#4-parcours-utilisateur)
5. [Architecture fonctionnelle](#5-architecture-fonctionnelle)
6. [Fonctionnalités détaillées](#6-fonctionnalités-détaillées)
7. [Modèle de données](#7-modèle-de-données)
8. [Architecture technique](#8-architecture-technique)
9. [Roadmap & Priorités](#9-roadmap--priorités)
10. [Métriques de succès](#10-métriques-de-succès)

---

## 1. Vision & Problème

### Le problème

En France, changer de logement est un parcours du combattant :
- **Dossiers locatifs** interminables (garant, bulletins de salaire, avis d'imposition...)
- **Délais** de plusieurs mois entre la recherche et l'emménagement
- **Frais** élevés (agences, double loyer pendant la transition, déménagement)
- **Risque** pour le propriétaire et le locataire (mauvais payeur, logement dégradé)

### La solution

**SwitchAppart** est une plateforme d'échange de logements entre particuliers, sur le modèle du swipe (Tinder-style). Deux approches coexistent :
- **Échange direct** : deux locataires échangent leurs appartements. Le bail est transféré — pas de nouveau dossier, pas de frais d'agence.
- **Acquisition via SwitchPass** : un utilisateur sans logement à proposer peut accéder à un logement en utilisant un SwitchPass (monnaie de la plateforme).

### Proposition de valeur

| Pour le locataire | Pour le propriétaire |
|---|---|
| Zéro dossier à constituer | Son logement reste occupé, pas de vacance locative |
| Pas de frais d'agence | Même profil de locataire (vérifié par la plateforme) |
| Transition rapide et fluide | Pas de relocation, pas de remise en état entre deux locataires |
| Découverte de nouveaux quartiers | Continuité du bail |

---

## 2. Utilisateurs cibles

### Deux types d'utilisateurs fondamentaux

À l'inscription, on pose **une seule question** : "Vous êtes ?"

| Type | Description | Comportement |
|---|---|---|
| **Locataire** | A un logement et veut en changer | Publie son logement, swipe, échange directement |
| **Acheteur** | N'a pas de logement à proposer (ou ne veut pas proposer le sien) | Cherche un logement, utilise des SwitchPass pour y accéder |

Cette distinction impacte l'expérience : un locataire est guidé vers la publication de son logement, un acheteur vers l'achat de SwitchPass.

### Personas

**Le locataire urbain (principal)**
- 25-40 ans, CDI, zone urbaine dense
- Veut changer de quartier, se rapprocher du travail, gagner en surface
- Frustré par le processus classique

**L'acheteur en recherche**
- En mobilité pro, séparation, premier logement
- Besoin urgent d'un logement, pas de troc possible
- Prêt à payer (SwitchPass) pour accéder rapidement

**L'aventurier**
- Envie de changement, curieux, flexible
- Veut tester un nouveau quartier sans engagement

---

## 3. Principes UX

### Philosophie : "Luxe accessible, simplicité absolue"

Interface épurée inspirée d'Airbnb — photos immersives, interactions fluides, zéro friction.

| Principe | Application |
|---|---|
| **Browse-first** | L'utilisateur arrive directement sur l'expérience de recherche. Pas de splash, pas d'onboarding forcé. Il peut explorer librement sans compte. |
| **Register-to-match** | L'inscription n'est requise que pour matcher/swiper. Tout le reste (recherche, exploration, vue détail, favoris) est accessible sans compte. |
| **One-click rule** | Chaque action principale en 1 clic (liker, contacter). Les flux secondaires en 3 clics max. |
| **Minimum questions** | À l'inscription : email + mot de passe, c'est tout. Puis une seule question pertinente (locataire ou acheteur). Le reste du profil se complète progressivement via des nudges discrets. |
| **Mobile-first** | Conçu pour le mobile avec bottom navigation. Desktop = bonus responsive. |
| **Confiance par le visuel** | Photos grandes, badges de vérification, scores de compatibilité. |
| **Feedback immédiat** | Animation swipe, notification match, confirmation d'envoi. |

### Design System

- **Mode clair** : Fond blanc, accents bleus, style Airbnb épuré
- **Mode sombre** : Fond noir profond, accents néon (cyan, magenta, orange), glassmorphism
- **Typographie** : Poppins (titres), Inter (corps)
- **Couleurs primaires** : Bleu (#3B82F6), Orange (#F97316)
- **Succès / Erreur** : Vert (#22C55E), Rouge (#EF4444)

---

## 4. Parcours utilisateur

### 4.1 Premier lancement — Visiteur (non inscrit)

```
Ouverture de l'app
  → Atterrissage direct sur l'Explorer (= page d'accueil)
  → L'utilisateur peut :
    ✅ Chercher des logements (barre de recherche, filtres)
    ✅ Parcourir les annonces (liste, carte)
    ✅ Voir le détail d'un logement (photos, infos, propriétaire)
    ✅ Voir le profil d'un autre utilisateur
    🔒 Swiper / Matcher → déclenche la modale d'inscription
    🔒 Envoyer un message → déclenche la modale d'inscription
    🔒 Ajouter aux favoris → déclenche la modale d'inscription
```

**L'inscription est déclenchée au moment où l'utilisateur veut interagir**, pas avant. C'est une friction positive (il a déjà vu de la valeur).

### 4.2 Inscription (ultra-minimale)

```
Modale d'inscription :
  1. Email + Mot de passe → Créer mon compte (1 écran, 2 champs)
  2. Question unique : "Vous êtes ?"
     → 🏠 Locataire (j'ai un logement à proposer)
     → 🔍 Acheteur (je cherche un logement)
  3. → Retour à l'action que l'utilisateur voulait faire

C'est tout. Pas de nom, pas de téléphone, pas de date de naissance.
Ces infos seront demandées plus tard, au bon moment :
  - Nom → au moment de publier un logement ou de contacter quelqu'un
  - Téléphone → au moment de la vérification (optionnel)
  - Photo → nudge après le premier match
```

### 4.3 Parcours Locataire (a un logement)

```
Inscription → "Locataire" sélectionné
  → Nudge discret : "Publiez votre logement pour commencer à matcher"
  → Le locataire peut :
    - Publier son logement (guidé, minimal au départ)
    - Ensuite : swiper sur les logements des autres
    - Match mutuel → conversation → échange
```

### 4.4 Parcours Acheteur (n'a pas de logement)

```
Inscription → "Acheteur" sélectionné
  → L'acheteur peut :
    - Explorer et chercher des logements
    - Swiper (mais ne peut matcher que via SwitchPass)
    - Acheter des SwitchPass
    - Utiliser un SwitchPass pour débloquer un logement
    - Contacter via SwitchPass → conversation → acquisition
```

### 4.5 Swipe & Matching

```
Tab Switch → Deck de cartes
  → Swipe droite (❤️) = J'aime
  → Swipe gauche (✕) = Passer
  → Tap ℹ️ = Voir détail
  → Bouton ⭐ = Super Like (coûte 1 SwitchPass)

Match (entre deux locataires) :
  User A swipe droite sur logement de User B
  + User B swipe droite sur logement de User A
  = MATCH → Conversation créée → Notification

Accès via SwitchPass (acheteur ou échange non réciproque) :
  User utilise 1 SwitchPass sur un logement
  → Demande d'accès envoyée au propriétaire
  → Si acceptée → Conversation créée → Suite du processus
```

### 4.6 Profil progressif

Le profil se complète au fil du temps, jamais en bloc :

| Moment | Info demandée | Pourquoi |
|---|---|---|
| Inscription | Email + mot de passe | Minimum vital |
| Juste après | Locataire ou Acheteur | Personnaliser l'expérience |
| 1er logement publié | Nom + ville | Nécessaire pour l'annonce |
| 1er match | Photo de profil (nudge) | Confiance envers l'autre |
| Avant de confirmer un échange | Téléphone + vérification | Sécurité |
| Optionnel | Bio, profession, préférences | Enrichir le profil |

---

## 5. Architecture fonctionnelle

### Navigation principale (Bottom Nav — 4 onglets)

```
┌─────────────────────────────────────────────────────┐
│  Explorer  │  Switch 🔒  │  Messages 🔒  │  Profil  │
└─────────────────────────────────────────────────────┘

🔒 = nécessite un compte (déclenche l'inscription si non connecté)
```

**L'Explorer EST la page d'accueil.** Pas d'onglet "Accueil" séparé — l'utilisateur atterrit directement sur la recherche et la découverte de logements.

### Cartographie des écrans

```
┌──────────────────────────────────────────────────────────┐
│ EXPLORER (= page d'accueil, accessible sans compte)       │
│  ├── Barre de recherche                                   │
│  ├── Filtres (loyer, ville, type, surface...)             │
│  ├── Liste de logements (cards)                           │
│  ├── Vue carte (toggle)                                   │
│  └── Tap carte → Détail logement (accessible sans compte) │
├──────────────────────────────────────────────────────────┤
│ SWITCH 🔒 (compte requis)                                 │
│  ├── Deck de cartes swipables                             │
│  ├── Boutons (Passer, Détail, Liker, Super Like)          │
│  ├── Animation match                                      │
│  └── Undo                                                 │
├──────────────────────────────────────────────────────────┤
│ MESSAGES 🔒 (compte requis)                               │
│  ├── Liste des conversations                              │
│  └── Chat individuel                                      │
├──────────────────────────────────────────────────────────┤
│ PROFIL                                                    │
│  ├── Non connecté → Modale connexion/inscription          │
│  ├── Connecté :                                           │
│  │   ├── Mon profil                                       │
│  │   ├── Mon logement (si locataire)                      │
│  │   ├── Mes SwitchPass                                   │
│  │   ├── Mes favoris                                      │
│  │   ├── Paramètres                                       │
│  │   └── Déconnexion                                      │
└──────────────────────────────────────────────────────────┘

Écrans transversaux :
  ├── Détail logement (public)
  ├── Profil autre utilisateur (public)
  ├── Ajout/Édition de logement 🔒
  ├── SwitchPass 🔒
  └── Modale inscription/connexion
```

---

## 6. Fonctionnalités détaillées

### 6.1 Authentification

| Fonctionnalité | Détail | Priorité |
|---|---|---|
| Inscription email/mdp | Email + mot de passe seulement, puis question locataire/acheteur | P0 |
| Connexion | Email + mot de passe → JWT | P0 |
| Refresh token | Renouvellement automatique du JWT | P0 |
| Modale contextuelle | L'inscription se déclenche au moment où l'utilisateur veut une action protégée | P0 |
| Mot de passe oublié | Email de réinitialisation | P1 |
| Connexion Google/Apple | OAuth2 social login | P2 |

**Important** : l'inscription ne collecte que email + mot de passe + type (locataire/acheteur). Tout le reste est progressif.

### 6.2 Profil utilisateur

#### Données collectées progressivement

| Champ | Quand on le demande | Requis pour |
|---|---|---|
| email | Inscription | Compte |
| password | Inscription | Compte |
| user_type | Juste après inscription | Personnalisation |
| full_name | Publication logement ou 1er contact | Identité |
| avatar | Nudge après 1er match | Confiance |
| city | Publication logement | Localisation |
| phone | Vérification avancée | Sécurité |
| bio | Optionnel (profil) | Enrichissement |
| profession | Optionnel (profil) | Enrichissement |
| date_of_birth | Optionnel (profil) | Enrichissement |

#### Ce qui est visible sur un profil public

- Avatar (ou placeholder)
- Nom (ou "Utilisateur SwitchAppart" si pas encore renseigné)
- Ville
- Type (locataire / acheteur) — sous forme de badge
- Bio (si renseignée)
- Profession (si renseignée)
- Membre depuis (auto)
- Nb échanges réalisés (auto)
- Note moyenne (auto, après premiers avis)
- Vérifications complétées (badges)
- Ses logements publiés (mini-cards cliquables)

#### Vérifications (Trust Score)

| Vérification | Méthode | Priorité |
|---|---|---|
| Email validé | Lien de confirmation | P1 |
| Téléphone vérifié | SMS/OTP | P2 |
| Identité vérifiée | KYC (document) | P3 |
| Logement publié | Au moins 1 annonce active | P0 (auto) |

### 6.3 Logement (Property)

#### Publication de logement (le moins de friction possible)

L'objectif est que publier un logement soit aussi simple que poster sur Instagram.

**Étape 1 — L'essentiel (1 écran)**
- Type de bien (apartment, studio, house, loft, room)
- Ville + quartier
- Loyer mensuel
- Nombre de pièces
- Surface

**Étape 2 — Photos (1 écran)**
- Minimum 1 photo (idéalement 3+)
- Upload depuis galerie ou appareil photo
- La première photo = cover

**Étape 3 — Optionnel (compléter plus tard)**
- Description libre
- Équipements détaillés
- Disponibilité précise
- Conditions (meublé, animaux, fumeur)

Le logement est publiable dès l'étape 2. L'étape 3 enrichit l'annonce et améliore le score de compatibilité, mais n'est pas bloquante.

#### Page détail d'un logement (accessible sans compte)

**Section 1 — Galerie photos**
- Carrousel plein écran + miniatures
- Badge de compatibilité (si l'utilisateur est connecté)
- Compteur d'images

**Section 2 — Informations principales**
- Titre
- Localisation (ville + quartier)
- Grille : Surface, Pièces, Chambres, SdB
- Loyer / mois
- Disponibilité

**Section 3 — Description** (si renseignée)
- Texte libre

**Section 4 — Équipements** (si renseignés)
- Grille avec icônes

**Section 5 — Le propriétaire**
- Avatar + nom + badge vérifié
- Note + nb avis (si disponible)
- Nb échanges + temps de réponse
- Bouton "Voir le profil"

**Section 6 — Pourquoi ce match** (si connecté + préférences renseignées)
- Raisons personnalisées basées sur les préférences

**Section 7 — Actions**
- Bouton principal "Contacter" ou "Matcher" (🔒 si non connecté)
- Bouton "Favoris" (🔒)
- Bouton "Partager"

#### Champs du logement (modèle de données)

| Champ | Type | Requis | Description |
|---|---|---|---|
| title | string | Auto-généré ou saisi | Titre de l'annonce |
| property_type | enum | Oui | apartment, studio, house, loft, room |
| city | string | Oui | Ville |
| district | string | Non | Quartier / arrondissement |
| postal_code | string | Non | Code postal |
| address | string | Non | Adresse (peut être complétée plus tard) |
| country | string | Auto | "France" |
| latitude / longitude | float | Auto | Géocodage |
| surface_area | int | Oui | m² |
| rooms | int | Oui | Nombre de pièces |
| bedrooms | int | Non | Nombre de chambres |
| bathrooms | int | Non | Nombre de SdB |
| monthly_rent | int | Oui | Loyer en € |
| photos | string[] | Oui (min 1) | URLs des photos |
| cover_image | string | Auto | Première photo |
| description | text | Non | Description libre |
| amenities | string[] | Non | Équipements |
| furnished | bool | Non | Meublé |
| pets_allowed | bool | Non | Animaux |
| smoking_allowed | bool | Non | Fumeur |
| available_from | date | Non | Disponible à partir de |
| available_until | date | Non | Disponible jusqu'à |
| deposit | int | Non | Dépôt de garantie |
| utilities_included | bool | Non | Charges comprises |
| status | enum | Auto | draft, published, unavailable, exchanged |
| owner_id | uuid FK | Auto | Propriétaire |

### 6.4 Swipe & Matching (🔒 compte requis)

#### Deck

- Logements filtrés selon les préférences (si renseignées) ou par proximité géographique
- Carte : photo, titre, localisation, loyer, score de compatibilité, infos propriétaire

#### Actions

| Action | Geste | Bouton | Effet |
|---|---|---|---|
| Passer | Swipe gauche | ✕ | Masqué |
| Aimer | Swipe droite | ❤️ | Intérêt enregistré |
| Détail | Tap | ℹ️ | Page détail |
| Super Like | — | ⭐ | Prioritaire (1 SwitchPass) |
| Annuler | — | ↩️ | Revenir |

#### Algorithme de compatibilité (v1)

Score sur 100 :

| Critère | Poids |
|---|---|
| Budget compatible | 30 |
| Localisation souhaitée | 25 |
| Surface | 15 |
| Type de bien | 10 |
| Disponibilité | 10 |
| Vérifications propriétaire | 10 |

#### Logique de match

**Entre deux locataires :**
```
A swipe droite sur logement de B
+ B swipe droite sur logement de A
= MATCH → Conversation auto + Notification
```

**Via SwitchPass (acheteur ou échange non réciproque) :**
```
A utilise 1 SwitchPass sur logement de B
→ Demande envoyée à B
→ B accepte → Conversation créée
→ B refuse → SwitchPass remboursé
```

### 6.5 SwitchPass (monétisation)

#### Concept

Le SwitchPass permet d'accéder à un logement sans échange réciproque.

#### Obtention

| Méthode | Détail |
|---|---|
| Céder son logement | Libérer son logement → 1 SwitchPass reçu |
| Achat | In-app (~50-100€ par pass) |
| Parrainage | Ami inscrit + logement publié → 1 offert |
| Premier logement | Publication du 1er logement → 1 offert |

### 6.6 Messagerie (🔒 compte requis)

- Liste de conversations triées par activité récente
- Chat : bulles, timestamps, envoi texte
- En-tête : avatar + nom + lien profil + lien logement

### 6.7 Recherche & Filtres (accessible sans compte)

#### Recherche
- Textuelle (ville, quartier)
- Historique (si connecté, max 10)
- Suggestions auto

#### Filtres

| Filtre | Type |
|---|---|
| Loyer | Range slider |
| Localisation | Multi-select |
| Type de bien | Multi-select |
| Surface min | Slider |
| Meublé | Toggle |
| Animaux | Toggle |

#### Vues
- Liste (cards scrollables)
- Carte (markers cliquables)

### 6.8 Favoris (🔒 compte requis)

- Ajout/suppression en 1 tap
- Liste accessible depuis le profil

### 6.9 Notifications (🔒)

| Type | Déclencheur |
|---|---|
| Nouveau match | Swipe mutuel |
| Nouveau message | Message reçu |
| Logement liké | Quelqu'un aime votre annonce |
| SwitchPass reçu | Gain de pass |

### 6.10 Administration

- Dashboard : users, logements, matchs, SwitchPass
- Gestion users : liste, détail, vérifier/suspendre
- Gestion logements : modération, signalements

---

## 7. Modèle de données

### Vue d'ensemble

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   AuthUser   │────→│  UserProfile │────→│   Property   │
│  (auth.users)│     │(user_profiles)│     │ (properties) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                     ┌──────┴──────┐       ┌──────┴──────┐
                     │ UserSwitch  │       │   Swipe     │
                     │    Pass     │       │  (swipes)   │
                     └─────────────┘       └──────┬──────┘
                                                  │
                                           ┌──────┴──────┐
                                           │   Match     │
                                           │  (matches)  │
                                           └──────┬──────┘
                                                  │
                                           ┌──────┴──────┐
                                           │ Conversation│
                                           └──────┬──────┘
                                                  │
                                           ┌──────┴──────┐
                                           │  Message    │
                                           └─────────────┘
```

### Nettoyage du schéma existant

Le schéma Prisma actuel contient de la redondance et des champs inutiles issus de l'ancienne conception. Voici ce qu'il faut nettoyer :

#### `AuthUser` (auth.users) — NE PAS TOUCHER
Table Supabase sacrée avec les vrais utilisateurs. On garde tel quel.

#### `User` (public.users) — À ÉVALUER
Contient des doublons avec `UserProfile` (first_name, last_name, email, bio, avatar_url...). Probablement un vestige. Si des vrais users y ont des données, il faut migrer vers `UserProfile` et voir si on peut consolider.

#### `UserProfile` (user_profiles) — SIMPLIFIER

Champs à garder :
- id, user_id, email, first_name, last_name, avatar_url, city, country
- phone, bio, profession, date_of_birth
- verified, last_seen_at, created_at, updated_at

Champs à ajouter :
- `user_type` (enum: 'tenant' | 'buyer') — locataire ou acheteur
- `full_name` (calculé ou saisi)

Champs à retirer (peuvent vivre dans les préférences de recherche si besoin, ou dans Property) :
- budget_min, budget_max (→ préférences de recherche séparées ou filtres)
- preferred_property_types, preferred_amenities (→ préférences)
- surface_min, preferred_district, preferred_neighborhood (→ préférences)
- birthdate (doublon avec date_of_birth)
- languages (inutilisé)
- age (calculé, pas stocké)

#### `Property` (properties) — SIMPLIFIER

Champs à garder (core) :
- id, owner_id, title, description, property_type
- city, district, postal_code, address, country, latitude, longitude
- surface_area, rooms, bedrooms, bathrooms
- monthly_rent, deposit, utilities_included
- furnished, smoking_allowed, pets_allowed
- photos, cover_image (ou cover_path)
- available_from, available_until
- status, published, created_at, updated_at
- amenities

Champs à retirer :
- max_occupants (pas pertinent pour échange)
- minimum_stay, maximum_stay (pas pertinent — c'est un échange permanent)
- instant_booking (concept Airbnb, pas applicable)
- roommates, max_roommates (simplifier — juste une info dans la description)
- compatibility_score (calculé côté serveur, pas stocké sur la property)
- tags (peut être généré côté frontend, pas en BDD)
- neighborhood (inutilisé)
- is_available (doublon avec status)
- occupancy_status (simplifier — info dans description ou profil)
- lease_type (simplifier — info dans description)
- exchange_authorization_status (simplifier)
- equipment (doublon avec amenities, JSON vs array)
- photo_paths (doublon avec photos)
- cover_path (doublon avec cover_image)

#### `UserSwitchPass` — GARDER
Simplement le solde de SwitchPass par user. OK.

#### `Notification` — GARDER
Structure correcte.

### Tables à ajouter

#### `swipes`
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| swiper_id | uuid FK | L'utilisateur qui swipe |
| swiped_property_id | uuid FK | Le logement swipé |
| direction | enum | left, right, super_like |
| created_at | timestamptz | |

#### `matches`
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| user1_id | uuid FK | Premier utilisateur |
| user2_id | uuid FK | Deuxième utilisateur |
| property1_id | uuid FK | Logement du user 1 (null si acheteur) |
| property2_id | uuid FK | Logement du user 2 |
| compatibility_score | int | Score calculé |
| status | enum | pending, matched, in_discussion, confirmed, cancelled, completed |
| type | enum | exchange (direct) ou switchpass (via pass) |
| created_at | timestamptz | |

#### `conversations`
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| match_id | uuid FK | Match associé (nullable pour conversations libres futures) |
| user1_id | uuid FK | Participant 1 |
| user2_id | uuid FK | Participant 2 |
| last_message_at | timestamptz | Pour le tri |
| created_at | timestamptz | |

#### `messages`
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| conversation_id | uuid FK | |
| sender_id | uuid FK | |
| content | text | |
| is_read | bool | |
| created_at | timestamptz | |

#### `favorites`
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| property_id | uuid FK | |
| created_at | timestamptz | |
| UNIQUE(user_id, property_id) | | |

#### `search_preferences` (optionnel, P1)
| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK UNIQUE | |
| preferred_cities | string[] | Villes souhaitées |
| budget_min | int | |
| budget_max | int | |
| surface_min | int | |
| preferred_types | string[] | Types de bien |
| updated_at | timestamptz | |

---

## 8. Architecture technique

### Stack

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 + React 19 + TailwindCSS 4 + TanStack Query (React Query) + Zustand |
| Backend | Express.js + TypeScript + Prisma + PostgreSQL |
| Worker | BullMQ (jobs asynchrones) |
| Shared | Package partagé (DTOs, enums, validators, constants) |
| Base de données | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| Stockage | S3 / MinIO |
| Auth | JWT (bcrypt, migration Supabase) |
| Dev | Docker Compose |

### Architecture backend

```
Routes → Controllers → Services → Repositories → Prisma → PostgreSQL
```

### API

- Préfixe : `/api/v1/`
- Réponse : `{ data: T }` / `{ error: { code, message } }`
- Validation : Zod
- Auth : JWT Bearer (optionnel sur routes publiques)

### Routes publiques vs protégées

| Route | Auth requise | Description |
|---|---|---|
| GET /properties | Non | Liste/recherche de logements |
| GET /properties/:id | Non | Détail logement |
| GET /users/:id/public | Non | Profil public |
| POST /auth/register | Non | Inscription |
| POST /auth/login | Non | Connexion |
| POST /swipes | Oui | Enregistrer un swipe |
| GET /matches | Oui | Mes matchs |
| GET /conversations | Oui | Mes conversations |
| POST /messages | Oui | Envoyer un message |
| POST /properties | Oui | Créer un logement |
| PUT /users/me | Oui | Modifier mon profil |
| POST /favorites | Oui | Ajouter un favori |

### Modules backend

| Module | Priorité |
|---|---|
| auth (register, login, me, refresh) | P0 (partiellement fait) |
| properties (CRUD, search, photos) | P0 |
| users (profil, update, avatar) | P0 |
| swipes (create, undo) | P0 |
| matches (list, get, update) | P0 |
| conversations (list, get) | P0 |
| messages (list, send) | P0 |
| favorites (list, add, remove) | P0 |
| switchpass (balance, purchase, use) | P1 |
| notifications (list, mark read) | P1 |
| admin (dashboard, moderation) | P1 |

---

## 9. Roadmap & Priorités

### SPRINT 1 — MVP complet + PWA (6-7 jours) — Mars/Avril 2026

**Objectif :** App complète, fonctionnelle, déployée en PWA. Zéro mock data.

#### Jour 1-2 : Fondations

**Backend (Abderrazaq) :**
- [ ] Nettoyage schéma Prisma + migrations
- [ ] Auth complète (register, login, refresh, me) — ajout `user_type`
- [ ] CRUD profil utilisateur (progressif)
- [ ] CRUD logement (create, read, update, delete, list, search)
- [ ] Upload photos (S3/MinIO)

**Frontend (Steven) :**
- [ ] Explorer = page d'accueil (recherche + liste logements, connectée à l'API)
- [ ] Page détail logement (publique, connectée à l'API)
- [ ] Modale inscription/connexion contextuelle
- [ ] Bottom nav (4 onglets : Explorer, Switch, Messages, Profil) + routing
- [ ] Mode clair / sombre

#### Jour 3-4 : Core features

**Backend :**
- [ ] Swipes API (create, undo)
- [ ] Logique match mutuel (swipe droite réciproque = match)
- [ ] Score de compatibilité v1
- [ ] Conversations + Messages API
- [ ] Favoris API

**Frontend :**
- [ ] Swipe deck (connecté à l'API réelle)
- [ ] Animation match
- [ ] Messagerie (conversations + chat)
- [ ] Favoris
- [ ] Profil utilisateur (self + other, public)
- [ ] Publication logement (formulaire simplifié)

#### Jour 5-6 : SwitchPass + Polish

**Backend :**
- [ ] SwitchPass (solde, achat, utilisation, super like)
- [ ] Notifications (in-app)
- [ ] Admin API (dashboard, users, properties)
- [ ] Recherche avancée + filtres

**Frontend :**
- [ ] SwitchPass UI (solde, achat, utilisation sur détail)
- [ ] Filtres avancés
- [ ] Explorer (liste + carte)
- [ ] Notifications
- [ ] Admin dashboard

#### Jour 7 : PWA + Déploiement

- [ ] PWA manifest + service worker + icônes
- [ ] Offline support basique
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway ou Fly.io)
- [ ] Base de données managée (Supabase Postgres ou Neon)
- [ ] Tests end-to-end manuels
- [ ] Fix bugs critiques

### PHASE 2 — React Native (après PWA stable)

**Objectif :** Porter l'app en natif avec React Native / Expo.

- [ ] Setup Expo + shared components
- [ ] Navigation native (React Navigation)
- [ ] Push notifications (Firebase/APNs)
- [ ] Geste swipe natif
- [ ] Camera pour upload photos
- [ ] App Store + Play Store

### PHASE 3 — Croissance

- [ ] Système d'avis / notes
- [ ] Social login (Google, Apple)
- [ ] Vérification téléphone (OTP)
- [ ] KYC (identité)
- [ ] Chat amélioré (photos, documents, typing)
- [ ] Parrainage
- [ ] Extension géographique
- [ ] Signature électronique

---

## 10. Métriques de succès

### KPIs produit

| Métrique | Phase 1 | 6 mois |
|---|---|---|
| Visiteurs uniques | 2 000 | 20 000 |
| Inscriptions | 500 | 5 000 |
| Logements publiés | 200 | 2 000 |
| Matchs | 50 | 500 |
| Échanges réalisés | 5 | 50 |
| Conversion visite → inscription | > 25% | > 30% |
| Conversion inscription → logement | > 40% | > 50% |

### KPIs techniques

| Métrique | Objectif |
|---|---|
| LCP | < 2.5s |
| Disponibilité | > 99.5% |
| API p95 | < 500ms |
| Taux d'erreur | < 1% |

---

## Annexe — État actuel & Nettoyage requis

### Ce qui existe et qu'on garde

- `auth.users` — vrais utilisateurs Supabase, sacré
- `user_profiles` — avec les données des utilisateurs existants
- `properties` — logements déjà publiés par des vrais users
- Auth backend (register, login, me)
- Frontend routing (pages de base)
- Docker Compose fonctionnel

### Ce qui doit être nettoyé

- Schéma Prisma : retirer les champs redondants (voir section 7)
- Table `public.users` : évaluer si elle contient des données réelles, sinon consolider avec `user_profiles`
- `UserProfile` : ajouter `user_type` (tenant/buyer)
- `Property` : retirer les champs Airbnb non pertinents (instant_booking, min/max stay, roommates...)
- Admin frontend : corriger les appels API (`/admin/stats` → `/admin/dashboard`)
- Ports Docker : corrigé (frontend écoute sur FRONTEND_PORT, API URL alignée)

### Ce qu'il ne faut PAS faire

- Ne pas supprimer les vrais utilisateurs dans `auth.users`
- Ne pas supprimer les données de profil des utilisateurs existants
- Ne pas supprimer les logements déjà publiés
- Ne pas se baser sur l'ancienne version (code caduc)
