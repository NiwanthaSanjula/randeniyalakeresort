# Randeniya Lake Resort

A resort website built with Next.js 16, React 19, TypeScript, Tailwind CSS, GSAP, and Lenis.

## Local development

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. The homepage can run without email credentials; reservation submissions return an unavailable message until delivery is configured.

## Reservation email setup

1. Create a [Resend](https://resend.com) account and [verify a sending domain](https://resend.com/docs/dashboard/domains/introduction).
2. Create a sending API key and fill in the three values in `.env.local`:

   ```dotenv
   RESEND_API_KEY=re_your_api_key
   RESERVATION_FROM_EMAIL="Randeniya Lake Resort <reservations@your-verified-domain.com>"
   RESERVATION_TO_EMAIL=your-concierge-inbox@example.com
   ```

3. Restart the development server after changing environment variables. On your hosting platform, configure the same server-only variables and redeploy.

The form sends inquiries to `POST /api/reservations`. Both the browser and server validate contact details, villa preference, guest count, and real calendar dates. Check-in follows the Sri Lankan date; check-out must be later than check-in.

The server reports success only after Resend accepts the email. Acceptance does not guarantee inbox delivery; monitor delivery and bounce events in your Resend dashboard. Replies go directly to the guest. Identical retries use Resend's [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys) to avoid duplicate emails within its 24-hour window.

These are reservation **inquiries**: staff must confirm availability and rates. The website does not take payments, reserve inventory, or store inquiries in a database. Email delivery requires a Node.js-capable Next.js deployment; a static-only export cannot run the API route.

## Booking links and footer policies

Each villa's Reserve link opens the inquiry form with that villa selected. Changing villas preserves any guest details already entered. The header and hero booking links go directly to the form, and the rooms navigation targets an anchor outside the animated gallery.

To link existing policy pages, set `PRIVACY_POLICY_URL` and `TERMS_OF_SERVICE_URL` to their complete HTTPS URLs in `.env.local` and your hosting environment. Restart development or rebuild the deployment after changing them. Unconfigured policy links are hidden. Generic Instagram and Facebook links have been removed until resort profiles are available.

## Checks

```powershell
npm run lint
npm run build
npx playwright install chromium
npm test
```

Tests cover validation, Sri Lankan date boundaries, Resend acceptance/failure, retry keys, and the form in desktop and mobile browsers. Email delivery is mocked; tests never send real emails. Playwright starts its own development server on port 3100.

To use an installed browser instead of downloading Chromium, set `PLAYWRIGHT_CHANNEL=msedge` or `chrome` in your shell before running `npm test`.
