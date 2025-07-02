import React from 'react';
import { Monitor, Smartphone, ExternalLink, Share2 } from 'lucide-react';

interface WebsitePreviewProps {
  websiteData: any;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export default function WebsitePreview({ websiteData, previewMode, onPreviewModeChange }: WebsitePreviewProps) {
  const { theme, content } = websiteData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Website Preview</h3>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPreviewModeChange('desktop')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => onPreviewModeChange('mobile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Tab</span>
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-gray-100 rounded-lg p-8 flex justify-center">
        <div
          className={`bg-white shadow-2xl overflow-hidden transition-all ${
            previewMode === 'desktop'
              ? 'w-full max-w-5xl rounded-lg'
              : 'w-80 rounded-2xl border-8 border-gray-800'
          }`}
          style={{
            fontFamily: theme.fonts.body,
            '--primary-color': theme.colors[0],
            '--secondary-color': theme.colors[1]
          } as React.CSSProperties}
        >
          {/* Website Content */}
          <div className="overflow-y-auto" style={{ height: previewMode === 'desktop' ? '600px' : '700px' }}>
            {/* Hero Section */}
            <section
              className="relative bg-gradient-to-br from-primary-100 to-secondary-100 text-center py-20 px-6"
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}20, ${theme.colors[1]}20)`
              }}
            >
              <div className="max-w-4xl mx-auto">
                <h1
                  className="text-5xl md:text-7xl font-bold mb-6"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors[0]
                  }}
                >
                  {content.coupleNames}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-8">
                  {formatDate(content.weddingDate)}
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  {content.venue.name} • {content.venue.address}
                </p>
                <button
                  className="px-8 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.colors[0] }}
                >
                  RSVP Now
                </button>
              </div>
            </section>

            {/* Our Story Section */}
            {content.ourStory.content && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-8"
                    style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors[0]
                    }}
                  >
                    Our Story
                  </h2>
                  <div className="prose prose-lg mx-auto text-gray-700">
                    <p className="leading-relaxed">{content.ourStory.content}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Schedule Section */}
            <section className="py-16 px-6 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-3xl md:text-4xl font-bold text-center mb-12"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors[0]
                  }}
                >
                  Schedule
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors[0] }}>
                      Ceremony
                    </h3>
                    <p className="text-lg font-medium text-gray-800 mb-2">
                      {formatTime(content.schedule.ceremony.time)}
                    </p>
                    <p className="text-gray-600">{content.schedule.ceremony.location}</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors[0] }}>
                      Reception
                    </h3>
                    <p className="text-lg font-medium text-gray-800 mb-2">
                      {formatTime(content.schedule.reception.time)}
                    </p>
                    <p className="text-gray-600">{content.schedule.reception.location}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Registry Section */}
            {content.registry.stores.length > 0 && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-8"
                    style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors[0]
                    }}
                  >
                    Registry
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">{content.registry.message}</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.registry.stores.map((store: any, index: number) => (
                      <a
                        key={index}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                        style={{ borderColor: theme.colors[1] }}
                      >
                        <span className="font-semibold" style={{ color: theme.colors[0] }}>
                          {store.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Accommodations Section */}
            {content.accommodations.length > 0 && (
              <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                    style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors[0]
                    }}
                  >
                    Accommodations
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {content.accommodations.map((hotel: any, index: number) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors[0] }}>
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{hotel.address}</p>
                        <p className="text-gray-600 mb-2">{hotel.phone}</p>
                        <p className="font-semibold text-gray-800 mb-3">{hotel.rate}</p>
                        {hotel.website && (
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: theme.colors[0] }}
                          >
                            Book Now
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Travel Section */}
            {(content.travel.airport || content.travel.directions || content.travel.parking) && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                    style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors[0]
                    }}
                  >
                    Travel & Directions
                  </h2>
                  <div className="space-y-8">
                    {content.travel.airport && (
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors[0] }}>
                          Nearest Airport
                        </h3>
                        <p className="text-gray-700">{content.travel.airport}</p>
                      </div>
                    )}
                    {content.travel.directions && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors[0] }}>
                          Directions
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{content.travel.directions}</p>
                      </div>
                    )}
                    {content.travel.parking && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors[0] }}>
                          Parking
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{content.travel.parking}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* RSVP Section */}
            <section
              className="py-16 px-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}10, ${theme.colors[1]}10)`
              }}
            >
              <div className="max-w-2xl mx-auto">
                <h2
                  className="text-3xl md:text-4xl font-bold mb-8"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors[0]
                  }}
                >
                  RSVP
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  Please let us know if you'll be joining us for our special day!
                </p>
                <button
                  className="px-8 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.colors[0] }}
                >
                  RSVP Now
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-800 text-white text-center">
              <p className="mb-2">
                {content.coupleNames}
              </p>
              <p className="text-gray-400">
                {formatDate(content.weddingDate)}
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* Custom CSS Preview */}
      {websiteData.customCSS && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Applied Custom CSS</h4>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{websiteData.customCSS}</code>
          </pre>
        </div>
      )}
    </div>
  );
}