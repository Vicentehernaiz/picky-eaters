# 🥑 Picky Eaters

> *Know what everyone loves. Cook and eat together — happily.*

Picky Eaters is a social food preferences app where users build their personal list of foods they love and hate, share it with friends, and use AI to plan meals and find restaurants that make everyone happy.

---

## 🌟 What is Picky Eaters?

Ever invited friends to dinner only to discover halfway through cooking that someone hates cilantro, is allergic to shellfish, or refuses anything spicy? Picky Eaters solves this — before it becomes a problem.

Each user (the **Picky Eater**) builds their own food profile: a living list of what they like, dislike, love, or are allergic to. When planning a meal together, the app's AI crosses everyone's lists and tells you what works, what doesn't, and what to cook instead.

---

## ✨ Core Features

### 🥗 My Food List
- Add foods with ratings: ✅ Love / 👍 Like / 😐 Neutral / 👎 Dislike / ❌ Hate / ⚠️ Allergy
- Intensity scale 1–5 per food item
- Personal notes per item (e.g. *"only if well cooked"*)
- Organized by category: Proteins, Vegetables, Fruits, Dairy, Seafood, Spices, Carbs…
- Quick-add from a library of 500+ common foods
- **Photo scan**: take a photo of a dish, menu, or recipe — AI extracts ingredients and you rate them instantly

### 📤 Share Your List
- Public profile page: `picky.app/@username`
- Shareable link + auto-generated QR code
- Downloadable food card (image with your top likes/dislikes)

### 👥 Social Feed
- Follow friends and see their food updates
- Activity feed: *"Ana just added that she hates cilantro 😅"*
- Share interesting dishes you've tried (max 5 posts/week)
- React to friends' preferences with emoji responses
- Food posts show dish name + restaurant/recipe (optional)
- Restaurant pages aggregate community food posts

### 🍽️ Meal Invitations & Groups
- Create meal events: Breakfast, Brunch, Lunch, Dinner, Picnic, BBQ…
- Invite people from your network
- One-tap accept/decline
- Accepted invites auto-create a **Meal Group**

### 🤖 AI-Powered Group Features
**Recipe Compatibility Check**
- Enter or select a recipe → AI cross-references all members' lists
- Traffic light compatibility: 🟢 All good / 🟡 Minor conflict / 🔴 Problem
- Shows exactly who has an issue with what ingredient
- Suggests ingredient substitutions or full alternative recipes

**Restaurant Finder**
- Finds nearby restaurants using geolocation
- AI analyzes menus against the group's collective preferences
- Group compatibility score per restaurant
- Filters by distance, price, cuisine type, rating

### 🎮 Gamification
- **Weekly Food Challenge**: add 3–4 new foods per week (try something new!)
- **Meal Streak**: host or attend a group meal every week
- **Explorer Badges**: try 5 new cuisines, add 50 foods, host 10 meals…
- **Taste Profile**: evolving visual of your food personality
- Weekly summary of community food activity

### 💡 Personalized Suggestions
- Recipe suggestions based on your food list
- New food discoveries tailored to your taste profile
- "You might like this" based on what similar users enjoy

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Web) | React 18 + Vite |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| AI | Claude API (Anthropic) — vision + text |
| Maps & Places | Google Maps API + Google Places API |
| Mobile (Phase 2) | React Native |

---

## 🎨 Design System

**Color Palette**
| Token | Value | Usage |
|---|---|---|
| `bg-main` | `#FAF9F6` | App background |
| `bg-white` | `#FFFFFF` | Cards, modals |
| `bg-contrast` | `#ECEAE4` | Input fields, dividers |
| `accent-orange` | `#FE8F20` | Titles, primary CTA |
| `accent-yellow` | `#FFD400` | Highlights, badges |
| `accent-yellow-2` | `#FFBB00` | Secondary highlights |
| `accent-green` | `#0D735A` | Success, love indicator |
| `accent-lime` | `#CCDD20` | Tags, gamification |
| `text-dark` | `#1A1A1A` | Card titles |
| `text-body` | `#636363` | Body text |
| `text-muted` | `#9B9B9B` | Captions, metadata |

**Typography**
| Level | Font | Size | Weight | Color |
|---|---|---|---|---|
| H1 Display | EB Garamond | 36px | 800 | `#FE8F20` |
| H2 Title | EB Garamond | 32px | 700 | `#FE8F20` |
| H3 Section | Work Sans | 20px | 700 | `#FE8F20` |
| H4 Card | Work Sans | 17px | 600 | `#1A1A1A` |
| Body L | Open Sans | 16px | 400 | `#636363` |
| Body M | Open Sans | 14px | 400 | `#636363` |
| Body S | Open Sans | 12px | 300 | `#636363` |
| Label/Tag | Work Sans | 11px | 600 uppercase | `#636363` |
| Button | Work Sans | 15px | 700 | `#FFFFFF` / `#1A1A1A` |
| Caption | Open Sans italic | 11px | 400 | `#9B9B9B` |

**Icons**
- UI & Navigation: [Phosphor Icons](https://phosphoricons.com/)
- Food & Ingredients: [Noto Emoji](https://fonts.google.com/noto/specimen/Noto+Emoji) (Google)

---

## 📁 Project Structure

```
picky-eaters/
├── client/                  # React web frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Auth, user context
│   │   ├── services/        # API calls
│   │   ├── tokens/          # Design tokens (colors, typography)
│   │   └── utils/           # Helpers
│   └── public/
├── server/                  # Node.js + Express backend
│   ├── routes/              # API route handlers
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, validation, error handling
│   ├── services/            # Supabase, Claude AI, Google APIs
│   └── utils/
├── shared/                  # Types and constants shared between client/server
└── docs/                    # Architecture docs, API reference
```

---

## 🗺️ Development Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Project setup, Supabase schema, auth flow
- [ ] User profile + food list (add, edit, delete, rate)
- [ ] Food library (500+ items) with categories
- [ ] Basic public profile page + shareable link

### Phase 2 — Social (Weeks 5–8)
- [ ] Follow/unfollow system + activity feed
- [ ] Social posts (share dishes, max 5/week)
- [ ] Meal invitations + group creation
- [ ] Notifications (push + in-app)

### Phase 3 — AI Features (Weeks 9–12)
- [ ] Photo scan → ingredient extraction (Claude Vision)
- [ ] Recipe compatibility checker (Claude API)
- [ ] Restaurant finder + AI compatibility scoring (Google Places + Claude)
- [ ] Personalized recipe and food suggestions

### Phase 4 — Gamification & Polish (Weeks 13–16)
- [ ] Weekly challenges + streaks
- [ ] Badges and achievements
- [ ] Taste profile visualization
- [ ] Performance optimization, accessibility, testing

### Phase 5 — Mobile (Post-launch)
- [ ] React Native app (iOS + Android)
- [ ] Shared backend, adapted UI

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourname/picky-eaters.git
cd picky-eaters

# Install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp server/.env.example server/.env
# → Add your Supabase URL, Supabase Anon Key, Claude API Key, Google Maps API Key

# Start development
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

---

## 🔑 Environment Variables

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Claude AI (Anthropic)
ANTHROPIC_API_KEY=your-claude-api-key

# Google APIs
GOOGLE_MAPS_API_KEY=your-maps-key
GOOGLE_PLACES_API_KEY=your-places-key

# Server
PORT=3001
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:5173
```

---

## 📄 License

MIT — built with ❤️ and strong food opinions.
