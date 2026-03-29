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
