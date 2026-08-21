/**
 * paymentService.js
 * Wraps the RoomLink Payments API.
 *
 * Payments are nested under Bills:
 *   POST   /api/spaces/:spaceId/bills/:billId/payments            — create
 *   GET    /api/spaces/:spaceId/bills/:billId/payments            — list
 *   GET    /api/spaces/:spaceId/bills/:billId/payments/:paymentId — get single
 *   PATCH  /api/spaces/:spaceId/bills/:billId/payments/:paymentId — update
 *   DELETE /api/spaces/:spaceId/bills/:billId/payments/:paymentId — delete
 *
 * Payment model fields: bill_id, paid_by, amount, method, transaction_id, paid_at
 */
import api from './api.js';

/**
 * Get all payments for a bill.
 * GET /api/spaces/:spaceId/bills/:billId/payments
 * Returns: { payments: Payment[] }
 */
export async function getPayments(spaceId, billId) {
  const data = await api.get(`/spaces/${spaceId}/bills/${billId}/payments`);
  return data?.payments || data || [];
}

/**
 * Get a single payment.
 * GET /api/spaces/:spaceId/bills/:billId/payments/:paymentId
 * Returns: { payment: Payment }
 */
export async function getPayment(spaceId, billId, paymentId) {
  const data = await api.get(`/spaces/${spaceId}/bills/${billId}/payments/${paymentId}`);
  return data?.payment || data;
}

/**
 * Create a payment against a bill.
 * POST /api/spaces/:spaceId/bills/:billId/payments
 * Body: { amount, method, transaction_id?, paid_at? }
 * Returns: { payment: Payment }
 */
export async function createPayment(spaceId, billId, { amount, method, transaction_id, paid_at }) {
  const body = { amount, method };
  if (transaction_id !== undefined) body.transaction_id = transaction_id;
  if (paid_at !== undefined) body.paid_at = paid_at;
  const data = await api.post(`/spaces/${spaceId}/bills/${billId}/payments`, body);
  return data?.payment || data;
}

/**
 * Update a payment.
 * PATCH /api/spaces/:spaceId/bills/:billId/payments/:paymentId
 * Body: Partial<{ amount, method, transaction_id, paid_at }>
 * Returns: { payment: Payment }
 */
export async function updatePayment(spaceId, billId, paymentId, updates) {
  const data = await api.patch(`/spaces/${spaceId}/bills/${billId}/payments/${paymentId}`, updates);
  return data?.payment || data;
}

/**
 * Delete a payment.
 * DELETE /api/spaces/:spaceId/bills/:billId/payments/:paymentId
 */
export async function deletePayment(spaceId, billId, paymentId) {
  return api.delete(`/spaces/${spaceId}/bills/${billId}/payments/${paymentId}`);
}
