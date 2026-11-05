"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { EMPTY_BOOKING, type BookingValues } from "@/lib/booking";

const BookingValuesContext = createContext<BookingValues | null>(null);
const BookingUpdateContext = createContext<Dispatch<SetStateAction<BookingValues>> | null>(null);

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<BookingValues>({ ...EMPTY_BOOKING });

  return (
    <BookingUpdateContext.Provider value={setValues}>
      <BookingValuesContext.Provider value={values}>{children}</BookingValuesContext.Provider>
    </BookingUpdateContext.Provider>
  );
}

export function useBookingValues() {
  const values = useContext(BookingValuesContext);
  if (!values) throw new Error("useBookingValues must be used within BookingProvider.");
  return values;
}

export function useUpdateBooking() {
  const update = useContext(BookingUpdateContext);
  if (!update) throw new Error("useUpdateBooking must be used within BookingProvider.");
  return update;
}
