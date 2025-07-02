import React, { useState } from 'react';
import { Palette, Type, Image, MapPin, Calendar, Gift, Plane, Sparkles, Save, Upload, Plus, Trash2, Edit3 } from 'lucide-react';
import { useDeepseek } from '../../hooks/useDeepseek';

interface WebsiteBuilderProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
  onGenerateStory: (style: 'romantic' | 'casual' | 'formal') => void;
  isGenerating: boolean;
}

export default function WebsiteBuilder({ websiteData, onUpdate, onGenerateStory, isGenerating }: WebsiteBuilderProps) {
  const [activeSection, setActiveSection] = useState<'theme' | 'content' | 'photos' | 'details'>('theme');
  const [showCustomCSS, setShowCustomCSS] = useState(false);

  const { generateStory } = useDeepseek({
    onSuccess: (data) => {
      if (data && data.story) {
        updateContent('ourStory', { content: data.story });
      }
    },
    onError: (error) => {
      console.error('Failed to generate story:', error);
    }
  });

  const updateContent = (section: string, updates: any) => {
    onUpdate({
      content: {
        ...websiteData.content,
        [section]: {
          ...websiteData.content[section],
          ...updates
        }
      }
    });
  };

  const updateTheme = (updates: any) => {
    onUpdate({
      theme: {
        ...websiteData.theme,
        ...updates
      }
    });
  };

  const handleGenerateStory = async (style: 'romantic' | 'casual' | 'formal') => {
    try {
      const coupleInfo = {
        names: websiteData.content.coupleNames || 'The Happy Couple',
        style,
        weddingDate: websiteData.content.weddingDate,
        venue: websiteData.content.venue?.name,
        additionalInfo: 'A beautiful love story'
      };

      await generateStory(coupleInfo);
    } catch (error) {
      console.error('Failed to generate story:', error);
      // Fallback to the original method
      onGenerateStory(style);
    }
  };

  const addAccommodation = () => {
    const newAccommodation = {
      name: 'Hotel Name',
      address: 'Hotel Address',
      phone: '(555) 123-4567',
      website: 'https://hotel-website.com',
      rate: '$150/night'
    };

    updateContent('accommodations', [...websiteData.content.accommodations, newAccommodation]);
  };

  const removeAccommodation = (index: number) => {
    const updated = websiteData.content.accommodations.filter((_: any, i: number) => i !== index);
    updateContent('accommodations', updated);
  };

  const addRegistryStore = () => {
    const newStore = {
      name: 'Store Name',
      url: 'https://registry-url.com'
    };

    updateContent('registry', {
      ...websiteData.content.registry,
      stores: [...websiteData.content.registry.stores, newStore]
    });
  };

  const themeOptions = [
    { name: 'Classic & Elegant', colors: ['#F8BBD9', '#D4AF37'] },
    { name: 'Modern & Minimalist', colors: ['#2C3E50', '#ECF0F1'] },
    { name: 'Rustic & Bohemian', colors: ['#8B4513', '#DEB887'] },
    { name: 'Vintage & Romantic', colors: ['#D8BFD8', '#FFB6C1'] },
    { name: 'Beach & Tropical', colors: ['#20B2AA', '#FFE4B5'] },
    { name: 'Garden & Natural', colors: ['#9CAF88', '#F0FFF0'] }
  ];

  const fontOptions = [
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Lora', category: 'serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Crimson Text', category: 'serif' },
    { name: 'Nunito', category: 'sans-serif' }
  ];

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'theme', label: 'Theme & Style', icon: Palette },
          { key: 'content', label: 'Content', icon: Edit3 },
          { key: 'photos', label: 'Photos', icon: Image },
          { key: 'details', label: 'Event Details', icon: Calendar }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeSection === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Theme & Style Section */}
      {activeSection === 'theme' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Theme</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {themeOptions.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => updateTheme({ style: theme.name, colors: theme.colors })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    websiteData.theme.style === theme.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex space-x-2 mb-3">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <p className="font-medium text-gray-800">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Heading Font</h4>
              <select
                value={websiteData.theme.fonts.heading}
                onChange={(e) => updateTheme({
                  fonts: { ...websiteData.theme.fonts, heading: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {fontOptions.map((font) => (
                  <option key={font.name} value={font.name}>
                    {font.name} ({font.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-4">Body Font</h4>
              <select
                value={websiteData.theme.fonts.body}
                onChange={(e) => updateTheme({
                  fonts: { ...websiteData.theme.fonts, body: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {fontOptions.map((font) => (
                  <option key={font.name} value={font.name}>
                    {font.name} ({font.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">Custom CSS</h4>
              <button
                onClick={() => setShowCustomCSS(!showCustomCSS)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showCustomCSS ? 'Hide' : 'Show'} Advanced Styling
              </button>
            </div>
            {showCustomCSS && (
              <textarea
                value={websiteData.customCSS || ''}
                onChange={(e) => onUpdate({ customCSS: e.target.value })}
                placeholder="/* Add your custom CSS here */"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      {activeSection === 'content' && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couple Names</label>
              <input
                type="text"
                value={websiteData.content.coupleNames}
                onChange={(e) => updateContent('coupleNames', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
              <input
                type="date"
                value={websiteData.content.weddingDate}
                onChange={(e) => updateContent('weddingDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">Our Story</h4>
              <div className="flex items-center space-x-2">
                <select
                  value={websiteData.content.ourStory.style}
                  onChange={(e) => updateContent('ourStory', { style: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="romantic">Romantic</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
                <button
                  onClick={() => handleGenerateStory(websiteData.content.ourStory.style)}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
                </button>
              </div>
            </div>
            <textarea
              value={websiteData.content.ourStory.content}
              onChange={(e) => updateContent('ourStory', { content: e.target.value })}
              placeholder="Tell your love story..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-4">Venue Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Venue Name</label>
                <input
                  type="text"
                  value={websiteData.content.venue.name}
                  onChange={(e) => updateContent('venue', { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                <input
                  type="text"
                  value={websiteData.content.venue.address}
                  onChange={(e) => updateContent('venue', { address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-4">Registry</h4>
            <div className="space-y-4">
              <textarea
                value={websiteData.content.registry.message}
                onChange={(e) => updateContent('registry', { message: e.target.value })}
                placeholder="Registry message for your guests..."
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <div className="space-y-3">
                {websiteData.content.registry.stores.map((store: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={store.name}
                      onChange={(e) => {
                        const updated = [...websiteData.content.registry.stores];
                        updated[index] = { ...store, name: e.target.value };
                        updateContent('registry', { stores: updated });
                      }}
                      placeholder="Store name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      value={store.url}
                      onChange={(e) => {
                        const updated = [...websiteData.content.registry.stores];
                        updated[index] = { ...store, url: e.target.value };
                        updateContent('registry', { stores: updated });
                      }}
                      placeholder="Registry URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const updated = websiteData.content.registry.stores.filter((_: any, i: number) => i !== index);
                        updateContent('registry', { stores: updated });
                      }}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addRegistryStore}
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Registry Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photos Section */}
      {activeSection === 'photos' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Photo Gallery</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Photos</h4>
              <p className="text-gray-500 mb-4">Add engagement photos, venue shots, and other memories</p>
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Choose Photos
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-4">Our Story Photos</h4>
            <div className="grid grid-cols-3 gap-4">
              {websiteData.content.ourStory.photos.length > 0 ? (
                websiteData.content.ourStory.photos.map((photo: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Story photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const updated = websiteData.content.ourStory.photos.filter((_: string, i: number) => i !== index);
                        updateContent('ourStory', { photos: updated });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No photos uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Section */}
      {activeSection === 'details' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Ceremony</h4>
                <div className="space-y-3">
                  <input
                    type="time"
                    value={websiteData.content.schedule.ceremony.time}
                    onChange={(e) => updateContent('schedule', {
                      ceremony: { ...websiteData.content.schedule.ceremony, time: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={websiteData.content.schedule.ceremony.location}
                    onChange={(e) => updateContent('schedule', {
                      ceremony: { ...websiteData.content.schedule.ceremony, location: e.target.value }
                    })}
                    placeholder="Ceremony location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Reception</h4>
                <div className="space-y-3">
                  <input
                    type="time"
                    value={websiteData.content.schedule.reception.time}
                    onChange={(e) => updateContent('schedule', {
                      reception: { ...websiteData.content.schedule.reception, time: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={websiteData.content.schedule.reception.location}
                    onChange={(e) => updateContent('schedule', {
                      reception: { ...websiteData.content.schedule.reception, location: e.target.value }
                    })}
                    placeholder="Reception location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Accommodations</h3>
            <div className="space-y-4">
              {websiteData.content.accommodations.map((accommodation: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={accommodation.name}
                      onChange={(e) => {
                        const updated = [...websiteData.content.accommodations];
                        updated[index] = { ...accommodation, name: e.target.value };
                        updateContent('accommodations', updated);
                      }}
                      placeholder="Hotel name"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={accommodation.rate}
                      onChange={(e) => {
                        const updated = [...websiteData.content.accommodations];
                        updated[index] = { ...accommodation, rate: e.target.value };
                        updateContent('accommodations', updated);
                      }}
                      placeholder="Rate per night"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={accommodation.address}
                      onChange={(e) => {
                        const updated = [...websiteData.content.accommodations];
                        updated[index] = { ...accommodation, address: e.target.value };
                        updateContent('accommodations', updated);
                      }}
                      placeholder="Address"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      value={accommodation.phone}
                      onChange={(e) => {
                        const updated = [...websiteData.content.accommodations];
                        updated[index] = { ...accommodation, phone: e.target.value };
                        updateContent('accommodations', updated);
                      }}
                      placeholder="Phone"
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={accommodation.website}
                        onChange={(e) => {
                          const updated = [...websiteData.content.accommodations];
                          updated[index] = { ...accommodation, website: e.target.value };
                          updateContent('accommodations', updated);
                        }}
                        placeholder="Website"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeAccommodation(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addAccommodation}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Accommodation</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Airport</label>
                <input
                  type="text"
                  value={websiteData.content.travel.airport}
                  onChange={(e) => updateContent('travel', { airport: e.target.value })}
                  placeholder="Airport name and code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Directions</label>
                <textarea
                  value={websiteData.content.travel.directions}
                  onChange={(e) => updateContent('travel', { directions: e.target.value })}
                  placeholder="Driving directions and transportation options"
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parking Information</label>
                <textarea
                  value={websiteData.content.travel.parking}
                  onChange={(e) => updateContent('travel', { parking: e.target.value })}
                  placeholder="Parking availability and instructions"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => onUpdate({})}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}