/**
 * membershipService.js
 * Wraps the RoomLink Memberships API.
 *
 * Real endpoints:
 *   GET    /api/spaces/:spaceId/members              — list all members
 *   POST   /api/spaces/:spaceId/members              — add a member (by userId or email)
 *   DELETE /api/spaces/:spaceId/members/:userId      — remove a member
 *   PATCH  /api/spaces/:spaceId/members/:userId      — change a member's role
 *   POST   /api/spaces/:spaceId/members/leave        — current user leaves the space
 *
 * Membership roles (role_in_space): 'owner' | 'admin' | 'member'
 */
import api from './api.js';

/**
 * Get all members of a space.
 * GET /api/spaces/:spaceId/members
 * Returns: Membership[] (populated with user info)
 */
export async function getMembers(spaceId) {
  return api.get(`/spaces/${spaceId}/members`);
}

/**
 * Add a new member to a space.
 * POST /api/spaces/:spaceId/members
 * Body: { userId, role_in_space? }  — backend may also support email
 * Returns: Membership
 */
export async function addMember(spaceId, { userId, role_in_space = 'member' }) {
  return api.post(`/spaces/${spaceId}/members`, { userId, role_in_space });
}

/**
 * Remove a member from a space.
 * DELETE /api/spaces/:spaceId/members/:userId
 */
export async function removeMember(spaceId, userId) {
  return api.delete(`/spaces/${spaceId}/members/${userId}`);
}

/**
 * Update a member's role in a space.
 * PATCH /api/spaces/:spaceId/members/:userId
 * Body: { role_in_space }
 * Returns: Membership
 */
export async function updateMemberRole(spaceId, userId, role_in_space) {
  return api.patch(`/spaces/${spaceId}/members/${userId}`, { role_in_space });
}

/**
 * Current user leaves a space.
 * POST /api/spaces/:spaceId/members/leave
 */
export async function leaveSpace(spaceId) {
  return api.post(`/spaces/${spaceId}/members/leave`, {});
}
