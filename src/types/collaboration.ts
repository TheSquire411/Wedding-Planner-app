export interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
  invitedAt: Date;
  acceptedAt?: Date;
  lastActive: Date;
  isOnline: boolean;
  permissions: {
    canEditBudget: boolean;
    canEditChecklist: boolean;
    canEditVisionBoard: boolean;
    canEditVendors: boolean;
    canInviteOthers: boolean;
    canManageRoles: boolean;
  };
}

export interface CollaborationInvite {
  id: string;
  email: string;
  role: 'editor' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'declined';
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  mentions: string[];
  replies: Comment[];
  reactions: {
    emoji: string;
    users: string[];
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface CommentThread {
  id: string;
  itemType: 'checklist' | 'budget' | 'vision-board' | 'vendor' | 'timeline';
  itemId: string;
  comments: Comment[];
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  participants: string[];
}

export interface ActivityLogEntry {
  id: string;
  type: 'create' | 'update' | 'delete' | 'comment' | 'invite' | 'role_change' | 'login' | 'view';
  userId: string;
  userName: string;
  itemType?: string;
  itemId?: string;
  itemName?: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface VersionHistory {
  id: string;
  itemType: string;
  itemId: string;
  version: number;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  changedBy: string;
  changedAt: Date;
  description: string;
}

export interface RealTimeUpdate {
  type: 'user_joined' | 'user_left' | 'item_updated' | 'comment_added' | 'cursor_moved';
  userId: string;
  userName: string;
  data: any;
  timestamp: Date;
}

export interface CollaborationSession {
  id: string;
  activeUsers: {
    userId: string;
    userName: string;
    avatar?: string;
    currentPage: string;
    lastSeen: Date;
    isTyping?: boolean;
    cursor?: {
      x: number;
      y: number;
      itemId?: string;
    };
  }[];
  notifications: {
    id: string;
    type: 'mention' | 'comment' | 'update' | 'invite';
    message: string;
    userId: string;
    isRead: boolean;
    createdAt: Date;
  }[];
}