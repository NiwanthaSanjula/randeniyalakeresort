import { test, expect } from "@playwright/test";
import { BOOKING_VILLAS, getResortToday, nextBookingDate } from "@/lib/booking";

test.beforeEach(async ({ page }) => {
  await page.route("https://www.google.com/maps/**", (route) => route.abort());
  await page.route("https://images.unsplash.com/**", (route) => route.abort());
});

test("all villa links prefill the mobile form, preserve details, and submit the selected villa", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  let submittedVilla: string | undefined;
  await page.route("**/api/reservations", async (route) => {
    submittedVilla = route.request().postDataJSON().villa;
    await route.fulfill({ json: { ok: true, message: "Your inquiry has been sent." } });
  });
  await page.goto("/");
  await page.getByLabel("First name", { exact: true }).fill("Jane");
  await page.getByLabel("Email address", { exact: true }).fill("jane@example.com");

  for (const villa of BOOKING_VILLAS.filter((villa) => villa.id !== "any")) {
    const reserve = page.getByRole("link", { name: `Reserve ${villa.name}`, exact: true });
    if (villa.id === "canopy-villa") {
      await reserve.focus();
      await reserve.press("Enter");
    } else {
      await reserve.click();
    }
    await expect(page).toHaveURL(/#reservation$/);
    await expect(page.getByLabel("Villa preference", { exact: true })).toHaveValue(villa.id);
    await expect(page.getByLabel("First name", { exact: true })).toHaveValue("Jane");
    await expect(page.getByLabel("Email address", { exact: true })).toHaveValue("jane@example.com");
    await expect(page.getByRole("form", { name: "Reservation inquiry" })).toBeInViewport();
    await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  }

  const checkIn = nextBookingDate(getResortToday());
  await page.getByLabel("Last name", { exact: true }).fill("Perera");
  await page.getByLabel("Check-in", { exact: true }).fill(checkIn);
  await page.getByLabel("Check-out", { exact: true }).fill(nextBookingDate(checkIn));
  await page.getByRole("button", { name: "Request reservation", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Your inquiry has been sent.");
  expect(submittedVilla).toBe("family-haven");
  await page.getByRole("link", { name: "Reserve The Lotus Suite", exact: true }).click();
  await expect(page.getByLabel("Villa preference", { exact: true })).toHaveValue("lotus-suite");
  await expect(page.getByRole("form", { name: "Reservation inquiry" }).getByRole("status")).toBeEmpty();
});

test("desktop gallery booking works and footer Rooms returns to the start of the gallery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByLabel("First name", { exact: true })).toBeEnabled();
  await page.locator("header").getByRole("link", { name: "Rooms & Suites", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Wake beside/ })).toBeInViewport();

  const remainingScroll = await page.locator("#villas").evaluate((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top + bounds.height - window.innerHeight;
  });
  await page.mouse.wheel(0, remainingScroll);
  const reserve = page.getByRole("link", { name: "Reserve The Family Haven", exact: true });
  await expect(reserve).toBeInViewport();
  await reserve.click();
  await expect(page.getByLabel("Villa preference", { exact: true })).toHaveValue("family-haven");
  await expect(page.getByRole("form", { name: "Reservation inquiry" })).toBeInViewport();

  await page.locator("footer").getByRole("link", { name: "Rooms & Suites", exact: true }).click();
  await expect(page).toHaveURL(/#villas$/);
  await expect(page.getByRole("heading", { name: /Wake beside/ })).toBeInViewport();
});

test("header and hero booking links reach the inquiry form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("First name", { exact: true })).toBeEnabled();
  await page.locator("header").getByRole("link", { name: "Book A Stay", exact: true }).click();
  await expect(page.getByRole("form", { name: "Reservation inquiry" })).toBeInViewport();

  await page.getByRole("link", { name: "Reserve Stay", exact: true }).click();
  await expect(page).toHaveURL(/#reservation$/);
  await expect(page.getByRole("form", { name: "Reservation inquiry" })).toBeInViewport();
});

test("all fragment links point to real targets", async ({ page }) => {
  await page.goto("/");
  const brokenLinks = await page.locator('a[href^="#"]').evaluateAll((links) => links
    .map((link) => ({ text: link.textContent?.trim(), href: link.getAttribute("href")! }))
    .filter((link) => link.href === "#" || !document.getElementById(decodeURIComponent(link.href.slice(1)))));
  expect(brokenLinks).toEqual([]);
  await expect(page.locator('footer a[href="https://instagram.com"], footer a[href="https://facebook.com"]')).toHaveCount(0);
});
