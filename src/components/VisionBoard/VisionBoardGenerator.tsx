import React from 'react';
import { Download, Share2, Heart, Sparkles, Camera, Palette } from 'lucide-react';

interface VisionBoardProps {
  board: {
    id: string;
    preferences: any;
    elements: {
      colorPalette: string[];
      venueImages: string[];
      moodImage: string;
      decorElements: string[];
      keywords: string[];
      userPhotos?: any[];
    };
  };
  onRegenerate: () => void;
}

export default function VisionBoardGenerator({ board, onRegenerate }: VisionBoardProps) {
  const { elements, preferences } = board;

  const handleDownload = () => {
    // In a real app, this would generate and download the vision board as an image
    alert('Vision board download feature would be implemented here');
  };

  const handleShare = () => {
    // In a real app, this would share the vision board
    alert('Vision board sharing feature would be implemented here');
  };

  const userPhotoCount = elements.userPhotos?.length || 0;

  return (
    <div className="space-y-8">
      {/* Vision Board Canvas */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Your {preferences.aesthetic} Vision</h3>
              {userPhotoCount > 0 && (
                <p className="text-primary-100 text-sm flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  Featuring {userPhotoCount} of your personal photos
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Download className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Main Vision Board Layout */}
          <div className="grid grid-cols-12 gap-6 h-96">
            {/* Central Mood Image */}
            <div className="col-span-5 relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={elements.moodImage}
                alt="Wedding mood"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-semibold">{preferences.aesthetic}</h4>
                <p className="text-sm opacity-90">{preferences.season} Wedding</p>
                {elements.userPhotos?.some(photo => photo.url === elements.moodImage) && (
                  <div className="flex items-center mt-1">
                    <Camera className="h-3 w-3 mr-1" />
                    <span className="text-xs">Your Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Color Palette */}
            <div className="col-span-3 space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 h-full">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-primary-500" />
                  Color Palette
                </h4>
                <div className="space-y-2">
                  {elements.colorPalette.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-600 font-medium">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Venue Inspiration */}
            <div className="col-span-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-800">Venue Inspiration</h4>
              <div className="grid grid-cols-2 gap-3 h-full">
                {elements.venueImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md relative">
                    <img
                      src={image}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {elements.userPhotos?.some(photo => photo.url === image) && (
                      <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                        <Camera className="h-3 w-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Design Elements Row */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            {/* Keywords */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Style Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {elements.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Decor Elements */}
            <div className="col-span-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Design Elements</h4>
              <div className="grid grid-cols-3 gap-4">
                {elements.decorElements.slice(0, 5).map((element, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-24 relative">
                    <img
                      src={element}
                      alt={`Decor ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {elements.userPhotos?.some(photo => photo.url === element) && (
                      <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                        <Camera className="h-2 w-2 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-gradient-to-br from-primary-100 to-sage-100 rounded-lg flex items-center justify-center h-24">
                  <Heart className="h-8 w-8 text-primary-500" />
                </div>
              </div>
            </div>
          </div>

          {/* User Photos Section */}
          {userPhotoCount > 0 && (
            <div className="mt-8 bg-gradient-to-r from-gold-50 to-primary-50 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                <Camera className="h-4 w-4 mr-2 text-gold-500" />
                Your Personal Photos ({userPhotoCount})
              </h4>
              <div className="grid grid-cols-6 gap-3">
                {elements.userPhotos?.slice(0, 6).map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-20 relative group">
                    <img
                      src={photo.thumbnail || photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    <div className="absolute bottom-1 left-1 bg-white/80 rounded px-1">
                      <span className="text-xs text-gray-600">{photo.category}</span>
                    </div>
                  </div>
                ))}
                {userPhotoCount > 6 && (
                  <div className="rounded-lg bg-gray-100 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">+{userPhotoCount - 6} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Board Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vision Board Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Event Aesthetic</h4>
            <p className="text-gray-600">{preferences.aesthetic}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Venue Type</h4>
            <p className="text-gray-600">{preferences.venue}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Season</h4>
            <p className="text-gray-600">{preferences.season}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Color Theme</h4>
            <p className="text-gray-600">{preferences.colors?.join(' & ')}</p>
          </div>
          {userPhotoCount > 0 && (
            <>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Personal Photos</h4>
                <p className="text-gray-600">{userPhotoCount} photos integrated</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Photo Categories</h4>
                <p className="text-gray-600">
                  {[...new Set(elements.userPhotos?.map(photo => photo.category))].join(', ')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}