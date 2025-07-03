import React from 'react';
import { CollaborationProvider } from '../Collaboration/CollaborationProvider';
import CollaborationToolbar from '../Collaboration/CollaborationToolbar';
import CollaborationPanel from '../Collaboration/CollaborationPanel';
import { useCollaborationContext } from '../Collaboration/CollaborationProvider';

interface CollaborativeWrapperProps {
  children: React.ReactNode;
  projectId: string;
  showToolbar?: boolean;
}

function CollaborativeWrapperContent({ children, projectId, showToolbar = true }: CollaborativeWrapperProps) {
  const { showCollaborationPanel, setShowCollaborationPanel } = useCollaborationContext();

  return (
    <div className="relative">
      {children}
      
      {/* Collaboration Panel */}
      <CollaborationPanel
        isOpen={showCollaborationPanel}
        onClose={() => setShowCollaborationPanel(false)}
        projectId={projectId}
      />
    </div>
  );
}

export default function CollaborativeWrapper(props: CollaborativeWrapperProps) {
  return (
    <CollaborationProvider>
      <CollaborativeWrapperContent {...props} />
    </CollaborationProvider>
  );
}