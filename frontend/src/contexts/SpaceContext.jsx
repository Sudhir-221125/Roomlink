/**
 * SpaceContext.jsx
 * Provides the concept of a "current space" across the application.
 *
 * - Fetches the user's spaces from GET /api/spaces after login
 * - Allows switching the active space (persisted in localStorage)
 * - Fetches members for the current space via GET /api/spaces/:id/members
 * - Exposes role helpers so UI can gate actions by membership role
 *
 * Role hierarchy: owner > admin > member
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getSpaces, getSpace, createSpace, updateSpace, deleteSpace } from '../services/spaceService.js';
import { getMembers, addMember, removeMember, updateMemberRole, leaveSpace } from '../services/membershipService.js';
import { useAuth } from './AuthContext.jsx';

const SpaceContext = createContext(null);

const STORED_SPACE_KEY = 'rl_current_space_id';

export function SpaceProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [spaces, setSpaces]                   = useState([]);
  const [currentSpace, setCurrentSpace]       = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null); // user's membership in currentSpace
  const [members, setMembers]                 = useState([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [spacesError, setSpacesError]         = useState(null);

  // ── Fetch members for a given space ────────────────────────────────────
  const fetchMembers = useCallback(async (spaceId) => {
    if (!spaceId) return;
    setIsLoadingMembers(true);
    try {
      const data = await getMembers(spaceId);
      const list = Array.isArray(data) ? data : (data?.members || []);
      setMembers(list);
      // Find current user's membership
      if (user) {
        const mine = list.find(m => {
          const memberId = m.user_id?._id || m.user_id || m.userId;
          return memberId === user._id || memberId === user.id;
        });
        setCurrentMembership(mine || null);
      }
    } catch (err) {
      console.error('[SpaceContext] Failed to fetch members:', err.message);
      setMembers([]);
      setCurrentMembership(null);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [user]);

  // ── Fetch all spaces and select the stored one ─────────────────────────
  const fetchSpaces = useCallback(async () => {
    setIsLoadingSpaces(true);
    setSpacesError(null);
    try {
      const data = await getSpaces();
      const list = Array.isArray(data) ? data : (data?.spaces || []);
      setSpaces(list);

      if (list.length > 0) {
        // Try to restore last selected space
        const storedId = localStorage.getItem(STORED_SPACE_KEY);
        const target = list.find(s => (s._id || s.id) === storedId) || list[0];
        setCurrentSpace(target);
        await fetchMembers(target._id || target.id);
      } else {
        setCurrentSpace(null);
        setMembers([]);
        setCurrentMembership(null);
      }
    } catch (err) {
      console.error('[SpaceContext] Failed to fetch spaces:', err.message);
      setSpacesError(err.message);
      setSpaces([]);
    } finally {
      setIsLoadingSpaces(false);
    }
  }, [fetchMembers]);

  // ── Auto-fetch when user becomes authenticated ─────────────────────────
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSpaces();
    } else if (!isAuthenticated) {
      // Clear everything on logout
      setSpaces([]);
      setCurrentSpace(null);
      setCurrentMembership(null);
      setMembers([]);
    }
  }, [isAuthenticated, user, fetchSpaces]);

  // ── Select / switch spaces ─────────────────────────────────────────────
  const selectSpace = useCallback(async (spaceId) => {
    const target = spaces.find(s => (s._id || s.id) === spaceId);
    if (!target) return;
    setCurrentSpace(target);
    localStorage.setItem(STORED_SPACE_KEY, spaceId);
    await fetchMembers(spaceId);
  }, [spaces, fetchMembers]);

  // ── CRUD wrappers ───────────────────────────────────────────────────────
  const createNewSpace = useCallback(async (payload) => {
    const data = await createSpace(payload);
    const newSpace = data?.space || data;
    await fetchSpaces(); // Refresh list
    return newSpace;
  }, [fetchSpaces]);

  const updateCurrentSpace = useCallback(async (updates) => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    const updated = await updateSpace(id, updates);
    const updatedSpace = updated?.space || updated;
    setCurrentSpace(updatedSpace);
    setSpaces(prev => prev.map(s => ((s._id || s.id) === id ? updatedSpace : s)));
    return updatedSpace;
  }, [currentSpace]);

  const deleteCurrentSpace = useCallback(async () => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    await deleteSpace(id);
    localStorage.removeItem(STORED_SPACE_KEY);
    await fetchSpaces();
  }, [currentSpace, fetchSpaces]);

  // ── Membership management ───────────────────────────────────────────────
  const addSpaceMember = useCallback(async (email, role_in_space = 'member') => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    const result = await addMember(id, { email, role_in_space });
    await fetchMembers(id);
    return result;
  }, [currentSpace, fetchMembers]);

  const removeSpaceMember = useCallback(async (userId) => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    await removeMember(id, userId);
    await fetchMembers(id);
  }, [currentSpace, fetchMembers]);

  const changeMemberRole = useCallback(async (userId, role_in_space) => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    const result = await updateMemberRole(id, userId, role_in_space);
    await fetchMembers(id);
    return result;
  }, [currentSpace, fetchMembers]);

  const leaveCurrentSpace = useCallback(async () => {
    if (!currentSpace) return;
    const id = currentSpace._id || currentSpace.id;
    await leaveSpace(id);
    await fetchSpaces();
  }, [currentSpace, fetchSpaces]);

  // ── Role helpers ────────────────────────────────────────────────────────
  const myRole = currentMembership?.role_in_space || null;

  const isOwner = () => myRole === 'owner';
  const isAdmin = () => myRole === 'owner' || myRole === 'admin';
  const isMember = () => !!myRole;
  const canManageSpace = () => isAdmin();
  const canDeleteSpace = () => isOwner();
  const canManageRoles = () => isOwner();
  const canAddMembers = () => isAdmin();

  const value = {
    // State
    spaces,
    currentSpace,
    currentMembership,
    members,
    myRole,
    isLoadingSpaces,
    isLoadingMembers,
    spacesError,

    // Space actions
    fetchSpaces,
    selectSpace,
    createNewSpace,
    updateCurrentSpace,
    deleteCurrentSpace,

    // Membership actions
    fetchMembers: () => fetchMembers(currentSpace?._id || currentSpace?.id),
    addSpaceMember,
    removeSpaceMember,
    changeMemberRole,
    leaveCurrentSpace,

    // Role guards
    isOwner,
    isAdmin,
    isMember,
    canManageSpace,
    canDeleteSpace,
    canManageRoles,
    canAddMembers,
  };

  return (
    <SpaceContext.Provider value={value}>
      {children}
    </SpaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSpace() {
  const ctx = useContext(SpaceContext);
  if (!ctx) throw new Error('useSpace must be used within SpaceProvider');
  return ctx;
}
