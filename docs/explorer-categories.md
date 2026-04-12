# Explorer — Category Redesign (Implemented)

## Summary

The Explorer page no longer shows a flat "All properties" list. Instead, it displays **categorized horizontal sections** with max 9 properties per section and a "See all" button on overflow.

## Implemented Categories

### A. Universal (all users)

| # | Category | Slug | Backend logic |
|---|----------|------|---------------|
| 1 | **Top picks** | `favorites` | `COUNT(favorites)` per property, ordered by most saved |
| 2 | **New listings** | `newest` | Published in last 30 days (fallback: latest 9 overall) |
| 3 | **Budget-friendly** | `budget-friendly` | `monthly_rent ≤ 700€`, ordered cheapest first |
| 4 | **Furnished & ready** | `furnished` | `furnished = true AND is_available = true` |
| 5 | **Large spaces** | `large-spaces` | `surface_area ≥ 50m²`, ordered largest first |
| 6 | **Pet-friendly** | `pet-friendly` | `pets_allowed = true` |
| 7 | **In {City}** _(dynamic)_ | `city-{name}` | Top 3 cities by property count |

### B. Personalized (logged-in user with preferences)

| # | Category | Slug | Source |
|---|----------|------|--------|
| 8 | **For you** | `for-you` | Matches city + budget + type + surface prefs |
| 9 | **In your budget** | `in-budget` | `budget_min ≤ rent ≤ budget_max` |
| 10 | **Your type** | `your-type` | `preferred_property_types` |
| 11 | **Near you** | `near-you` | Same city as user |

## API

```
GET /api/v1/properties/feed
```

- **Auth**: optional (Bearer token). Logged-in users get personalized categories (B).
- **Response**: `{ data: { categories: FeedCategory[] } }`
- Each category: `{ slug, title_key, properties[], total, personalized, city? }`
- Empty categories are filtered out.
- Universal categories load in parallel for performance.

## Frontend

- `useFeed()` hook → TanStack Query (`staleTime: 60s`)
- Each category renders as `<FeedSection>` inside `<HorizontalSection>`
- Promo banners interleaved every 3 sections
- `PropertyListingCard` (compact variant) reused everywhere (explorer, favorites, swipe)
- "See all" button routes to `/explorer?{filter}` with appropriate query params

## SEO

- `layout.tsx` generates `title`, `meta description`, `canonical`, Open Graph, Twitter cards
- FR: "Explorer les appartements à échanger | SwitchAppart"
- EN: "Explore apartments to exchange | SwitchAppart"

## i18n

All category labels in `frontend/messages/{en,fr}.json` under `explorer.*` namespace:
`topPicks`, `newest`, `budgetFriendly`, `furnishedReady`, `largeSpaces`, `petFriendly`, `inCity`, `forYou`, `inBudget`, `yourType`, `nearYou`, `seeAll`.
