/**
 * billService.js
 * Wraps the RoomLink Bills API.
 *
 * Real endpoints:
 *   POST   /api/spaces/:spaceId/bills           — create a bill (owner/admin)
 *   GET    /api/spaces/:spaceId/bills           — list bills (any active member)
 *   GET    /api/spaces/:spaceId/bills/:billId   — get single bill
 *   PATCH  /api/spaces/:spaceId/bills/:billId   — update bill (owner/admin)
 *   DELETE /api/spaces/:spaceId/bills/:billId   — delete bill (owner/admin)
 *
 * Bill model fields: space_id, title, amount, due_date, created_by, created_at
 */
import api from './api.js';

/**
 * Get all bills for a space.
 * GET /api/spaces/:spaceId/bills
 * Returns: { bills: Bill[] }
 */
export async function getBills(spaceId) {
  const data = await api.get(`/spaces/${spaceId}/bills`);
  return data?.bills || data || [];
}

/**
 * Get a single bill.
 * GET /api/spaces/:spaceId/bills/:billId
 * Returns: { bill: Bill }
 */
export async function getBill(spaceId, billId) {
  const data = await api.get(`/spaces/${spaceId}/bills/${billId}`);
  return data?.bill || data;
}

/**
 * Create a new bill.
 * POST /api/spaces/:spaceId/bills
 * Body: { title, amount, due_date }
 * Returns: { bill: Bill }
 */
export async function createBill(spaceId, { title, amount, due_date }) {
  const data = await api.post(`/spaces/${spaceId}/bills`, { title, amount, due_date });
  return data?.bill || data;
}

/**
 * Update a bill.
 * PATCH /api/spaces/:spaceId/bills/:billId
 * Body: Partial<{ title, amount, due_date }>
 * Returns: { bill: Bill }
 */
export async function updateBill(spaceId, billId, updates) {
  const data = await api.patch(`/spaces/${spaceId}/bills/${billId}`, updates);
  return data?.bill || data;
}

/**
 * Delete a bill (and associated payments).
 * DELETE /api/spaces/:spaceId/bills/:billId
 */
export async function deleteBill(spaceId, billId) {
  return api.delete(`/spaces/${spaceId}/bills/${billId}`);
}
