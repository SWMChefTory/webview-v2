import client from '@/src/shared/client/main/client';
import type { ImpressionPayload, ClickPayload } from '../model/types';

const TRACKING_BASE = '/api/v1/tracking';

export function sendImpressions(payload: ImpressionPayload): void {
  client.post(`${TRACKING_BASE}/impressions`, payload).catch((err) => {
    console.warn('[Tracking] impression 전송 실패:', err);
  });
}

export function sendClick(payload: ClickPayload): void {
  client.post(`${TRACKING_BASE}/clicks`, payload).catch((err) => {
    console.warn('[Tracking] click 전송 실패:', err);
  });
}

export function flushImpressions(payload: ImpressionPayload): void {
  if (payload.impressions.length === 0) return;

  client.post(`${TRACKING_BASE}/impressions`, payload).catch((err) => {
    console.warn('[Tracking] flush 전송 실패:', err);
  });
}
