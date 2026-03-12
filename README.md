# SkinMatch

SkinMatch is a premium beauty ecommerce web app interface with ingredient-first discovery, personalized skincare journeys, and a modern minimal visual language.

## Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express + MongoDB (Mongoose)

## Folder Structure

```text
skinmatch/
  frontend/   # premium ecommerce UI
  backend/    # products/reviews/routines API
```

## Frontend Features

- Sticky luxury navigation with:
  - SkinMatch brand
  - Product search + smart suggestions
  - Categories dropdown
  - Ingredient search + suggestions
  - Wishlist, cart, and profile actions
- Homepage sections:
  - Hero banner
  - Personalized recommendations
  - Trending ingredients
  - Best sellers carousel
  - Skincare routines
  - Featured brands
  - New launches
  - Product discovery blocks
  - Beauty tips
- Category page:
  - Left filter sidebar (skin type, concern, ingredient include/exclude, price, brand, rating)
  - Responsive product grid cards
- Product page:
  - Image gallery with zoom
  - Rating, pricing, discount, add to cart, wishlist
  - Key and full ingredients
  - Skin compatibility tags
  - Routine suggestions
  - Review cards with skin-type filtering
  - Similar products
- Routine Builder page:
  - Morning and night flows
  - Step-wise product selection
- Ingredient Explorer page:
  - Ingredient cards and detail panel
  - Benefits and suitable skin types
  - Recommended products
- UX polish:
  - Premium product badges (best seller/new)
  - Better category sorting + mobile filter toggle
  - Cleaner product imagery using contain-fit cards and gallery

## Backend Features

- Curated mock catalog of 50 products across your requested Indian beauty brands (Maybelline, Lakme, Sugar Cosmetics, Mamaearth, WOW Skin Science, Minimalist, Plum, Dot & Key, Himalaya, Garnier)
- Category-matched product imagery and ingredient metadata for discovery/filtering
- External catalog override: if `backend/src/data/nykaaCatalog.json` has products, SkinMatch uses that dataset first (for exact packshots)

- Mongo models:
  - `Product`
  - `User`
  - `Review`
  - `Routine`
- APIs:
  - `GET /health`
  - `GET /api/products`
  - `GET /api/products/:productId`
  - `GET /api/products/discovery`
  - `GET /api/products/ingredients`
  - `GET /api/reviews`
  - `POST /api/reviews`
  - `GET /api/routines/:userId`
  - `POST /api/routines`
- Smart fallback to mock data if MongoDB is unavailable.

## Run Locally

### 1) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Import Exact Nykaa Packshots (CSV -> Catalog)

1. Copy template:

```bash
cp backend/data/nykaa-products.template.csv backend/data/nykaa-products.csv
```

2. Fill `backend/data/nykaa-products.csv` with your exact product rows and Nykaa packshot image URLs (`image_1`, `image_2`, `image_3`).
3. Generate catalog JSON:

```bash
cd backend
npm run import:catalog -- ./data/nykaa-products.csv ./src/data/nykaaCatalog.json
```

4. Restart backend. The app will now serve these exact products/images.

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Frontend now calls backend APIs directly (`/api/products`, `/api/reviews`, `/api/routines`) and falls back to local mock data only if backend is unreachable.
