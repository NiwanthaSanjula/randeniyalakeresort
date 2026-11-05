import { test, expect, type Page } from "@playwright/test";
import { POST } from "@/app/api/reservations/route";
import { EMPTY_BOOKING, getResortToday, nextBookingDate, validateBooking } from "@/lib/booking";

const successMessage = "Your inquiry has been sent to our concierge. We'll reply by email to confirm availability. Your stay is not confirmed yet.";

function inquiry() {
  const checkIn = nextBookingDate(getResortToday());
  return {
    ...EMPTY_BOOKING,
    firstName: "Jane",
    lastName: "Perera",
    email: "jane@example.com",
    checkIn,
    checkOut: nextBookingDate(checkIn),
    villa: "lotus-suite",
    message: "Vegetarian breakfast, please.",
    website: "",
  };
}

function request(body: unknown = inquiry()) {
  return new Request("http://localhost/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test.describe("reservation validation", () => {
  test("uses Sri Lanka's date across midnight and handles leap days", () => {
    expect(getResortToday(new Date("2026-11-05T18:29:59Z"))).toBe("2026-11-05");
    expect(getResortToday(new Date("2026-11-05T18:30:00Z"))).toBe("2026-11-06");
    expect(nextBookingDate("2028-02-28")).toBe("2028-02-29");
    expect(nextBookingDate("2026-12-31")).toBe("2027-01-01");
  });

  test("accepts a valid inquiry, trims names, and keeps international names", () => {
    const result = validateBooking({ ...inquiry(), firstName: "  නිවන්  ", lastName: " O’Connor " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({ firstName: "නිවන්", lastName: "O’Connor", guests: 2 });
  });

  for (const [label, change, field] of [
    ["missing name", { firstName: "  " }, "firstName"],
    ["malformed email", { email: "jane@" }, "email"],
    ["past arrival", { checkIn: "2000-01-01" }, "checkIn"],
    ["impossible calendar date", { checkIn: "2027-02-30" }, "checkIn"],
    ["fractional guests", { guests: "2.5" }, "guests"],
    ["too many guests", { guests: "7" }, "guests"],
    ["unknown villa", { villa: "unlisted-villa" }, "villa"],
    ["oversized message", { message: "a".repeat(2001) }, "message"],
  ] as const) {
    test(`rejects ${label}`, () => {
      const result = validateBooking({ ...inquiry(), ...change });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.errors).toHaveProperty(field);
    });
  }

  test("rejects zero-night stays and departure before arrival", () => {
    const valid = inquiry();
    for (const checkOut of [valid.checkIn, getResortToday()]) {
      const result = validateBooking({ ...valid, checkOut });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.errors.checkOut).toContain("after check-in");
    }
  });
});

test.describe("reservation API", () => {
  const envKeys = ["RESEND_API_KEY", "RESERVATION_FROM_EMAIL", "RESERVATION_TO_EMAIL"] as const;
  let originalEnv: (string | undefined)[];
  let originalFetch: typeof fetch;
  let originalError: typeof console.error;
  let deliveries: { url: string; options?: RequestInit }[];

  test.beforeEach(() => {
    originalEnv = envKeys.map((key) => process.env[key]);
    originalFetch = globalThis.fetch;
    originalError = console.error;
    console.error = () => {};
    process.env.RESEND_API_KEY = "re_test_not_a_real_key";
    process.env.RESERVATION_FROM_EMAIL = "Resort <reservations@example.com>";
    process.env.RESERVATION_TO_EMAIL = "concierge@example.com";
    deliveries = [];
    globalThis.fetch = async (url, options) => {
      deliveries.push({ url: String(url), options });
      return Response.json({ id: "test-email-receipt" });
    };
  });

  test.afterEach(() => {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    envKeys.forEach((key, index) => {
      if (originalEnv[index] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[index];
    });
  });

  test("emails the concierge, sets reply-to, and succeeds only after acceptance", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, message: successMessage });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(deliveries).toHaveLength(1);
    expect(deliveries[0].url).toBe("https://api.resend.com/emails");
    const email = JSON.parse(String(deliveries[0].options?.body));
    expect(email).toMatchObject({ to: ["concierge@example.com"], reply_to: "jane@example.com" });
    expect(email.text).toContain("Villa preference: The Lotus Suite");
    expect(email.text).toContain("Stay: 1 night");
    expect(email.text).toContain("Vegetarian breakfast, please.");
  });

  test("deduplicates identical retries and gives edited inquiries a new key", async () => {
    const payload = inquiry();
    await POST(request(payload));
    await POST(request(payload));
    await POST(request({ ...payload, message: "A different request" }));
    const keys = deliveries.map((delivery) => new Headers(delivery.options?.headers).get("Idempotency-Key"));
    expect(keys[0]).toMatch(/^reservation\/[a-f0-9]{64}$/);
    expect(keys[1]).toBe(keys[0]);
    expect(keys[2]).not.toBe(keys[0]);
  });

  test("does not contact Resend when validation fails or a honeypot is filled", async () => {
    const invalid = await POST(request({ ...inquiry(), checkOut: inquiry().checkIn }));
    expect(invalid.status).toBe(400);
    expect((await invalid.json()).errors.checkOut).toContain("after check-in");
    expect((await POST(request({ ...inquiry(), website: "spam.example" }))).status).toBe(400);
    expect((await POST(request(null))).status).toBe(400);
    expect(deliveries).toHaveLength(0);
  });

  test("rejects malformed JSON, non-JSON bodies, and oversized UTF-8 bodies", async () => {
    const malformed = new Request("http://localhost/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    expect((await POST(malformed)).status).toBe(400);
    const nonJson = new Request("http://localhost/api/reservations", { method: "POST", body: "email=jane@example.com" });
    expect((await POST(nonJson)).status).toBe(415);
    expect((await POST(request({ ...inquiry(), message: "🌴".repeat(5000) }))).status).toBe(413);
    expect(deliveries).toHaveLength(0);
  });

  test("returns unavailable rather than success when email settings are missing", async () => {
    for (const key of envKeys) {
      const current = process.env[key];
      delete process.env[key];
      const response = await POST(request());
      expect(response.status).toBe(503);
      expect((await response.json()).ok).toBe(false);
      process.env[key] = current;
    }
    expect(deliveries).toHaveLength(0);
  });

  test("does not report success on provider errors, invalid receipts, or network failures", async () => {
    for (const providerResponse of [
      Response.json({ message: "private-provider-reason" }, { status: 403 }),
      Response.json({}),
      new Response("not json"),
    ]) {
      globalThis.fetch = async () => providerResponse;
      const response = await POST(request());
      expect(response.status).toBe(502);
      const body = await response.json();
      expect(body.ok).toBe(false);
      expect(JSON.stringify(body)).not.toContain("private-provider-reason");
    }
    globalThis.fetch = async () => { throw new Error("private network error"); };
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect((await response.json()).ok).toBe(false);
  });
});

async function fillForm(page: Page) {
  const payload = inquiry();
  await page.getByLabel("First name", { exact: true }).fill(payload.firstName);
  await page.getByLabel("Last name", { exact: true }).fill(payload.lastName);
  await page.getByLabel("Email address", { exact: true }).fill(payload.email);
  await page.getByLabel("Check-in", { exact: true }).fill(payload.checkIn);
  await page.getByLabel("Check-out", { exact: true }).fill(payload.checkOut);
  await page.getByLabel("Villa preference", { exact: true }).selectOption(payload.villa);
  await page.getByLabel("Special requests (optional)", { exact: true }).fill(payload.message);
}

test.describe("reservation form", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://www.google.com/maps/**", (route) => route.abort());
    await page.route("https://images.unsplash.com/**", (route) => route.abort());
  });

  test("shows accessible field errors without submitting invalid data", async ({ page }) => {
    let requests = 0;
    let releaseScripts: (() => void) | undefined;
    const scriptsReady = new Promise<void>((resolve) => { releaseScripts = resolve; });
    await page.route("**/_next/static/chunks/**", async (route) => {
      await scriptsReady;
      await route.continue();
    });
    await page.route("**/api/reservations", async (route) => { requests++; await route.abort(); });
    await page.goto("/#contact", { waitUntil: "commit" });
    try {
      await expect(page.getByRole("button", { name: "Request reservation", exact: true })).toBeDisabled();
    } finally {
      releaseScripts?.();
    }
    await page.getByRole("button", { name: "Request reservation", exact: true }).click();
    await expect(page.getByRole("form", { name: "Reservation inquiry" }).getByRole("alert")).toContainText("highlighted fields");
    await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
    await expect(page.getByLabel("First name", { exact: true })).toHaveAttribute("aria-invalid", "true");
    expect(requests).toBe(0);
  });

  for (const width of [1280, 390]) {
    test(`submits an inquiry and resets after success at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route("**/api/reservations", async (route) => {
        expect(route.request().postDataJSON()).toMatchObject({ email: "jane@example.com", villa: "lotus-suite", website: "" });
        await route.fulfill({ json: { ok: true, message: successMessage } });
      });
      await page.goto("/#contact");
      await fillForm(page);
      await page.getByRole("button", { name: "Request reservation", exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(successMessage);
      await expect(page.getByLabel("First name", { exact: true })).toHaveValue("");
      await expect(page.getByLabel("Villa preference", { exact: true })).toHaveValue("any");
    });
  }

  test("preserves guest details and allows retry after delivery fails", async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/reservations", async (route) => {
      attempts++;
      if (attempts === 1) await route.fulfill({ status: 502, json: { ok: false, message: "Delivery failed. Please try again." } });
      else await route.fulfill({ json: { ok: true, message: successMessage } });
    });
    await page.goto("/#contact");
    await fillForm(page);
    await page.getByRole("button", { name: "Request reservation", exact: true }).click();
    await expect(page.getByRole("form", { name: "Reservation inquiry" }).getByRole("alert")).toContainText("Delivery failed");
    await expect(page.getByLabel("Email address", { exact: true })).toHaveValue("jane@example.com");
    await page.getByRole("button", { name: "Request reservation", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(successMessage);
    expect(attempts).toBe(2);
  });

  test("disables the form while sending and prevents repeat submissions", async ({ page }) => {
    let requests = 0;
    let finishDelivery: (() => void) | undefined;
    const delivery = new Promise<void>((resolve) => { finishDelivery = resolve; });
    await page.route("**/api/reservations", async (route) => {
      requests++;
      await delivery;
      await route.fulfill({ json: { ok: true, message: successMessage } });
    });
    await page.goto("/#contact");
    await fillForm(page);
    await page.getByRole("button", { name: "Request reservation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Sending request...", exact: true })).toBeDisabled();
    await expect(page.getByLabel("Email address", { exact: true })).toBeDisabled();
    await page.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());
    expect(requests).toBe(1);
    finishDelivery?.();
    await expect(page.getByRole("status")).toHaveText(successMessage);
    expect(requests).toBe(1);
  });
});
