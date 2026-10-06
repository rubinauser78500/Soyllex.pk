import { CurrencyConfig } from '../types/store';

export function formatPrice(amountUSD: number, currency: CurrencyConfig): string {
  const converted = amountUSD * currency.rate;
  return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
}

export function calculateSubtotal(items: { unitPriceUSD: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0);
}
