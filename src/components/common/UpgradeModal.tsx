import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Crown, Zap } from 'lucide-react';
import Modal from './Modal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName, description }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={
        <>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Maybe Later
          </button>
          <button 
            onClick={handleUpgrade} 
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-sage-400 text-white rounded-lg hover:from-primary-600 hover:to-sage-500 transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
          >
            <Crown className="h-4 w-4" />
            <span>Upgrade to Pro</span>
          </button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Crown className="h-12 w-12 text-gold-400" />
          <Sparkles className="h-10 w-10 text-primary-500" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Unlock <span className="text-primary-500">"{featureName}"</span>
        </h3>
        
        <p className="text-lg text-gray-700 mb-4">
          This premium feature is available exclusively for{' '}
          <span className="font-semibold text-primary-600">Blissful Pro</span> members.
        </p>
        
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        
        <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-gold-500" />
            <span className="font-semibold text-gray-800">Pro Benefits Include:</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Unlimited AI Assistant conversations</li>
            <li>• Custom domain for your wedding website</li>
            <li>• Unlimited vision boards and photo uploads</li>
            <li>• Advanced RSVP management</li>
            <li>• Priority customer support</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500">
          One-time payment of <span className="font-bold text-primary-600">$99</span> • Lifetime access
        </p>
      </div>
    </Modal>
  );
}