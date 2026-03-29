import * as adminRepo from './admin.repository.js';
import type { AdminUserRow, AdminPropertyRow } from './admin.repository.js';

export async function getDashboard() {
  return adminRepo.getDashboardStats();
}

export async function listUsers(page: number, limit: number) {
  return adminRepo.listUsers(page, limit);
}

export async function getUserById(id: string): Promise<{
  user: AdminUserRow;
  properties: AdminPropertyRow[];
} | null> {
  return adminRepo.getUserById(id);
}

export async function listProperties(page: number, limit: number) {
  return adminRepo.listProperties(page, limit);
}

export async function listMatches(page: number, limit: number) {
  return adminRepo.listMatches(page, limit);
}

export async function listSwipes(page: number, limit: number) {
  return adminRepo.listSwipes(page, limit);
}

export async function getSwipeStats() {
  return adminRepo.getSwipeStats();
}

export async function listConversations(page: number, limit: number) {
  return adminRepo.listConversations(page, limit);
}

export async function getConversationMessages(conversationId: string, page: number, limit: number) {
  return adminRepo.getConversationMessages(conversationId, page, limit);
}

export async function getMetricsSummary() {
  return adminRepo.getMetricsSummary();
}
