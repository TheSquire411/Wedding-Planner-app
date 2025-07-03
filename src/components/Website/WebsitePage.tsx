import React, { useState, useEffect } from 'react';
import { Heart, Globe, Eye, Settings, Users, BarChart3, Share2, Download, Palette, Edit3, Save, ExternalLink, Layout, Image, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import WebsiteBuilder from './WebsiteBuilder';
import WebsitePreview from './WebsitePreview';
import RSVPManager from './RSVPManager';
import WebsiteAnalytics from './WebsiteAnalytics';
import TemplateGallery from './TemplateGallery';
import AdvancedCustomizer from './AdvancedCustomizer';
import SectionBuilder from './SectionBuilder';
import BackButton from '../common/BackButton';

interface WebsiteData {
  id: string;
  url: string;
  isPublished: boolean;
  template: any;
  theme: {
    colors: string[];
    fonts: {
      heading: string;
      body: string;
    };
    style: string;
  };
  content: {
    coupleNames: string;
    weddingDate: string;
    venue: {
      name: string;
      address: string;
      coordinates?: { lat: number; lng: number };
    };
    ourStory: {
      content: string;
      style: 'romantic' | 'casual' | 'formal';
      photos: string[];
    };
    schedule: {
      ceremony: { time: string; location: string };
      reception: { time: string; location: string };
      additionalEvents: Array<{ name: string; time: string; location: string }>;
    };
    registry: {
      stores: Array<{ name: string; url: string }>;
      message: string;
    };
    accommodations: Array<{ name: string; address: string; phone: string; website: string; rate: string }>;
    travel: {
      airport: string;
      directions: string;
      parking: string;
    };
  };
  sections: any[];
  customizations: any;
  rsvp: {
    enabled: boolean;
    deadline: string;
    questions: Array<{
      id: string;
      type: 'text' | 'select' | 'radio' | 'checkbox';
      question: string;
      options?: string[];
      required: boolean;
    }>;
  };
  customCSS?: string;
  analytics: {
    views: number;
    rsvpResponses: number;
    lastUpdated: Date;
  };
}

export default function WebsitePage() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'sections' | 'customizer' | 'preview' | 'rsvp' | 'analytics'>('templates');
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    // Initialize website data from user profile
    if (state.user && !websiteData) {
      initializeWebsite();
    }
  }, [state.user]);

  const initializeWebsite = () => {
    if (!state.user) return;

    const initialWebsite: WebsiteData = {
      id: Date.now().toString(),
      url: `${state.user.name.toLowerCase().replace(/\s+/g, '')}-wedding.blissful.com`,
      isPublished: false,
      template: null,
      theme: {
        colors: state.user.styleProfile?.colors || ['#F8BBD9', '#D4AF37'],
        fonts: {
          heading: 'Playfair Display',
          body: 'Inter'
        },
        style: state.user.styleProfile?.style || 'Classic & Elegant'
      },
      content: {
        coupleNames: `${state.user.name} & ${state.user.partner || 'Partner'}`,
        weddingDate: state.user.weddingDate || '',
        venue: {
          name: 'Wedding Venue',
          address: 'Venue Address'
        },
        ourStory: {
          content: '',
          style: 'romantic',
          photos: []
        },
        schedule: {
          ceremony: { time: '4:00 PM', location: 'Ceremony Location' },
          reception: { time: '6:00 PM', location: 'Reception Location' },
          additionalEvents: []
        },
        registry: {
          stores: [],
          message: 'Your presence is the only present we need!'
        },
        accommodations: [],
        travel: {
          airport: '',
          directions: '',
          parking: ''
        }
      },
      sections: [],
      customizations: {},
      rsvp: {
        enabled: true,
        deadline: '',
        questions: [
          {
            id: '1',
            type: 'radio',
            question: 'Will you be attending?',
            options: ['Yes, I will attend', 'No, I cannot attend'],
            required: true
          },
          {
            id: '2',
            type: 'select',
            question: 'Meal preference',
            options: ['Chicken', 'Fish', 'Vegetarian', 'Vegan'],
            required: true
          },
          {
            id: '3',
            type: 'text',
            question: 'Dietary restrictions or allergies',
            required: false
          }
        ]
      },
      analytics: {
        views: 0,
        rsvpResponses: 0,
        lastUpdated: new Date()
      }
    };

    setWebsiteData(initialWebsite);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    if (websiteData) {
      setWebsiteData({
        ...websiteData,
        template,
        theme: {
          ...websiteData.theme,
          colors: template.colors,
          style: template.category
        }
      });
    }
    setActiveTab('builder');
  };

  const generateOurStory = async (style: 'romantic' | 'casual' | 'formal') => {
    if (!state.user) return;

    setIsGenerating(true);

    // Simulate AI story generation
    setTimeout(() => {
      const stories = {
        romantic: `Our love story began like something out of a fairy tale. From the moment we first met, we knew there was something special between us. Through laughter, adventures, and quiet moments together, our bond grew stronger each day. Now, we're ready to begin the next chapter of our journey as husband and wife, surrounded by the love and support of our family and friends.`,
        
        casual: `We met through mutual friends and instantly clicked over our shared love of coffee and terrible puns. What started as friendship quickly blossomed into something more. After countless adventures, inside jokes, and lazy Sunday mornings together, we decided it was time to make it official. We can't wait to celebrate with everyone who has been part of our story!`,
        
        formal: `It is with great joy that we invite you to celebrate our union. Our relationship has been built on a foundation of mutual respect, shared values, and unwavering support for one another. We have grown together through life's challenges and triumphs, and we look forward to continuing this journey as partners in marriage. Your presence at our wedding would honor us greatly.`
      };

      if (websiteData) {
        setWebsiteData({
          ...websiteData,
          content: {
            ...websiteData.content,
            ourStory: {
              ...websiteData.content.ourStory,
              content: stories[style],
              style
            }
          }
        });
      }

      setIsGenerating(false);
    }, 2000);
  };

  const publishWebsite = () => {
    if (!websiteData) return;

    setWebsiteData({
      ...websiteData,
      isPublished: true,
      analytics: {
        ...websiteData.analytics,
        lastUpdated: new Date()
      }
    });

    alert(`Your wedding website is now live at: ${websiteData.url}`);
  };

  const updateWebsiteData = (updates: Partial<WebsiteData>) => {
    if (!websiteData) return;

    setWebsiteData({
      ...websiteData,
      ...updates,
      analytics: {
        ...websiteData.analytics,
        lastUpdated: new Date()
      }
    });
  };

  if (!websiteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing your wedding website...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackButton />
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Wedding Website Studio</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>{websiteData.url}</span>
              {websiteData.isPublished && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Live
                </span>
              )}
            </div>
            <button
              onClick={() => window.open(`https://${websiteData.url}`, '_blank')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Live</span>
            </button>
            <button
              onClick={publishWebsite}
              disabled={websiteData.isPublished}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{websiteData.isPublished ? 'Published' : 'Publish'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Create Your Perfect Wedding Website</h1>
          <p className="text-xl text-gray-600">Design a beautiful, personalized website that captures your love story</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Eye className="h-6 w-6 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Page Views</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">{websiteData.analytics.views}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold text-gray-800">RSVP Responses</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">{websiteData.analytics.rsvpResponses}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Layout className="h-6 w-6 text-purple-500" />
              <h3 className="font-semibold text-gray-800">Template</h3>
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {selectedTemplate ? selectedTemplate.name : 'Not Selected'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="h-6 w-6 text-primary-500" />
              <h3 className="font-semibold text-gray-800">Status</h3>
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {websiteData.isPublished ? (
                <span className="text-green-600">Published</span>
              ) : (
                <span className="text-yellow-600">Draft</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { key: 'templates', label: 'Templates', icon: Layout },
                { key: 'builder', label: 'Content', icon: Edit3 },
                { key: 'sections', label: 'Sections', icon: Image },
                { key: 'customizer', label: 'Customize', icon: Palette },
                { key: 'preview', label: 'Preview', icon: Eye },
                { key: 'rsvp', label: 'RSVP', icon: Users },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'templates' && (
              <TemplateGallery
                onSelectTemplate={handleTemplateSelect}
                selectedTemplate={selectedTemplate}
              />
            )}

            {activeTab === 'builder' && (
              <WebsiteBuilder
                websiteData={websiteData}
                onUpdate={updateWebsiteData}
                onGenerateStory={generateOurStory}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'sections' && (
              <SectionBuilder
                sections={websiteData.sections}
                onUpdateSections={(sections) => updateWebsiteData({ sections })}
                inspirationImages={state.inspirationImages}
              />
            )}

            {activeTab === 'customizer' && selectedTemplate && (
              <AdvancedCustomizer
                websiteData={websiteData}
                onUpdate={updateWebsiteData}
                selectedTemplate={selectedTemplate}
              />
            )}

            {activeTab === 'preview' && (
              <WebsitePreview
                websiteData={websiteData}
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
              />
            )}

            {activeTab === 'rsvp' && (
              <RSVPManager
                websiteData={websiteData}
                onUpdate={updateWebsiteData}
              />
            )}

            {activeTab === 'analytics' && (
              <WebsiteAnalytics
                websiteData={websiteData}
              />
            )}
          </div>
        </div>

        {/* Getting Started Guide */}
        {!selectedTemplate && activeTab === 'templates' && (
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-sage-50 rounded-2xl p-8">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                Create Your Dream Wedding Website
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Follow these simple steps to create a stunning wedding website that perfectly captures your love story and provides all the information your guests need.
              </p>
              <div className="grid md:grid-cols-4 gap-6 text-left">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Choose Template</h3>
                  <p className="text-sm text-gray-600">Select from 100+ professionally designed templates</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Add Content</h3>
                  <p className="text-sm text-gray-600">Customize with your story, photos, and wedding details</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Customize Design</h3>
                  <p className="text-sm text-gray-600">Personalize colors, fonts, and layout to match your style</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mb-3">4</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Publish & Share</h3>
                  <p className="text-sm text-gray-600">Go live and share your beautiful website with guests</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}