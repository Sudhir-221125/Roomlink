/**
 * complaintService.js
 * Wraps the RoomLink Complaints API.
 *
 * Real endpoints:
 *   POST   /api/spaces/:spaceId/complaints               — create (any active member)
 *   GET    /api/spaces/:spaceId/complaints               — list (any active member)
 *   GET    /api/spaces/:spaceId/complaints/:complaintId  — get single
 *   PATCH  /api/spaces/:spaceId/complaints/:complaintId  — update (own complaints or owner/admin)
 *   DELETE /api/spaces/:spaceId/complaints/:complaintId  — delete (owner/admin)
 *
 * Complaint model fields: space_id, raised_by, type, title, description, status, created_at, resolved_at
 * Valid statuses: 'open', 'in_progress', 'resolved', 'closed'
 */
import api from './api.js';

/**
 * Get all complaints for a space.
 * GET /api/spaces/:spaceId/complaints
 * Returns: { complaints: Complaint[] }
 */
export async function getComplaints(spaceId) {
  const data = await api.get(`/spaces/${spaceId}/complaints`);
  return data?.complaints || data || [];
}

/**
 * Get a single complaint.
 * GET /api/spaces/:spaceId/complaints/:complaintId
 * Returns: { complaint: Complaint }
 */
export async function getComplaint(spaceId, complaintId) {
  const data = await api.get(`/spaces/${spaceId}/complaints/${complaintId}`);
  return data?.complaint || data;
}

/**
 * Create a new complaint.
 * POST /api/spaces/:spaceId/complaints
 * Body: { type, title, description }
 * Returns: { complaint: Complaint }
 */
export async function createComplaint(spaceId, { type, title, description }) {
  const data = await api.post(`/spaces/${spaceId}/complaints`, { type, title, description });
  return data?.complaint || data;
}

/**
 * Update a complaint.
 * PATCH /api/spaces/:spaceId/complaints/:complaintId
 * Body: Partial<{ type, title, description, status }>
 * Returns: { complaint: Complaint }
 */
export async function updateComplaint(spaceId, complaintId, updates) {
  const data = await api.patch(`/spaces/${spaceId}/complaints/${complaintId}`, updates);
  return data?.complaint || data;
}

/**
 * Delete a complaint (owner/admin only).
 * DELETE /api/spaces/:spaceId/complaints/:complaintId
 */
export async function deleteComplaint(spaceId, complaintId) {
  return api.delete(`/spaces/${spaceId}/complaints/${complaintId}`);
}
