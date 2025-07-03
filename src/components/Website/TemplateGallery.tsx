import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Heart, Download, Palette, Layout, Sparkles, Star, Crown } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'elegant' | 'modern' | 'rustic' | 'vintage' | 'beach' | 'garden' | 'luxury' | 'minimalist';
  style: 'classic' | 'bold' | 'romantic' | 'contemporary';
  preview: string;
  thumbnail: string;
  features: string[];
  isPremium: boolean;
  rating: number;
  downloads: number;
  colors: string[];
  description: string;
}

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplate?: Template;
}

export default function TemplateGallery({ onSelectTemplate, selectedTemplate }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  // Mock template data - in a real app, this would come from an API
  const templates: Template[] = [
    {
      id: 'elegant-rose',
      name: 'Elegant Rose',
      category: 'elegant',
      style: 'classic',
      preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      features: ['Photo Gallery', 'RSVP Form', 'Timeline', 'Gift Registry'],
      isPremium: false,
      rating: 4.8,
      downloads: 1250,
      colors: ['#F8BBD9', '#D4AF37', '#FFFFFF'],
      description: 'A timeless and elegant design perfect for classic weddings'
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'modern',
      style: 'contemporary',
      preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      features: ['Clean Layout', 'Mobile Optimized', 'Interactive Map', 'Social Media'],
      isPremium: true,
      rating: 4.9,
      downloads: 890,
      colors: ['#2C3E50', '#ECF0F1', '#3498DB'],
      description: 'Clean and contemporary design for modern couples'
    },
    {
      id: 'rustic-charm',
      name: 'Rustic Charm',
      category: 'rustic',
      style: 'romantic',
      preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      features: ['Wooden Textures', 'Handwritten Fonts', 'Photo Collage', 'Story Timeline'],
      isPremium: false,
      rating: 4.7,
      downloads: 2100,
      colors: ['#8B4513', '#DEB887', '#F4A460'],
      description: 'Warm and inviting design with rustic elements'
    },
    {
      id: 'vintage-romance',
      name: 'Vintage Romance',
      category: 'vintage',
      style: 'romantic',
      preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      features: ['Vintage Borders', 'Sepia Effects', 'Ornate Details', 'Love Letters'],
      isPremium: true,
      rating: 4.6,
      downloads: 750,
      colors: ['#D8BFD8', '#FFB6C1', '#F0E68C'],
      description: 'Nostalgic design with vintage charm and romantic details'
    },
    {
      id: 'beach-bliss',
      name: 'Beach Bliss',
      category: 'beach',
      style: 'contemporary',
      preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      features: ['Ocean Waves', 'Sandy Textures', 'Sunset Colors', 'Coastal Vibes'],
      isPremium: false,
      rating: 4.5,
      downloads: 1680,
      colors: ['#20B2AA', '#F0F8FF', '#FFE4B5'],
      description: 'Perfect for beach and coastal weddings'
    },
    {
      id: 'garden-party',
      name: 'Garden Party',
      category: 'garden',
      style: 'romantic',
      preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      features: ['Floral Patterns', 'Green Accents', 'Nature Elements', 'Botanical Details'],
      isPremium: true,
      rating: 4.8,
      downloads: 920,
      colors: ['#9CAF88', '#F0FFF0', '#98FB98'],
      description: 'Natural and fresh design for garden weddings'
    },
    {
      id: 'luxury-gold',
      name: 'Luxury Gold',
      category: 'luxury',
      style: 'bold',
      preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      features: ['Gold Accents', 'Premium Fonts', 'Elegant Animations', 'Luxury Feel'],
      isPremium: true,
      rating: 4.9,
      downloads: 450,
      colors: ['#D4AF37', '#000000', '#FFFFFF'],
      description: 'Opulent design for luxury weddings'
    },
    {
      id: 'minimalist-chic',
      name: 'Minimalist Chic',
      category: 'minimalist',
      style: 'contemporary',
      preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      features: ['Clean Lines', 'White Space', 'Typography Focus', 'Simple Elegance'],
      isPremium: false,
      rating: 4.7,
      downloads: 1340,
      colors: ['#FFFFFF', '#000000', '#F5F5F5'],
      description: 'Less is more - perfect for minimalist couples'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Templates', count: templates.length },
    { value: 'elegant', label: 'Elegant', count: templates.filter(t => t.category === 'elegant').length },
    { value: 'modern', label: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { value: 'rustic', label: 'Rustic', count: templates.filter(t => t.category === 'rustic').length },
    { value: 'vintage', label: 'Vintage', count: templates.filter(t => t.category === 'vintage').length },
    { value: 'beach', label: 'Beach', count: templates.filter(t => t.category === 'beach').length },
    { value: 'garden', label: 'Garden', count: templates.filter(t => t.category === 'garden').length },
    { value: 'luxury', label: 'Luxury', count: templates.filter(t => t.category === 'luxury').length },
    { value: 'minimalist', label: 'Minimalist', count: templates.filter(t => t.category === 'minimalist').length }
  ];

  const styles = [
    { value: 'all', label: 'All Styles' },
    { value: 'classic', label: 'Classic' },
    { value: 'bold', label: 'Bold' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'contemporary', label: 'Contemporary' }
  ];

  const filteredTemplates = useMemo(() => {
    return templates
      .filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesStyle = selectedStyle === 'all' || template.style === selectedStyle;
        const matchesPremium = !showPremiumOnly || template.isPremium;
        
        return matchesSearch && matchesCategory && matchesStyle && matchesPremium;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.downloads - a.downloads;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.name.localeCompare(a.name); // Mock newest sort
          default:
            return 0;
        }
      });
  }, [templates, searchTerm, selectedCategory, selectedStyle, showPremiumOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Choose Your Perfect Template</h2>
        <p className="text-xl text-gray-600">Over 100 professionally designed templates to match your wedding style</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or style..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {styles.map(style => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Premium templates only</span>
          </label>
          <div className="text-sm text-gray-500">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Template Preview */}
            <div className="relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-gold-400 to-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>PRO</span>
                  </span>
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Color Palette */}
              <div className="absolute bottom-3 left-3 flex space-x-1">
                {template.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{template.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{template.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {template.category}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Download className="h-3 w-3" />
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{template.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedTemplate?.id === template.id && (
              <div className="bg-primary-500 text-white text-center py-2">
                <span className="text-sm font-medium">Selected Template</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters to see more templates</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStyle('all');
              setShowPremiumOnly(false);
            }}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Template Stats */}
      <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-2xl p-6">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{templates.length}+</div>
            <div className="text-sm text-gray-600">Professional Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-sage-600">{templates.filter(t => !t.isPremium).length}</div>
            <div className="text-sm text-gray-600">Free Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gold-600">{templates.filter(t => t.isPremium).length}</div>
            <div className="text-sm text-gray-600">Premium Templates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Style Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}