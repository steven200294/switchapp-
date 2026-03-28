import { apiFetch } from '@/shared/services/api';
import type { DeckProperty, SwipeResult } from './swipe.types';

export async function getSwipeDeck(limit: number = 20): Promise<DeckProperty[]> {
  return apiFetch<DeckProperty[]>(`/swipes/deck?limit=${limit}`);
}

export async function recordSwipe(propertyId: string, action: 'like' | 'nope' | 'super_like'): Promise<SwipeResult> {
  return apiFetch<SwipeResult>('/swipes', {
    method: 'POST',
    body: JSON.stringify({ property_id: propertyId, action }),
  });
}

export async function undoSwipe(): Promise<{ undone: boolean }> {
  return apiFetch<{ undone: boolean }>('/swipes/undo', { method: 'DELETE' });
}
