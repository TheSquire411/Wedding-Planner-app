import { useState, useEffect, useCallback } from 'react';
import { Collaborator, CommentThread, ActivityLogEntry, CollaborationSession } from '../types/collaboration';
import { collaborationService } from '../services/collaborationService';
import { useApp } from '../context/AppContext';

export function useCollaboration(projectId?: string) {
  const { state } = useApp();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeUsers, setActiveUsers] = useState<CollaborationSession['activeUsers']>([]);
  const [commentThreads, setCommentThreads] = useState<CommentThread[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Initialize collaboration
  useEffect(() => {
    if (state.user && projectId) {
      collaborationService.connect(state.user.id, projectId);

      // Set up event listeners
      collaborationService.on('connected', () => setIsConnected(true));
      collaborationService.on('disconnected', () => setIsConnected(false));
      collaborationService.on('user_joined', handleUserJoined);
      collaborationService.on('user_left', handleUserLeft);
      collaborationService.on('item_updated', handleItemUpdated);
      collaborationService.on('comment_added', handleCommentAdded);

      return () => {
        collaborationService.disconnect();
      };
    }
  }, [state.user, projectId]);

  const handleUserJoined = useCallback((data: any) => {
    setActiveUsers(prev => {
      const existing = prev.find(user => user.userId === data.userId);
      if (existing) return prev;
      
      return [...prev, {
        userId: data.userId,
        userName: data.userName,
        avatar: data.avatar,
        currentPage: data.page || 'dashboard',
        lastSeen: new Date(),
        isTyping: false
      }];
    });
  }, []);

  const handleUserLeft = useCallback((data: any) => {
    setActiveUsers(prev => prev.filter(user => user.userId !== data.userId));
  }, []);

  const handleItemUpdated = useCallback((data: any) => {
    // Handle real-time item updates
    console.log('Item updated:', data);
  }, []);

  const handleCommentAdded = useCallback((data: any) => {
    setCommentThreads(prev => {
      const threadIndex = prev.findIndex(thread => thread.id === data.threadId);
      if (threadIndex >= 0) {
        const updatedThreads = [...prev];
        updatedThreads[threadIndex] = {
          ...updatedThreads[threadIndex],
          comments: [...updatedThreads[threadIndex].comments, data.comment]
        };
        return updatedThreads;
      }
      return prev;
    });
  }, []);

  // Collaboration actions
  const inviteCollaborator = useCallback(async (email: string, role: 'editor' | 'viewer') => {
    try {
      const invite = await collaborationService.inviteCollaborator(email, role);
      collaborationService.logActivity('invite', `Invited ${email} as ${role}`);
      return invite;
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
      throw error;
    }
  }, []);

  const updateCollaboratorRole = useCallback(async (collaboratorId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    try {
      await collaborationService.updateCollaboratorRole(collaboratorId, newRole);
      setCollaborators(prev => prev.map(collab => 
        collab.id === collaboratorId 
          ? { ...collab, role: newRole, permissions: getPermissionsForRole(newRole) }
          : collab
      ));
      collaborationService.logActivity('role_change', `Changed role to ${newRole}`);
    } catch (error) {
      console.error('Failed to update collaborator role:', error);
      throw error;
    }
  }, []);

  const removeCollaborator = useCallback(async (collaboratorId: string) => {
    try {
      await collaborationService.removeCollaborator(collaboratorId);
      setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId));
      collaborationService.logActivity('update', 'Removed collaborator');
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
      throw error;
    }
  }, []);

  const addComment = useCallback(async (itemType: string, itemId: string, content: string, mentions: string[] = []) => {
    try {
      // Find or create thread
      let thread = commentThreads.find(t => t.itemType === itemType && t.itemId === itemId);
      if (!thread) {
        thread = {
          id: `${itemType}-${itemId}`,
          itemType: itemType as any,
          itemId,
          comments: [],
          isResolved: false,
          participants: [state.user!.id]
        };
        setCommentThreads(prev => [...prev, thread!]);
      }

      const comment = await collaborationService.addComment(thread.id, content, mentions);
      collaborationService.logActivity('comment', `Added comment on ${itemType}`);
      return comment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }, [commentThreads, state.user]);

  const updateUserPresence = useCallback((page: string, cursor?: { x: number; y: number; itemId?: string }) => {
    collaborationService.updateUserPresence(page, cursor);
  }, []);

  const logActivity = useCallback((type: ActivityLogEntry['type'], description: string, metadata?: Record<string, any>) => {
    collaborationService.logActivity(type, description, metadata);
    
    const entry: ActivityLogEntry = {
      id: Date.now().toString(),
      type,
      userId: state.user!.id,
      userName: state.user!.name,
      description,
      timestamp: new Date(),
      metadata
    };
    
    setActivityLog(prev => [entry, ...prev.slice(0, 49)]); // Keep last 50 entries
  }, [state.user]);

  return {
    // State
    collaborators,
    activeUsers,
    commentThreads,
    activityLog,
    isConnected,
    notifications,
    
    // Actions
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
    addComment,
    updateUserPresence,
    logActivity,
    
    // Utilities
    hasPermission: (action: string) => {
      const currentUser = collaborators.find(c => c.id === state.user?.id);
      return currentUser ? collaborationService.hasPermission(currentUser, action) : false;
    },
    
    getCommentThread: (itemType: string, itemId: string) => {
      return commentThreads.find(t => t.itemType === itemType && t.itemId === itemId);
    }
  };
}

function getPermissionsForRole(role: 'owner' | 'editor' | 'viewer') {
  switch (role) {
    case 'owner':
      return {
        canEditBudget: true,
        canEditChecklist: true,
        canEditVisionBoard: true,
        canEditVendors: true,
        canInviteOthers: true,
        canManageRoles: true
      };
    case 'editor':
      return {
        canEditBudget: true,
        canEditChecklist: true,
        canEditVisionBoard: true,
        canEditVendors: true,
        canInviteOthers: false,
        canManageRoles: false
      };
    case 'viewer':
      return {
        canEditBudget: false,
        canEditChecklist: false,
        canEditVisionBoard: false,
        canEditVendors: false,
        canInviteOthers: false,
        canManageRoles: false
      };
  }
}