import React, { useState, useEffect } from 'react';
import { Heart, Download, Palette, Camera, Sparkles, RefreshCw, Plus, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import VisionBoardGenerator from './VisionBoardGenerator';
import VisionBoardCustomizer from './VisionBoardCustomizer';
import PhotoUploadModal from './PhotoUploadModal';
import BackButton from '../common/BackButton';

interface UploadedPhoto {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  category: string;
  tags: string[];
  isFavorite: boolean;
  uploadDate: Date;
  source: 'device' | 'instagram' | 'facebook';
  edits?: {
    brightness: number;
    contrast: number;
    saturation: number;
    filter: string;
    crop?: { x: number; y: number; width: number; height: number };
  };
}

export default function VisionBoardPage() {
  const { state, dispatch } = useApp();
  const [currentBoard, setCurrentBoard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  const generateVisionBoard = async (preferences = null) => {
    setIsGenerating(true);
    
    // Use existing style profile or custom preferences
    const boardPreferences = preferences || {
      aesthetic: state.user?.styleProfile?.style || 'Classic & Elegant',
      venue: state.user?.styleProfile?.venue || 'Garden/Outdoor',
      colors: state.user?.styleProfile?.colors || ['Blush Pink', 'Gold'],
      season: state.user?.styleProfile?.season || 'Spring'
    };

    // Simulate generation delay
    setTimeout(() => {
      const newBoard = {
        id: Date.now().toString(),
        preferences: boardPreferences,
        createdAt: new Date(),
        elements: generateBoardElements(boardPreferences),
        userPhotos: uploadedPhotos
      };
      
      setCurrentBoard(newBoard);
      setIsGenerating(false);
    }, 2000);
  };

  const generateBoardElements = (preferences) => {
    const colorPalettes = {
      'Classic & Elegant': ['#F8BBD9', '#D4AF37', '#FFFFFF', '#F5F5F5', '#8B7355'],
      'Modern & Minimalist': ['#2C3E50', '#ECF0F1', '#BDC3C7', '#34495E', '#95A5A6'],
      'Rustic & Bohemian': ['#8B4513', '#DEB887', '#F4A460', '#CD853F', '#A0522D'],
      'Vintage & Romantic': ['#D8BFD8', '#FFB6C1', '#F0E68C', '#E6E6FA', '#DDA0DD'],
      'Beach & Tropical': ['#20B2AA', '#F0F8FF', '#FFE4B5', '#87CEEB', '#98FB98'],
      'Garden & Natural': ['#9CAF88', '#F0FFF0', '#98FB98', '#90EE90', '#8FBC8F']
    };

    const venueImages = {
      'Garden/Outdoor': [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'
      ],
      'Ballroom/Hotel': [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'
      ],
      'Beach/Waterfront': [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'
      ]
    };

    // Include user uploaded photos in the board elements
    const userPhotosByCategory = uploadedPhotos.reduce((acc, photo) => {
      if (!acc[photo.category]) acc[photo.category] = [];
      acc[photo.category].push(photo.url);
      return acc;
    }, {} as Record<string, string[]>);

    return {
      colorPalette: colorPalettes[preferences.aesthetic] || colorPalettes['Classic & Elegant'],
      venueImages: userPhotosByCategory['Venue'] || venueImages[preferences.venue] || venueImages['Garden/Outdoor'],
      moodImage: userPhotosByCategory['Inspiration']?.[0] || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      decorElements: [
        ...(userPhotosByCategory['Decorations'] || []),
        ...(userPhotosByCategory['Flowers'] || []),
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg'
      ].slice(0, 6),
      keywords: getStyleKeywords(preferences.aesthetic),
      userPhotos: uploadedPhotos
    };
  };

  const getStyleKeywords = (aesthetic) => {
    const keywords = {
      'Classic & Elegant': ['Timeless', 'Sophisticated', 'Refined', 'Graceful'],
      'Modern & Minimalist': ['Clean', 'Contemporary', 'Sleek', 'Understated'],
      'Rustic & Bohemian': ['Natural', 'Organic', 'Free-spirited', 'Earthy'],
      'Vintage & Romantic': ['Nostalgic', 'Dreamy', 'Whimsical', 'Charming'],
      'Beach & Tropical': ['Relaxed', 'Coastal', 'Breezy', 'Vibrant'],
      'Garden & Natural': ['Fresh', 'Botanical', 'Serene', 'Harmonious']
    };
    return keywords[aesthetic] || keywords['Classic & Elegant'];
  };

  const handlePhotosUploaded = (photos: UploadedPhoto[]) => {
    setUploadedPhotos(photos);
    setShowPhotoUpload(false);
    
    // Regenerate board if it exists to include new photos
    if (currentBoard) {
      generateVisionBoard(currentBoard.preferences);
    }
  };

  useEffect(() => {
    // Auto-generate board if user has style profile
    if (state.user?.styleProfile && !currentBoard) {
      generateVisionBoard();
    }
  }, [state.user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackButton />
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Vision Board</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gold-400 text-white rounded-lg hover:bg-gold-500 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Photos</span>
            </button>
            {currentBoard && (
              <>
                <button
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className="flex items-center space-x-2 px-4 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
                >
                  <Palette className="h-4 w-4" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={() => generateVisionBoard()}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Your Wedding Vision Board</h1>
          <p className="text-xl text-gray-600">Visualize your perfect wedding with a personalized mood board</p>
          {uploadedPhotos.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {uploadedPhotos.length} personal photos uploaded • Click "Upload Photos" to add more
            </p>
          )}
        </div>

        {!currentBoard && !isGenerating && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <Sparkles className="h-16 w-16 text-primary-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Create Your Vision Board</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate a beautiful mood board based on your style preferences. Upload your own photos or let us curate colors, venues, and design elements that match your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="bg-gold-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-500 transition-colors"
              >
                Upload Your Photos First
              </button>
              <button
                onClick={() => generateVisionBoard()}
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Generate from Style Profile
              </button>
              <button
                onClick={() => setShowCustomizer(true)}
                className="border border-primary-500 text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Custom Preferences
              </button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Vision Board</h3>
            <p className="text-gray-600">
              {uploadedPhotos.length > 0 
                ? `Incorporating your ${uploadedPhotos.length} uploaded photos and curating additional elements...`
                : 'Curating the perfect elements for your wedding style...'
              }
            </p>
          </div>
        )}

        {currentBoard && (
          <VisionBoardGenerator 
            board={currentBoard} 
            onRegenerate={() => generateVisionBoard()}
          />
        )}

        {showCustomizer && (
          <VisionBoardCustomizer
            onGenerate={(preferences) => {
              setShowCustomizer(false);
              generateVisionBoard(preferences);
            }}
            onClose={() => setShowCustomizer(false)}
          />
        )}

        {showPhotoUpload && (
          <PhotoUploadModal
            isOpen={showPhotoUpload}
            onClose={() => setShowPhotoUpload(false)}
            onPhotosUploaded={handlePhotosUploaded}
            existingPhotos={uploadedPhotos}
          />
        )}
      </div>
    </div>
  );
}