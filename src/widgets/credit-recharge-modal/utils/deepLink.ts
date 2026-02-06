/**
 * Deep link utility for credit recharge return detection
 */

export function generateRechargeUrl(): string {
  if (typeof window === 'undefined') return '';
  const baseUrl = window.location.origin;
  return `${baseUrl}?recharge=true&timestamp=${Date.now()}`;
}

export function parseRechargeUrl(): { isRecharge: boolean; timestamp?: string } {
  if (typeof window === 'undefined') return { isRecharge: false };
  const params = new URLSearchParams(window.location.search);
  return {
    isRecharge: params.get('recharge') === 'true',
    timestamp: params.get('timestamp') || undefined,
  };
}

export function clearRechargeUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('recharge');
  url.searchParams.delete('timestamp');
  window.history.replaceState({}, '', url.toString());
}
