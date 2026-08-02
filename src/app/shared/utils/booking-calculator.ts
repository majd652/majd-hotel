export interface BookingSummary {
  nights: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

const TAX_RATE = 0.1;

export function calculateBookingSummary(
  checkIn: string, checkOut: string, pricePerNight: number, discountPercent: number,
): BookingSummary {
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = nights * (pricePerNight || 0);
  const tax = subtotal * TAX_RATE;
  const discount = (subtotal * (discountPercent || 0)) / 100;
  const total = Math.max(subtotal + tax - discount, 0);
  return {
    nights, subtotal: round2(subtotal), tax: round2(tax),
    discount: round2(discount), total: round2(total),
  };
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}