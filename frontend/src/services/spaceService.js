/**
 * spaceService.js
 * Wraps the RoomLink Spaces API.
 *
 * Real endpoints:
 *   GET    /api/spaces              — list spaces user belongs to
 *   POST   /api/spaces              — create a new space (user becomes owner)
 *   GET    /api/spaces/:spaceId     — get space details
 *   PATCH  /api/spaces/:spaceId     — update space info (owner/admin)
 *   DELETE /api/spaces/:spaceId     — delete a space (owner only)
 */
import api from './api.js';

/**
 * Get all spaces the current user belongs to.
 * GET /api/spaces
 * Returns: Space[]
 */
export async function getSpaces() {
  return api.get('/spaces');
}

/**
 * Create a new space.
 * POST /api/spaces
 * Body: { name, type, address, description }
 * Returns: { space, membership }
 */
export async function createSpace({ name, type, address, description }) {
  return api.post('/spaces', { name, type, address, description });
}

/**
 * Get details for a specific space.
 * GET /api/spaces/:spaceId
 * Returns: Space
 */
export async function getSpace(spaceId) {
  return api.get(`/spaces/${spaceId}`);
}

/**
 * Update space information.
 * PATCH /api/spaces/:spaceId
 * Body: Partial<{ name, type, address, description }>
 * Returns: Space
 */
export async function updateSpace(spaceId, updates) {
  return api.patch(`/spaces/${spaceId}`, updates);
}

/**
 * Delete a space (owner only).
 * DELETE /api/spaces/:spaceId
 */
export async function deleteSpace(spaceId) {
  return api.delete(`/spaces/${spaceId}`);
}
