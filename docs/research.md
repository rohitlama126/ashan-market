# Ashan Market — Competitive UX Research

_Date: 2026-10-27 · Sources: Daraz Nepal (daraz.com.np), 99 Ranch Market (99ranch.com)_

## Method

- **Tooling:** [REA](https://github.com/morluto/rea) `rea-agents` CLI (via `npx`, no agent config changes), `inspect-web-page` over Chrome DevTools Protocol against a disposable Chrome profile on a loopback port. Captures retain DOM/accessibility structure and link inventories; REA never retains raw bodies, cookies or storage values.
- **Scope (public pages only, 8 captures, sequential with pauses):**
  - Daraz: home, a grocery category listing (Canned Soup & Pasta), a product detail page (a flash-sale grocery item).
  - 99 Ranch: home, Shipping & Delivery, Weekly Ads (`/store-ads`), Store Locator (`/stores-search`), plus its public `sitemap.xml`.
- **robots.txt respected.** Not visited: Daraz `/checkout/`, `/cart/`, `/customer/`, `/catalog/` (search results), `/shop/*.htm`; 99 Ranch `/account-center/`, `/shopping-cart/`. Cart and checkout flows below are therefore described from public help/shipping pages and general knowledge of these platforms, **not** observed.
- **Nothing copied.** No source code, copy, images, logos or colors were taken. Only patterns and feature lists are recorded here; Ashan Market's equivalents are original.

### Limitations

- Network/API traffic was policy-filtered to the page origin and observed only after attach, so API shapes were not captured. That's fine: we're designing our own API.
- 99 Ranch hides its category tree and product grid until a store or fulfillment mode is chosen. The "Shop Categories" mega-menu and product pages were not captured without choosing a store. Their grocery-category notes below come from general knowledge and are marked _(unobserved)_.

---

## Key observations

### Daraz (marketplace)

1. **Home is a long, personalized feed.** Order: hero/banner carousel → **Flash Sale** with countdown and "Shop all" → **Categories** grid (long-tail categories, apparently personalized) → **Just For You** infinite feed. SEO text blocks sit at the bottom ("Top Categories & Brands", per-category link lists).
2. **Product URL encodes item + SKU:** `/products/<slug>-i<itemId>-s<skuId>.html`. A product (item) has many SKUs (variants), and the SKU is addressable. The displayed SKU code was `<itemId>_NP-<skuId>`, so it's scoped by country.
3. **Flash-sale pricing is rich.** Link tracking on flash-sale cards exposed these concepts: list price, flash-sale price, promo price, voucher price, **units sold**, **lowest price in last 30 days**, discount %, campaign id. The PDP showed list price struck through, % off, and a **"Ends in HH:MM:SS"** countdown.
4. **PDP anatomy:** breadcrumb (Groceries › Canned, Dry & Packaged › Instant & Ready to Eat › Ready to Eat); title; rating summary (4.8, 158 ratings); "N sold"; brand link plus "More … from <brand>"; price block; **Promotions** (e.g. "Min. spend Rs. 1,399" voucher); **Quantity** stepper; **Buy Now** and **Add to Cart**; **Delivery Options** tied to a saved location with **CHANGE**; delivery ETA ("Get by 29–30 Oct") with fee; **Cash on Delivery** badge; **Return & Warranty** ("14 Days Free Returns"); **Sold by** card with seller metrics (positive ratings %, ship-on-time %, chat response rate) and "Go to store"; Specifications (SKU, weight, pack size); "What's in the box"; Reviews with star filter and sort; masked reviewer names (`9***4`).
5. **Listing (PLP) filters:** Category, Brand, **Service & Promotion** (Mall/official, Free Delivery, loyalty-coin discount, Fast Delivery), **Shipped From** (province), Price min/max, Rating ("& up"), Delivery option, Warranty type/period. Sort ("Best Match"), grid/list view toggle. Cards show price, "N sold", and loyalty savings ("Gems save Rs. 15").
6. **Global chrome:** search box with trending-query chips, Messages (buyer↔seller chat), language switch (English/नेपाली), "Save more on app", "Become a seller", Help & Support, Login/Sign up. Footer: Help Center, How to Buy, Returns & Refunds, Sell on Daraz, Code of Conduct, payment methods, app download links.
7. **Seasonal campaigns** live at dedicated landing pages (e.g. a Dashain campaign, 11.11, 12.12, Valentine's).
8. **Grocery is a sub-vertical** with its own store ("dmart") inside the marketplace. Nepali grocery items already sell there (meat achar by weight variants, sutkeri masala).

### 99 Ranch Market (regional grocer, US)

1. **Fulfillment mode first.** The header's **"How do you want your items?"** selector gates the catalog. The site infers a default ZIP (from IP) and shows it before you choose.
2. **Store-centric model.** The Store Locator searches by city/state/ZIP with a **distance radius**, lists stores with full weekly hours, phone/fax, **Get Directions**, a map, **"Make this my store"** and **"View Weekly Ad"** (ads are per store). There's "Load more" pagination.
3. **Weekly in-store promotions** are a first-class nav item (Deals menu + `/store-ads`) and are scoped to the selected store.
4. **Ship-to-home is limited to shelf-stable goods.** The policy: the online shop ships **non-refrigerated** grocery via FedEx. The shipping page covers: where they deliver, shipping/delivery dates, costs, change of address, method, **shipping restrictions**, no international shipping. Fresh and frozen items stay in-store or local.
5. **Trilingual** (English / 简体中文 / 繁體中文) switch in the header.
6. **Other modules:** Loyalty program, Recipes, News & Events, newsletter signup with **email + ZIP** (segmenting deals by region), refund policy for online orders, FAQs.
7. _(unobserved)_ Grocery-style departments (Produce, Meat & Seafood, Frozen, Snacks, Pantry/Dry Goods, Sauces & Spices, Beverages, Household), with weekly deals by department.

---

## Feature matrix

| Area | Daraz | 99 Ranch | **Ashan Market (proposed)** |
|---|---|---|---|
| Business model | Multi-vendor marketplace, seller stores, seller metrics | Single retailer, physical stores + online shop | **Single seller (Ashan) at MVP; data model is vendor-aware from day one** so Phase 2 marketplace is additive |
| Location context | Delivery address on PDP with CHANGE | Store/fulfillment gate + IP-derived ZIP | **ZIP-first context chip** ("Delivering to 11372 · Queens"). Optional, non-blocking (unlike 99 Ranch's gate). It drives delivery options, ETAs and "Popular in your area" |
| Fulfillment | Standard/fast delivery, COD | Ship-to-home (shelf-stable, FedEx), in-store, local | **Ship nationwide (shelf-stable)**, **local delivery** + **pickup** in metro zones (NYC/Queens, Dallas/Irving, Bay Area, DC/VA). Frozen/perishables are local-only, enforced in the cart |
| Inventory | Per seller/SKU | Per store | **Per SKU per stock location** (warehouse or hub), so "not decided yet" works either way |
| Home | Banners → Flash Sale (countdown) → Categories → Just For You | Store-scoped content after selection | Hero banners → **Festival rail** (Dashain/Tihar/Teej/Losar) → Flash sale with countdown → Category grid → **Popular in your area** → Recently viewed → Reorder favorites |
| Deals | Flash sales, vouchers (min spend), coin savings, campaign pages | Weekly ad per store | Flash sales + **seasonal campaigns** + **weekly deals**; coupons (min spend, % / fixed, free shipping); "lowest price in 30 days" shown honestly on strike-through prices |
| Catalog | Item → SKUs, deep category tree, brand pages | Grocery departments | Product → variants (size/weight); 10 launch categories; brand pages; tags (vegetarian, festival, spicy level) |
| Search | Query + trending chips, PLP facets | Item search | Postgres FTS + **Nepali/romanized synonyms** + typo tolerance (trigram); facets: category, brand, price, in-stock, dietary |
| PDP | Rich (promos, delivery ETA, returns, seller card, specs, reviews) | _(not captured)_ | Images, price/compare-at, weight (oz + g), **ingredients, allergens, origin, importer**, delivery ETA by ZIP, perishable badge, reviews, related + "often bought together" |
| Social proof | Ratings, "N sold", masked reviewer names | — | Verified-purchase reviews with optional photos; "N bought this month" only when true |
| Payments | Cards, wallets, COD | Card | Stripe: cards, Apple Pay, Google Pay. **No COD** (US norm, fraud risk) |
| Tax | — (Nepal) | US sales tax | Stripe Tax |
| Account | Login/sign-up, messages | Sign in / sign up, loyalty | Email/phone OTP, Apple, Google; wishlist; addresses; **account deletion in-app** |
| Language | English / Nepali | English / 2 Chinese scripts | English / नेपाली from day one; product content stored bilingually |
| Engagement | App-only discounts, chat | Newsletter (email + ZIP), recipes | Push + email; newsletter with ZIP; **recipes/"what to cook for Dashain"** later; no app-only price gating (bad UX, App Store-neutral) |
| Seller tools | Seller center, store pages, seller metrics | — | Phase 2: seller onboarding, Stripe Connect payouts, commissions, seller metrics (ship-on-time %) |
| Help | Help center, how to buy, returns | FAQs, shipping, refund policy | Help center, shipping & restrictions page (perishables!), returns policy, privacy, terms, compliance statements |

---

## Key user flows (Ashan Market)

### 1. First launch / location
1. Open app → home renders immediately (no gate).
2. A dismissible chip asks for a ZIP code. We also infer metro from IP on web, with consent-free coarse lookup only.
3. The ZIP sets `fulfillment_context` (ship-only vs. local delivery/pickup available). Home sections and ETAs update.

### 2. Browse → buy (core)
Home → category or festival rail → PLP (filters, sort) → PDP (variant pick, qty, ETA for my ZIP) → **Add to cart** (toast + mini-cart; free-shipping progress bar "You're $12 away from free shipping") → Cart (coupon field, perishable warnings, per-item fulfillment eligibility) → Checkout.

### 3. Checkout
1. Sign in or continue as guest (account created at the end, which Apple accepts as long as login isn't forced before browsing).
2. Address: autocomplete → **address verification** (EasyPost) → suggest corrected address.
3. Fulfillment: shipping options with live rates (Standard / Express) **or** local delivery slot **or** pickup location + time window. Only valid options show for the cart contents.
4. Tax computed (Stripe Tax) → order summary.
5. Pay: Apple Pay / Google Pay / card (Stripe PaymentSheet / Payment Element).
6. Confirmation → push + email receipt.

### 4. Search
Type "achaar" → synonym expands to `achar` → results grouped with facets; zero results show related synonyms and popular items, never a dead end. Recent searches and trending chips (pattern from Daraz).

### 5. Post-purchase
Orders list → order detail with tracking timeline (carrier events via webhook) → **Reorder** (adds available items, reports unavailable) → cancel (before fulfillment) / return request (photo, reason; perishables excluded).

### 6. Seasonal campaign
Banner "Dashain Specials" → campaign landing (curated collection + countdown + coupon auto-applied) → PLP scoped to campaign.

### 7. Admin
Create product with variants → stock per location → publish → build a flash sale (time window, variant prices, quantity cap) → monitor orders → print label (EasyPost) → mark fulfilled → customer notified.

---

## UX patterns worth adopting (original implementations)

1. **Flash sale with server-authoritative countdown.** End time comes from the server and the client only renders. Show quantity-claimed progress only if real.
2. **Honest strike-through pricing.** Show compare-at only if it was the actual price recently. Store price history and surface "lowest in 30 days" (a Daraz concept, and an EU-style best practice).
3. **Location chip, not a location gate.** Keep 99 Ranch's ZIP-aware value without blocking browsing.
4. **Fulfillment eligibility per line item.** Mirrors 99 Ranch's "non-refrigerated only" policy, but tells users *in the cart* which items can't ship to their ZIP and offers pickup/local alternatives.
5. **Delivery ETA on the PDP** for the current ZIP (Daraz shows ETA and fee next to Add to Cart).
6. **Free-shipping progress bar** in cart and mini-cart.
7. **Breadcrumbs + "More from this brand"** for discovery on PDP.
8. **Facets that match our domain:** dietary (veg/non-veg, Jain-friendly), spice level, origin (Nepal/India), festival use, in stock.
9. **Masked public reviewer names** (first name + initial) and verified-purchase badges.
10. **Per-store/region weekly deals** become **per-metro deals** for local-delivery zones.
11. **Bilingual toggle in header and settings,** persisted. Nepali product names are stored, not machine-translated at runtime.
12. **Seller trust card** (Phase 2): ship-on-time %, rating, response time, as on Daraz.

### Anti-patterns to avoid
- App-only discounts and "download the app" nags on web.
- Blocking the whole catalog until a store is chosen.
- Fake urgency (countdowns that reset, invented "sold" counts).
- Long SEO text dumps in the UI. Use proper meta tags and structured data (JSON-LD `Product`/`Offer`) instead.
- Cash on delivery.

---

## Category taxonomy (launch)

| Slug | English | नेपाली | Notes |
|---|---|---|---|
| snacks-namkeen | Snacks & Namkeen | खाजा र नमकीन | dalmot, bhuja, chips, Kurkure-style |
| noodles | Noodles | चाउचाउ | Wai Wai, Rara, Mayos, Chau Chau |
| achar-pickles | Achar & Pickles | अचार | aama ko achar, gundruk, lapsi |
| spices-masala | Spices & Masala | मसला | timur, jimbu, sutkeri masala |
| rice-daal-chiura | Rice, Daal & Chiura | चामल, दाल र चिउरा | |
| tea | Tea | चिया | Ilam/Kanyam |
| sweets | Sweets | मिठाई | titaura, lapsi candy, rasbari (canned) |
| frozen | Frozen | फ्रोजन | momo, sel roti. **Local delivery/pickup only** |
| puja-samagri | Puja Samagri | पूजा सामग्री | dhup, batti, tika, janai |
| household | Household | घरायसी | |

## Inputs for architecture

- Vendor-aware schema (`vendors`, `vendor_id` on products/sub-orders) even though one vendor exists at launch.
- `stock_locations` + `inventory_levels(variant, location)`; `fulfillment_zones` (ZIP lists) per location.
- Variant-level `requires_cold_chain` / `shipping_class` to enforce shelf-stable-only shipping.
- `price_history` for honest compare-at and "lowest in 30 days".
- `campaigns` (festival, flash, weekly) with time windows and variant overrides.
- `search_synonyms` table maintained by admins.
- Bilingual content columns (`name_en`, `name_ne`, …) or a translations table.
