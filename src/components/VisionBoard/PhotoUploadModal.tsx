import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Instagram, Facebook, Folder, Edit3, Trash2, RotateCcw, Crop, Sliders, Filter, Download, Plus, Search, Grid, List, Heart, Tag, Sparkles } from 'lucide-react';
import ImageAnalyzer from './ImageAnalyzer';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUploaded: (photos: UploadedPhoto[]) => void;
  existingPhotos?: UploadedPhoto[];
}

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
  analysis?: any;
  edits?: {
    brightness: number;
    contrast: number;
    saturation: number;
    filter: string;
    crop?: { x: number; y: number; width: number; height: number };
  };
}

export default function PhotoUploadModal({ isOpen, onClose, onPhotosUploaded, existingPhotos = [] }: PhotoUploadModalProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(existingPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'organize' | 'edit' | 'analyze'>('upload');
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSocialConnect, setShowSocialConnect] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'facebook' | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState<UploadedPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/heic'];
  const PHOTO_CATEGORIES = ['Wedding Dress', 'Venue', 'Flowers', 'Decorations', 'Colors', 'Cake', 'Invitations', 'Inspiration'];
  const FILTERS = ['None', 'Vintage', 'Bright', 'Warm', 'Cool', 'Dramatic', 'Soft', 'Black & White'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        alert(`${file.name} is not a supported format. Please use JPG, PNG, or HEIC.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newPhotos: UploadedPhoto[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      
      // Simulate upload and optimization
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const optimizedUrl = await optimizeImage(file);
      const thumbnailUrl = await generateThumbnail(file);
      
      const newPhoto: UploadedPhoto = {
        id: Date.now().toString() + i,
        url: optimizedUrl,
        thumbnail: thumbnailUrl,
        filename: file.name,
        size: file.size,
        category: 'Inspiration',
        tags: [],
        isFavorite: false,
        uploadDate: new Date(),
        source: 'device',
        edits: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          filter: 'None'
        }
      };

      newPhotos.push(newPhoto);
      setUploadProgress(((i + 1) / validFiles.length) * 100);
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const optimizeImage = async (file: File): Promise<string> => {
    // In a real app, this would compress and optimize the image
    return URL.createObjectURL(file);
  };

  const generateThumbnail = async (file: File): Promise<string> => {
    // In a real app, this would generate a smaller thumbnail
    return URL.createObjectURL(file);
  };

  const handleSocialImport = async (platform: 'instagram' | 'facebook') => {
    setSocialPlatform(platform);
    setShowSocialConnect(true);
    
    // Simulate social media connection
    setTimeout(() => {
      const mockSocialPhotos: UploadedPhoto[] = [
        {
          id: `${platform}-1`,
          url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
          thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
          filename: `${platform}_wedding_inspiration_1.jpg`,
          size: 2048000,
          category: 'Inspiration',
          tags: ['wedding', 'inspiration'],
          isFavorite: false,
          uploadDate: new Date(),
          source: platform,
          edits: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            filter: 'None'
          }
        }
      ];
      
      setPhotos(prev => [...prev, ...mockSocialPhotos]);
      setShowSocialConnect(false);
      setSocialPlatform(null);
    }, 2000);
  };

  const updatePhotoEdits = (photoId: string, edits: Partial<UploadedPhoto['edits']>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, edits: { ...photo.edits, ...edits } }
        : photo
    ));
  };

  const deletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      setSelectedPhoto(null);
    }
  };

  const toggleFavorite = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, isFavorite: !photo.isFavorite } : photo
    ));
  };

  const updatePhotoCategory = (photoId: string, category: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, category } : photo
    ));
  };

  const analyzePhoto = (photo: UploadedPhoto) => {
    setAnalyzingPhoto(photo);
    setShowAnalyzer(true);
  };

  const handleAnalysisComplete = (analysis: any) => {
    if (analyzingPhoto) {
      setPhotos(prev => prev.map(photo => 
        photo.id === analyzingPhoto.id ? { ...photo, analysis } : photo
      ));
    }
    setShowAnalyzer(false);
    setAnalyzingPhoto(null);
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Photo Upload & Management</h3>
            <p className="text-primary-100 text-sm">{photos.length} photos uploaded</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPhotosUploaded(photos)}
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-white font-medium"
            >
              Add to Vision Board
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white">
          <div className="flex space-x-8 px-6">
            {[
              { key: 'upload', label: 'Upload Photos', icon: Upload },
              { key: 'organize', label: 'Organize', icon: Folder },
              { key: 'edit', label: 'Edit Photos', icon: Edit3 },
              { key: 'analyze', label: 'AI Analysis', icon: Sparkles }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="p-6 space-y-6">
              {/* Upload Methods */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Device Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Upload from Device</h4>
                  <p className="text-gray-600 mb-4">Drag & drop or click to browse</p>
                  <p className="text-xs text-gray-500">JPG, PNG, HEIC up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.heic"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                  />
                </div>

                {/* Instagram Import */}
                <div
                  className="border-2 border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => handleSocialImport('instagram')}
                >
                  <Instagram className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Import from Instagram</h4>
                  <p className="text-gray-600 mb-4">Connect your account</p>
                  <p className="text-xs text-gray-500">Import your saved posts</p>
                </div>

                {/* Facebook Import */}
                <div
                  className="border-2 border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => handleSocialImport('facebook')}
                >
                  <Facebook className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Import from Facebook</h4>
                  <p className="text-gray-600 mb-4">Connect your account</p>
                  <p className="text-xs text-gray-500">Import your saved photos</p>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading photos...</span>
                    <span className="text-sm text-gray-500">{uploadProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Recent Uploads */}
              {photos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Uploads</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {photos.slice(-8).map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.thumbnail}
                          alt={photo.filename}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => analyzePhoto(photo)}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                            title="AI Analysis"
                          >
                            <Sparkles className="h-3 w-3 text-purple-600" />
                          </button>
                          <button
                            onClick={() => setSelectedPhoto(photo)}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Edit3 className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        {photo.analysis && (
                          <div className="absolute bottom-2 left-2">
                            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                              <Sparkles className="h-2 w-2 mr-1" />
                              Analyzed
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'organize' && (
            <div className="p-6 space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {PHOTO_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Photo Grid */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <img
                          src={photo.thumbnail}
                          alt={photo.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <button
                            onClick={() => analyzePhoto(photo)}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                            title="AI Analysis"
                          >
                            <Sparkles className="h-3 w-3 text-purple-600" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(photo.id)}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className={`h-3 w-3 ${photo.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                          </button>
                          <button
                            onClick={() => setSelectedPhoto(photo)}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Edit3 className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded">
                            {photo.source}
                          </span>
                          {photo.analysis && (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded flex items-center">
                              <Sparkles className="h-2 w-2 mr-1" />
                              AI
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-800 truncate">{photo.filename}</p>
                        <div className="flex items-center justify-between mt-2">
                          <select
                            value={photo.category}
                            onChange={(e) => updatePhotoCategory(photo.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                          >
                            {PHOTO_CATEGORIES.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                          <span className="text-xs text-gray-500">{formatFileSize(photo.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <img
                        src={photo.thumbnail}
                        alt={photo.filename}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{photo.filename}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(photo.size)} • {photo.uploadDate.toLocaleDateString()}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <select
                            value={photo.category}
                            onChange={(e) => updatePhotoCategory(photo.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                          >
                            {PHOTO_CATEGORIES.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {photo.source}
                          </span>
                          {photo.analysis && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded flex items-center">
                              <Sparkles className="h-2 w-2 mr-1" />
                              Analyzed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => analyzePhoto(photo)}
                          className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                          title="AI Analysis"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(photo.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${photo.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'edit' && selectedPhoto && (
            <PhotoEditor
              photo={selectedPhoto}
              onUpdate={(edits) => updatePhotoEdits(selectedPhoto.id, edits)}
              onClose={() => setSelectedPhoto(null)}
              onDelete={() => deletePhoto(selectedPhoto.id)}
            />
          )}

          {activeTab === 'edit' && !selectedPhoto && (
            <div className="p-12 text-center">
              <Edit3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Photo to Edit</h3>
              <p className="text-gray-500">Choose a photo from the organize tab to start editing</p>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Style Analysis</h4>
                <p className="text-gray-600">Get detailed insights about wedding style elements in your photos</p>
              </div>

              {photos.filter(p => p.analysis).length > 0 ? (
                <div className="space-y-6">
                  <h5 className="font-medium text-gray-700">Analyzed Photos</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.filter(p => p.analysis).map((photo) => (
                      <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                           onClick={() => analyzePhoto(photo)}>
                        <img
                          src={photo.thumbnail}
                          alt={photo.filename}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 truncate">{photo.filename}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              {photo.analysis?.analysis?.overallStyle?.aesthetic || 'Analyzed'}
                            </span>
                            <Sparkles className="h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analyzed Photos Yet</h3>
                  <p className="text-gray-500 mb-6">Upload photos and use the AI analysis feature to get detailed style insights</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Upload Photos to Analyze
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Connect Modal */}
        {showSocialConnect && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Connecting to {socialPlatform === 'instagram' ? 'Instagram' : 'Facebook'}
                </h4>
                <p className="text-gray-600">Please authorize access to import your photos...</p>
              </div>
            </div>
          </div>
        )}

        {/* Image Analyzer Modal */}
        {showAnalyzer && analyzingPhoto && (
          <ImageAnalyzer
            imageUrl={analyzingPhoto.url}
            onAnalysisComplete={handleAnalysisComplete}
            onClose={() => {
              setShowAnalyzer(false);
              setAnalyzingPhoto(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Photo Editor Component (unchanged from previous implementation)
interface PhotoEditorProps {
  photo: UploadedPhoto;
  onUpdate: (edits: Partial<UploadedPhoto['edits']>) => void;
  onClose: () => void;
  onDelete: () => void;
}

function PhotoEditor({ photo, onUpdate, onClose, onDelete }: PhotoEditorProps) {
  const [edits, setEdits] = useState(photo.edits || {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    filter: 'None'
  });

  const handleEditChange = (key: string, value: number | string) => {
    const newEdits = { ...edits, [key]: value };
    setEdits(newEdits);
    onUpdate(newEdits);
  };

  const resetEdits = () => {
    const resetEdits = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      filter: 'None'
    };
    setEdits(resetEdits);
    onUpdate(resetEdits);
  };

  const FILTERS = ['None', 'Vintage', 'Bright', 'Warm', 'Cool', 'Dramatic', 'Soft', 'Black & White'];

  return (
    <div className="p-6 h-full flex">
      {/* Image Preview */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mr-6">
        <img
          src={photo.url}
          alt={photo.filename}
          className="max-w-full max-h-full object-contain rounded-lg"
          style={{
            filter: `brightness(${100 + edits.brightness}%) contrast(${100 + edits.contrast}%) saturate(${100 + edits.saturation}%)`
          }}
        />
      </div>

      {/* Edit Controls */}
      <div className="w-80 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Edit Photo</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetEdits}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset edits"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Basic Adjustments */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-700 flex items-center">
            <Sliders className="h-4 w-4 mr-2" />
            Adjustments
          </h5>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Brightness: {edits.brightness}%
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={edits.brightness}
              onChange={(e) => handleEditChange('brightness', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Contrast: {edits.contrast}%
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={edits.contrast}
              onChange={(e) => handleEditChange('contrast', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Saturation: {edits.saturation}%
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={edits.saturation}
              onChange={(e) => handleEditChange('saturation', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-700 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => handleEditChange('filter', filter)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  edits.filter === filter
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Info */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Filename:</strong> {photo.filename}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Size:</strong> {(photo.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm text-gray-600">
            <strong>Source:</strong> {photo.source}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Category:</strong> {photo.category}
          </p>
        </div>
      </div>
    </div>
  );
}