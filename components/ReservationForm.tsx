"use client";

import { useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Calendar, CheckCircle2, LoaderCircle, Mail, MapPin, Phone, Users } from "lucide-react";
import { useBookingValues, useUpdateBooking } from "@/components/BookingProvider";
import {
  BOOKING_VILLAS,
  EMPTY_BOOKING,
  getResortToday,
  isValidBookingDate,
  nextBookingDate,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingResponse,
  type BookingValues,
} from "@/lib/booking";

const inputClassName = "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-light text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500 disabled:opacity-70";
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function Field({ name, label, error, children }: { name: BookingField; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={`booking-${name}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      {children}
      {error && <p id={`booking-${name}-error`} className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function ReservationForm() {
  // Prevent interaction with the server-rendered form before its handlers are attached.
  const isReady = useSyncExternalStore(subscribe, clientReady, serverReady);
  const values = useBookingValues();
  const setValues = useUpdateBooking();
  const [errors, setErrors] = useState<BookingErrors>({});
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string; forValues: BookingValues } | null>(null);
  const notice = feedback?.forValues === values ? feedback : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const today = getResortToday();
  const checkoutMin = nextBookingDate(isValidBookingDate(values.checkIn) && values.checkIn >= today ? values.checkIn : today);

  function setNotice(next: { kind: "success" | "error"; message: string } | null, forValues = values) {
    setFeedback(next ? { ...next, forValues } : null);
  }

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const field = event.target.name as BookingField;
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice(null);
  }

  function fieldProps(field: BookingField) {
    return {
      id: `booking-${field}`,
      name: field,
      value: values[field],
      onChange: updateField,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `booking-${field}-error` : undefined,
    };
  }

  function focusFeedback(fieldErrors?: BookingErrors) {
    requestAnimationFrame(() => {
      const firstField = fieldErrors && Object.keys(fieldErrors).find((field) => fieldErrors[field as BookingField]);
      if (firstField) document.getElementById(`booking-${firstField}`)?.focus();
      else statusRef.current?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const validation = validateBooking(values);
    if (!validation.success) {
      setErrors(validation.errors);
      setNotice({ kind: "error", message: "Please check the highlighted fields." });
      focusFeedback(validation.errors);
      return;
    }

    const website = new FormData(event.currentTarget).get("website");
    submittingRef.current = true;
    setIsSubmitting(true);
    setErrors({});
    setNotice(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
        signal: AbortSignal.timeout(20_000),
      });
      const result: BookingResponse = await response.json();

      if (!response.ok || !result.ok) {
        const fieldErrors = !result.ok ? result.errors : undefined;
        setErrors(fieldErrors ?? {});
        setNotice({ kind: "error", message: result.message });
        focusFeedback(fieldErrors);
        return;
      }

      const clearedValues = { ...EMPTY_BOOKING };
      setValues(clearedValues);
      setNotice({ kind: "success", message: result.message }, clearedValues);
      focusFeedback();
    } catch {
      setNotice({ kind: "error", message: "We couldn't confirm your request was sent. Please try again, or contact our concierge by phone or email." });
      focusFeedback();
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form id="reservation" onSubmit={handleSubmit} noValidate aria-label="Reservation inquiry" aria-busy={!isReady || isSubmitting} className="flex scroll-mt-28 flex-col gap-6">
      <noscript><p className="text-sm text-slate-700">Please enable JavaScript to send an online inquiry, or contact our concierge using the phone number or email below.</p></noscript>
      <div
        ref={statusRef}
        tabIndex={-1}
        role={notice?.kind === "error" ? "alert" : "status"}
        aria-live={notice?.kind === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={notice ? `rounded-2xl border p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 ${notice.kind === "success" ? "border-primary-200 bg-primary-50 text-primary-900" : "border-red-200 bg-red-50 text-red-800"}` : "sr-only"}
      >
        {notice?.kind === "success" && <CheckCircle2 aria-hidden="true" className="mb-2 h-5 w-5" />}
        {notice?.message}
      </div>

      <fieldset disabled={!isReady || isSubmitting} className="flex min-w-0 flex-col gap-6">
        <legend className="sr-only">Reservation inquiry details</legend>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field name="firstName" label="First name" error={errors.firstName}>
            <input {...fieldProps("firstName")} type="text" autoComplete="given-name" required maxLength={80} placeholder="Jane" className={inputClassName} />
          </Field>
          <Field name="lastName" label="Last name" error={errors.lastName}>
            <input {...fieldProps("lastName")} type="text" autoComplete="family-name" required maxLength={80} placeholder="Doe" className={inputClassName} />
          </Field>
        </div>

        <Field name="email" label="Email address" error={errors.email}>
          <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} placeholder="jane@example.com" className={inputClassName} />
        </Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field name="checkIn" label="Check-in" error={errors.checkIn}>
            <div className="relative">
              <Calendar aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
              <input {...fieldProps("checkIn")} type="date" required min={today} className={`${inputClassName} pl-12 pr-4`} />
            </div>
          </Field>
          <Field name="checkOut" label="Check-out" error={errors.checkOut}>
            <div className="relative">
              <Calendar aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
              <input {...fieldProps("checkOut")} type="date" required min={checkoutMin} className={`${inputClassName} pl-12 pr-4`} />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field name="guests" label="Number of guests" error={errors.guests}>
            <div className="relative">
              <Users aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
              <select {...fieldProps("guests")} required className={`${inputClassName} cursor-pointer pl-12 pr-4`}>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
              </select>
            </div>
          </Field>
          <Field name="villa" label="Villa preference" error={errors.villa}>
            <select {...fieldProps("villa")} required className={`${inputClassName} cursor-pointer`}>
              {BOOKING_VILLAS.map((villa) => <option key={villa.id} value={villa.id}>{villa.name}</option>)}
            </select>
          </Field>
        </div>

        <Field name="message" label="Special requests (optional)" error={errors.message}>
          <textarea {...fieldProps("message")} rows={3} maxLength={2000} placeholder="Celebrating an anniversary? Dietary requirements? Let us know..." className={`${inputClassName} resize-y`} />
        </Field>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="booking-website">Leave this field empty</label>
          <input id="booking-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary-500" />
            <span className="text-xs font-light leading-relaxed text-slate-600">Lake Road, Randeniya, Galewela, Sri Lanka</span>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <a href="tel:+94771234567" className="flex items-center gap-3 text-xs font-light text-slate-600 transition-colors hover:text-primary-600">
              <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /><span>+94 77 123 4567</span>
            </a>
            <a href="mailto:concierge@randeniyalodge.com" className="flex items-center gap-3 text-xs font-light text-slate-600 transition-colors hover:text-primary-600">
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" /><span className="break-all">concierge@randeniyalodge.com</span>
            </a>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={!isReady || isSubmitting} className="group inline-flex w-full cursor-pointer items-center justify-center gap-4 rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-lg transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-70">
            <span className="text-sm font-bold uppercase tracking-widest">{isSubmitting ? "Sending request..." : "Request reservation"}</span>
            {isSubmitting ? <LoaderCircle aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin" /> : <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-2" />}
          </button>
          <p className="mt-3 text-center text-xs font-light leading-relaxed text-slate-500">No payment is taken. Our concierge will confirm availability and rates by email before your stay is reserved.</p>
        </div>
      </fieldset>
    </form>
  );
}
