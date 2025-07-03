import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Reply, Edit3, Trash2, Heart, Smile, AtSign, MoreVertical, Check, X } from 'lucide-react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useApp } from '../../context/AppContext';
import { Comment, CommentThread } from '../../types/collaboration';

interface CommentSystemProps {
  itemType: string;
  itemId: string;
  className?: string;
}

export default function CommentSystem({ itemType, itemId, className = '' }: CommentSystemProps) {
  const { state } = useApp();
  const { getCommentThread, addComment, collaborators } = useCollaboration();
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const thread = getCommentThread(itemType, itemId);
  const commentCount = thread?.comments.length || 0;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(itemType, itemId, newComment, selectedMentions);
      setNewComment('');
      setSelectedMentions([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMention = (collaboratorId: string) => {
    if (!selectedMentions.includes(collaboratorId)) {
      setSelectedMentions(prev => [...prev, collaboratorId]);
    }
    setShowMentions(false);
    setMentionQuery('');
    textareaRef.current?.focus();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex >= 0) {
      const query = value.slice(lastAtIndex + 1);
      if (query.length >= 0 && !query.includes(' ')) {
        setMentionQuery(query);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredCollaborators = collaborators.filter(collab =>
    collab.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    collab.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const formatCommentContent = (content: string, mentions: string[]) => {
    let formattedContent = content;
    mentions.forEach(mentionId => {
      const collaborator = collaborators.find(c => c.id === mentionId);
      if (collaborator) {
        formattedContent = formattedContent.replace(
          new RegExp(`@${collaborator.name}`, 'gi'),
          `<span class="bg-blue-100 text-blue-800 px-1 rounded">@${collaborator.name}</span>`
        );
      }
    });
    return formattedContent;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Comment Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentCount > 0 ? `${commentCount} comments` : 'Add comment'}</span>
      </button>

      {/* Comment Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Comments</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Existing Comments */}
            {thread?.comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onEdit={(id, content) => {
                  setEditingComment(id);
                  setEditContent(content);
                }}
                onDelete={(id) => {
                  // Handle delete
                  console.log('Delete comment:', id);
                }}
                isEditing={editingComment === comment.id}
                editContent={editContent}
                onSaveEdit={() => {
                  // Handle save edit
                  setEditingComment(null);
                  setEditContent('');
                }}
                onCancelEdit={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
                formatContent={formatCommentContent}
              />
            ))}

            {/* Empty State */}
            {commentCount === 0 && (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* New Comment Form */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={handleTextChange}
                  placeholder="Add a comment... Use @ to mention team members"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                />

                {/* Mentions Dropdown */}
                {showMentions && filteredCollaborators.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    {filteredCollaborators.map(collaborator => (
                      <button
                        key={collaborator.id}
                        type="button"
                        onClick={() => handleMention(collaborator.id)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50"
                      >
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                          {collaborator.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{collaborator.name}</p>
                          <p className="text-xs text-gray-500">{collaborator.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Mentions */}
              {selectedMentions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMentions.map(mentionId => {
                    const collaborator = collaborators.find(c => c.id === mentionId);
                    return collaborator ? (
                      <span
                        key={mentionId}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        <AtSign className="h-3 w-3" />
                        <span>{collaborator.name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedMentions(prev => prev.filter(id => id !== mentionId))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Add emoji"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMentions(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Mention someone"
                  >
                    <AtSign className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editContent: string;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  formatContent: (content: string, mentions: string[]) => string;
}

function CommentItem({
  comment,
  onEdit,
  onDelete,
  isEditing,
  editContent,
  onSaveEdit,
  onCancelEdit,
  formatContent
}: CommentItemProps) {
  const { state } = useApp();
  const [showActions, setShowActions] = useState(false);

  const isOwner = comment.author.id === state.user?.id;

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {comment.author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-800">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{comment.createdAt.toLocaleString()}</span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        onEdit(comment.id, comment.content);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onDelete(comment.id);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => {
                  // Handle edit content change
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={onSaveEdit}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600"
                >
                  <Check className="h-3 w-3" />
                  <span>Save</span>
                </button>
                <button
                  onClick={onCancelEdit}
                  className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  <X className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: formatContent(comment.content, comment.mentions)
                }}
              />
              
              {/* Reactions */}
              {comment.reactions.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  {comment.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.users.length}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                  <Heart className="h-3 w-3" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                  <Reply className="h-3 w-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}