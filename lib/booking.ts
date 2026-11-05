export const BOOKING_VILLAS = [
  { id: "any", name: "Help me choose" },
  { id: "lotus-suite", name: "The Lotus Suite" },
  { id: "canopy-villa", name: "Canopy Villa" },
  { id: "grand-sanctuary", name: "The Grand Sanctuary" },
  { id: "family-haven", name: "The Family Haven" },
] as const;

export type BookingField =
  | "firstName"
  | "lastName"
  | "email"
  | "checkIn"
  | "checkOut"
  | "guests"
  | "villa"
  | "message";

export type BookingValues = Record<BookingField, string>;
export type BookingErrors = Partial<Record<BookingField, string>>;
export type BookingInquiry = Omit<BookingValues, "guests"> & { guests: number };
export type BookingResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; errors?: BookingErrors };

export const EMPTY_BOOKING: BookingValues = {
  firstName: "",
  lastName: "",
  email: "",
  checkIn: "",
  checkOut: "",
  guests: "2",
  villa: "any",
  message: "",
};

// Arrival dates follow the resort's calendar, regardless of the guest's timezone.
export function getResortToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isValidBookingDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function nextBookingDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function validateBooking(
  input: unknown,
  today = getResortToday(),
): { success: true; data: BookingInquiry } | { success: false; errors: BookingErrors } {
  const source =
    input !== null && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const text = (field: BookingField) =>
    typeof source[field] === "string" ? source[field].trim() : "";
  const values: BookingValues = {
    firstName: text("firstName"),
    lastName: text("lastName"),
    email: text("email"),
    checkIn: text("checkIn"),
    checkOut: text("checkOut"),
    guests: text("guests"),
    villa: text("villa"),
    message: text("message"),
  };
  const errors: BookingErrors = {};

  for (const field of ["firstName", "lastName"] as const) {
    if (!values[field]) errors[field] = `Enter your ${field === "firstName" ? "first" : "last"} name.`;
    else if (values[field].length > 80 || /[\r\n]/.test(values[field])) {
      errors[field] = "Use a name of 80 characters or fewer, on one line.";
    }
  }

  if (
    !values.email ||
    values.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)
  ) {
    errors.email = "Enter a valid email address so we can reply.";
  }

  if (!isValidBookingDate(values.checkIn)) errors.checkIn = "Choose a valid check-in date.";
  else if (values.checkIn < today) errors.checkIn = "Check-in cannot be in the past in Sri Lanka.";

  if (!isValidBookingDate(values.checkOut)) errors.checkOut = "Choose a valid check-out date.";
  else if (isValidBookingDate(values.checkIn) && values.checkOut <= values.checkIn) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  if (!/^[1-6]$/.test(values.guests)) errors.guests = "Choose between 1 and 6 guests.";
  if (!BOOKING_VILLAS.some((villa) => villa.id === values.villa)) {
    errors.villa = "Choose a villa preference, or select Help me choose.";
  }
  if (values.message.length > 2000 || (source.message !== undefined && typeof source.message !== "string")) {
    errors.message = "Use a message of 2,000 characters or fewer.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };
  return { success: true, data: { ...values, guests: Number(values.guests) } };
}
