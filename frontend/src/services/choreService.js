/**
 * choreService.js
 * Wraps the RoomLink Chores API.
 *
 * Real endpoints:
 *   POST   /api/spaces/:spaceId/chores            — create (owner/admin)
 *   GET    /api/spaces/:spaceId/chores            — list (any active member)
 *   GET    /api/spaces/:spaceId/chores/:choreId   — get single
 *   PATCH  /api/spaces/:spaceId/chores/:choreId   — update (owner/admin)
 *   DELETE /api/spaces/:spaceId/chores/:choreId   — delete (owner/admin)
 *
 * Chore model fields: space_id, title, description, assigned_to, due_date, status, created_by, created_at
 * Valid statuses: 'pending', 'in_progress', 'done'
 */
import api from './api.js';

/**
 * Get all chores for a space.
 * GET /api/spaces/:spaceId/chores
 * Returns: { chores: Chore[] }
 */
export async function getChores(spaceId) {
  const data = await api.get(`/spaces/${spaceId}/chores`);
  return data?.chores || data || [];
}

/**
 * Get a single chore.
 * GET /api/spaces/:spaceId/chores/:choreId
 * Returns: { chore: Chore }
 */
export async function getChore(spaceId, choreId) {
  const data = await api.get(`/spaces/${spaceId}/chores/${choreId}`);
  return data?.chore || data;
}

/**
 * Create a new chore.
 * POST /api/spaces/:spaceId/chores
 * Body: { title, description?, assigned_to?, due_date?, status? }
 * Returns: { chore: Chore }
 */
export async function createChore(spaceId, { title, description, assigned_to, due_date, status }) {
  const body = { title };
  if (description !== undefined) body.description = description;
  if (assigned_to !== undefined) body.assigned_to = assigned_to;
  if (due_date !== undefined) body.due_date = due_date;
  if (status !== undefined) body.status = status;
  const data = await api.post(`/spaces/${spaceId}/chores`, body);
  return data?.chore || data;
}

/**
 * Update a chore.
 * PATCH /api/spaces/:spaceId/chores/:choreId
 * Body: Partial<{ title, description, assigned_to, due_date, status }>
 * Returns: { chore: Chore }
 */
export async function updateChore(spaceId, choreId, updates) {
  const data = await api.patch(`/spaces/${spaceId}/chores/${choreId}`, updates);
  return data?.chore || data;
}

/**
 * Delete a chore.
 * DELETE /api/spaces/:spaceId/chores/:choreId
 */
export async function deleteChore(spaceId, choreId) {
  return api.delete(`/spaces/${spaceId}/chores/${choreId}`);
}
