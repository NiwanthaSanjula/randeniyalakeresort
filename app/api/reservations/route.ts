import { createHash } from "node:crypto";
import { BOOKING_VILLAS, validateBooking, type BookingResponse } from "@/lib/booking";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const DELIVERY_ERROR = "We couldn't send your request. Please try again, or contact our concierge by phone or email.";

function respond(body: BookingResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return respond({ ok: false, message: "Submit your inquiry using the reservation form." }, 415);
  }

  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return respond({ ok: false, message: "Your inquiry is too long. Please shorten your message." }, 413);
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return respond({ ok: false, message: "Your inquiry is too long. Please shorten your message." }, 413);
    }
    input = JSON.parse(body);
  } catch {
    return respond({ ok: false, message: "We couldn't read your inquiry. Please try again." }, 400);
  }

  // A hidden field catches simple automated submissions without adding a guest-facing step.
  if (input && typeof input === "object" && "website" in input && input.website !== "") {
    return respond({ ok: false, message: "We couldn't submit your inquiry. Please try again." }, 400);
  }

  const result = validateBooking(input);
  if (!result.success) {
    return respond({ ok: false, message: "Please check the highlighted fields.", errors: result.errors }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESERVATION_FROM_EMAIL?.trim();
  const to = process.env.RESERVATION_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    console.error("Reservation delivery is not configured. Set RESEND_API_KEY, RESERVATION_FROM_EMAIL, and RESERVATION_TO_EMAIL.");
    return respond({ ok: false, message: "Online inquiries are temporarily unavailable. Please contact our concierge by phone or email." }, 503);
  }

  const booking = result.data;
  const villaName = BOOKING_VILLAS.find((villa) => villa.id === booking.villa)!.name;
  const nights = Math.round((Date.parse(booking.checkOut) - Date.parse(booking.checkIn)) / 86_400_000);
  const email = {
    from,
    to: [to],
    reply_to: booking.email,
    subject: `Reservation inquiry: ${villaName} (${booking.checkIn})`,
    text: [
      "New reservation inquiry — Randeniya Lake Resort",
      "",
      `Guest: ${booking.firstName} ${booking.lastName}`,
      `Email: ${booking.email}`,
      `Check-in: ${booking.checkIn} (Sri Lanka)`,
      `Check-out: ${booking.checkOut} (Sri Lanka)`,
      `Stay: ${nights} ${nights === 1 ? "night" : "nights"}`,
      `Guests: ${booking.guests}`,
      `Villa preference: ${villaName}`,
      "",
      "Special requests:",
      booking.message || "None provided.",
      "",
      "This is an inquiry. Availability and the reservation must be confirmed by the concierge.",
    ].join("\n"),
  };
  // An unchanged retry reuses the same key, including after a network timeout.
  const key = createHash("sha256").update(JSON.stringify(email)).digest("hex");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `reservation/${key}`,
      },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Reservation email was rejected by the delivery provider.", { status: response.status });
      return respond({ ok: false, message: DELIVERY_ERROR }, 502);
    }

    const receipt: unknown = await response.json();
    if (!receipt || typeof receipt !== "object" || !("id" in receipt) || typeof receipt.id !== "string" || !receipt.id) {
      console.error("Reservation email provider returned an invalid receipt.");
      return respond({ ok: false, message: DELIVERY_ERROR }, 502);
    }

    return respond({ ok: true, message: "Your inquiry has been sent to our concierge. We'll reply by email to confirm availability. Your stay is not confirmed yet." }, 200);
  } catch {
    console.error("Reservation email delivery could not be completed.");
    return respond({ ok: false, message: DELIVERY_ERROR }, 502);
  }
}
