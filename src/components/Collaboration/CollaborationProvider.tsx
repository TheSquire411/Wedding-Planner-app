import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { collaborationService } from '../../services/collaborationService';
import { Collaborator, CollaborationSession } from '../../types/collaboration';

interface CollaborationContextType {
  isCollaborationEnabled: boolean;
  currentSession: CollaborationSession | null;
  showCollaborationPanel: boolean;
  setShowCollaborationPanel: (show: boolean) => void;
  activeCollaborators: Collaborator[];
  hasUnreadNotifications: boolean;
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const [isCollaborationEnabled, setIsCollaborationEnabled] = useState(true);
  const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [activeCollaborators, setActiveCollaborators] = useState<Collaborator[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (state.user && isCollaborationEnabled) {
      // Initialize collaboration session
      const session: CollaborationSession = {
        id: 'session-' + Date.now(),
        activeUsers: [],
        notifications: []
      };
      setCurrentSession(session);

      // Set up mock collaborators for demo
      const mockCollaborators: Collaborator[] = [
        {
          id: state.user.id,
          email: state.user.email,
          name: state.user.name,
          role: 'owner',
          invitedAt: new Date(),
          acceptedAt: new Date(),
          lastActive: new Date(),
          isOnline: true,
          permissions: {
            canEditBudget: true,
            canEditChecklist: true,
            canEditVisionBoard: true,
            canEditVendors: true,
            canInviteOthers: true,
            canManageRoles: true
          }
        }
      ];
      setActiveCollaborators(mockCollaborators);
    }
  }, [state.user, isCollaborationEnabled]);

  // Listen for collaboration events
  useEffect(() => {
    const handleNotification = () => {
      setHasUnreadNotifications(true);
    };

    collaborationService.on('comment_added', handleNotification);
    collaborationService.on('user_joined', handleNotification);
    collaborationService.on('item_updated', handleNotification);

    return () => {
      collaborationService.off('comment_added', handleNotification);
      collaborationService.off('user_joined', handleNotification);
      collaborationService.off('item_updated', handleNotification);
    };
  }, []);

  const value: CollaborationContextType = {
    isCollaborationEnabled,
    currentSession,
    showCollaborationPanel,
    setShowCollaborationPanel,
    activeCollaborators,
    hasUnreadNotifications
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaborationContext() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaborationContext must be used within a CollaborationProvider');
  }
  return context;
}