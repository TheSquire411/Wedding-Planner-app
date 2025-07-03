import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Move, Copy, Eye, Settings, Image, Type, Layout, Users, Calendar, Gift, MapPin, Heart, Star, Camera, Music, Flower } from 'lucide-react';

interface Section {
  id: string;
  type: 'hero' | 'story' | 'timeline' | 'gallery' | 'wedding-party' | 'schedule' | 'registry' | 'accommodations' | 'rsvp' | 'contact' | 'custom';
  title: string;
  content: any;
  settings: {
    backgroundColor: string;
    textColor: string;
    padding: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
    fullWidth: boolean;
    showDivider: boolean;
  };
  isVisible: boolean;
  order: number;
}

interface SectionBuilderProps {
  sections: Section[];
  onUpdateSections: (sections: Section[]) => void;
  inspirationImages: any[];
}

export default function SectionBuilder({ sections, onUpdateSections, inspirationImages }: SectionBuilderProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const sectionTypes = [
    { type: 'hero', name: 'Hero Section', icon: Star, description: 'Main banner with names and date' },
    { type: 'story', name: 'Our Story', icon: Heart, description: 'Tell your love story' },
    { type: 'timeline', name: 'Timeline', icon: Calendar, description: 'Relationship milestones' },
    { type: 'gallery', name: 'Photo Gallery', icon: Camera, description: 'Wedding and engagement photos' },
    { type: 'wedding-party', name: 'Wedding Party', icon: Users, description: 'Bridesmaids and groomsmen' },
    { type: 'schedule', name: 'Schedule', icon: Calendar, description: 'Wedding day timeline' },
    { type: 'registry', name: 'Gift Registry', icon: Gift, description: 'Wedding gift registry' },
    { type: 'accommodations', name: 'Accommodations', icon: MapPin, description: 'Hotel recommendations' },
    { type: 'rsvp', name: 'RSVP', icon: Users, description: 'RSVP form and information' },
    { type: 'contact', name: 'Contact', icon: MapPin, description: 'Contact information and map' },
    { type: 'custom', name: 'Custom Section', icon: Layout, description: 'Create your own section' }
  ];

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: sectionTypes.find(s => s.type === type)?.name || 'New Section',
      content: getDefaultContent(type),
      settings: {
        backgroundColor: '#FFFFFF',
        textColor: '#333333',
        padding: 'medium',
        alignment: 'center',
        fullWidth: false,
        showDivider: true
      },
      isVisible: true,
      order: sections.length
    };

    onUpdateSections([...sections, newSection]);
    setShowSectionLibrary(false);
  };

  const getDefaultContent = (type: Section['type']) => {
    switch (type) {
      case 'hero':
        return {
          backgroundImage: '',
          title: 'Sarah & Michael',
          subtitle: 'September 15, 2024',
          description: 'Join us as we celebrate our love',
          showCountdown: true
        };
      case 'story':
        return {
          title: 'Our Love Story',
          content: 'Tell your beautiful love story here...',
          photos: [],
          layout: 'text-image'
        };
      case 'timeline':
        return {
          title: 'Our Journey',
          events: [
            { date: '2020', title: 'First Met', description: 'We met at...' },
            { date: '2022', title: 'Got Engaged', description: 'The proposal...' },
            { date: '2024', title: 'Wedding Day', description: 'Our special day' }
          ]
        };
      case 'gallery':
        return {
          title: 'Photo Gallery',
          layout: 'grid',
          columns: 3,
          photos: []
        };
      case 'wedding-party':
        return {
          title: 'Wedding Party',
          bridesmaids: [],
          groomsmen: []
        };
      case 'schedule':
        return {
          title: 'Wedding Day Schedule',
          events: [
            { time: '4:00 PM', title: 'Ceremony', location: 'Garden Venue' },
            { time: '5:00 PM', title: 'Cocktail Hour', location: 'Terrace' },
            { time: '6:00 PM', title: 'Reception', location: 'Ballroom' }
          ]
        };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    onUpdateSections(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const updatedSections = sections.filter(section => section.id !== sectionId);
      onUpdateSections(updatedSections);
    }
  };

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = sections.find(s => s.id === sectionId);
    if (sectionToDuplicate) {
      const duplicatedSection: Section = {
        ...sectionToDuplicate,
        id: Date.now().toString(),
        title: `${sectionToDuplicate.title} (Copy)`,
        order: sections.length
      };
      onUpdateSections([...sections, duplicatedSection]);
    }
  };

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    const draggedSection = sections[dragIndex];
    const newSections = [...sections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    // Update order values
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    onUpdateSections(reorderedSections);
  };

  const getSectionIcon = (type: Section['type']) => {
    const sectionType = sectionTypes.find(s => s.type === type);
    return sectionType ? sectionType.icon : Layout;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Section Builder</h2>
          <p className="text-gray-600">Customize your website sections and content</p>
        </div>
        <button
          onClick={() => setShowSectionLibrary(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => {
            const SectionIcon = getSectionIcon(section.type);
            return (
              <div
                key={section.id}
                className={`bg-white rounded-lg border-2 transition-all ${
                  editingSection === section.id ? 'border-primary-500' : 'border-gray-200'
                } ${!section.isVisible ? 'opacity-50' : ''}`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="cursor-move">
                      <Move className="h-5 w-5 text-gray-400" />
                    </div>
                    <SectionIcon className="h-5 w-5 text-primary-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{section.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{section.type} section</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateSection(section.id, { isVisible: !section.isVisible })}
                      className={`p-2 rounded-lg transition-colors ${
                        section.isVisible
                          ? 'text-green-600 bg-green-100 hover:bg-green-200'
                          : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={section.isVisible ? 'Hide section' : 'Show section'}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                      className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit section"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateSection(section.id)}
                      className="p-2 text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Duplicate section"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Section Editor */}
                {editingSection === section.id && (
                  <div className="p-6 bg-gray-50">
                    <SectionEditor
                      section={section}
                      onUpdate={(updates) => updateSection(section.id, updates)}
                      inspirationImages={inspirationImages}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No sections yet</h3>
          <p className="text-gray-500 mb-6">Start building your website by adding your first section</p>
          <button
            onClick={() => setShowSectionLibrary(true)}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Your First Section
          </button>
        </div>
      )}

      {/* Section Library Modal */}
      {showSectionLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Add New Section</h3>
                <button
                  onClick={() => setShowSectionLibrary(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionTypes.map((sectionType) => {
                  const Icon = sectionType.icon;
                  return (
                    <button
                      key={sectionType.type}
                      onClick={() => addSection(sectionType.type)}
                      className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                    >
                      <Icon className="h-8 w-8 text-primary-500 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">{sectionType.name}</h4>
                      <p className="text-sm text-gray-600">{sectionType.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Section Editor Component
interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  inspirationImages: any[];
}

function SectionEditor({ section, onUpdate, inspirationImages }: SectionEditorProps) {
  const updateContent = (updates: any) => {
    onUpdate({ content: { ...section.content, ...updates } });
  };

  const updateSettings = (updates: any) => {
    onUpdate({ settings: { ...section.settings, ...updates } });
  };

  return (
    <div className="space-y-6">
      {/* Section Settings */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Section Settings</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={section.settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={section.settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Editor based on section type */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4">Content</h4>
        {section.type === 'hero' && (
          <HeroEditor content={section.content} onUpdate={updateContent} />
        )}
        {section.type === 'story' && (
          <StoryEditor content={section.content} onUpdate={updateContent} inspirationImages={inspirationImages} />
        )}
        {section.type === 'gallery' && (
          <GalleryEditor content={section.content} onUpdate={updateContent} inspirationImages={inspirationImages} />
        )}
        {/* Add more section editors as needed */}
      </div>
    </div>
  );
}

// Individual Section Editors
function HeroEditor({ content, onUpdate }: { content: any; onUpdate: (updates: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Sarah & Michael"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="September 15, 2024"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={3}
          placeholder="Join us as we celebrate our love"
        />
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.showCountdown || false}
            onChange={(e) => onUpdate({ showCountdown: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Show countdown timer</span>
        </label>
      </div>
    </div>
  );
}

function StoryEditor({ content, onUpdate, inspirationImages }: { content: any; onUpdate: (updates: any) => void; inspirationImages: any[] }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Our Love Story"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Story Content</label>
        <textarea
          value={content.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={6}
          placeholder="Tell your beautiful love story here..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
        <select
          value={content.layout || 'text-image'}
          onChange={(e) => onUpdate({ layout: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="text-only">Text Only</option>
          <option value="text-image">Text with Image</option>
          <option value="image-text">Image with Text</option>
          <option value="split">Split Layout</option>
        </select>
      </div>
    </div>
  );
}

function GalleryEditor({ content, onUpdate, inspirationImages }: { content: any; onUpdate: (updates: any) => void; inspirationImages: any[] }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Photo Gallery"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
          <select
            value={content.layout || 'grid'}
            onChange={(e) => onUpdate({ layout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="grid">Grid Layout</option>
            <option value="masonry">Masonry Layout</option>
            <option value="carousel">Carousel</option>
            <option value="slideshow">Slideshow</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <select
            value={content.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
            <option value={5}>5 Columns</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Photos from Inspiration Gallery</label>
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
          {inspirationImages.map((image) => (
            <button
              key={image.id}
              onClick={() => {
                const currentPhotos = content.photos || [];
                const isSelected = currentPhotos.includes(image.url);
                const newPhotos = isSelected
                  ? currentPhotos.filter((url: string) => url !== image.url)
                  : [...currentPhotos, image.url];
                onUpdate({ photos: newPhotos });
              }}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                (content.photos || []).includes(image.url)
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image.thumbnail}
                alt={image.filename}
                className="w-full h-full object-cover"
              />
              {(content.photos || []).includes(image.url) && (
                <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white rotate-45" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {(content.photos || []).length} photos selected
        </p>
      </div>
    </div>
  );
}