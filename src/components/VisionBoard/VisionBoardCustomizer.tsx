import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface VisionBoardCustomizerProps {
  onGenerate: (preferences: any) => void;
  onClose: () => void;
}

export default function VisionBoardCustomizer({ onGenerate, onClose }: VisionBoardCustomizerProps) {
  const [preferences, setPreferences] = useState({
    aesthetic: '',
    venue: '',
    colors: [],
    season: '',
    mustHave: '',
    avoid: ''
  });

  const aestheticOptions = [
    'Classic & Elegant',
    'Modern & Minimalist',
    'Rustic & Bohemian',
    'Vintage & Romantic',
    'Beach & Tropical',
    'Garden & Natural',
    'Industrial Chic',
    'Glamorous & Luxe'
  ];

  const venueOptions = [
    'Garden/Outdoor',
    'Ballroom/Hotel',
    'Beach/Waterfront',
    'Barn/Rustic',
    'Museum/Historic',
    'Rooftop/City View',
    'Vineyard/Winery',
    'Mountain/Forest'
  ];

  const colorOptions = [
    ['Blush Pink', 'Gold'],
    ['Navy Blue', 'Silver'],
    ['Sage Green', 'Cream'],
    ['Burgundy', 'Rose Gold'],
    ['Lavender', 'Gray'],
    ['Coral', 'Peach'],
    ['Emerald', 'Ivory'],
    ['Dusty Blue', 'Champagne']
  ];

  const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.aesthetic && preferences.venue && preferences.colors.length > 0 && preferences.season) {
      onGenerate(preferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Sparkles className="h-6 w-6 mr-2" />
            Customize Your Vision Board
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Aesthetic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Event Aesthetic *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {aestheticOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, aesthetic: option }))}
                  className={`p-3 text-left border-2 rounded-lg transition-all ${
                    preferences.aesthetic === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Venue Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {venueOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, venue: option }))}
                  className={`p-3 text-left border-2 rounded-lg transition-all ${
                    preferences.venue === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Palette *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((colors, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, colors }))}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    JSON.stringify(preferences.colors) === JSON.stringify(colors)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full bg-primary-300"></div>
                      <div className="w-4 h-4 rounded-full bg-sage-300"></div>
                    </div>
                    <span className="text-sm font-medium">{colors.join(' & ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Wedding Season *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {seasonOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, season: option }))}
                  className={`p-3 text-center border-2 rounded-lg transition-all ${
                    preferences.season === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Must-Have Elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Must-Have Design Elements
            </label>
            <textarea
              value={preferences.mustHave}
              onChange={(e) => setPreferences(prev => ({ ...prev, mustHave: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., string lights, greenery, candles, vintage details..."
            />
          </div>

          {/* Elements to Avoid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elements to Avoid
            </label>
            <textarea
              value={preferences.avoid}
              onChange={(e) => setPreferences(prev => ({ ...prev, avoid: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., bright colors, formal elements, modern furniture..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={!preferences.aesthetic || !preferences.venue || preferences.colors.length === 0 || !preferences.season}
              className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate Vision Board
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}