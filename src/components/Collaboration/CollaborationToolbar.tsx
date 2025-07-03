import React from 'react';
import { Users, MessageCircle, Bell, Settings, UserPlus, Activity } from 'lucide-react';
import { useCollaborationContext } from './CollaborationProvider';
import { useCollaboration } from '../../hooks/useCollaboration';

interface CollaborationToolbarProps {
  className?: string;
}

export default function CollaborationToolbar({ className = '' }: CollaborationToolbarProps) {
  const {
    showCollaborationPanel,
    setShowCollaborationPanel,
    hasUnreadNotifications,
    isCollaborationEnabled
  } = useCollaborationContext();

  const { activeUsers, notifications } = useCollaboration();

  if (!isCollaborationEnabled) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Active Users Indicator */}
      {activeUsers.length > 0 && (
        <div className="flex items-center space-x-1">
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map(user => (
              <div
                key={user.userId}
                className="w-8 h-8 bg-primary-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-medium"
                title={user.userName}
              >
                {user.userName.charAt(0)}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-8 h-8 bg-gray-400 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-medium">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {activeUsers.length} online
          </span>
        </div>
      )}

      {/* Notifications */}
      <button
        onClick={() => setShowCollaborationPanel(true)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Comments */}
      <button
        onClick={() => setShowCollaborationPanel(true)}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Comments"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      {/* Team */}
      <button
        onClick={() => setShowCollaborationPanel(true)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Team collaboration"
      >
        <Users className="h-5 w-5" />
        <span className="text-sm font-medium">Team</span>
      </button>
    </div>
  );
}