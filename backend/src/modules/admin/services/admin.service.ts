import * as adminRepo from '../repositories/admin.repository.js';

export async function getDashboard(): Promise<{
  userCount: number;
  propertyCount: number;
  recentUsers: unknown[];
}> {
  return adminRepo.getDashboardStats();
}

export async function listUsers(page: number, limit: number): Promise<{
  users: unknown[];
  total: number;
  page: number;
  limit: number;
}> {
  const result = await adminRepo.listUsers(page, limit);
  return { ...result, page, limit };
}

export async function getUserById(id: string): Promise<{
  authUser: unknown;
  profile: unknown;
  properties: unknown[];
} | null> {
  return adminRepo.getUserById(id);
}

export async function listProperties(page: number, limit: number): Promise<{
  properties: unknown[];
  total: number;
  page: number;
  limit: number;
}> {
  const result = await adminRepo.listProperties(page, limit);
  return { ...result, page, limit };
}
