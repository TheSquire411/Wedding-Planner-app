import { Collaborator, CollaborationInvite, Comment, CommentThread, ActivityLogEntry, VersionHistory, RealTimeUpdate, CollaborationSession } from '../types/collaboration';

class CollaborationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  // WebSocket Connection Management
  connect(userId: string, projectId: string) {
    try {
      // In a real app, this would connect to your WebSocket server
      const wsUrl = `ws://localhost:8080/collaboration?userId=${userId}&projectId=${projectId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Collaboration WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected', { userId, projectId });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Collaboration WebSocket disconnected');
        this.emit('disconnected', {});
        this.attemptReconnect(userId, projectId);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { error });
      };
    } catch (error) {
      console.error('Failed to connect to collaboration service:', error);
      // Fallback to mock mode for development
      this.setupMockConnection(userId, projectId);
    }
  }

  private setupMockConnection(userId: string, projectId: string) {
    console.log('Setting up mock collaboration service');
    setTimeout(() => {
      this.emit('connected', { userId, projectId });
    }, 100);
  }

  private attemptReconnect(userId: string, projectId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(userId, projectId);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(data: RealTimeUpdate) {
    this.emit(data.type, data);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Event Management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Real-time Updates
  sendUpdate(type: string, data: any) {
    const update: RealTimeUpdate = {
      type: type as any,
      userId: 'current-user', // Would be actual user ID
      userName: 'Current User', // Would be actual user name
      data,
      timestamp: new Date()
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(update));
    } else {
      // Handle offline mode or queue updates
      console.log('WebSocket not connected, queuing update:', update);
    }
  }

  // User Presence
  updateUserPresence(page: string, cursor?: { x: number; y: number; itemId?: string }) {
    this.sendUpdate('cursor_moved', { page, cursor });
  }

  setTypingStatus(isTyping: boolean, itemId?: string) {
    this.sendUpdate('typing_status', { isTyping, itemId });
  }

  // Collaboration Management
  async inviteCollaborator(email: string, role: 'editor' | 'viewer'): Promise<CollaborationInvite> {
    // Simulate API call
    const invite: CollaborationInvite = {
      id: Date.now().toString(),
      email,
      role,
      invitedBy: 'current-user',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      token: this.generateInviteToken(),
      status: 'pending'
    };

    // In a real app, this would send an email
    console.log('Sending invitation email to:', email);
    
    return invite;
  }

  async acceptInvite(token: string): Promise<boolean> {
    // Simulate API call to accept invite
    console.log('Accepting invite with token:', token);
    return true;
  }

  async updateCollaboratorRole(collaboratorId: string, newRole: 'owner' | 'editor' | 'viewer'): Promise<boolean> {
    // Simulate API call
    console.log('Updating collaborator role:', collaboratorId, newRole);
    return true;
  }

  async removeCollaborator(collaboratorId: string): Promise<boolean> {
    // Simulate API call
    console.log('Removing collaborator:', collaboratorId);
    return true;
  }

  // Comments and Threads
  async addComment(threadId: string, content: string, mentions: string[] = []): Promise<Comment> {
    const comment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: 'current-user',
        name: 'Current User'
      },
      createdAt: new Date(),
      isEdited: false,
      mentions,
      replies: [],
      reactions: []
    };

    this.sendUpdate('comment_added', { threadId, comment });
    return comment;
  }

  async updateComment(commentId: string, content: string): Promise<boolean> {
    this.sendUpdate('comment_updated', { commentId, content });
    return true;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    this.sendUpdate('comment_deleted', { commentId });
    return true;
  }

  async addReaction(commentId: string, emoji: string): Promise<boolean> {
    this.sendUpdate('reaction_added', { commentId, emoji });
    return true;
  }

  async resolveThread(threadId: string): Promise<boolean> {
    this.sendUpdate('thread_resolved', { threadId });
    return true;
  }

  // Activity Logging
  logActivity(type: ActivityLogEntry['type'], description: string, metadata?: Record<string, any>) {
    const entry: ActivityLogEntry = {
      id: Date.now().toString(),
      type,
      userId: 'current-user',
      userName: 'Current User',
      description,
      timestamp: new Date(),
      metadata
    };

    // In a real app, this would be sent to the server
    console.log('Activity logged:', entry);
  }

  // Version History
  async saveVersion(itemType: string, itemId: string, changes: any[], description: string): Promise<VersionHistory> {
    const version: VersionHistory = {
      id: Date.now().toString(),
      itemType,
      itemId,
      version: 1, // Would be incremented
      changes,
      changedBy: 'current-user',
      changedAt: new Date(),
      description
    };

    console.log('Version saved:', version);
    return version;
  }

  async getVersionHistory(itemType: string, itemId: string): Promise<VersionHistory[]> {
    // Simulate API call
    return [];
  }

  async restoreVersion(versionId: string): Promise<boolean> {
    console.log('Restoring version:', versionId);
    return true;
  }

  // Utility Methods
  private generateInviteToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Permission Checking
  hasPermission(collaborator: Collaborator, action: string): boolean {
    if (collaborator.role === 'owner') return true;
    
    const permissions = collaborator.permissions;
    switch (action) {
      case 'edit_budget': return permissions.canEditBudget;
      case 'edit_checklist': return permissions.canEditChecklist;
      case 'edit_vision_board': return permissions.canEditVisionBoard;
      case 'edit_vendors': return permissions.canEditVendors;
      case 'invite_others': return permissions.canInviteOthers;
      case 'manage_roles': return permissions.canManageRoles;
      default: return collaborator.role === 'editor';
    }
  }

  // Notification Management
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    console.log('Marking notification as read:', notificationId);
    return true;
  }

  async getUnreadNotifications(): Promise<any[]> {
    // Simulate API call
    return [];
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;