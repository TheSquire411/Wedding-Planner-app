import React, { useState } from 'react';
import { Users, MessageCircle, Activity, Settings, UserPlus, Crown, Edit3, Eye, MoreVertical, Bell, X, Check, Clock, AlertCircle } from 'lucide-react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useApp } from '../../context/AppContext';
import { Collaborator } from '../../types/collaboration';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function CollaborationPanel({ isOpen, onClose, projectId }: CollaborationPanelProps) {
  const { state } = useApp();
  const {
    collaborators,
    activeUsers,
    activityLog,
    notifications,
    isConnected,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
    hasPermission
  } = useCollaboration(projectId);

  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'notifications'>('users');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await inviteCollaborator(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteForm(false);
      alert(`Invitation sent to ${inviteEmail}!`);
    } catch (error) {
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-gold-500" />;
      case 'editor': return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-gold-100 text-gold-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'update': return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'delete': return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'comment': return <MessageCircle className="h-3 w-3 text-purple-500" />;
      case 'invite': return <UserPlus className="h-3 w-3 text-green-500" />;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-white" />
          <h3 className="text-lg font-semibold text-white">Collaboration</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
        </div>
        <button
          onClick={onClose}
          className="p-1 text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'users', label: 'Team', icon: Users },
          { key: 'activity', label: 'Activity', icon: Activity },
          { key: 'notifications', label: 'Alerts', icon: Bell }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {key === 'notifications' && notifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'users' && (
          <div className="p-6 space-y-6">
            {/* Invite Button */}
            {hasPermission('invite_others') && (
              <div>
                {!showInviteForm ? (
                  <button
                    onClick={() => setShowInviteForm(true)}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <UserPlus className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">Invite Team Member</span>
                  </button>
                ) : (
                  <form onSubmit={handleInvite} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="colleague@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="editor">Editor - Can modify content</option>
                        <option value="viewer">Viewer - Read-only access</option>
                      </select>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isInviting}
                        className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
                      >
                        {isInviting ? 'Sending...' : 'Send Invite'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInviteForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Currently Online</h4>
                <div className="space-y-2">
                  {activeUsers.map(user => (
                    <div key={user.userId} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                      <div className="relative">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.userName.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{user.userName}</p>
                        <p className="text-xs text-gray-500">Viewing {user.currentPage}</p>
                      </div>
                      {user.isTyping && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Collaborators */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Team Members</h4>
              <div className="space-y-3">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                        {collaborator.name.charAt(0)}
                      </div>
                      {collaborator.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-800">{collaborator.name}</p>
                        {getRoleIcon(collaborator.role)}
                      </div>
                      <p className="text-xs text-gray-500">{collaborator.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(collaborator.role)}`}>
                          {collaborator.role}
                        </span>
                        <span className="text-xs text-gray-400">
                          Last active: {collaborator.lastActive.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {hasPermission('manage_roles') && collaborator.role !== 'owner' && (
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {activityLog.length > 0 ? (
                activityLog.map(entry => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{entry.userName}</span> {entry.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Notifications</h4>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="mt-1">
                      {notification.type === 'mention' && <MessageCircle className="h-4 w-4 text-blue-500" />}
                      {notification.type === 'comment' && <MessageCircle className="h-4 w-4 text-purple-500" />}
                      {notification.type === 'update' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                      {notification.type === 'invite' && <UserPlus className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.createdAt.toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No new notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isConnected ? (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Disconnected</span>
              </span>
            )}
          </span>
          <span>{activeUsers.length} online</span>
        </div>
      </div>
    </div>
  );
}