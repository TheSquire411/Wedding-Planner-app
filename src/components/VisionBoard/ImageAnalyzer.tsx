import React, { useState } from 'react';
import { Camera, Sparkles, Eye, Download, Share2, X, Palette, Flower, MapPin, Calendar, Tag, Star } from 'lucide-react';

interface ImageAnalysisResult {
  id: string;
  imageUrl: string;
  analysis: {
    weddingDress?: {
      silhouette: string;
      neckline: string;
      fabric: string;
      embellishments: string[];
      styleCategory: string;
      confidence: number;
    };
    florals?: {
      mainFlowers: string[];
      colorPalette: string[];
      arrangementStyle: string;
      season: string;
      greenery: string[];
      confidence: number;
    };
    venue?: {
      settingType: string;
      architecturalStyle: string;
      keyFeatures: string[];
      lighting: string;
      searchTerms: string[];
      confidence: number;
    };
    overallStyle: {
      aesthetic: string;
      keywords: string[];
      colorScheme: string[];
      mood: string;
      trends: string[];
    };
  };
  timestamp: Date;
}

interface ImageAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete: (analysis: ImageAnalysisResult) => void;
  onClose: () => void;
}

export default function ImageAnalyzer({ imageUrl, onAnalysisComplete, onClose }: ImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'dress' | 'florals' | 'venue' | 'overall'>('overall');

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const mockAnalysis: ImageAnalysisResult = {
        id: Date.now().toString(),
        imageUrl,
        analysis: {
          weddingDress: {
            silhouette: 'A-Line',
            neckline: 'Sweetheart with Off-Shoulder Sleeves',
            fabric: 'Tulle with Lace Appliqué',
            embellishments: ['Delicate Lace', 'Pearl Beading', 'Floral Appliqué'],
            styleCategory: 'Classic Romantic',
            confidence: 0.92
          },
          florals: {
            mainFlowers: ['Garden Roses', 'Peonies', 'Eucalyptus'],
            colorPalette: ['Blush Pink', 'Ivory', 'Sage Green', 'Dusty Rose'],
            arrangementStyle: 'Organic Garden Style',
            season: 'Spring/Summer',
            greenery: ['Eucalyptus', 'Olive Branches', 'Dusty Miller'],
            confidence: 0.88
          },
          venue: {
            settingType: 'Outdoor Garden',
            architecturalStyle: 'Natural Landscape',
            keyFeatures: ['Mature Trees', 'Natural Lighting', 'Grass Lawn', 'Romantic Ambiance'],
            lighting: 'Soft Natural Light with Golden Hour Glow',
            searchTerms: ['garden wedding venue', 'outdoor ceremony', 'natural setting', 'tree canopy'],
            confidence: 0.85
          },
          overallStyle: {
            aesthetic: 'Classic Garden Romance',
            keywords: ['Timeless', 'Elegant', 'Natural', 'Romantic', 'Soft', 'Dreamy'],
            colorScheme: ['Blush Pink', 'Ivory', 'Sage Green', 'Gold Accents'],
            mood: 'Romantic and Ethereal',
            trends: ['Garden Party Elegance', 'Organic Luxury', 'Soft Romanticism']
          }
        },
        timestamp: new Date()
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      onAnalysisComplete(mockAnalysis);
    }, 3000);
  };

  React.useEffect(() => {
    analyzeImage();
  }, [imageUrl]);

  const downloadAnalysis = () => {
    if (!analysisResult) return;
    
    const analysisText = `
Wedding Style Analysis Report
Generated: ${analysisResult.timestamp.toLocaleDateString()}

OVERALL STYLE ASSESSMENT
Aesthetic: ${analysisResult.analysis.overallStyle.aesthetic}
Mood: ${analysisResult.analysis.overallStyle.mood}
Keywords: ${analysisResult.analysis.overallStyle.keywords.join(', ')}
Color Scheme: ${analysisResult.analysis.overallStyle.colorScheme.join(', ')}
Current Trends: ${analysisResult.analysis.overallStyle.trends.join(', ')}

${analysisResult.analysis.weddingDress ? `
WEDDING DRESS DETAILS
Silhouette: ${analysisResult.analysis.weddingDress.silhouette}
Neckline: ${analysisResult.analysis.weddingDress.neckline}
Fabric: ${analysisResult.analysis.weddingDress.fabric}
Style Category: ${analysisResult.analysis.weddingDress.styleCategory}
Embellishments: ${analysisResult.analysis.weddingDress.embellishments.join(', ')}
Confidence Score: ${(analysisResult.analysis.weddingDress.confidence * 100).toFixed(0)}%
` : ''}

${analysisResult.analysis.florals ? `
FLORAL ELEMENTS
Main Flowers: ${analysisResult.analysis.florals.mainFlowers.join(', ')}
Color Palette: ${analysisResult.analysis.florals.colorPalette.join(', ')}
Arrangement Style: ${analysisResult.analysis.florals.arrangementStyle}
Season Indicators: ${analysisResult.analysis.florals.season}
Greenery & Fillers: ${analysisResult.analysis.florals.greenery.join(', ')}
Confidence Score: ${(analysisResult.analysis.florals.confidence * 100).toFixed(0)}%
` : ''}

${analysisResult.analysis.venue ? `
VENUE CHARACTERISTICS
Setting Type: ${analysisResult.analysis.venue.settingType}
Architectural Style: ${analysisResult.analysis.venue.architecturalStyle}
Key Features: ${analysisResult.analysis.venue.keyFeatures.join(', ')}
Lighting: ${analysisResult.analysis.venue.lighting}
Search Terms: ${analysisResult.analysis.venue.searchTerms.join(', ')}
Confidence Score: ${(analysisResult.analysis.venue.confidence * 100).toFixed(0)}%
` : ''}
    `;
    
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-style-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Image Preview */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Wedding inspiration"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Analysis Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Sparkles className="h-6 w-6 mr-2" />
                AI Style Analysis
              </h3>
              <p className="text-primary-100 text-sm">Comprehensive wedding style breakdown</p>
            </div>
            <div className="flex items-center space-x-2">
              {analysisResult && (
                <>
                  <button
                    onClick={downloadAnalysis}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Download Analysis"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Share Analysis"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="flex-1 overflow-y-auto">
            {isAnalyzing ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Your Image</h4>
                <p className="text-gray-600 mb-4">Our AI is examining style elements, colors, and design details...</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Identifying dress silhouette and fabric details</p>
                  <p>• Analyzing floral arrangements and color palette</p>
                  <p>• Assessing venue characteristics and lighting</p>
                  <p>• Determining overall aesthetic and style trends</p>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="p-6">
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'overall', label: 'Overall', icon: Eye },
                    { key: 'dress', label: 'Dress', icon: Star },
                    { key: 'florals', label: 'Florals', icon: Flower },
                    { key: 'venue', label: 'Venue', icon: MapPin }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                        activeTab === key
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overall' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Style Assessment</h4>
                      <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-lg p-4">
                        <h5 className="font-semibold text-primary-700 text-xl mb-2">
                          {analysisResult.analysis.overallStyle.aesthetic}
                        </h5>
                        <p className="text-gray-600 mb-3">{analysisResult.analysis.overallStyle.mood}</p>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.analysis.overallStyle.keywords.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Color Scheme
                      </h5>
                      <div className="flex space-x-3">
                        {analysisResult.analysis.overallStyle.colorScheme.map((color, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="w-12 h-12 rounded-full border-2 border-white shadow-md mb-2"
                              style={{ backgroundColor: getColorHex(color) }}
                            ></div>
                            <span className="text-xs text-gray-600">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Current Trends</h5>
                      <div className="space-y-2">
                        {analysisResult.analysis.overallStyle.trends.map((trend, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-primary-500" />
                            <span className="text-gray-700">{trend}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'dress' && analysisResult.analysis.weddingDress && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">Wedding Dress Analysis</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(analysisResult.analysis.weddingDress.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Silhouette</h5>
                        <p className="text-gray-800 font-semibold">{analysisResult.analysis.weddingDress.silhouette}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Style Category</h5>
                        <p className="text-gray-800 font-semibold">{analysisResult.analysis.weddingDress.styleCategory}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Neckline Details</h5>
                      <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{analysisResult.analysis.weddingDress.neckline}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Fabric & Texture</h5>
                      <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{analysisResult.analysis.weddingDress.fabric}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Embellishments</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.weddingDress.embellishments.map((embellishment, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                            {embellishment}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'florals' && analysisResult.analysis.florals && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">Floral Analysis</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(analysisResult.analysis.florals.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Arrangement Style</h5>
                        <p className="text-gray-800 font-semibold">{analysisResult.analysis.florals.arrangementStyle}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Season</h5>
                        <p className="text-gray-800 font-semibold flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {analysisResult.analysis.florals.season}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Main Flower Types</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.florals.mainFlowers.map((flower, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            {flower}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Color Palette</h5>
                      <div className="flex space-x-3">
                        {analysisResult.analysis.florals.colorPalette.map((color, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md mb-2"
                              style={{ backgroundColor: getColorHex(color) }}
                            ></div>
                            <span className="text-xs text-gray-600">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Greenery & Fillers</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.florals.greenery.map((green, index) => (
                          <span key={index} className="px-3 py-1 bg-sage-100 text-sage-700 text-sm rounded-full">
                            {green}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'venue' && analysisResult.analysis.venue && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">Venue Analysis</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {(analysisResult.analysis.venue.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Setting Type</h5>
                        <p className="text-gray-800 font-semibold">{analysisResult.analysis.venue.settingType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">Architectural Style</h5>
                        <p className="text-gray-800 font-semibold">{analysisResult.analysis.venue.architecturalStyle}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Lighting Conditions</h5>
                      <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{analysisResult.analysis.venue.lighting}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Key Features</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {analysisResult.analysis.venue.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <MapPin className="h-4 w-4 text-primary-500" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Recommended Search Terms</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.venue.searchTerms.map((term, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            "{term}"
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert color names to hex values
function getColorHex(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    'Blush Pink': '#F8BBD9',
    'Ivory': '#FFFFF0',
    'Sage Green': '#9CAF88',
    'Dusty Rose': '#DCAE96',
    'Gold Accents': '#D4AF37',
    'Champagne': '#F7E7CE',
    'Lavender': '#E6E6FA',
    'Coral': '#FF7F50',
    'Navy Blue': '#000080',
    'Burgundy': '#800020',
    'Emerald': '#50C878',
    'Rose Gold': '#E8B4B8'
  };
  
  return colorMap[colorName] || '#9CA3AF';
}