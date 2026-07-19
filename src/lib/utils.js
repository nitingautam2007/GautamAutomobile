import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return '₹0';
  if (typeof price === 'string' && price.startsWith('₹')) return price;
  const num = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN');
}