# 🏗️ Picky Eaters — Architecture Document

> Version 1.0 | Stack: React + Node/Express + Supabase + Claude API

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│   React Web (Vite)          React Native (Phase 2)          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────────────┐
│                   NODE.JS + EXPRESS API                      │
│   Routes → Controllers → Services → Middleware              │
└──────┬───────────────┬──────────────┬───────────────────────┘
       │               │              │
┌──────▼──────┐ ┌──────▼──────┐ ┌────▼────────────────────┐
│  SUPABASE   │ │ CLAUDE API  │ │   GOOGLE APIS           │
│  PostgreSQL │ │ (Anthropic) │ │   Maps + Places         │
│  Auth       │ │ Vision+Text │ │                         │
│  Storage    │ └─────────────┘ └─────────────────────────┘
└─────────────┘
```

---

## 2. Database Schema (PostgreSQL / Supabase)

### 2.1 Core Tables

```sql
-- USERS
create table users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  username      text unique not null,
  display_name  text not null,
  bio           text,
  avatar_url    text,
  share_token   text unique default gen_random_uuid()::text,
  is_public     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- FOOD ITEMS (master library)
create table foods (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  name_es     text,                          -- Spanish name
  emoji       text,                          -- Noto emoji character
  category    text not null,                 -- 'protein','vegetable','fruit','dairy','seafood','spice','carb','other'
  tags        text[],                        -- ['gluten-free','vegan','common-allergen'...]
  created_at  timestamptz default now()
);

-- USER FOOD PREFERENCES (the core list)
create table user_food_preferences (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  food_id     uuid references foods(id) on delete cascade,
  rating      text not null check (rating in ('love','like','neutral','dislike','hate','allergy')),
  intensity   int check (intensity between 1 and 5) default 3,
  notes       text,
  is_public   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, food_id)
);

-- FOLLOWS (social graph)
create table follows (
  follower_id  uuid references users(id) on delete cascade,
  following_id uuid references users(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);

-- MEAL EVENTS (invitations)
create table meal_events (
  id           uuid primary key default gen_random_uuid(),
  host_id      uuid references users(id) on delete cascade,
  title        text not null,
  meal_type    text not null check (meal_type in ('breakfast','brunch','lunch','snack','dinner','picnic','bbq','other')),
  description  text,
  scheduled_at timestamptz,
  location     text,
  lat          decimal(9,6),
  lng          decimal(9,6),
  status       text default 'open' check (status in ('open','confirmed','cancelled','completed')),
  created_at   timestamptz default now()
);

-- MEAL INVITATIONS
create table meal_invitations (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid references meal_events(id) on delete cascade,
  invitee_id    uuid references users(id) on delete cascade,
  status        text default 'pending' check (status in ('pending','accepted','declined')),
  responded_at  timestamptz,
  created_at    timestamptz default now(),
  unique(event_id, invitee_id)
);

-- MEAL GROUPS (auto-created when invitations accepted)
create table meal_groups (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references meal_events(id) on delete cascade unique,
  created_at  timestamptz default now()
);

create table meal_group_members (
  group_id    uuid references meal_groups(id) on delete cascade,
  user_id     uuid references users(id) on delete cascade,
  role        text default 'member' check (role in ('host','member')),
  joined_at   timestamptz default now(),
  primary key (group_id, user_id)
);

-- SOCIAL POSTS (max 5/week per user)
create table posts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  food_id         uuid references foods(id),          -- optional linked food
  restaurant_id   uuid references restaurants(id),    -- optional linked restaurant
  image_url       text,
  caption         text,
  rating          text check (rating in ('love','like','neutral','dislike','hate')),
  is_public       boolean default true,
  week_number     int,                                 -- for weekly post limit
  year_number     int,
  created_at      timestamptz default now()
);

-- POST REACTIONS
create table post_reactions (
  post_id     uuid references posts(id) on delete cascade,
  user_id     uuid references users(id) on delete cascade,
  emoji       text not null,
  created_at  timestamptz default now(),
  primary key (post_id, user_id)
);

-- RESTAURANTS (cached from Google Places)
create table restaurants (
  id                  uuid primary key default gen_random_uuid(),
  google_place_id     text unique not null,
  name                text not null,
  address             text,
  lat                 decimal(9,6),
  lng                 decimal(9,6),
  cuisine_types       text[],
  price_level         int check (price_level between 1 and 4),
  rating              decimal(2,1),
  website             text,
  phone               text,
  cached_at           timestamptz default now()
);

-- GAMIFICATION
create table user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  achievement_key text not null,              -- 'first_food','explorer_5','host_10'...
  achieved_at     timestamptz default now(),
  unique(user_id, achievement_key)
);

create table weekly_challenges (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  week_number     int not null,
  year_number     int not null,
  foods_added     int default 0,              -- target: 3-4
  meals_attended  int default 0,              -- target: 1
  posts_shared    int default 0,              -- max: 5
  challenge_done  boolean default false,
  unique(user_id, week_number, year_number)
);

-- NOTIFICATIONS
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  type        text not null,                  -- 'invite','follow','reaction','challenge','suggestion'
  title       text not null,
  body        text,
  data        jsonb,                          -- extra payload (event_id, post_id, etc.)
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- AI ANALYSIS CACHE (avoid repeated API calls)
create table ai_analysis_cache (
  id            uuid primary key default gen_random_uuid(),
  cache_key     text unique not null,         -- hash of group_id + recipe
  analysis      jsonb not null,
  expires_at    timestamptz,
  created_at    timestamptz default now()
);
```

---

## 3. API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Users & Profiles
```
GET    /api/users/:username              → Public profile
GET    /api/users/:username/preferences → Food list (public)
PUT    /api/users/me                    → Update own profile
GET    /api/users/me/feed               → Social activity feed
GET    /api/users/me/notifications      → Notifications
PATCH  /api/users/me/notifications/:id  → Mark read
```

### Food Preferences
```
GET    /api/preferences                 → Get own full list
POST   /api/preferences                 → Add food to list
PUT    /api/preferences/:id             → Update rating/notes
DELETE /api/preferences/:id             → Remove from list
GET    /api/foods/library               → Browse food library (search, filter)
POST   /api/foods/scan                  → Photo → AI ingredient extraction
```

### Social
```
POST   /api/follows/:userId             → Follow user
DELETE /api/follows/:userId             → Unfollow user
GET    /api/follows/following           → Who I follow
GET    /api/follows/followers           → Who follows me

GET    /api/posts                       → Feed posts
POST   /api/posts                       → Create post (max 5/week)
DELETE /api/posts/:id                   → Delete own post
POST   /api/posts/:id/react             → React with emoji
DELETE /api/posts/:id/react             → Remove reaction
```

### Meal Events & Groups
```
POST   /api/events                      → Create meal event
GET    /api/events/:id                  → Event detail
PATCH  /api/events/:id                  → Update event (host only)
DELETE /api/events/:id                  → Cancel event (host only)

POST   /api/events/:id/invite           → Invite users
PATCH  /api/invitations/:id             → Accept/decline invite

GET    /api/groups/:id                  → Group detail + members
GET    /api/groups/:id/compatibility    → AI recipe compatibility check
POST   /api/groups/:id/analyze-recipe   → Analyze specific recipe
GET    /api/groups/:id/restaurants      → AI restaurant suggestions
```

### AI Features
```
POST   /api/ai/scan-photo               → Extract ingredients from image
POST   /api/ai/check-recipe             → Recipe vs group preferences
GET    /api/ai/suggest-restaurants      → Restaurants near location for group
GET    /api/ai/suggestions              → Personal food/recipe suggestions
```

### Gamification
```
GET    /api/gamification/profile        → Badges, streak, taste profile
GET    /api/gamification/weekly         → This week's challenge progress
GET    /api/gamification/achievements   → All earned badges
```

---

## 4. Project File Structure

```
picky-eaters/
│
├── client/                          # React + Vite (web)
│   ├── public/
│   │   └── fonts/
│   ├── src/
│   │   ├── assets/                  # Images, static files
│   │   ├── components/
│   │   │   ├── ui/                  # Base components (Button, Input, Card, Badge...)
│   │   │   ├── food/                # FoodCard, FoodRatingPicker, FoodList...
│   │   │   ├── social/              # PostCard, FeedItem, UserAvatar, FollowButton...
│   │   │   ├── groups/              # GroupCard, CompatibilityMeter, RestaurantCard...
│   │   │   ├── gamification/        # BadgeCard, StreakCounter, WeeklyChallenge...
│   │   │   └── layout/              # AppShell, Header, BottomNav, PageWrapper...
│   │   ├── pages/
│   │   │   ├── Auth/                # Login, Register, ForgotPassword
│   │   │   ├── Home/                # Feed + suggestions
│   │   │   ├── MyList/              # Food preference list management
│   │   │   ├── Scan/                # Photo scan → ingredient AI
│   │   │   ├── Profile/             # Own profile + public profile view
│   │   │   ├── Social/              # Explore, search users
│   │   │   ├── Events/              # Meal event creation + management
│   │   │   ├── Group/               # Group detail, AI recipe checker, restaurants
│   │   │   ├── Gamification/        # Badges, challenges, taste profile
│   │   │   └── Settings/
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFoodList.js
│   │   │   ├── useSocial.js
│   │   │   ├── useGroup.js
│   │   │   └── useGamification.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance + interceptors
│   │   │   ├── auth.service.js
│   │   │   ├── food.service.js
│   │   │   ├── social.service.js
│   │   │   ├── events.service.js
│   │   │   └── ai.service.js
│   │   ├── tokens/
│   │   │   ├── tokens.js            # JS design tokens
│   │   │   └── tokens.css           # CSS custom properties
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── preferences.routes.js
│   │   │   ├── social.routes.js
│   │   │   ├── events.routes.js
│   │   │   ├── groups.routes.js
│   │   │   ├── ai.routes.js
│   │   │   └── gamification.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── preferences.controller.js
│   │   │   ├── social.controller.js
│   │   │   ├── events.controller.js
│   │   │   ├── groups.controller.js
│   │   │   ├── ai.controller.js
│   │   │   └── gamification.controller.js
│   │   ├── services/
│   │   │   ├── supabase.service.js      # Supabase client + helpers
│   │   │   ├── claude.service.js        # Claude API integration
│   │   │   ├── places.service.js        # Google Places API
│   │   │   ├── notifications.service.js
│   │   │   └── gamification.service.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js       # Verify Supabase JWT
│   │   │   ├── validate.middleware.js   # Request validation
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── error.middleware.js
│   │   └── utils/
│   │       ├── prompts.js               # Claude prompt templates
│   │       ├── cache.js
│   │       └── helpers.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── shared/
│   ├── constants.js                 # Shared enums (ratings, meal types, categories)
│   └── types.js                     # JSDoc type definitions
│
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md              # This file
    ├── tokens.js
    ├── tokens.css
    └── CLAUDE_CODE_PROMPT.md
```

---

## 5. Claude AI Integration

### 5.1 Photo Scan → Ingredient Extraction

```javascript
// server/utils/prompts.js

export const SCAN_PHOTO_PROMPT = `
You are a food expert analyzing an image. The image may show a dish, a restaurant menu, or a recipe.

Extract ALL individual food ingredients and items you can identify.

Return ONLY a JSON array with this exact format:
[
  { "name": "tomato", "emoji": "🍅", "category": "vegetable", "confidence": 0.95 },
  { "name": "mozzarella", "emoji": "🧀", "category": "dairy", "confidence": 0.90 }
]

Rules:
- Extract individual ingredients, not dish names (e.g. "egg", "flour", "sugar" — not "cake")
- Use simple, common names
- Categories: protein, vegetable, fruit, dairy, seafood, spice, carb, other
- confidence: 0.0 to 1.0
- Return minimum 1, maximum 30 items
- Return ONLY the JSON array, no other text
`;

export const RECIPE_COMPATIBILITY_PROMPT = (recipe, memberPreferences) => `
You are a food compatibility expert for a dinner group.

RECIPE INGREDIENTS:
${JSON.stringify(recipe.ingredients)}

GROUP MEMBERS AND THEIR FOOD PREFERENCES:
${JSON.stringify(memberPreferences)}

Analyze whether this recipe works for the entire group.

Return ONLY this JSON format:
{
  "overall": "good" | "warning" | "bad",
  "score": 0-100,
  "summary": "brief human-readable summary",
  "conflicts": [
    {
      "member": "username",
      "ingredient": "ingredient name",
      "rating": "hate" | "dislike" | "allergy",
      "severity": "critical" | "moderate"
    }
  ],
  "substitutions": [
    {
      "original": "ingredient to replace",
      "suggestion": "replacement ingredient",
      "reason": "why this works"
    }
  ],
  "alternatives": [
    {
      "name": "Alternative recipe name",
      "description": "brief description",
      "why": "why this works better for the group"
    }
  ]
}
`;

export const RESTAURANT_SCORE_PROMPT = (restaurant, groupPreferences) => `
You are a restaurant recommendation expert.

RESTAURANT: ${restaurant.name}
CUISINE TYPES: ${restaurant.cuisine_types.join(', ')}
MENU ITEMS (sample): ${JSON.stringify(restaurant.menuSample)}

GROUP FOOD PREFERENCES:
${JSON.stringify(groupPreferences)}

Score this restaurant for this specific group.

Return ONLY this JSON:
{
  "score": 0-100,
  "summary": "1-2 sentence explanation",
  "highlights": ["why member X would like it", "great option for Y dietary needs"],
  "concerns": ["Z might have limited options"]
}
`;

export const PERSONAL_SUGGESTIONS_PROMPT = (userPreferences) => `
Based on these food preferences, suggest 5 foods the user has NOT yet rated that they would likely enjoy.

USER'S CURRENT PREFERENCES (loves and likes):
${JSON.stringify(userPreferences.positive)}

USER DISLIKES/HATES:
${JSON.stringify(userPreferences.negative)}

Return ONLY this JSON array:
[
  {
    "food": "food name",
    "emoji": "🥭",
    "category": "fruit",
    "reason": "You love tropical fruits like pineapple, mango has a similar sweetness"
  }
]
`;
```

### 5.2 Claude Service

```javascript
// server/services/claude.service.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function scanFoodPhoto(imageBase64, mimeType) {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
        { type: 'text', text: SCAN_PHOTO_PROMPT }
      ]
    }]
  });
  return JSON.parse(response.content[0].text);
}

export async function checkRecipeCompatibility(recipe, memberPreferences) {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: RECIPE_COMPATIBILITY_PROMPT(recipe, memberPreferences)
    }]
  });
  return JSON.parse(response.content[0].text);
}
```

---

## 6. Key Business Rules

### Food Posts (Social)
- Maximum **5 posts per user per week** (tracked via `week_number` + `year_number`)
- Posts can optionally tag a restaurant and a food item
- Restaurant pages aggregate all public posts tagged to them

### Meal Groups
- A group is auto-created when at least 2 people (host + 1 accepted invite) confirm attendance
- Host can still invite more people after group creation
- AI analysis is cached for 24 hours per unique group + recipe combination

### Gamification — Weekly Challenge
- **3–4 new foods added** to your list this week → ✅ Food Explorer
- **1 meal event hosted or attended** → ✅ Social Eater
- **Posts shared** (up to 5) → tracked but not required for challenge completion
- Completing both = weekly badge + XP points

### Share Token
- Each user gets a unique `share_token` at registration
- Public profile URL: `picky.app/@username` OR `picky.app/share/{share_token}`
- Token can be regenerated (invalidates old link)

---

## 7. Security

- All API routes protected by Supabase JWT middleware (except public profile GET)
- Row Level Security (RLS) enabled in Supabase for all tables
- Rate limiting: 100 req/min per IP, 20 AI requests/hour per user
- Image uploads: validated type (jpg/png/webp), max 5MB, stored in Supabase Storage
- AI responses always parsed and validated before returning to client
- Google Places API calls cached in DB for 7 days to reduce costs

---

## 8. Development Phases

| Phase | Features | Weeks |
|---|---|---|
| 1 — Foundation | Auth, profile, food list, food library | 1–4 |
| 2 — Social | Follow, feed, posts, invitations, groups | 5–8 |
| 3 — AI | Photo scan, recipe checker, restaurant finder, suggestions | 9–12 |
| 4 — Gamification | Challenges, badges, taste profile, polish | 13–16 |
| 5 — Mobile | React Native iOS + Android | Post-launch |
