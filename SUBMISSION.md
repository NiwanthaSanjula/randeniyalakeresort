# Web Developer Practical Assessment Submission

## 1. Live Website URL
* **URL:** `[Insert your live deployment URL here, e.g., https://randeniya-lake-resort.vercel.app]`

---

## 2. GitHub Repository URL
* **Repository:** [https://github.com/NiwanthaSanjula/randeniyalakeresort](https://github.com/NiwanthaSanjula/randeniyalakeresort)

---

## 3. Technologies & Development Stack Used
The website is built using a modern, production-ready, client-centric stack:
* **Framework:** Next.js (version 16) with App Router (Static Generation / Client components hybrid structure)
* **Core Logic:** React (version 19) & TypeScript
* **Styling (CSS):** Tailwind CSS (version 4) leveraging Next-gen CSS custom properties under inline `@theme` directives
* **Animations & Physics:** GSAP (GreenSock Animation Platform) + `@gsap/react` for React-native lifecycle tracking
* **Scroll Engine:** Lenis Smooth Scroll (`lenis/react` for SSR compatibility and scroll-duration lerping)
* **Typography:** 
  * *Playfair Display* (Serif font for luxurious headings)
  * *Bebas Neue* (Bold display font for watermarks and tags)
  * *Geist* (Clean sans-serif and mono fonts for details and reading comfort)
* **Icons:** Lucide React

---

## 4. AI Tools Used
AI utility was leveraged effectively to speed up development while maintaining full developer review:
* **UI/UX & Interactive Logic:** Claude Code / Antigravity AI agent (for architectural planning, horizontal pinning, ScrollTrigger active tracking, and custom Lenis provider setup)
* **Branding Assets:** DALL-E 3 / Midjourney (for the resort's logo `/randeniyaLogo.png` and cinematic lakefront visual assets)
* **Copywriting:** ChatGPT (for compiling localized hotel descriptions, experience logs, and the eco-luxe pledge text)

---

## 5. Approximate Time Spent
* **Total Time:** Approximately **6 hours** of focused planning, asset generation, responsive styling, scroll animation fine-tuning, and production optimization.

---

## 6. Main Design & Development Decisions
The website was built to feel premium, responsive, and contextually alive:
* **Visual Theme & Branding:** Fictional resort **"Randeniya Lake Resort"** set on the edge of *Randeniya Wewa* in Galewela, Sri Lanka. The visual palette combines raw nature (`emerald-500` representing sustainability and lush tropical canopy) with high-end gold accent styling to evoke luxury.
* **Typographic Hierarchy:** Custom font family mappings in Tailwind v4 theme configurations ensure consistent usage of elegant serif headlines, clean body text, and bold modern displays.
* **Cinematic Parallax Hero:** Implemented GSAP multi-layered parallax scrolling in the Hero (sky layer and villa layer translating at separate speeds) paired with cycling fade-in key headers (*"STILL THE MIND"*, *"MEET THE WATER"*).
* **Asymmetric Bento Layout:** Designed the **About** section using a modern Bento grid combining text details, static images, and a slow-rotating circular badge to draw visual interest.
* **Desktop Pinned Horizontal Scroll:** The **Rooms & Suites** gallery pins vertically and scrolls horizontally on desktop viewports. Cards crossfade between sunset and night versions on hover. On mobile and tablet, the section automatically falls back to an optimized vertical card list.
* **ScrollTrigger Active Navbar Sync:** Configured custom ScrollTrigger observers to track viewport intersections (thresholded at `top 30%` viewport offset). Highlighting outlines remain perfectly synced even when sections pin or resize.
* **Lenis Smooth Scroll:** Integrated Lenis to provide a frictionless kinetic scrolling feel, matching standard high-end luxury resort design patterns.
* **Client-Ready Polishing:** Fixed ESLint unescaped react entity errors, removed unused imports, added SEO metadata parameters to `layout.tsx`, and ensured `npm run lint` and `npm run build` finish with **zero warnings and zero errors**.

---

## 7. Unfinished Features or Known Limitations
* **Reservation inquiries:** The form uses server-side validation and Resend email delivery through `/api/reservations`, with inline loading, success, and error states. Live delivery requires the three email environment variables documented in `README.md` and a Node.js-capable deployment. Availability and rates require manual confirmation; payments and room inventory management are not implemented.
